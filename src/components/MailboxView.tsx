import React, { useState } from 'react';
import { 
  Mail, 
  Send, 
  CheckCheck, 
  Clock, 
  Stamp, 
  Trash2, 
  AlertCircle, 
  Building2, 
  User, 
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  MessageSquare
} from 'lucide-react';
import { PrivateMessage } from '../types';

interface MailboxViewProps {
  messages: PrivateMessage[];
  onAddReply: (messageId: string, replyBody: string, fromInmate: boolean) => void;
  onDeleteMessage: (messageId: string) => void;
  onOpenDirectory: () => void;
}

export const MailboxView: React.FC<MailboxViewProps> = ({
  messages,
  onAddReply,
  onDeleteMessage,
  onOpenDirectory,
}) => {
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(
    messages.length > 0 ? messages[0].id : null
  );
  const [replyText, setReplyText] = useState('');
  const [isSimulatingInmate, setIsSimulatingInmate] = useState(false);

  const selectedMsg = messages.find(m => m.id === selectedMessageId) || (messages.length > 0 ? messages[0] : null);

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMsg || !replyText.trim()) return;

    onAddReply(selectedMsg.id, replyText.trim(), false);
    setReplyText('');
  };

  const handleTriggerInmateReply = () => {
    if (!selectedMsg) return;
    setIsSimulatingInmate(true);

    setTimeout(() => {
      const simulatedReplies = [
        `Thank you for writing back! Hearing from someone on the outside makes the 23-hour lockup bearable. The guards just brought today's commissary order and I was able to trade for extra stationery. Write me again when you have a free moment, I'll be waiting by the kiosk.`,
        `Salute! Read your message twice on the yard this afternoon. It really brightened my spirits. I'm keeping my head down, focusing on my appeals, and working out every morning at 06:00. Tell me more about what you've been up to out in Los Santos!`,
        `Much respect for keeping in touch. It takes a genuine soul to write someone doing time. If you ever have time to send a book or just tell me about the weather and music out there, you don't know how much that means behind these walls.`
      ];
      const randomText = simulatedReplies[Math.floor(Math.random() * simulatedReplies.length)];

      onAddReply(selectedMsg.id, randomText, true);
      setIsSimulatingInmate(false);
    }, 800);
  };

  return (
    <div id="mailbox-view-container" className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[600px]">
      {/* Mailbox Top Header */}
      <div className="bg-slate-900 text-white px-5 py-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold font-serif text-white">
              CorrDirect Inmate Messaging System
            </h2>
            <p className="text-xs text-slate-400">
              San Andreas Department of Corrections Authorized Inmate Correspondence Portal
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 font-mono">
            {messages.length} Correspondence Thread{messages.length === 1 ? '' : 's'}
          </span>
          <button
            onClick={onOpenDirectory}
            className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded font-medium transition-colors"
          >
            Find Inmates to Write
          </button>
        </div>
      </div>

      {messages.length === 0 ? (
        /* Empty Mailbox State */
        <div className="p-12 text-center flex-1 flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
            <Mail className="w-8 h-8" />
          </div>
          <h3 className="font-serif font-bold text-slate-800 text-lg mb-1">
            No Active Inmate Correspondence
          </h3>
          <p className="text-sm text-slate-500 max-w-md mb-5 leading-relaxed">
            You haven't dispatched any letters yet. Browse the Bolingbroke and Twin Towers directory to connect with an incarcerated individual.
          </p>
          <button
            onClick={onOpenDirectory}
            className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
          >
            Browse Inmate Directory
          </button>
        </div>
      ) : (
        /* Split View: Threads on Left, Active Message on Right */
        <div className="grid grid-cols-1 md:grid-cols-12 flex-1">
          {/* Threads Column (4 cols) */}
          <div className="md:col-span-4 border-r border-slate-200 bg-slate-50 overflow-y-auto max-h-[640px] divide-y divide-slate-200">
            {messages.map(msg => {
              const isSelected = selectedMsg?.id === msg.id;
              const hasReplies = msg.replies && msg.replies.length > 0;
              return (
                <div
                  key={msg.id}
                  id={`thread-item-${msg.id}`}
                  onClick={() => setSelectedMessageId(msg.id)}
                  className={`p-3.5 cursor-pointer transition-colors ${
                    isSelected ? 'bg-amber-50/80 border-l-4 border-l-amber-600' : 'hover:bg-slate-100/80'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-serif font-bold text-xs text-slate-900 truncate">
                      {msg.inmateName}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(msg.sentAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-slate-800 truncate mb-1">
                    {msg.subject}
                  </p>

                  <p className="text-[11px] text-slate-500 line-clamp-1">
                    {msg.body}
                  </p>

                  <div className="flex items-center justify-between gap-1 mt-2 text-[10px]">
                    <span className="text-amber-800 font-mono">
                      #{msg.inmateBooking}
                    </span>
                    <span className={`px-1.5 py-0.5 rounded font-medium ${
                      hasReplies ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {hasReplies ? `${msg.replies.length} Reply` : 'Dispatched'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Active Conversation Detail Pane (8 cols) */}
          <div className="md:col-span-8 flex flex-col justify-between max-h-[640px] overflow-y-auto p-5 sm:p-6 bg-white">
            {selectedMsg ? (
              <div className="space-y-5">
                {/* Conversation Header */}
                <div className="pb-4 border-b border-slate-200 flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="font-serif font-bold text-lg text-slate-900 leading-tight">
                      {selectedMsg.subject}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Correspondent: <strong className="text-slate-800">{selectedMsg.inmateName}</strong> ({selectedMsg.inmateBooking})
                    </p>
                    <p className="text-xs text-slate-400">
                      Sender Persona: {selectedMsg.senderName} • Return: {selectedMsg.senderHometown}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Roleplay Inmate Reply Button */}
                    <button
                      onClick={handleTriggerInmateReply}
                      disabled={isSimulatingInmate}
                      className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-medium border border-slate-300 flex items-center gap-1 transition-colors"
                      title="Roleplay tool: Generate an in-character response from this inmate"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      <span>{isSimulatingInmate ? 'Inmate Typing...' : 'Simulate Inmate Response'}</span>
                    </button>

                    <button
                      onClick={() => onDeleteMessage(selectedMsg.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded hover:bg-rose-50 transition-colors"
                      title="Delete thread"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Messages Stream */}
                <div className="space-y-4">
                  {/* Original Letter */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-slate-500 pb-2 border-b border-slate-200">
                      <span className="font-semibold text-slate-700">From: {selectedMsg.senderName}</span>
                      <span>{new Date(selectedMsg.sentAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</span>
                    </div>

                    <p className="text-slate-800 text-sm leading-relaxed whitespace-pre-line">
                      {selectedMsg.body}
                    </p>

                    <div className="pt-2 flex items-center justify-between text-[10px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <Stamp className="w-3 h-3 text-emerald-600" />
                        <span>SADCR CorrDirect Security Inspected</span>
                      </span>
                      {selectedMsg.isLegalMail && (
                        <span className="text-blue-700 font-bold">Privileged Legal Mail</span>
                      )}
                    </div>
                  </div>

                  {/* Replies (if any) */}
                  {selectedMsg.replies && selectedMsg.replies.map(reply => (
                    <div
                      key={reply.id}
                      className={`p-4 rounded-xl text-xs space-y-2 border ${
                        reply.fromInmate 
                          ? 'bg-amber-50/70 border-amber-200 ml-4 sm:ml-8'
                          : 'bg-slate-50 border-slate-200 mr-4 sm:mr-8'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px] pb-1.5 border-b border-slate-200/80">
                        <span className={`font-bold ${reply.fromInmate ? 'text-amber-900' : 'text-slate-800'}`}>
                          {reply.author}
                        </span>
                        <span className="text-slate-400">
                          {new Date(reply.sentAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                        </span>
                      </div>

                      <p className="text-slate-800 text-sm leading-relaxed whitespace-pre-line">
                        {reply.body}
                      </p>

                      {reply.fromInmate && (
                        <div className="text-[10px] text-amber-700 font-mono flex items-center gap-1">
                          <CheckCheck className="w-3 h-3" />
                          <span>Sent via Bolingbroke Inmate Kiosk 4B</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Follow-up Reply Input */}
                <form onSubmit={handleSendReply} className="pt-4 border-t border-slate-200">
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Write Follow-up Letter to {selectedMsg.inmateName}:
                  </label>
                  <div className="flex gap-2">
                    <textarea
                      rows={3}
                      value={replyText}
                      onChange={e => setReplyText(e.target.value)}
                      placeholder="Type your reply to this inmate..."
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 text-xs focus:bg-white focus:outline-none focus:border-amber-500"
                    />
                    <button
                      type="submit"
                      disabled={!replyText.trim()}
                      className="px-4 bg-amber-600 hover:bg-amber-500 disabled:opacity-40 text-white rounded-lg font-bold text-xs flex flex-col items-center justify-center shrink-0 shadow-sm transition-all"
                    >
                      <Send className="w-4 h-4 mb-0.5" />
                      <span>Send</span>
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="text-center text-slate-400 text-xs py-10">
                Select a message on the left to read correspondence.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
