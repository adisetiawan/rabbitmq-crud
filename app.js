require('dotenv').config({ debug: process.env.DEBUG });
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const amqplib = require('amqplib');

const { Sequelize } = require('sequelize');
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './' + process.env.DB
});

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

// middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// create producer
const publish = async (msg) => {
  const conn = await amqplib.connect(process.env.AMQPURL);
  const ch = await conn.createChannel();
  await ch.assertQueue(process.env.QUEUE, { durable: true });
  await ch.sendToQueue(process.env.QUEUE, Buffer.from(JSON.stringify(msg)));

  setTimeout( () => {
      ch.close();
      conn.close();
    },
    500);
};

// for the shake of simplicity all routes are here instead of separate router files

//process rabbitmq request

app.post('/msg/posts', async (req, res) => {
  await publish({ action: 'POST_post', body: req.body });
  res.status(200).json({ msg: 'creating new post..' });
});

app.put('/msg/posts/:id', async (req, res) => {
  await publish({ action: 'PUT_post', id: req.params.id, body: req.body });
  res.status(204).json({ msg: 'updating existing post..' });
});

app.delete('/msg/posts/:id', async (req, res) => {
  await publish({ action: 'DELETE_post', id: req.params.id });
  res.status(204).json({ msg: 'deleting existing post..' });
});

//display result
app.get('/', async (req, res) => {
  res.status(200).json({ msg: 'hello world' });
});

app.get('/posts/:id', async (req, res) => {
  const posts = await Post.findAll({
    where: {
      id: parseInt(req.params.id)
    }
  });
  res.status(200).json({ data: posts });
});

app.get('/posts/:id/comments', async (req, res) => {
  const comments = await Comment.findAll({
    where: {
      postId: parseInt(req.params.id)
    }
  });
  res.status(200).json({ data: comments });
});

app.get('/posts', async (req, res) => {
  const posts = await Post.findAll();
  res.status(200).json({ data: posts });
});

// handle error
app.use( (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ msg: err.message });
});

const server = app.listen(process.env.PORT, () => {
  console.log(`rabbitmq crud app listening at http://localhost:${process.env.PORT}`);
});

process.on('SIGINT', () => {
  server.close();
});

process.on('SIGTERM', () => {
  server.close();
});