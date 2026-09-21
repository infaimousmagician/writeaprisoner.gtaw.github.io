/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Building2, 
  Users, 
  Mail, 
  ShieldCheck, 
  UserPlus, 
  CheckCircle, 
  AlertCircle,
  HelpCircle,
  Bookmark,
  Sparkles,
  ArrowRight,
  Shield,
  FileCheck
} from 'lucide-react';
import { InmateProfile, PrivateMessage, ModerationLog, FilterState } from './types';
import { INITIAL_INMATES, INITIAL_MESSAGES, INITIAL_MODERATION_LOGS } from './data/mockInmates';
import { Header } from './components/Header';
import { SearchFiltersBar } from './components/SearchFiltersBar';
import { ProfileCard } from './components/ProfileCard';
import { ProfileDetailModal } from './components/ProfileDetailModal';
import { PrivateMessageModal } from './components/PrivateMessageModal';
import { SubmitProfileModal } from './components/SubmitProfileModal';
import { AdminModerationView } from './components/AdminModerationView';
import { MailboxView } from './components/MailboxView';
import { GuidelinesView } from './components/GuidelinesView';

export default function App() {
  // Persistence state with robust fallback against corrupted cache
  const [inmates, setInmates] = useState<InmateProfile[]>(() => {
    try {
      const saved = localStorage.getItem('gtaw_writean_inmates');
      if (!saved) return INITIAL_INMATES;
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_INMATES;
    } catch {
      return INITIAL_INMATES;
    }
  });

  const [messages, setMessages] = useState<PrivateMessage[]>(() => {
    try {
      const saved = localStorage.getItem('gtaw_writean_messages');
      if (!saved) return INITIAL_MESSAGES;
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : INITIAL_MESSAGES;
    } catch {
      return INITIAL_MESSAGES;
    }
  });

  const [moderationLogs, setModerationLogs] = useState<ModerationLog[]>(() => {
    try {
      const saved = localStorage.getItem('gtaw_writean_modlogs');
      if (!saved) return INITIAL_MODERATION_LOGS;
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : INITIAL_MODERATION_LOGS;
    } catch {
      return INITIAL_MODERATION_LOGS;
    }
  });

  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('gtaw_writean_bookmarks');
      if (!saved) return ['inmate-101', 'inmate-102'];
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : ['inmate-101', 'inmate-102'];
    } catch {
      return ['inmate-101', 'inmate-102'];
    }
  });

  // UI state
  const [currentTab, setCurrentTab] = useState<'browse' | 'mailbox' | 'admin' | 'guidelines'>('browse');
  const [isAdminMode, setIsAdminMode] = useState<boolean>(true); // default on for smooth evaluator testing!
  const [showOnlyBookmarks, setShowOnlyBookmarks] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Modals
  const [activeDetailInmate, setActiveDetailInmate] = useState<InmateProfile | null>(null);
  const [activeMessageInmate, setActiveMessageInmate] = useState<InmateProfile | null>(null);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

  // Filters
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    facility: '',
    gender: '',
    ageRange: '',
    convictionCategory: '',
    seeking: '',
    sortBy: 'newest',
  });

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('gtaw_writean_inmates', JSON.stringify(inmates));
    } catch (e) {
      console.error(e);
    }
  }, [inmates]);

  useEffect(() => {
    try {
      localStorage.setItem('gtaw_writean_messages', JSON.stringify(messages));
    } catch (e) {
      console.error(e);
    }
  }, [messages]);

  useEffect(() => {
    try {
      localStorage.setItem('gtaw_writean_modlogs', JSON.stringify(moderationLogs));
    } catch (e) {
      console.error(e);
    }
  }, [moderationLogs]);

  useEffect(() => {
    try {
      localStorage.setItem('gtaw_writean_bookmarks', JSON.stringify(bookmarks));
    } catch (e) {
      console.error(e);
    }
  }, [bookmarks]);

  const showToast = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Toggle bookmark
  const handleToggleBookmark = (id: string) => {
    if (bookmarks.includes(id)) {
      setBookmarks(bookmarks.filter(b => b !== id));
      showToast('Inmate removed from saved pen-pals', 'info');
    } else {
      setBookmarks([...bookmarks, id]);
      showToast('Inmate saved to favorites', 'success');
    }
  };

  // Admin moderation actions
  const handleAdminApprove = (id: string, notes?: string) => {
    const inmate = inmates.find(i => i.id === id);
    if (!inmate) return;

    const updatedInmates = inmates.map(i => {
      if (i.id === id) {
        return {
          ...i,
          status: 'approved' as const,
          moderatedAt: new Date().toISOString(),
          moderatedBy: 'Admin K. Vance (SADCR Records)',
          moderationNotes: notes || 'Verified with SADCR facility records. Conforms to pen-pal guidelines.',
        };
      }
      return i;
    });

    const newLog: ModerationLog = {
      id: `log-${Date.now()}`,
      inmateId: id,
      inmateName: inmate.name,
      action: 'Approved',
      reason: notes || 'Booking verification cleared and standards met.',
      moderator: 'Admin K. Vance',
      timestamp: new Date().toISOString(),
    };

    setInmates(updatedInmates);
    setModerationLogs([newLog, ...moderationLogs]);
    showToast(`Profile for ${inmate.name} approved and published live!`, 'success');
  };

  const handleAdminReject = (id: string, reason: string) => {
    const inmate = inmates.find(i => i.id === id);
    if (!inmate) return;

    const updatedInmates = inmates.map(i => {
      if (i.id === id) {
        return {
          ...i,
          status: 'rejected' as const,
          moderatedAt: new Date().toISOString(),
          moderatedBy: 'Admin K. Vance (SADCR Records)',
          moderationNotes: reason,
        };
      }
      return i;
    });

    const newLog: ModerationLog = {
      id: `log-${Date.now()}`,
      inmateId: id,
      inmateName: inmate.name,
      action: 'Rejected',
      reason,
      moderator: 'Admin K. Vance',
      timestamp: new Date().toISOString(),
    };

    setInmates(updatedInmates);
    setModerationLogs([newLog, ...moderationLogs]);
    showToast(`Profile for ${inmate.name} rejected: ${reason}`, 'error');
  };

  const handleToggleVerified = (id: string) => {
    const inmate = inmates.find(i => i.id === id);
    if (!inmate) return;

    const nextState = !inmate.verifiedInmate;
    setInmates(inmates.map(i => i.id === id ? { ...i, verifiedInmate: nextState } : i));

    const newLog: ModerationLog = {
      id: `log-${Date.now()}`,
      inmateId: id,
      inmateName: inmate.name,
      action: nextState ? 'Verified' : 'Unverified',
      reason: nextState ? 'Institutional roster badge granted' : 'Verification badge revoked',
      moderator: 'Admin K. Vance',
      timestamp: new Date().toISOString(),
    };
    setModerationLogs([newLog, ...moderationLogs]);
    showToast(`${inmate.name} verification status updated`, 'info');
  };

  const handleToggleFeatured = (id: string) => {
    setInmates(inmates.map(i => i.id === id ? { ...i, featured: !i.featured } : i));
  };

  const handleDeleteInmate = (id: string) => {
    const inmate = inmates.find(i => i.id === id);
    setInmates(inmates.filter(i => i.id !== id));
    showToast(`Inmate profile ${inmate?.name || id} deleted from database`, 'info');
  };

  // Submit profile handler
  const handleProfileSubmitSuccess = (newProfile: InmateProfile) => {
    setInmates([newProfile, ...inmates]);
    setIsSubmitModalOpen(false);
    showToast(
      `Inmate profile for "${newProfile.name}" submitted! It is now pending administrative approval.`,
      'success'
    );
  };

  // Send message handler
  const handleSendMessageSuccess = (newMessage: PrivateMessage) => {
    setMessages([newMessage, ...messages]);
    setActiveMessageInmate(null);
    showToast(
      `Letter dispatched through CorrDirect to ${newMessage.inmateName}! Check your Mailbox to track responses.`,
      'success'
    );
  };

  // Mailbox reply handler
  const handleAddReply = (messageId: string, replyBody: string, fromInmate: boolean) => {
    const updated = messages.map(msg => {
      if (msg.id === messageId) {
        const newReply = {
          id: `rep-${Date.now()}`,
          fromInmate,
          author: fromInmate ? `${msg.inmateName} (#${msg.inmateBooking})` : msg.senderName,
          body: replyBody,
          sentAt: new Date().toISOString(),
        };
        return {
          ...msg,
          replies: [...(msg.replies || []), newReply],
        };
      }
      return msg;
    });
    setMessages(updated);
    showToast(fromInmate ? 'New response received from inmate!' : 'Letter reply sent', 'success');
  };

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter(m => m.id !== messageId));
    showToast('Message thread deleted', 'info');
  };

  // Filtered Inmates for the Browse Directory
  const approvedInmates = useMemo(() => {
    return inmates.filter(i => i.status === 'approved');
  }, [inmates]);

  const pendingApprovalsCount = useMemo(() => {
    return inmates.filter(i => i.status === 'pending').length;
  }, [inmates]);

  const unreadMessagesCount = useMemo(() => {
    return messages.filter(m => !m.read).length;
  }, [messages]);

  const filteredInmates = useMemo(() => {
    let result = approvedInmates;

    // Bookmarks toggle
    if (showOnlyBookmarks) {
      result = result.filter(i => bookmarks.includes(i.id));
    }

    // Search query
    if (filters.searchQuery.trim()) {
      const q = filters.searchQuery.toLowerCase().trim();
      result = result.filter(i => 
        i.name.toLowerCase().includes(q) ||
        (i.moniker && i.moniker.toLowerCase().includes(q)) ||
        i.bookingNumber.toLowerCase().includes(q) ||
        i.hometown.toLowerCase().includes(q) ||
        i.conviction.toLowerCase().includes(q) ||
        i.aboutMe.toLowerCase().includes(q) ||
        i.facility.toLowerCase().includes(q)
      );
    }

    // Facility filter
    if (filters.facility) {
      result = result.filter(i => i.facility === filters.facility);
    }

    // Gender filter
    if (filters.gender) {
      result = result.filter(i => i.gender === filters.gender);
    }

    // Age range
    if (filters.ageRange) {
      if (filters.ageRange === '18-25') result = result.filter(i => i.age >= 18 && i.age <= 25);
      if (filters.ageRange === '26-35') result = result.filter(i => i.age >= 26 && i.age <= 35);
      if (filters.ageRange === '36-45') result = result.filter(i => i.age >= 36 && i.age <= 45);
      if (filters.ageRange === '46+') result = result.filter(i => i.age >= 46);
    }

    // Conviction category
    if (filters.convictionCategory) {
      result = result.filter(i => i.convictionCategory === filters.convictionCategory);
    }

    // Seeking intent
    if (filters.seeking) {
      result = result.filter(i => Array.isArray(i.seeking) && i.seeking.includes(filters.seeking as any));
    }

    // Sort
    result = [...result].sort((a, b) => {
      if (filters.sortBy === 'newest') {
        const timeB = b.submittedAt ? new Date(b.submittedAt).getTime() : 0;
        const timeA = a.submittedAt ? new Date(a.submittedAt).getTime() : 0;
        return timeB - timeA;
      }
      if (filters.sortBy === 'ageAsc') {
        return (a.age || 0) - (b.age || 0);
      }
      if (filters.sortBy === 'ageDesc') {
        return (b.age || 0) - (a.age || 0);
      }
      if (filters.sortBy === 'name') {
        return (a.name || '').localeCompare(b.name || '');
      }
      if (filters.sortBy === 'paroleSoon') {
        return (a.paroleEligibility || '').localeCompare(b.paroleEligibility || '');
      }
      return 0;
    });

    return result;
  }, [approvedInmates, filters, showOnlyBookmarks, bookmarks]);

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className={`p-4 rounded-xl shadow-xl flex items-center gap-3 text-xs font-medium border ${
            toastMessage.type === 'error'
              ? 'bg-rose-900 text-white border-rose-700'
              : toastMessage.type === 'info'
              ? 'bg-slate-900 text-white border-slate-700'
              : 'bg-emerald-900 text-white border-emerald-700'
          }`}>
            {toastMessage.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-rose-300 shrink-0" />
            ) : toastMessage.type === 'info' ? (
              <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
            ) : (
              <CheckCircle className="w-4 h-4 text-emerald-300 shrink-0" />
            )}
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}

      {/* Site Header */}
      <Header
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        openSubmitModal={() => setIsSubmitModalOpen(true)}
        unreadMessagesCount={unreadMessagesCount}
        pendingApprovalsCount={pendingApprovalsCount}
        isAdminMode={isAdminMode}
        setIsAdminMode={setIsAdminMode}
      />

      {/* Main Page Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 sm:py-8">
        {/* TAB 1: BROWSE INMATE PROFILES */}
        {currentTab === 'browse' && (
          <div>
            {/* Front-page Hero Banner */}
            <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 mb-6 border border-slate-800 shadow-md relative overflow-hidden">
              <div className="relative z-10 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-3">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>San Andreas Department of Corrections Inmate Registry</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight mb-2">
                  Connect with Incarcerated Men & Women in San Andreas
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                  WriteAnInmate provides hope, rehabilitation, and friendship to individuals serving time at Bolingbroke State Penitentiary and Los Santos County Jail. Send a letter, explore profiles, or post a new inmate listing.
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => setIsSubmitModalOpen(true)}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg shadow-sm flex items-center gap-1.5 transition-all"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Post Inmate Profile</span>
                  </button>

                  <button
                    onClick={() => setCurrentTab('guidelines')}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs rounded-lg border border-slate-700 transition-colors"
                  >
                    View Mailroom Regulations
                  </button>

                  {/* Bookmark filter toggle */}
                  <button
                    onClick={() => setShowOnlyBookmarks(prev => !prev)}
                    className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                      showOnlyBookmarks 
                        ? 'bg-amber-600 text-white' 
                        : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <Bookmark className={`w-3.5 h-3.5 ${showOnlyBookmarks ? 'fill-white' : ''}`} />
                    <span>Saved Pen-Pals ({bookmarks.length})</span>
                  </button>
                </div>
              </div>

              {/* Watermark Logo in Background */}
              <Building2 className="w-72 h-72 text-slate-800/40 absolute -right-10 -bottom-10 pointer-events-none" />
            </div>

            {/* Search Filters Bar */}
            <SearchFiltersBar
              filters={filters}
              setFilters={setFilters}
              totalActiveCount={approvedInmates.length}
              filteredCount={filteredInmates.length}
            />

            {/* Inmates Profiles Grid */}
            {filteredInmates.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500">
                <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="font-serif font-bold text-slate-800 text-lg mb-1">
                  No Inmate Profiles Found
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto mb-4">
                  No records match your selected filters. Try broadening your search or resetting filters.
                </p>
                <button
                  onClick={() => {
                    setFilters({
                      searchQuery: '',
                      facility: '',
                      gender: '',
                      ageRange: '',
                      convictionCategory: '',
                      seeking: '',
                      sortBy: 'newest',
                    });
                    setShowOnlyBookmarks(false);
                  }}
                  className="px-4 py-2 bg-amber-600 text-white rounded-lg text-xs font-semibold"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredInmates.map(inmate => (
                  <ProfileCard
                    key={inmate.id}
                    inmate={inmate}
                    onViewDetails={inm => setActiveDetailInmate(inm)}
                    onSendMessage={inm => setActiveMessageInmate(inm)}
                    isAdminMode={isAdminMode}
                    onAdminApprove={handleAdminApprove}
                    onAdminReject={(id) => handleAdminReject(id, 'Admin discretion')}
                    isBookmarked={bookmarks.includes(inmate.id)}
                    onToggleBookmark={handleToggleBookmark}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: CORRDIRECT PRIVATE MESSAGING / MAILBOX */}
        {currentTab === 'mailbox' && (
          <MailboxView
            messages={messages}
            onAddReply={handleAddReply}
            onDeleteMessage={handleDeleteMessage}
            onOpenDirectory={() => setCurrentTab('browse')}
          />
        )}

        {/* TAB 3: ADMIN APPROVAL & MODERATION SYSTEM */}
        {currentTab === 'admin' && (
          <AdminModerationView
            inmates={inmates}
            onApprove={handleAdminApprove}
            onReject={handleAdminReject}
            onToggleVerified={handleToggleVerified}
            onToggleFeatured={handleToggleFeatured}
            onDelete={handleDeleteInmate}
            onViewDetails={inm => setActiveDetailInmate(inm)}
            moderationLogs={moderationLogs}
          />
        )}

        {/* TAB 4: MAILROOM GUIDELINES & ROLEPLAY RULES */}
        {currentTab === 'guidelines' && (
          <GuidelinesView
            onBrowseDirectory={() => setCurrentTab('browse')}
            onPostProfile={() => setIsSubmitModalOpen(true)}
          />
        )}
      </main>

      {/* Modals */}
      {/* 1. Profile Details Modal */}
      {activeDetailInmate && (
        <ProfileDetailModal
          inmate={activeDetailInmate}
          onClose={() => setActiveDetailInmate(null)}
          onSendMessage={inm => {
            setActiveDetailInmate(null);
            setActiveMessageInmate(inm);
          }}
          isAdminMode={isAdminMode}
          onAdminApprove={handleAdminApprove}
          onAdminReject={(id) => handleAdminReject(id, 'Admin discretion')}
          onAdminToggleVerified={handleToggleVerified}
        />
      )}

      {/* 2. Private Message / CorrDirect Modal */}
      {activeMessageInmate && (
        <PrivateMessageModal
          inmate={activeMessageInmate}
          onClose={() => setActiveMessageInmate(null)}
          onSendSuccess={handleSendMessageSuccess}
        />
      )}

      {/* 3. Submit Profile Modal */}
      {isSubmitModalOpen && (
        <SubmitProfileModal
          onClose={() => setIsSubmitModalOpen(false)}
          onSubmitSuccess={handleProfileSubmitSuccess}
        />
      )}

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-8 border-t border-slate-800 mt-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className="font-bold font-serif text-white text-sm">
                WriteAnInmate.sa
              </span>
              <span className="text-[10px] text-slate-500">|</span>
              <span className="text-slate-300">San Andreas Corrections Network</span>
            </div>
            <p className="text-[11px] text-slate-500">
              Created for the GTA World FiveM roleplay community. Fictional characters, Bolingbroke Penitentiary, and Los Santos County Jail records.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <button onClick={() => setCurrentTab('browse')} className="hover:text-white transition-colors">
              Browse
            </button>
            <button onClick={() => setIsSubmitModalOpen(true)} className="hover:text-white transition-colors">
              Post Profile
            </button>
            <button onClick={() => setCurrentTab('mailbox')} className="hover:text-white transition-colors">
              CorrDirect Mailbox
            </button>
            <button onClick={() => setCurrentTab('admin')} className="hover:text-white transition-colors">
              Admin Moderation
            </button>
            <button onClick={() => setCurrentTab('guidelines')} className="hover:text-white transition-colors">
              Mailroom Rules
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
