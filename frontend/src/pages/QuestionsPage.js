// Filename - pages/QuestionsPage.js

import React, { useEffect, useState } from 'react';
import './stylesheet.css'
import { Link, useParams } from 'react-router-dom';

import { useData } from '../components/QuestionIndex';
import { useNavigate } from 'react-router-dom';

import Feedback from '../components/Feedback'
import Footer from '../components/Footer';

import Question from '../components/Question'
import AnswerLeft from "../components/AnswersLeft";
import AnswerRight from "../components/AnswersRight";
import ProgressBar from '../components/ProgressBar';

const QuestionsPage = () => {
    const { fetchLLM, setUserId, setNeitherSelected, nextQuestion, isStudyFinished } = useData();
    const { userId } = useParams();

    const notesLabel = 'Enter your Comments or Feedback';
    const buttonText = 'Submit';
    const snackbarMessage = 'Your feedback has been submitted!';
    const category = 'feedback';

    const [questions, setQuestions] = useState([]); // Array to store user-added questions

    const navigate = useNavigate();

    useEffect(() => {
        setUserId(userId);
        const fetchAnswers = async () => {
            fetchLLM();
        };

        fetchAnswers();
    }, []);

    const handleClick = () => {
        setNeitherSelected(true);
        if (isStudyFinished) {
            navigate('/thank-you'); // Navigate to thank-you page if study is finished
            return;
        }
        nextQuestion("null");
    }

    return (
        <div className='page'>
            <ProgressBar></ProgressBar>
            <Link to={`/demographics/${userId}`}>
                <button className='button left'>Go Back</button>
            </Link>
            <div className='headline'>
                <Question></Question>

                <p className='headline'>Choose the better fitting answer. <br /> If you can't decide or both answers are inccorect choose "Neither"</p>
                <button className='button blue' onClick={() => { handleClick() }}>Neither</button>
            </div>
            <div className='question'>
                <div className='grid'>
                    {/* Answer from LLM A */}
                    <div className="left-component">
                        <AnswerLeft></AnswerLeft>
                    </div>
                    {/* Answer from LLM B */}
                    <div className='right-component'>
                        <AnswerRight></AnswerRight>
                    </div>
                </div>
            </div>
            {/* The user is able to add Notes or Feedback */}
            <p><strong>Do you have any comments or feedback about the user study, the questions or the answers? <br />Your input helps us improve the user study. Please feel free to add them here:</strong></p>
            <Feedback 
                questions={questions} 
                setQuestions={setQuestions} 
                notesLabel={notesLabel} 
                buttonText={buttonText} 
                snackbarMessage={snackbarMessage}
                category={category}
            />
            <Footer />
        </div>
    );
};

export default QuestionsPage;