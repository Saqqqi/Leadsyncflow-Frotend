import React, { useState } from "react";

const InputFiles = () => {
    const [emailFields, setEmailFields] = useState([]);
    const [phoneFields, setPhoneFields] = useState([]);
    const [leadSource, setLeadSource] = useState("");

    const addField = (type) => {
        if ((type === 'email' && emailFields.length < 9) ||
            (type === 'phone' && phoneFields.length < 9)) {

            const fieldCount = type === 'email' ? emailFields.length : phoneFields.length;

            const newField = {
                id: Date.now() + Math.random(),
                type: type,
                label: type === 'email' ? `Additional Email ${fieldCount + 1}` : `Additional Phone ${fieldCount + 1}`,
                placeholder: type === 'email' ? "alternate@leadsync.com" : "+1 (000) 000-0000"
            };

            if (type === 'email') {
                setEmailFields([...emailFields, newField]);
            } else {
                setPhoneFields([...phoneFields, newField]);
            }
        }
    };

    const removeField = (id, type) => {
        if (type === 'email') {
            setEmailFields(emailFields.filter(field => field.id !== id));
        } else {
            setPhoneFields(phoneFields.filter(field => field.id !== id));
        }
    };

    const baseFields = [
        { label: "Standard Name", placeholder: "System Assigned", type: "text", disabled: true },
        { label: "Primary Designation", placeholder: "Data Miner Level 4", type: "text", disabled: true },
        { label: "First Name", placeholder: "e.g. John", type: "text" },
        { label: "Location", placeholder: "e.g. London", type: "text" },
    ];

    const getTotalDynamicFields = () => {
        return emailFields.length + phoneFields.length;
    };

    return (
        <div className="p-4 sm:p-6 md:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-1000">
            {/* Main Form Container */}
            <div
                className="max-w-7xl mx-auto rounded-[2rem] border shadow-2xl relative overflow-hidden transition-all duration-500"
                style={{
                    backgroundColor: 'var(--bg-secondary)',
                    borderColor: 'var(--border-primary)'
                }}
            >
                {/* Visual Flair / Background Gradients */}
                <div className="absolute -right-24 -top-24 w-80 h-80 bg-gradient-to-br from-blue-500/10 to-indigo-600/10 rounded-full blur-3xl"></div>
                <div className="absolute -left-24 -bottom-24 w-80 h-80 bg-gradient-to-br from-purple-500/10 to-pink-600/10 rounded-full blur-3xl"></div>

                <form className="relative z-10 p-6 sm:p-10 space-y-10">
                    {/* Header Section */}
                    <div className="flex items-center gap-5 mb-8">
                        <div className="p-3 rounded-[1rem] bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-xl shadow-blue-500/20">
                            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-2xl font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>Profile Metadata</h2>
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-50" style={{ color: 'var(--text-secondary)' }}>Configure system identity</p>
                        </div>
                    </div>

                    {/* First Row: Base Fields in 2x2 grid */}
                    <div className="grid grid-cols-2 gap-x-6 sm:gap-x-10 gap-y-6 mb-10">
                        {baseFields.map((field, idx) => (
                            <div key={`base-${idx}`} className={`group/field space-y-2 ${field.disabled ? 'opacity-60' : ''}`}>
                                <div className="flex justify-between items-center pr-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.25em] ml-1 block transition-colors group-focus-within/field:text-blue-500" style={{ color: 'var(--text-tertiary)' }}>
                                        {field.label} {field.disabled && "(Locked)"}
                                    </label>
                                </div>
                                <div className="relative">
                                    <input
                                        type={field.type}
                                        disabled={field.disabled}
                                        className={`w-full px-5 py-3 rounded-xl border outline-none font-bold transition-all duration-300 ${field.disabled ? 'cursor-not-allowed bg-transparent' : 'focus:ring-4 focus:ring-blue-500/10 bg-white/5'}`}
                                        placeholder={field.placeholder}
                                        style={{
                                            borderColor: 'var(--border-primary)',
                                            color: 'var(--text-primary)',
                                            backgroundColor: field.disabled ? 'rgba(0,0,0,0.05)' : 'var(--bg-primary)'
                                        }}
                                    />
                                    {!field.disabled && (
                                        <div className="absolute bottom-0 left-6 right-6 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-600 scale-x-0 group-focus-within/field:scale-x-100 transition-transform duration-500 rounded-full"></div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Contact Information Section */}
                    <div className="space-y-6">
                        <div className="pb-3 border-b" style={{ borderColor: 'var(--border-primary)' }}>
                            <h3 className="text-base font-black opacity-80" style={{ color: 'var(--text-primary)' }}>
                                Contact Configuration
                            </h3>
                        </div>

                        {/* Two Column Layout for Contact Information */}
                        <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">
                            {/* Left Column: Phone Numbers */}
                            <div className="flex-1 space-y-6">
                                <div className="space-y-2">


                                    <div className="grid grid-cols-2 gap-3">
                                        {/* Main Phone Field */}
                                        <div className="group/field space-y-1 col-span-2">
                                            <div className="flex justify-between items-center pr-2">
                                                <span className="text-[12px] font-black text-blue-500/80 uppercase tracking-widest ml-1">Primary Number</span>
                                                {phoneFields.length < 9 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => addField('phone')}
                                                        className="px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-500 flex items-center gap-2 hover:bg-blue-500 hover:text-white transition-all transform active:scale-95 border border-blue-500/20"
                                                        title="Add more Phone Numbers"
                                                    >
                                                        <svg className="w-3.5 h-3.5 transition-transform group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" />
                                                        </svg>
                                                        <span className="text-[10px] font-black uppercase tracking-wider">Add Number</span>
                                                    </button>
                                                )}
                                            </div>
                                            <div className="relative">
                                                <input
                                                    type="tel"
                                                    className="w-full px-4 py-2.5 rounded-lg border outline-none font-bold text-sm transition-all duration-300 focus:ring-4 focus:ring-blue-500/10 bg-white/5"
                                                    placeholder="+1 (555) 000-0000"
                                                    style={{
                                                        borderColor: 'var(--border-primary)',
                                                        color: 'var(--text-primary)',
                                                        backgroundColor: 'var(--bg-primary)'
                                                    }}
                                                />
                                                <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-600 scale-x-0 group-focus-within/field:scale-x-100 transition-transform duration-500 rounded-full"></div>
                                            </div>
                                        </div>

                                        {/* Additional Phone Fields */}
                                        {phoneFields.map((field) => (
                                            <div key={field.id} className="group/field space-y-1 animate-in zoom-in-95 duration-300">
                                                <div className="flex justify-between items-center pr-2">
                                                    <label className="text-[8px] font-black text-emerald-500/80 uppercase tracking-widest ml-1 block">
                                                        {field.label}
                                                    </label>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeField(field.id, 'phone')}
                                                        className="w-4 h-4 rounded-md bg-red-500/10 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"
                                                        title="Remove Field"
                                                    >
                                                        <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    </button>
                                                </div>
                                                <div className="relative">
                                                    <input
                                                        type="tel"
                                                        className="w-full px-4 py-2.5 rounded-lg border border-dashed outline-none font-bold text-sm bg-white/5 transition-all focus:ring-4 focus:ring-blue-500/10"
                                                        placeholder={field.placeholder}
                                                        style={{
                                                            borderColor: 'var(--border-primary)',
                                                            color: 'var(--text-primary)',
                                                            backgroundColor: 'var(--bg-primary)'
                                                        }}
                                                    />
                                                    <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 scale-x-0 group-focus-within/field:scale-x-100 transition-transform duration-500 rounded-full"></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: Email Addresses */}
                            <div className="flex-1 space-y-6">
                                <div className="space-y-2">

                                    <div className="grid grid-cols-2 gap-3">
                                        {/* Main Email Field */}
                                        <div className="group/field space-y-1 col-span-2">
                                            <div className="flex justify-between items-center pr-2">
                                                <span className="text-[12px] font-black text-blue-500/80 uppercase tracking-widest ml-1">Primary Email</span>
                                                {emailFields.length < 9 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => addField('email')}
                                                        className="px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-500 flex items-center gap-2 hover:bg-blue-500 hover:text-white transition-all transform active:scale-95 border border-blue-500/20"
                                                        title="Add more Email Addresses"
                                                    >
                                                        <svg className="w-3.5 h-3.5 transition-transform group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" />
                                                        </svg>
                                                        <span className="text-[10px] font-black uppercase tracking-wider">Add Email</span>
                                                    </button>
                                                )}
                                            </div>
                                            <div className="relative">
                                                <input
                                                    type="email"
                                                    className="w-full px-4 py-2.5 rounded-lg border outline-none font-bold text-sm transition-all duration-300 focus:ring-4 focus:ring-blue-500/10 bg-white/5"
                                                    placeholder="john@leadsync.com"
                                                    style={{
                                                        borderColor: 'var(--border-primary)',
                                                        color: 'var(--text-primary)',
                                                        backgroundColor: 'var(--bg-primary)'
                                                    }}
                                                />
                                                <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-600 scale-x-0 group-focus-within/field:scale-x-100 transition-transform duration-500 rounded-full"></div>
                                            </div>
                                        </div>

                                        {/* Additional Email Fields */}
                                        {emailFields.map((field) => (
                                            <div key={field.id} className="group/field space-y-1 animate-in zoom-in-95 duration-300">
                                                <div className="flex justify-between items-center pr-2">
                                                    <label className="text-[8px] font-black text-emerald-500/80 uppercase tracking-widest ml-1 block">
                                                        {field.label}
                                                    </label>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeField(field.id, 'email')}
                                                        className="w-4 h-4 rounded-md bg-red-500/10 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"
                                                        title="Remove Field"
                                                    >
                                                        <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    </button>
                                                </div>
                                                <div className="relative">
                                                    <input
                                                        type="email"
                                                        className="w-full px-4 py-2.5 rounded-lg border border-dashed outline-none font-bold text-sm bg-white/5 transition-all focus:ring-4 focus:ring-blue-500/10"
                                                        placeholder={field.placeholder}
                                                        style={{
                                                            borderColor: 'var(--border-primary)',
                                                            color: 'var(--text-primary)',
                                                            backgroundColor: 'var(--bg-primary)'
                                                        }}
                                                    />
                                                    <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 scale-x-0 group-focus-within/field:scale-x-100 transition-transform duration-500 rounded-full"></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Lead Source Section */}
                    <div className="pt-10 border-t" style={{ borderColor: 'var(--border-primary)' }}>
                        <div className="flex items-center gap-5 mb-8">
                            <div className="p-3 rounded-[1rem] bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-xl shadow-amber-500/20">
                                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-2xl font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>Lead Acquisition Source</h2>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 sm:gap-x-10 gap-y-6">
                            {/* Source Dropdown */}
                            <div className="group/field space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.25em] ml-1 block" style={{ color: 'var(--text-tertiary)' }}>
                                    Select Lead Source
                                </label>
                                <div className="relative">
                                    <select
                                        value={leadSource}
                                        onChange={(e) => setLeadSource(e.target.value)}
                                        className="w-full px-5 py-3 rounded-xl border outline-none font-bold transition-all duration-300 focus:ring-4 focus:ring-blue-500/10 bg-white/5 appearance-none cursor-pointer"
                                        style={{
                                            borderColor: 'var(--border-primary)',
                                            color: 'var(--text-primary)',
                                            backgroundColor: 'var(--bg-primary)'
                                        }}
                                    >
                                        <option value="" className="bg-slate-900 text-white">Choose a source...</option>
                                        <option value="Facebook" className="bg-slate-900 text-white">Facebook</option>
                                        <option value="Instagram" className="bg-slate-900 text-white">Instagram</option>
                                        <option value="YouTube" className="bg-slate-900 text-white">YouTube</option>
                                        <option value="Other" className="bg-slate-900 text-white">Other Source</option>
                                    </select>
                                    <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                    <div className="absolute bottom-0 left-6 right-6 h-0.5 bg-gradient-to-r from-amber-500 to-orange-600 scale-x-0 group-focus-within/field:scale-x-100 transition-transform duration-500 rounded-full"></div>
                                </div>
                            </div>

                            {/* Conditional Rendering based on leadSource */}
                            {leadSource && (leadSource === 'Facebook' || leadSource === 'Instagram' || leadSource === 'YouTube') && (
                                <div className="group/field space-y-2 animate-in slide-in-from-left-5 duration-500">
                                    <label className="text-[10px] font-black uppercase tracking-[0.25em] ml-1 block" style={{ color: 'var(--text-tertiary)' }}>
                                        {leadSource} Profile URL
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="url"
                                            className="w-full px-5 py-3 rounded-xl border outline-none font-bold transition-all duration-300 focus:ring-4 focus:ring-blue-500/10 bg-white/5"
                                            placeholder={`https://www.${leadSource.toLowerCase()}.com/username`}
                                            style={{
                                                borderColor: 'var(--border-primary)',
                                                color: 'var(--text-primary)',
                                                backgroundColor: 'var(--bg-primary)'
                                            }}
                                        />
                                        <div className="absolute bottom-0 left-6 right-6 h-0.5 bg-gradient-to-r from-amber-500 to-orange-600 scale-x-0 group-focus-within/field:scale-x-100 transition-transform duration-500 rounded-full"></div>
                                    </div>
                                </div>
                            )}

                            {leadSource === 'Other' && (
                                <>
                                    <div className="group/field space-y-2 animate-in slide-in-from-left-5 duration-500">
                                        <label className="text-[10px] font-black uppercase tracking-[0.25em] ml-1 block" style={{ color: 'var(--text-tertiary)' }}>
                                            Custom Source Name
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                className="w-full px-5 py-3 rounded-xl border outline-none font-bold transition-all duration-300 focus:ring-4 focus:ring-blue-500/10 bg-white/5"
                                                placeholder="e.g. LinkedIn, TikTok, etc."
                                                style={{
                                                    borderColor: 'var(--border-primary)',
                                                    color: 'var(--text-primary)',
                                                    backgroundColor: 'var(--bg-primary)'
                                                }}
                                            />
                                            <div className="absolute bottom-0 left-6 right-6 h-0.5 bg-gradient-to-r from-amber-500 to-orange-600 scale-x-0 group-focus-within/field:scale-x-100 transition-transform duration-500 rounded-full"></div>
                                        </div>
                                    </div>
                                    <div className="group/field space-y-2 animate-in slide-in-from-left-5 duration-500">
                                        <label className="text-[10px] font-black uppercase tracking-[0.25em] ml-1 block" style={{ color: 'var(--text-tertiary)' }}>
                                            Source Link
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="url"
                                                className="w-full px-5 py-3 rounded-xl border outline-none font-bold transition-all duration-300 focus:ring-4 focus:ring-blue-500/10 bg-white/5"
                                                placeholder="https://..."
                                                style={{
                                                    borderColor: 'var(--border-primary)',
                                                    color: 'var(--text-primary)',
                                                    backgroundColor: 'var(--bg-primary)'
                                                }}
                                            />
                                            <div className="absolute bottom-0 left-6 right-6 h-0.5 bg-gradient-to-r from-amber-500 to-orange-600 scale-x-0 group-focus-within/field:scale-x-100 transition-transform duration-500 rounded-full"></div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Bottom Actions */}
                    <div className="pt-8 flex flex-col sm:flex-row items-center gap-6">
                        <button
                            type="submit"
                            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-black rounded-xl shadow-2xl shadow-blue-500/30 transition-all duration-300 transform hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3"
                        >
                            <span>Save Input Profile</span>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </button>

                        <div className="hidden lg:flex flex-1 justify-end items-center gap-3">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--text-tertiary)' }}>Auto-save Active</span>
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default InputFiles;