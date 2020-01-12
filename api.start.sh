#!/bin/bash
set -e

until timeout 1 bash -c "cat < /dev/null > /dev/tcp/${RABBITMQ_HOST}/5672"; do
  >&2 echo "Rabbit MQ not up yet on ${RABBITMQ_HOST}"
  sleep 1
done

npm run dev
