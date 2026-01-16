import React, { useState, useEffect } from 'react';

export default function AssignManagerModal({
    isOpen,
    onClose,
    managers,
    selectedLead,
    onAssign
}) {
    const [selectedManagerId, setSelectedManagerId] = useState('');
    const [assignComment, setAssignComment] = useState('');
    const [responseType, setResponseType] = useState('EMAIL');
    const [responseValue, setResponseValue] = useState('');

    useEffect(() => {
        if (selectedLead) {
            setSelectedManagerId('');
            setAssignComment('');
            const emails = selectedLead.emails || [];
            const phones = selectedLead.phones || [];

            if (emails.length > 0) {
                setResponseType('EMAIL');
                setResponseValue(String(emails[0].value || ''));
            } else if (phones.length > 0) {
                setResponseType('PHONE');
                setResponseValue(String(phones[0] || ''));
            } else {
                setResponseType('EMAIL');
                setResponseValue('');
            }
        }
    }, [selectedLead]);

    const handleAssign = () => {
        if (!selectedManagerId || !selectedLead || !responseType || !responseValue) return;
        onAssign({
            leadId: selectedLead._id,
            managerId: selectedManagerId,
            assignComment,
            responseType,
            responseValue
        });
    };

    if (!isOpen) return null;

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
                <div className="p-8 space-y-6">
                    <div className="space-y-2">
                        <label className="block text-[10px] font-black text-[var(--text-tertiary)] uppercase tracking-[0.2em] px-1">Target Manager</label>
                        <div className="relative group">
                            <select
                                value={selectedManagerId}
                                onChange={(e) => setSelectedManagerId(e.target.value)}
                                className="w-full appearance-none bg-[var(--bg-tertiary)]/30 border border-[var(--border-primary)] text-[var(--text-primary)] rounded-2xl px-6 py-4.5 focus:outline-none focus:border-[var(--accent-primary)] font-black text-sm transition-all shadow-inner group-hover:border-[var(--accent-primary)]/40"
                            >
                                <option value="">Select a manager...</option>
                                {managers.map(m => (
                                    <option key={m._id} value={m._id}>{m.name} ({m.email})</option>
                                ))}
                            </select>
                            <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--accent-primary)]">
                                <svg className="w-6 h-6 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-[10px] font-black text-[var(--text-tertiary)] uppercase tracking-[0.2em] px-1">Platform</label>
                        <div className="relative group">
                            <select
                                value={responseType}
                                onChange={(e) => {
                                    const nextType = e.target.value;
                                    const emails = (selectedLead && selectedLead.emails) ? selectedLead.emails : [];
                                    const phones = (selectedLead && selectedLead.phones) ? selectedLead.phones : [];

                                    setResponseType(nextType);

                                    if (nextType === 'EMAIL') {
                                        setResponseValue(emails.length > 0 ? String(emails[0].value || '') : '');
                                    } else {
                                        setResponseValue(phones.length > 0 ? String(phones[0] || '') : '');
                                    }
                                }}
                                className="w-full appearance-none bg-[var(--bg-tertiary)]/30 border border-[var(--border-primary)] text-[var(--text-primary)] rounded-2xl px-6 py-4.5 focus:outline-none focus:border-[var(--accent-primary)] font-black text-sm transition-all shadow-inner group-hover:border-[var(--accent-primary)]/40"
                            >
                                <option value="EMAIL">Email</option>
                                <option value="PHONE">GB</option>
                            </select>
                            <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--accent-primary)]">
                                <svg className="w-6 h-6 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-[10px] font-black text-[var(--text-tertiary)] uppercase tracking-[0.2em] px-1">
                            {responseType === 'EMAIL' ? 'Select Email' : 'Select GB Number'}
                        </label>
                        <div className="relative group">
                            <select
                                value={responseValue}
                                onChange={(e) => setResponseValue(e.target.value)}
                                disabled={
                                    !selectedLead ||
                                    (responseType === 'EMAIL'
                                        ? !((selectedLead.emails || []).length)
                                        : !((selectedLead.phones || []).length))
                                }
                                className="w-full appearance-none bg-[var(--bg-tertiary)]/30 border border-[var(--border-primary)] text-[var(--text-primary)] rounded-2xl px-6 py-4.5 focus:outline-none focus:border-[var(--accent-primary)] font-black text-sm transition-all shadow-inner group-hover:border-[var(--accent-primary)]/40 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {responseType === 'EMAIL' ? (
                                    (selectedLead?.emails || []).length > 0 ? (
                                        (selectedLead.emails || []).map((em, idx) => (
                                            <option key={idx} value={String(em.value || '')}>{String(em.value || '')}</option>
                                        ))
                                    ) : (
                                        <option value="">No emails available</option>
                                    )
                                ) : (
                                    (selectedLead?.phones || []).length > 0 ? (
                                        (selectedLead.phones || []).map((ph, idx) => (
                                            <option key={idx} value={String(ph || '')}>{String(ph || '')}</option>
                                        ))
                                    ) : (
                                        <option value="">No numbers available</option>
                                    )
                                )}
                            </select>
                            <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--accent-primary)]">
                                <svg className="w-6 h-6 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-[10px] font-black text-[var(--text-tertiary)] uppercase tracking-[0.2em] px-1">Handover Instructions</label>
                        <textarea
                            value={assignComment}
                            onChange={(e) => setAssignComment(e.target.value)}
                            placeholder="Add context for the manager..."
                            className="w-full bg-[var(--bg-tertiary)]/30 border border-[var(--border-primary)] text-[var(--text-primary)] rounded-3xl px-6 py-5 h-36 focus:outline-none focus:border-[var(--accent-primary)] font-medium transition-all shadow-inner resize-none group-hover:border-[var(--accent-primary)]/40"
                        />
                    </div>
                    <button
                        onClick={handleAssign}
                        disabled={!selectedManagerId || !responseValue}
                        className="w-full h-16 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-primary)]/80 hover:scale-[1.02] disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed text-white font-black text-sm uppercase tracking-[0.2em] rounded-2xl transition-all shadow-2xl shadow-[var(--accent-primary)]/20 active:scale-95"
                    >
                        Transfer Ownership
                    </button>
                </div>
            </div>
        </div>
    );
}
