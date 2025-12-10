import React, { useState, useEffect, useRef } from 'react';
import { 
    User, 
    Mail, 
    MapPin, 
    Phone, 
    Camera, 
    Save, 
    Shield, 
    Bell 
} from 'lucide-react';

const ProfilePage = () => {
    const [activeTab, setActiveTab] = useState('personal');
    const fileInputRef = useRef(null); // Reference for the hidden file input
    
    // State to hold form data including profileImage
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        location: '',
        bio: '',
        profileImage: '' // Added field for the image
    });

    // Load data from localStorage on component mount
    useEffect(() => {
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            const parsedUser = JSON.parse(savedUser);
            setFormData(prev => ({
                ...prev,
                ...parsedUser
            }));
        }
    }, []);

    // Handle input changes (Text fields)
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle Image Upload
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                // Save the image as a Base64 string in the state
                setFormData(prev => ({
                    ...prev,
                    profileImage: reader.result
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    // Trigger the hidden file input when Camera icon is clicked
    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    // Save changes to localStorage
    const handleSave = () => {
        try {
            localStorage.setItem('currentUser', JSON.stringify(formData));
            alert("Profile details saved successfully!");
        } catch (error) {
            // Catch error if image is too large for LocalStorage
            alert("Image is too large to save locally. Please try a smaller image.");
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>
                <p className="text-gray-500">Manage your personal information and account settings.</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                
                {/* Left Column - Profile Card */}
                <div className="w-full lg:w-1/3 space-y-6">
                    {/* User Summary Card */}
                    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col items-center text-center">
                        
                        {/* Image Upload Section */}
                        <div 
                            className="relative group cursor-pointer"
                            onClick={triggerFileInput}
                        >
                            <div className="w-32 h-32 rounded-full border-4 border-white shadow-md overflow-hidden bg-gray-100">
                                <img 
                                    src={formData.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.firstName || 'User'}`} 
                                    alt="Profile" 
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="absolute bottom-1 right-1 bg-blue-600 p-2 rounded-full text-white shadow-lg group-hover:bg-blue-700 transition-colors">
                                <Camera size={16} />
                            </div>
                            {/* Hidden Input */}
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                onChange={handleImageChange} 
                                accept="image/*" 
                                className="hidden" 
                            />
                        </div>
                        
                        <h2 className="mt-4 text-xl font-bold text-gray-800">
                            {formData.firstName || 'User'} {formData.lastName}
                        </h2>
                        <p className="text-gray-500 font-medium">Project Manager</p>
                        <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                            Active Subscriber
                        </div>
                    </div>

                    {/* Navigation Tabs */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <button 
                            onClick={() => setActiveTab('personal')}
                            className={`w-full flex items-center gap-3 px-6 py-4 text-left transition-colors ${activeTab === 'personal' ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
                        >
                            <User size={18} />
                            <span className="font-medium">Personal Information</span>
                        </button>
                        <button 
                            onClick={() => setActiveTab('security')}
                            className={`w-full flex items-center gap-3 px-6 py-4 text-left transition-colors ${activeTab === 'security' ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
                        >
                            <Shield size={18} />
                            <span className="font-medium">Login & Security</span>
                        </button>
                        <button 
                            onClick={() => setActiveTab('notifications')}
                            className={`w-full flex items-center gap-3 px-6 py-4 text-left transition-colors ${activeTab === 'notifications' ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
                        >
                            <Bell size={18} />
                            <span className="font-medium">Notifications</span>
                        </button>
                    </div>
                </div>

                {/* Right Column - Form Area */}
                <div className="w-full lg:w-2/3">
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
                        {activeTab === 'personal' && (
                            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-lg font-bold text-gray-800">Personal Details</h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">First Name</label>
                                        <div className="relative">
                                            <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <input 
                                                type="text" 
                                                name="firstName"
                                                value={formData.firstName}
                                                onChange={handleChange}
                                                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-600 transition-all text-gray-700"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Last Name</label>
                                        <div className="relative">
                                            <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <input 
                                                type="text" 
                                                name="lastName"
                                                value={formData.lastName}
                                                onChange={handleChange}
                                                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-600 transition-all text-gray-700"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Email Address</label>
                                        <div className="relative">
                                            <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <input 
                                                type="email" 
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-600 transition-all text-gray-700"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Phone Number</label>
                                        <div className="relative">
                                            <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <input 
                                                type="tel" 
                                                name="phone"
                                                placeholder="+1 (555) 000-0000"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-600 transition-all text-gray-700"
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="md:col-span-2 space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Location</label>
                                        <div className="relative">
                                            <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <input 
                                                type="text" 
                                                name="location"
                                                placeholder="City, Country"
                                                value={formData.location}
                                                onChange={handleChange}
                                                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-600 transition-all text-gray-700"
                                            />
                                        </div>
                                    </div>

                                    <div className="md:col-span-2 space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Bio</label>
                                        <textarea 
                                            name="bio"
                                            rows="4"
                                            placeholder="Tell us about yourself..."
                                            value={formData.bio}
                                            onChange={handleChange}
                                            className="w-full p-4 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-600 transition-all text-gray-700 resize-none"
                                        ></textarea>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-gray-100 flex items-center justify-end gap-3">
                                    <button 
                                        type="button" 
                                        className="px-5 py-2.5 rounded-lg border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="button" 
                                        onClick={handleSave}
                                        className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors shadow-sm"
                                    >
                                        <Save size={18} />
                                        Save Changes
                                    </button>
                                </div>
                            </form>
                        )}

                        {activeTab === 'security' && (
                            <div className="text-center py-12">
                                <Shield size={48} className="mx-auto text-gray-300 mb-4" />
                                <h3 className="text-lg font-medium text-gray-900">Security Settings</h3>
                                <p className="text-gray-500 mt-1">Change password and 2FA settings here.</p>
                            </div>
                        )}

                        {activeTab === 'notifications' && (
                            <div className="text-center py-12">
                                <Bell size={48} className="mx-auto text-gray-300 mb-4" />
                                <h3 className="text-lg font-medium text-gray-900">Notification Preferences</h3>
                                <p className="text-gray-500 mt-1">Manage your email and push notifications.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;