import React, { useState, useEffect, useMemo } from 'react';
import dataMinorAPI from '../../../api/data-minor';

// Cookie helper functions
const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
        try {
            return JSON.parse(decodeURIComponent(parts.pop().split(';').shift()));
        } catch (e) {
            return null;
        }
    }
    return null;
};

const setCookie = (name, value, days = 7) => {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${encodeURIComponent(JSON.stringify(value))}; expires=${expires.toUTCString()}; path=/`;
};

const deleteCookie = (name) => {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

const VerifierLeads = () => {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    const [expandedNames, setExpandedNames] = useState(new Set());
    const [filterDate, setFilterDate] = useState('');
    const [pendingEmailChanges, setPendingEmailChanges] = useState({}); // Store pending changes in state
    const [processingLeads, setProcessingLeads] = useState(new Set()); // Track which leads are being processed
    const [notification, setNotification] = useState(null); // { message, type: 'success' | 'error' | 'info' }

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 4000);
    };

    // Load pending changes from cookies on component mount
    useEffect(() => {
        const savedChanges = getCookie('verifier_email_changes');
        if (savedChanges) {
            setPendingEmailChanges(savedChanges);
        }
    }, []);

    // Save pending changes to cookies whenever they change
    useEffect(() => {
        if (Object.keys(pendingEmailChanges).length > 0) {
            setCookie('verifier_email_changes', pendingEmailChanges);
        } else {
            deleteCookie('verifier_email_changes');
        }
    }, [pendingEmailChanges]);

    const handleProcessAllLeads = async () => {
        if (!window.confirm("Are you sure you want to distribute all verified leads to Lead Qualifiers (LQ)?")) return;

        setIsProcessing(true);
        try {
            const response = await dataMinorAPI.distributeVerifierLeadsToLQ();

            if (response.success) {
                if (response.count === 0) {
                    showNotification(response.message || "No leads found to move.", "info");
                } else {
                    showNotification(response.message || "Successfully distributed leads to LQ!", "success");
                    fetchLeads();
                }
            }
        } catch (error) {
            console.error('Batch move failed:', error);
            if (error.response && error.response.status === 404) {
                showNotification("No verified leads found in the system to move.", "info");
            } else {
                showNotification('Batch process failed: ' + (error.response?.data?.message || error.message), "error");
            }
        } finally {
            setIsProcessing(false);
        }
    };

    const fetchLeads = async () => {
        try {
            setLoading(true);
            const response = await dataMinorAPI.getVerifierLeads(100, 0);
            console.log(response);
            if (response.success) {
                setLeads(response.leads);
            }
        } catch (error) {
            console.error('Error fetching leads:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeads();
    }, []);

    const toggleExpand = (id) => {
        setExpandedNames(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) newSet.delete(id);
            else newSet.add(id);
            return newSet;
        });
    };

    const getStatusBadge = (status) => {
        const s = (status || '').toUpperCase();
        if (s === 'ACTIVE') return 'border-[var(--accent-success)]/20 bg-[var(--accent-success)]/10 text-[var(--accent-success)]';
        if (s === 'BOUNCED') return 'border-[var(--accent-error)]/20 bg-[var(--accent-error)]/10 text-[var(--accent-error)]';
        if (s === 'DEAD') return 'border-gray-500/20 bg-gray-500/10 text-gray-500';
        return 'border-[var(--border-primary)] bg-[var(--bg-secondary)] text-[var(--text-secondary)]';
    };

    const getStatusIcon = (status) => {
        if (status === 'ACTIVE') return '✓';
        if (status === 'BOUNCED' || status === 'DEAD') return '✕';
        if (status === 'NO_EMAIL') return '–';
        return '…';
    };

    const filteredLeads = useMemo(() => {
        return leads
            .filter(lead => {
                // Date filtering
                if (filterDate) {
                    const d = new Date(lead.submittedDate || lead.createdAt);
                    if (!isNaN(d.getTime())) {
                        const rowDate = d.toISOString().split('T')[0];
                        if (rowDate !== filterDate) return false;
                    }
                }
                return true;
            })
            .map(lead => ({
                ...lead,
                displayEmails: lead.emails || []
            }));
    }, [leads, filterDate]);

    const handleVerifyAction = async (leadId, email, status) => {
        if (!email) return;

        // Store the change in pending changes (cookies)
        setPendingEmailChanges(prev => ({
            ...prev,
            [leadId]: {
                ...prev[leadId],
                [email]: status
            }
        }));

        // Update the UI immediately for better UX
        setLeads(prevLeads =>
            prevLeads.map(lead =>
                lead._id === leadId
                    ? {
                        ...lead,
                        emails: lead.emails?.map(e =>
                            e.normalized === email ? { ...e, status } : e
                        ) || []
                    }
                    : lead
            )
        );
    };

    // New function to handle "Done" button click - batch update all emails for a lead
    const handleDoneClick = async (leadId) => {
        const leadChanges = pendingEmailChanges[leadId];
        if (!leadChanges || Object.keys(leadChanges).length === 0) {
            showNotification('No changes to save for this lead.', 'info');
            return;
        }

        setProcessingLeads(prev => new Set([...prev, leadId]));

        try {
            // Prepare emails array in the format expected by backend
            const emailsToUpdate = Object.entries(leadChanges).map(([normalized, status]) => ({
                normalized,
                status
            }));

            console.log('🔄 Batch updating emails for lead:', leadId, emailsToUpdate);

            // Call the batch update API
            await dataMinorAPI.updateLeadAllEmails(leadId, emailsToUpdate);

            // Remove this lead's changes from pending changes
            setPendingEmailChanges(prev => {
                const newChanges = { ...prev };
                delete newChanges[leadId];
                return newChanges;
            });

            // Refresh the leads to get updated data from server
            fetchLeads();

            showNotification(`Successfully updated ${emailsToUpdate.length} email(s) for this lead.`, 'success');
        } catch (error) {
            console.error('❌ Error batch updating emails:', error);
            showNotification('Failed to update emails: ' + (error.response?.data?.message || error.message), 'error');
        } finally {
            setProcessingLeads(prev => {
                const newSet = new Set(prev);
                newSet.delete(leadId);
                return newSet;
            });
        }
    };

    const handleMoveToLq = async (leadId) => {
        setProcessingLeads(prev => new Set([...prev, leadId]));
        try {
            await dataMinorAPI.moveLeadToLeadQualifiers(leadId);
            setLeads(prev => prev.filter(l => l._id !== leadId));
        } catch (error) {
            console.error('Error moving lead:', error);
            showNotification('Failed to move lead: ' + (error.response?.data?.message || error.message), 'error');
        } finally {
            setProcessingLeads(prev => {
                const newSet = new Set(prev);
                newSet.delete(leadId);
                return newSet;
            });
        }
    };

    const handleDoneManual = async (leadId) => {
        const lead = leads.find(l => l._id === leadId);
        if (!lead) return;

        setProcessingLeads(prev => new Set([...prev, leadId]));
        try {
            const leadChanges = pendingEmailChanges[leadId] || {};
            const emailsToUpdate = (lead.emails || []).map(e => {
                const norm = e.normalized || e.value;
                // Priority: 1. Pending session change, 2. Existing verified status, 3. Default to ACTIVE
                const currentStatus = leadChanges[norm] ||
                    (e.status && e.status.toUpperCase() !== 'PENDING' ? e.status : 'ACTIVE');
                return { normalized: norm, status: currentStatus };
            });

            // 1. Update all emails for this lead (moves to 'Verifier' stage)
            await dataMinorAPI.updateLeadAllEmails(leadId, emailsToUpdate);

            // 2. Clear pending changes for this lead
            setPendingEmailChanges(prev => {
                const nc = { ...prev };
                delete nc[leadId];
                return nc;
            });

            showNotification('Lead verified successfully!', 'success');
            fetchLeads();
        } catch (error) {
            console.error('Manual Done failed:', error);
            showNotification('Failed to complete lead: ' + (error.response?.data?.message || error.message), 'error');
        } finally {
            setProcessingLeads(prev => {
                const ns = new Set(prev);
                ns.delete(leadId);
                return ns;
            });
        }
    };

    return (
        <div className="p-4 sm:p-6 md:p-8 space-y-8 min-h-screen animate-in fade-in slide-in-from-bottom-5 duration-700"
            style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>
                        Verifier Leads
                    </h1>
                    <p className="text-sm font-medium mt-1 opacity-80" style={{ color: 'var(--text-secondary)' }}>
                        Review and verify submitted leads
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                    <button
                        onClick={handleProcessAllLeads}
                        disabled={isProcessing}
                        className="group px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-500/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 flex items-center gap-3"
                    >
                        {isProcessing ? (
                            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        ) : (
                            <svg className="w-5 h-5 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        )}
                        <span>{isProcessing ? 'Processing...' : 'Process & Move All'}</span>
                    </button>

                    <input
                        type="date"
                        value={filterDate}
                        onChange={e => setFilterDate(e.target.value)}
                        className="px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]/40 font-bold"
                        style={{
                            backgroundColor: 'var(--bg-secondary)',
                            borderColor: 'var(--border-primary)',
                            color: 'var(--text-primary)'
                        }}
                    />

                    <button
                        onClick={fetchLeads}
                        disabled={loading}
                        className="px-6 py-3 rounded-xl border transition-all flex items-center gap-2 text-sm font-bold disabled:opacity-50 hover:brightness-110 active:scale-95 shadow-lg"
                        style={{
                            backgroundColor: 'var(--bg-tertiary)',
                            borderColor: 'var(--border-primary)',
                            color: 'var(--text-primary)'
                        }}
                    >
                        <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        {loading ? 'Refreshing...' : 'Refresh'}
                    </button>
                </div>
            </div>

            {/* List Content */}
            <div className="space-y-4">
                {loading && leads.length === 0 ? (
                    <div className="p-20 flex flex-col items-center justify-center text-center opacity-60">
                        <div className="w-12 h-12 mb-4 border-4 border-t-transparent rounded-full animate-spin"
                            style={{ borderColor: 'var(--border-primary)', borderTopColor: 'var(--accent-primary)' }}></div>
                        <p style={{ color: 'var(--text-secondary)' }}>Loading leads...</p>
                    </div>
                ) : filteredLeads.length === 0 ? (
                    <div className="p-20 text-center opacity-60 flex flex-col items-center justify-center rounded-3xl border border-dashed"
                        style={{ borderColor: 'var(--border-primary)' }}>
                        <svg className="w-16 h-16 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                        <p style={{ color: 'var(--text-secondary)' }}>No leads found for verification</p>
                    </div>
                ) : (
                    filteredLeads.map((lead, index) => {
                        const isExpanded = expandedNames.has(lead._id);
                        const source = lead.sources?.[0];
                        const sourceText = source?.name || 'Local Upload';
                        const pendingCount = lead.displayEmails.filter(emailObj => {
                            const email = emailObj.normalized || emailObj.value;
                            const status = pendingEmailChanges[lead._id]?.[email] || emailObj.status || 'PENDING';
                            return String(status).toUpperCase() === 'PENDING';
                        }).length;
                        const totalCount = lead.displayEmails.length;
                        const isDM = lead.stage === 'DM';
                        const isVerifier = lead.stage === 'Verifier';

                        return (
                            <div
                                key={lead._id}
                                className={`group rounded-2xl border transition-all duration-300 overflow-hidden hover:shadow-2xl ${isVerifier ? 'ring-1 ring-emerald-500/30 shadow-emerald-500/5' : ''}`}
                                style={{
                                    backgroundColor: 'var(--bg-secondary)',
                                    borderColor: isVerifier ? '#10b98144' : (isExpanded ? 'var(--accent-primary)' : 'var(--border-primary)'),
                                    boxShadow: isExpanded ? '0 10px 40px -10px rgba(0,0,0,0.5)' : 'none'
                                }}
                            >
                                {/* Card Header (Lead Summary) */}
                                <div
                                    onClick={() => toggleExpand(lead._id)}
                                    className="px-6 py-5 flex items-center justify-between cursor-pointer transition-colors"
                                    style={{
                                        backgroundColor: isExpanded ? 'rgba(0,0,0,0.2)' : 'transparent',
                                    }}
                                >
                                    <div className="flex items-center gap-5 flex-1">
                                        {/* Serial Number and Icon */}
                                        <div className="relative">
                                            <div className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-[var(--accent-primary)] text-white text-[10px] font-black flex items-center justify-center shadow-lg z-10 border-2 border-[var(--bg-secondary)]">
                                                {index + 1}
                                            </div>
                                            <div className="h-12 w-12 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg transform transition-transform group-hover:scale-105"
                                                style={{
                                                    background: `linear-gradient(135deg, var(--color-secondary), var(--color-primary))`,
                                                    border: '1px solid var(--border-primary)'
                                                }}>
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                            </div>
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-baseline gap-3">
                                                <h3 className="font-bold text-lg truncate tracking-tight text-white">
                                                    Lead #{index + 1}
                                                </h3>
                                                {isVerifier && (
                                                    <span className="text-[9px] uppercase font-black bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-md border border-emerald-500/30 flex items-center gap-1.5">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                                        Ready for LQ
                                                    </span>
                                                )}
                                                {isExpanded && !isVerifier && (
                                                    <span className="text-[10px] uppercase font-black tracking-widest px-2 py-0.5 rounded-full"
                                                        style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-tertiary)' }}>
                                                        Viewing Details
                                                    </span>
                                                )}
                                            </div>

                                            <div className="flex items-center gap-4 mt-1 text-xs font-medium">
                                                <div className="flex items-center gap-1.5" style={{ color: 'var(--text-secondary)' }}>
                                                    <svg className="w-3.5 h-3.5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                    </svg>
                                                    <span>{pendingCount} Pending / {totalCount} Total</span>
                                                </div>

                                                {sourceText && (
                                                    <div className="flex items-center gap-1.5 opacity-80" style={{ color: 'var(--text-tertiary)' }}>
                                                        <svg className="w-3.5 h-3.5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                                        </svg>
                                                        {source?.link && source.link !== 'Local Upload' ? (
                                                            <a
                                                                href={source.link}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="truncate max-w-[200px] hover:text-[var(--accent-primary)] transition-colors underline"
                                                                onClick={(e) => e.stopPropagation()}
                                                            >
                                                                {sourceText}
                                                            </a>
                                                        ) : (
                                                            <span className="truncate max-w-[200px]">{sourceText}</span>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <div className="text-right hidden sm:block">
                                            <p className="text-[10px] uppercase font-bold tracking-wider opacity-50" style={{ color: 'var(--text-tertiary)' }}>
                                                Created At
                                            </p>
                                            <p className="text-xs font-medium text-white">
                                                {lead.createdAt
                                                    ? new Date(lead.createdAt).toLocaleString('en-GB', {
                                                        day: '2-digit',
                                                        month: 'short',
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                        hour12: true
                                                    }).replace(',', '')
                                                    : lead.submittedDate || 'N/A'
                                                }
                                            </p>
                                        </div>

                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${isExpanded ? 'rotate-180 bg-[var(--bg-primary)]' : 'bg-[var(--bg-tertiary)] group-hover:bg-[var(--accent-primary)] group-hover:text-white'}`}
                                            style={{ color: isExpanded ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                {/* Expanded Details Panel */}
                                {isExpanded && (
                                    <div className="animate-in slide-in-from-top-2 duration-300">
                                        <div className="px-6 pb-6 pt-2">
                                            <div className="rounded-xl overflow-hidden border"
                                                style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-primary)' }}>

                                                {/* Inner Table Header */}
                                                <div className="grid grid-cols-12 gap-4 px-5 py-3 text-[10px] uppercase font-black tracking-widest"
                                                    style={{ backgroundColor: 'rgba(0,0,0,0.2)', color: 'var(--text-tertiary)' }}>
                                                    <div className="col-span-5">Email Address</div>
                                                    <div className="col-span-3">Status</div>
                                                    <div className="col-span-4 text-right">Verification</div>
                                                </div>

                                                {/* Inner Table Body */}
                                                <div className="divide-y" style={{ borderColor: 'var(--border-primary)' }}>
                                                    <div className="group/lead relative">
                                                        {/* Lead Emails */}
                                                        <div className="divide-y" style={{ borderColor: 'var(--border-primary)' }}>
                                                            {lead.displayEmails.map((emailObj, idx) => {
                                                                const email = emailObj.normalized || emailObj.value;
                                                                const originalStatus = emailObj.status || 'PENDING';
                                                                const pendingStatus = pendingEmailChanges[lead._id]?.[email];
                                                                const status = pendingStatus || originalStatus;
                                                                const hasPendingChange = !!pendingStatus;

                                                                return (
                                                                    <div key={`${lead._id}-${idx}`}
                                                                        className="grid grid-cols-12 gap-4 px-5 py-4 items-center transition-colors hover:bg-[var(--bg-tertiary)]/20">

                                                                        {/* Email Column */}
                                                                        <div className="col-span-5 flex items-center gap-2 group/copy">
                                                                            <span className="font-mono text-sm break-all font-medium text-white">
                                                                                {email}
                                                                            </span>
                                                                            <button
                                                                                onClick={(e) => {
                                                                                    e.stopPropagation();
                                                                                    navigator.clipboard.writeText(email);
                                                                                }}
                                                                                className="opacity-0 group-hover/copy:opacity-100 transition-opacity p-1.5 rounded-md hover:bg-white/10 text-gray-400 hover:text-white"
                                                                                title="Copy Email"
                                                                            >
                                                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                                                </svg>
                                                                            </button>
                                                                        </div>

                                                                        {/* Status Column */}
                                                                        <div className="col-span-3">
                                                                            <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-lg border text-[10px] font-bold uppercase tracking-wider ${getStatusBadge(status).split(' ').join(' ')} ${hasPendingChange ? 'ring-2 ring-yellow-400/50' : ''}`}>
                                                                                <span className="text-xs">{getStatusIcon(status)}</span>
                                                                                <span>{status}</span>
                                                                                {hasPendingChange && (
                                                                                    <span className="text-[8px] bg-yellow-400 text-black px-1 rounded">PENDING</span>
                                                                                )}
                                                                            </div>
                                                                        </div>

                                                                        {/* Action Column */}
                                                                        <div className="col-span-4 flex justify-end">
                                                                            <div className="relative w-36 group/select">
                                                                                <select
                                                                                    value={status}
                                                                                    onClick={(e) => e.stopPropagation()}
                                                                                    onChange={(e) => {
                                                                                        e.stopPropagation();
                                                                                        handleVerifyAction(lead._id, email, e.target.value);
                                                                                    }}
                                                                                    className="w-full appearance-none pl-3 pr-8 py-2 rounded-lg text-xs font-bold border outline-none cursor-pointer transition-all shadow-sm hover:shadow-md"
                                                                                    style={{
                                                                                        backgroundColor: 'var(--bg-secondary)',
                                                                                        borderColor: 'var(--border-primary)',
                                                                                        color: 'var(--text-primary)'
                                                                                    }}
                                                                                >
                                                                                    {status === 'PENDING' && <option value="PENDING">Pending Check</option>}
                                                                                    <option value="ACTIVE">Mark Active</option>
                                                                                    <option value="BOUNCED">Mark Bounced</option>
                                                                                    <option value="DEAD">Mark Dead</option>
                                                                                </select>
                                                                                <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none transition-transform group-hover/select:translate-x-0.5"
                                                                                    style={{ color: 'var(--text-secondary)' }}>
                                                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                                                                                    </svg>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>

                                                        {/* Lead Action Footer */}
                                                        <div className="px-5 py-4 bg-[var(--bg-tertiary)]/10 border-t border-[var(--border-primary)] flex items-center justify-between">
                                                            <div className="flex gap-3">
                                                                {/* Quick Action: Mark All Active (Only for DM leads) */}
                                                                {isDM && pendingCount > 0 && (
                                                                    <button
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            lead.displayEmails.forEach(emailObj => {
                                                                                const email = emailObj.normalized || emailObj.value;
                                                                                if (!emailObj.status || emailObj.status.toUpperCase() === 'PENDING') {
                                                                                    handleVerifyAction(lead._id, email, 'ACTIVE');
                                                                                }
                                                                            });
                                                                        }}
                                                                        className="px-3 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg text-xs font-bold transition-all flex items-center gap-2 border border-blue-500/20"
                                                                    >
                                                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                                        </svg>
                                                                        Mark All Active
                                                                    </button>
                                                                )}
                                                            </div>

                                                            <div className="flex gap-3">
                                                                {/* Mark as Done: Only show for DM leads when all emails are marked */}
                                                                {isDM && pendingCount === 0 && (
                                                                    <button
                                                                        onClick={() => handleDoneManual(lead._id)}
                                                                        disabled={processingLeads.has(lead._id)}
                                                                        className="px-5 py-2 bg-gradient-to-r from-[var(--accent-primary)] to-indigo-600 text-white rounded-lg text-xs font-black shadow-lg shadow-indigo-500/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                                                    >
                                                                        {processingLeads.has(lead._id) ? (
                                                                            <>
                                                                                <div className="w-3 h-3 border border-white/20 border-t-white rounded-full animate-spin" />
                                                                                Processing...
                                                                            </>
                                                                        ) : (
                                                                            <>
                                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                                                                                </svg>
                                                                                Mark as Done
                                                                            </>
                                                                        )}
                                                                    </button>
                                                                )}

                                                                {/* Indicator for already verified leads */}
                                                                {isVerifier && (
                                                                    <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                                        </svg>
                                                                        Lead Verified (Use Process Button at Top)
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>
            {/* Notification Toast */}
            {notification && (
                <div className="fixed bottom-8 right-8 z-[100] animate-in slide-in-from-right-10 duration-500">
                    <div className={`px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 border backdrop-blur-xl ${notification.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                        notification.type === 'error' ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' :
                            'bg-blue-500/10 border-blue-500/20 text-blue-400'
                        }`}>
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${notification.type === 'success' ? 'bg-emerald-500 text-white' :
                            notification.type === 'error' ? 'bg-rose-500 text-white' :
                                'bg-blue-500 text-white'
                            }`}>
                            {notification.type === 'success' && (
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                </svg>
                            )}
                            {notification.type === 'error' && (
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            )}
                            {notification.type === 'info' && (
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            )}
                        </div>
                        <div>
                            <p className="font-black text-sm tracking-tight">{notification.message}</p>
                            <p className="text-[10px] uppercase font-bold tracking-widest opacity-60">System Notification</p>
                        </div>
                        <button onClick={() => setNotification(null)} className="ml-4 opacity-50 hover:opacity-100 transition-opacity">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VerifierLeads;