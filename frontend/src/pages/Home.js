// Filename - pages/Home.js
import { Link } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { useData } from '../components/QuestionIndex';
import Footer from '../components/Footer';

import React, { useState, useEffect } from "react";
import './stylesheet.css'

const Home = () => {
    const { userId, setUserId } = useData();
    const [isChecked, setIsChecked] = useState(false); // State variable for checkbox
    const [hasUserId, setHasUserId] = useState(false);

    const history = createBrowserHistory();

    useEffect(() => {
        // Check for existing userId on component mount
        if (userId) {
          setHasUserId(true);
        }
      }, [userId]);

    const startUserStudy = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/generate-user-id`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });

            if (response.ok) {
                const { userId } = await response.json();
                setUserId(userId); // Set the userId in the component state
                history.push(`/demographics/${userId}`); // Redirect to the demographics page with userId in the URL
            } else {
                console.error('Error starting user study:', response.statusText);
                // Handle error
            }
        } catch (error) {
            console.error('Error sending request:', error);
            // Handle network errors
        }
    };

    const handleCheckboxChange = (event) => {
        setIsChecked(event.target.checked);
    };

    return (
        <div className='page'>
            <div className='headline'>
                <h1 className='title'>QUESTION MASTER</h1>
                <h1>Help Us Improve Educational Content in Theranostic and Nuclear Medicine with Generative Artificial Intelligence!</h1>
                <p>This user study aims to improve educational materials related to theranostic and nuclear medicine.  <br/><strong>**Please note:** Answers are generated artificially by a large language model and may not be entirely accurate. We recommend consulting with a medical professional for definitive information.</strong></p>
            </div>
            <div className='text'>
                <h2>Why Your Input Matters:</h2>
                <p>We are developing educational resources to educate people about the exciting field of theranostic and nuclear medicine. Your participation will help us ensure the information is clear, accurate, and easy to understand.</p>
                <h2>What to Expect:</h2>
                <ul>
                    <li><strong>The Task:</strong><br/>You will be presented with 10 multiple-choice questions related to theranostic, nuclear medicine, and ITM. Each question will offer two answer options. Please select the answer you believe is more informative and helpful for someone learning about this field. 
                    <br/>If you belive none of the answers are correct or you can't decide, choose the button 'Neither'.
                    <br/>The order of the questions and the answers are randomly selected. It is possible that you will see a question more than once.</li>
                    <li><strong>Anonymity:</strong><br/>Your participation is completely anonymous. We will not collect any personal information that can identify you.</li>
                    <li><strong>Data Usage:</strong><br/>The information you provide will be used solely to improve educational materials in theranostics and nuclear medicine.</li>
                </ul>
                <h2>No Right or Wrong Answers:</h2>
                <p>There are no right or wrong answers in this study. We are simply interested in your perspective on which answer is clearer and easier to understand.</p>
                <h2>Confidentiality</h2>
                <p>Your participation in this study is entirely anonymous. Any personal information provided will be kept confidential and used only for research purposes. Your responses will be aggregated and analyzed collectively, ensuring your privacy and anonymity throughout the study.</p>
                <h2>Thank you for your contribution!</h2>
                <p>By participating, you're helping us create valuable educational resources that can benefit others.</p>
            </div>
            {/* Checkbox and label */}
            <div className="checkbox">
                <input type="checkbox" id="understand" name="understand" value="yes" onChange={handleCheckboxChange} checked={isChecked} />
                <label htmlFor="understand">I confirm that I have read and understood the information provided.</label>
            </div>
            {/* Disable button if not checked */}
            <Link to={`/demographics/${userId}`}>
                <button className='button' disabled={!isChecked} onClick={startUserStudy}>
                    {userId ? 'Continue the User Study' : 'Start the User Study'}
                </button>
            </Link>
            <Footer />
        </div>
    );
};

export default Home;