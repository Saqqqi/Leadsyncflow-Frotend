import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { managerAPI } from '../../../api/manager.api';
import SharedLoader from '../../../components/SharedLoader';

// Import components
import SearchHeader from '../components/SearchHeader';
import AdminApprovedBanner from '../components/AdminApprovedBanner';
import StatsCards from '../components/StatsCards';
import TabsNavigation from '../components/TabsNavigation';
import PendingLeadsTable from '../components/PendingLeadsTable';
import RejectedLeadsTable from '../components/RejectedLeadsTable';
import RejectModal from '../components/RejectModal';
import UpsellModal from '../components/UpsellModal';

const ITEMS_PER_PAGE = 20;

export default function ManagerNewLeads() {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);

    // Rejected leads pagination
    const [rejectedTotal, setRejectedTotal] = useState(0);
    const [rejectedPage, setRejectedPage] = useState(1);

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedLead, setSelectedLead] = useState(null);
    const [copiedId, setCopiedId] = useState(null);
    const [activeTab, setActiveTab] = useState('pending');

    // Modal states
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [showUpsellModal, setShowUpsellModal] = useState(false);

    // Form data states
    const [rejectData, setRejectData] = useState({ reason: '', comment: '' });
    const [upsellData, setUpsellData] = useState({
        type: 'paid',
        price: '',
        comment: ''
    });


    const [rejectedLeads, setRejectedLeads] = useState([]);
    const hasFetched = useRef(false);

    const fetchLeads = useCallback(async () => {
        try {
            setLoading(true);
            const skip = (currentPage - 1) * ITEMS_PER_PAGE;
            const rejectedSkip = (rejectedPage - 1) * ITEMS_PER_PAGE;

            const [pendingRes, rejectedRes] = await Promise.all([
                managerAPI.getMyLeads({ limit: ITEMS_PER_PAGE, skip }),
                managerAPI.getApprovedRejections({ limit: ITEMS_PER_PAGE, skip: rejectedSkip })
            ]);

            if (pendingRes.success) {
                setLeads(pendingRes.leads || []);
                setTotal(pendingRes.totalLeads || 0);
            }
            if (rejectedRes.success) {
                setRejectedLeads(rejectedRes.leads || []);
                setRejectedTotal(rejectedRes.totalLeads || rejectedRes.total || 0);
            }
        } catch (err) {
            console.error("Failed to fetch manager leads", err);
        } finally {
            setLoading(false);
        }
    }, [currentPage, rejectedPage]);

    useEffect(() => {
        // Prevent double fetching in StrictMode (development)
        if (!hasFetched.current) {
            fetchLeads();
            hasFetched.current = true;
        }
    }, [fetchLeads]);

    // Cleanup ref on page change if needed, but here we want to re-fetch when page changes
    // So we reset the ref when currentPage or rejectedPage changes
    useEffect(() => {
        hasFetched.current = false;
    }, [currentPage, rejectedPage]);

    const handleCopy = (text, id) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const pendingLeads = useMemo(() => {
        // Standard leads: NOT returned by superadmin AND NOT pending rejection request AND NOT PAID
        const baseLeads = leads.filter(l =>
            l.rejectionRequested !== true &&
            !l.superAdminReturnPriorityUntil &&
            l.status !== 'PAID'
        );
        if (!searchTerm) return baseLeads;
        return baseLeads.filter(l =>
            (l.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (l.emails?.some(e => (e.value || '').toLowerCase().includes(searchTerm.toLowerCase()))) ||
            (l.phones?.some(p => (p || '').toLowerCase().includes(searchTerm.toLowerCase())))
        );
    }, [leads, searchTerm]);

    const requestedLeads = useMemo(() => {
        // Pending rejection requests
        return leads.filter(l => l.rejectionRequested === true);
    }, [leads]);

    const totalPages = Math.ceil(total / ITEMS_PER_PAGE);
    const rejectedTotalPages = Math.ceil(rejectedTotal / ITEMS_PER_PAGE);

    const handleRejectClick = (lead) => {
        setSelectedLead(lead);
        setShowRejectModal(true);
    };

    const handleUpsellClick = (lead) => {
        setSelectedLead(lead);
        setShowUpsellModal(true);
    };

    const handleRejectConfirm = async () => {
        if (!selectedLead) return;
        try {
            // Using comment as the primary input for rejection
            const comment = rejectData.comment || rejectData.reason;
            if (!comment.trim()) {
                alert("Please provide a reason or comment for rejection");
                return;
            }

            await managerAPI.requestRejection(selectedLead._id, comment);

            setShowRejectModal(false);
            setRejectData({ reason: '', comment: '' });
            fetchLeads(); // Refresh leads
        } catch (err) {
            console.error("Failed to request rejection", err);
            alert("Failed to send rejection request: " + (err.response?.data?.message || err.message));
        }
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
            fetchLeads(); // Refresh leads
        } catch (err) {
            console.error("Failed to record payment", err);
            alert("Failed to record payment: " + (err.response?.data?.message || err.message));
        }
    };

    if (loading && leads.length === 0) return <SharedLoader />;

    return (
        <div className="min-h-screen bg-[var(--bg-primary)] p-4 md:p-6 lg:p-8 font-sans">
            <div className="space-y-6">
                <SearchHeader
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    onRefresh={fetchLeads}
                    loading={loading}
                />

                <AdminApprovedBanner leads={leads} />

                <StatsCards
                    total={total}
                    pendingCount={pendingLeads.length}
                    rejectedCount={requestedLeads.length + rejectedLeads.length}
                />

                <TabsNavigation
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                    rejectedCount={requestedLeads.length + rejectedLeads.length}
                />

                {activeTab === 'pending' ? (
                    <PendingLeadsTable
                        leads={pendingLeads}
                        onReject={handleRejectClick}
                        onUpsell={handleUpsellClick}
                        copiedId={copiedId}
                        onCopy={handleCopy}
                        currentPage={currentPage}
                        totalPages={totalPages}
                        total={total}
                        itemsPerPage={ITEMS_PER_PAGE}
                        onPageChange={setCurrentPage}
                    />
                ) : (
                    <RejectedLeadsTable
                        rejectedLeads={[...requestedLeads, ...rejectedLeads]}
                        currentPage={rejectedPage}
                        totalPages={rejectedTotalPages}
                        total={rejectedTotal + requestedLeads.length}
                        itemsPerPage={ITEMS_PER_PAGE}
                        onPageChange={setRejectedPage}
                    />
                )}
            </div>

            <RejectModal
                isOpen={showRejectModal}
                lead={selectedLead}
                onClose={() => {
                    setShowRejectModal(false);
                    setRejectData({ reason: '', comment: '' });
                }}
                onConfirm={handleRejectConfirm}
                rejectData={rejectData}
                setRejectData={setRejectData}
            />

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
        </div>
    );
}