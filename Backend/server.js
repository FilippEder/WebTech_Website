const http = require('http')
const app = require('./app')
const sequelize = require('./src/config/database/sequelize')
const runSeed = require('./src/startup/seed')
const { initSocket } = require('./src/chat/chatsocket/index'); // Pfad zu Deiner ChatSocket-Klasse

const server = http.createServer(app)
initSocket(server);

(async () =>{
    try{
        await sequelize.authenticate();
        console.log('Sequelize connected');

        await sequelize.sync({force:false});
        console.log('DB synced');

        await runSeed();

        const PORT = process.env.PORT || 3000;
        server.listen(PORT, ()=> console.log(`Server running on port ${PORT}`))
    }catch (err){
        console.error('Startup error:',err)
    }
})();