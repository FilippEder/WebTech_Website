const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const app = express();

const sequelize = require('./src/config/database/sequelize')

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


const vehicleManagementRoutes = require('./src/routes/vehicle-management-routes')
const loginRouteManager = require('./src/routes/user-route-manager')

const productRouter = require('./src/routes/marketplace/productRouter');
const categoryRouter = require('./src/routes/marketplace/categoryRouter');

const postMessagesRoutes = require('./src/routes/chat/messages/post.messages.routes');
const getMessagesRoutes = require('./src/routes/chat/messages/get.messages.routes');
const postConversationsRoutes = require('./src/routes/chat/conversations/post.conversations.routes');
const getConversationsRoutes = require('./src/routes/chat/conversations/get.conversations.routes');
const deleteConversationsRoutes = require('./src/routes/chat/conversations/delete.conversations.routes');

const immobilienRoutes = require('./src/routes/realEstate/immobilien.routes');
const requestRoutes = require('./src/routes/realEstate/request.routes');

//Cors
const cors = require('cors');
const http = require("http");
app.use(cors());

app.use(express.json())

app.use('/res/uploads', express.static('uploads'))

app.use('/messages', postMessagesRoutes);
app.use('/messages', getMessagesRoutes);
app.use('/conversations', postConversationsRoutes);
app.use('/conversations', getConversationsRoutes);
app.use('/conversations', deleteConversationsRoutes);
app.use('/api/immobilien', immobilienRoutes);
app.use('/api/immobilien/requests', requestRoutes);

const server = http.createServer(app);

// ChatSocket integrieren
const ChatSocket = require('./src/chat/chatsocket/chatsocket'); // Pfad zu Deiner ChatSocket-Klasse
const chatSocket = new ChatSocket(server);
chatSocket.initSocket(); // Socket.IO initialisieren


// Zusätzliche Logging-Events für Socket.IO-Verbindungen und empfangene Nachrichten
if (chatSocket.io) {
  chatSocket.io.on('connection', (socket) => {
    console.log(`Neuer Socket.IO Client verbunden: ${socket.id}`);

    // Beispiel: Falls ein Objekt (TS-Objekt) unter dem Event 'jsonData' gesendet wird:
    socket.on('jsonData', (data) => {
      if (typeof data === 'object') {
        console.log(`Empfangenes Objekt von Client ${socket.id}: ${JSON.stringify(data)}`);
      } else {
        console.log(`Empfangene Daten von Client ${socket.id}:`, data);
      }
    });

    // Zusätzliches Logging für ein allgemeines 'message'-Event:
    socket.on('message', (data) => {
      if (typeof data === 'object') {
        console.log(`Empfangene Nachricht von Client ${socket.id}: ${JSON.stringify(data)}`);
      } else {
        console.log(`Empfangene Nachricht von Client ${socket.id}:`, data);
      }
    });
  });
}

// Globale Logging-Middleware für HTTP-Anfragen
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    if (req.body && Object.keys(req.body).length > 0) {
      const bodyLog = typeof req.body === 'object' ? JSON.stringify(req.body) : req.body;
      console.log('Empfangener Body:', bodyLog);
    }
    next();
  });

// Globaler Fehler-Handler
  app.use((err, req, res, next) => {
    console.error('Globaler Fehler:', err);
    res.status(500).json({ error: err.message || 'Internal Server Error' });
  });


for(const [path, router] of Object.entries({
  '/vehicle': vehicleManagementRoutes.vehicleRouter,
  '/mark': vehicleManagementRoutes.vehicleMarkRouter,
  '/model': vehicleManagementRoutes.vehicleModelRouter,
  '/type': vehicleManagementRoutes.vehicleTypeRouter,
  '/user':loginRouteManager.userRouter
})){
  app.use(path,router)
}

app.use('/api/product', productRouter);
app.use('/api/category', categoryRouter);

/**
 * Attempting to connect with sequelize
 */
(async() =>{
  try{
    await sequelize.authenticate();
    console.log('Sequelize connection has been established successfully');
  } catch (error){
    console.error('Sequelize is unable to connect to the database:', error)
  }
})();



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
