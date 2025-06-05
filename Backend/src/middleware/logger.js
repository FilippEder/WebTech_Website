// Globale Logging-Middleware für HTTP-Anfragen

module.exports = (req,res,next)=> {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    if (req.body && Object.keys(req.body).length > 0) {
        const bodyLog = typeof req.body === 'object' ? JSON.stringify(req.body) : req.body;
        console.log('Empfangener Body:', bodyLog);
    }
    next();
};