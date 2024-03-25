import React, { useState, useEffect } from 'react';

import { useData } from './QuestionIndex';
import { useNavigate } from 'react-router-dom';

import ReactMarkdown from 'react-markdown';

const AnswerLeft = () => {
  const { questionIndex, nextQuestion, fetchLLM, llm, llmPath, isStudyFinished } = useData();
  const navigate = useNavigate();

  const [answers, setAnswers] = useState([]);

  // const [isAnswerSelected, setIsAnswerSelected] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch(llmPath.left);
        if (!response.ok) {
          throw new Error('Failed to fetch questions.');
        }

        const data = await response.json();
        // fetch new llm when answer is empty 
        if (data[questionIndex].answer === '' || data[questionIndex].answer === "") {
          console.log('fetching new llm');
          fetchLLM();
        }

        setAnswers(data);
      } catch (error) {
        console.error('Error fetching LLM', error);
      }
    };

    fetchQuestions();
    // eslint-disable-next-line
  }, [llmPath, fetchLLM]);

  const handleClick = () => {
    if (isStudyFinished) {
      navigate('/thank-you'); // Navigate to thank-you page if study is finished
      return;
    }
    nextQuestion(llm.left);
  };

  const answerText = () => {
    const text = answers[questionIndex].answer;
    // console.log(text);
    return text;
  }

  return (
    <div>
      <button className='answer' onClick={() => { handleClick() }}>
        <div>
          {/* <p>{llm.left}</p> */}
          {answers.length > 0 && questionIndex < answers.length ? (
            <ReactMarkdown>{answerText()}</ReactMarkdown>
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </button>
    </div>

  );
};

export default AnswerLeft;