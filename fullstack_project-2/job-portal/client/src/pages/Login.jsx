import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { LogIn } from 'lucide-react';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await login(formData.email, formData.password);
        if (res.success) {
            toast.success('Logged in successfully!');
            navigate('/dashboard');
        } else {
            toast.error(res.message);
        }
    };

    return (
        <div className="flex justify-center items-center py-12">
            <div className="card w-full max-w-md p-8">
                <div className="text-center mb-8">
                    <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <LogIn className="w-8 h-8 text-primary-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900">Welcome Back</h2>
                    <p className="text-slate-500 mt-2">Sign in to your account to continue</p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                        <input 
                            type="email" 
                            name="email"
                            value={formData.email} 
                            onChange={handleChange} 
                            required 
                            className="input-field"
                            placeholder="you@example.com"
                        />
                    </div>
                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <label className="block text-sm font-medium text-slate-700">Password</label>
                            <Link to="/forgot-password" className="text-sm text-primary-600 hover:underline font-medium">Forgot Password?</Link>
                        </div>
                        <input 
                            type="password" 
                            name="password"
                            value={formData.password} 
                            onChange={handleChange} 
                            required 
                            className="input-field"
                            placeholder="••••••••"
                        />
                    </div>
                    <button type="submit" className="btn-primary w-full py-3">
                        Sign In
                    </button>
                </form>
                
                <div className="mt-6 text-center text-sm text-slate-600">
                    Don't have an account? <Link to="/register" className="text-primary-600 hover:underline font-medium">Sign up</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
