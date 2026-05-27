import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Spinner from './Spinner';
import { Building, MapPin, ExternalLink, Clock, CheckCircle, XCircle } from 'lucide-react';

const SeekerDashboard = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const { data } = await api.get('/applications/my-applications');
                setApplications(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchApplications();
    }, []);

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending': return <Clock className="w-4 h-4 text-amber-500" />;
            case 'accepted': return <CheckCircle className="w-4 h-4 text-emerald-500" />;
            case 'rejected': return <XCircle className="w-4 h-4 text-red-500" />;
            default: return null;
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'pending': return 'bg-amber-50 text-amber-700 border-amber-200';
            case 'accepted': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
            case 'rejected': return 'bg-red-50 text-red-700 border-red-200';
            default: return 'bg-slate-50 text-slate-700';
        }
    };

    if (loading) return <Spinner />;

    return (
        <div>
            <h2 className="text-xl font-bold text-slate-900 mb-6">My Applications ({applications.length})</h2>
            
            {applications.length === 0 ? (
                <div className="card p-12 text-center border-dashed border-2">
                    <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <ExternalLink className="w-8 h-8 text-primary-500" />
                    </div>
                    <h3 className="text-lg font-medium text-slate-900 mb-2">No applications yet</h3>
                    <p className="text-slate-500 mb-6">You haven't applied to any jobs yet. Start exploring!</p>
                    <Link to="/" className="btn-primary">Browse Jobs</Link>
                </div>
            ) : (
                <div className="grid gap-4">
                    {applications.map(app => (
                        <div key={app._id} className="card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900">
                                    <Link to={`/jobs/${app.jobId?._id}`} className="hover:text-primary-600 transition-colors">
                                        {app.jobId?.title || 'Job Deleted'}
                                    </Link>
                                </h3>
                                <div className="flex flex-wrap gap-4 mt-2 text-sm text-slate-600">
                                    {app.jobId?.company && (
                                        <div className="flex items-center">
                                            <Building className="w-4 h-4 mr-1 text-slate-400" />
                                            {app.jobId.company}
                                        </div>
                                    )}
                                    {app.jobId?.location && (
                                        <div className="flex items-center">
                                            <MapPin className="w-4 h-4 mr-1 text-slate-400" />
                                            {app.jobId.location}
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            <div className="flex flex-col items-start md:items-end gap-2">
                                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium border ${getStatusBadge(app.status)}`}>
                                    {getStatusIcon(app.status)}
                                    <span className="capitalize">{app.status}</span>
                                </div>
                                <div className="text-xs text-slate-400 font-medium">
                                    Applied on {new Date(app.createdAt).toLocaleDateString()}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SeekerDashboard;
