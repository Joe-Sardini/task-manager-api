const mongoose = require('mongoose');

mongoose.connect(`mongodb://${process.env.MONGOOSE_DB_IP}/task-manager-api`, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});
