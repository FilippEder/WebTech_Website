const Vehicle = require("../../../models/vehicle/vehicle");

const MAX_LISTINGS = 10;

const checkMaxUserListings = async (req,res,next)=> {
    try {
        const user_id = req.user_id


        const vehicleCount = await Vehicle.count({
            where: {user_id: user_id}
        })

        if (vehicleCount >= MAX_LISTINGS) {
            return res.status(400).json({error: `You have reached the limit of ${MAX_LISTINGS} vehicle listings`})
        }

        next();
    } catch (error) {
        console.error('Error while checking maximum user listings:', error);
        return res.status(500).json({message: 'Internal server error'})
    }
}

module.exports = checkMaxUserListings;