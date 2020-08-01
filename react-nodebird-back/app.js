const express = require('express');

const app = express();

const postRouter = require('./routes/post');
const postsRouter = require('./routes/posts');
const userRouter = require('./routes/user');

app.use('/post', postRouter);
app.use('/posts', postsRouter);
app.use('/user', userRouter);

app.post('/', (req, res) => {
  res.json('hi');
});
app.listen(3010, () => {
  console.log('server is running on port 3010');
});
