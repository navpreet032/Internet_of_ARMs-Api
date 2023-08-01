const router = require('express').Router();
const Arm_model = require('../models/Arm_model');

// get only recording names from db where recording name is not null

//In this example, the find method is called on the Arm_model model with a query object that includes a $ne operator to filter out documents where the RecordingName field is null. The select method is then called with a string argument that includes the RecordingName field and excludes the _id field, so that only the recording names are returned.
router.get('/', async (req, res) => {
    try {
        const recording = (await Arm_model.find({ RecordingName: { $ne: null } }).select('RecordingName -_id'))

        res.status(200).json(recording);
    } catch (err) {
        res.status(500).json(err);
    }
}
);

module.exports = router;