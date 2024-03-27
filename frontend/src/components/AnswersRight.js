import React, { useState, useEffect } from 'react';

import { useData } from './QuestionIndex';
import { useNavigate } from 'react-router-dom';

import ReactMarkdown from 'react-markdown';

const AnswerRight = () => {
  const [answers, setAnswers] = useState([]);
  // const [currentAnswerIndex, setCurrentAnswerIndex] = useState(0);
  const [error, setError] = useState(null);

  const { questionIndex, nextQuestion, fetchLLM, llm, llmPath, isStudyFinished, language } = useData();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch(llmPath.right);
        if (!response.ok) {
          throw new Error('Failed to fetch questions.');
        }

        const data = await response.json();
        // fetch new llm when answer is empty 
        if (data[questionIndex].answer === '') {
          console.log('fetching new llm');
          fetchLLM();
        }
        const filteredAnswers = language === 'both'
        ? data
        : data.filter(answer => answer.language === language);

        setAnswers(filteredAnswers);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchQuestions();
  }, [llmPath]);

  const handleClick = () => {
    if (isStudyFinished) {
      navigate('/thank-you'); // Navigate to thank-you page if study is finished
      return;
    }
    nextQuestion(llm.right);
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
          {/* <p>{llm.right}</p> */}
          {answers.length > 0 && questionIndex < answers.length ? (
            // <p dangerouslySetInnerHTML={{ __html: answers[questionIndex].answer.replace(/\n/g, '<br />') }} />
            <ReactMarkdown>{answerText()}</ReactMarkdown>
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </button>
    </div>
  );
};

export default AnswerRight;