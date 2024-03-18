import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import { styled } from '@mui/material/styles';
import '../pages/stylesheet.css';

import { useData } from './QuestionIndex';

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
    height: 10,
    borderRadius: 5,
    [`&.${linearProgressClasses.colorPrimary}`]: {
        backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
    },
    [`& .${linearProgressClasses.bar}`]: {
        borderRadius: 5,
        backgroundColor: theme.palette.mode === 'light' ? '#004b93' : '#308fe8',
    },
}));

const ProgressBar = () => {
    const { progress, MAX_QUESTIONS } = useData(); // Set default total to 10

    // Calculate the current question number based on progress (assuming linear progression)
    const currentQuestion = progress / MAX_QUESTIONS;

    return (
        <div>

            <BorderLinearProgress
                variant="determinate"
                value={progress}
                sx={{ display: 'flex', alignItems: 'center' }}
            >
            </BorderLinearProgress>
            <span className="progress">
                Question {currentQuestion} / {MAX_QUESTIONS}
            </span>
        </div>
    );
};

export default ProgressBar;
