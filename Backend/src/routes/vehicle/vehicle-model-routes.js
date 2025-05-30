const express = require('express');
const router =express.Router();

const Model = require('../../models/vehicle/vehicle-model')
const checkAuth = require('../login/middleware/checkAuthentication')

router.use(checkAuth)

//Get single model by model id
router.get('/single/:id', async(req,res)=>{
    const {id} = req.params

    try{
        const model = await Model.findOne({
            where:{model_id:id}
        });

        res.json(model)
    }catch (error){
        res.status(400).json({
            "message":"error occurred"
        });
        console.log(error);
    }
})

//Get all Model by corresponding mark id
router.get('/:id',async (req,res)=>{
    const {id} = req.params

    try{
        const marks = await Model.findAll({
            where: {mark_id:id}
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