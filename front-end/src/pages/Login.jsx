import { useState } from 'react';
import { useNavigate } from "react-router-dom";

import { axiosInstance } from '../api/index';
import '../styles/Login.css';
import { showError, showSuccess } from '../utils/Toast';

const Login = () => {
    
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    
    const [isLoading, setIsLoading] = useState(false);
    
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        
        try {
            const response = await axiosInstance.post('/user/login', formData, {
                headers: { 'Content-Type': 'application/json' }
            });
            
            // Store token and user data
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.result));
            
            // Dispatch a custom event to notify Navbar of authentication change
            window.dispatchEvent(new Event('auth-change'));
            
            showSuccess('Login successful!');
            navigate('/');
            
        } catch (err) {
            showError(err.response?.data?.message || 'Login failed. Please check your credentials.');
            console.error('Login error:', err);
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    <h1>Welcome Back</h1>
                    <p>Please enter your credentials to login</p>
                </div>
                
                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input 
                            id="email"
                            type="email" 
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email" 
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input 
                            id="password"
                            type="password" 
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter your password" 
                            required
                        />
                    </div>
                    
                    <div className="forgot-password">
                        <a href="/forgot-password">Forgot password?</a>
                    </div>
                    
                    <button 
                        className="login-button" 
                        type="submit"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
                
                <div className="login-footer">
                    <p>Don't have an account? <a href="/register">Sign up</a></p>
                </div>
            </div>
        </div>
    );
};

export default Login;