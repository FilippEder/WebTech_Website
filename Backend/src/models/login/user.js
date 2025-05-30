const {DataTypes} = require('sequelize')
const sequelize = require('../../config/database/sequelize')

const User= sequelize.define('users',{
    user_id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    email:{
        type:DataTypes.STRING
    },
    password_hash:{
        type:DataTypes.STRING
    },
    address:{
        type:DataTypes.STRING
    }
},{
    timestamps:false
})

module.exports = User