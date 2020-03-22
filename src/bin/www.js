//const amqp = require('amqplib/callback_api');

const config = require('../config');
const app = require('../libs/app');
//const { initProducer } = require('../libs/producer');

const port = config.get('port') || 4000;

app.listen({port}, () => {
  console.log(`🚀  Server ready at http://localhost:${port}`);
});

// amqp.connect(config.get('rabbitmq:uri'), function (err, conn) {
//   if (err) {
//     throw new Error(err);
//   }
//
//   initProducer(app, conn);
//
//   app.listen({port}, () => {
//     console.log(`🚀  Server ready at http://localhost:${port}`);
//   });
// });
