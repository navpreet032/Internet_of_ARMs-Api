const mongoose = require('mongoose');
const express = require('express');
const dotenv = require('dotenv');

const armRoute = require('./routes/Arm_route');

const app = express();
dotenv.config();



main().catch(err => console.log(err));

async function main() {
    await mongoose.connect(process.env.URL)
        .then(() => console.log('Connected to MongoDB...'))
        .catch(err => console.log(err));
}

app.use(express.json());

app.use('/arms', armRoute);


app.listen(3000, () => console.log('Listening on port 3000...'));