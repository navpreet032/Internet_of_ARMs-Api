
const mongoose = require('mongoose');

const armSchema = new mongoose.Schema({

RecordingName:{type : String,required: false,default: null},
ServoAngles:{
    s1: {type: Number, },
    s2: {type: Number, },
    s3: {type: Number, },
    s4: {type: Number, },
    s5: {type: Number, },
},
});

module.exports = mongoose.model('Arm_Doc', armSchema);