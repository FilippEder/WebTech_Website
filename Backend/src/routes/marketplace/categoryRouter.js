const express = require('express');
const router = express.Router();
const RetailCategory = require('../../models/marketplace/RetailCategory');
const { CategoryAttribute,Attribute } = require('../../models/marketplace');


// Alle Oberkategorien (parentId == null)
router.get('/', async (req, res) => {
  try {
    const categories = await RetailCategory.findAll({
      where: { parentId: null },
      include: [
        {
          model: CategoryAttribute,
          as: 'categoryAttributes',
          include: [{ model: Attribute, as: 'categoryAttribute' }]
        }
      ]
    });
    res.json(categories);
  } catch (error) {
      console.error('Fehler beim Laden der Kategorien:', error); // <- genau das hilft dir
      res.status(500).json({ error: 'Fehler beim Laden der Kategorien.' });
  }
});

// Unterkategorien einer Oberkategorie abrufen
router.get('/:parentId/subcategories', async (req, res) => {
  try {
    const subcategories = await RetailCategory.findAll({
      where: { parentId: req.params.parentId },
      include: [
        {
          model: CategoryAttribute,
          as: 'categoryAttributes',
          include: [{ model: Attribute, as: 'categoryAttribute' }]
        }
      ]
    });
    res.json(subcategories);
  } catch (error) {
    console.error('Fehler beim Laden der Kategorien:', error); // <- genau das hilft dir
    res.status(500).json({ error: 'Fehler beim Laden der Kategorien.' });
  }
});

module.exports = router;
