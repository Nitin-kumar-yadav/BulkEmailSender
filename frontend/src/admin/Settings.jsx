import React, { useState } from 'react'
import { toggleTheme } from '../theme/theme'
import Checkbox from '../components/Checkbox'
import { IoMoonOutline, IoSaveOutline, IoShieldCheckmarkOutline, IoColorPaletteOutline } from 'react-icons/io5'

const SettingsSection = ({ icon, title, description, children }) => (
    <div className="flex flex-col gap-3 border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200 dark:bg-[var(--bg-primary)] bg-[var(--bg-quaternary)]">
        {/* ↑ Removed bg-white, added theme-aware bg classes */}
        <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
            <div className="p-2 rounded-xl bg-gray-50 text-gray-600">
                {icon}
            </div>
            <div>
                <h2 className="font-comfortaa font-semibold dark:text-[var(--text-secondary)] text-[var(--text-primary)]">{title}</h2>
                {description && <p className="text-xs text-gray-400 font-comfortaa mt-0.5">{description}</p>}
            </div>
        </div>
        {children}
    </div>
)

const Settings = () => {
    const [appPassword, setAppPassword] = useState('')
    const [saved, setSaved] = useState(false)

    const handleSave = () => {
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
    }

    return (
        <div className="flex flex-col absolute w-[80%] mx-5 my-2 left-[17%] overflow-x-hidden">

            {/* Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold font-comforta">Settings</h1>
                <p className="text-gray-400 font-comfortaa text-sm mt-1">Manage your email preferences and account configuration</p>
            </div>

            <div className="flex flex-col gap-4 w-full max-w-2xl">

                {/* Security Section */}
                <SettingsSection
                    icon={<IoShieldCheckmarkOutline size={18} />}
                    title="Security"
                    description="Manage your credentials and access"
                >
                    <div className="flex flex-col gap-1.5">
                        <label className="font-comfortaa text-sm font-medium">
                            App Password
                        </label>
                        <p className="text-xs text-gray-400 font-comfortaa">
                            Used to authenticate your email account securely
                        </p>
                        <input
                            type="password"
                            name="appPassword"
                            value={appPassword}
                            onChange={(e) => setAppPassword(e.target.value)}
                            placeholder="Enter your app password"
                            className="border border-gray-200 rounded-xl px-4 py-2.5 outline-none w-full text-sm
                                       focus:ring-2 focus:ring-gray-300 focus:border-transparent
                                       placeholder:text-gray-300 font-comfortaa transition"
                        />
                    </div>
                </SettingsSection>

                {/* Save Button */}
                <div className="flex justify-end pt-2">
                    <button
                        onClick={handleSave}
                        className="flex items-center gap-2 bg-[var(--bg-tertiary)] text-white px-6 py-3
                                   rounded-full font-medium font-space-grotesk text-sm
                                   hover:bg-[var(--bg-secondary)] hover:cursor-pointer
                                   active:scale-95 transition-all duration-150 w-[200px] justify-center"
                    >
                        <IoSaveOutline size={16} />
                        {saved ? 'Saved!' : 'Save Changes'}
                    </button>
                </div>

                <div className="flex justify-end pt-2">
                    <p className="text-xs text-gray-400 font-comfortaa mt-0.5">
                        How to know your app password?
                        <a href="https://support.google.com/accounts/answer/185833?hl=en" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline ml-1">
                            Click here
                        </a>
                    </p>
                </div>

            </div>
        </div>
    )
}

export default Settings