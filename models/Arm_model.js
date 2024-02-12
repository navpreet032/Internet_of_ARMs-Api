const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the Recording schema.
const recordingSchema = new Schema({
  uid: { type: Schema.Types.ObjectId, required: true },
  RecordingName:{type: String, require: true},
  servoAngles: {
    s1: { type: Number, required: true },
    s2: { type: Number, required: true },
    s3: { type: Number, required: true },
    s4: { type: Number, required: true },
    s5: { type: Number, required: false }
  },
  createdAt: { type: Date, default: Date.now } 
});

// Define the User schema.
const userSchema = new Schema({
  UID:{type: String, require:true, unique:true},    
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Store a hash of the password, not plaintext.
  recordings: [recordingSchema] // Embed the recording schema as an array in the user document.
});

// Create models for the schemas.
const Recording = mongoose.model('Recording', recordingSchema);
const User = mongoose.model('User', userSchema);

module.exports = { User, Recording };
