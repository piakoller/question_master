import React, { useState, useEffect } from 'react';

import { useData } from './QuestionIndex';
import { useNavigate } from 'react-router-dom';

import { marked } from 'marked'
import ReactMarkdown from 'react-markdown';

const AnswerLeft = () => {
  const { questionIndex, nextQuestion, fetchLLM, llm, llmPath, isStudyFinished } = useData();
  const navigate = useNavigate();

  const [answers, setAnswers] = useState([]);
  const [error, setError] = useState(null);

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
        setError(error.message);
      }
    };

    fetchQuestions();
  }, [llmPath, fetchLLM]);

  const handleClick = () => {
    if (isStudyFinished) {
      navigate('/thank-you'); // Navigate to thank-you page if study is finished
      return;
    }
    nextQuestion(llm.left);
  };

  // Function to format answers using marked.parse()
  const formatAnswer = (answerText) => {
    console.log('formattedAnswer');
    const formattedText = answerText
      .replace(/'/g, '"') // Replace single quotes with double quotes
      .replace(/,/g, ', ') // Replace commas with comma and space
      .replace(/\n\n/g, '<br/>') // Replace newlines with line breaks
      .replace(/^\s*\*([\s\S]*?)$/gm, '<ul><li>$1</li></ul>') // Replace asterisks with unordered list
      .replace(/^\s*-(?!-)([\s\S]*?)$/gm, '<li>$1</li>'); // Replace hyphens with list items

    return formattedText;
  };

  return (
    <div>
      <button className='answer' onClick={() => { handleClick() }}>
        <div>
          <p>{llm.left}</p>
          {answers.length > 0 && questionIndex < answers.length ? (
            <>
              {console.log(llm.left === 'gemini 1.0')}
              {llm.left === 'gemini 1.0' ? (
                <p>
                  {answers[questionIndex].answer
                    .replace(/'/g, '"')
                    .replace(/,/g, ', ')
                    .replace(/\n/g, '<br/>')
                    .replace(/^\s*\*([\s\S]*?)$/gm, '<ul><li>$1</li></ul>')
                    .replace(/^\s*-(?!-)([\s\S]*?)$/gm, '<li>$1</li>')
                  }
                </p>
              ) : (
                <ReactMarkdown>{answers[questionIndex].answer}</ReactMarkdown>
              )}
            </>
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </button>
    </div>

  );
};

export default AnswerLeft;