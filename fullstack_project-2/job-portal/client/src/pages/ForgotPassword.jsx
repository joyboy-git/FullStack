import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { KeyRound, Mail, CheckCircle } from 'lucide-react';
import api from '../services/api';

const ForgotPassword = () => {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post('/auth/forgot-password', { email });
            toast.success(res.data.message);
            setStep(2);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to send OTP');
        }
        setLoading(false);
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post('/auth/reset-password', { email, otp, password });
            toast.success(res.data.message);
            navigate('/login');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to reset password');
        }
        setLoading(false);
    };

    return (
        <div className="flex justify-center items-center py-12">
            <div className="card w-full max-w-md p-8">
                <div className="text-center mb-8">
                    <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <KeyRound className="w-8 h-8 text-primary-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900">Reset Password</h2>
                    <p className="text-slate-500 mt-2">
                        {step === 1 ? 'Enter your email to receive an OTP' : 'Enter the OTP and your new password'}
                    </p>
                </div>

                {step === 1 ? (
                    <form onSubmit={handleSendOtp} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
                                <Mail className="w-4 h-4" /> Email Address
                            </label>
                            <input 
                                type="email" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                required 
                                className="input-field"
                                placeholder="you@example.com"
                            />
                        </div>
                        <button type="submit" disabled={loading} className="btn-primary w-full py-3">
                            {loading ? 'Sending OTP...' : 'Send OTP'}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleResetPassword} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
                                <CheckCircle className="w-4 h-4" /> 6-Digit OTP
                            </label>
                            <input 
                                type="text" 
                                value={otp} 
                                onChange={(e) => setOtp(e.target.value)} 
                                required 
                                className="input-field tracking-widest text-center text-lg font-mono"
                                placeholder="123456"
                                maxLength="6"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">New Password</label>
                            <input 
                                type="password" 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                required 
                                className="input-field"
                                placeholder="••••••••"
                            />
                        </div>
                        <button type="submit" disabled={loading} className="btn-primary w-full py-3">
                            {loading ? 'Resetting Password...' : 'Reset Password'}
                        </button>
                        <button 
                            type="button" 
                            onClick={() => setStep(1)} 
                            className="w-full text-sm text-slate-500 hover:text-slate-700 mt-2"
                        >
                            Back to email input
                        </button>
                    </form>
                )}

                <div className="mt-6 text-center text-sm text-slate-600">
                    Remember your password? <Link to="/login" className="text-primary-600 hover:underline font-medium">Sign in</Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
