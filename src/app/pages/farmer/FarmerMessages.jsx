import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { MessageSquare, Send, UserPlus } from 'lucide-react';
import { toast } from 'sonner';
import EmptyState from '../../components/EmptyState';
import { apiRequest } from '../../lib/api';
import { formatDate } from '../../utils/formatters';

const FarmerMessages = () => {
  const [conversations, setConversations] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [contactSearch, setContactSearch] = useState('');

  const loadConversations = async () => {
    const data = await apiRequest('/messages');
    setConversations(data.conversations);
    if (!activeConversation && data.conversations[0]) {
      setActiveConversation(data.conversations[0]);
    }
  };

  const loadContacts = async () => {
    const data = await apiRequest('/messages/directory');
    setContacts(data.users);
  };

  const loadMessages = async (conversationId) => {
    const data = await apiRequest(`/messages/${conversationId}`);
    setMessages(data.messages);
  };

  useEffect(() => {
    loadConversations().catch(() => setConversations([]));
    loadContacts().catch(() => setContacts([]));
  }, []);

  useEffect(() => {
    if (activeConversation?.id) {
      loadMessages(activeConversation.id).catch(() => setMessages([]));
    }
  }, [activeConversation]);

  const sendMessage = async () => {
    if (!messageText.trim() || !activeConversation) return;
    try {
      await apiRequest(`/messages/${activeConversation.id}`, {
        method: 'POST',
        body: JSON.stringify({ body: messageText })
      });
      setMessageText('');
      loadMessages(activeConversation.id);
      loadConversations();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const startConversation = async (userId) => {
    try {
      const data = await apiRequest('/messages/start', {
        method: 'POST',
        body: JSON.stringify({ participantId: userId, message: '' })
      });
      await loadConversations();
      const selected = conversations.find((item) => item.id === data.conversationId) || { id: data.conversationId };
      setActiveConversation(selected);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const filteredContacts = useMemo(
    () => contacts.filter((contact) => `${contact.name} ${contact.role} ${contact.business_name || ''}`.toLowerCase().includes(contactSearch.toLowerCase())),
    [contacts, contactSearch]
  );

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Messages</h1>
        <p className="text-gray-600 mb-8">Communicate with admin, farmers, buyers, and support inside the application.</p>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Conversations</h2>
            {conversations.length === 0 ? <EmptyState icon={MessageSquare} title="No Messages" description="Your conversations will appear here" /> : (
              <div className="space-y-3">
                {conversations.map((conversation) => (
                  <button key={conversation.id} onClick={() => setActiveConversation(conversation)} className={`w-full text-left p-4 rounded-xl border ${activeConversation?.id === conversation.id ? 'border-green-600 bg-green-50' : 'border-gray-200'}`}>
                    <p className="font-semibold text-gray-900">{conversation.partner_business_name || conversation.partner_name}</p>
                    <p className="text-sm text-gray-500 capitalize">{conversation.partner_role}</p>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <UserPlus className="w-5 h-5 text-green-700" />
              <h2 className="text-lg font-bold text-gray-900">Contacts</h2>
            </div>
            <input value={contactSearch} onChange={(e) => setContactSearch(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-300 mb-4" placeholder="Search contacts..." />
            <div className="space-y-3 max-h-[480px] overflow-y-auto">
              {filteredContacts.map((contact) => (
                <button key={contact.id} onClick={() => startConversation(contact.id)} className="w-full text-left p-4 rounded-xl border border-gray-200 hover:border-green-600 hover:bg-green-50">
                  <p className="font-semibold text-gray-900">{contact.business_name || contact.name}</p>
                  <p className="text-sm text-gray-500 capitalize">{contact.role}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-lg p-6">
            {!activeConversation ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Select a conversation or contact to start messaging</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col h-[560px]">
                <div className="pb-4 border-b border-gray-200">
                  <h3 className="font-bold text-gray-900">{activeConversation.partner_business_name || activeConversation.partner_name || 'Conversation'}</h3>
                </div>
                <div className="flex-1 overflow-y-auto py-4 space-y-4">
                  {messages.map((message) => (
                    <div key={message.id} className={`max-w-[75%] p-3 rounded-2xl ${message.sender_role === 'farmer' ? 'ml-auto bg-green-600 text-white' : 'bg-gray-100 text-gray-900'}`}>
                      <p>{message.body}</p>
                      <p className={`text-xs mt-2 ${message.sender_role === 'farmer' ? 'text-green-100' : 'text-gray-500'}`}>{formatDate(message.created_at)}</p>
                    </div>
                  ))}
                </div>
                <div className="pt-4 border-t border-gray-200 flex gap-3">
                  <input value={messageText} onChange={(e) => setMessageText(e.target.value)} className="flex-1 px-4 py-3 rounded-xl border border-gray-300" placeholder="Type your message..." />
                  <button onClick={sendMessage} className="px-5 py-3 bg-green-600 text-white rounded-xl inline-flex items-center gap-2">
                    <Send className="w-4 h-4" />
                    Send
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default FarmerMessages;
