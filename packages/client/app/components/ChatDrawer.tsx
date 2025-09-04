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
    <Drawer isOpen={isOpen} onClose={onClose} title={`Chat with: ${link.title}`}>
      <div className="flex flex-col h-full bg-slate-50">
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
                {msg.sender === 'ai' && <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center flex-shrink-0"><Bot className="w-5 h-5 text-sky-600" /></div>}
                <div className={`p-3 rounded-xl max-w-sm text-sm shadow-sm ${msg.sender === 'user' ? 'bg-sky-600 text-white rounded-br-none' : 'bg-white text-slate-800 rounded-bl-none'}`}>
                  {msg.text}
                </div>
                {msg.sender === 'user' && <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0"><User className="w-5 h-5 text-slate-600" /></div>}
              </motion.div>
            ))}
          </AnimatePresence>
          {isLoading && (
            <motion.div 
              className="flex items-start gap-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center flex-shrink-0"><Bot className="w-5 h-5 text-sky-600" /></div>
              <div className="p-3 rounded-xl bg-white shadow-sm flex items-center">
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
    </Drawer>
  );
}

