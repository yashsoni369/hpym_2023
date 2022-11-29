const mongoose = require('mongoose');

(async () => {
    uri = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_SERVER}/HPYM_2023?authMechanism=DEFAULT&authSource=admin`
    mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => console.info(`Database Connected : Prabodham36 - HPYM_2023`)).catch((ee) => {
console.log('DB Connection Error ',ee)
    });
})();