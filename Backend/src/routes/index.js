const express = require('express')
const router = express.Router()

const vehicleRoutes = require('./vehicle-management-routes')
const loginRoutes = require('./user-route-manager')
const productRouter = require('./marketplace/productRouter')
const categoryRouter = require('./marketplace/categoryRouter')
const messagesRoutes = [
    require('./chat/messages/post.messages.routes'),
    require('./chat/messages/get.messages.routes')
];
const conversationRoutes = [
    require('./chat/conversations/post.conversations.routes'),
    require('./chat/conversations/get.conversations.routes'),
    require('./chat/conversations/delete.conversations.routes')
];
const immobilienRoutes = require('./realEstate/immobilien.routes')
const requestRoutes = require('./realEstate/request.routes')

router.use('/messages', messagesRoutes);
router.use('/conversations', conversationRoutes);
router.use('/api/immobilien', immobilienRoutes);
router.use('/api/immobilien/requests', requestRoutes);
router.use('/api/product', productRouter);
router.use('/api/category', categoryRouter);

router.use('/vehicle', vehicleRoutes.vehicleRouter);
router.use('/mark', vehicleRoutes.vehicleMarkRouter);
router.use('/model', vehicleRoutes.vehicleModelRouter);
router.use('/type', vehicleRoutes.vehicleTypeRouter);
router.use('/user', loginRoutes.userRouter);

module.exports = router;