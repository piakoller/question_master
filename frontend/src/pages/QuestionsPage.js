// Filename - pages/QuestionsPage.js

import React, { useEffect } from 'react';
import './stylesheet.css'
import { Link, useParams } from 'react-router-dom';

import { useData } from '../components/QuestionIndex';
import Footer from '../components/Footer';

import Question from '../components/Question'
import AnswerLeft from "../components/AnswersLeft";
import AnswerRight from "../components/AnswersRight";
import ProgressBar from '../components/ProgressBar';

const QuestionsPage = () => {
    const { fetchLLM, setUserId, setNeitherSelected, nextQuestion } = useData();
    const { userId } = useParams();


    useEffect(() => {
        setUserId(userId);
        const fetchAnswers = async () => {
            fetchLLM();
        };

        fetchAnswers();
    }, []);

    const handleClick = () => {
        setNeitherSelected(true);
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
            {/* TODO: ADD NOTES FIELD */}
            <Footer />
        </div>
    );
};

export default QuestionsPage;