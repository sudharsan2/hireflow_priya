import React, { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Snackbar from '@mui/material/Snackbar';
import CircularProgress from '@mui/material/CircularProgress';
import MuiAlert from '@mui/material/Alert';
import Slide from '@mui/material/Slide';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import axios from 'axios'; // Import Axios
import './resetPassword.css';
import { useParams } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

export default function ResetPassword() {
    const navigate = useNavigate();
    const { token } = useParams();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState(null);

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleConfirmPasswordChange = (event) => {
        setConfirmPassword(event.target.value);
    };

    const handleClose = () => {
        setResponse(null);
    };
    const handleGoToLoginPage = () => {
        navigate('/')
    };
    const handleSubmit = () => {
        // Validation
        if (password.length < 8) {
            setResponse('Password must be at least 8 characters long.');
            return;
        }
        if (password !== confirmPassword) {
            setResponse('Password and confirm password do not match.');
            return;
        }

        setLoading(true);

        // If validation passes, make API call
        const payload = {
            password: password,
            token: token
        };

        // Make API call to reset password using Axios
        axios.post('https://hireflowapidev.focusrtech.com:90/hiring/auth/resetPassword', payload)
            .then(response => {
                setLoading(false);
                setResponse('Password reset successfully.');
                // Reset form fields
                setPassword('');
                setConfirmPassword('');
            })
            .catch(error => {
                setLoading(false);
                setResponse('Failed to reset password.');
                console.error('Error resetting password:', error);
            });
    };

    return (
        <div className="center" >
            <div className="card-container" style={{display:"flex"}}>
                <Card sx={{ backgroundColor: '#f5f5f5' }}>
                    <h2>Reset Password</h2>
                    <CardContent>
                        <TextField
                            className="passtextFields"
                            label="Password"
                            variant="outlined"
                            type="input"
                            value={password}
                            onChange={handlePasswordChange}
                            style={{marginBottom:'15px'}}
                        />
                        <TextField
                            className="passtextFields"
                            label="Confirm Password"
                            variant="outlined"
                            type="input"
                            value={confirmPassword}
                            onChange={handleConfirmPasswordChange}
                        />
                        <div style={{marginTop:"15px"}}></div>
                        <Button
                            className="passbtn"
                            variant="contained"
                            disabled={loading}
                            onClick={handleSubmit}
                        >
                            {loading ? <CircularProgress size={24} /> : 'Change Password'}
                        </Button>
                        <Button
                            className="passbtn"
                            variant="contained"
                            onClick={handleGoToLoginPage}
                            style={{marginLeft:'10px'}}  
                        >
                            Go to Login Page
                        </Button>
                    </CardContent>
                </Card>
            </div>
            <Snackbar
                open={response !== null}
                autoHideDuration={6000}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                TransitionComponent={Slide}
            >
                <MuiAlert
                    elevation={6}
                    variant="filled"
                    onClose={handleClose}
                    severity={response && response.includes('successfully') ? 'success' : 'error'}
                >
                    {response}
                </MuiAlert>
            </Snackbar>
        </div>
    );
}
