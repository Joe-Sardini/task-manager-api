const mongoose = require('mongoose');

mongoose.connect(`${process.env.MONGOOSE_DB_IP}`, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});
