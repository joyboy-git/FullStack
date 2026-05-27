import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Briefcase, User, LogOut, LayoutDashboard } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="glass sticky top-0 z-50 shadow-sm border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center gap-2">
                            <div className="bg-primary-600 p-2 rounded-lg">
                                <Briefcase className="h-6 w-6 text-white" />
                            </div>
                            <span className="font-bold text-xl text-slate-900 tracking-tight">JobPortal</span>
                        </Link>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                        <Link to="/" className="text-slate-600 hover:text-primary-600 font-medium transition-colors">
                            Jobs
                        </Link>
                        
                        {user ? (
                            <>
                                <Link to="/dashboard" className="text-slate-600 hover:text-primary-600 font-medium transition-colors flex items-center gap-1">
                                    <LayoutDashboard className="w-4 h-4" /> Dashboard
                                </Link>
                                <Link to="/profile" className="text-slate-600 hover:text-primary-600 font-medium transition-colors flex items-center gap-1">
                                    <User className="w-4 h-4" /> Profile
                                </Link>
                                <button 
                                    onClick={handleLogout}
                                    className="flex items-center gap-1 text-red-600 hover:text-red-700 font-medium ml-4 transition-colors"
                                >
                                    <LogOut className="w-4 h-4" /> Logout
                                </button>
                            </>
                        ) : (
                            <div className="flex items-center space-x-3 ml-4">
                                <Link to="/login" className="text-slate-600 hover:text-primary-600 font-medium transition-colors">
                                    Log in
                                </Link>
                                <Link to="/register" className="btn-primary">
                                    Sign up
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
