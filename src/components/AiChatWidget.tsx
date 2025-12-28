import { useState, useEffect, useRef } from 'react';
import { Bot, Send, X, Loader2, Code2, Check, Copy, Terminal } from 'lucide-react';
import clsx from 'clsx';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface AiChatWidgetProps {
  code: string;
  error: string | null;
  schema: any[];
  activeChallenge: any;
  onReplaceCode: (newCode: string) => void;
}

export function AiChatWidget({ code, error, schema, activeChallenge, onReplaceCode }: AiChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() && messages.length > 0) return;

    const groqKey = localStorage.getItem('groq_api_key');
    if (!groqKey) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Please configure your Groq API Key in Settings first." }]);
      return;
    }

    const userMessage = input.trim() || "Analyze my current query and error.";
    const newMessages: Message[] = [...messages, { role: 'user', content: userMessage }];
    
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai-tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: 'groq',
          apiKey: groqKey,
          query: code,
          error: error,
          schema,
          context: activeChallenge,
          messages: newMessages
        })
      });

      if (!res.ok) throw new Error(await res.text());
      
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.text }]);
      
      // Increment hit count
      const currentCount = parseInt(localStorage.getItem('groq_hit_count') || '0', 10);
      localStorage.setItem('groq_hit_count', (currentCount + 1).toString());

    } catch (err: any) {
      setMessages(prev => [...prev, { role: 'assistant', content: `Error: ${err.message}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial greeting
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{ role: 'assistant', content: "Hi! I'm your SQL Assistant. I can help you debug queries or write new ones. How can I help?" }]);
    }
  }, [isOpen]);

  const renderMessageContent = (content: string) => {
    const parts = content.split(/(```sql[\s\S]*?```)/g);
    
    return parts.map((part, index) => {
      if (part.startsWith('```sql')) {
        const codeBlock = part.replace(/```sql\n?|```/g, '').trim();
        return (
          <div key={index} className="my-3 rounded-md overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
            <div className="flex items-center justify-between px-3 py-1.5 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
              <span className="text-xs font-medium text-slate-500">SQL</span>
              <div className="flex gap-2">
                <button 
                  onClick={() => navigator.clipboard.writeText(codeBlock)}
                  className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-500"
                  title="Copy"
                >
                  <Copy size={12} />
                </button>
                <button 
                  onClick={() => onReplaceCode(codeBlock)}
                  className="flex items-center gap-1 px-2 py-0.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs rounded transition-colors"
                  title="Replace Editor Content"
                >
                  <Terminal size={12} /> Apply
                </button>
              </div>
            </div>
            <pre className="p-3 text-xs font-mono overflow-x-auto text-slate-800 dark:text-slate-200">
              {codeBlock}
            </pre>
          </div>
        );
      }
      return <p key={index} className="whitespace-pre-wrap mb-2 last:mb-0">{part}</p>;
    });
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={clsx(
          "fixed bottom-6 right-6 p-4 rounded-full shadow-xl transition-all z-50 flex items-center justify-center group",
          isOpen ? "bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-300" : "bg-purple-600 text-white hover:bg-purple-700 hover:scale-105"
        )}
        title={isOpen ? "Close Chat" : "Open AI Assistant"}
      >
        {isOpen ? <X size={24} /> : <Bot size={24} />}
      </button>

      {/* Chat Window */}
      <div className={clsx(
        "fixed bottom-24 right-6 w-96 max-w-[calc(100vw-3rem)] h-[500px] max-h-[calc(100vh-8rem)] bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden transition-all duration-300 z-40 origin-bottom-right",
        isOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-4 pointer-events-none"
      )}>
        {/* Header */}
        <div className="p-4 bg-purple-600 text-white flex items-center gap-2 shrink-0">
          <Bot size={20} />
          <h3 className="font-bold">AI Assistant</h3>
          <div className="ml-auto text-xs bg-purple-700 px-2 py-0.5 rounded-full">
            Groq
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-950/50">
          {messages.map((msg, i) => (
            <div key={i} className={clsx("flex", msg.role === 'user' ? "justify-end" : "justify-start")}>
              <div className={clsx(
                "max-w-[85%] rounded-lg p-3 text-sm shadow-sm",
                msg.role === 'user' 
                  ? "bg-purple-600 text-white rounded-br-none" 
                  : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-bl-none"
              )}>
                {renderMessageContent(msg.content)}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white dark:bg-slate-800 p-3 rounded-lg rounded-bl-none border border-slate-200 dark:border-slate-700 shadow-sm">
                <Loader2 size={16} className="animate-spin text-purple-600" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shrink-0">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask a question or request code..."
              className="flex-1 px-3 py-2 bg-slate-100 dark:bg-slate-800 border-transparent focus:bg-white dark:focus:bg-slate-950 border focus:border-purple-500 rounded-md text-sm outline-none transition-all"
            />
            <button
              onClick={handleSend}
              disabled={isLoading || (!input.trim() && messages.length === 0)}
              className="p-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
