import React, { useState, useEffect } from 'react';

export default function AssignManagerModal({
    isOpen,
    onClose,
    selectedLead,
    onAssign
}) {
    const [selectedEmails, setSelectedEmails] = useState([]);
    const [selectedPhones, setSelectedPhones] = useState([]);

    useEffect(() => {
        if (selectedLead) {
            // By default, select the first email and first phone if they exist
            const emails = selectedLead.emails || [];
            const phones = selectedLead.phones || [];

            setSelectedEmails(emails.length > 0 ? [emails[0].normalized] : []);
            setSelectedPhones(phones.length > 0 ? [phones[0]] : []);
        }
    }, [selectedLead, isOpen]);

    const toggleEmail = (emailNorm) => {
        setSelectedEmails(prev =>
            prev.includes(emailNorm)
                ? prev.filter(e => e !== emailNorm)
                : [...prev, emailNorm]
        );
    };

    const togglePhone = (phone) => {
        setSelectedPhones(prev =>
            prev.includes(phone)
                ? prev.filter(p => p !== phone)
                : [...prev, phone]
        );
    };

    const handleAssign = () => {
        if (!selectedLead) return;
        if (selectedEmails.length === 0 && selectedPhones.length === 0) {
            alert("Please select at least one contact method.");
            return;
        }
        onAssign({
            leadId: selectedLead._id,
            selectedEmails,
            selectedPhones
        });
    };

    if (!isOpen) return null;

    const emails = selectedLead?.emails || [];
    const phones = selectedLead?.phones || [];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-xl bg-black/60 animate-fadeIn">
            <div className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-[40px] w-full max-w-lg overflow-hidden shadow-[0_32px_128px_rgba(0,0,0,0.6)]">
                <div className="p-8 border-b border-[var(--border-primary)] flex justify-between items-center bg-gradient-to-r from-transparent to-[var(--accent-primary)]/5">
                    <div>
                        <h3 className="text-2xl font-black text-[var(--text-primary)]">Handover Lead</h3>
                        <p className="text-[var(--text-tertiary)] text-[10px] uppercase font-black tracking-widest mt-1 opacity-60">Transfer lead to manager pipeline</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-12 h-12 rounded-2xl bg-[var(--bg-tertiary)]/50 hover:bg-[var(--accent-error)] hover:text-white flex items-center justify-center transition-all active:scale-95 group"
                    >
                        <svg className="h-6 w-6 group-hover:rotate-90 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                <div className="p-8 space-y-8">
                    {/* Emails Section */}
                    <div className="space-y-4">
                        <label className="block text-[10px] font-black text-[var(--text-tertiary)] uppercase tracking-[0.2em] px-1">
                            Verified Emails
                        </label>
                        {emails.length > 0 ? (
                            <div className="grid gap-2">
                                {emails.map((em, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => toggleEmail(em.normalized)}
                                        className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${selectedEmails.includes(em.normalized)
                                                ? 'bg-[var(--accent-primary)]/10 border-[var(--accent-primary)] text-[var(--accent-primary)]'
                                                : 'bg-[var(--bg-tertiary)]/30 border-[var(--border-primary)] text-[var(--text-secondary)] hover:border-[var(--accent-primary)]/40'
                                            }`}
                                    >
                                        <span className="text-sm font-bold">{em.value}</span>
                                        <div className={`w-6 h-6 rounded-lg flex items-center justify-center border-2 transition-all ${selectedEmails.includes(em.normalized)
                                                ? 'bg-[var(--accent-primary)] border-[var(--accent-primary)]'
                                                : 'border-[var(--border-primary)]'
                                            }`}>
                                            {selectedEmails.includes(em.normalized) && (
                                                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                </svg>
                                            )}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="p-4 rounded-2xl bg-[var(--bg-tertiary)]/20 border border-dashed border-[var(--border-primary)] text-center">
                                <span className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-widest">No Emails Available</span>
                            </div>
                        )}
                    </div>

                    {/* Phones Section */}
                    <div className="space-y-4">
                        <label className="block text-[10px] font-black text-[var(--text-tertiary)] uppercase tracking-[0.2em] px-1">
                            Verified GB Numbers
                        </label>
                        {phones.length > 0 ? (
                            <div className="grid gap-2">
                                {phones.map((ph, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => togglePhone(ph)}
                                        className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${selectedPhones.includes(ph)
                                                ? 'bg-[var(--accent-primary)]/10 border-[var(--accent-primary)] text-[var(--accent-primary)]'
                                                : 'bg-[var(--bg-tertiary)]/30 border-[var(--border-primary)] text-[var(--text-secondary)] hover:border-[var(--accent-primary)]/40'
                                            }`}
                                    >
                                        <span className="text-sm font-bold">{ph}</span>
                                        <div className={`w-6 h-6 rounded-lg flex items-center justify-center border-2 transition-all ${selectedPhones.includes(ph)
                                                ? 'bg-[var(--accent-primary)] border-[var(--accent-primary)]'
                                                : 'border-[var(--border-primary)]'
                                            }`}>
                                            {selectedPhones.includes(ph) && (
                                                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                </svg>
                                            )}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="p-4 rounded-2xl bg-[var(--bg-tertiary)]/20 border border-dashed border-[var(--border-primary)] text-center">
                                <span className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-widest">No Numbers Available</span>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={handleAssign}
                        disabled={selectedEmails.length === 0 && selectedPhones.length === 0}
                        className="w-full h-16 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-primary)]/80 hover:scale-[1.02] disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed text-white font-black text-sm uppercase tracking-[0.2em] rounded-2xl transition-all shadow-2xl shadow-[var(--accent-primary)]/20 active:scale-95"
                    >
                        Transfer to Manager
                    </button>
                </div>
            </div>
        </div>
    );
}
