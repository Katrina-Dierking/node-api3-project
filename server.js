const express = require('express');

const server = express();
const userRouter = require('./users/userRouter');
const postRouter = require('./posts/postRouter');

server.use(express.json());
server.use(logger);
server.use('/api/user', userRouter);
server.use('/api/post', postRouter);



server.get('/', (req, res) => {
  res.send(`<h2>Good evening, Taran!</h2>`);
});

//custom logger middleware

function logger(req, res, next) {
  const {method, originalUrl} = req;
  console.log(`${method} to ${originalUrl} at ${new Date().toISOString()}`);
  next();
}


module.exports = server;
