// Filename - pages/QuestionsPage.js

import React, { useEffect } from 'react';
import './stylesheet.css'
import { Link, useParams } from 'react-router-dom';

import { useData } from '../components/QuestionIndex';

import Question from '../components/Question'
import AnswerLeft from "../components/AnswersLeft";
import AnswerRight from "../components/AnswersRight";
import ProgressBar from '../components/ProgressBar';

const QuestionsPage = () => {
    const { fetchLLM, setUserId } = useData();
    const { userId } = useParams();


    useEffect(() => {
        setUserId(userId);
        const fetchAnswers = async () => {
            fetchLLM();
        };

        fetchAnswers();
    }, []);


    return (
        <div className='page'>
            <ProgressBar></ProgressBar>
            <Link to={`/demographics/${userId}`}>
                <button className='button left'>Go Back</button>
            </Link>
            <div className='headline'>
                <Question></Question>

                <p className='headline'>Choose the better fitting answer</p>
                {/* <button className='button blue' onClick={nextQuestion}>I can't decide</button> */}
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
            {/* TODO: ADD NOTES FIELD */}
        </div>
    );
};

export default QuestionsPage;