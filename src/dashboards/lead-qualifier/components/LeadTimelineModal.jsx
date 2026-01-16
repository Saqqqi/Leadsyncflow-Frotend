import React, { useState } from 'react';

export default function LeadTimelineModal({
    isOpen,
    onClose,
    selectedLead,
    onAddComment
}) {
    const [commentText, setCommentText] = useState('');

    const handleAdd = async () => {
        if (!commentText.trim()) return;
        const success = await onAddComment(commentText);
        if (success) {
            setCommentText('');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-xl bg-black/60 animate-fadeIn">
            <div className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-[40px] w-full max-w-lg overflow-hidden shadow-[0_32px_128px_rgba(0,0,0,0.6)]">
                <div className="p-8 border-b border-[var(--border-primary)] flex justify-between items-center bg-[var(--bg-tertiary)]/30">
                    <div>
                        <h3 className="text-2xl font-black text-[var(--text-primary)]">Lead Timeline</h3>
                        <p className="text-[var(--text-tertiary)] text-[10px] uppercase font-black tracking-widest mt-1 opacity-60">Audit log and status notes</p>
                    </div>
                    <button onClick={onClose} className="w-12 h-12 rounded-2xl bg-[var(--bg-tertiary)]/50 hover:bg-[var(--accent-error)] hover:text-white flex items-center justify-center transition-all group">
                        <svg className="h-6 w-6 group-hover:rotate-90 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                <div className="p-8 space-y-6">
                    <div className="max-h-72 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                        {(selectedLead?.comments || []).length === 0 ? (
                            <div className="text-center py-12 opacity-30 italic text-sm font-medium">No timeline events recorded.</div>
                        ) : (
                            selectedLead.comments.map((c, i) => (
                                <div key={i} className="p-5 rounded-3xl bg-[var(--bg-tertiary)]/20 border border-[var(--border-primary)]/50 hover:border-[var(--accent-primary)]/20 transition-colors">
                                    <div className="flex justify-between items-center mb-3">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-[var(--accent-primary)]">{c.createdByRole || 'Admin'}</span>
                                        <span className="text-[10px] font-black text-[var(--text-tertiary)] opacity-60">{c.createdDate || c.createdAt?.split('T')[0]}</span>
                                    </div>
                                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed font-medium">{c.text}</p>
                                </div>
                            ))
                        )}
                    </div>
                    <div className="space-y-3">
                        <textarea
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            placeholder="Write a new observation..."
                            className="w-full bg-[var(--bg-tertiary)]/30 border border-[var(--border-primary)] text-[var(--text-primary)] rounded-3xl px-6 py-5 h-32 focus:outline-none focus:border-[var(--accent-primary)] font-medium transition-all shadow-inner resize-none"
                        />
                        <button
                            onClick={handleAdd}
                            disabled={!commentText.trim()}
                            className="w-full h-14 bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/30 hover:bg-[var(--accent-primary)] hover:text-white disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed text-[var(--accent-primary)] font-black text-xs uppercase tracking-[0.2em] rounded-2xl transition-all shadow-lg active:scale-95"
                        >
                            Append Entry
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
