"use client";

import { useState, useRef, useEffect } from 'react';
import { Drawer } from './ui/Drawer';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { Link, chatWithLink } from '../services/api';
import { Send, Loader2, User, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

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

  // Handle drawer close with refresh
  const handleClose = () => {
    onClose();
    
    // Small delay to ensure drawer animation completes, then refresh
    setTimeout(() => {
      // Force Twitter widgets to reload
      // @ts-ignore
      if (window.twttr && window.twttr.widgets) {
        // @ts-ignore
        window.twttr.widgets.load();
      }
      
      // Alternative: Full page refresh (more aggressive but guaranteed to work)
      // window.location.reload();
    }, 300); // Wait for drawer close animation
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
      const errorMessage: Message = { sender: 'ai', text: 'Sorry, I had trouble getting a response. Please try again.' };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Blurred Background Overlay with Light Black Tint */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
            }}
            onClick={handleClose} // Updated to use handleClose
          />
        )}
      </AnimatePresence>

      {/* Custom Drawer with enhanced styling */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed right-0 top-0 h-full w-full max-w-md z-50 bg-white shadow-2xl"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            {/* Drawer Header */}
            <div className="p-4 border-b border-gray-200 bg-white">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 truncate">
                  Chat with: {link.title}
                </h2>
                <button
                  onClick={handleClose} // Updated to use handleClose
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Chat Content */}
            <div className="flex flex-col h-full bg-slate-50" style={{ height: 'calc(100% - 73px)' }}>
              {/* Chat Messages */}
              <div className="flex-grow overflow-y-auto p-4 space-y-6">
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
                      {msg.sender === 'ai' && (
                        <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center flex-shrink-0">
                          <Bot className="w-5 h-5 text-sky-600" />
                        </div>
                      )}
                      <div className={`p-3 rounded-xl max-w-sm text-sm shadow-sm ${
                        msg.sender === 'user' 
                          ? 'bg-sky-600 text-white rounded-br-none' 
                          : 'bg-white text-slate-800 rounded-bl-none border'
                      }`}>
                        {msg.text}
                      </div>
                      {msg.sender === 'user' && (
                        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0">
                          <User className="w-5 h-5 text-slate-600" />
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                {/* Loading Animation */}
                {isLoading && (
                  <motion.div 
                    className="flex items-start gap-3"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-5 h-5 text-sky-600" />
                    </div>
                    <div className="p-3 rounded-xl bg-white shadow-sm flex items-center border">
                      <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce mr-1"></span>
                      <span style={{ animationDelay: '0.15s' }} className="w-2 h-2 bg-slate-400 rounded-full animate-bounce mr-1"></span>
                      <span style={{ animationDelay: '0.3s' }} className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Form */}
              <div className="p-4 border-t border-slate-200 bg-white">
                <form onSubmit={handleSubmit} className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Ask a question..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    disabled={isLoading}
                    className="flex-grow"
                    autoComplete='off'
                  />
                  <Button type="submit" disabled={isLoading || !prompt.trim()}>
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
