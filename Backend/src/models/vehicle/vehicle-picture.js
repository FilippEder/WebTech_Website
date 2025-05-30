const {DataTypes} = require('sequelize')
const sequelize = require('../../config/database/sequelize')
const Vehicle = require('./vehicle')

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

Vehicle.hasMany(Picture, {foreignKey: 'vehicle_id', onDelete: 'CASCADE'});
Picture.belongsTo(Vehicle, {foreignKey: 'vehicle_id'})

module.exports = Picture