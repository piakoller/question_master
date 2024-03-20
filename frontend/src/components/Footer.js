import * as React from 'react';
import { Link } from 'react-router-dom';
import { Typography, Grid } from '@mui/material';

import '../pages/stylesheet.css'
import ITM_Logo from '../images/ITM_Logo.png';

const Footer = () => {
    return (
        <footer className="footer">
            <Grid container spacing={2} alignItems="center" justifyContent="space-between">
                <Grid item>
                    <Typography variant="body2" color="text.secondary" align="center">
                        © 2024 ITM |{' '}
                        <Link to="/impressum">Impressum</Link>
                    </Typography>
                </Grid>
                <Grid item>
                    <div className="logo-container">
                        <img src={ITM_Logo} alt="Logo" style={{ width: '100px', height: 'auto' }} />
                    </div>
                </Grid>
            </Grid>
        </footer>
    );
};

export default Footer;
