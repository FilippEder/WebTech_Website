const express = require("express");
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { Product, ProductPicture, ProductAttribute, Attribute } = require("../../models/marketplace/model-index");
const checkAuth = require('../login/middleware/checkAuthentication');

router.use(checkAuth);

// ----- Multer-Konfiguration für den Bildupload -----
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, '/home/matthiase/WebTechProject/Backend/Backend/uploads/products'),
  filename: (req, file, cb) => cb(null, `${Date.now()}_${file.originalname}`)
});
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (!['.png', '.jpg', '.jpeg'].includes(ext)) {
      return cb(new Error('Only images are allowed'), false);
    }
    cb(null, true);
  }
});

const { Op } = require('sequelize');

router.get('/', async (req, res) => {
  try {
    console.log(req.query);
    const whereClause = {};

    if (req.query.price_min || req.query.price_max) {
      whereClause.price = {};
      if (req.query.price_min) {
        // Umwandeln in Zahl und den richtigen Operator verwenden
        whereClause.price[Op.gte] = Number(req.query.price_min);
      }
      if (req.query.price_max) {
        whereClause.price[Op.lte] = Number(req.query.price_max);
      }
    }

    if (req.query.category_id) {
      whereClause.categoryId = req.query.category_id;
    }

    // In-Memory-Attributfilter (unabhängig vom Where-Objekt)
    let filteredProducts = await Product.findAll({
      where: whereClause,
      include: [
        {model: ProductPicture, as: 'pictures'},
        {
          model: ProductAttribute,
          as: 'productAttributes',
          include: [{model: Attribute, as: 'attribute'}]
        }
      ]
    });
    Object.keys(req.query).forEach(key => {
      if (key.startsWith('attribute_')) {
        const attributeId = key.replace('attribute_', '');
        const [min, max] = req.query[key].split('-').map(Number);
        filteredProducts = filteredProducts.filter(product => {
          const pa = product.productAttributes.find(pa =>
            pa.attribute?.attributeId === parseInt(attributeId)
          );
          return pa?.attributeValue >= min && pa?.attributeValue <= max;
        });
      }
    });

    res.json(filteredProducts);
  } catch (error) {
    console.error('Fehler beim Laden der Produkte:', error);
    res.status(500).json({ error: 'Error with loading products.' });
  }
});


// POST /api/product – Produkt erstellen
// Hinweis: Multer verarbeitet den multipart/form-data-Request, sodass Textfelder in req.body vorhanden sind.
router.post('/', upload.array('pictures'), async (req, res) => {
  let productData;
  try {
    // Das Feld "product" enthält den JSON-String, den wir parsen
    productData = JSON.parse(req.body.product);
  } catch (err) {
    return res.status(400).json({ error: "Ungültiges JSON im Feld 'product'" });
  }

  const userId = req.user_id;
  const t = await Product.sequelize.transaction();
  try {
    const newProduct = await Product.create({
      userId: userId,
      categoryId: productData.categoryId,  // Achte hier auf konsistente Feldnamen!
      name: productData.name,
      description: productData.description,
      price: productData.price,
      delivery_method: productData.delivery_method,
      condition: productData.condition,
      status: productData.status,
      createdAt: Date.now(),
      updatedAt: null
    }, { transaction: t });

    // Falls Produktattribute vorhanden sind, diese verarbeiten
    if (Array.isArray(productData.productAttributes) && productData.productAttributes.length) {
      const entries = productData.productAttributes.map(attr => ({
        productId: newProduct.productId,
        attributeId: attr.attributeId,
        attributeValue: attr.attributeValue
      }));
      await ProductAttribute.bulkCreate(entries, { transaction: t });
    }

    // Optional: Falls Bilder hochgeladen wurden, können diese verarbeitet und gespeichert werden
    if (req.files && req.files.length > 0) {
      // Beispiel: Für jedes hochgeladene Bild einen Eintrag in der Tabelle ProductPicture anlegen
      // Hier könntest du ProductPicture.bulkCreate(pictures, { transaction: t }) verwenden
    }

    await t.commit();
    res.status(201).json(newProduct);
  } catch (error) {
    await t.rollback();
    console.error('Fehler beim Erstellen:', error);
    res.status(500).json({ error: 'Error with creating product.', details: error.message });
  }
});

// ----- IV: PUT /api/product/:id -----
router.put('/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found.' });

    await product.update({
      userId: req.body.user_id,
      categoryId: req.body.category_id,
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      delivery_method: req.body.delivery_method,
      condition: req.body.condition,
      status: req.body.status,
      createdAt: req.body.createdAt,
      updatedAt: Date.now()
    });

    res.status(201).json(product);
  } catch (error) {
    console.error('Fehler beim Aktualisieren:', error);
    res.status(500).json({ error: 'Error with updating product.' });
  }
});

// ----- V: DELETE /api/product/:id -----
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ error: 'Not a product.' });

    await product.destroy();
    res.json({ message: 'Product deleted successfully.' });
  } catch (error) {
    console.error('Fehler beim Löschen:', error);
    res.status(500).json({ error: 'Error with deleting product.' });
  }
});

// ----- VI: POST /api/product/:id/pictures -----
router.post('/:id/pictures', upload.single('picture'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded.' });

    const newPicture = await ProductPicture.create({
      productId: req.params.id,
      pictureURL: `/home/matthiase/WebTechProject/Backend/Backend/uploads/products/${req.file.filename}`
    });

    res.status(201).json(newPicture);
  } catch (error) {
    console.error('Fehler beim Hochladen des Bildes:', error);
    res.status(500).json({ error: 'Error uploading picture.' });
  }
});

module.exports = router;
