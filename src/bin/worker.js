#!/usr/bin/env node

const amqp = require('amqplib/callback_api');

const config = require('../config');
const consumer = require('../libs/consumer');

amqp.connect(config.get('rabbitmq:uri'), function (err, conn) {
  if (err) {
    throw new Error(err);
  }

  consumer(conn);
});
