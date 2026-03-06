import React, { useState, useEffect, useRef } from 'react';
import { managerAPI } from '../../../api/manager.api';
import SearchHeader from '../components/SearchHeader';
import UpsellModal from '../components/UpsellModal';
import Pagination from '../components/Pagination';
import SharedLoader from '../../../components/SharedLoader';

const ITEMS_PER_PAGE = 20;

export default function ManagerHistory() {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedRows, setExpandedRows] = useState(new Set());
    const [expandingId, setExpandingId] = useState(null);
    const hasFetched = useRef(false);

    // Modal states for adding more
    const [selectedLead, setSelectedLead] = useState(null);
    const [showUpsellModal, setShowUpsellModal] = useState(false);
    const [upsellData, setUpsellData] = useState({
        type: 'paid',
        price: '',
        comment: ''
    });

    useEffect(() => {
        if (!hasFetched.current) {
            fetchLeads();
            hasFetched.current = true;
        }
    }, [currentPage]);

    // Reset fetch guard on page change
    useEffect(() => {
        hasFetched.current = false;
    }, [currentPage]);

    const fetchLeads = async () => {
        try {
            setLoading(true);
            const skip = (currentPage - 1) * ITEMS_PER_PAGE;
            // Fetching with status 'paid' to ensure we get leads that belong in history
            const response = await managerAPI.getMyLeads({
                limit: ITEMS_PER_PAGE,
                skip,
                status: 'paid'
            });

            if (response.success) {
                // Only show leads that have at least one upsell entry
                const leadsWithUpsells = (response.leads || []).filter(l =>
                    l.upsales && l.upsales.length > 0
                );
                setLeads(leadsWithUpsells);
                setTotal(response.totalLeads || response.total || 0);
            }
        } catch (err) {
            console.error("Failed to fetch manager history", err);
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            // You could add a toast notification here
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const handleAddMoreClick = (lead, e) => {
        e.stopPropagation();
        setSelectedLead(lead);
        setUpsellData({ type: 'paid', price: '', comment: '' });
        setShowUpsellModal(true);
    };

    const handleUpsellConfirm = async () => {
        if (!selectedLead) return;
        try {
            const amount = parseFloat(upsellData.price);
            if (isNaN(amount) || amount <= 0) {
                alert("Please enter a valid amount");
                return;
            }
            if (!upsellData.comment.trim()) {
                alert("Please add a comment");
                return;
            }

            await managerAPI.markAsPaid(selectedLead._id, amount, upsellData.comment);
            setShowUpsellModal(false);
            setUpsellData({ type: 'paid', price: '', comment: '' });
            await fetchLeads();
        } catch (err) {
            console.error("Failed to record payment", err);
            alert("Failed to record payment: " + (err.response?.data?.message || err.message));
        }
    };

    const handleRowClick = (leadId) => {
        setExpandingId(leadId);
        setTimeout(() => {
            setExpandedRows(prev => {
                const next = new Set(prev);
                if (next.has(leadId)) {
                    next.delete(leadId);
                } else {
                    next.add(leadId);
                }
                return next;
            });
            setExpandingId(null);
        }, 150);
    };

    const filteredLeads = leads.filter(l => {
        const searchLower = searchTerm.toLowerCase();
        return (l.name || '').toLowerCase().includes(searchLower) ||
            (l.emails?.some(e => (e.value || '').toLowerCase().includes(searchLower))) ||
            (l.phones?.some(p => (p || '').toLowerCase().includes(searchLower))) ||
            (l.upsales?.some(u => (u.comment || '').toLowerCase().includes(searchLower)));
    });

    const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

    const totalRevenue = (leads || []).reduce((sum, lead) =>
        sum + (lead.upsales || []).reduce((s, u) => s + (u.amount || 0), 0), 0
    );

    if (loading) return <SharedLoader />;

    return (
        <div className="space-y-6 max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8 py-6 min-h-screen bg-[var(--bg-primary)] font-sans">
            <SearchHeader
                title="Payment Records"
                subtitle="Track and manage all upsold leads"
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                onRefresh={fetchLeads}
                loading={loading}
                icon={(
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                )}
            />

            {/* Total Revenue Overview Card */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-[24px] p-6 shadow-xl relative overflow-hidden group hover:border-emerald-500/40 transition-all">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-16 -mt-16" />
                    <div className="relative z-10 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-tertiary)] opacity-60">Total Revenue</p>
                            <h2 className="text-2xl font-black text-[var(--text-primary)] tracking-tight">${totalRevenue.toFixed(2)}</h2>
                        </div>
                    </div>
                </div>
                <div className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-[24px] p-6 shadow-xl relative overflow-hidden group hover:border-emerald-500/40 transition-all">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-16 -mt-16 opacity-50" />
                    <div className="relative z-10 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-tertiary)] opacity-60">Active Upsells</p>
                            <h2 className="text-2xl font-black text-[var(--text-primary)] tracking-tight">
                                {leads.reduce((sum, lead) => sum + (lead.upsales?.length || 0), 0)}
                            </h2>
                        </div>
                    </div>
                </div>
            </div>

            {/* Table Section */}
            <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-primary)] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left table-fixed min-w-[900px]">
                        <thead>
                            <tr className="bg-[var(--bg-tertiary)]/30 border-b border-[var(--border-primary)]">
                                <th className="px-6 py-3 text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Lead</th>
                                <th className="px-6 py-3 text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Total</th>
                                <th className="px-6 py-3 text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Entries</th>
                                <th className="px-6 py-3 text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Assigned</th>
                                <th className="px-6 py-3 text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border-primary)]">
                            {filteredLeads.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-16 text-center">
                                        <div className="flex flex-col items-center">
                                            <div className="w-16 h-16 bg-[var(--bg-tertiary)] rounded-xl flex items-center justify-center mb-4">
                                                <svg className="w-8 h-8 text-[var(--text-tertiary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                            <h3 className="text-base font-semibold text-[var(--text-primary)] mb-1">No paid leads found</h3>
                                            <p className="text-sm text-[var(--text-tertiary)]">Leads marked as paid will appear here</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredLeads.map(lead => {
                                    const totalUpsellPrice = (lead.upsales || []).reduce((sum, item) => sum + (item.amount || 0), 0);
                                    const isExpanded = expandedRows.has(lead._id);
                                    const isExpanding = expandingId === lead._id;

                                    return (
                                        <React.Fragment key={lead._id}>
                                            <tr
                                                className={`group cursor-pointer transition-all duration-300 hover:bg-[var(--bg-tertiary)]/50 ${isExpanded ? 'bg-[var(--bg-tertiary)]/30' : ''}`}
                                                onClick={() => handleRowClick(lead._id)}
                                            >
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white font-semibold text-sm shadow-sm">
                                                            {lead.name?.[0]?.toUpperCase() || '?'}
                                                        </div>
                                                        <div>
                                                            <div className="font-medium text-[var(--text-primary)]">{lead.name}</div>
                                                            <div className="text-xs text-[var(--text-tertiary)] mt-0.5">
                                                                {lead.emails?.[0]?.value || 'No email'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-lg font-bold text-emerald-500">
                                                        ${totalUpsellPrice.toFixed(2)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                                                        {lead.upsales?.length || 0} {lead.upsales?.length === 1 ? 'entry' : 'entries'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm text-[var(--text-primary)] font-medium">
                                                        {new Date(lead.assignedAt || lead.createdAt).toLocaleDateString('en-US', {
                                                            month: 'short',
                                                            day: 'numeric',
                                                            year: 'numeric'
                                                        })}
                                                    </div>
                                                    <div className="text-xs text-[var(--text-tertiary)] mt-0.5">
                                                        {new Date(lead.assignedAt || lead.createdAt).toLocaleTimeString('en-US', {
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            onClick={(e) => handleAddMoreClick(lead, e)}
                                                            className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500 hover:text-white text-xs font-medium transition-all flex items-center gap-1.5 border border-emerald-500/20"
                                                        >
                                                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                                                            </svg>
                                                            Add
                                                        </button>
                                                        <div className={`transform transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                                                            <svg className="w-5 h-5 text-[var(--text-tertiary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                            </svg>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>

                                            {/* Expandable Details Row */}
                                            {isExpanded && (
                                                <tr className={`transition-opacity duration-300 ${isExpanding ? 'opacity-50' : 'opacity-100'} bg-[var(--bg-tertiary)]/10`}>
                                                    <td colSpan="5" className="px-6 py-6 border-t border-[var(--border-primary)]">
                                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                                            {/* Contact Info */}
                                                            <div className="space-y-4">
                                                                <h4 className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider flex items-center gap-2">
                                                                    <span className="w-1 h-4 bg-[var(--text-secondary)] rounded-full" />
                                                                    Contact Information
                                                                </h4>
                                                                <div className="space-y-2">
                                                                    {lead.emails?.map((email, idx) => (
                                                                        <div key={`email-${idx}`}
                                                                            className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-primary)] hover:border-emerald-500/30 transition-all group/item">
                                                                            <span className="text-sm text-[var(--text-primary)] font-medium">{email.value}</span>
                                                                            <button
                                                                                onClick={() => handleCopy(email.value)}
                                                                                className="p-1.5 rounded-lg opacity-0 group-hover/item:opacity-100 hover:bg-emerald-500/10 text-emerald-600 transition-all"
                                                                            >
                                                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                                                                                </svg>
                                                                            </button>
                                                                        </div>
                                                                    ))}
                                                                    {lead.phones?.map((phone, idx) => (
                                                                        <div key={`phone-${idx}`}
                                                                            className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-primary)] hover:border-emerald-500/30 transition-all group/item">
                                                                            <span className="text-sm text-[var(--text-primary)] font-medium">{phone}</span>
                                                                            <button
                                                                                onClick={() => handleCopy(phone)}
                                                                                className="p-1.5 rounded-lg opacity-0 group-hover/item:opacity-100 hover:bg-emerald-500/10 text-emerald-600 transition-all"
                                                                            >
                                                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                                                                                </svg>
                                                                            </button>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>

                                                            {/* Upsell History */}
                                                            <div className="space-y-4">
                                                                <h4 className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider flex items-center gap-2">
                                                                    <span className="w-1 h-4 bg-[var(--text-secondary)] rounded-full" />
                                                                    Payment History
                                                                </h4>
                                                                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                                                    {lead.upsales && lead.upsales.length > 0 ? (
                                                                        lead.upsales.map((upsell, idx) => (
                                                                            <div key={idx}
                                                                                className="p-4 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-primary)] space-y-2">
                                                                                <div className="flex items-center justify-between">
                                                                                    <span className="text-lg font-bold text-emerald-500 bg-emerald-500/10 px-2 rounded-md">
                                                                                        ${upsell.amount}
                                                                                    </span>
                                                                                    <span className="text-xs font-medium text-[var(--text-tertiary)]">
                                                                                        {new Date(upsell.addedAt).toLocaleDateString('en-US', {
                                                                                            month: 'short',
                                                                                            day: 'numeric',
                                                                                            hour: '2-digit',
                                                                                            minute: '2-digit'
                                                                                        })}
                                                                                    </span>
                                                                                </div>
                                                                                <p className="text-sm font-medium text-[var(--text-primary)] bg-[var(--bg-secondary)] p-3 rounded-lg border border-[var(--border-primary)]">
                                                                                    "{upsell.comment}"
                                                                                </p>
                                                                            </div>
                                                                        ))
                                                                    ) : (
                                                                        <div className="text-center py-8 text-[var(--text-tertiary)] text-sm">
                                                                            No payment history available
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                total={total}
                itemsPerPage={ITEMS_PER_PAGE}
                onPageChange={setCurrentPage}
            />

            {/* Upsell Modal */}
            <UpsellModal
                isOpen={showUpsellModal}
                lead={selectedLead}
                onClose={() => {
                    setShowUpsellModal(false);
                    setUpsellData({ type: 'paid', price: '', comment: '' });
                }}
                onConfirm={handleUpsellConfirm}
                upsellData={upsellData}
                setUpsellData={setUpsellData}
            />

            {/* Custom Scrollbar Styles */}
            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: var(--bg-tertiary);
                    border-radius: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: var(--border-secondary);
                    border-radius: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: var(--text-tertiary);
                }
            `}</style>
        </div>
    );
}