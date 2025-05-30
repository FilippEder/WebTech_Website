const {Sequelize} = require("sequelize")

const sequelize = new Sequelize('marketplace_db','postgres','oY638fHYJRkmQ93bm',{
    host:'localhost',
    dialect:'postgres',
})

module.exports = sequelize