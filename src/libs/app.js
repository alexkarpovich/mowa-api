const express = require('express');

const authMiddleware = require('../middlewares/auth');
const apolloServer = require('./apollo-server');

//require('./redis');

const app = express();

app.use(authMiddleware);
apolloServer(app);

module.exports = app;
