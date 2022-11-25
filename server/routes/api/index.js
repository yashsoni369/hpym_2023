const { Router } = require('express')
const apiRouter = new Router();

const setupSSLRoutes = require('./regs.routes')


setupSSLRoutes(apiRouter);


module.exports = apiRouter