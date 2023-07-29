const router = require('express').Router();
const Arm_model = require('../models/Arm_model');




// Insert a new arm angles

router.post('/', async (req, res) => {
    const arm = new Arm_model({
        RecordingName: null,
        ServoAngles: req.body.ServoAngles
    });
    try {
        const savedArm = await arm.save();
        res.status(201).json(savedArm);
    } catch (err) {
        res.status(500).json(err);
    }
}   );
 


// Insert a new arm angles with a recording name

router.post('/:recordingName', async (req, res) => {    
    const arm = new Arm_model({
        RecordingName: req.params.recordingName,
        ServoAngles: req.body.ServoAngles
    });
    try {
        const savedArm = await arm.save();
        res.status(201).json(savedArm);
    } catch (err) {
        res.json({ message: err });
    }
} );

// get document from db which dont have a recording name

router.get('/', async (req, res) => {
    try {
        const arms = await Arm_model.find({RecordingName: null}).select('ServoAngles -_id');
        res.status(200).json(arms);
    } catch (err) {
        res.status(500).json(err);
    }
}   );

// get document from db which have a recording name

router.get('/:recordingName', async (req, res) => {
    try {
        const arms = await Arm_model.find({RecordingName: req.params.recordingName}).select('ServoAngles -_id');
        res.status(200).json(arms);
    } catch (err) { 
        res.status(500).json(err);
    }
});

//update document from db which dont have a recording name

router.put('/', async (req, res) => {
    try {
        const updatedArm = await Arm_model.updateMany({RecordingName: null}, {$set: {ServoAngles: req.body.ServoAngles}});
        res.status(201).json(updatedArm);
    } catch (err) {
        res.status(500).json(err);
    }
});


// delete document from db which dont have a recording name when new document is added in db without a recording name

router.delete('/', async (req, res) => {    
    try {
        const removedArm = await Arm_model.deleteMany({RecordingName: null});
        res.status(201).json(removedArm);
    } catch (err) {
        res.status(500).json(err);
    }
}   
);

// delete document from db which have a recording name

router.delete('/:recordingName', async (req, res) => {
    try {
        const removedArm = await Arm_model.deleteOne({RecordingName: req.params.recordingName});
        res.status(201).json(removedArm);
    } catch (err) {
        res.status(500).json(err);
    }
}   );

module.exports = router;