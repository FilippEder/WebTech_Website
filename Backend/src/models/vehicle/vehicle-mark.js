const {DataTypes} = require('sequelize')
const sequelize = require('../../config/database/sequelize')

const Mark = sequelize.define('vehicle_marks',{
    mark_id:{
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

module.exports = Mark