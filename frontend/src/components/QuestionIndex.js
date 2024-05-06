import { createContext, useContext, useState, useEffect } from 'react';

const gpt_4_path = `${process.env.REACT_APP_BACKEND_URL}/api/get-gpt-4`;
const gpt_4_naive_path = `${process.env.REACT_APP_BACKEND_URL}/api/get-gpt-4-naive`;
const gpt_4_advanced_path = `${process.env.REACT_APP_BACKEND_URL}/api/get-gpt-4-advanced`;

const claude_3_opus_naive_path = `${process.env.REACT_APP_BACKEND_URL}/api/get-claude-3-opus-naive`;

const gemini_advanced_path = `${process.env.REACT_APP_BACKEND_URL}/api/get-gemini`;
const command_r_plus_advanced_path = `${process.env.REACT_APP_BACKEND_URL}/api/get-command-r-plus-advanced`;

// const gpt_3_5_path = `${process.env.REACT_APP_BACKEND_URL}/api/get-gpt-3-5`;
// const claude_3_sonnet_path = `${process.env.REACT_APP_BACKEND_URL}/api/get-claude-3-sonnet`;
// const mistral_large_path = `${process.env.REACT_APP_BACKEND_URL}/api/get-mistral-large`;
// const mistral_medium_path = `${process.env.REACT_APP_BACKEND_URL}/api/get-mistral-medium`;
// const mixtral_path = `${process.env.REACT_APP_BACKEND_URL}/api/get-mixtral`;
// const llama2_path = `${process.env.REACT_APP_BACKEND_URL}/api/get-llama2`;
// const qwen_path = `${process.env.REACT_APP_BACKEND_URL}/api/get-qwen`;

const DataContext = createContext();

export function useData() {
    return useContext(DataContext);
}

export function QuestionIndex({ children }) {

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

    const [userId, setUserId] = useState();
    const [language, setLanguage] = useState('');
    const [numQuestions, setNumQuestions] = useState(0);

    // demographics data
    // demographics data
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('');
    const [education, setEducation] = useState('');
    const [profession, setProfession] = useState('');
    const [employer, setEmployer] = useState('');
    const [experience, setExperience] = useState('');
    const [theranosticExpertise, setTheranosticExpertise] = useState(5);

    // const llmName = ['gemini 1.0', 'GPT-3.5', 'GPT-4', 'Claude-3 sonnet', 'Claude-3 opus', 'Mistral Large', 'Mistral Medium', 'Mixtral', 'Llama2', 'Qwen'];
    // const llmName = ['gemini 1.0', 'GPT-3.5', 'GPT-4', 'Claude-3 sonnet', 'Claude-3 opus', 'Mistral Large', 'Mistral Medium', 'Mixtral'];
    // const llmName = ['gemini 1.0', 'GPT-4', 'Claude-3 opus', 'Mistral Large', 'Command r plus'];
    const llmName = ['GPT-4', 'GPT-4 Naive RAG', 'GPT-4 Advanced RAG', 'Claude 3 Opus Naive RAG', 'Gemini 1.5 Advanced RAG', 'Command R+ Advanced RAG'];

    // State variables for progress and study completion
    const [progress, setProgress] = useState(10);
    const [isStudyFinished, setIsStudyFinished] = useState(false);
    // Constants for question count and maximum questions
    const MAX_QUESTIONS = 10;

    const [questionIndex, setQuestionIndex] = useState(getRandomUniqueIndices(numQuestions, 1));
    const [questionId, setQuestionId] = useState('');
    const [selectedAnswer, setSelectedAnswer] = useState("nothing selected");
    const [llm, setLLM] = useState("");
    const [llmPath, setLLMPath] = useState({
        left: getRandomUniqueIndices(llmName.length, 2),
        right: getRandomUniqueIndices(llmName.length, 2),
    });
    const [neitherSelected, setNeitherSelected] = useState(false);

    const handleProgressUpdate = () => {
        setProgress(progress + 10);
        const currentQuestion = (progress / MAX_QUESTIONS);
        if (currentQuestion >= 9) {
            setIsStudyFinished(true);
        }
    };
    const resetStudyState = () => {
        setProgress(10);
        setQuestionIndex(getRandomUniqueIndices(numQuestions, 1));
        setIsStudyFinished(false);
        setSelectedAnswer("nothing selected");
        setLLM({});
        setLLMPath({ left: [], right: [] });
    };

    useEffect(() => {
        const fetchUserData = async () => {
            if (userId) {
                try {
                    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/get-user-data?userId=${userId}`, {
                        method: 'GET',
                        headers: { 'Content-Type': 'application/json' },
                    });

                    if (response.ok) {
                        const data = await response.json();
                        setUserId(data.userId);
                        setLanguage(data.demographics.language);
                        setAge(data.demographics.age);
                        setGender(data.demographics.gender);
                        setEducation(data.demographics.education);
                        setProfession(data.demographics.profession);
                        setEmployer(data.demographics.employer);
                        setExperience(data.demographics.experience);
                        setTheranosticExpertise(data.demographics.theranosticExpertise);
                    } else {
                        console.error('Error fetching user data:', response.statusText);
                    }
                } catch (error) {
                    console.error('Error sending request:', error);
                }
            }
        };

        fetchUserData();
    }, [userId]);

    const fetchLLM = () => {
        // Randomly choose two distinct LLM indices (prevent duplicates)
        const llmIndices = getRandomUniqueIndices(llmName.length, 2);

        const llmLeft = llmName[llmIndices[0]];
        const llmRight = llmName[llmIndices[1]];

        setLLM({ left: llmLeft, right: llmRight });


        // Set LLM paths based on chosen names
        const leftPath = chooseLLMPath(llmLeft);
        const rightPath = chooseLLMPath(llmRight);

        setLLMPath({ left: leftPath, right: rightPath });
    };

    // Function to choose API path based on LLM name
    function chooseLLMPath(llm) {
        switch (llm) {
            case 'GPT-4':
                return gpt_4_path;
            case 'GPT-4 Naive RAG':
                return gpt_4_naive_path;
            case 'GPT-4 Advanced RAG':
                return gpt_4_advanced_path;
            case 'Claude 3 Opus Naive RAG':
                return claude_3_opus_naive_path;
            case 'Gemini 1.5 Advanced RAG':
                return gemini_advanced_path;
            case 'Command R+ Advanced RAG':
                return command_r_plus_advanced_path;
            default:
                return undefined; // Handle unexpected LLM names
        }
    }

    const nextQuestion = (answer) => {
        setQuestionIndex(getRandomUniqueIndices(numQuestions, 1))
        console.log(
            `LLMs set to:
            Left: ${llm.left} (${questionId}),
            Right: ${llm.right} (${questionId})`
          );

        fetchLLM();

        if (answer !== 'demographics') {
            handleAnswerSelection(answer);
            handleProgressUpdate();
        }
    };

    const handleAnswerSelection = async (selectedAnswer) => {
        let notSelectedAnswer;
        const votes = [llm.left, llm.right];
        
        if (selectedAnswer === 'null') {
            notSelectedAnswer = 'null';
        } else {
            notSelectedAnswer = llm.left === selectedAnswer ? llm.right : llm.left;
        }
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/save-answer`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }, // Set headers if needed
                body: JSON.stringify({
                    userId,
                    selectedAnswer,
                    notSelectedAnswer,
                    questionId,
                    // neitherSelected,
                    votes,
                    isStudyFinished
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
            setNeitherSelected(false);
        }
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
                MAX_QUESTIONS,
                progress,
                handleProgressUpdate,
                questionIndex,
                questionId,
                setQuestionId,
                nextQuestion,
                neitherSelected,
                setNeitherSelected,
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