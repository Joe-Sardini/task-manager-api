const express = require('express');
require('./db/mongoose.js');
const userRouter = require('./routes/users.routes');
const tasksRouter = require('./routes/tasks.routes');

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(userRouter);
app.use(tasksRouter);

app.listen(port, () => {
    console.log('Server started on port:' + port);
});