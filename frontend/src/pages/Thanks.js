import React, { useState } from "react";
import { Link } from 'react-router-dom';

import { useData } from '../components/QuestionIndex';
import Feedback from '../components/Feedback'
import Footer from '../components/Footer';

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";

import './stylesheet.css';

const Thanks = () => {
    const { userId, resetStudyState } = useData();
    const notesLabel = 'Enter your addtional question';
    const buttonText = 'Add Question';
    const snackbarMessage = 'Your question has been submitted!';
    const category = 'question';

    const [questions, setQuestions] = useState([]); // Array to store user-added questions

    return (
        <div className="page">
            <div className="headline">
                <h1>Thank you for participating in this User Study!</h1>
                <p>Are there any additional questions you think Health Care People might ask about ITM, theranostic or nuclear medicine?</p>
            </div>
            {/* The user is able to add addtional Questions to the Evaluation Dataset */}
            <Feedback
                questions={questions}
                setQuestions={setQuestions}
                notesLabel={notesLabel}
                buttonText={buttonText}
                snackbarMessage={snackbarMessage}
                category={category}
            />
            <p><strong>Added Questions</strong></p>
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
            <h2>Want to see more questions? Click "Restart User Study" to answer another set of 10 questions related to ITM, theranostic, or nuclear medicine.</h2>
            <Link to={`/study/${userId}`}>
                <button className='button blue' onClick={resetStudyState}>Restart User Study</button>
            </Link>
            <Footer />
        </div>
    );
};

export default Thanks;
