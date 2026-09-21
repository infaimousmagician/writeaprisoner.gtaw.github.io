import React, { useState } from 'react';
import { 
  ShieldCheck, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle, 
  Eye, 
  Building2, 
  FileText, 
  Sparkles, 
  Trash2,
  Check,
  X,
  History,
  Shield,
  Filter,
  UserCheck
} from 'lucide-react';
import { InmateProfile, ModerationLog } from '../types';

interface AdminModerationViewProps {
  inmates: InmateProfile[];
  onApprove: (id: string, notes?: string) => void;
  onReject: (id: string, reason: string) => void;
  onToggleVerified: (id: string) => void;
  onToggleFeatured: (id: string) => void;
  onDelete: (id: string) => void;
  onViewDetails: (inmate: InmateProfile) => void;
  moderationLogs: ModerationLog[];
}

export const AdminModerationView: React.FC<AdminModerationViewProps> = ({
  inmates,
  onApprove,
  onReject,
  onToggleVerified,
  onToggleFeatured,
  onDelete,
  onViewDetails,
  moderationLogs,
}) => {
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected' | 'logs'>('pending');
  const [rejectingInmateId, setRejectingInmateId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('Incomplete booking records or unverified SADCR intake ID');

  const pendingList = inmates.filter(i => i.status === 'pending');
  const approvedList = inmates.filter(i => i.status === 'approved');
  const rejectedList = inmates.filter(i => i.status === 'rejected');

  const displayedList = 
    activeTab === 'pending' ? pendingList :
    activeTab === 'approved' ? approvedList :
    activeTab === 'rejected' ? rejectedList : [];

  const handleConfirmReject = (id: string) => {
    onReject(id, rejectReason);
    setRejectingInmateId(null);
  };

  return (
    <div id="admin-moderation-container" className="space-y-6">
      {/* Admin Panel Header & Stats Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 sm:p-6 border border-slate-800 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Shield className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold font-serif text-white">
                  SADCR Staff Administration & Moderation Panel
                </h2>
                <span className="text-[10px] font-mono uppercase bg-amber-950 text-amber-300 px-2 py-0.5 rounded border border-amber-700/60">
                  Officer Clearance
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Review, verify, and approve public inmate profile submissions across Bolingbroke Penitentiary and Twin Towers
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-emerald-400 font-mono font-medium flex items-center gap-1.5 bg-emerald-950/60 px-3 py-1.5 rounded-lg border border-emerald-800/80">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Live Moderation Queue Active
            </span>
          </div>
        </div>

        {/* Metric Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-5 text-xs">
          <div 
            onClick={() => setActiveTab('pending')}
            className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
              activeTab === 'pending'
                ? 'bg-amber-950/70 border-amber-500 text-amber-200 ring-2 ring-amber-500/20'
                : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-slate-400 text-[11px] font-medium">Pending Approvals</span>
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-bold font-mono text-white">
              {pendingList.length}
            </div>
            <span className="text-[10px] text-amber-400 font-semibold">Requires Action</span>
          </div>

          <div 
            onClick={() => setActiveTab('approved')}
            className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
              activeTab === 'approved'
                ? 'bg-emerald-950/70 border-emerald-500 text-emerald-200 ring-2 ring-emerald-500/20'
                : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-slate-400 text-[11px] font-medium">Approved & Active</span>
              <CheckCircle className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold font-mono text-white">
              {approvedList.length}
            </div>
            <span className="text-[10px] text-emerald-400">Publicly Listed</span>
          </div>

          <div 
            onClick={() => setActiveTab('rejected')}
            className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
              activeTab === 'rejected'
                ? 'bg-rose-950/70 border-rose-500 text-rose-200 ring-2 ring-rose-500/20'
                : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-slate-400 text-[11px] font-medium">Rejected</span>
              <XCircle className="w-4 h-4 text-rose-400" />
            </div>
            <div className="text-2xl font-bold font-mono text-white">
              {rejectedList.length}
            </div>
            <span className="text-[10px] text-slate-400">Declined Submissions</span>
          </div>

          <div 
            onClick={() => setActiveTab('logs')}
            className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
              activeTab === 'logs'
                ? 'bg-indigo-950/70 border-indigo-500 text-indigo-200 ring-2 ring-indigo-500/20'
                : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-slate-400 text-[11px] font-medium">Audit History</span>
              <History className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-2xl font-bold font-mono text-white">
              {moderationLogs.length}
            </div>
            <span className="text-[10px] text-indigo-300">Staff Decisions</span>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 text-xs font-semibold">
        <button
          id="admin-tab-pending"
          onClick={() => setActiveTab('pending')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-colors ${
            activeTab === 'pending'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Pending Approvals ({pendingList.length})</span>
        </button>

        <button
          id="admin-tab-approved"
          onClick={() => setActiveTab('approved')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-colors ${
            activeTab === 'approved'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <CheckCircle className="w-3.5 h-3.5" />
          <span>Active Directory ({approvedList.length})</span>
        </button>

        <button
          id="admin-tab-rejected"
          onClick={() => setActiveTab('rejected')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-colors ${
            activeTab === 'rejected'
              ? 'bg-rose-700 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <XCircle className="w-3.5 h-3.5" />
          <span>Rejected ({rejectedList.length})</span>
        </button>

        <button
          id="admin-tab-logs"
          onClick={() => setActiveTab('logs')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-colors ${
            activeTab === 'logs'
              ? 'bg-indigo-700 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <History className="w-3.5 h-3.5" />
          <span>Audit Log</span>
        </button>
      </div>

      {/* Audit Log View */}
      {activeTab === 'logs' ? (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs text-xs">
          <div className="bg-slate-100 px-4 py-3 font-bold text-slate-800 border-b border-slate-200 flex justify-between items-center">
            <span>Staff Moderation Audit History</span>
            <span className="font-mono text-slate-500 font-normal">{moderationLogs.length} logged events</span>
          </div>

          {moderationLogs.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              No moderation decisions logged yet.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {moderationLogs.map(log => (
                <div key={log.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded font-bold uppercase text-[10px] ${
                        log.action === 'Approved' ? 'bg-emerald-100 text-emerald-800' :
                        log.action === 'Rejected' ? 'bg-rose-100 text-rose-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {log.action}
                      </span>
                      <strong className="text-slate-900 text-sm font-serif">{log.inmateName}</strong>
                      <span className="text-slate-400">({log.inmateId})</span>
                    </div>
                    {log.reason && (
                      <p className="text-slate-600 italic pl-1">
                        Reason: "{log.reason}"
                      </p>
                    )}
                  </div>

                  <div className="text-right shrink-0">
                    <p className="font-medium text-slate-700">{log.moderator}</p>
                    <p className="text-[11px] text-slate-400">
                      {new Date(log.timestamp).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Inmate Profiles List for Review */
        <div className="space-y-4">
          {displayedList.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-500">
              <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
              <h4 className="font-serif font-bold text-slate-800 text-base">
                Queue is Clear
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                There are no profiles in the {activeTab} section right now.
              </p>
            </div>
          ) : (
            displayedList.map(inmate => (
              <div
                key={inmate.id}
                id={`admin-item-${inmate.id}`}
                className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-4 sm:p-5 flex flex-col md:flex-row items-start justify-between gap-5 hover:border-slate-300 transition-colors"
              >
                {/* Left: Thumbnail & Details */}
                <div className="flex gap-4 w-full md:w-auto flex-1">
                  <div className="relative w-20 h-28 sm:w-24 sm:h-32 rounded-lg overflow-hidden shrink-0 bg-slate-100 border border-slate-300">
                    <img
                      src={inmate.primaryPhoto}
                      alt={inmate.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 inset-x-0 bg-slate-950/80 text-[9px] text-center text-white font-mono p-0.5">
                      #{inmate.bookingNumber}
                    </div>
                  </div>

                  <div className="space-y-1.5 flex-1 min-w-0 text-xs">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-serif font-bold text-base text-slate-900 leading-tight">
                        {inmate.name}
                      </h3>
                      {inmate.moniker && (
                        <span className="text-amber-700 italic font-medium">"{inmate.moniker}"</span>
                      )}
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        inmate.status === 'pending' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                        inmate.status === 'approved' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                        'bg-rose-100 text-rose-800 border border-rose-200'
                      }`}>
                        {inmate.status}
                      </span>
                      {inmate.verifiedInmate && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3" />
                          Roster Verified
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-0.5 text-slate-600 text-[11px]">
                      <div>Facility: <strong className="text-slate-800">{inmate.facility}</strong></div>
                      <div>Sentence: <strong className="text-slate-800">{inmate.sentence}</strong></div>
                      <div>Hometown: <span>{inmate.hometown}</span></div>
                      <div>Parole Date: <span className="font-semibold text-emerald-700">{inmate.paroleEligibility}</span></div>
                    </div>

                    <div className="bg-slate-50 p-2 rounded border border-slate-200 text-[11px] text-slate-700">
                      <strong>Charges:</strong> {inmate.conviction} ({inmate.convictionCategory})
                    </div>

                    <p className="text-slate-500 line-clamp-2 text-[11px] leading-relaxed">
                      "{inmate.aboutMe}"
                    </p>

                    <div className="text-[10px] text-slate-400">
                      Submitted: {new Date(inmate.submittedAt).toLocaleString()}
                      {inmate.moderationNotes && ` • Note: ${inmate.moderationNotes}`}
                    </div>
                  </div>
                </div>

                {/* Right: Administrative Decisions Bar */}
                <div className="flex md:flex-col items-center sm:items-end justify-between w-full md:w-auto shrink-0 gap-2 border-t md:border-t-0 pt-3 md:pt-0">
                  <button
                    onClick={() => onViewDetails(inmate)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded text-xs font-medium flex items-center gap-1.5 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Profile</span>
                  </button>

                  {/* Actions for Pending or Re-decision */}
                  <div className="flex items-center gap-2">
                    {inmate.status !== 'approved' && (
                      <button
                        id={`btn-approve-${inmate.id}`}
                        onClick={() => onApprove(inmate.id)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors"
                        title="Approve profile and publish live to WriteAnInmate directory"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Approve</span>
                      </button>
                    )}

                    {inmate.status !== 'rejected' && (
                      <button
                        id={`btn-reject-${inmate.id}`}
                        onClick={() => setRejectingInmateId(inmate.id)}
                        className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors"
                        title="Reject submission with specific reason"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>
                    )}
                  </div>

                  {/* Secondary Toggles */}
                  <div className="flex items-center gap-1.5 text-[11px]">
                    <button
                      onClick={() => onToggleVerified(inmate.id)}
                      className="px-2 py-1 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-300 rounded font-medium transition-colors"
                    >
                      {inmate.verifiedInmate ? 'Revoke Verified' : 'Verify Roster'}
                    </button>
                    <button
                      onClick={() => onDelete(inmate.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                      title="Permanently remove profile"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Reject Reason Dialog Inline */}
                {rejectingInmateId === inmate.id && (
                  <div className="w-full mt-3 p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs space-y-2">
                    <div className="flex items-center justify-between font-bold text-rose-900">
                      <span>Specify Rejection Reason:</span>
                      <button onClick={() => setRejectingInmateId(null)}>
                        <X className="w-4 h-4 text-rose-500" />
                      </button>
                    </div>
                    <select
                      value={rejectReason}
                      onChange={e => setRejectReason(e.target.value)}
                      className="w-full p-2 bg-white border border-rose-300 rounded text-slate-800"
                    >
                      <option value="Incomplete booking records or unverified SADCR intake ID">
                        Incomplete booking records or unverified SADCR intake ID
                      </option>
                      <option value="Violation of prison contraband / gang solicitation policy">
                        Violation of prison contraband / gang solicitation policy
                      </option>
                      <option value="Inappropriate or unapproved mugshot / portrait photo">
                        Inappropriate or unapproved mugshot / portrait photo
                      </option>
                      <option value="Duplicate listing for this inmate booking number">
                        Duplicate listing for this inmate booking number
                      </option>
                      <option value="Disciplinary transfer / Restricted correspondence status">
                        Disciplinary transfer / Restricted correspondence status
                      </option>
                    </select>
                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        onClick={() => setRejectingInmateId(null)}
                        className="px-3 py-1 bg-slate-200 text-slate-700 rounded font-medium"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleConfirmReject(inmate.id)}
                        className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded font-bold"
                      >
                        Confirm Rejection
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
