import React, { useState, useEffect } from 'react';
import { superAdminAPI } from '../../../api/super-admin';
import SharedLoader from '../../../components/SharedLoader';

export default function SuperAdminPortal() {
    const [managersWithLQs, setManagersWithLQs] = useState([]);
    const [managersWithoutLQs, setManagersWithoutLQs] = useState([]);
    const [unassignedLqs, setUnassignedLqs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);
    const [error, setError] = useState(null);
    const [toast, setToast] = useState(null);
    const [selectedManager, setSelectedManager] = useState('');
    const [selectedLqs, setSelectedLqs] = useState([]);
    const [viewingManagerLqs, setViewingManagerLqs] = useState(null);
    const [managerSearch, setManagerSearch] = useState('');
    const [lqSearch, setLqSearch] = useState('');

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [withRes, withoutRes, unassignedRes] = await Promise.all([
                superAdminAPI.getManagersWithLQs(),
                superAdminAPI.getManagersWithoutLQs(),
                superAdminAPI.getUnassignedLeadQualifiers()
            ]);
            setManagersWithLQs(withRes.managers || []);
            setManagersWithoutLQs(withoutRes.managers || []);
            setUnassignedLqs(unassignedRes.leadQualifiers || []);
        } catch (err) {
            console.error('Error fetching data:', err);
            setError('Failed to fetch data');
        } finally {
            setLoading(false);
        }
    };

    const handleAssignLqs = async () => {
        if (!selectedManager || selectedLqs.length === 0) return;
        try {
            setActionLoading('assign');
            await superAdminAPI.assignLqsToManager(selectedManager, selectedLqs);
            await fetchData();
            setSelectedLqs([]);
            setSelectedManager('');
            showToast('LQs assigned successfully');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to assign LQs');
        } finally {
            setActionLoading(null);
        }
    };

    const handleUnassignLqs = async (lqIds) => {
        try {
            setActionLoading('unassign');
            await superAdminAPI.unassignLqs(lqIds);
            await fetchData();
            showToast('LQs unassigned successfully');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to unassign LQs');
        } finally {
            setActionLoading(null);
        }
    };

    if (loading) return <SharedLoader />;

    return (
        <div className="p-4 md:p-6 space-y-6 max-w-[1400px] mx-auto animate-fadeIn min-h-screen relative">
            {/* Custom Toast Notification - UI Enhancement */}
            {toast && (
                <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[200] animate-toastIn">
                    <div className={`px-6 py-3 rounded-2xl border shadow-2xl flex items-center gap-3 ${toast.type === 'success'
                        ? 'bg-[#06140d] border-emerald-500/20 text-emerald-400'
                        : 'bg-[#140606] border-red-500/20 text-red-400'
                        }`}>
                        <div className={`w-2 h-2 rounded-full ${toast.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'} animate-pulse`} />
                        <span className="text-[11px] font-black uppercase tracking-widest">{toast.message}</span>
                    </div>
                </div>
            )}

            {/* Header Section */}
            <div className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-[24px] p-4 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-[var(--accent-primary)] opacity-5 rounded-full blur-[80px] -mr-24 -mt-24" />
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <div className="p-2 bg-[var(--accent-primary)]/10 rounded-xl text-[var(--accent-primary)]">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <h1 className="text-xl font-black tracking-tight text-[var(--text-primary)]">
                                LeadSync<span className="text-[var(--accent-primary)]">Flow</span>
                            </h1>
                        </div>
                        <p className="text-[11px] font-bold text-[var(--text-secondary)] opacity-70 uppercase tracking-widest pl-1">
                            Super Admin Dashboard | Manager & LQ Assignment
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <div className="px-4 py-2 bg-[var(--bg-tertiary)] border border-[var(--border-primary)] rounded-xl flex flex-col items-center min-w-[100px]">
                            <span className="text-[9px] font-black text-[var(--text-tertiary)] uppercase tracking-widest">Managers</span>
                            <span className="text-sm font-black text-[var(--accent-primary)]">{managersWithLQs.length + managersWithoutLQs.length}</span>
                        </div>
                        <div className="px-4 py-2 bg-[var(--bg-tertiary)] border border-[var(--border-primary)] rounded-xl flex flex-col items-center min-w-[100px]">
                            <span className="text-[9px] font-black text-[var(--text-tertiary)] uppercase tracking-widest">Unassigned LQs</span>
                            <span className="text-sm font-black text-emerald-500">{unassignedLqs.length}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="mx-1 p-3 rounded-xl border animate-shake bg-red-500/10 border-red-500/20">
                    <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <span className="text-red-500 text-[10px] font-bold uppercase tracking-widest">{error}</span>
                    </div>
                </div>
            )}

            {/* Main Content Areas */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">

                {/* Left Column: Assignment Panel (7 cols wide) */}
                <div className="xl:col-span-7 space-y-4">
                    <div className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-[24px] p-5 shadow-xl relative overflow-hidden group/card backdrop-blur-md">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--accent-primary)] to-transparent opacity-40" />

                        <div className="flex items-center justify-between mb-5">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-[var(--accent-primary)]/10 flex items-center justify-center text-[var(--accent-primary)] shadow border border-[var(--accent-primary)]/20">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                                </div>
                                <div>
                                    <h3 className="text-[10px] font-black text-[var(--text-primary)] uppercase tracking-[0.3em]">Manager Assignment</h3>
                                    <p className="text-[8px] font-bold text-[var(--text-tertiary)] uppercase tracking-widest mt-0.5 opacity-60">Link Lead Qualifiers to Managers</p>
                                </div>
                            </div>
                            {selectedLqs.length > 0 && (
                                <button
                                    onClick={() => setSelectedLqs([])}
                                    className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 text-[8px] font-black uppercase tracking-widest rounded-lg transition-all"
                                >
                                    Clear Selection ({selectedLqs.length})
                                </button>
                            )}
                        </div>

                        <div className="space-y-6">
                            {/* Manager Selection - Improved Searchable Selector */}
                            <div className="relative group/manager">
                                <label className="flex justify-between text-[10px] font-black text-[var(--text-tertiary)] uppercase tracking-[0.2em] mb-3 px-1">
                                    <span>Target Manager Selection</span>
                                    {selectedManager && <span className="text-[var(--accent-primary)] animate-pulse">Linked Manager Confirmed</span>}
                                </label>

                                <div className="space-y-3">
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="SEARCH MANAGERS..."
                                            value={managerSearch}
                                            onChange={(e) => setManagerSearch(e.target.value)}
                                            className="w-full bg-[var(--bg-tertiary)]/30 border border-[var(--border-primary)] rounded-xl py-2.5 pl-10 pr-4 text-[10px] font-bold text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] placeholder:opacity-40 focus:border-[var(--accent-primary)]/50 focus:ring-1 focus:ring-[var(--accent-primary)]/20 transition-all outline-none uppercase tracking-widest"
                                        />
                                        <svg className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar pb-1">
                                        {[...managersWithoutLQs, ...managersWithLQs]
                                            .sort((a, b) => (a.name || '').localeCompare(b.name || ''))
                                            .filter(m => !managerSearch || m.name.toLowerCase().includes(managerSearch.toLowerCase()) || m.email.toLowerCase().includes(managerSearch.toLowerCase()))
                                            .map(m => (
                                                <div
                                                    key={m._id}
                                                    onClick={() => setSelectedManager(m._id)}
                                                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center gap-3 group/mitem ${selectedManager === m._id
                                                        ? 'bg-[var(--accent-primary)]/10 border-[var(--accent-primary)] shadow-[0_0_15px_rgba(var(--accent-primary-rgb),0.1)]'
                                                        : 'bg-[var(--bg-tertiary)]/10 border-[var(--border-primary)]/40 hover:border-[var(--accent-primary)]/30 hover:bg-[var(--bg-tertiary)]/20'}`}
                                                >
                                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-[11px] flex-shrink-0 transition-all ${selectedManager === m._id ? 'bg-[var(--accent-primary)] text-white scale-110 shadow-lg shadow-[var(--accent-primary)]/20' : 'bg-[var(--bg-tertiary)] text-[var(--accent-primary)] group-hover/mitem:scale-105'}`}>
                                                        {m.name.charAt(0)}
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <div className={`text-[9px] font-black uppercase truncate tracking-tight transition-colors ${selectedManager === m._id ? 'text-[var(--accent-primary)]' : 'text-[var(--text-primary)]'}`}>{m.name}</div>
                                                        <div className="text-[7px] font-black text-[var(--text-tertiary)] opacity-30 uppercase truncate tracking-tighter">{m.email}</div>
                                                    </div>
                                                </div>
                                            ))}
                                        {([...managersWithoutLQs, ...managersWithLQs].filter(m => !managerSearch || m.name.toLowerCase().includes(managerSearch.toLowerCase()))).length === 0 && (
                                            <div className="col-span-full py-8 text-center bg-[var(--bg-tertiary)]/5 border border-dashed border-[var(--border-primary)] rounded-2xl">
                                                <p className="text-[9px] font-black text-[var(--text-tertiary)] uppercase tracking-widest opacity-30">No Managers Matching Search</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* LQ Selection Pool - Advanced Multi-select */}
                            <div className="relative group/lq">
                                <div className="flex justify-between items-center mb-3">
                                    <label className="text-[10px] font-black text-[var(--text-tertiary)] uppercase tracking-[0.2em] px-1">Lead Qualifiers Pool</label>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => {
                                                const filtered = unassignedLqs
                                                    .filter(lq => !lqSearch || lq.name.toLowerCase().includes(lqSearch.toLowerCase()))
                                                    .map(lq => lq.id);
                                                setSelectedLqs(Array.from(new Set([...selectedLqs, ...filtered])));
                                            }}
                                            className="text-[8px] font-black text-[var(--accent-primary)] uppercase tracking-widest hover:brightness-125 transition-all"
                                        >
                                            Select Page
                                        </button>
                                        <button
                                            onClick={() => setSelectedLqs([])}
                                            className="text-[8px] font-black text-red-500/60 hover:text-red-500 uppercase tracking-widest transition-all"
                                        >
                                            Clear All
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="FILTER QUALIFIERS (NAME OR EMAIL)..."
                                            value={lqSearch}
                                            onChange={(e) => setLqSearch(e.target.value)}
                                            className="w-full bg-[var(--bg-tertiary)]/30 border border-[var(--border-primary)] rounded-xl py-2.5 pl-10 pr-4 text-[10px] font-bold text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] placeholder:opacity-40 focus:border-[var(--accent-primary)]/50 focus:ring-1 focus:ring-[var(--accent-primary)]/20 transition-all outline-none uppercase tracking-widest"
                                        />
                                        <svg className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                                        </svg>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 max-h-64 overflow-y-auto p-1 rounded-2xl border border-[var(--border-primary)]/20 custom-scrollbar">
                                        {unassignedLqs
                                            .filter(lq => !lqSearch || lq.name.toLowerCase().includes(lqSearch.toLowerCase()) || lq.email.toLowerCase().includes(lqSearch.toLowerCase()))
                                            .map(lq => (
                                                <label key={lq.id} className={`flex flex-col p-2.5 rounded-xl border transition-all cursor-pointer group/uitem relative overflow-hidden ${selectedLqs.includes(lq.id) ? 'bg-[var(--accent-primary)]/5 border-[var(--accent-primary)]/40 shadow-sm' : 'bg-[var(--bg-tertiary)]/10 border-[var(--border-primary)]/20 hover:border-[var(--accent-primary)]/20'}`}>
                                                    <div className="flex items-start justify-between mb-1.5 relative z-10">
                                                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-black text-[10px] transition-all ${selectedLqs.includes(lq.id) ? 'bg-[var(--accent-primary)] text-white shadow shadow-[var(--accent-primary)]/30' : 'bg-[var(--bg-tertiary)] text-[var(--text-tertiary)]'}`}>
                                                            {lq.name?.charAt(0)}
                                                        </div>
                                                        <div className={`w-4 h-4 rounded-md border-2 transition-all flex items-center justify-center ${selectedLqs.includes(lq.id) ? 'bg-[var(--accent-primary)] border-[var(--accent-primary)]' : 'border-[var(--border-primary)]/40 bg-white/5 group-hover/uitem:border-[var(--accent-primary)]/40'}`}>
                                                            {selectedLqs.includes(lq.id) && <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>}
                                                        </div>
                                                    </div>
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedLqs.includes(lq.id)}
                                                        onChange={(e) => {
                                                            if (e.target.checked) setSelectedLqs([...selectedLqs, lq.id]);
                                                            else setSelectedLqs(selectedLqs.filter(id => id !== lq.id));
                                                        }}
                                                        className="hidden"
                                                    />
                                                    <div className="relative z-10">
                                                        <span className={`text-[9px] font-black uppercase tracking-tight transition-colors truncate block ${selectedLqs.includes(lq.id) ? 'text-[var(--accent-primary)]' : 'text-[var(--text-primary)]'}`}>{lq.name}</span>
                                                        <span className="text-[7px] font-black text-[var(--text-tertiary)] uppercase opacity-30 truncate block tracking-tighter">{lq.email}</span>
                                                    </div>
                                                    {selectedLqs.includes(lq.id) && (
                                                        <div className="absolute top-0 right-0 w-8 h-8 bg-[var(--accent-primary)] opacity-5 rounded-bl-full translate-x-2 -translate-y-2 pointer-events-none" />
                                                    )}
                                                </label>
                                            ))}
                                        {unassignedLqs.length > 0 && unassignedLqs.filter(lq => !lqSearch || lq.name.toLowerCase().includes(lqSearch.toLowerCase())).length === 0 && (
                                            <div className="col-span-full py-12 text-center bg-[var(--bg-tertiary)]/5 border border-dashed border-[var(--border-primary)] rounded-3xl">
                                                <p className="text-[9px] font-black text-[var(--text-tertiary)] uppercase tracking-widest opacity-30">No Qualifiers Match Your Criteria</p>
                                            </div>
                                        )}
                                        {unassignedLqs.length === 0 && (
                                            <div className="col-span-full py-12 text-center">
                                                <p className="text-[10px] font-black text-[var(--text-tertiary)] uppercase tracking-[0.2em] opacity-30">The Pool is Currently Empty</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleAssignLqs}
                                disabled={!selectedManager || selectedLqs.length === 0 || actionLoading === 'assign'}
                                className="w-full py-3.5 rounded-xl bg-[var(--accent-primary)] text-white text-[11px] font-black uppercase tracking-[0.4em] shadow-lg shadow-[var(--accent-primary)]/20 hover:brightness-110 active:scale-[0.99] transition-all disabled:opacity-20 disabled:scale-100 flex items-center justify-center gap-4 group/btn"
                            >
                                {actionLoading === 'assign' ? (
                                    <div className="w-5 h-5 border-3 border-white/20 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        ASSIGN TO MANAGER
                                        <svg className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Column: Organization Hierarchy (5 cols wide) */}
                <div className="xl:col-span-5 space-y-4 sticky top-6">
                    <div className="bg-white/[0.03] border border-white/5 rounded-[24px] p-4 backdrop-blur-xl min-h-[400px] flex flex-col shadow-2xl relative">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent-primary)] opacity-5 rounded-full blur-[60px] -mr-16 -mt-16" />

                        <div className="flex items-center justify-between mb-5 px-1 relative z-10">
                            <h2 className="text-[10px] font-black text-[var(--text-primary)] uppercase tracking-[0.2em] flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)] animate-pulse" />
                                Organization Hierarchy
                            </h2>
                            <div className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                                <span className="text-[7px] font-black text-emerald-500 uppercase tracking-widest leading-none">Active</span>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto pr-1.5 custom-scrollbar space-y-2.5 relative z-10">
                            {managersWithLQs.map(manager => (
                                <div key={manager._id} className="bg-gradient-to-br from-white/[0.05] to-transparent border border-white/5 rounded-xl p-3 hover:border-[var(--accent-primary)]/40 hover:shadow-lg hover:shadow-[var(--accent-primary)]/5 transition-all duration-300 group shadow-md relative overflow-hidden group/item">
                                    <div className="absolute top-0 right-0 w-20 h-20 bg-[var(--accent-primary)] opacity-0 group-hover:opacity-[0.03] rounded-full blur-xl transition-opacity" />

                                    <div className="flex items-center justify-between relative z-10">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center font-black text-[var(--accent-primary)] text-xs shadow-inner group-hover/item:bg-[var(--accent-primary)] group-hover/item:text-white transition-all duration-500">
                                                {manager.name?.charAt(0)}
                                            </div>
                                            <div className="min-w-0">
                                                <h4 className="text-[10px] font-black text-[var(--text-primary)] truncate uppercase tracking-tight leading-3 group-hover/item:text-white transition-colors">{manager.name}</h4>
                                                <div className="flex items-center gap-1.5 mt-1">
                                                    <span className="text-[6px] font-bold text-[var(--text-tertiary)] uppercase opacity-40 truncate">{manager.email}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => setViewingManagerLqs(manager)}
                                            className="flex items-center gap-3 pl-3 border-l border-white/5 group/mbtn"
                                        >
                                            <div className="text-right">
                                                <div className="text-lg font-black text-[var(--text-primary)] tabular-nums group-hover/mbtn:text-[var(--accent-primary)] transition-colors leading-none">
                                                    {String(manager.assignedLQs?.length || 0).padStart(2, '0')}
                                                </div>
                                                <div className="text-[6px] font-black text-[var(--text-tertiary)] uppercase mt-0.5 opacity-60">LQs</div>
                                            </div>
                                            <div className="w-6 h-6 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-[var(--text-tertiary)] group-hover/mbtn:text-[var(--accent-primary)] group-hover/mbtn:border-[var(--accent-primary)] transition-all shadow-sm">
                                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                                </svg>
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {managersWithLQs.length === 0 && (
                                <div className="flex flex-col items-center justify-center py-20 text-center opacity-20">
                                    <svg className="w-10 h-10 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                                    <p className="text-[9px] font-black uppercase tracking-[0.2em]">No hierarchy established</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Assigned Units Modal */}
            {viewingManagerLqs && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-[var(--bg-secondary)] border border-white/10 rounded-[32px] w-full max-w-xl shadow-2xl overflow-hidden animate-slideUp">
                        <div className="p-5 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-[var(--accent-primary)]/10 rounded-2xl flex items-center justify-center text-[var(--accent-primary)] border border-[var(--accent-primary)]/20 shadow-lg">
                                    <span className="text-xl font-black">{viewingManagerLqs.name?.charAt(0)}</span>
                                </div>
                                <div>
                                    <h3 className="text-base font-black text-[var(--text-primary)] uppercase tracking-tight">{viewingManagerLqs.name}</h3>
                                    <p className="text-[8px] font-bold text-[var(--text-tertiary)] uppercase tracking-widest opacity-40">{viewingManagerLqs.email}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setViewingManagerLqs(null)}
                                className="w-10 h-10 rounded-full hover:bg-white/5 flex items-center justify-center text-[var(--text-tertiary)] transition-all"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        <div className="p-5 max-h-[40vh] overflow-y-auto custom-scrollbar">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {viewingManagerLqs.assignedLQs?.map(lq => (
                                    <div key={lq._id} className="flex items-center justify-between p-3.5 rounded-2xl bg-[var(--bg-tertiary)]/20 border border-white/5 group/unit hover:border-red-500/20 transition-all">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[var(--accent-primary)] font-black text-[10px] group-hover/unit:text-red-500 transition-colors">
                                                {lq.name?.charAt(0)}
                                            </div>
                                            <div className="min-w-0">
                                                <div className="text-[10px] font-black text-[var(--text-primary)] uppercase truncate">{lq.name}</div>
                                                <div className="text-[7px] font-bold text-[var(--text-tertiary)] opacity-30 uppercase truncate mt-0.5">{lq.email}</div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => {
                                                handleUnassignLqs([lq._id]);
                                                setViewingManagerLqs(null);
                                            }}
                                            className="px-2.5 py-1.5 bg-red-500/10 text-red-500 text-[7px] font-black uppercase tracking-widest rounded-lg hover:bg-red-500 hover:text-white transition-all transform active:scale-95 shadow-sm border border-red-500/10"
                                        >
                                            Unassign
                                        </button>
                                    </div>
                                ))}
                                {(!viewingManagerLqs.assignedLQs || viewingManagerLqs.assignedLQs.length === 0) && (
                                    <div className="col-span-full py-12 text-center opacity-20">
                                        <div className="text-[9px] font-black uppercase tracking-widest">No assigned Lead Qualifiers</div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="p-4 bg-white/5 border-t border-white/5 flex justify-center items-center">
                            <span className="text-[9px] font-black text-[var(--text-primary)] uppercase tracking-widest">
                                {viewingManagerLqs.assignedLQs?.length || 0} ASSIGNED LEAD QUALIFIERS
                            </span>
                        </div>
                    </div>
                </div>
            )}

            <style dangerouslySetInnerHTML={{
                __html: `
                .animate-slideUp {
                    animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(20px) scale(0.98); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }

                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out forwards;
                }
                .animate-shake {
                    animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes shake {
                    10%, 90% { transform: translate3d(-1px, 0, 0); }
                    20%, 80% { transform: translate3d(2px, 0, 0); }
                    30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
                    40%, 60% { transform: translate3d(4px, 0, 0); }
                }
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                    height: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(255,255,255,0.01);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(99, 102, 241, 0.15);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: var(--accent-primary);
                }
            `}} />
        </div>
    );
}
