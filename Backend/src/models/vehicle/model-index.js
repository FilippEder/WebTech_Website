const User = require('../login/user')
const Vehicle = require('./vehicle')
const VehicleMark = require('./vehicle-mark')
const VehicleModel = require('./vehicle-model')
const VehiclePicture = require('./vehicle-picture')
const VehicleType = require('./vehicle-type')


Vehicle.belongsTo(User, {foreignKey: "user_id"})

Vehicle.hasMany(VehiclePicture, {foreignKey: 'vehicle_id', onDelete: 'CASCADE'});
VehiclePicture.belongsTo(Vehicle, {foreignKey: 'vehicle_id'})


module.exports = {
    Vehicle,
    VehicleMark,
    VehicleModel,
    VehiclePicture,
    VehicleType
}