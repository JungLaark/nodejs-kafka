const {Kafka} = require('kafkajs');

const kafka = new Kafka({
    clientId: 'kafka1',
    brokers: ['localhost:9092', 'localhost:9093', 'localhost:9094']
});

const producer = kafka.producer();
const consumer = kafka.consumer({groupId: 'test-group'});

const run = async () => {
    await producer.connect();
    console.log('connect success');

    await producer.send({
        topic: 'test-topic',
        messages: [
            {value: 'first kafkajs'}
        ]
    });

    console.log('send success');


    await consumer.connect();
    await consumer.subscribe({topic: 'test-topic', fromBeginning: true});
    console.log('subscribed consumer');
    await consumer.run({
        eachMessage: async({topic, partition, message}) => {
            console.log({
                partition,
                offset: message.offset,
                value: message.value.toString()
            })
        },
    })
};

run().catch(console.error);