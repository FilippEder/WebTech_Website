const express = require('express');
const router =express.Router();

const {VehicleMark} = require('../../models/vehicle/model-index')
const checkAuth = require('../login/middleware/checkAuthentication')

router.use(checkAuth)

//Get Single Mark by mark id
router.get('/single/:id', async(req,res)=>{
    const {id} = req.params

    try{
        const mark = await VehicleMark.findOne({
            where:{mark_id:id}
        });

        res.json(mark)
    }catch (error){
        res.status(400).json({
            "message":"error occurred"
        });
        console.log(error);
    }
})

//Get all Marks by corresponding vehicle category id
router.get('/:id',async (req,res)=>{
    const {id} = req.params

    try{
        const marks = await VehicleMark.findAll({
            where: {vehicle_category_id:id}
        });

        res.json(marks);
    }catch (error){
        res.status(400).json({
            "message":"error occurred"
        });
        console.log(error);
    }
});

module.exports = router