import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Spinner from '../components/Spinner';
import { Search, MapPin, Building, DollarSign } from 'lucide-react';

const Home = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [keyword, setKeyword] = useState('');
    const [location, setLocation] = useState('');
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);

    const fetchJobs = async () => {
        try {
            setLoading(true);
            const { data } = await api.get(`/jobs?keyword=${keyword}&location=${location}&pageNumber=${page}`);
            setJobs(data.jobs);
            setPages(data.pages);
        } catch (error) {
            console.error('Error fetching jobs', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, [page]); // Removed keyword/location dependency to only fetch on submit

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(1);
        fetchJobs();
    };

    return (
        <div>
            {/* Hero Section */}
            <div className="bg-dark-bg text-white rounded-2xl p-10 mb-12 relative overflow-hidden shadow-xl">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-primary-900/50 to-dark-bg z-0"></div>
                <div className="relative z-10 max-w-2xl">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 leading-tight">
                        Find Your Next <span className="text-primary-400">Dream Job</span> Today
                    </h1>
                    <p className="text-lg text-slate-300 mb-8">
                        Discover thousands of job opportunities with all the information you need.
                    </p>
                    
                    <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3 bg-white p-2 rounded-xl shadow-lg">
                        <div className="flex-1 flex items-center px-4 bg-slate-50 rounded-lg border border-slate-200">
                            <Search className="w-5 h-5 text-slate-400" />
                            <input 
                                type="text" 
                                placeholder="Job title, keywords, or company" 
                                className="w-full bg-transparent border-none focus:ring-0 text-slate-900 py-3 px-3 outline-none"
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                            />
                        </div>
                        <div className="flex-1 flex items-center px-4 bg-slate-50 rounded-lg border border-slate-200">
                            <MapPin className="w-5 h-5 text-slate-400" />
                            <input 
                                type="text" 
                                placeholder="Location" 
                                className="w-full bg-transparent border-none focus:ring-0 text-slate-900 py-3 px-3 outline-none"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                            />
                        </div>
                        <button type="submit" className="btn-primary py-3 px-8 text-lg">
                            Search
                        </button>
                    </form>
                </div>
            </div>

            {/* Job Listings */}
            <div className="mb-6 flex justify-between items-end">
                <h2 className="text-2xl font-bold text-slate-900">Latest Jobs</h2>
            </div>

            {loading ? (
                <Spinner />
            ) : jobs.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
                    <h3 className="text-xl font-medium text-slate-600">No jobs found matching your criteria.</h3>
                    <button onClick={() => { setKeyword(''); setLocation(''); fetchJobs(); }} className="text-primary-600 hover:underline mt-2">Clear filters</button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {jobs.map(job => (
                        <div key={job._id} className="card p-6 flex flex-col h-full group hover:border-primary-200 transition-colors">
                            <div className="flex justify-between items-start mb-4">
                                <div className="bg-primary-50 text-primary-700 p-3 rounded-lg font-bold text-xl group-hover:bg-primary-100 transition-colors">
                                    {job.company.charAt(0).toUpperCase()}
                                </div>
                                <span className="bg-slate-100 text-slate-600 text-xs px-3 py-1 rounded-full font-medium">
                                    {new Date(job.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-1 line-clamp-1">{job.title}</h3>
                            
                            <div className="space-y-2 mt-4 mb-6 flex-grow">
                                <div className="flex items-center text-slate-600 text-sm">
                                    <Building className="w-4 h-4 mr-2 text-slate-400" />
                                    {job.company}
                                </div>
                                <div className="flex items-center text-slate-600 text-sm">
                                    <MapPin className="w-4 h-4 mr-2 text-slate-400" />
                                    {job.location}
                                </div>
                                <div className="flex items-center text-slate-600 text-sm font-medium">
                                    <DollarSign className="w-4 h-4 mr-2 text-slate-400" />
                                    {job.salary}
                                </div>
                            </div>
                            
                            <Link to={`/jobs/${job._id}`} className="btn-outline w-full text-center group-hover:bg-primary-50">
                                View Details
                            </Link>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {pages > 1 && (
                <div className="flex justify-center mt-12 gap-2">
                    {[...Array(pages).keys()].map(x => (
                        <button
                            key={x + 1}
                            onClick={() => setPage(x + 1)}
                            className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                                page === x + 1 
                                    ? 'bg-primary-600 text-white shadow-md' 
                                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                            }`}
                        >
                            {x + 1}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Home;
