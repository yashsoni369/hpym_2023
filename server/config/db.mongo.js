const mongoose = require('mongoose');

(async () => {
    uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@prabodham.owbqxe4.mongodb.net/HPYM_2023?retryWrites=true&w=majority`
    mongoose.connect(uri, {
        useNewUrlParser: true, useUnifiedTopology: true
    }).then(() => console.info(`Database Connected : Prabodham36 - HPYM_2023`));
})();
