import { LinearProgress } from '@mui/material';

import { useData } from './QuestionIndex';

const ProgressBar = () => {
    const {progress} = useData();

    
    return(
        <LinearProgress variant="determinate" value={progress} />
    );
};
export default ProgressBar;