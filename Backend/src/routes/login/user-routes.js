const express = require('express');
const bcrypt = require('bcryptjs')
const jsonwebtoken = require('jsonwebtoken')
const jwtKey = require('../../config/security/jsonwebtoken-secret-key')
const router =express.Router();
const checkEmailInUse = require('./middleware/checkEmailInUse')
const crypto = require('crypto')
const encryptionKey = require('../../config/security/encryptionKey')
const User = require('../../models/login/user')
const iv = crypto.randomBytes(16)
const rateLimit = require('express-rate-limit')
const checkAuth = require('./middleware/checkAuthentication')

function encrypt(text){
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(encryptionKey),iv)
    let encrypted = cipher.update(text, 'utf8', 'hex')
    encrypted += cipher.final('hex')
    return `${iv.toString('hex')}:${encrypted}`
}

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: {error: "Too many login attempts. Please try again."},
    standardHeaders: true,
    legacyHeaders: false,
})


//Get user by id
router.get('/:id',async (req,res)=>{
    const { id } = req.params

    try{
        const user = await User.findOne({
            where: {user_id: id}
        })

        if(!user){
            res.status(401).json({
                "message":"no results"
            });
            return;
        }
        res.json(user);
    }catch (error){
        res.status(400).json({
            "message":"error occurred"
        });
        console.log(error);
    }
});

//Create new User
router.post('/',checkEmailInUse,async (req,res)=>{
    const { email, password, address} = req.body;

    try{

        const password_hash = await bcrypt.hash(password, 10);


        const newUser = await User.create({
            email:email,
            password_hash:password_hash,
            address:address
        });

        res.status(201).json(newUser);
    } catch (error){
        console.error(error);
        res.status(400).json({error: error.message});
    }
})

//Login user
router.post('/login', loginLimiter,async(req,res)=>{
    if(req.user_id){
        return res.status(400).json({error:'Already logged in'})
    }
    try {
        const {email, password} = req.body;

        const user = await User.findOne({
            where: {email:email}
        });

        if (!user) {
            return res.status(401).json({error: 'Invalid email or password'})
        }

        const passwordMatch = await bcrypt.compare(password, user.password_hash)
        if (!passwordMatch) {
            return res.status(401).json({error: 'Invalid email or password'})
        }

        const payload = {
            user_id: user.user_id
        }

        const token = jsonwebtoken.sign(payload, jwtKey.jwtSecret, {
            expiresIn: '1h'
        })

        const encryptedToken = encrypt(token)

        return res.status(200).json({message:'Login successful', encryptedToken})
    }catch (error){
        console.error('Login error', error);
        return res.status(500).json({error:'Internal server error'})
    }
})

//Delete User by Id
router.delete('/:id', async (req, res)=>{
    const { id } = req.params

    try{
        const deletedUser = await User.destroy({
            where: { user_id:id }
        });

        if(deletedUser === 0){
            return res.status(404).json({error: 'User not found'});
        }

        res.status(200).json({message: `User with id ${id} deleted successfully`})
    }catch(error){
        console.error(error);
        res.status(500).json({error: 'Failure to delete User'})
    }
});

//Update User password
router.patch('/update-password', checkAuth ,async(req, res)=>{
    const id = req.user_id
    const currentPassword = req.body.currentPassword
    const newPassword = req.body.newPassword



    try{
        const user = await User.findOne({
            where: {user_id: id}
        })

        if(!user){
            return res.status(404).json({error:'Something went wrong'});
        }

        const passwordMatch = await bcrypt.compare(currentPassword, user.password_hash)
        if(!passwordMatch){
            return res.status(401).json({error:'Incorrect Password'})

        }

        const salt = 10;
        user.password_hash = await bcrypt.hash(newPassword, salt)
        await user.save()

        return res.status(200).json({})
    } catch (error){
        console.error('Error updating password', error)
        return res.status(500).json({error: 'Internal server error'})
    }
})

//Update User Email
router.patch('/update-email', checkAuth, checkEmailInUse ,async(req, res)=>{
    const id = req.user_id
    const password = req.body.password
    const email = req.body.email

    try{
        const user = await User.findOne({
            where: {user_id: id}
        })

        if(!user){
            return res.status(404).json({error:'Something went wrong'});
        }

        const passwordMatch = await bcrypt.compare(password, user.password_hash)
        if(!passwordMatch){
            return res.status(401).json({error:'Incorrect Password'})

        }

        user.email = email
        await user.save()

        return res.status(200).json({})
    } catch (error){
        console.error('Error updating Email', error)
        return res.status(500).json({error: 'Internal server error'})
    }
})

module.exports = router