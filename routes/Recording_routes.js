const router = require('express').Router();
const mongoose = require('mongoose');
const { User, Recording } = require('../models/Arm_model'); // Adjust the path as necessary
const isAuthenticated = require('../middleware/authMiddleware'); // Adjust the path as necessary


router.get('/recordings', isAuthenticated, async (req, res) => {
  const { recordingName } = req.query; // Get recording name from query parameters
  try {
    const user = await User.findById(req.session.userId).populate({
      path: 'recordings',
      match: recordingName ? { name: recordingName } : {} // Match recording by name if provided
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Filter recordings by name if provided, otherwise send all
    const recordings = recordingName ? user.recordings.filter(rec=> rec.RecordingName === recordingName) : user.recordings;
    res.json(recordings);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching recordings', error: err });
  }
});


// to save recording
router.post('/recordings', isAuthenticated, async (req, res) => {
    try {
      const user = await User.findById(req.session.userId);
      const newRecording = new Recording({
        uid: new mongoose.Types.ObjectId(),
        servoAngles: req.body.servoAngles,
        RecordingName: req.body.RecordingName // Capture the recording name from the request body
      });
  
      const savedRecording = await newRecording.save();
      user.recordings.push(savedRecording);
      await user.save();
  
      res.status(201).json(savedRecording);
    } catch (err) {
      console.log(err , "hello")
      res.status(500).json({ message: "Error saving recording", error: err });
    }
  });
  

// Delete a recording for the logged-in user
router.delete('/recordings/:recordingId', isAuthenticated, async (req, res) => {
  try {
    const recordingId = req.params.recordingId;
    const user = await User.findById(req.session.userId);

    // Remove the recording from the user's recordings array
    user.recordings = user.recordings.filter(rec => rec._id.toString() !== recordingId);
    await user.save();

    // Delete the recording from the Recording collection
    const deletedRecording = await Recording.findByIdAndDelete(recordingId);

    if (!deletedRecording) {
      return res.status(404).send('Recording not found');
    }

    res.status(200).json(deletedRecording);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;