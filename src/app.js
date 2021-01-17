const express = require('express');
require('./db/mongoose.js');
const userRouter = require('./routes/users.routes');
const tasksRouter = require('./routes/tasks.routes');

const app = express();

app.use(express.json());
app.use(userRouter);
app.use(tasksRouter);

module.exports = app;