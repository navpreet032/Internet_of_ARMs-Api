const mongoose = require('mongoose');
const express = require('express');
const dotenv = require('dotenv');
const cros = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongo');
//-----------------------------------------------
const recordingRoute = require('./routes/Recording_routes');
const userRoute = require('./routes/User_routes');


const app = express();

dotenv.config();
app.use(cros({
    origin:'*',
    credentials: true 
}));


main().catch(err => console.log(err));
// connect to mongoDb 
async function main() {
    await mongoose.connect(process.env.URL)
        .then(() => console.log('Connected to MongoDB...'))
        .catch(err => console.log(err));
}

// Session middleware configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'my_secret_key',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.URL }),
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",// set true if server supports HTTPS    
    }
  }));

app.use(express.json());

app.use('/user', userRoute);
app.use('/recording', recordingRoute );



app.listen(3000, () => console.log('Listening on port 3000...'));