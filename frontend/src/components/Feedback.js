
import React, { useState } from "react";

import { useData } from './QuestionIndex';

import TextField from "@mui/material/TextField";
import Grid from '@mui/material/Grid';
import Snackbar from '@mui/material/Snackbar';

const Feedback = ({ questions, setQuestions, notesLabel, buttonText, snackbarMessage, category }) => {
    const { userId } = useData();

    const [newQuestion, setNewQuestion] = useState(""); // State for the new question text
    const [openSnackbar, setOpenSnackbar] = useState(false); // State for Snackbar visibility


    const handleAddQuestion = () => {
        if (newQuestion.trim()) { // Check if question has content
            setQuestions([...questions, newQuestion]); // Add question to state array
            setNewQuestion(""); // Clear input field
            submitQuestion();
            setOpenSnackbar(true); // Open Snackbar after successful submission
        }
    };

    // Function to submit data to backend
    const submitQuestion = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/new-question/${userId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId,
                    newQuestion,
                    category,
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

    const handleSnackbarClose = () => {
        setOpenSnackbar(false);
    };

    return (
        <div className="notes">
            <Grid container spacing={2}>
                <Grid item xs={8}>
                    <TextField
                        label={notesLabel}
                        value={newQuestion}
                        onChange={(e) => setNewQuestion(e.target.value)}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={4}>
                    <button className='button blue' onClick={handleAddQuestion}>{buttonText}</button>

                </Grid>
            </Grid>
            <Snackbar // Render Snackbar component
                open={openSnackbar}
                autoHideDuration={6000} // Set auto-close duration (optional)
                onClose={handleSnackbarClose}
                message={snackbarMessage}
            />
        </div>
    );
}

export default Feedback;
