import React from 'react';
import { 
  Shield, 
  Mail, 
  UserPlus, 
  Users, 
  HelpCircle, 
  CheckCircle2, 
  Lock, 
  Search,
  FileCheck
} from 'lucide-react';

interface HeaderProps {
  currentTab: 'browse' | 'mailbox' | 'admin' | 'guidelines';
  setCurrentTab: (tab: 'browse' | 'mailbox' | 'admin' | 'guidelines') => void;
  openSubmitModal: () => void;
  unreadMessagesCount: number;
  pendingApprovalsCount: number;
  isAdminMode: boolean;
  setIsAdminMode: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  openSubmitModal,
  unreadMessagesCount,
  pendingApprovalsCount,
  isAdminMode,
  setIsAdminMode,
}) => {
  return (
    <header id="site-header" className="bg-slate-900 text-slate-100 border-b border-slate-800 shadow-md sticky top-0 z-40">
      {/* Top Department Banner */}
      <div className="bg-slate-950 px-4 py-1.5 border-b border-slate-800/80 text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-slate-400">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-semibold text-slate-300">GTA World Roleplay</span>
            <span className="text-slate-600">|</span>
            <span>State of San Andreas Department of Corrections & Rehabilitation (SADCR) Inmate Correspondence Portal</span>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Admin Mode Toggle */}
            <div className="flex items-center gap-2 bg-slate-900 px-2.5 py-1 rounded border border-slate-700">
              <Shield className={`w-3.5 h-3.5 ${isAdminMode ? 'text-amber-400' : 'text-slate-400'}`} />
              <span className="text-slate-300 font-medium">Admin Mode:</span>
              <button
                id="toggle-admin-mode-btn"
                type="button"
                onClick={() => setIsAdminMode(prev => !prev)}
                className={`relative inline-flex h-4 w-8 items-center rounded-full transition-colors focus:outline-none ${
                  isAdminMode ? 'bg-amber-600' : 'bg-slate-700'
                }`}
                title="Toggle Administrative Moderation privileges"
              >
                <span
                  className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                    isAdminMode ? 'translate-x-4.5' : 'translate-x-0.5'
                  }`}
                />
              </button>
              {isAdminMode && (
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 bg-amber-950/80 px-1 rounded border border-amber-800/60">
                  Staff Access
                </span>
              )}
            </div>
            
            <div className="hidden sm:flex items-center gap-1.5 text-slate-400 text-[11px]">
              <Lock className="w-3 h-3 text-slate-500" />
              <span>Bolingbroke Penitentiary & Twin Towers Inmate Registry</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Logo & Branding */}
        <div 
          onClick={() => setCurrentTab('browse')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-11 h-11 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-inner group-hover:border-amber-400 transition-colors">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg sm:text-xl font-bold tracking-tight text-white font-serif">
                WriteAnInmate<span className="text-amber-400">.sa</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                GTAW Community
              </span>
            </div>
            <p className="text-xs text-slate-400">
              San Andreas Inmate Pen-Pal & Correctional Correspondence Network
            </p>
          </div>
        </div>

        {/* Action Controls & Navigation Tabs */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Browse Directory */}
          <button
            id="nav-tab-browse"
            onClick={() => setCurrentTab('browse')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              currentTab === 'browse'
                ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Browse Profiles</span>
          </button>

          {/* Post Profile Button */}
          <button
            id="nav-open-submit-modal-btn"
            onClick={openSubmitModal}
            className="flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            <span>Post Inmate Profile</span>
          </button>

          {/* Private Messages / Mailbox */}
          <button
            id="nav-tab-mailbox"
            onClick={() => setCurrentTab('mailbox')}
            className={`relative flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              currentTab === 'mailbox'
                ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>CorrDirect Mailbox</span>
            {unreadMessagesCount > 0 && (
              <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-rose-600 rounded-full">
                {unreadMessagesCount}
              </span>
            )}
          </button>

          {/* Admin Moderation Queue Tab */}
          <button
            id="nav-tab-admin"
            onClick={() => {
              setIsAdminMode(true);
              setCurrentTab('admin');
            }}
            className={`relative flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              currentTab === 'admin'
                ? 'bg-amber-600 text-white font-semibold shadow-sm'
                : isAdminMode 
                  ? 'text-amber-300 hover:text-amber-200 bg-amber-950/40 border border-amber-800/60'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <FileCheck className="w-4 h-4" />
            <span>Admin Approvals</span>
            {pendingApprovalsCount > 0 && (
              <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-amber-950 bg-amber-400 rounded-full animate-pulse">
                {pendingApprovalsCount}
              </span>
            )}
          </button>

          {/* Rules & Guidelines */}
          <button
            id="nav-tab-guidelines"
            onClick={() => setCurrentTab('guidelines')}
            className={`flex items-center gap-1.5 px-2.5 py-2 rounded-md text-sm font-medium transition-colors ${
              currentTab === 'guidelines'
                ? 'bg-slate-800 text-white font-semibold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
            title="Institutional Mailroom Rules & GTA World Roleplay Guidelines"
          >
            <HelpCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Mailroom Rules</span>
          </button>
        </div>
      </div>
    </header>
  );
};
