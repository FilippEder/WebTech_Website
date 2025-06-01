/**
 * @file model-index.js
 * @brief Loads all Retail marketplace real-estate-section-models and defines their associations.
 */

const Product = require('./Product');
const ProductAttribute = require('./ProductAttribute');
const ProductPicture = require('./ProductPicture');
const RetailCategory = require('./RetailCategory');
const Attribute = require('./Attribute');
const CategoryAttribute = require('./CategoryAttribute');

/*
  Associations:
  - RetailCategory.hasMany(Product, { as: 'products' })
  - Product.belongsTo(RetailCategory, { as: 'category' })
  - ProductPicture.belongsTo(Product, { as: 'product' })
  - Product.hasMany(ProductPicture, { as: 'pictures' })
  - Product.hasMany(ProductAttribute, { as: 'productAttributes' })
  - RetailCategory.hasMany(CategoryAttribute, { as: 'categoryAttributes'})
  - Attribute.hasMany(ProductAttribute, { as: 'attributeProducts' })
  - AttributeCategory.hasMany(CategoryAttribute, { as: 'attributesCategories'})
*/


//Product -> RetailCategory
Product.belongsTo(RetailCategory,{
    foreignKey: 'category_id',
    as : 'category'
});
RetailCategory.hasMany(Product, {
    foreignKey: 'category_id',
    as: 'products'
})

//ProductPicture -> Product
ProductPicture.belongsTo(Product, {
    foreignKey: 'product_id',
    as: 'product',
    onDelete: 'CASCADE'
});

Product.hasMany(ProductPicture, {
    foreignKey: 'product_id',
    as: 'pictures'
});

//ProductAttribute -> Product
ProductAttribute.belongsTo(Product, {
    foreignKey: 'product_id',
    as: 'product',
    onDelete: 'CASCADE'
});

Product.hasMany(ProductAttribute, {
    foreignKey: 'product_id',
    as: 'productAttributes',
    //onDelete: 'CASCADE'
});

// ProductAttribute -> Attribute
ProductAttribute.belongsTo(Attribute, {
    foreignKey: 'attribute_id',
    as: 'attribute',
    onDelete: 'CASCADE'
});

Attribute.hasMany(ProductAttribute, {
    foreignKey: 'attribute_id',
    as: 'attributeProducts'
});

// CategoryAttribute -> RetailCategory
CategoryAttribute.belongsTo(RetailCategory, {
    foreignKey: 'category_id',
    as: 'retailCategory',
    //onDelete: 'CASCADE'
});
RetailCategory.hasMany(CategoryAttribute, {
    foreignKey: 'category_id',
    as: 'categoryAttributes'
});

// CategoryAttribute -> Attribute
CategoryAttribute.belongsTo(Attribute, {
    foreignKey: 'attribute_id',
    as: 'categoryAttribute',
    onDelete: 'CASCADE'
});
Attribute.hasMany(CategoryAttribute, {
    foreignKey: 'attribute_id',
    as: 'attributesCategories'
});

module.exports ={
    Product,
    Attribute,
    ProductAttribute,
    ProductPicture,
    RetailCategory,
    CategoryAttribute
}