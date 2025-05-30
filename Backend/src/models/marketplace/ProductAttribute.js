/**
 * @file ProductAttribute.js
 * @brief Defines the model for product attributes.
 */

const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database/sequelize');

const ProductAttribute = sequelize.define('ProductAttribute', {
    productId: {
      type: DataTypes.INTEGER,
      allowNull: true, // Sequelize setzt das intern automatisch bei include
      field: 'product_id'
    },
    attributeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'attribute_id',
      primaryKey: true
    },
    attributeValue: {
      type: DataTypes.DECIMAL,
      allowNull: true,
      field: 'attribute_value'
    }
  }, {
    tableName: 'product_attributes',
    timestamps: false
  });
  

module.exports = ProductAttribute;