import { createContext, useContext, useState } from 'react';

const gemini_path = '`${process.env.BACKEND_URL}/api/get-gemini';
const gpt_3_5_path = '`${process.env.BACKEND_URL}/api/get-gpt-3-5';
const gpt_4_path = '`${process.env.BACKEND_URL}/api/get-gpt-4';
const claude_3_sonnet_path = '`${process.env.BACKEND_URL}/api/get-claude-3-sonnet';
const claude_3_opus_path = '`${process.env.BACKEND_URL}/api/get-claude-3-opus';
const mistral_large_path = '`${process.env.BACKEND_URL}/api/get-mistral-large';
const mistral_medium_path = '`${process.env.BACKEND_URL}/api/get-mistral-medium';

const DataContext = createContext();

export function useData() {
    return useContext(DataContext);
}

export function QuestionIndex({ children }) {

    const [userId, setUserId] = useState(null);
    const [language, setLanguage] = useState('');
    const [numQuestions, setNumQuestions] = useState(0);

    // demographics data
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('');
    const [education, setEducation] = useState('');
    const [profession, setProfession] = useState('');
    const [employer, setEmployer] = useState('');
    const [experience, setExperience] = useState('');
    const [theranosticExpertise, setTheranosticExpertise] = useState(5);

    const llmName = ['gemini 1.0', 'GPT-3.5', 'GPT-4', 'Claude-3 sonnet', 'Claude-3 opus', 'Mistral Large', 'Mistral Medium'];
    // State variables for progress and study completion
    const [progress, setProgress] = useState(0);
    const [isStudyFinished, setIsStudyFinished] = useState(false);
    // Constants for question count and maximum questions
    const MAX_QUESTIONS = 10;

    const [questionIndex, setQuestionIndex] = useState(0);
    const [questionId, setQuestionId] = useState('');
    const [selectedAnswer, setSelectedAnswer] = useState("nothing selected");
    const [llm, setLLM] = useState("");
    const [llmPath, setLLMPath] = useState({
        left: getRandomUniqueIndices(llmName.length, 2),
        right: getRandomUniqueIndices(llmName.length, 2),
    });

    const handleProgressUpdate = () => {
        if (progress < MAX_QUESTIONS * 10) { // Check if progress hasn't reached the maximum
            setProgress(progress + 10);
        } else {
            setIsStudyFinished(true);
        }
    };
    const resetStudyState = () => {
        setProgress(0);
        setQuestionIndex(0);
        setIsStudyFinished(false);
        setSelectedAnswer("nothing selected");
        setLLM({});
        setLLMPath({ left: [], right: [] });
    };

    const fetchLLM = () => {
        // Randomly choose two distinct LLM indices (prevent duplicates)
        const llmIndices = getRandomUniqueIndices(llmName.length, 2);

        const llmLeft = llmName[llmIndices[0]];
        const llmRight = llmName[llmIndices[1]];

        setLLM({ left: llmLeft, right: llmRight });
        // console.log(llm.left);


        // Set LLM paths based on chosen names
        const leftPath = chooseLLMPath(llmLeft);
        const rightPath = chooseLLMPath(llmRight);

        setLLMPath({ left: leftPath, right: rightPath });

        console.log(
            `LLMs set to:
            Left: ${llmLeft} (${leftPath}),
            Right: ${llmRight} (${rightPath})`
          );
        // console.log("Selected answer:",);
    };

    // set random questionIndex according to german, english or english and german question
    const fetchQuestion = (callback) => {
        const questionIndices = getRandomUniqueIndices(numQuestions, 1);
        setQuestionIndex(questionIndices);
        if (callback) {
            callback(questionIndices); // Call the provided callback with the new index
        }
    };

    // Helper function to get two random unique indices within a range
    function getRandomUniqueIndices(range, numIndices) {
        const indices = [];
        while (indices.length < numIndices) {
            const randomIndex = Math.floor(Math.random() * range);
            if (!indices.includes(randomIndex)) {
                indices.push(randomIndex);
            }
        }
        return indices;
    }

    // Function to choose API path based on LLM name
    function chooseLLMPath(llm) {
        switch (llm) {
            case 'gemini 1.0':
                return gemini_path;
            case 'GPT-3.5':
                return gpt_3_5_path;
            case 'GPT-4':
                return gpt_4_path;
            case 'Claude-3 sonnet':
                return claude_3_sonnet_path;
            case 'Claude-3 opus':
                return claude_3_opus_path;
            case 'Mistral Large':
                return mistral_large_path;
            case 'Mistral Medium':
                return mistral_medium_path;
            default:
                return undefined; // Handle unexpected LLM names
        }
    }
    const nextQuestion = (answer) => {
        // Increment the index to show the next question
        // setQuestionIndex((prevIndex) => prevIndex + 1);
        fetchQuestion((newQuestionIndex) => {
            setQuestionIndex(newQuestionIndex);
        });

        fetchLLM(answer);
        if (answer) {
            handleAnswerSelection(answer);
        }
        handleProgressUpdate();
    };


    const handleAnswerSelection = async (selectedAnswer) => {
        const notSelectedAnswer = llm.left === selectedAnswer ? llm.right : llm.left;
        console.log('selected Answer: ' + selectedAnswer);

        try {
            const response = await fetch('`${process.env.BACKEND_URL}/api/save-answer', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }, // Set headers if needed
                body: JSON.stringify({ // Ensure data is properly formatted
                    userId,
                    selectedAnswer,
                    notSelectedAnswer,
                    questionId,
                }),
            });

            if (response.ok) {
                console.log('Answer saved successfully!');
                // Handle success (e.g., move to next question)
            } else {
                console.error('Error saving answer:', response.statusText);
                // Handle error
            }
        } catch (error) {
            console.error('Error sending request:', error);
            // Handle network errors
        } finally {
            // Reset selectedAnswer after the request is sent
            setSelectedAnswer(null);
        }
        // return new Promise((resolve) => {
        //     // Resolve the promise after completing answer selection logic
        //     resolve();
        // });
    };


    return (
        <DataContext.Provider
            value={{
                userId,
                setUserId,
                language,
                setLanguage,
                numQuestions,
                setNumQuestions,
                age, setAge,
                gender, setGender,
                education, setEducation,
                profession, setProfession,
                employer, setEmployer,
                experience, setExperience,
                theranosticExpertise, setTheranosticExpertise,
                progress,
                handleProgressUpdate,
                questionIndex,
                questionId,
                setQuestionId,
                nextQuestion,
                selectedAnswer,
                setSelectedAnswer,
                fetchLLM,
                llm,
                llmPath,
                handleAnswerSelection,
                isStudyFinished,
                resetStudyState,
            }}
        >
            {children}
        </DataContext.Provider>
    );
}