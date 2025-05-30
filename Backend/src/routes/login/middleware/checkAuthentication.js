const jsonwebtoken = require('jsonwebtoken');
const jwtKey = require('../../../config/security/jsonwebtoken-secret-key')
const encryptionKey = require('../../../config/security/encryptionKey')
const crypto = require('crypto')


function decrypt(encryptedText){
    try{
    const parts = encryptedText.split(':')
    const iv = Buffer.from(parts[0], 'hex')
    const encrypted = Buffer.from(parts[1], 'hex')

    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(encryptionKey), iv)
    let decrypted = decipher.update(encrypted, 'hex', 'utf8')
    decrypted += decipher.final('utf8')

    return decrypted
        }catch (error){
        console.log(error)
    }
}

const authMiddleware = (req,res, next)=>{
    const token = req.header('authorization')
    console.log("encryptedToken:\n"+token)

    if(!token){
        return res.status(403).json({error:'Access denied'})
    }

    try{
        const decryptedToken = decrypt(token)

        let decoded = jsonwebtoken.verify(decryptedToken,jwtKey.jwtSecret);
        req.user_id = decoded.user_id
        next();
    }catch (error){
        return res.status(401).json({error:'Invalid or expired token'})
    }
}

module.exports = authMiddleware;