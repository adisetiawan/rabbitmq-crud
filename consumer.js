require('dotenv').config({ debug: process.env.DEBUG });
const amqplib = require('amqplib');
const axios = require('axios').default;
const { Sequelize } = require('sequelize');
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './' + process.env.DB
});
// for shake of simplicity all models defines here
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection to db has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
})();

const { Post, Comment } = require('./model');

const consumer =  async () => {
    const conn = await amqplib.connect(process.env.AMQPURL);
    const ch = await conn.createChannel();
    await conn.createChannel();
    await ch.assertQueue(process.env.QUEUE, { durable: true });
    await ch.consume(process.env.QUEUE, async (msg) => {
        //console.log(msg.content.toString());
        const data = JSON.parse(msg.content.toString());

        if(data.action == 'POST_post') {
          const response = await axios.post(`${process.env.API}/posts`, {
            title: data.body.title,
            body: data.body.body,
            userId: 1
          });

          console.log(response.data);
          if(response.data) {
            //save to local db
            await Post.create({
              title: response.data.title,
              body: response.data.body,
              userId: response.data.userId,
              externalId: response.data.id
            });
          }
        }

        // if(data.action == 'PUT_post') {
        //   const response = await axios.put(`${process.env.API}/posts/${data.id}`, {
        //     id: data.body.id,
        //     title: data.body.title,
        //     body: data.body.body,
        //     userId: 1
        //   });

        //   console.log(response.data);
        //   if(response.data) {
        //     //save to local db
        //     await Post.update({
        //       title: response.data.title,
        //       body: response.data.body,
        //       userId: response.data.userId,
        //       externalId: response.data.id
        //     },
            
        //     );
        //   }
        // }

        

        //console.log(data);
        ch.ack(msg);
        ch.cancel(process.env.CONSUMER);
        }, 
        { 
            consumerTag: process.env.CONSUMER
    });

};

consumer();