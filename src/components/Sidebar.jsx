import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    LayoutGrid,
    BrainCircuit,
    FileText,
    ShoppingBag,
    User,
    LogOut,
    X,
    CreditCard // Added CreditCard icon
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
    const location = useLocation();

    const menuItems = [
        { name: "Projects", icon: <LayoutGrid size={20} />, path: "/active-projects" },
        { name: "Memory", icon: <BrainCircuit size={20} />, path: "/memory" },
        { name: "Templates", icon: <FileText size={20} />, path: "/templates" },
        { name: "Marketplace", icon: <ShoppingBag size={20} />, path: "/marketplace" },
        { name: "Pricing", icon: <CreditCard size={20} />, path: "/pricing" }, // Added Pricing button
        { name: "Profile", icon: <User size={20} />, path: "/profile" },
    ];

    return (
        <aside className={`
            fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-100 flex flex-col p-6
            transform transition-transform duration-300 ease-in-out
            md:relative md:translate-x-0 
            ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
            {/* Logo Section */}
            <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
                        PB
                    </div>
                    <span className="font-bold text-gray-800 text-lg tracking-tight">ProjectBuddy</span>
                </div>
                
                {/* Close Button (Mobile Only) */}
                <button onClick={onClose} className="md:hidden text-gray-500 hover:text-gray-700">
                    <X size={24} />
                </button>
            </div>

            {/* Menu Items */}
            <div className="flex flex-col gap-2">
                {menuItems.map((item, index) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={index}
                            to={item.path}
                            onClick={onClose}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all font-medium group
                            ${isActive
                                ? "bg-blue-50 text-blue-600"
                                : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"}`}
                        >
                            <span className={isActive ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600"}>
                                {item.icon}
                            </span>
                            {item.name}
                        </Link>
                    );
                })}
            </div>

            {/* Bottom User Section */}
            <div className="mt-auto pt-6 border-t border-gray-100">
                <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                    {/* Click Account info to go to Profile */}
                    <Link 
                        to="/profile" 
                        onClick={onClose}
                        className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer"
                    >
                        <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" />
                        </div>
                        <div className="text-sm font-medium text-gray-700 truncate">My Account</div>
                    </Link>
                    
                    {/* Click Icon to Logout (Go to Sign In) */}
                    <Link 
                        to="/" 
                        className="text-gray-400 hover:text-red-500 p-1 rounded hover:bg-gray-100 transition-colors"
                        title="Log Out"
                    >
                        <LogOut size={16} />
                    </Link>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;