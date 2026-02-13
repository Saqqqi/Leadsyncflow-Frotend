import React, { useState } from 'react';
import { superAdminAPI } from '../../../api/super-admin';
import SharedLoader from '../../../components/SharedLoader';

export default function SuperAdminPortal() {
    const [activeTab, setActiveTab] = useState(null); // null | 'assignment' | 'hierarchy'

    // Data states
    const [managersWithoutLQs, setManagersWithoutLQs] = useState([]);
    const [unassignedLqs, setUnassignedLqs] = useState([]);
    const [managersWithLQs, setManagersWithLQs] = useState([]);

    const [selectedManagerId, setSelectedManagerId] = useState('');
    const [selectedLqIds, setSelectedLqIds] = useState([]);

    // UI states
    const [loading, setLoading] = useState(false);
    const [assignmentLoaded, setAssignmentLoaded] = useState(false);
    const [hierarchyLoaded, setHierarchyLoaded] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const [error, setError] = useState(null);
    const [toast, setToast] = useState(null);

    // Search
    const [managerSearch, setManagerSearch] = useState('');
    const [lqSearch, setLqSearch] = useState('');

    const showToast = (msg, type = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    const loadAssignmentData = async () => {
        setLoading(true);
        setError(null);
        try {
            const [without, unassigned] = await Promise.all([
                superAdminAPI.getManagersWithoutLQs(),
                superAdminAPI.getUnassignedLeadQualifiers(),
            ]);
            setManagersWithoutLQs(without.managers || []);
            setUnassignedLqs(unassigned.leadQualifiers || []);
            setAssignmentLoaded(true);
        } catch (err) {
            setError('Failed to load assignment data');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const loadHierarchyData = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await superAdminAPI.getManagersWithLQs();
            setManagersWithLQs(res.managers || []);
            setHierarchyLoaded(true);
        } catch (err) {
            setError('Failed to load hierarchy data');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setSelectedManagerId('');
        setSelectedLqIds([]);
        if (tab === 'assignment' && !assignmentLoaded) {
            loadAssignmentData();
        }
        if (tab === 'hierarchy' && !hierarchyLoaded) {
            loadHierarchyData();
        }
    };

    const handleAssign = async () => {
        if (!selectedManagerId || selectedLqIds.length === 0) return;

        setActionLoading(true);
        try {
            await superAdminAPI.assignLqsToManager(selectedManagerId, selectedLqIds);
            setSelectedLqIds([]);
            setSelectedManagerId('');
            await Promise.all([loadAssignmentData(), loadHierarchyData()]);
            showToast('Successfully assigned!');
        } catch (err) {
            const errorMsg = err?.response?.data?.message || 'Failed to assign';
            setError(errorMsg);
            showToast(errorMsg, 'error');
        } finally {
            setActionLoading(false);
        }
    };

    const handleUnassign = async (lqId) => {
        setActionLoading(true);
        try {
            await superAdminAPI.unassignLqs([lqId]);
            await Promise.all([loadAssignmentData(), loadHierarchyData()]);
            showToast('Unassigned successfully');
        } catch (err) {
            const errorMsg = err?.response?.data?.message || 'Failed to unassign';
            setError(errorMsg);
            showToast(errorMsg, 'error');
        } finally {
            setActionLoading(false);
        }
    };

    const refresh = () => {
        if (activeTab === 'assignment') loadAssignmentData();
        if (activeTab === 'hierarchy') loadHierarchyData();
    };

    return (
        <div className="min-h-screen p-4 md:p-8 relative">
            <div className="pointer-events-none absolute inset-0 -z-10">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(35,76,106,0.45),_rgba(15,42,63,0.95)_55%,_rgba(15,42,63,1))]" />
                <div className="absolute -top-28 -right-24 w-80 h-80 bg-[var(--accent-primary)]/15 blur-[120px] rounded-full" />
                <div className="absolute -bottom-24 -left-16 w-72 h-72 bg-[var(--bg-tertiary)]/40 blur-[130px] rounded-full" />
            </div>

            {/* Toast */}
            {toast && (
                <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 animate-fadeIn">
                    <div
                        className={`px-6 py-3 rounded-2xl border shadow-2xl text-[11px] font-black uppercase tracking-widest flex items-center gap-3 ${
                            toast.type === 'success'
                                ? 'bg-[var(--bg-secondary)] border-emerald-500/30 text-emerald-400'
                                : 'bg-[var(--bg-secondary)] border-red-500/30 text-red-400'
                        }`}
                    >
                        <span className="text-[12px]">{toast.type === 'success' ? 'OK' : 'X'}</span>
                        {toast.msg}
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="max-w-[1500px] mx-auto">
                <div className="bg-[var(--bg-secondary)] rounded-[28px] shadow-2xl border border-[var(--border-primary)] p-6 md:p-8 mb-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div>
                            <h1 className="text-3xl font-black text-[var(--text-primary)]">
                                Super Admin Dashboard
                            </h1>
                            <p className="text-[var(--text-secondary)] mt-1 text-sm uppercase tracking-[0.2em]">
                                Manage Managers & Lead Qualifiers
                            </p>
                        </div>

                        <div className="flex items-center gap-4 flex-wrap">
                            <div className="flex bg-[var(--bg-tertiary)]/60 border border-[var(--border-primary)] rounded-2xl p-1.5 shadow-sm">
                                <button
                                    onClick={() => handleTabChange('assignment')}
                                    className={`px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${
                                        activeTab === 'assignment'
                                            ? 'bg-[var(--bg-secondary)] text-[var(--accent-primary)] shadow'
                                            : 'text-[var(--text-tertiary)] hover:text-[var(--text-primary)]'
                                    }`}
                                >
                                    Assignment
                                </button>
                                <button
                                    onClick={() => handleTabChange('hierarchy')}
                                    className={`px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${
                                        activeTab === 'hierarchy'
                                            ? 'bg-[var(--bg-secondary)] text-[var(--accent-primary)] shadow'
                                            : 'text-[var(--text-tertiary)] hover:text-[var(--text-primary)]'
                                    }`}
                                >
                                    View Assigned LQs
                                </button>
                            </div>

                            <button
                                onClick={refresh}
                                disabled={!activeTab || loading || actionLoading}
                                className="px-5 py-2.5 bg-[var(--bg-tertiary)]/60 border border-[var(--border-primary)] rounded-xl text-[11px] font-black uppercase tracking-widest text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition disabled:opacity-40 disabled:hover:text-[var(--text-secondary)]"
                            >
                                {loading ? 'Loading...' : 'Refresh'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {error && (
                <div className="max-w-[1500px] mx-auto bg-red-500/10 border border-red-500/20 text-red-300 p-5 rounded-2xl mb-8 text-[11px] font-black uppercase tracking-widest">
                    {error}
                </div>
            )}

            {loading && (
                <div className="flex justify-center py-20">
                    <SharedLoader size="large" />
                </div>
            )}

            {/* Assignment View */}
            {activeTab === 'assignment' && !loading && (
                <div className="grid lg:grid-cols-2 gap-6 max-w-[1500px] mx-auto">
                    {/* Managers */}
                    <div className="bg-[var(--bg-secondary)] rounded-[24px] shadow-xl border border-[var(--border-primary)] p-6">
                        <h2 className="text-[12px] font-black uppercase tracking-[0.3em] text-[var(--text-primary)] mb-5">
                            Select Manager
                        </h2>

                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={managerSearch}
                            onChange={(e) => setManagerSearch(e.target.value)}
                            className="w-full bg-[var(--bg-tertiary)]/40 border border-[var(--border-primary)] rounded-xl px-4 py-3 text-[11px] font-bold uppercase tracking-widest text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] placeholder:opacity-40 mb-5 outline-none focus:border-[var(--accent-primary)]/40"
                        />

                        {managersWithoutLQs.length === 0 ? (
                            <div className="text-center py-10 text-[var(--text-tertiary)] text-[11px] font-black uppercase tracking-widest">
                                No managers available for assignment
                            </div>
                        ) : (
                            <div className="max-h-[60vh] overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                                {managersWithoutLQs
                                    .filter(
                                        (m) =>
                                            m.name?.toLowerCase().includes(managerSearch.toLowerCase()) ||
                                            m.email?.toLowerCase().includes(managerSearch.toLowerCase())
                                    )
                                    .map((manager) => (
                                        <div
                                            key={manager._id}
                                            onClick={() => setSelectedManagerId(manager._id)}
                                            className={`p-4 rounded-xl border cursor-pointer transition-all ${
                                                selectedManagerId === manager._id
                                                    ? 'bg-[var(--accent-primary)]/15 border-[var(--accent-primary)]/40'
                                                    : 'bg-[var(--bg-tertiary)]/20 border-[var(--border-primary)] hover:border-[var(--accent-primary)]/30'
                                            }`}
                                        >
                                            <div className="text-[12px] font-black text-[var(--text-primary)]">{manager.name}</div>
                                            <div className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase opacity-70">
                                                {manager.email}
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        )}
                    </div>

                    {/* Lead Qualifiers */}
                    <div className="bg-[var(--bg-secondary)] rounded-[24px] shadow-xl border border-[var(--border-primary)] p-6">
                        <div className="flex justify-between items-center mb-5">
                            <h2 className="text-[12px] font-black uppercase tracking-[0.3em] text-[var(--text-primary)]">
                                Unassigned Lead Qualifiers
                            </h2>
                            {selectedLqIds.length > 0 && (
                                <button
                                    onClick={() => setSelectedLqIds([])}
                                    className="text-[10px] font-black uppercase tracking-widest text-red-400 hover:text-red-300"
                                >
                                    Clear selection ({selectedLqIds.length})
                                </button>
                            )}
                        </div>

                        <input
                            type="text"
                            placeholder="Search qualifiers..."
                            value={lqSearch}
                            onChange={(e) => setLqSearch(e.target.value)}
                            className="w-full bg-[var(--bg-tertiary)]/40 border border-[var(--border-primary)] rounded-xl px-4 py-3 text-[11px] font-bold uppercase tracking-widest text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] placeholder:opacity-40 mb-5 outline-none focus:border-[var(--accent-primary)]/40"
                        />

                        {unassignedLqs.length === 0 ? (
                            <div className="text-center py-10 text-[var(--text-tertiary)] text-[11px] font-black uppercase tracking-widest">
                                No unassigned qualifiers
                            </div>
                        ) : (
                            <div className="max-h-[60vh] overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                                {unassignedLqs
                                    .filter(
                                        (lq) =>
                                            lq.name?.toLowerCase().includes(lqSearch.toLowerCase()) ||
                                            lq.email?.toLowerCase().includes(lqSearch.toLowerCase())
                                    )
                                    .map((lq) => (
                                        <label
                                            key={lq._id}
                                            className={`flex items-center p-4 rounded-xl border cursor-pointer transition-all ${
                                                selectedLqIds.includes(lq._id)
                                                    ? 'bg-[var(--accent-primary)]/15 border-[var(--accent-primary)]/40'
                                                    : 'bg-[var(--bg-tertiary)]/20 border-[var(--border-primary)] hover:border-[var(--accent-primary)]/30'
                                            }`}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={selectedLqIds.includes(lq._id)}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setSelectedLqIds([...selectedLqIds, lq._id]);
                                                    } else {
                                                        setSelectedLqIds(selectedLqIds.filter(id => id !== lq._id));
                                                    }
                                                }}
                                                className="h-4 w-4 accent-[var(--accent-primary)] mr-4"
                                            />
                                            <div>
                                                <div className="text-[12px] font-black text-[var(--text-primary)]">{lq.name}</div>
                                                <div className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase opacity-70">
                                                    {lq.email}
                                                </div>
                                            </div>
                                        </label>
                                    ))}
                            </div>
                        )}

                        <button
                            onClick={handleAssign}
                            disabled={!selectedManagerId || selectedLqIds.length === 0 || actionLoading}
                            className="mt-6 w-full bg-[var(--accent-primary)] text-white py-4 rounded-2xl transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[var(--accent-primary)]/20 flex items-center justify-center gap-2 text-[12px] font-black uppercase tracking-[0.3em]"
                        >
                            {actionLoading ? (
                                'Assigning...'
                            ) : (
                                <>
                                    Assign {selectedLqIds.length || ''} Qualifier{selectedLqIds.length !== 1 ? 's' : ''}
                                </>
                            )}
                        </button>
                    </div>
                </div>
            )}

            {/* Hierarchy View */}
            {activeTab === 'hierarchy' && !loading && (
                <div className="max-w-[1400px] mx-auto bg-[var(--bg-secondary)] rounded-[28px] shadow-xl border border-[var(--border-primary)] p-6">
                    <h2 className="text-[12px] font-black uppercase tracking-[0.3em] text-[var(--text-primary)] mb-6">
                        Assigned Lead Qualifiers
                    </h2>

                    <div className="space-y-5">
                        {managersWithLQs.length === 0 ? (
                            <div className="text-center py-16 text-[11px] font-black uppercase tracking-widest text-[var(--text-tertiary)] opacity-60">
                                No assigned Lead Qualifiers yet
                            </div>
                        ) : (
                            managersWithLQs.map((manager) => (
                                <div
                                    key={manager._id}
                                    className="border border-[var(--border-primary)] rounded-2xl p-5 bg-[var(--bg-tertiary)]/30 hover:border-[var(--accent-primary)]/30 transition"
                                >
                                    <div className="flex justify-between items-center mb-4">
                                        <div>
                                            <h3 className="text-[14px] font-black text-[var(--text-primary)]">{manager.name}</h3>
                                            <p className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase opacity-70">
                                                {manager.email}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-3xl font-black text-[var(--accent-primary)]">
                                                {manager.assignedLQs?.length || 0}
                                            </div>
                                            <div className="text-[10px] font-black uppercase tracking-widest text-[var(--text-tertiary)]">
                                                Lead Qualifiers
                                            </div>
                                        </div>
                                    </div>

                                    {manager.assignedLQs?.length > 0 && (
                                        <div className="grid sm:grid-cols-2 gap-4 pt-4 border-t border-[var(--border-primary)]">
                                            {manager.assignedLQs.map((lq) => (
                                                <div
                                                    key={lq._id}
                                                    className="flex justify-between items-center p-4 bg-[var(--bg-tertiary)]/40 rounded-xl border border-[var(--border-primary)] hover:border-[var(--accent-primary)]/20 transition"
                                                >
                                                    <div>
                                                        <div className="text-[12px] font-black text-[var(--text-primary)]">{lq.name}</div>
                                                        <div className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase opacity-70">
                                                            {lq.email}
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => handleUnassign(lq._id)}
                                                        disabled={actionLoading}
                                                        className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-300 rounded-lg text-[10px] font-black uppercase tracking-widest transition disabled:opacity-50"
                                                    >
                                                        Unassign
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}

            {/* Welcome / No Tab Selected */}
            {!activeTab && !loading && (
                <div className="bg-[var(--bg-secondary)] rounded-[32px] shadow-2xl border border-[var(--border-primary)] p-10 md:p-14 max-w-[1200px] mx-auto relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(0,190,155,0.12),_transparent_55%)]" />
                    <div className="relative z-10 grid lg:grid-cols-[1.2fr_1fr] gap-8 items-center">
                        <div className="space-y-5">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--bg-tertiary)]/60 border border-[var(--border-primary)] text-[9px] font-black uppercase tracking-widest text-[var(--text-tertiary)]">
                                Super Admin Control Center
                            </div>
                            <h2 className="text-3xl font-black text-[var(--text-primary)]">
                                Assign & Manage Lead Qualifiers
                            </h2>
                            <p className="text-[12px] font-bold uppercase tracking-widest text-[var(--text-secondary)] opacity-70 max-w-xl">
                                Assign LQs to managers • View all assigned LQs • Unassign LQs when needed • All data loads only when you choose an action
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <button
                                    onClick={() => handleTabChange('assignment')}
                                    className="px-8 py-4 bg-[var(--accent-primary)] text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] shadow-lg shadow-[var(--accent-primary)]/20 hover:brightness-110 transition"
                                >
                                    Open Assignments
                                </button>
                                <button
                                    onClick={() => handleTabChange('hierarchy')}
                                    className="px-8 py-4 bg-[var(--bg-tertiary)]/70 text-[var(--text-primary)] rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] border border-[var(--border-primary)] hover:border-[var(--accent-primary)]/40 transition"
                                >
                                    View Assigned LQs
                                </button>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="p-4 rounded-[24px] bg-[var(--bg-tertiary)]/50 border border-[var(--border-primary)]">
                                <div className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--text-tertiary)]">
                                    Assignment
                                </div>
                                <div className="text-lg font-black text-[var(--text-primary)] mt-2">Assign LQs to Managers</div>
                                <div className="mt-3 space-y-2">
                                    <div className="text-[9px] font-bold uppercase tracking-widest text-[var(--text-secondary)]">
                                        Select manager & multiple LQs
                                    </div>
                                    <div className="text-[9px] font-bold uppercase tracking-widest text-[var(--text-secondary)]">
                                        Confirm assignment
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 rounded-[24px] bg-[var(--bg-tertiary)]/50 border border-[var(--border-primary)]">
                                <div className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--text-tertiary)]">
                                    View & Unassign
                                </div>
                                <div className="text-lg font-black text-[var(--text-primary)] mt-2">See Assigned LQs</div>
                                <div className="mt-3 space-y-2">
                                    <div className="text-[9px] font-bold uppercase tracking-widest text-[var(--text-secondary)]">
                                        View all current assignments
                                    </div>
                                    <div className="text-[9px] font-bold uppercase tracking-widest text-[var(--text-secondary)]">
                                        Unassign LQs from managers
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style
                dangerouslySetInnerHTML={{
                    __html: `
                    .custom-scrollbar::-webkit-scrollbar {
                        width: 5px;
                        height: 5px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-track {
                        background: rgba(255, 255, 255, 0.03);
                        border-radius: 10px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-thumb {
                        background: rgba(0, 190, 155, 0.35);
                        border-radius: 10px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                        background: var(--accent-primary);
                    }
                `,
                }}
            />
        </div>
    );
}