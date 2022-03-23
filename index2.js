const express = require('express');
const app = express();
const port = 3000;

const { Kafka } = require('kafkajs');

const kafka = new Kafka({
    clientId: 'testClient',
    brokers: ['localhost:9092', 'localhost:9093', 'localhost:9094']
});

const producer = kafka.producer();

const initKafka = async () => {
    await producer.connect();
    console.log('producer connected');
};

/*message 에 있는 객체 배열 모두 전달이 될 줄 알았는데 아니다. */
app.post('/test/:event', async (req, res) => {
    await producer.send({
        topic: 'test-topic-event',
        messages : [
            {key: 'key1', value: req.params.event, partition: 0},
            {key: 'key2', value: req.params.event + 'test2', partition: 1},
            {key: 'key3', value: req.params.event + 'test3', partition: 2},
        ]
    });

    res.send('success stored event : ' + req.params.event);
});

app.listen(port, () =>{
    console.log(`kafka app listening on ${port}`);
});

initKafka();