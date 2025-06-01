const {DataTypes} = require('sequelize')
const sequelize = require('../../config/database/sequelize')

const Vehicle= sequelize.define('vehicles',{
    vehicle_id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    user_id:{
        type:DataTypes.INTEGER,
    },
    vehicle_category_id:{
        type:DataTypes.INTEGER,
    },
    mark_id:{
        type:DataTypes.INTEGER,
    },
    model_id:{
        type:DataTypes.INTEGER,
    },
    type_id:{
        type:DataTypes.INTEGER,
    },
    name:{
        type:DataTypes.STRING,
    },
    description:{
        type:DataTypes.STRING,
    },
    price:{
        type:DataTypes.NUMBER,
    },
    first_registration:{
        type:DataTypes.DATEONLY,
    },
    mileage:{
        type:DataTypes.INTEGER,
    },
    fuel_type:{
        type:DataTypes.STRING,
    },
    color:{
        type:DataTypes.STRING,
    },
    condition:{
        type:DataTypes.STRING,
    },
    status:{
        type:DataTypes.STRING,
    }
},{
    timestamps:true
})

module.exports = Vehicle