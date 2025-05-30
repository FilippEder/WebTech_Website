/**
 * @file CategoryAttribute.js
 * @brief Defines the model for category attributes.
 */

const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database/sequelize');



const CategoryAttribute = sequelize.define('CategoryAttribute', {
    attributeId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        field: 'attribute_id'
    },
    categoryId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        field: 'category_id'
    }
}, {
    tableName: 'category_attributes',
    timestamps: false
});
/*

CategoryAttribute.belongsTo(RetailCategory, {
  foreignKey: 'category_id',
  as: 'category'
});

CategoryAttribute.belongsTo(Attribute, {
    foreignKey: 'attribute_id',
    as: 'attribute'
  });
  

*/
module.exports = CategoryAttribute;