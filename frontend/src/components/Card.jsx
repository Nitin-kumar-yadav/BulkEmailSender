import React from 'react';

const Pricing = () => {
    const plans = [
        {
            name: "Free",
            price: "$0",
            description: "Perfect for getting started.",
            features: ["Unlimited updates", "15,000 emails per month", "Community support"],
            buttonText: "Start for Free",
        },
        {
            name: "Pro",
            price: "$29",
            description: "Best for growing businesses.",
            features: ["Unlimited updates", "50,000 emails per month", "Priority support", "Custom domains"],
            buttonText: "Get Pro",
            highlight: true,
        },
        {
            name: "Enterprise",
            price: "$99",
            description: "Advanced features for large teams.",
            features: ["Unlimited updates", "Unlimited emails", "24/7 Phone support", "Dedicated manager"],
            buttonText: "Contact Sales",
        },
    ];

    return (
        <div className="w-full max-w-7xl m-auto flex flex-col items-center justify-center text-center my-12 px-4">
            <h1 className="text-4xl md:text-5xl font-bold font-comfortaa leading-tight">Pricing</h1>
            <p className="text-xl font-medium font-space-grotesk pt-4 text-gray-600">
                Choose the plan that best fits your needs.
            </p>

            {/* Responsive Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 w-full">
                {plans.map((plan, index) => (
                    <div
                        key={index}
                        className={`flex flex-col p-8 rounded-2xl border transition-all duration-300 hover:shadow-xl ${plan.highlight ? 'border-blue-500 ring-2 ring-blue-500 ring-opacity-50' : 'border-gray-200'
                            }`}
                    >
                        <h2 className="text-2xl font-bold font-comfortaa">{plan.name}</h2>
                        <div className="my-4">
                            <span className="text-4xl font-bold">{plan.price}</span>
                            <span className="text-gray-500">/month</span>
                        </div>
                        <p className="text-gray-600 font-space-grotesk mb-6">{plan.description}</p>

                        <ul className="text-left space-y-4 mb-8 flex-grow">
                            {plan.features.map((feature, i) => (
                                <li key={i} className="flex items-center gap-2">
                                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                    {feature}
                                </li>
                            ))}
                        </ul>

                        <button className={`w-full py-3 px-6 rounded-lg font-bold transition-colors cursor-pointer ${plan.highlight
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                            }`}
                            onClick={() => window.location.href = '/login'}
                        >
                            {plan.buttonText}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Pricing;