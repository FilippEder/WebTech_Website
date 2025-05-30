const User = require("../../../models/login/user");
const checkEmailInUse = async (req,res,next)=> {
    try {
        const {email} = req.body;

        if (!email) {
            return res.status(400).json({error: 'Email is required'})
        }

        const userCheck = await User.findOne({
            where: {email: email}
        })

        if (userCheck) {
            return res.status(400).json({error: "Email is already in use"})
        }

        next();
    } catch (error) {
        console.error('Error clicking email:', error);
        return res.status(500).json({message: 'Internal server error'})
    }
}

module.exports = checkEmailInUse;