const Picture = require('../models/vehicle/vehicle-picture')
const {existsSync, readdirSync, unlinkSync} = require("node:fs");
const {join} = require("node:path");



async function storeVehiclePictureUrl(vehicle_id, files){
    try{
        let images = files.map(image => ({
            vehicle_id: vehicle_id,
            picture_url: image.path
        }))

        await Picture.bulkCreate(images);
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