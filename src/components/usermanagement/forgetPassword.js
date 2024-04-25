import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import axios from 'axios';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Slide from '@mui/material/Slide';
import { useNavigate } from "react-router-dom";

export default function ForgetPassword() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const navigate = useNavigate();

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handleSubmit = () => {
        setLoading(true);
        // Make API call to forgot password endpoint
        axios.post('https://hireflowapi.focusrtech.com:90/hiring/auth/forgotPassword', {
            email: email
        })
        .then(response => {
            setLoading(false);
            setSnackbarMessage('Forgot password email sent.');
            setSnackbarOpen(true);
            setEmail(''); 
            console.log('Forgot password email sent:', response.data);
        })
        .catch(error => {
            setLoading(false);
            setSnackbarMessage('Error sending forgot password email.');
            setSnackbarOpen(true);
            console.error('Error sending forgot password email:', error);
        });
    };

    const handleBackButtonClick = () => {
        navigate("/");
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <Card sx={{ minWidth: 275 }}>
                <CardContent>
                    <h2>Forgot Password</h2>
                    <p>Enter your registered Mail address to reset password</p>
                    <Box
                        component="form"
                        sx={{
                            '& > :not(style)': { m: 1, width: '25ch' },
                        }}
                        noValidate
                        autoComplete="off"
                    >
                        <TextField id="outlined-basic" label="Enter Email" variant="outlined" value={email} onChange={handleEmailChange} style={{ width: "100%" }}/>
                    </Box>
                    <div style={{ marginTop: '20px' }}>
                        <Button variant="contained" onClick={handleSubmit} disabled={loading}>
                            {loading ? 'Loading...' : 'Submit'}
                        </Button>
                        <Button variant="contained" onClick={handleBackButtonClick} style={{ marginLeft: '10px' }}>Back</Button>
                    </div>
                </CardContent>
            </Card>
            <Snackbar 
                open={snackbarOpen} 
                autoHideDuration={6000} 
                onClose={handleCloseSnackbar} 
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }} 
                TransitionComponent={Slide} 
            >
                <MuiAlert elevation={6} variant="filled" onClose={handleCloseSnackbar} severity="success">
                    {snackbarMessage}
                </MuiAlert>
            </Snackbar>
        </div>
    );
}
