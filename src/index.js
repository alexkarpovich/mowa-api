const express = require('express');

const config = require('./config');
const authMiddleware = require('./middlewares/auth');
const apolloServer = require('./settings/apollo-server');

require('./settings/redis');

const port = config.get('port') || 4000;
const app = express();

//app.use(morgan('combined'));
app.use(authMiddleware);
apolloServer(app);

app.listen({ port },() => {
    console.log(`🚀  Server ready at http://localhost:${port}`);
});
