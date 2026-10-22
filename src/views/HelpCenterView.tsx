import React, { useState } from 'react';
import {
  HelpCircle,
  Search,
  BookOpen,
  MessageSquare,
  Plus,
  Send,
  CheckCircle2,
  Clock,
  ChevronDown,
  ChevronUp,
  X,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SupportTicket } from '../types';

export const HelpCenterView: React.FC = () => {
  const { tickets, createTicket, replyTicket, resolveTicket, currentUser, currentRole, showToast } =
    useApp();

  const [activeTab, setActiveTab] = useState<'faq' | 'tickets' | 'guides'>('faq');
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // New Ticket Modal
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [ticketForm, setTicketForm] = useState({
    subject: '',
    category: 'Academic' as SupportTicket['category'],
    priority: 'medium' as SupportTicket['priority'],
    message: '',
  });

  // Reply State
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(tickets[0] || null);
  const [replyText, setReplyText] = useState('');

  const faqs = [
    {
      q: 'Sidee arday cusub loogu diiwaangeliyaa Machadka Khadiija?',
      a: 'Gal qaybta "Ardayda" (Students) ee dhinaca bidix, ka dib riix batoonka "Diiwaangeli Arday Cusub". Buuxi magaca ardayga, taariikhda dhalashada, xogta waalidka iyo fasalka, ka dibna guji Keydi.',
    },
    {
      q: 'Sidee loo daabacaa Kaarka Aqoonsiga Ardayga (Student ID Card)?',
      a: 'Qaybta Ardayda ka dhex raadi ardayga, riix astaanta kaarka (CreditCard icon) ama fur xogtiisa buuxda oo dooro tab-ka "Kaarka Aqoonsiga (ID)". Waxaad arki doontaa kaarka oo diyaarsan, ka dibna ku dhufo "Daabac Kaarka".',
    },
    {
      q: 'Sidee loo qabtaa lacagaha fiiga loona soo saaraa Rasiid?',
      a: 'Tag qaybta "Biilasha & Bixinta Fiiga" (Fees), dooro biilka ardayga ee aan weli bixin, riix "Qaado Lacagta". Geli cadadka uu bixinayo iyo tixraaca EVC ama Bankiga, nidaamkuna si toos ah ayuu u soo saarayaa Rasiid rasmi ah.',
    },
    {
      q: 'Sidee loo soo dejiyaa xog-kaydiyaha MySQL ee loogu talagalay XAMPP?',
      a: 'Xagga sare ee shaashadda ku dhufo batoonka "MySQL Schema .sql" ama tag Habaynta -> Kaydinta & XAMPP MySQL. Faylka ku dhacaya kumbuyuutarkaaga waxaad toos uga shuban kartaa phpMyAdmin.',
    },
    {
      q: 'Haddii labo xiisadood isku dhacaan xilliga jadwalka maxaa dhacaya?',
      a: 'Nidaamka Machadka Khadiija wuxuu leeyahay hubiyaha isku dhaca (Conflict Detection). Haddii macallinku wakhtigaas fasal kale ku qorsheysan yahay, nidaamku wuu diidayaa wuxuuna ku siinayaa digniin cad.',
    },
  ];

  const filteredFaqs = faqs.filter(
    f =>
      f.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketForm.subject.trim() || !ticketForm.message.trim()) return;

    createTicket(
      {
        subject: ticketForm.subject,
        category: ticketForm.category,
        priority: ticketForm.priority,
        submittedBy: currentUser.name,
        userRole: currentRole,
      },
      ticketForm.message
    );

    setIsTicketModalOpen(false);
    setTicketForm({
      subject: '',
      category: 'Academic',
      priority: 'medium',
      message: '',
    });
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !replyText.trim()) return;

    replyTicket(selectedTicket.id, replyText);
    setReplyText('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Xarunta Caawinta & Tikidhada (Help Desk & Support)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Su’aalaha inta badan la isweydiiyo, hagaha nidaamka, iyo furista tikidhada cabashada
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsTicketModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#006B68] hover:bg-[#005754] rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            <span>Fur Tikid Cusub (New Ticket)</span>
          </button>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs font-semibold w-fit">
        <button
          onClick={() => setActiveTab('faq')}
          className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
            activeTab === 'faq' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Su’aalaha Badan (FAQs)
        </button>
        <button
          onClick={() => setActiveTab('tickets')}
          className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
            activeTab === 'tickets' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Tikidhada Taageerada ({tickets.length})
        </button>
        <button
          onClick={() => setActiveTab('guides')}
          className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
            activeTab === 'guides' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Hagaha Qoraalka ah (Guides)
        </button>
      </div>

      {/* FAQ TAB */}
      {activeTab === 'faq' && (
        <div className="space-y-4 max-w-3xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Raadi su'aal ama jawaab..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl shadow-2xs focus:outline-none focus:ring-1 focus:ring-[#006B68]"
            />
          </div>

          <div className="space-y-2.5">
            {filteredFaqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full p-4 text-left flex justify-between items-center text-xs font-bold text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="p-4 pt-0 text-xs text-slate-600 border-t border-slate-100 bg-slate-50/50 leading-relaxed">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TICKETS TAB */}
      {activeTab === 'tickets' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs grid grid-cols-1 md:grid-cols-3 overflow-hidden min-h-[500px]">
          {/* Ticket list */}
          <div className="border-r border-slate-200 divide-y divide-slate-100">
            {tickets.map(t => {
              const isSelected = selectedTicket?.id === t.id;
              return (
                <div
                  key={t.id}
                  onClick={() => setSelectedTicket(t)}
                  className={`p-4 cursor-pointer transition-colors ${
                    isSelected ? 'bg-teal-50/60 border-l-4 border-l-[#006B68]' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex justify-between items-center text-[10px] text-slate-400 mb-1">
                    <span className="font-mono font-bold text-[#006B68]">{t.ticketNo}</span>
                    <span>{t.createdAt}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 truncate">{t.subject}</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 truncate">{t.submittedBy}</p>
                  <div className="mt-2 flex justify-between items-center">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        t.status === 'resolved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : t.status === 'in_progress'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {t.status}
                    </span>
                    <span className="text-[10px] text-slate-400">{t.category}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Ticket conversation */}
          <div className="md:col-span-2 p-6 flex flex-col justify-between">
            {selectedTicket ? (
              <div className="space-y-4">
                <div className="pb-3 border-b border-slate-200 flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-mono text-[#006B68] bg-teal-50 px-2 py-0.5 rounded font-bold">
                      {selectedTicket.ticketNo}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-1">
                      {selectedTicket.subject}
                    </h3>
                    <p className="text-xs text-slate-500">
                      Gudbiyey: <strong>{selectedTicket.submittedBy}</strong> ({selectedTicket.userRole})
                    </p>
                  </div>
                  {selectedTicket.status !== 'resolved' && (
                    <button
                      onClick={() => resolveTicket(selectedTicket.id)}
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg cursor-pointer"
                    >
                      Xalli Tikidka (Resolve)
                    </button>
                  )}
                </div>

                {/* Conversation thread */}
                <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                  {selectedTicket.messages.map((m, i) => (
                    <div
                      key={m.id || i}
                      className={`p-3 rounded-xl text-xs ${
                        m.sender === currentUser.name
                          ? 'bg-teal-50 border border-teal-200 ml-6 text-teal-950'
                          : 'bg-slate-50 border border-slate-200 mr-6 text-slate-800'
                      }`}
                    >
                      <div className="flex justify-between items-center text-[10px] text-slate-400 mb-1">
                        <strong className="text-slate-800">{m.sender}</strong>
                        <span>{m.timestamp}</span>
                      </div>
                      <p className="leading-relaxed">{m.text}</p>
                    </div>
                  ))}
                </div>

                {/* Reply Input */}
                {selectedTicket.status !== 'resolved' && (
                  <form onSubmit={handleSendReply} className="pt-3 border-t border-slate-200 flex gap-2">
                    <input
                      type="text"
                      placeholder="Qor jawaabtaada..."
                      value={replyText}
                      onChange={e => setReplyText(e.target.value)}
                      className="flex-1 px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#006B68] text-white text-xs font-bold rounded-lg shadow-sm hover:bg-[#005754] cursor-pointer"
                    >
                      Jawaab
                    </button>
                  </form>
                )}
              </div>
            ) : (
              <div className="text-center text-slate-400 text-xs py-12">
                Dooro tikid si aad u eegto wada-hadalka
              </div>
            )}
          </div>
        </div>
      )}

      {/* GUIDES TAB */}
      {activeTab === 'guides' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-2">
            <h4 className="text-xs font-bold text-slate-900">
              1. Hagaha Maamulka Ardayda (Student Registration & Profiling)
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Arday walba wuxuu leeyahay lambar gaar ah sida <code>MKB-2026-001</code>. Bogga ardayga
              waxaad ka heli kartaa xogtiisa oo dhan oo ay ku jiraan waalidka, xaadiriska, buundooyinka,
              fiiga, iyo kaarka aqoonsiga oo diyaar u ah in la daabaco.
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-2">
            <h4 className="text-xs font-bold text-slate-900">
              2. Hagaha Xisaabinta Buundooyinka & Natiijooyinka
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Buundooyinka waxaa lagu xisaabiyaa hab boqolkiiba ah: A+ (95%+), A (90-94%), B+
              (85-89%), B (80-84%), C (70-79%), D (60-69%), F (&lt;60%). Natiijooyinka waxaa laga
              samayn karaa warqad shakhsi ah (Report Card) oo rasmi ah.
            </p>
          </div>
        </div>
      )}

      {/* NEW TICKET MODAL */}
      {isTicketModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200">
              <h3 className="text-sm font-bold text-slate-900">Fur Tikid Cusub oo Taageero ah</h3>
              <button
                onClick={() => setIsTicketModalOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTicketSubmit} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Cinwaanka Cabashada / Su’aasha
                </label>
                <input
                  type="text"
                  required
                  placeholder="Cinwaanka..."
                  value={ticketForm.subject}
                  onChange={e => setTicketForm({ ...ticketForm, subject: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Qeybta</label>
                  <select
                    value={ticketForm.category}
                    onChange={e =>
                      setTicketForm({
                        ...ticketForm,
                        category: e.target.value as SupportTicket['category'],
                      })
                    }
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                  >
                    <option value="Academic">Academic (Waxbarashada)</option>
                    <option value="Billing & Fees">Billing & Fees (Fiiga)</option>
                    <option value="Portal Access">Portal Access</option>
                    <option value="Attendance">Attendance</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Degdegga (Priority)
                  </label>
                  <select
                    value={ticketForm.priority}
                    onChange={e =>
                      setTicketForm({
                        ...ticketForm,
                        priority: e.target.value as SupportTicket['priority'],
                      })
                    }
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                  >
                    <option value="low">Hoose (Low)</option>
                    <option value="medium">Dhexdhexaad (Medium)</option>
                    <option value="high">Sare (High)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Sharaxaadda Buuxda
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Faahfaahi waxa aad u baahan tahay..."
                  value={ticketForm.message}
                  onChange={e => setTicketForm({ ...ticketForm, message: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsTicketModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-600"
                >
                  Ka noqo
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#006B68] text-white text-xs font-bold rounded-lg shadow-sm"
                >
                  Gudbi Tikidka
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
