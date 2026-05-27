import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Spinner from './Spinner';
import { toast } from 'react-toastify';
import { Plus, Users, Edit, Trash2, X, FileText } from 'lucide-react';

const RecruiterDashboard = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        title: '', company: '', description: '', salary: '', location: ''
    });
    const [editingId, setEditingId] = useState(null);

    // Applicants Modal state
    const [showApplicants, setShowApplicants] = useState(false);
    const [applicants, setApplicants] = useState([]);
    const [selectedJobId, setSelectedJobId] = useState(null);
    const [applicantsLoading, setApplicantsLoading] = useState(false);

    const fetchJobs = async () => {
        try {
            const { data } = await api.get('/jobs/my-jobs');
            setJobs(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await api.put(`/jobs/${editingId}`, formData);
                toast.success('Job updated successfully');
            } else {
                await api.post('/jobs', formData);
                toast.success('Job posted successfully');
            }
            fetchJobs();
            setShowForm(false);
            setEditingId(null);
            setFormData({ title: '', company: '', description: '', salary: '', location: '' });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Action failed');
        }
    };

    const handleEdit = (job) => {
        setFormData({
            title: job.title, company: job.company, description: job.description,
            salary: job.salary, location: job.location
        });
        setEditingId(job._id);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this job?')) {
            try {
                await api.delete(`/jobs/${id}`);
                toast.success('Job deleted');
                fetchJobs();
            } catch (error) {
                toast.error('Failed to delete job');
            }
        }
    };

    const viewApplicants = async (jobId) => {
        try {
            setApplicantsLoading(true);
            setSelectedJobId(jobId);
            setShowApplicants(true);
            const { data } = await api.get(`/applications/job/${jobId}`);
            setApplicants(data);
        } catch (error) {
            toast.error('Failed to fetch applicants');
        } finally {
            setApplicantsLoading(false);
        }
    };

    const updateApplicationStatus = async (appId, status) => {
        try {
            await api.put(`/applications/${appId}`, { status });
            toast.success(`Application ${status}`);
            // Update local state
            setApplicants(applicants.map(app => app._id === appId ? { ...app, status } : app));
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    if (loading) return <Spinner />;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-slate-900">My Job Listings</h2>
                <button 
                    onClick={() => {
                        setShowForm(!showForm);
                        if(showForm) {
                            setEditingId(null);
                            setFormData({ title: '', company: '', description: '', salary: '', location: '' });
                        }
                    }} 
                    className="btn-primary flex items-center gap-2"
                >
                    {showForm ? <><X className="w-4 h-4"/> Cancel</> : <><Plus className="w-4 h-4"/> Post New Job</>}
                </button>
            </div>

            {showForm && (
                <div className="card p-6 mb-8 border-primary-200 shadow-md">
                    <h3 className="text-lg font-bold mb-4 text-slate-900">{editingId ? 'Edit Job' : 'Post a New Job'}</h3>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Job Title</label>
                            <input type="text" name="title" value={formData.title} onChange={handleChange} required className="input-field" placeholder="e.g. Senior Frontend Developer" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Company</label>
                            <input type="text" name="company" value={formData.company} onChange={handleChange} required className="input-field" placeholder="e.g. TechCorp Inc." />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                            <input type="text" name="location" value={formData.location} onChange={handleChange} required className="input-field" placeholder="e.g. Remote, New York" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Salary</label>
                            <input type="text" name="salary" value={formData.salary} onChange={handleChange} required className="input-field" placeholder="e.g. $100k - $120k / year" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                            <textarea name="description" value={formData.description} onChange={handleChange} required className="input-field min-h-[120px]" placeholder="Job requirements, responsibilities..."></textarea>
                        </div>
                        <div className="md:col-span-2 flex justify-end">
                            <button type="submit" className="btn-primary px-8">
                                {editingId ? 'Update Job' : 'Publish Job'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {jobs.length === 0 && !showForm ? (
                <div className="card p-12 text-center border-dashed border-2">
                    <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FileText className="w-8 h-8 text-primary-500" />
                    </div>
                    <h3 className="text-lg font-medium text-slate-900 mb-2">No jobs posted yet</h3>
                    <p className="text-slate-500 mb-6">Create your first job listing to start receiving applications.</p>
                    <button onClick={() => setShowForm(true)} className="btn-primary">Post a Job</button>
                </div>
            ) : (
                <div className="grid gap-4">
                    {jobs.map(job => (
                        <div key={job._id} className="card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900">{job.title}</h3>
                                <div className="text-slate-600 text-sm mt-1">{job.company} • {job.location}</div>
                                <div className="text-slate-400 text-xs mt-2">Posted on {new Date(job.createdAt).toLocaleDateString()}</div>
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                                <button onClick={() => viewApplicants(job._id)} className="btn-outline flex items-center gap-2 py-1.5 px-3 text-sm">
                                    <Users className="w-4 h-4" /> Applicants
                                </button>
                                <button onClick={() => handleEdit(job)} className="p-2 text-slate-400 hover:text-primary-600 bg-slate-50 hover:bg-primary-50 rounded-lg transition-colors">
                                    <Edit className="w-4 h-4" />
                                </button>
                                <button onClick={() => handleDelete(job._id)} className="p-2 text-slate-400 hover:text-red-600 bg-slate-50 hover:bg-red-50 rounded-lg transition-colors">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Applicants Modal */}
            {showApplicants && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex justify-center items-center p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <h3 className="text-xl font-bold text-slate-900">Applicants</h3>
                            <button onClick={() => setShowApplicants(false)} className="text-slate-400 hover:text-slate-600 p-1 bg-white rounded-md shadow-sm">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6 overflow-y-auto flex-grow bg-slate-50/50">
                            {applicantsLoading ? (
                                <Spinner />
                            ) : applicants.length === 0 ? (
                                <div className="text-center py-12">
                                    <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                                    <p className="text-slate-500 font-medium">No applications for this job yet.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {applicants.map(app => (
                                        <div key={app._id} className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
                                            <div className="flex justify-between items-start mb-3">
                                                <div>
                                                    <h4 className="font-bold text-slate-900 text-lg">{app.applicantId.name}</h4>
                                                    <a href={`mailto:${app.applicantId.email}`} className="text-primary-600 hover:underline text-sm">{app.applicantId.email}</a>
                                                </div>
                                                <span className={`px-2.5 py-1 text-xs font-medium rounded-full uppercase tracking-wider
                                                    ${app.status === 'pending' ? 'bg-amber-100 text-amber-800' : ''}
                                                    ${app.status === 'accepted' ? 'bg-emerald-100 text-emerald-800' : ''}
                                                    ${app.status === 'rejected' ? 'bg-red-100 text-red-800' : ''}
                                                `}>
                                                    {app.status}
                                                </span>
                                            </div>
                                            
                                            <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                                                <div>
                                                    <span className="text-slate-500 block mb-1">Experience:</span>
                                                    <span className="font-medium text-slate-700">{app.applicantId.experience || 'Not specified'}</span>
                                                </div>
                                                <div>
                                                    <span className="text-slate-500 block mb-1">Skills:</span>
                                                    <div className="flex flex-wrap gap-1">
                                                        {app.applicantId.skills?.length > 0 ? (
                                                            app.applicantId.skills.map(s => (
                                                                <span key={s} className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-xs">{s}</span>
                                                            ))
                                                        ) : (
                                                            <span className="text-slate-400">None</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100">
                                                <a 
                                                    href={app.resumeUrl} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center gap-1"
                                                >
                                                    <FileText className="w-4 h-4" /> View Resume
                                                </a>
                                                
                                                <div className="flex gap-2">
                                                    {app.status !== 'accepted' && (
                                                        <button 
                                                            onClick={() => updateApplicationStatus(app._id, 'accepted')}
                                                            className="px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded text-sm font-medium transition-colors"
                                                        >
                                                            Accept
                                                        </button>
                                                    )}
                                                    {app.status !== 'rejected' && (
                                                        <button 
                                                            onClick={() => updateApplicationStatus(app._id, 'rejected')}
                                                            className="px-3 py-1.5 bg-red-50 text-red-700 hover:bg-red-100 rounded text-sm font-medium transition-colors"
                                                        >
                                                            Reject
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RecruiterDashboard;
