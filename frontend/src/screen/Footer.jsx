import React from 'react';

const Footer = () => {
    const footerSections = [
        {
            title: "Services",
            links: ["Bulk email sender", "Automated email", "Mass email sender", "Google Gemini Support"]
        },
        {
            title: "Features",
            links: ["Use AI to write emails", "Use your own email", "Email Templates", "Upload CSV file"]
        }
    ];

    return (
        <footer className="w-full border-t border-gray-100 mt-20 py-12 px-6">
            <div className="max-w-6xl m-auto flex flex-col md:flex-row items-start justify-center gap-12 md:gap-32">

                {footerSections.map((section, index) => (
                    <div key={index} className="flex flex-col items-start gap-4">
                        <h3 className="text-xl font-bold font-comfortaa text-gray-800 tracking-tight">
                            {section.title}
                        </h3>
                        <ul className="flex flex-col gap-3 text-lg font-medium font-space-grotesk text-gray-500">
                            {section.links.map((link, linkIndex) => (
                                <li key={linkIndex}>
                                    <a
                                        href={`#${link.toLowerCase().replace(/\s+/g, '-')}`}
                                        className="hover:text-blue-600 transition-colors duration-200 cursor-pointer"
                                    >
                                        {link}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}

            </div>

            <div className="mt-12 text-center border-t border-gray-50 pt-8">
                <p className="font-space-grotesk text-gray-400 text-sm">
                    © {new Date().getFullYear()} Bulk Email Sender. All rights reserved.
                </p>
            </div>
        </footer>
    );
};

export default Footer;