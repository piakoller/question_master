import * as React from 'react';
import { Link } from 'react-router-dom';
import { Typography } from '@mui/material';

import '../pages/stylesheet.css'

const Footer = () => {
  return (
    <footer className="footer">
      <Typography variant="body2" color="text.secondary" align="center">
        © 2024 ITM |{' '}
        <Link to="/impressum">Impressum</Link>
      </Typography>
    </footer>
  );
};

export default Footer;
