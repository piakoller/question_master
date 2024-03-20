import { Link, useParams } from 'react-router-dom';
import React, { useEffect } from 'react';

import { useData } from '../components/QuestionIndex';
import Footer from '../components/Footer';

import { Grid, FormControl, Select, MenuItem, TextField, Slider, Box, InputLabel } from '@mui/material';

import './stylesheet.css';

const Demographics = () => {
    // const { userId } = useParams();

    const { userId, language, setLanguage, nextQuestion,
        age, setAge,
        gender, setGender,
        education, setEducation,
        profession, setProfession,
        employer, setEmployer,
        experience, setExperience,
        theranosticExpertise, setTheranosticExpertise, } = useData();

    const languages = [
        { value: 'german', label: 'German' },
        { value: 'englisch', label: 'English' },
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
        { value: 'scientist', label: 'Basic scientist (e.g. Biologist/Biochemist/Physiologist/Biomedical' },
        { value: 'pharma', label: 'Pharmacist' },
        { value: 'radio', label: 'Radio Protection Officer' },
        { value: 'radiopharma', label: 'Radiopharamcist/Radiochemist' },
        { value: 'radiotherapie', label: 'Radiotherapist (Radioation Onologist)' },
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

    return (
        <div className='page'>
            <div className='headline'>
                <h1>Personal Information</h1>
            </div>
            <div className='text'>
                <div className='info-container'>
                    {/* Age, Gender, Education, and Language */}
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} md={3}>
                            {/* Age */}
                            <FormControl required sx={{ m: 1, minWidth: '100%' }}>
                                <TextField
                                    label="Age"
                                    type="number"
                                    value={age}
                                    onChange={(event) => setAge(event.target.value)}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            {/* Gender */}
                            <FormControl required sx={{ m: 1, minWidth: '100%' }}>
                                <InputLabel id="gender-label">Gender</InputLabel>
                                <Select
                                    labelId="gender-label"
                                    id="gender"
                                    label="Gender"
                                    value={gender}
                                    onChange={(e) => setGender(e.target.value)}
                                >
                                    {/* Gender options */}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            {/* Education */}
                            <FormControl required sx={{ m: 1, minWidth: '100%' }}>
                                <InputLabel id="education-label">Education</InputLabel>
                                <Select
                                    labelId="education-label"
                                    id="education"
                                    label="Education"
                                    value={education}
                                    onChange={(e) => setEducation(e.target.value)}
                                >
                                    {/* Education options */}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            {/* Language */}
                            <FormControl required sx={{ m: 1, minWidth: '100%' }}>
                                <InputLabel id="language-label">Language of the Study</InputLabel>
                                <Select
                                    labelId="language-label"
                                    id="language"
                                    label="Language of the Study"
                                    value={language}
                                    onChange={(e) => setLanguage(e.target.value)}
                                >
                                    {/* Language options */}
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                </div>
                <div className='grid-field'>
                    {/* Description and corresponding fields */}
                    <Grid container spacing={2}>
                        {/* Profession Description */}
                        <Grid item xs={12} sm={6} md={4}>
                            <div className="grid-field">
                                <p className='headline'>What is your <b>profession</b>?</p>
                            </div>
                        </Grid>
                        {/* Profession Field */}
                        <Grid item xs={12} sm={6} md={4}>
                            <div className="grid-field">
                                <FormControl required sx={{ m: 1, minWidth: '100%' }}>
                                    <InputLabel id="profession-label">Profession</InputLabel>
                                    <Select
                                        labelId="profession-label"
                                        id="profession"
                                        label="Profession"
                                        value={profession}
                                        onChange={(e) => setProfession(e.target.value)}
                                    >
                                        {professionLevels.map((option) => (
                                            <MenuItem key={option.value} value={option.value}>
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </div>
                        </Grid>
                        {/* Years of Experience Description */}
                        <Grid item xs={12} sm={6} md={4}>
                            <div className="grid-field">
                                <p className='headline'>How many <b>years of experience</b> do you have in your profession?</p>
                            </div>
                        </Grid>
                        {/* Years of Experience Field */}
                        <Grid item xs={12} sm={6} md={4}>
                            <div className="grid-field">
                                <FormControl required sx={{ m: 1, minWidth: '100%' }}>
                                    <TextField
                                        label="Years of Experience"
                                        type="number"
                                        value={experience}
                                        onChange={(event) => setExperience(event.target.value)}
                                    />
                                </FormControl>
                            </div>
                        </Grid>
                        {/* Employer Description */}
                        <Grid item xs={12} sm={6} md={4}>
                            <div className="grid-field">
                                <p className='headline'>What is your current <b>employer</b>?</p>
                            </div>
                        </Grid>
                        {/* Employer Field */}
                        <Grid item xs={12} sm={6} md={4}>
                            <div className="grid-field">
                                <FormControl required sx={{ m: 1, minWidth: '100%' }}>
                                    <InputLabel id="employer-label">Employer</InputLabel>
                                    <Select
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
                                    </Select>
                                </FormControl>
                            </div>
                        </Grid>
                    </Grid>

                </div>
                <label>
                    {/* Theranostics Expertise */}
                    <div className='slider-container'>
                        <Box sx={{ width: '100%' }}> {/* Adjusted width */}
                            <p>On a scale of 1-10 what is your <b>expertise about theranostics</b>?</p>
                            <Box sx={{ width: '100%' }}> {/* Adjusted width */}
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
                <Link to={`/study/${userId}`}>
                    <button className='button right blue' onClick={submitDemographics}>
                        Next &rarr;
                    </button>
                </Link>
                <button onClick={handleSkip}>skip</button>
            </div>
            <Footer />
        </div>
    );
};

export default Demographics;