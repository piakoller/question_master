const Papa = require('papaparse');

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

const cors = require('cors');

const fs = require('fs').promises; // Use promises for asynchronous operations

const app = express();
// const port = process.env.PORT || 3000;
const port = 3000;

// Enable CORS
app.use(cors());
app.use(bodyParser.json());

const { Model, UserLog, NewQuestion } = require('./database');

mongoose.connect('mongodb+srv://piakoller:user-study-llm@user-study-llm.fgzcfwv.mongodb.net/', {
  dbName: 'user-study-llm',
  // useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to user-study-llm database');
  })
  .catch((err) => {
    console.error(err);
  });

const schedule = require('node-schedule');

const job = schedule.scheduleJob('*/5 * * * *', function () {
  console.log('Connected to user-study-llm database');
});

// generate a unique user ID
const generateUserId = () => uuidv4();

// Save demographics data to the database
const saveDemographics = async (req, res) => {
  try {
    const { userId, language, age, gender, education, profession, employer, experience, theranosticExpertise } = req.body;

    const user = await UserLog.findOne({ userId });

    // If user exists, update demographics
    if (user) {
      user.demographics = {
        userId: req.userId,
        age,
        gender,
        education,
        language,
        profession,
        employer,
        experience,
        theranosticExpertise,
      };
      await user.save();
      res.json({ message: 'User demographics updated successfully' });
    } else {
      // Create a new user if not found
      const newUser = new UserLog({
        userId,
        demographics: {
          age,
          gender,
          education,
          language,
          profession,
          employer,
          experience,
          theranosticExpertise,
        },
      });
      await newUser.save();
      res.json({ message: 'User demographics saved successfully' });
    }
  } catch (error) {
    console.error('Error saving user demographics:', error);
    res.status(500).send('Error saving user demographics');
  }
};

// Save additional Questions and Feedback to the database
const saveQuestion = async (req, res) => {
  try {
    const { userId, newQuestion, category } = req.body;

    // Create a new NewQuestion instance
    const newQuestionDoc = new NewQuestion({ userId, newQuestion, category });
    await newQuestionDoc.save();

    // Find the user by their userId
    const user = await UserLog.findOne({ userId });

    // Create a new log entry
    const newLog = {
      newQuestion: newQuestion,
      category: category,
    };
    if (user) {
      // Update the user's newQuestion field in demographics
      user.newQuestions.push(newLog);

      // Save the updated user document
      await user.save();
      res.json({ message: 'User question saved successfully' });
    } else {
      console.error('User not found for saving question.');
      res.status(404).send('User not found');
    }
  } catch (error) {
    console.error('Error saving new question:', error);
    res.status(500).send('Error saving new question');
  }
};

const saveUserLog = async (userId, questionId, selectedAnswer, notSelectedAnswer, neither, votes) => {
  try {
    // Find the user by their userId
    let user = await UserLog.findOne({ userId });

    // If the user doesn't exist, create a new one
    if (!user) {
      const newUser = new UserLog({ userId, llmBattle: [] });
      await newUser.save();
      user = newUser;
    }

    // Create a new log entry
    const newLog = {
      WIN: selectedAnswer,
      LOSS: notSelectedAnswer,
      neither,
      questionId,
      votes,
    };

    // Add the new log to the user's llmBattle array
    user.llmBattle.push(newLog);

    // Save the updated user document
    await user.save();

    console.log(`Saved user log: ${JSON.stringify(newLog)}`);
  } catch (error) {
    console.error('Error saving user log:', error);
  }
};


// Route to generate and save a unique userId
app.post('/api/generate-user-id', async (req, res) => {
  try {
    const userId = generateUserId();

    // Save the userId to the database with default values for demographics
    const newUser = new UserLog({
      userId,
      demographics: {
        age: '',
        gender: '',
        education: '',
        language: '',
        profession: '',
        employer: '',
        experience: '',
        theranosticExpertise: '',
        llmBattle: [],
      },
    });

    await newUser.save();

    console.log(`Saved userId to the database: ${userId}`);
    res.json({ userId });
  } catch (error) {
    console.error('Error generating and saving userId:', error);
    res.status(500).send('Internal server error');
  }
});

app.get('/api/get-user-data', async (req, res) => {
  try {
    const userId = req.query.userId;
    const user = await UserLog.findOne({ userId: userId });

    if (user) {
      res.json(user);
    } else {
      console.error("User not found in database");
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post('/api/save-demographics/:userId', saveDemographics);
app.post('/api/new-question/:userId', saveQuestion);

app.get("/models", (req, res) => {
  Model.find()
    .then(models => {
      console.log("Fetched models:", models);
      res.json(models);
    })
    .catch(err => {
      console.error(err);
      res.json(err);
    });
});

app.get("/api", (req, res) => {
  res.json({ message: "Hello from server!" });
});


// app.listen(port, () => {
app.listen(process.env.port || port, () => {
  console.log(`Server listening on port ${port}`);
});

// handle CSV data extraction and response sending
const handleCSVRequest = async (filePath, res, llm) => {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    const parsedData = Papa.parse(data, { header: true });
    let responseData;
    if (llm) {
      responseData = parsedData.data.map(row => ({ questionId: row.QuestionId, answer: row.answer, language: row.language }));
    } else {
      responseData = parsedData.data.map(row => ({ questionId: row.QuestionId, question: row.Question, language: row.language }));
    }

    res.json(responseData);
  } catch (error) {
    console.error('Error fetching or parsing CSV:', error);
    res.status(500).send('Internal server error.');
  }
};


app.get('/api/get-question', async (req, res) => {
  await handleCSVRequest('../public/data/Evaluation-Questions.csv', res);
});

// Define routes for different LLMs
app.get('/api/get-gpt-3-5', async (req, res) => {
  await handleCSVRequest('../public/data/GPT-3_EvaluationQuestions.csv', res, true);
});

app.get('/api/get-gpt-4', async (req, res) => {
  await handleCSVRequest('../public/data/GPT-4_EvaluationQuestions.csv', res, true);
});

app.get('/api/get-gemini', async (req, res) => {
  await handleCSVRequest('../public/data/Gemini_EvaluationQuestions.csv', res, true);
});

app.get('/api/get-claude-3-sonnet', async (req, res) => {
  await handleCSVRequest('../public/data/Claude-3-sonnet_EvaluationQuestions.csv', res, true);
});

app.get('/api/get-claude-3-opus', async (req, res) => {
  await handleCSVRequest('../public/data/Claude-3-opus_EvaluationQuestions.csv', res, true);
});

app.get('/api/get-mistral-large', async (req, res) => {
  await handleCSVRequest('../public/data/Mistral_large_EvaluationQuestions.csv', res, true);
});

app.get('/api/get-mistral-medium', async (req, res) => {
  await handleCSVRequest('../public/data/Mistral_medium_EvaluationQuestions.csv', res, true);
});

app.get('/api/get-mixtral', async (req, res) => {
  await handleCSVRequest('../public/data/Mixtral_EvaluationQuestions.csv', res, true);
});

app.get('/api/get-llama2', async (req, res) => {
  await handleCSVRequest('../public/data/Llama2_EvaluationQuestions.csv', res, true);
});

app.get('/api/get-qwen', async (req, res) => {
  await handleCSVRequest('../public/data/Qwen_EvaluationQuestions.csv', res, true);
});

const kFactor = 32; // Adjust this value based on your desired volatility

app.post('/api/save-answer', async (req, res) => {
  try {
    // Destructure selected and not selected answers directly from the request body
    const { userId, selectedAnswer, notSelectedAnswer, questionId, votes } = req.body;
    // Check if either answer is undefined
    if (!selectedAnswer || !notSelectedAnswer) {
      return res.status(400).send('Both selectedAnswer and notSelectedAnswer are required in the request body');
    }
    if (selectedAnswer === 'null') {
      await saveUserLog(userId, questionId, null, null, true, votes);
    } else {
      // Find the selected and not selected models from the database
      const [selectedModel, notSelectedModel] = await Promise.all([
        Model.findOne({ name: selectedAnswer }),
        Model.findOne({ name: notSelectedAnswer }),
      ]);

      // Check if both models were found
      if (!selectedModel || !notSelectedModel) {
        return res.status(404).send('One or both models not found');
      }

      // Calculate expected scores based on current ELO ratings
      const expectedSelectedScore = 1 / (1 + Math.pow(10, (notSelectedModel.eloScore - selectedModel.eloScore) / 400)); // ELO formula

      // Update ELO scores for both models
      const updatedSelectedElo = Math.round(selectedModel.eloScore + kFactor * (1 - expectedSelectedScore));
      const updatedNotSelectedElo = Math.round(notSelectedModel.eloScore + kFactor * expectedSelectedScore);

      // Update models in the database with wins/losses, votes, and ELO
      await Promise.all([
        Model.findOneAndUpdate(
          { _id: selectedModel._id }, // Use _id for unique identification
          { $inc: { wins: 1, votes: 1 }, eloScore: updatedSelectedElo } // Update wins, votes, and ELO
        ),
        Model.findOneAndUpdate(
          { _id: notSelectedModel._id }, // Use _id for unique identification
          { $inc: { losses: 1, votes: 1 }, eloScore: updatedNotSelectedElo } // Update losses, votes, and ELO
        ),
      ]);
      // console.log('WIN: "' + selectedModel.name + '"; LOSS: "' + notSelectedModel.name + '";');
      await saveUserLog(userId, questionId, selectedAnswer, notSelectedAnswer, false, votes);
    }

    // Save the user log to the users collection
    // await saveUserLog(userId, questionId, selectedAnswer, notSelectedAnswer, neitherSelected);

    res.status(200).send('Answers saved and ELO scores updated'); // Send success message with updated information
  } catch (error) {
    console.error('Error saving answer and updating ELO:', error);
    res.status(500).send('Internal server error'); // Send error message
  }
});