const { VehicleMark,VehicleModel, VehicleType} = require('../models/vehicle')
const { RetailCategory} = require('../models/marketplace')
const {vehicleMarkData, vehicleModelData,
    vehicleTypeDate} = require('../models/seeders/vehicleData');
const { retailCategoryData} = require('../models/seeders/retailData')




module.exports = async function runSeed(){
    for(const i of vehicleMarkData){
        await VehicleMark.findOrCreate({
            where:{
                mark_id: i.mark_id,
                vehicle_category_id: i.vehicle_category_id,
                name: i.name
            }
        })
    }
    for(const i of vehicleModelData){
        await VehicleModel.findOrCreate({
            where:{
                model_id: i.model_id,
                mark_id: i.mark_id,
                name: i.name
            }
        })
    }
    for(const i of vehicleTypeDate){
        await VehicleType.findOrCreate({
            where:{
                type_id: i.type_id,
                vehicle_category_id: i.vehicle_category_id,
                name: i.name
            }
        })
    }
    for(const i of retailCategoryData){
        await RetailCategory.findOrCreate({
            where:{
                categoryId: i.categoryId,
                categoryName: i.categoryName,
                parentId: i.parentId
            }
        })
    }

}