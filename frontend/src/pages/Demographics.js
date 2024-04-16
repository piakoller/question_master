import { Link } from 'react-router-dom';
import { createBrowserHistory } from 'history';

import React, { useEffect, useState } from 'react';

import { useData } from '../components/QuestionIndex';
import Footer from '../components/Footer';

import { Grid, FormControl, Select, MenuItem, TextField, Slider, Box, InputLabel, Checkbox, Snackbar, Alert } from '@mui/material';

import './stylesheet.css';

const Demographics = () => {
    const { userId, language, setLanguage, nextQuestion,
        age, setAge,
        gender, setGender,
        education, setEducation,
        profession, setProfession,
        employer, setEmployer,
        experience, setExperience,
        theranosticExpertise, setTheranosticExpertise, } = useData();

    const history = createBrowserHistory();
    const [otherProfession, setOtherProfession] = useState('');
    const [saveProfession, setSaveProfession] = useState('');

    const [open, setOpen] = useState(false);
    const [isChecked, setIsChecked] = useState(false); // checking checkbox
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [missingFields, setMissingFields] = useState([]);
    const [allFilled, setAllFilled] = useState(false);

    const languages = [
        { value: 'german', label: 'German' },
        { value: 'english', label: 'English' },
        { value: 'both', label: 'German and English' }
    ]

    const genders = [
        { value: 'male', label: 'Male' },
        { value: 'female', label: 'Female' },
        { value: 'other', label: 'Other' },
        { value: 'nothing', label: 'Prefer not to say' },
    ];

    const educationLevels = [
        { value: 'highschool', label: 'High School Diploma' },
        { value: 'bachelor', label: 'Bachelor\'s Degree' },
        { value: 'master', label: 'Master\'s Degree' },
        { value: 'doctor', label: 'Doctoral Degree (Ph.D., MD, etc.)' },
        { value: 'certification', label: 'Professional Certification' },
        { value: 'other', label: 'Other' },
    ];

    const professionLevels = [
        { value: 'nuclear', label: 'Nuclear Medicine Physician' },
        { value: 'cardio', label: 'Cardiologist' },
        { value: 'neuro', label: 'Neurologist' },
        { value: 'onco', label: 'Oncologist' },
        { value: 'surgeon', label: 'Surgeon'},
        { value: 'scientist', label: 'Basic scientist (e.g. Biologist/Biochemist/Physiologist/Biomedical Engineer)', shortLabel: 'Basic scientist' },
        { value: 'pharma', label: 'Pharmacist' },
        { value: 'radio', label: 'Radio Protection Officer' },
        { value: 'radiopharma', label: 'Radiopharmacist/Radiochemist' },
        { value: 'radiotherapie', label: 'Radiotherapist (Radiation Onologist)' },
        { value: 'radiologist', label: 'Radiologist' },
        { value: 'compscience', label: 'Computer Scientist' },
        { value: 'engineer', label: 'Physicist/Engineer' },
        { value: 'nurse', label: 'Nurse/Technologist/Radiographer' },
        { value: 'student', label: 'Student' },
        { value: 'other', label: 'Others (please specify)' },
        { value: 'na', label: 'Prefer not to answer' },
    ]

    const employerLevels = [
        { value: 'academic', label: 'Academic' },
        { value: 'publicHospital', label: 'Public hospital/instiution' },
        { value: 'privateHospital', label: 'Private hospital/entity' },
        { value: 'commercial', label: 'Commercial ogranisation' },
        { value: 'nonProfit', label: 'Other non-for-profit organisation' },
        { value: 'others', label: 'Other (please specify)' },
        { value: 'notApplicable', label: 'Not Applicable' },
    ]

    // Function to submit data to backend
    const submitDemographics = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/save-demographics/${userId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId,
                    age,
                    gender,
                    education,
                    language,
                    profession,
                    employer,
                    experience,
                    theranosticExpertise,
                }),
            });

            if (response.ok) {
                console.log('Demographics submitted successfully');
                nextQuestion('demographics'); // Update progress after successful submission
                history.push(`/study/${userId}`);
            } else {
                console.error('Error submitting demographics:', await response.text());
            }
        } catch (error) {
            console.error('Error submitting demographics:', error);
        }
    };

    const handleSkip = () => {
        setAge(0);
        setGender('female');
        setEducation('master');
        setLanguage('both');
        setProfession('nuclear');
        setEmployer('academic');
        setExperience(0);
        setTheranosticExpertise(0);
    };

    const handleCheckboxChange = (event) => {
        setIsChecked(event.target.checked);
    };

    const handleNextClick = () => {
        const missing = []; // Array to store missing fields

        if (age === '' || age < 16) {
            missing.push('Age');
        } if (gender === '') {
            missing.push('Gender');
        } if (education === '') {
            missing.push('Education');
        } if (language === '') {
            missing.push('Language');
        } if (profession === '') {
            missing.push('Profession');
        } if (employer === '') {
            missing.push('Employer');
        }

        // Update missing fields state
        setMissingFields(missing);

        // Open snackbar for missing fields
        if (missing.length > 0) {
            setOpenSnackbar(true);
        }
    };

    useEffect(() => {
        const allFilled = [age, gender, education, language, profession, employer].every(field => field !== '');
        setAllFilled(allFilled);
    }, [age, gender, education, language, profession, employer]);

    const handleProfessionChange = (value) => {
        setOtherProfession(value);
        if (value === 'other') {
            setSaveProfession(value); // Save only when profession is "other"
        } else {
            setProfession(value); // Update profession for other options
        }
    };


    return (
        <div className='page'>
            <div className='headline'>
                <h1>Personal Information</h1>
                <p>By selecting a language in 'Language of the Study' you choose if the displayed questions are only in german, only in english or german and english.</p>
            </div>
            <div className='text'>
                <div className='info-container'>
                    {/* Age, Gender, Education, and Language */}
                    <Grid container spacing={5}>
                        <Grid item xs={12} sm={6} md={3}>
                            {/* Age */}
                            <FormControl sx={{ m: 1, minWidth: '100%' }}>
                                <TextField
                                    required
                                    label="Age"
                                    type="number"
                                    value={age}
                                    onChange={(event) => setAge(event.target.value)}
                                    // Check if user is younger than 16
                                    error={age === '' && age < 16}
                                    helperText={age && age < 16 ? "You must be 16 years or older to proceed." : ""}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            {/* Gender */}
                            <FormControl sx={{ m: 1, minWidth: '100%' }}>
                                <InputLabel id="gender-label">Gender</InputLabel>
                                <Select
                                    labelId="gender-label"
                                    id="gender"
                                    label="Gender"
                                    value={gender}
                                    onChange={(e) => setGender(e.target.value)}
                                    sx={{ minHeight: 50 }}
                                >
                                    {genders.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                    {/* Gender options */}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            {/* Education */}
                            <FormControl sx={{ m: 1, minWidth: '100%' }}>
                                <InputLabel id="education-label">Education</InputLabel>
                                <Select
                                    labelId="education-label"
                                    id="education"
                                    label="Education"
                                    value={education}
                                    onChange={(e) => setEducation(e.target.value)}
                                >
                                    {educationLevels.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                    {/* Education options */}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            {/* Language */}
                            <FormControl sx={{ m: 1, minWidth: '100%' }}>
                                <InputLabel id="language-label">Language of the Study</InputLabel>
                                <Select
                                    labelId="language-label"
                                    id="language"
                                    label="Language of the Study"
                                    value={language}
                                    onChange={(e) => setLanguage(e.target.value)}
                                >
                                    {languages.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                    {/* Language options */}
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                    {/* </div> */}
                </div>
                <div className='grid-field'>
                    <Grid container spacing={2}>
                        {/* Profession */}
                        <Grid item xs={12} sm={6} md={4}>
                            <p id="profession-label" className='headline'>What is your <b>profession</b>?</p>
                            <FormControl sx={{ m: 1, minWidth: '100%' }}>
                                <InputLabel id="profession-label">Profession</InputLabel>
                                <Select
                                    labelId="profession-label"
                                    id="profession"
                                    label="Profession"
                                    value={profession}
                                    onChange={(e) => setProfession(e.target.value)}
                                    open={open}
                                    onOpen={() => setOpen(true)} // Update open on open event
                                    onClose={() => setOpen(false)}
                                >
                                    {professionLevels.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {(option.value === 'scientist' && !open) ? ( // Display based on open state or scientist selection
                                                // Use shortLabel if available, otherwise fallback to label
                                                option.shortLabel
                                                // ) : (option.value === 'other') ? (
                                                //     handleProfessionChange('other')
                                            ) : (
                                                option.label
                                            )}
                                        </MenuItem>
                                    ))}
                                    {/* Profession options */}
                                </Select>
                            </FormControl>
                        </Grid>
                        {/* Years of Experience */}
                        <Grid item xs={12} sm={6} md={4}>
                            <p className='headline'>How many <b>years of experience</b> do you have in your profession?</p>
                            <FormControl sx={{ m: 1, minWidth: '100%' }}>
                                <TextField
                                    required
                                    label="Years of Experience"
                                    type="number"
                                    value={experience}
                                    onChange={(event) => setExperience(event.target.value)}
                                />
                            </FormControl>
                        </Grid>
                        {/* Employer */}
                        <Grid item xs={12} sm={6} md={4}>
                            <p className='headline'>What is your current <b>employer</b>?</p>
                            <FormControl sx={{ m: 1, minWidth: '100%' }}>
                                <InputLabel id="employer-label">Employer</InputLabel>
                                <Select
                                    required
                                    labelId="employer-label"
                                    id="employer"
                                    label="Employer"
                                    value={employer}
                                    onChange={(e) => setEmployer(e.target.value)}
                                >
                                    {employerLevels.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                    {/* Employer options */}
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                </div>
                <Box sx={{ width: '100%' }}>
                    <FormControl sx={{ m: 1, minWidth: '30%' }}>
                        {saveProfession === 'other' && (  // Display TextField only if profession is "other"
                            <TextField
                                id="other-profession"
                                label="Specify Profession"
                                value={otherProfession} // State variable for other profession input
                                onChange={(e) => handleProfessionChange(e.target.value)} // Update otherProfession state
                                sx={{ mt: 1 }} // Add top margin for spacing
                            />
                        )}
                    </FormControl>
                </Box>
                <label>
                    {/* Theranostics Expertise */}
                    <div className='slider-container'>
                        <Box sx={{ width: '100%' }}>
                            <p>How familiar are you with <b>theranostics</b>? <br />Slide the bar to indicate your level of expertise. (0 - Never heard of it  |  10 - Dealing with it daily)</p>
                            <Box sx={{ width: '100%' }}>
                                <Slider
                                    aria-label="Temperature"
                                    defaultValue={5}
                                    onChange={(event, newValue) => setTheranosticExpertise(newValue)}
                                    valueLabelDisplay="auto"
                                    shiftStep={1}
                                    step={1}
                                    marks
                                    min={0}
                                    max={10}
                                    className="custom-slider"
                                />
                            </Box>
                        </Box>
                    </div>
                </label>
                <div className="checkbox">
                    <Checkbox
                        id="understand"
                        checked={isChecked}
                        onChange={handleCheckboxChange}
                        color="primary"
                    />
                    <label htmlFor="understand">I confirm that all the information is correct.</label>
                </div>
                <Snackbar
                    open={openSnackbar}
                    autoHideDuration={6000} // Close snackbar after 6 seconds
                    onClose={() => setOpenSnackbar(false)}
                >
                    {!isChecked && missingFields.length > 0 ? (
                        <Alert severity="warning">Please check the confirmation box before proceeding.</Alert>

                    ) : (
                        <Alert severity="warning">
                            Please fill out the following missing fields: {missingFields.join(', ')}
                        </Alert>
                    )}
                </Snackbar>
                {/* Display Button with Link when Checkbox is checked and all Fields are filled */}
                {isChecked && allFilled ? (
                    <Link to={`/study/${userId}`} state={{ isChecked, allFilled }}>
                        <button className='button right blue' onClick={submitDemographics}>
                            Next &rarr;
                        </button>
                    </Link>
                ) : (
                    <button className='button right blue' onClick={handleNextClick}>
                        Next &rarr;
                    </button>
                )}
                {/* skipping input fields */}
                {/* <button onClick={handleSkip}>skip</button> */}
            </div>
            <Footer />
        </div>
    );
};

export default Demographics;