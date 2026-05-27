import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import Spinner from '../components/Spinner';
import { toast } from 'react-toastify';
import { Building, MapPin, DollarSign, Calendar, ArrowLeft } from 'lucide-react';

const JobDetails = () => {
    const { id } = useParams();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [applying, setApplying] = useState(false);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const { data } = await api.get(`/jobs/${id}`);
                setJob(data);
            } catch (error) {
                toast.error('Error fetching job details');
            } finally {
                setLoading(false);
            }
        };
        fetchJob();
    }, [id]);

    const handleApply = async () => {
        if (!user) {
            toast.info('Please login to apply');
            navigate('/login');
            return;
        }

        if (user.role !== 'seeker') {
            toast.error('Only job seekers can apply');
            return;
        }

        try {
            setApplying(true);
            await api.post(`/applications/apply/${id}`);
            toast.success('Successfully applied for the job!');
            navigate('/dashboard');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to apply');
        } finally {
            setApplying(false);
        }
    };

    if (loading) return <Spinner />;
    if (!job) return <div className="text-center py-12">Job not found</div>;

    return (
        <div className="max-w-4xl mx-auto">
            <button 
                onClick={() => navigate(-1)} 
                className="flex items-center text-slate-500 hover:text-primary-600 mb-6 transition-colors"
            >
                <ArrowLeft className="w-4 h-4 mr-1" /> Back to jobs
            </button>

            <div className="card overflow-hidden">
                <div className="bg-slate-50 border-b border-slate-200 p-8">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 mb-2">{job.title}</h1>
                            <div className="flex items-center text-primary-700 font-medium text-lg mb-4">
                                <Building className="w-5 h-5 mr-2" />
                                {job.company}
                            </div>
                            
                            <div className="flex flex-wrap gap-4 text-slate-600">
                                <div className="flex items-center bg-white px-3 py-1.5 rounded-md border border-slate-200 shadow-sm">
                                    <MapPin className="w-4 h-4 mr-2 text-slate-400" />
                                    {job.location}
                                </div>
                                <div className="flex items-center bg-white px-3 py-1.5 rounded-md border border-slate-200 shadow-sm">
                                    <DollarSign className="w-4 h-4 mr-2 text-slate-400" />
                                    <span className="font-medium text-slate-700">{job.salary}</span>
                                </div>
                                <div className="flex items-center bg-white px-3 py-1.5 rounded-md border border-slate-200 shadow-sm">
                                    <Calendar className="w-4 h-4 mr-2 text-slate-400" />
                                    Posted {new Date(job.createdAt).toLocaleDateString()}
                                </div>
                            </div>
                        </div>

                        {(!user || user.role === 'seeker') && (
                            <button 
                                onClick={handleApply} 
                                disabled={applying}
                                className="btn-primary py-3 px-8 text-lg shadow-primary-500/30 whitespace-nowrap"
                            >
                                {applying ? 'Applying...' : 'Apply Now'}
                            </button>
                        )}
                    </div>
                </div>

                <div className="p-8">
                    <h2 className="text-xl font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">Job Description</h2>
                    <div className="prose max-w-none text-slate-600 leading-relaxed whitespace-pre-wrap">
                        {job.description}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobDetails;
