import React from 'react';
import { 
  Building2, 
  Mail, 
  ShieldAlert, 
  HelpCircle, 
  CheckCircle2, 
  AlertTriangle,
  Stamp,
  Lock,
  ArrowRight
} from 'lucide-react';

interface GuidelinesViewProps {
  onBrowseDirectory: () => void;
  onPostProfile: () => void;
}

export const GuidelinesView: React.FC<GuidelinesViewProps> = ({
  onBrowseDirectory,
  onPostProfile,
}) => {
  return (
    <div id="guidelines-view" className="max-w-4xl mx-auto space-y-6">
      {/* Hero Header */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-md">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold font-serif text-white">
              Institutional Mailroom Rules & Roleplay Guidelines
            </h2>
            <p className="text-xs text-slate-400">
              San Andreas Department of Corrections and Rehabilitation (SADCR) • Bolingbroke State Penitentiary
            </p>
          </div>
        </div>
        <p className="text-sm text-slate-300 mt-3 leading-relaxed">
          Welcome to the official inmate correspondence directory for GTA World. Whether you are roleplaying an incarcerated character in Bolingbroke or looking to correspond from the outside, please review our operational regulations.
        </p>
      </div>

      {/* Grid of Rules & Regulations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
        {/* Physical Mail Guidelines */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-slate-900 font-bold font-serif text-sm border-b border-slate-100 pb-2">
            <Mail className="w-4 h-4 text-amber-600" />
            <span>Physical Postal Letters (U.S. / San Andreas Mail)</span>
          </div>

          <ul className="space-y-2 text-slate-600 leading-relaxed list-disc pl-4">
            <li>
              <strong>Mandatory Inmate ID:</strong> All envelopes must clearly bear the inmate's legal name and booking ID (e.g. <code>#SADCR-XXXXX</code>) along with the designated housing block.
            </li>
            <li>
              <strong>Paper & Ink Standards:</strong> Letters must be written on plain white or lined notepad paper using black or blue ballpoint ink. Gel pens, glitter pens, and marker inks will be rejected.
            </li>
            <li>
              <strong>Contraband Restrictions:</strong> No stickers, lipstick, perfume, cologne, musical greeting cards, paperclips, or staples are permitted.
            </li>
            <li>
              <strong>Photograph Limits:</strong> Inmates may receive up to five (5) 4x6 inch photographic prints per envelope. Polaroids and provocative imagery are strictly prohibited.
            </li>
          </ul>
        </div>

        {/* CorrDirect Electronic Kiosk Guidelines */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-slate-900 font-bold font-serif text-sm border-b border-slate-100 pb-2">
            <Stamp className="w-4 h-4 text-emerald-600" />
            <span>CorrDirect Electronic Messaging</span>
          </div>

          <ul className="space-y-2 text-slate-600 leading-relaxed list-disc pl-4">
            <li>
              <strong>Screening & Inspection:</strong> All electronic messages are routed through the SADCR security screening filter prior to appearing on recreation hall kiosks.
            </li>
            <li>
              <strong>Delivery Times:</strong> Standard messages are processed and delivered to the inmate's terminal account within 2 to 4 hours of submission.
            </li>
            <li>
              <strong>Prepaid Response Stamps:</strong> Senders may optionally attach a complimentary return voucher to allow the inmate to reply at no expense to their commissary.
            </li>
            <li>
              <strong>Privileged Legal Mail:</strong> Confidential correspondence from verified San Andreas Bar Association defense attorneys receives expedited handling.
            </li>
          </ul>
        </div>

        {/* Safety & Etiquette for Pen-Pals */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-slate-900 font-bold font-serif text-sm border-b border-slate-100 pb-2">
            <ShieldAlert className="w-4 h-4 text-rose-600" />
            <span>Safety Advice & Pen-Pal Etiquette</span>
          </div>

          <ul className="space-y-2 text-slate-600 leading-relaxed list-disc pl-4">
            <li>
              <strong>Keep Personal Data Safe:</strong> Never provide sensitive financial credentials, banking PINs, or home keys.
            </li>
            <li>
              <strong>Use Return P.O. Boxes:</strong> For in-character safety, consider using a P.O. Box or workplace address for physical return correspondence.
            </li>
            <li>
              <strong>No Unsolicited Money Transfers:</strong> Inmates on WriteAnInmate are seeking positive communication, friendship, and mentorship—not monetary solicitation.
            </li>
            <li>
              <strong>Honesty & Boundaries:</strong> Be clear from your very first letter about what type of relationship you are open to (friendship, casual pen-pal, legal assistance, romance).
            </li>
          </ul>
        </div>

        {/* GTA World Roleplay Immersion */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-slate-900 font-bold font-serif text-sm border-b border-slate-100 pb-2">
            <Lock className="w-4 h-4 text-blue-600" />
            <span>GTA World Roleplay Immersion</span>
          </div>

          <p className="text-slate-600 leading-relaxed">
            This directory operates as an in-character (IC) resource for the GTA World FiveM roleplay community. Inmates and correspondents are encouraged to incorporate actual server events, character court cases, Los Santos news from Weazel News, and faction stories.
          </p>

          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={onBrowseDirectory}
              className="w-full py-2 px-3 bg-amber-600 hover:bg-amber-500 text-white rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>Explore Inmate Profiles Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onPostProfile}
              className="w-full py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg font-medium text-xs transition-colors"
            >
              Post Inmate Profile for Moderation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
