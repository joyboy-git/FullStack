import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { User, Mail, Briefcase, Award, FileText, Upload, CheckCircle } from 'lucide-react';
import api from '../services/api';

const Profile = () => {
    const { user, updateProfile } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        name: '',
        skills: '',
        experience: '',
        password: '',
        otp: '',
    });
    const [resumeFile, setResumeFile] = useState(null);
    const [updating, setUpdating] = useState(false);
    const [otpRequested, setOtpRequested] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                skills: user.skills ? user.skills.join(', ') : '',
                experience: user.experience || '',
                password: '',
                otp: '',
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setResumeFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password && !otpRequested) {
            setUpdating(true);
            try {
                const res = await api.post('/auth/forgot-password', { email: user.email });
                toast.success('OTP sent to your email to confirm password change');
                setOtpRequested(true);
            } catch (error) {
                toast.error(error.response?.data?.message || 'Failed to send OTP');
            }
            setUpdating(false);
            return;
        }

        setUpdating(true);

        const data = new FormData();
        data.append('name', formData.name);
        data.append('skills', formData.skills);
        data.append('experience', formData.experience);
        if (formData.password) {
            data.append('password', formData.password);
            data.append('otp', formData.otp);
        }
        if (resumeFile) {
            data.append('resume', resumeFile);
        }

        const res = await updateProfile(data);
        if (res.success) {
            toast.success('Profile updated successfully');
            setResumeFile(null); // Reset file input
            setOtpRequested(false);
            setFormData({ ...formData, password: '', otp: '' });
        } else {
            toast.error(res.message);
        }
        
        setUpdating(false);
    };

    return (
        <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold text-slate-900 mb-8">My Profile</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Profile Summary Card */}
                <div className="col-span-1">
                    <div className="card p-6 flex flex-col items-center text-center sticky top-24">
                        <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mb-4 border-4 border-white shadow-sm">
                            <span className="text-4xl font-bold text-primary-600">
                                {user?.name?.charAt(0).toUpperCase()}
                            </span>
                        </div>
                        <h2 className="text-xl font-bold text-slate-900">{user?.name}</h2>
                        <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-medium mt-2 capitalize tracking-wide">
                            {user?.role}
                        </span>
                        
                        <div className="w-full mt-6 pt-6 border-t border-slate-100 space-y-3 text-left">
                            <div className="flex items-center text-sm text-slate-600">
                                <Mail className="w-4 h-4 mr-3 text-slate-400" />
                                {user?.email}
                            </div>
                            {user?.resumeUrl && (
                                <div className="flex items-center text-sm text-primary-600">
                                    <FileText className="w-4 h-4 mr-3" />
                                    <a href={user.resumeUrl} target="_blank" rel="noopener noreferrer" className="hover:underline font-medium">View Current Resume</a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Edit Form */}
                <div className="col-span-1 md:col-span-2">
                    <div className="card p-6 md:p-8">
                        <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                            <User className="w-5 h-5 text-primary-600" /> Edit Information
                        </h3>
                        
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                                <input 
                                    type="text" 
                                    name="name" 
                                    value={formData.name} 
                                    onChange={handleChange} 
                                    className="input-field"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">New Password (leave blank to keep current)</label>
                                <input 
                                    type="password" 
                                    name="password" 
                                    value={formData.password} 
                                    onChange={handleChange} 
                                    className="input-field"
                                    placeholder="Enter new password"
                                    disabled={otpRequested}
                                />
                            </div>

                            {otpRequested && (
                                <div className="bg-primary-50 p-4 rounded-lg border border-primary-100 mb-6">
                                    <label className="block text-sm font-medium text-primary-900 mb-2 flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4" /> Enter OTP sent to your email
                                    </label>
                                    <input 
                                        type="text" 
                                        name="otp" 
                                        value={formData.otp} 
                                        onChange={handleChange} 
                                        required 
                                        className="input-field tracking-widest text-center text-lg font-mono"
                                        placeholder="123456"
                                        maxLength="6"
                                    />
                                    <div className="flex justify-between mt-2">
                                        <button 
                                            type="button" 
                                            onClick={() => setOtpRequested(false)} 
                                            className="text-xs text-primary-600 hover:underline"
                                        >
                                            Cancel password change
                                        </button>
                                    </div>
                                </div>
                            )}
                            
                            {user?.role === 'seeker' && (
                                <>
                                    <div>
                                        <label className="flex items-center text-sm font-medium text-slate-700 mb-1 gap-1">
                                            <Award className="w-4 h-4" /> Skills
                                        </label>
                                        <input 
                                            type="text" 
                                            name="skills" 
                                            value={formData.skills} 
                                            onChange={handleChange} 
                                            className="input-field"
                                            placeholder="React, Node.js, Python (comma separated)"
                                        />
                                    </div>
                                    <div>
                                        <label className="flex items-center text-sm font-medium text-slate-700 mb-1 gap-1">
                                            <Briefcase className="w-4 h-4" /> Experience
                                        </label>
                                        <textarea 
                                            name="experience" 
                                            value={formData.experience} 
                                            onChange={handleChange} 
                                            className="input-field min-h-[100px]"
                                            placeholder="Briefly describe your work experience..."
                                        ></textarea>
                                    </div>
                                    <div>
                                        <label className="flex items-center text-sm font-medium text-slate-700 mb-2 gap-1">
                                            <Upload className="w-4 h-4" /> Upload Resume (PDF, DOC)
                                        </label>
                                        <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 bg-slate-50 text-center hover:bg-slate-100 transition-colors">
                                            <input 
                                                type="file" 
                                                id="resume-upload"
                                                name="resume" 
                                                onChange={handleFileChange} 
                                                className="hidden"
                                                accept=".pdf,.doc,.docx"
                                            />
                                            <label htmlFor="resume-upload" className="cursor-pointer flex flex-col items-center">
                                                <FileText className="w-8 h-8 text-slate-400 mb-2" />
                                                <span className="text-sm font-medium text-primary-600 hover:text-primary-700">
                                                    {resumeFile ? resumeFile.name : 'Click to select file'}
                                                </span>
                                                <span className="text-xs text-slate-500 mt-1">Max size: 5MB</span>
                                            </label>
                                        </div>
                                    </div>
                                </>
                            )}
                            
                            <div className="pt-4 border-t border-slate-100 flex justify-end">
                                <button type="submit" disabled={updating} className="btn-primary px-8">
                                    {updating ? 'Processing...' : (otpRequested ? 'Confirm & Save' : 'Save Changes')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
