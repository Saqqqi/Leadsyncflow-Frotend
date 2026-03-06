import React from 'react';
import LeadRow from './LeadRow';
import EmptyState from './EmptyState';
import Pagination from './Pagination';

const PendingLeadsTable = ({
    leads,
    onReject,
    onUpsell,
    copiedId,
    onCopy,
    currentPage,
    totalPages,
    total,
    itemsPerPage,
    onPageChange
}) => {
    if (leads.length === 0) {
        return <EmptyState type="pending" />;
    }

    return (
        <div className="bg-[var(--bg-secondary)] border border-white/5 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full min-w-[900px] table-fixed">
                    <thead>
                        <tr className="bg-[var(--bg-tertiary)]/30 border-b border-white/5">
                            <th className="w-[20%] px-4 py-3 text-left">
                                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Lead</span>
                            </th>
                            <th className="w-[25%] px-4 py-3 text-left">
                                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Contact</span>
                            </th>
                            <th className="w-[20%] px-4 py-3 text-left">
                                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Details</span>
                            </th>
                            <th className="w-[15%] px-4 py-3 text-center">
                                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</span>
                            </th>
                            <th className="w-[20%] px-4 py-3 text-center">
                                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Actions</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {leads.map((lead) => (
                            <LeadRow
                                key={lead._id}
                                lead={lead}
                                onReject={onReject}
                                onUpsell={onUpsell}
                                copiedId={copiedId}
                                onCopy={onCopy}
                            />
                        ))}
                    </tbody>
                </table>
            </div>

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                total={total}
                itemsPerPage={itemsPerPage}
                onPageChange={onPageChange}
            />
        </div>
    );
};

export default PendingLeadsTable;