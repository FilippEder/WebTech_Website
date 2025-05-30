/**
 * @file Product.js
 * @brief Defines the Product model for retail marketplace products.
 */

const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database/sequelize');

const Product = sequelize.define('Product', {
    productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        field: 'product_id'
      },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'user_id'
    },
    categoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'category_id'
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    delivery_method: {
        type: DataTypes.STRING(50),
        allowNull: true,
        validate: {
            isIn:[['Self-Pickup', 'Postal Delivery', 'Both']]
        }
    },
    condition: {
        type: DataTypes.STRING(50),
        allowNull: true,
        validate: {
            isIn: [['New', 'Used', 'Broken']]
        }
    },
    status: {
        type: DataTypes.STRING(50),
        allowNull: true,
        validate: {
            isIn: [['Open', 'Sold']]
        }
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: true,
        //defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        field: 'createdat'
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        //defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        field: 'updatedat'
    }
}, {
    tableName: 'products',
    //timestamps: true,
    underscored: false
})

module.exports = Product;