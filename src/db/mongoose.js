const mongoose = require('mongoose');

mongoose.connect(`mongodb://${process.env.MONGOOSE_DB_IP}`, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});
