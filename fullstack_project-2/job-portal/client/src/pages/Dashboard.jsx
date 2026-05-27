import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import SeekerDashboard from '../components/SeekerDashboard';
import RecruiterDashboard from '../components/RecruiterDashboard';

const Dashboard = () => {
    const { user } = useContext(AuthContext);

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
                <p className="text-slate-500 mt-1">Welcome back, <span className="font-medium text-slate-700">{user?.name}</span>!</p>
            </div>

            {user?.role === 'seeker' ? <SeekerDashboard /> : <RecruiterDashboard />}
        </div>
    );
};

export default Dashboard;
