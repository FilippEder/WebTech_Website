const {DataTypes} = require('sequelize')
const sequelize = require('../../config/database/sequelize')

const Type = sequelize.define('vehicle_types',{
    type_id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    vehicle_category_id:{
        type:DataTypes.INTEGER,
    },
    name:{
        type:DataTypes.STRING
    }
},{
    timestamps:false
})

module.exports = Type