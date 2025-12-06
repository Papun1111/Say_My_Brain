"use client";

import { useState, useRef, useEffect } from 'react';
// We keep original imports
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { Link, chatWithLink } from '../services/api';
import { Send, Loader2, User, Bot, Terminal, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ChatDrawerProps {
  link: Link;
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  sender: 'user' | 'ai';
  text: string;
}

export default function ChatDrawer({ link, isOpen, onClose }: ChatDrawerProps) {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);
  
  // Clear messages when a new link is selected or drawer is opened
  useEffect(() => {
    if (isOpen) {
      setMessages([]);
    }
  }, [isOpen, link]);

  // Handle drawer close with refresh logic preserved
  const handleClose = () => {
    onClose();
    
    setTimeout(() => {
      // @ts-ignore
      if (window.twttr && window.twttr.widgets) {
        // @ts-ignore
        window.twttr.widgets.load();
      }
    }, 300);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;

    const userMessage: Message = { sender: 'user', text: prompt };
    setMessages(prev => [...prev, userMessage]);
    setPrompt('');
    setIsLoading(true);

    try {
      const response = await chatWithLink(link.id, prompt);
      const aiMessage: Message = { sender: 'ai', text: response.response };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: Message = { sender: 'ai', text: 'CONNECTION ERROR: UNABLE TO RETRIEVE DATA.' };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Backdrop - Darker and blurred for focus */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-40 cursor-pointer bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={handleClose}
          />
        )}
      </AnimatePresence>

      {/* Drawer Container */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed right-0 top-0 h-full w-full max-w-md z-50 bg-[#0a0a0a] shadow-[0_0_50px_rgba(0,0,0,0.8)] border-l border-white/10"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            {/* Header */}
            <div className="p-4 border-b border-white/10 bg-[#0f0f0f] flex items-center justify-between">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="p-2 bg-[#22c55e]/10 rounded-sm text-[#22c55e] border border-[#22c55e]/20">
                  <Terminal size={18} />
                </div>
                <div className="flex flex-col overflow-hidden">
                   <h2 className="text-sm font-black uppercase tracking-widest text-white truncate">
                     {link.title}
                   </h2>
                   <span className="text-[10px] font-mono text-[#22c55e]">SECURE CHANNEL ESTABLISHED</span>
                </div>
              </div>
              
              <button
                onClick={handleClose}
                className="p-2 hover:bg-white/5 rounded-sm transition-colors text-gray-500 hover:text-white group"
              >
                <X size={20} className="group-hover:rotate-90 transition-transform duration-300" />
              </button>
            </div>

            {/* Chat Area */}
            <div className="flex flex-col h-full bg-[#050505]" style={{ height: 'calc(100% - 73px)' }}>
              
              {/* Messages List */}
              <div className="flex-grow overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-black">
                
                {/* Initial System Message (Visual Flourish) */}
                <div className="flex justify-center my-4">
                  <span className="text-[10px] text-gray-600 font-mono border border-white/5 px-2 py-1 rounded-sm">
                    BEGIN ENCRYPTED TRANSMISSION
                  </span>
                </div>

                <AnimatePresence>
                  {messages.map((msg, index) => (
                    <motion.div
                      key={index}
                      className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.3 }}
                    >
                      {/* AI Avatar */}
                      {msg.sender === 'ai' && (
                        <div className="w-8 h-8 rounded-sm bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 mt-1">
                          <Bot className="w-4 h-4 text-[#22c55e]" />
                        </div>
                      )}
                      
                      {/* Message Bubble */}
                      <div className={`p-3 rounded-sm text-sm max-w-[85%] leading-relaxed ${
                        msg.sender === 'user' 
                          ? 'bg-[#22c55e] text-black font-semibold shadow-[0_0_15px_rgba(34,197,94,0.3)]' 
                          : 'bg-[#111] text-gray-300 border border-white/10 font-mono text-xs md:text-sm'
                      }`}>
                        {msg.text}
                      </div>

                      {/* User Avatar */}
                      {msg.sender === 'user' && (
                        <div className="w-8 h-8 rounded-sm bg-white/10 flex items-center justify-center flex-shrink-0 mt-1">
                          <User className="w-4 h-4 text-gray-400" />
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                {/* Loading State */}
                {isLoading && (
                  <motion.div 
                    className="flex items-start gap-3"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="w-8 h-8 rounded-sm bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-[#22c55e]" />
                    </div>
                    <div className="p-4 rounded-sm bg-[#111] border border-white/10 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-[#22c55e] rounded-full animate-pulse"></span>
                      <span style={{ animationDelay: '0.15s' }} className="w-1.5 h-1.5 bg-[#22c55e] rounded-full animate-pulse"></span>
                      <span style={{ animationDelay: '0.3s' }} className="w-1.5 h-1.5 bg-[#22c55e] rounded-full animate-pulse"></span>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-4 border-t border-white/10 bg-[#0f0f0f]">
                <form onSubmit={handleSubmit} className="flex gap-2 relative">
                  {/* Decorative corner */}
                  <div className="absolute -top-1 -left-1 w-2 h-2 border-t border-l border-[#22c55e] opacity-50"></div>

                  <Input
                    type="text"
                    placeholder="Enter command / query..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    disabled={isLoading}
                    className="flex-grow bg-[#050505] border-white/10 text-white placeholder:text-gray-600 font-mono text-sm focus:border-[#22c55e] focus:ring-0 rounded-sm h-12"
                    autoComplete='off'
                  />
                  <Button 
                    type="submit" 
                    disabled={isLoading || !prompt.trim()}
                    className="bg-[#22c55e] hover:bg-[#1ea750] text-black border-none rounded-sm w-12 h-12 flex items-center justify-center shadow-[0_0_10px_rgba(34,197,94,0.3)] hover:shadow-[0_0_20px_rgba(34,197,94,0.6)] transition-all duration-300 disabled:opacity-50 disabled:shadow-none"
                  >
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                  </Button>
                </form>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}