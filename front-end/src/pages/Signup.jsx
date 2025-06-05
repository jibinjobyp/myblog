import { useState, useRef, useEffect } from 'react';
import { signup } from '../api/auth';
import { showError, showSuccess } from '../utils/Toast';
import '../styles/Signup.css';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        email: '',
        password: '',
        profileImage: null
    });
    const [imagePreview, setImagePreview] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [strength, setStrength] = useState(0);
    const fileInputRef = useRef(null);
    const formRef = useRef(null);

    useEffect(() => {
        if (!formData.password) {
            setStrength(0);
            return;
        }

        let score = 0;
        if (formData.password.length >= 8) score += 1;
        if (/[A-Z]/.test(formData.password)) score += 1;
        if (/[0-9]/.test(formData.password)) score += 1;
        if (/[^A-Za-z0-9]/.test(formData.password)) score += 1;

        setStrength(score);
    }, [formData.password]);

    const getStrengthText = () => {
        switch (strength) {
            case 0: return "Very Weak";
            case 1: return "Weak";
            case 2: return "Fair";
            case 3: return "Good";
            case 4: return "Strong";
            default: return "";
        }
    };

    const getStrengthColor = () => {
        switch (strength) {
            case 0: return "#ff5757";
            case 1: return "#ff5757";
            case 2: return "#ffbd49";
            case 3: return "#7ac142";
            case 4: return "#2ecc71";
            default: return "#ddd";
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.match('image.*')) {
                showError('Please select an image file');
                return;
            }

            if (file.size > 5 * 1024 * 1024) {
                showError('File size must be less than 5MB');
                return;
            }

            setFormData(prev => ({ ...prev, profileImage: file }));

            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setFormData(prev => ({ ...prev, profileImage: null }));
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { firstname, lastname, email, password, profileImage } = formData;

        if (!firstname.trim()) return showError('First name is required');
        if (!lastname.trim()) return showError('Last name is required');
        if (!email.trim()) return showError('Email address is required');

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) return showError('Please enter a valid email address');
        if (!password) return showError('Password is required');
        if (password.length < 6) return showError('Password must be at least 6 characters');

        setIsUploading(true);
        try {
            const data = new FormData();
            data.append('firstname', firstname);
            data.append('lastname', lastname);
            data.append('email', email);
            data.append('password', password);

            if (profileImage) {
                data.append('profileImage', profileImage);
            }
            console.log('firstname:', data.get('firstname'));
console.log('lastname:', data.get('lastname'));
console.log('email:', data.get('email'));
// etc.
            const response = await signup(data);
            showSuccess('Account created successfully!');

            setFormData({
                firstname: '',
                lastname: '',
                email: '',
                password: '',
                profileImage: null
            });
            handleRemoveImage();

            setTimeout(() => {
                navigate('/login');
            }, 1500);

        } catch (err) {
            console.error('Signup error:', err);
            showError(err.response?.data?.message || 'Sign up failed. Please try again.');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="signup-container">
            <div className="signup-card">
                <h1 className="signup-title">Create Account</h1>
                <form className='signup-form' onSubmit={handleSubmit} encType="multipart/form-data" ref={formRef}>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="firstname">First Name</label>
                            <input
                                type="text"
                                id="firstname"
                                name="firstname"
                                value={formData.firstname}
                                onChange={handleChange}
                                placeholder="Enter first name"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="lastname">Last Name</label>
                            <input
                                type="text"
                                id="lastname"
                                name="lastname"
                                value={formData.lastname}
                                onChange={handleChange}
                                placeholder="Enter last name"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter email address"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter password (min. 6 characters)"
                            autoComplete="new-password"
                            required
                            minLength="6"
                        />
                        {formData.password && (
                            <div className="password-strength">
                                <div className="strength-bar">
                                    {[...Array(4)].map((_, index) => (
                                        <div
                                            key={index}
                                            className="strength-segment"
                                            style={{
                                                backgroundColor: index < strength ? getStrengthColor() : '#ddd',
                                                width: `${100 / 4}%`
                                            }}
                                        />
                                    ))}
                                </div>
                                <span className="strength-text" style={{ color: getStrengthColor() }}>
                                    {getStrengthText()}
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="profileImage">Profile Photo (Optional)</label>
                        <div className="profile-upload">
                            {imagePreview ? (
                                <div className="profile-preview">
                                    <img src={imagePreview} alt="Profile preview" />
                                </div>
                            ) : (
                                <div className="profile-placeholder">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                            )}

                            <div className="upload-actions">
                                <input
                                    type="file"
                                    id="profileImage"
                                    name="profileImage"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    ref={fileInputRef}
                                    className="file-input"
                                />
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current.click()}
                                    className="browse-button"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    Browse
                                </button>
                                {formData.profileImage && (
                                    <button
                                        type="button"
                                        onClick={handleRemoveImage}
                                        className="remove-button"
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    <button type="submit" className="submit-button" disabled={isUploading}>
                        {isUploading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Signup;
