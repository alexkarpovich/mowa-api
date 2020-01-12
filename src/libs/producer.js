const TERM_QUEUE = 'term';
const QUEUES = [
  TERM_QUEUE,
];

let chan = null;

module.exports = {
  TERM_QUEUE,
  QUEUES,
  initProducer: (app, conn) => {
    conn.createChannel(function (err, channel) {
      QUEUES.forEach(queue => {
        channel.assertQueue(queue, {
          durable: false
        });
      });

      chan = channel;

      app.mq = {
        publishTerm: (data) => {
          channel.sendToQueue(TERM_QUEUE, Buffer.from(data));
        },
      };
    });
  }
};

process.on('exit', (code) => {
  chan.close();
  console.log(`Closing rabbitmq channel`);
});
