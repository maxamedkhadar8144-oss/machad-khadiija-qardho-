import React, { useState } from 'react';
import {
  MessageSquare,
  Plus,
  Send,
  Inbox,
  AlertCircle,
  Bell,
  CheckCircle2,
  X,
  Search,
  User,
  Users,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { InternalMessage, UserRole } from '../types';

export const MessagesView: React.FC = () => {
  const { messages, sendMessage, markMessageRead, currentUser, currentRole, hasPermission } =
    useApp();

  const [activeTab, setActiveTab] = useState<'inbox' | 'sent' | 'announcements'>('inbox');
  const [selectedMessage, setSelectedMessage] = useState<InternalMessage | null>(
    messages[0] || null
  );
  const [isComposeOpen, setIsComposeOpen] = useState(false);

  // Form State
  const [composeForm, setComposeForm] = useState({
    title: '',
    content: '',
    recipientGroup: 'All' as InternalMessage['recipientGroup'],
    priority: 'normal' as InternalMessage['priority'],
    isAnnouncement: true,
  });

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!composeForm.title.trim() || !composeForm.content.trim()) return;

    sendMessage({
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRole: currentRole,
      recipientGroup: composeForm.recipientGroup,
      title: composeForm.title,
      content: composeForm.content,
      isAnnouncement: composeForm.isAnnouncement,
      priority: composeForm.priority,
    });

    setIsComposeOpen(false);
    setComposeForm({
      title: '',
      content: '',
      recipientGroup: 'All',
      priority: 'normal',
      isAnnouncement: true,
    });
  };

  const filteredMessages = messages.filter(m => {
    if (activeTab === 'inbox') return true;
    if (activeTab === 'sent') return m.senderId === currentUser.id;
    if (activeTab === 'announcements') return m.isAnnouncement;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Xarunta Farriimaha & Ogeysiisyada (Messaging)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Xiriirka gudaha machadka, ogeysiisyada maamulka, iyo xusuusinta ardayda & waalidiinta
          </p>
        </div>

        {hasPermission('messages', 'create') && (
          <button
            onClick={() => setIsComposeOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#006B68] hover:bg-[#005754] rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            <span>Qor Farriin / Ogeysiis Cusub</span>
          </button>
        )}
      </div>

      {/* Main Mailbox Interface */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden grid grid-cols-1 md:grid-cols-3 min-h-[500px]">
        {/* Left Column: Folders & Message List */}
        <div className="border-r border-slate-200 flex flex-col">
          {/* Folders Tab Strip */}
          <div className="p-3 border-b border-slate-200 flex items-center gap-1 bg-slate-50/60 text-xs">
            <button
              onClick={() => setActiveTab('inbox')}
              className={`flex-1 py-1.5 px-2 rounded-lg font-semibold transition-colors cursor-pointer ${
                activeTab === 'inbox'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Sanduuqa ({messages.length})
            </button>
            <button
              onClick={() => setActiveTab('announcements')}
              className={`flex-1 py-1.5 px-2 rounded-lg font-semibold transition-colors cursor-pointer ${
                activeTab === 'announcements'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Ogeysiis
            </button>
            <button
              onClick={() => setActiveTab('sent')}
              className={`flex-1 py-1.5 px-2 rounded-lg font-semibold transition-colors cursor-pointer ${
                activeTab === 'sent'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              La Diray
            </button>
          </div>

          {/* Messages List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {filteredMessages.map(msg => {
              const isSelected = selectedMessage?.id === msg.id;
              return (
                <div
                  key={msg.id}
                  onClick={() => {
                    setSelectedMessage(msg);
                    if (!msg.isRead) markMessageRead(msg.id);
                  }}
                  className={`p-4 cursor-pointer transition-colors ${
                    isSelected ? 'bg-teal-50/60 border-l-4 border-l-[#006B68]' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="font-bold text-slate-800">{msg.senderName}</span>
                    <span className="text-slate-400 font-mono text-[10px]">{msg.createdAt}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 truncate">{msg.title}</h4>
                  <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">{msg.content}</p>

                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-[10px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                      Loo diray: {msg.recipientGroup}
                    </span>
                    {msg.priority === 'urgent' && (
                      <span className="text-[10px] font-bold text-red-600">Degdeg (Urgent)</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Message Reader */}
        <div className="md:col-span-2 p-6 flex flex-col justify-between">
          {selectedMessage ? (
            <div className="space-y-4">
              <div className="pb-4 border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-[#006B68] bg-teal-50 px-2.5 py-1 rounded">
                    Loo diray: {selectedMessage.recipientGroup}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    {selectedMessage.createdAt}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mt-2">{selectedMessage.title}</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Ka timid:{' '}
                  <strong className="text-slate-800">{selectedMessage.senderName}</strong> (
                  {selectedMessage.senderRole})
                </p>
              </div>

              <div className="text-xs text-slate-800 leading-relaxed whitespace-pre-wrap py-2">
                {selectedMessage.content}
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-400 text-xs">
              Dooro farriin si aad u akhrisato
            </div>
          )}

          {selectedMessage && (
            <div className="pt-4 border-t border-slate-100 text-xs text-slate-400">
              Machadka Khadiija Bintu Khuwaylid – Xafiiska Xiriirka
            </div>
          )}
        </div>
      </div>

      {/* COMPOSE MODAL */}
      {isComposeOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200">
              <h3 className="text-sm font-bold text-slate-900">Qor Farriin / Ogeysiis Cusub</h3>
              <button
                onClick={() => setIsComposeOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSendMessage} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Cidda Loo Dirayo (Audience)
                </label>
                <select
                  value={composeForm.recipientGroup}
                  onChange={e =>
                    setComposeForm({
                      ...composeForm,
                      recipientGroup: e.target.value as InternalMessage['recipientGroup'],
                    })
                  }
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                >
                  <option value="All">Dhammaan (Dugsiga Oo Dhan)</option>
                  <option value="Teachers">Macallimiinta Kaliya</option>
                  <option value="Parents">Waalidiinta Kaliya</option>
                  <option value="Students">Ardayda Kaliya</option>
                  <option value="Staff">Shaqaalaha Xafiisyada</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Cinwaanka Farriinta
                </label>
                <input
                  type="text"
                  required
                  placeholder="Cinwaanka ogeysiiska..."
                  value={composeForm.title}
                  onChange={e => setComposeForm({ ...composeForm, title: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Qoraalka Farriinta
                </label>
                <textarea
                  rows={5}
                  required
                  placeholder="Qor faahfaahinta farriinta ama ogeysiiska..."
                  value={composeForm.content}
                  onChange={e => setComposeForm({ ...composeForm, content: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Muhiimadda (Priority)
                  </label>
                  <select
                    value={composeForm.priority}
                    onChange={e =>
                      setComposeForm({
                        ...composeForm,
                        priority: e.target.value as InternalMessage['priority'],
                      })
                    }
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                  >
                    <option value="normal">Caadi (Normal)</option>
                    <option value="high">Sare (High)</option>
                    <option value="urgent">Degdeg ah (Urgent)</option>
                  </select>
                </div>
                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={composeForm.isAnnouncement}
                      onChange={e =>
                        setComposeForm({ ...composeForm, isAnnouncement: e.target.checked })
                      }
                      className="rounded text-[#006B68]"
                    />
                    <span>Ogeysiis Guud (Announcement)</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsComposeOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-600"
                >
                  Ka noqo
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#006B68] text-white text-xs font-bold rounded-lg shadow-sm"
                >
                  Dir Farriinta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
