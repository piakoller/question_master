const mongoose = require("mongoose");

const ModelSchema = new mongoose.Schema({
  name: String,
  eloScore: Number,
  wins: Number,
  losses: Number,
  votes: Number,
})
const Model = mongoose.model("models", ModelSchema)

// Define the UserLog model schema for storing user logs in the database
const userSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  demographics: {
    age: Number,
    gender: String,
    education: String,
    language: String,
    profession: String,
    employer: String,
    experience: Number,
    theranosticExpertise: Number,
  },
  llmBattle: [
    {
      WIN: String,
      LOSS: String,
      questionId: String,
      neither: Boolean,
      votes: [String],
    },
  ],
  newQuestions: [
    {
      newQuestion: String
    }
  ]
});
const UserLog = mongoose.model('user', userSchema);

const questionSchema = new mongoose.Schema({
  newQuestion: String
})
const NewQuestion = mongoose.model('newQuestion', questionSchema);

module.exports = {
  Model,
  UserLog,
  NewQuestion
};