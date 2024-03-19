import React from 'react';
import {useNavigate} from 'react-router-dom';
import { useData } from '../components/QuestionIndex';

import { TableContainer, Table, TableHead, TableBody, TableRow, TableCell } from '@mui/material';

import './stylesheet.css'

const Impressum = () => {
    const { userId } = useData();
    const navigate = useNavigate();

    const rows = [
        { actionTopic: 'Calling up the Website', userStudy: 'Age, Gender, Education, Profession, Years of Experience in that Profession, Employer, Knowledge of Theranostics' },
        { actionTopic: 'Description and purpose of the data processing', userStudy: '' },
        { actionTopic: 'Interest in data processing', userStudy: '' },
        { actionTopic: 'Who receives and who processes the data', userStudy: '' },
        { actionTopic: 'How long data are stored for', userStudy: '' },
        { actionTopic: 'Legal basis', userStudy: 'Art. 6 Para. 1 a) GDPR' },
        { actionTopic: 'Provision prescribed or required', userStudy: 'The provision of the personal data is neither legally nor contractually prescribed. However, registration cannot take place without it' },
    ];
    const goBack = () => {
        navigate('/');
    };


    return (
        // TODO ADD BUTTON TO GO BACK
        <div className="page">
            <button className="button left" onClick={goBack}>Go Back</button>

            <h1 className='headline'>Impressum</h1>
            <h2>Provider</h2>
            <p>ITM Isotope Technologies Munich SE</p>
            <h2>Contact</h2>
            <p> Pia Koller<br />
                ITM Isotope Technologies Munich SE<br />
                Lichtenbergstr. 1<br />
                85748 Garching bei München<br />
                Germany<br />
                Tel.: +49 89 329 89 86 6000</p>
            <p>Email: info@itm-radiopharma.com<br />
                Website: www.itm-radiopharma.com
            </p>

            <h1>Privacy Policy</h1>
            <p>Thank you for your interest in our company. Data protection is particularly important to the management of ITM Isotope Technologies Munich SE. In principle, it is possible to use the Internet pages of ITM Isotope Technologies Munich SE without entering any personal data. However, if an individual would like to use our company's specific services via our website, we may have to process personal data. If it is necessary, without legal basis, to process personal data, we generally gain the consent of the Data Subject.
                The processing of personal data, such as the name, address, e-mail address or telephone number of a Data Subject, will always be carried out in accordance with the General Data Protection Regulation and in accordance with the country-specific data protection regulations applicable to ITM Isotope Technologies Munich SE. By means of this data protection declaration, our company informs the public about the nature, scope and purpose of the personal data we collect, use, and process. This data protection declaration also sets out the rights of the Data Subject.
                As a processor, ITM Isotope Technologies Munich SE implemented numerous technical and organizational measures to ensure the most complete protection of the personal data processed via this website. However, web-based data transmissions can be vulnerable, meaning 100% protection cannot be guaranteed. For this reason, any user, or Data Subject, is free to transmit personal data to us by alternative methods, such as by telephone.
            </p>
            <h1>Data Collection</h1>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Action Topic: <br /> Calling up the Website</TableCell>
                            <TableCell>User Study</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row) => (
                            <TableRow key={row.actionTopic}>
                                <TableCell>{row.actionTopic}</TableCell>
                                <TableCell>{row.userStudy}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default Impressum;
