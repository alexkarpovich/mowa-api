const { TERM_QUEUE, QUEUES } = require('./producer');
const LineDictScraper = require('../modules/term/scraper/linedict.scraper');

module.exports = (conn) => {
  conn.createChannel(function (err, channel) {
    QUEUES.forEach(queue => {
      channel.assertQueue(queue, {
        durable: false
      });
    });

    channel.consume(TERM_QUEUE, function(msg) {
      console.log(" [x] Received %s", msg.content.toString());
      LineDictScraper.exec({ term: msg.content.toString() });
    }, {
      noAck: true
    });
  });
};

