/**
 * @file Attribute.js
 * @brief Defines the model for attributes.
 */

const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database/sequelize');

const Attribute = sequelize.define('Attribute', {
    attributeId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        field: 'attribute_id'
    },
    attributeName: {
        type: DataTypes.STRING(100),
        field: 'attribute_name'
    },
    attributeUnit: {
        type: DataTypes.STRING(50),
        field: 'attribute_unit'
    }
}, {
    tableName: 'attributes',
    timestamps: false
});

module.exports = Attribute;