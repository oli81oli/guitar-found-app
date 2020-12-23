module.exports = app => {

    // Base URLS
    app.use('/api', require('./auth.routes.js'))
    app.use('/api/users', require('./user.routes.js'))
    app.use('/api/guitars', require('./guitars.routes.js'))
    app.use('/api/cart', require('./cart.routes.js'))
    app.use('/api/files', require('./files.routes.js'))

}