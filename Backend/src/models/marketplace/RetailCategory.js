/**
 * @file RetailCategory.js
 * @brief Defines the RetailCategory model (e.g., Electronics, Fahrräder).
 */

const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database/sequelize'); // Verbindung importieren

const RetailCategory = sequelize.define('RetailCategory', {
    categoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        field: 'category_id'
    },
    categoryName: {
        type: DataTypes.STRING(100),
        unique: true,
        allowNull: false,
        validate: {
            notEmpty: true
        },
        field: 'name'
    },
    parentId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
        field: 'parent_id' 
    }
}, {
    tableName: 'retail_categories',
    timestamps: false
})

//Self references for parent and kid categories

//Parent has many Kid-Categories
RetailCategory.hasMany(RetailCategory, {
    foreignKey: 'parent_id',
    as: 'subcategories'
});

//Kid has one Parent-Category
RetailCategory.belongsTo(RetailCategory, {
    foreignKey: 'parent_id',
    as: 'parentCategory'
});

const CategoryAttribute = require('./CategoryAttribute'); // nicht vergessen!
const Attribute = require('./Attribute');




module.exports = RetailCategory;