const express = require('express');
const router =express.Router();

const Vehicle = require('../../models/vehicle/vehicle')
const Picture = require('../../models/vehicle/vehicle-picture')
const User = require('../../models/login/user')
const {Sequelize, Op} = require("sequelize");

const storage = require('../../config/multer-config')
const multer = require('multer')
const upload = multer({storage: storage})
const checkAuth = require('../login/middleware/checkAuthentication')
const checkMaxListings = require('../login/middleware/checkMaxUserListings')

const pictureMiddleware = require('../../routes/picture-middleware')

router.use(checkAuth)

//Get all vehicles WITH attribute sorting
router.get('/',async (req,res)=>{

    try{
        const filters = {}

        const {vehicle_category_id,mark_id,model_id,type_id,description,
            price,first_registration,mileage,fuel_type,color,condition,status,address} = req.query

        const currentDate = new Date();

        if(vehicle_category_id)
            filters.vehicle_category_id = vehicle_category_id;
        if(mark_id)
            filters.mark_id=mark_id
        if(model_id)
            filters.model_id=model_id
        if(type_id)
            filters.type_id=type_id
        if(description){
            filters[Op.or] = [
                {name:{[Op.iLike]: `%${description}%`}},
                {color:{[Op.iLike]: `%${description}%`}},
                {fuel_type:{[Op.iLike]: `%${description}%`}},
                {description:{[Op.iLike]:`%${description}%`}}
            ]
        }
        if(price){
            filters.price = {[Sequelize.Op.lt]: Number(price)}
        }
        if(first_registration){
            filters.first_registration = {
                [Sequelize.Op.between]: [first_registration, currentDate]}
        }
        if(mileage)
            filters.mileage = {[Sequelize.Op.lt]: mileage}
        if(fuel_type)
            filters.fuel_type= {[Op.iLike]: `%${fuel_type}%`}
        if(color)
            filters.color = {[Op.iLike]: `%${color}%`};
        if(condition)
            filters.condition = condition;
        if(status)
            filters.status = status

        const userFilters = {}
        if(address){
            userFilters.address = {[Op.iLike]: `%${address}%`}
        }


        const vehicles = await Vehicle.findAll({
            where:filters,
            include:[
                {model: Picture},
                {
                    model: User,
                    where: userFilters,
                    required: true
                }]
        });

        res.json(vehicles);
    }catch (error){
        res.status(400).json({
            "message":"error occurred"
        });
        console.log(error);
    }
});

//Get all user vehicles
router.get('/user',async (req,res)=>{
    const id = req.user_id

    try{
        const vehicles = await Vehicle.findAll({
            where: {user_id: id},
            include: {model: Picture }
        })

        if(!vehicles){
            res.status(401).json({
                "message":"no results"
            });
            return;
        }
        res.json(vehicles);
    }catch (error){
        res.status(400).json({
            "message":"error occurred"
        });
        console.log(error);
    }
});

//Get a vehicle by id
router.get('/:id',async (req,res)=>{
    const { id } = req.params

    try{
        const vehicle = await Vehicle.findOne({
            where: {vehicle_id: id},
            include: [
                {model: Picture },
                {model: User,
                attributes: ['email','address']}
            ]
        })

        if(!vehicle){
            res.status(401).json({
                "message":"no results"
            });
            return;
        }
        res.json(vehicle);
    }catch (error){
        res.status(400).json({
            "message":"error occurred"
        });
        console.log(error);
    }
});

//Create new vehicle
router.post('/',checkMaxListings ,upload.array('images',5),async (req,res)=>{

    const vehicle = JSON.parse(req.body.vehicle)

    const user_id = req.user_id


    try{
        const newVehicle = await Vehicle.create({
            user_id: user_id,
            vehicle_category_id: vehicle.vehicle_category_id,
            mark_id: vehicle.mark_id,
            model_id: vehicle.model_id,
            type_id: vehicle.type_id,
            name: vehicle.name,
            description: vehicle.description,
            price: vehicle.price,
            first_registration: vehicle.first_registration,
            mileage: vehicle.mileage,
            fuel_type: vehicle.fuel_type,
            color: vehicle.color,
            condition: vehicle.condition,
            status: vehicle.status});

        if(req.files && req.files.length > 0){
            await pictureMiddleware.createVehicleEntry(newVehicle.vehicle_id,req.files)
        }

        res.status(201).json(newVehicle);
    } catch (error){
        console.error(error);
        res.status(400).json({error: error.message});
    }
})

//Delete Vehicle by id
router.delete('/:id', async (req, res)=>{
    const { id } = req.params

    try{
        const pictures = await Picture.findAll({
            where: {vehicle_id:id}
        })

        if(pictures){
            (await pictures).forEach(picture => {
                pictureMiddleware.deleteVehiclePictureFromDisk(picture.picture_url)
            })
        }

        const deletedVehicle = await Vehicle.destroy({
            where: { vehicle_id:id }
        });

        if(deletedVehicle === 0){
            return res.status(404).json({error: 'Vehicle not found'});
        }

        res.status(200).json({message: `Vehicle with id ${id} deleted successfully`})
    }catch(error){
        console.error(error);
        res.status(500).json({error: 'Failure to delete Vehicle'})
    }
});

//Update existing Vehicle
router.patch('/:id',upload.array('images',5), async (req,res)=>{
    const { id } = req.params
    const updatedVehicle = JSON.parse(req.body.vehicle)

    try{
        const vehicle = await Vehicle.findOne({
            where: {vehicle_id: id}
        })

        if(!vehicle){
            return res.status(404).json({error:'Vehicle not found'});
        }

        await vehicle.update(updatedVehicle);

        if(req.files && req.files.length > 0){
            await pictureMiddleware.createVehicleEntry(vehicle.vehicle_id,req.files)
        }

        return res.json({message: 'Vehicle updated successfully'})
    } catch (error){
        console.error(error);
        res.status(500).json({error: 'Server error'})
    }
})

//Delete vehicle picture by picture id
router.delete('/picture/:id', async(req,res)=>{
    const { id } = req.params

    try{
        const picture = await Picture.findOne({
            where: {picture_id:id}
        })

        if(!picture){
            return res.status(404).json({error:'Picture not found'});
        }

        await pictureMiddleware.deleteVehiclePictureFromDisk(picture.picture_url)

        const deletedPicture = await Picture.destroy({
            where: { picture_id:id }
        });

        if(deletedPicture === 0){
            return res.status(404).json({error: 'Picture not found'});
        }

        res.status(200).json({message: `Picture with id ${id} deleted successfully`})
    }catch(error){
        console.error(error);
        res.status(500).json({error: 'Picture to delete Vehicle'})
    }
})

module.exports = router