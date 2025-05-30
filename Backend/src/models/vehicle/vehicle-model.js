const {DataTypes} = require('sequelize')
const sequelize = require('../../config/database/sequelize')

const Model = sequelize.define('vehicle_models',{
    model_id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    mark_id:{
        type:DataTypes.INTEGER,
    },
    name:{
        type:DataTypes.STRING
    }
},{
    timestamps:false
})

module.exports = Model