const {VehiclePicture} = require('../models/vehicle')
const {existsSync, unlinkSync} = require("node:fs");



async function storeVehiclePictureUrl(vehicle_id, files){
    try{
        let images = files.map(image => ({
            vehicle_id: vehicle_id,
            picture_url: image.path
        }))

        await VehiclePicture.bulkCreate(images);
    } catch (error){
        console.error('Error saving images', error)
    }
}

function deleteVehiclePictureFromDisk(pictureUrl){
    if(existsSync(pictureUrl)){
        unlinkSync(pictureUrl)
    }
}

module.exports = {createVehicleEntry: storeVehiclePictureUrl, deleteVehiclePictureFromDisk}