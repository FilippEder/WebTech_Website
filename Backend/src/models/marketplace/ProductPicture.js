/**
 * @file ProductPicture.js
 * @brief Defines the product pictures.
 */

const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database/sequelize');

const ProductPicture = sequelize.define('ProductPicture', {
    pictureID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: 'picture_id'
    },
    productId: {
        type: DataTypes.INTEGER,
        field: 'product_id'
    },
    pictureURL: {
        type: DataTypes.STRING(500),
        allowNull: false,
        field: 'picture_url'
    }
}, {
    tableName: 'product_pictures',
    timestamps: false
})

module.exports = ProductPicture;