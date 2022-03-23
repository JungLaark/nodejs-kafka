const {Kafka} = require('kafkajs');

const kafka = new Kafka({
    clientId: 'testClient',
    brokers: ['localhost:9092', 'localhost:9093', 'localhost:9094']
});

const consumer = kafka.consumer({groupId: 'test-group'});

const initKafka = async () => {
    console.log('start subscribe');

    await consumer.connect();
    await consumer.subscribe({topic: 'test-topic-event',
                              fromBeginning: true});
                              
   await consumer.run({
       eachMessage: async ({topic, partition, message}) => {
           console.log({
              partition: partition,
              offset: message.offset,
              value: message.value.toString(),
              topic: topic
           })
       }
   })
};

initKafka();