import React, { useState } from 'react';
import { Check, X, Zap, Shield, Crown } from 'lucide-react';

const Pricing = () => {
    const [isAnnual, setIsAnnual] = useState(false);

    const plans = [
        {
            name: "Basic",
            price: "0",
            description: "Perfect for testing the waters.",
            icon: <Zap className="w-6 h-6 text-gray-400" />,
            features: [
                "Access to Project Buddy Mini",
                "Standard response speed",
                "2 file uploads per day",
                "Community templates"
            ],
            disabled: ["Priority support", "Unlimited image generation", "Deep reasoning models"],
            cta: "Get Started Free",
            style: "border-gray-200 bg-white"
        },
        {
            name: "Plus",
            price: isAnnual ? "2,500" : "5,000",
            description: "For creators who need more power.",
            icon: <Shield className="w-6 h-6 text-blue-500" />,
            popular: true,
            features: [
                "Everything in Basic",
                "Full access to Standard & Turbo",
                "Unlimited image generation",
                "Advanced Data Analysis",
                "Fast response times"
            ],
            disabled: ["Dedicated compute power"],
            cta: "Upgrade to Plus",
            style: "border-blue-500 bg-white ring-4 ring-blue-500/10 relative transform md:-translate-y-4"
        },
        {
            name: "Pro",
            price: isAnnual ? "5,000" : "10,000",
            description: "Ultimate power for professionals.",
            icon: <Crown className="w-6 h-6 text-purple-500" />,
            features: [
                "Everything in Plus",
                "Unlimited Ultra models access",
                "Deep Reasoning (Pro Mode)",
                "Zero downtime & priority",
                "Team collaboration tools"
            ],
            disabled: [],
            cta: "Go Pro",
            style: "border-gray-200 bg-white"
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 py-20 px-4 sm:px-6 lg:px-8 font-sans">
            {/* Header Section */}
            <div className="text-center max-w-3xl mx-auto mb-16">
                <h2 className="text-blue-600 font-semibold tracking-wide uppercase text-sm mb-2">Pricing Plans</h2>
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
                    Power up your workflow.
                </h1>
                <p className="text-xl text-gray-500 mb-8">
                    Choose the perfect plan for your project needs. Cancel anytime.
                </p>

                {/* Billing Toggle */}
                <div className="flex items-center justify-center gap-4">
                    <span className={`text-sm font-medium ${!isAnnual ? 'text-gray-900' : 'text-gray-500'}`}>Monthly</span>
                    <button 
                        onClick={() => setIsAnnual(!isAnnual)}
                        className="relative w-14 h-8 bg-gray-200 rounded-full p-1 transition-colors duration-200 ease-in-out focus:outline-none"
                    >
                        <div className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${isAnnual ? 'translate-x-6' : 'translate-x-0'}`} />
                    </button>
                    <span className={`text-sm font-medium ${isAnnual ? 'text-gray-900' : 'text-gray-500'}`}>
                        Yearly <span className="text-blue-600 text-xs font-bold bg-blue-50 px-2 py-0.5 rounded-full ml-1">get discount</span>
                    </span>
                </div>
            </div>

            {/* Cards Grid */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                {plans.map((plan, index) => (
                    <div 
                        key={index}
                        className={`rounded-3xl p-8 border ${plan.style} transition-all duration-300 hover:shadow-xl flex flex-col`}
                    >
                        {/* Popular Badge */}
                        {plan.popular && (
                            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-bold px-4 py-1 rounded-full shadow-lg">
                                    Most Popular
                                </span>
                            </div>
                        )}

                        {/* Card Header */}
                        <div className="mb-6 flex justify-between items-start">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-1">{plan.name}</h3>
                                <p className="text-gray-500 text-sm">{plan.description}</p>
                            </div>
                            <div className="p-2 bg-gray-50 rounded-lg">
                                {plan.icon}
                            </div>
                        </div>

                        {/* Price */}
                        <div className="mb-8">
                            <div className="flex items-baseline">
                                <span className="text-4xl font-extrabold text-gray-900">₦{plan.price}</span>
                                <span className="text-gray-500 ml-2">/mo</span>
                            </div>
                            {isAnnual && plan.price !== "0" && (
                                <p className="text-xs text-gray-400 mt-1">Billed ${parseInt(plan.price) * 12} yearly</p>
                            )}
                        </div>

                        {/* CTA Button */}
                        <button className={`w-full py-3 px-6 rounded-xl font-bold text-sm mb-8 transition-all duration-200 
                            ${plan.popular 
                                ? 'bg-gray-900 text-white hover:bg-gray-800 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5' 
                                : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                            }`}
                        >
                            {plan.cta}
                        </button>

                        {/* Features Divider */}
                        <div className="border-t border-gray-100 mb-8"></div>

                        {/* Feature List */}
                        <ul className="space-y-4 mb-4 flex-1">
                            {plan.features.map((feature, i) => (
                                <li key={i} className="flex items-start gap-3">
                                    <div className={`mt-0.5 rounded-full p-0.5 ${plan.popular ? 'bg-blue-100' : 'bg-gray-100'}`}>
                                        <Check size={14} className={plan.popular ? 'text-blue-600' : 'text-gray-600'} />
                                    </div>
                                    <span className="text-gray-600 text-sm font-medium">{feature}</span>
                                </li>
                            ))}
                            
                            {plan.disabled.map((feature, i) => (
                                <li key={i} className="flex items-start gap-3 opacity-40">
                                    <div className="mt-0.5 rounded-full p-0.5 bg-gray-50">
                                        <X size={14} className="text-gray-400" />
                                    </div>
                                    <span className="text-gray-500 text-sm">{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            {/* Trust Footer */}
           
        </div>
    );
};

export default Pricing;