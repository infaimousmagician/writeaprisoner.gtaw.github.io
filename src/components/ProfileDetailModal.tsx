import React, { useState } from 'react';
import { 
  X, 
  Mail, 
  MapPin, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  Copy, 
  Check, 
  Printer, 
  Share2, 
  Building2, 
  AlertCircle,
  Sparkles,
  Heart,
  ChevronLeft,
  ChevronRight,
  FileCheck,
  ShieldAlert
} from 'lucide-react';
import { InmateProfile } from '../types';

interface ProfileDetailModalProps {
  inmate: InmateProfile | null;
  onClose: () => void;
  onSendMessage: (inmate: InmateProfile) => void;
  isAdminMode: boolean;
  onAdminApprove?: (id: string) => void;
  onAdminReject?: (id: string) => void;
  onAdminToggleVerified?: (id: string) => void;
}

export const ProfileDetailModal: React.FC<ProfileDetailModalProps> = ({
  inmate,
  onClose,
  onSendMessage,
  isAdminMode,
  onAdminApprove,
  onAdminReject,
  onAdminToggleVerified,
}) => {
  const [selectedPhotoIdx, setSelectedPhotoIdx] = useState(0);
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!inmate) return null;

  const photos = inmate.galleryPhotos && inmate.galleryPhotos.length > 0 
    ? inmate.galleryPhotos 
    : [inmate.primaryPhoto];

  const handleCopyAddress = () => {
    const addr = inmate.institutionalAddress || {
      facilityName: inmate.facility || 'Bolingbroke State Penitentiary',
      poBox: 'P.O. Box 4500',
      cityStateZip: 'Senora Desert, SA 93210'
    };
    const formatted = `${inmate.name} #${inmate.bookingNumber}\n${addr.facilityName}\n${addr.poBox}\n${addr.cityStateZip}`;
    navigator.clipboard?.writeText(formatted);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2500);
  };

  const handleCopyShareLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handlePrintEnvelope = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        id="profile-detail-modal"
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-300"
      >
        {/* Modal Top Header */}
        <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between shrink-0 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold text-lg">
              SA
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-serif font-bold text-white tracking-tight">
                  {inmate.name}
                </h2>
                {inmate.moniker && (
                  <span className="text-amber-400 font-semibold italic text-sm">
                    "{inmate.moniker}"
                  </span>
                )}
                {inmate.verifiedInmate && (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-300 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    Verified Inmate Record
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                <span>Booking ID: <strong className="font-mono text-slate-200">{inmate.bookingNumber}</strong></span>
                <span>•</span>
                <span>{inmate.facility}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyShareLink}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              title="Copy Profile Link"
            >
              {copiedLink ? <Check className="w-5 h-5 text-emerald-400" /> : <Share2 className="w-5 h-5" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              title="Close Profile"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-5 sm:p-6 flex-1 space-y-6">
          {/* Admin Notice Bar if in Admin Mode */}
          {isAdminMode && (
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  <strong>Moderation Status:</strong>{' '}
                  <span className={`uppercase font-bold ${
                    inmate.status === 'approved' ? 'text-emerald-700' :
                    inmate.status === 'rejected' ? 'text-rose-700' : 'text-amber-700'
                  }`}>
                    {inmate.status}
                  </span>
                  {inmate.moderatedBy && ` (Reviewed by ${inmate.moderatedBy})`}
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {inmate.status !== 'approved' && (
                  <button
                    onClick={() => onAdminApprove && onAdminApprove(inmate.id)}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-medium"
                  >
                    Approve Profile
                  </button>
                )}
                {inmate.status !== 'rejected' && (
                  <button
                    onClick={() => onAdminReject && onAdminReject(inmate.id)}
                    className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded font-medium"
                  >
                    Reject Profile
                  </button>
                )}
                <button
                  onClick={() => onAdminToggleVerified && onAdminToggleVerified(inmate.id)}
                  className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded font-medium"
                >
                  {inmate.verifiedInmate ? 'Revoke Verification' : 'Verify Roster'}
                </button>
              </div>
            </div>
          )}

          {/* Grid Layout: Left Column (Photos & Institutional Address & Vital Stats) + Right Column (Bio, Story, CorrDirect) */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Left Column (5 cols) */}
            <div className="md:col-span-5 space-y-5">
              {/* Photo Showcase */}
              <div className="bg-slate-100 rounded-xl p-3 border border-slate-200 shadow-inner">
                <div className="relative aspect-3/4 rounded-lg overflow-hidden bg-slate-900 border border-slate-300">
                  <img
                    src={photos[selectedPhotoIdx]}
                    alt={inmate.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 left-2 right-2 bg-slate-950/80 backdrop-blur-xs text-white text-[11px] py-1 px-2.5 rounded font-mono flex justify-between">
                    <span>SADCR #{inmate.bookingNumber}</span>
                    <span>{inmate.facility.split(' - ')[0]}</span>
                  </div>
                </div>

                {/* Thumbnails if multiple photos */}
                {photos.length > 1 && (
                  <div className="flex gap-2 mt-2.5 overflow-x-auto pb-1">
                    {photos.map((photo, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedPhotoIdx(idx)}
                        className={`relative w-14 h-16 rounded overflow-hidden shrink-0 border-2 transition-all ${
                          selectedPhotoIdx === idx ? 'border-amber-500 scale-105' : 'border-slate-300 opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img src={photo} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons: Message Now */}
              <button
                id="btn-modal-send-message"
                onClick={() => onSendMessage(inmate)}
                className="w-full py-3 px-4 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-bold shadow-md flex items-center justify-center gap-2 transition-transform active:scale-[0.98]"
              >
                <Mail className="w-5 h-5" />
                <span>Write Inmate via CorrDirect</span>
              </button>

              {/* Physical & Demographic Details Table */}
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs text-xs">
                <div className="bg-slate-100 px-3.5 py-2 font-semibold text-slate-800 border-b border-slate-200">
                  Inmate Vital Information
                </div>
                <div className="divide-y divide-slate-100">
                  <div className="flex justify-between px-3.5 py-2">
                    <span className="text-slate-500">Gender / Identity:</span>
                    <span className="font-semibold text-slate-800">{inmate.gender}</span>
                  </div>
                  <div className="flex justify-between px-3.5 py-2">
                    <span className="text-slate-500">Age / Date of Birth:</span>
                    <span className="font-semibold text-slate-800">{inmate.age} yrs ({inmate.dateOfBirth})</span>
                  </div>
                  <div className="flex justify-between px-3.5 py-2">
                    <span className="text-slate-500">Hometown / Neighborhood:</span>
                    <span className="font-semibold text-slate-800">{inmate.hometown}</span>
                  </div>
                  <div className="flex justify-between px-3.5 py-2">
                    <span className="text-slate-500">Height / Weight:</span>
                    <span className="font-semibold text-slate-800">{inmate.height}, {inmate.weight}</span>
                  </div>
                  <div className="flex justify-between px-3.5 py-2">
                    <span className="text-slate-500">Hair & Eyes:</span>
                    <span className="font-semibold text-slate-800">{inmate.hairColor} / {inmate.eyeColor}</span>
                  </div>
                  <div className="flex justify-between px-3.5 py-2">
                    <span className="text-slate-500">Astrological Sign:</span>
                    <span className="font-semibold text-slate-800">{inmate.astrologicalSign}</span>
                  </div>
                  {inmate.religion && (
                    <div className="flex justify-between px-3.5 py-2">
                      <span className="text-slate-500">Faith / Religion:</span>
                      <span className="font-semibold text-slate-800">{inmate.religion}</span>
                    </div>
                  )}
                  <div className="flex justify-between px-3.5 py-2">
                    <span className="text-slate-500">Marital Status:</span>
                    <span className="font-semibold text-slate-800">{inmate.maritalStatus}</span>
                  </div>
                  <div className="flex justify-between px-3.5 py-2">
                    <span className="text-slate-500">Sexual Orientation:</span>
                    <span className="font-semibold text-slate-800">{inmate.sexualOrientation}</span>
                  </div>
                </div>
              </div>

              {/* Official Postal Mailing Address Box */}
              <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 text-xs">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-amber-900 flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-amber-700" />
                    Postal Mail Envelope Address
                  </h4>
                  <button
                    onClick={handleCopyAddress}
                    className="flex items-center gap-1 text-[11px] font-semibold text-amber-800 hover:text-amber-950 bg-amber-100 hover:bg-amber-200 px-2 py-0.5 rounded transition-colors"
                  >
                    {copiedAddress ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedAddress ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <div className="font-mono bg-white p-3 rounded border border-amber-200 text-slate-800 leading-relaxed text-[11px]">
                  <p className="font-bold">{inmate.name} #{inmate.bookingNumber}</p>
                  <p>{inmate.institutionalAddress?.facilityName || inmate.facility}</p>
                  <p>{inmate.institutionalAddress?.poBox || 'P.O. Box 4500'}</p>
                  <p>{inmate.institutionalAddress?.cityStateZip || 'Senora Desert, SA 93210'}</p>
                </div>
                <p className="text-[11px] text-amber-800/80 mt-2 italic">
                  *Letters must be written in blue/black ink. No perfume, stickers, or polaroids allowed per Bolingbroke mailroom contraband policy.
                </p>
              </div>
            </div>

            {/* Right Column (7 cols): Incarceration Profile & Story */}
            <div className="md:col-span-7 space-y-5">
              {/* Incarceration & Sentencing Metrics Card */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                  Correctional Records & Sentence
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs mb-3">
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                    <span className="text-slate-400 block text-[11px]">Security Level</span>
                    <strong className="text-slate-900 text-sm">{inmate.securityLevel}</strong>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                    <span className="text-slate-400 block text-[11px]">Sentence Term</span>
                    <strong className="text-slate-900 text-sm">{inmate.sentence}</strong>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                    <span className="text-slate-400 block text-[11px]">Parole Eligibility</span>
                    <strong className="text-emerald-700 text-sm">{inmate.paroleEligibility}</strong>
                  </div>
                </div>

                <div className="bg-white p-3 rounded-lg border border-slate-200 text-xs">
                  <span className="text-slate-500 block text-[11px] font-semibold mb-0.5">Offense / Conviction Charges:</span>
                  <p className="text-slate-800 font-medium">{inmate.conviction}</p>
                  <span className="inline-block mt-2 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                    Category: {inmate.convictionCategory}
                  </span>
                </div>
              </div>

              {/* Seeking Intentions */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Pen-Pal Intentions & Looking For
                </h4>
                <div className="flex flex-wrap gap-2">
                  {(Array.isArray(inmate.seeking) ? inmate.seeking : []).map(item => (
                    <span
                      key={item}
                      className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border ${
                        item === 'Romance'
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : item === 'Legal Assistance'
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : 'bg-amber-50 text-amber-800 border-amber-200'
                      }`}
                    >
                      {item === 'Romance' && <Heart className="w-3.5 h-3.5 fill-rose-600 text-rose-600" />}
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bio: About Me */}
              <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
                <h4 className="font-serif font-bold text-slate-900 text-base mb-2">
                  About Me & My Background
                </h4>
                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                  {inmate.aboutMe}
                </p>
              </div>

              {/* Why Write Me */}
              <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
                <h4 className="font-serif font-bold text-slate-900 text-base mb-2">
                  Why You Should Write Me
                </h4>
                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                  {inmate.whyWriteMe}
                </p>
              </div>

              {/* Hobbies & Pastimes */}
              <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
                  Daily Pastimes & Hobbies Behind Bars
                </h4>
                <div className="flex flex-wrap gap-2">
                  {(Array.isArray(inmate.hobbies) ? inmate.hobbies : []).map((hobby, idx) => (
                    <span
                      key={idx}
                      className="bg-slate-100 text-slate-700 text-xs px-2.5 py-1 rounded-md border border-slate-200"
                    >
                      {hobby}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Call to Action */}
              <div className="bg-slate-900 text-white rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div>
                  <h5 className="font-bold text-sm">Ready to correspond with {inmate.name}?</h5>
                  <p className="text-xs text-slate-400">
                    Send a private electronic letter delivered straight through Bolingbroke CorrDirect.
                  </p>
                </div>
                <button
                  onClick={() => onSendMessage(inmate)}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg shadow-sm whitespace-nowrap"
                >
                  Compose Message
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
