require('dotenv').config()
const express = require('express');
const cors = require('cors');
const product = require('./router/product');
const cron = require("node-cron");
const errorMiddleware = require('./midleware/error');
const prMd = require('./dto/product');
const PORT = process.env.PORT || 5000;
const app = express();

app.use(express.json());
app.use(cors({
    credentials: true,
    origin: '*'
}));
app.use('/api', product);
app.use(errorMiddleware);


const start = async () => {

    try {
        let task = cron.schedule('45 * * * *', async () => {
            await prMd.updateDB();
            console.log('Running a job at 01:00 at America/Sao_Paulo timezone');
        }, {
            scheduled: true,
            timezone: "Europe/Moscow"
        });
        task.start();
        app.listen(PORT, () => console.log(`Server started on PORT = ${PORT}`));
    } catch (e) {
        console.log(e);
    }
}

start();