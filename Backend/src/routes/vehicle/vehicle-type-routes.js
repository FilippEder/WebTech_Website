const express = require('express');
const router =express.Router();

const {VehicleType} = require('../../models/vehicle')
const checkAuth = require('../login/middleware/checkAuthentication')

router.use(checkAuth)

//Get single type corresponding to the type id
router.get('/single/:id', async(req,res)=>{
    const {id} = req.params

    try{
        const type = await VehicleType.findOne({
            where:{type_id:id}
        });

        res.json(type)
    }catch (error){
        res.status(400).json({
            "message":"error occurred"
        });
        console.log(error);
    }
})

//Get all Vehicle Types by corresponding category id
router.get('/:id',async (req,res)=>{
    const {id} = req.params

    try{
        const types = await VehicleType.findAll({
            where: {vehicle_category_id:id}
        });

        res.json(types);
    }catch (error){
        res.status(400).json({
            "message":"error occurred"
        });
        console.log(error);
    }
});

module.exports = router