import React from 'react';

const UpsellModal = ({ isOpen, lead, onClose, onConfirm, upsellData, setUpsellData }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="relative w-full max-w-md">
                <div className="bg-[var(--bg-secondary)] border border-white/10 rounded-xl shadow-2xl overflow-hidden">
                    <div className="p-4 border-b border-white/5">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                                <svg className="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-white">Upsell Opportunity</h3>
                                <p className="text-xs text-slate-400">{lead?.name}</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 space-y-4">
                        {/* Payment Type Selection */}
                        <div>
                            <label className="text-xs font-medium text-slate-400 block mb-2">Payment Status</label>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={() => setUpsellData({ ...upsellData, type: 'paid' })}
                                    className={`p-3 rounded-lg border transition-all ${upsellData.type === 'paid'
                                        ? 'bg-emerald-500/20 border-emerald-500'
                                        : 'bg-[var(--bg-tertiary)]/30 border-white/5 hover:border-emerald-500/30'
                                        }`}
                                >
                                    <div className="flex flex-col items-center gap-1">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${upsellData.type === 'paid' ? 'bg-emerald-500' : 'bg-emerald-500/10'
                                            }`}>
                                            <svg className={`w-4 h-4 ${upsellData.type === 'paid' ? 'text-white' : 'text-emerald-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <span className={`text-xs font-medium ${upsellData.type === 'paid' ? 'text-emerald-400' : 'text-slate-400'}`}>
                                            Paid
                                        </span>
                                    </div>
                                </button>

                                <button
                                    onClick={() => setUpsellData({ ...upsellData, type: 'unpaid' })}
                                    className={`p-3 rounded-lg border transition-all ${upsellData.type === 'unpaid'
                                        ? 'bg-amber-500/20 border-amber-500'
                                        : 'bg-[var(--bg-tertiary)]/30 border-white/5 hover:border-amber-500/30'
                                        }`}
                                >
                                    <div className="flex flex-col items-center gap-1">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${upsellData.type === 'unpaid' ? 'bg-amber-500' : 'bg-amber-500/10'
                                            }`}>
                                            <svg className={`w-4 h-4 ${upsellData.type === 'unpaid' ? 'text-white' : 'text-amber-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <span className={`text-xs font-medium ${upsellData.type === 'unpaid' ? 'text-amber-400' : 'text-slate-400'}`}>
                                            Unpaid
                                        </span>
                                    </div>
                                </button>
                            </div>
                        </div>

                        {/* Price Field */}
                        <div>
                            <label className="text-xs font-medium text-slate-400 block mb-1.5">
                                {upsellData.type === 'paid' ? 'Payment Amount ($)' : 'Expected Amount ($)'}
                            </label>
                            <input
                                type="number"
                                value={upsellData.price}
                                onChange={(e) => setUpsellData({ ...upsellData, price: e.target.value })}
                                placeholder={upsellData.type === 'paid' ? 'Enter paid amount' : 'Enter expected amount'}
                                className="w-full bg-[var(--bg-tertiary)]/30 border border-white/10 rounded-lg p-2.5 text-xs text-white placeholder:text-slate-500"
                            />
                        </div>

                        {/* Comment Field */}
                        <div>
                            <label className="text-xs font-medium text-slate-400 block mb-1.5">
                                {upsellData.type === 'paid' ? 'Payment Notes' : 'Upsell Notes'}
                            </label>
                            <textarea
                                value={upsellData.comment}
                                onChange={(e) => setUpsellData({ ...upsellData, comment: e.target.value })}
                                placeholder={upsellData.type === 'paid' ? 'Add payment details...' : 'Add upsell details...'}
                                className="w-full bg-[var(--bg-tertiary)]/30 border border-white/10 rounded-lg p-2.5 h-20 text-xs text-white placeholder:text-slate-500"
                            />
                        </div>
                    </div>

                    <div className="p-4 pt-3 border-t border-white/5 flex gap-2">
                        <button
                            onClick={onConfirm}
                            className="flex-1 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-medium rounded-lg transition-all"
                        >
                            {upsellData.type === 'paid' ? 'Save Payment' : 'Create Upsell'}
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

export default UpsellModal;