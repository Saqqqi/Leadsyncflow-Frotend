import React from 'react';

const RejectModal = ({ isOpen, lead, onClose, onConfirm, rejectData, setRejectData }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="relative w-full max-w-md">
                <div className="bg-[var(--bg-secondary)] border border-white/10 rounded-xl shadow-2xl overflow-hidden">
                    <div className="p-4 border-b border-white/5">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center">
                                <svg className="w-4 h-4 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-white">Reject Lead</h3>
                                <p className="text-xs text-slate-400">{lead?.name}</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 space-y-4">
                        <div>
                            <label className="text-xs font-medium text-slate-400 block mb-1.5">Reason for Rejection</label>
                            <textarea
                                value={rejectData.comment}
                                onChange={(e) => setRejectData({ ...rejectData, comment: e.target.value })}
                                placeholder="Add your reason for rejection here..."
                                className="w-full bg-[var(--bg-tertiary)]/30 border border-white/10 rounded-lg p-3 h-32 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-rose-500/50 transition-all resize-none"
                            />
                        </div>
                    </div>

                    <div className="p-4 pt-3 border-t border-white/5 flex gap-2">
                        <button
                            onClick={onConfirm}
                            className="flex-1 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-medium rounded-lg transition-all"
                        >
                            Confirm Reject
                        </button>
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-[var(--bg-tertiary)]/30 hover:bg-[var(--bg-tertiary)]/50 text-slate-400 text-xs font-medium rounded-lg"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RejectModal;