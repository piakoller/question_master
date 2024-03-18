// filename Question.js
import React, { useState, useEffect } from 'react';

import { useData } from './QuestionIndex';

const Question = () => {
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState(null);

  const { questionIndex, setNumQuestions, setQuestionId, language } = useData();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/get-question`);
        if (!response.ok) {
          throw new Error('Failed to fetch questions.');
        }

        const data = await response.json();
        // Filter questions based on language
        const filteredQuestions = language === 'both'
          ? data
          : data.filter(question => question.language === language);

        // setQuestions(data);
        // setNumQuestions(data.length - 1);

        setQuestions(filteredQuestions);
        setNumQuestions(filteredQuestions.length);

        // console.log(data.language);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchQuestions();
  }, [setNumQuestions, language]);

  useEffect(() => {
    if (questions.length > 0 && questionIndex < questions.length) {
      setQuestionId(questions[questionIndex].questionId);
    }
  }, [questionIndex, questions, setQuestionId]);

  return (
    <div>
      {questions.length > 0 && questionIndex < questions.length ? (
        <>
          <h1>{questions[questionIndex].question}</h1>
          {questions[questionIndex].questionId}
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Question;
