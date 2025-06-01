const {DataTypes} = require('sequelize')
const sequelize = require('../../config/database/sequelize')

const Picture = sequelize.define('vehicle_pictures',{
    picture_id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    vehicle_id:{
        type:DataTypes.INTEGER,
    },
    picture_url:{
        type:DataTypes.STRING
    }
},{
    timestamps:false
})

module.exports = Picture