// Example route file
module.exports = (app) => {
    app.get('/api/status', (req, res) => {
        res.json({
            status: 'ok',
            timestamp: new Date().toISOString()
        });
    });
};
