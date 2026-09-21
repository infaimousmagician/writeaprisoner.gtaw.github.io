import React from 'react';
import { 
  Building2, 
  Calendar, 
  MapPin, 
  Mail, 
  CheckCircle, 
  Heart, 
  Eye, 
  ShieldCheck, 
  Clock, 
  AlertCircle,
  Sparkles,
  Bookmark
} from 'lucide-react';
import { InmateProfile } from '../types';

interface ProfileCardProps {
  inmate: InmateProfile;
  onViewDetails: (inmate: InmateProfile) => void;
  onSendMessage: (inmate: InmateProfile) => void;
  isAdminMode: boolean;
  onAdminApprove?: (id: string) => void;
  onAdminReject?: (id: string) => void;
  isBookmarked: boolean;
  onToggleBookmark: (id: string) => void;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
  inmate,
  onViewDetails,
  onSendMessage,
  isAdminMode,
  onAdminApprove,
  onAdminReject,
  isBookmarked,
  onToggleBookmark,
}) => {
  const seekingList = Array.isArray(inmate.seeking) ? inmate.seeking : [];
  const isRomance = seekingList.includes('Romance');

  return (
    <div 
      id={`inmate-card-${inmate.id}`}
      className="bg-white rounded-xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col group"
    >
      {/* Top Card Header with Booking Status */}
      <div className="bg-slate-900 text-white px-3.5 py-2 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 font-mono">
          <span className="text-amber-400 font-bold">{inmate.bookingNumber}</span>
          <span className="text-slate-500">|</span>
          <span className="text-slate-300 truncate max-w-[140px] sm:max-w-[180px]">{inmate.facility}</span>
        </div>

        <div className="flex items-center gap-1.5">
          {inmate.verifiedInmate && (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-300 bg-emerald-950/70 border border-emerald-700/60 px-1.5 py-0.5 rounded">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              Verified Inmate
            </span>
          )}

          {inmate.status === 'pending' && (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-amber-200 bg-amber-900/80 px-1.5 py-0.5 rounded border border-amber-600">
              Pending Admin
            </span>
          )}

          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleBookmark(inmate.id);
            }}
            className={`p-1 rounded transition-colors ${
              isBookmarked ? 'text-amber-400 hover:text-amber-300' : 'text-slate-400 hover:text-white'
            }`}
            title={isBookmarked ? "Remove from saved pen-pals" : "Save pen-pal to favorites"}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-amber-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex gap-4">
          {/* Photo with Institutional Mugshot Styling */}
          <div className="relative shrink-0 w-28 h-36 sm:w-32 sm:h-40 rounded-lg overflow-hidden bg-slate-100 border border-slate-300 shadow-inner">
            <img
              src={inmate.primaryPhoto}
              alt={inmate.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {/* Overlay Banner */}
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950/90 via-slate-900/60 to-transparent p-1 text-center">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-200">
                {inmate.gender} • {inmate.age} yrs
              </span>
            </div>

            {isRomance && (
              <div className="absolute top-1.5 left-1.5 bg-rose-600 text-white p-1 rounded-full shadow-md" title="Seeking Romance">
                <Heart className="w-3 h-3 fill-white" />
              </div>
            )}
          </div>

          {/* Core Info */}
          <div className="flex-1 min-w-0">
            <div className="mb-1">
              <h3 className="font-serif font-bold text-slate-900 text-base sm:text-lg leading-tight truncate hover:text-amber-700 cursor-pointer" onClick={() => onViewDetails(inmate)}>
                {inmate.name}
              </h3>
              {inmate.moniker && (
                <p className="text-xs text-amber-700 font-semibold italic">
                  "{inmate.moniker}"
                </p>
              )}
            </div>

            {/* Quick Metrics */}
            <div className="space-y-1 text-xs text-slate-600 mb-2">
              <div className="flex items-center gap-1.5 truncate">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{inmate.hometown}</span>
              </div>
              <div className="flex items-center gap-1.5 truncate">
                <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>Sentence: <strong className="text-slate-800">{inmate.sentence}</strong></span>
              </div>
              <div className="flex items-center gap-1.5 truncate">
                <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>Parole: <span className="font-semibold text-emerald-700">{inmate.paroleEligibility}</span></span>
              </div>
            </div>

            {/* Conviction brief */}
            <div className="text-[11px] bg-slate-50 border border-slate-200 rounded p-1.5 text-slate-700 line-clamp-2">
              <span className="font-semibold text-slate-900">Conviction:</span> {inmate.conviction}
            </div>
          </div>
        </div>

        {/* Seeking Tags */}
        <div className="mt-3 flex flex-wrap gap-1 items-center">
          <span className="text-[11px] font-semibold text-slate-500 mr-1">Seeking:</span>
          {seekingList.map(item => (
            <span
              key={item}
              className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${
                item === 'Romance'
                  ? 'bg-rose-50 text-rose-700 border-rose-200'
                  : item === 'Legal Assistance'
                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                  : 'bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              {item}
            </span>
          ))}
        </div>

        {/* Bio Excerpt */}
        <div className="mt-2.5 text-xs text-slate-600 line-clamp-3 leading-relaxed flex-1">
          {inmate.aboutMe}
        </div>

        {/* Admin Review Action Bar (If in Admin Mode and pending) */}
        {isAdminMode && inmate.status === 'pending' && (
          <div className="mt-3 p-2 bg-amber-50 rounded-lg border border-amber-200 flex items-center justify-between gap-2 text-xs">
            <span className="font-medium text-amber-900">Requires Staff Decision:</span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => onAdminApprove && onAdminApprove(inmate.id)}
                className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-medium shadow-xs"
              >
                Approve
              </button>
              <button
                onClick={() => onAdminReject && onAdminReject(inmate.id)}
                className="px-2 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded font-medium shadow-xs"
              >
                Reject
              </button>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
          <button
            id={`btn-view-profile-${inmate.id}`}
            onClick={() => onViewDetails(inmate)}
            className="flex-1 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View Profile</span>
          </button>

          <button
            id={`btn-message-inmate-${inmate.id}`}
            onClick={() => onSendMessage(inmate)}
            className="flex-1 py-2 px-3 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm transition-colors"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Write Inmate</span>
          </button>
        </div>
      </div>
    </div>
  );
};
