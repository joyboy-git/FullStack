import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { UserPlus } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({ 
        name: '', 
        email: '', 
        password: '', 
        role: 'seeker' 
    });
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await register(formData);
        if (res.success) {
            toast.success('Registration successful!');
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
                        <UserPlus className="w-8 h-8 text-primary-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900">Create an Account</h2>
                    <p className="text-slate-500 mt-2">Join JobPortal to find or post jobs</p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                        <input 
                            type="text" 
                            name="name"
                            value={formData.name} 
                            onChange={handleChange} 
                            required 
                            className="input-field"
                            placeholder="John Doe"
                        />
                    </div>
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
                        <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
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
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">I am a</label>
                        <div className="grid grid-cols-2 gap-4 mt-2">
                            <label className={`border rounded-lg p-4 cursor-pointer text-center transition-all ${formData.role === 'seeker' ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-slate-200 hover:border-primary-200'}`}>
                                <input type="radio" name="role" value="seeker" checked={formData.role === 'seeker'} onChange={handleChange} className="sr-only" />
                                <span className="font-medium">Job Seeker</span>
                            </label>
                            <label className={`border rounded-lg p-4 cursor-pointer text-center transition-all ${formData.role === 'recruiter' ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-slate-200 hover:border-primary-200'}`}>
                                <input type="radio" name="role" value="recruiter" checked={formData.role === 'recruiter'} onChange={handleChange} className="sr-only" />
                                <span className="font-medium">Recruiter</span>
                            </label>
                        </div>
                    </div>
                    <button type="submit" className="btn-primary w-full py-3 mt-4">
                        Sign Up
                    </button>
                </form>
                
                <div className="mt-6 text-center text-sm text-slate-600">
                    Already have an account? <Link to="/login" className="text-primary-600 hover:underline font-medium">Log in</Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
