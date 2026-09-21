import React, { useState } from 'react';
import { 
  X, 
  Send, 
  ShieldCheck, 
  AlertCircle, 
  Stamp, 
  Lock, 
  FileText,
  CheckCircle2,
  Building2
} from 'lucide-react';
import { InmateProfile, PrivateMessage } from '../types';

interface PrivateMessageModalProps {
  inmate: InmateProfile | null;
  onClose: () => void;
  onSendSuccess: (message: PrivateMessage) => void;
}

export const PrivateMessageModal: React.FC<PrivateMessageModalProps> = ({
  inmate,
  onClose,
  onSendSuccess,
}) => {
  const [senderName, setSenderName] = useState('');
  const [senderHometown, setSenderHometown] = useState('');
  const [senderContact, setSenderContact] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [isLegalMail, setIsLegalMail] = useState(false);
  const [includePrepaidReply, setIncludePrepaidReply] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!inmate) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderName.trim()) {
      setError('Please provide your character / sender name.');
      return;
    }
    if (!subject.trim()) {
      setError('Please enter a message subject.');
      return;
    }
    if (!body.trim() || body.length < 20) {
      setError('Message body must be at least 20 characters.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    // Simulate correctional mailroom screening dispatch
    setTimeout(() => {
      const newMessage: PrivateMessage = {
        id: `msg-${Date.now()}`,
        inmateId: inmate.id,
        inmateName: inmate.name,
        inmateBooking: inmate.bookingNumber,
        senderName: senderName.trim(),
        senderHometown: senderHometown.trim() || 'Los Santos, SA',
        senderContact: senderContact.trim() || 'eyefind@gtaw.rp',
        subject: subject.trim(),
        body: body.trim(),
        sentAt: new Date().toISOString(),
        read: false,
        isLegalMail,
        status: 'Screened & Dispatched',
        replies: [],
      };

      onSendSuccess(newMessage);
      setIsSubmitting(false);
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        id="private-message-modal"
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-300"
      >
        {/* Header */}
        <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between shrink-0 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Stamp className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold font-serif text-white">
                  CorrDirect Inmate Messaging
                </h3>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                  Electronic Kiosk
                </span>
              </div>
              <p className="text-xs text-slate-400">
                To: <span className="text-white font-medium">{inmate.name}</span> ({inmate.bookingNumber}) • {inmate.facility}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-5 sm:p-6 flex-1 space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Institutional Compliance Notice */}
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-600 text-xs space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-slate-800">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
              <span>San Andreas Department of Corrections Mailroom Protocol</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Electronic correspondence is inspected by SADCR personnel prior to transmission to inmate recreation kiosks. Prohibited topics include active gang communications, escape logistics, or contraband solicitation.
            </p>
          </div>

          {/* Sender Character Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Your Character / Sender Name <span className="text-rose-500">*</span>
              </label>
              <input
                id="msg-sender-name"
                type="text"
                required
                value={senderName}
                onChange={e => setSenderName(e.target.value)}
                placeholder="e.g. Marcus Vance or Sarah Jenkins"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Your Return Location / Neighborhood
              </label>
              <input
                id="msg-sender-hometown"
                type="text"
                value={senderHometown}
                onChange={e => setSenderHometown(e.target.value)}
                placeholder="e.g. Strawberry, Rockford Hills, Sandy Shores"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="text-xs">
            <label className="block font-semibold text-slate-700 mb-1">
              Contact / Return Email or Phone (Optional)
            </label>
            <input
              id="msg-sender-contact"
              type="text"
              value={senderContact}
              onChange={e => setSenderContact(e.target.value)}
              placeholder="e.g. phone # 555-0192 or email@eyefind.info"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500"
            />
            <span className="text-[11px] text-slate-400 mt-0.5 block">
              Inmates can reply directly back to your CorrDirect online mailbox or through your provided contact.
            </span>
          </div>

          {/* Subject */}
          <div className="text-xs">
            <label className="block font-semibold text-slate-700 mb-1">
              Subject <span className="text-rose-500">*</span>
            </label>
            <input
              id="msg-subject"
              type="text"
              required
              value={subject}
              onChange={e => setSubject(e.target.value)}
              placeholder="e.g. Saw your profile on the Bolingbroke Pen-Pal registry"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500 font-medium"
            />
          </div>

          {/* Message Body */}
          <div className="text-xs">
            <div className="flex items-center justify-between mb-1">
              <label className="font-semibold text-slate-700">
                Message Content <span className="text-rose-500">*</span>
              </label>
              <span className="text-[11px] text-slate-400">
                {body.length} / 4000 characters
              </span>
            </div>
            <textarea
              id="msg-body"
              rows={6}
              required
              value={body}
              onChange={e => setBody(e.target.value)}
              placeholder="Write your letter to this inmate. Introduce yourself, mention mutual interests, ask about their day, or share what life in Los Santos is like..."
              className="w-full p-3 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500 text-sm leading-relaxed"
            />
          </div>

          {/* Options: Prepaid Reply Stamp & Legal Mail */}
          <div className="space-y-2 pt-2 border-t border-slate-200 text-xs">
            <label className="flex items-center gap-2 cursor-pointer text-slate-700">
              <input
                type="checkbox"
                checked={includePrepaidReply}
                onChange={e => setIncludePrepaidReply(e.target.checked)}
                className="rounded border-slate-300 text-amber-600 focus:ring-amber-500"
              />
              <span className="font-medium">
                Include prepaid CorrDirect return stamp ($0.50 commissary credit) so inmate can reply for free
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-slate-700">
              <input
                type="checkbox"
                checked={isLegalMail}
                onChange={e => setIsLegalMail(e.target.checked)}
                className="rounded border-slate-300 text-amber-600 focus:ring-amber-500"
              />
              <span>
                Mark as Privileged Legal Mail / Bar Association Consultation
              </span>
            </label>
          </div>

          {/* Submit Buttons */}
          <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:text-slate-800 font-medium text-xs rounded-lg hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              id="btn-submit-private-message"
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-lg shadow-sm flex items-center gap-2 transition-all disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'Transmitting to Mailroom...' : 'Dispatch Letter to Inmate'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
