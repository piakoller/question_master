import React, { useState } from "react";
import { Link } from 'react-router-dom';

import { useData } from '../components/QuestionIndex';

import TextField from "@mui/material/TextField";
import Grid from '@mui/material/Grid';
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";

import './stylesheet.css';


const Thanks = () => {
    const { userId, resetStudyState } = useData();


    const [questions, setQuestions] = useState([]); // Array to store user-added questions
    const [newQuestion, setNewQuestion] = useState(""); // State for the new question text

    const handleAddQuestion = () => {
        if (newQuestion.trim()) { // Check if question has content
            setQuestions([...questions, newQuestion]); // Add question to state array
            setNewQuestion(""); // Clear input field
        }
        submitQuestion();
    };
    // Function to submit data to backend
    const submitQuestion = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/new-question/${userId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId,
                    newQuestion
                }),
            });

            if (response.ok) {
                console.log('Question submitted successfully');
            } else {
                console.error('Error submitting question:', await response.text());
            }
        } catch (error) {
            console.error('Error submitting question:', error);
        }
    };


    return (
        <div className="page">
            <div className="headline">
                <h1>Thank you for participating in this User Study!</h1>
                <p>Are there any additional questions you think Health Care People might ask about ITM, theranostic or nudlear medicine?</p>
            </div>
            <Grid container spacing={2}>
                <Grid item xs={8}>
                    <TextField
                        label="Enter your question"
                        value={newQuestion}
                        onChange={(e) => setNewQuestion(e.target.value)}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={4}>
                    <button className='button blue' onClick={handleAddQuestion}>Add Question</button>

                </Grid>
            </Grid>

            <h2>Added Questions</h2>
            {questions.length > 0 ? (
                <List dense={false}>
                    {questions.map((question, index) => (
                        <ListItem key={index}>
                            <ListItemText primary={question} />
                        </ListItem>
                    ))}
                </List>
            ) : (
                <p>No additional questions added yet.</p>
            )}
            <Link to='/study'>
                <button className='button blue' onClick={resetStudyState}>Restart User Study</button>
            </Link>
        </div>
    );
};

export default Thanks;
