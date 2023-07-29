const request = require('supertest');
const app = require('../index');
const Arm_model = require('../models/Arm_model');

describe('Arm routes', () => {
  beforeEach(async () => {
    // Clear the database before each test
    await Arm_model.deleteMany({});
  });

  describe('POST /', () => {
    it('should insert a new arm angles without a recording name', async () => {
      const res = await request(app)
        .post('/api/arm')
        .send({ ServoAngles: [90, 90, 90, 90, 90, 90] });
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('_id');
      expect(res.body.RecordingName).toBeNull();
      expect(res.body.ServoAngles).toEqual([90, 90, 90, 90, 90, 90]);
    });

    it('should insert a new arm angles with a recording name', async () => {
      const res = await request(app)
        .post('/api/arm/my-recording')
        .send({ ServoAngles: [90, 90, 90, 90, 90, 90] });
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('_id');
      expect(res.body.RecordingName).toEqual('my-recording');
      expect(res.body.ServoAngles).toEqual([90, 90, 90, 90, 90, 90]);
    });
  });

  describe('GET /', () => {
    it('should get all documents without a recording name', async () => {
      // Insert some documents with and without recording names
      await Arm_model.create([
        { ServoAngles: [90, 90, 90, 90, 90, 90] },
        { ServoAngles: [45, 45, 45, 45, 45, 45], RecordingName: 'my-recording' },
        { ServoAngles: [0, 0, 0, 0, 0, 0] },
      ]);
      const res = await request(app).get('/api/arm');
      expect(res.statusCode).toEqual(200);
      expect(res.body.length).toEqual(2);
      expect(res.body[0].RecordingName).toBeNull();
      expect(res.body[1].RecordingName).toBeNull();
    });
  });

  describe('GET /:recordingName', () => {
    it('should get all documents with a recording name', async () => {
      // Insert some documents with and without recording names
      await Arm_model.create([
        { ServoAngles: [90, 90, 90, 90, 90, 90] },
        { ServoAngles: [45, 45, 45, 45, 45, 45], RecordingName: 'my-recording' },
        { ServoAngles: [0, 0, 0, 0, 0, 0], RecordingName: 'my-recording' },
      ]);
      const res = await request(app).get('/api/arm/my-recording');
      expect(res.statusCode).toEqual(200);
      expect(res.body.length).toEqual(2);
      expect(res.body[0].RecordingName).toEqual('my-recording');
      expect(res.body[1].RecordingName).toEqual('my-recording');
    });
  });

  describe('DELETE /', () => {
    it('should delete all documents without a recording name', async () => {
      // Insert some documents with and without recording names
      await Arm_model.create([
        { ServoAngles: [90, 90, 90, 90, 90, 90] },
        { ServoAngles: [45, 45, 45, 45, 45, 45], RecordingName: 'my-recording' },
        { ServoAngles: [0, 0, 0, 0, 0, 0] },
      ]);
      const res = await request(app).delete('/api/arm');
      expect(res.statusCode).toEqual(200);
      expect(res.body.deletedCount).toEqual(2);
    });
  });

  describe('DELETE /:recordingName', () => {
    it('should delete all documents with a recording name', async () => {
      // Insert some documents with and without recording names
      await Arm_model.create([
        { ServoAngles: [90, 90, 90, 90, 90, 90] },
        { ServoAngles: [45, 45, 45, 45, 45, 45], RecordingName: 'my-recording' },
        { ServoAngles: [0, 0, 0, 0, 0, 0], RecordingName: 'my-recording' },
      ]);
      const res = await request(app).delete('/api/arm/my-recording');
      expect(res.statusCode).toEqual(200);
      expect(res.body.deletedCount).toEqual(2);
    });
  });
});