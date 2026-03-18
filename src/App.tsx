import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import Markdown from 'react-markdown';
import { 
  Code2, 
  Loader2, 
  Sparkles, 
  BookOpen, 
  Terminal,
  Cpu,
  Globe,
  Zap,
  Settings2,
  Copy,
  Check,
  Info,
  Languages,
  ChevronDown,
  Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';

// --- Custom Dropdown Component ---
interface DropdownOption {
  id: string;
  name: string;
  icon?: React.ReactNode;
}

interface CustomDropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (id: string) => void;
  icon: React.ReactNode;
  label?: string;
  className?: string;
}

function CustomDropdown({ options, value, onChange, icon, className, showSearch = false }: CustomDropdownProps & { showSearch?: boolean }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  const selectedOption = options.find(opt => opt.id === value) || options[0];

  const filteredOptions = options.filter(opt => 
    opt.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Reset search when closing
  React.useEffect(() => {
    if (!isOpen) setSearchQuery('');
  }, [isOpen]);

  return (
    <div className={cn("relative", className)} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2.5 px-4 py-2.5 rounded-xl transition-all duration-300 group border",
          isOpen 
            ? "bg-white border-emerald-200 shadow-lg shadow-emerald-100/50 text-emerald-700" 
            : "bg-white/50 border-transparent hover:bg-white hover:border-slate-200 text-slate-600 hover:text-slate-900"
        )}
      >
        <div className={cn(
          "transition-colors duration-300",
          isOpen ? "text-emerald-500" : "text-slate-400 group-hover:text-emerald-500"
        )}>
          {icon}
        </div>
        <span className="text-sm font-bold tracking-tight whitespace-nowrap">{selectedOption.name}</span>
        <ChevronDown className={cn(
          "w-4 h-4 text-slate-400 transition-transform duration-300", 
          isOpen && "rotate-180 text-emerald-500"
        )} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
            className="absolute top-full left-0 mt-2 min-w-[220px] bg-white/95 backdrop-blur-xl rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-200/60 p-2 z-[100] overflow-hidden"
          >
            {showSearch && (
              <div className="relative mb-2 px-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <input
                  autoFocus
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border-none rounded-lg py-2 pl-9 pr-3 text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                />
              </div>
            )}

            <div className="max-h-[280px] overflow-y-auto scrollbar-thin pr-1">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => {
                      onChange(option.id);
                      setIsOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 mb-0.5 last:mb-0",
                      value === option.id 
                        ? "bg-emerald-500 text-white shadow-md shadow-emerald-200" 
                        : "text-slate-600 hover:bg-slate-50 hover:text-emerald-600"
                    )}
                  >
                    {option.icon && (
                      <div className={cn(
                        "transition-colors",
                        value === option.id ? "text-white" : "text-slate-400"
                      )}>
                        {option.icon}
                      </div>
                    )}
                    {option.name}
                    {value === option.id && <Check className="w-4 h-4 ml-auto text-white" />}
                  </button>
                ))
              ) : (
                <div className="py-8 text-center text-slate-400 text-sm italic">
                  No results found
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Supported languages from PRD
const SUPPORTED_LANGUAGES = [
  { id: 'python', name: 'Python' },
  { id: 'javascript', name: 'JavaScript' },
  { id: 'typescript', name: 'TypeScript' },
  { id: 'java', name: 'Java' },
  { id: 'cpp', name: 'C++' },
  { id: 'c', name: 'C' },
  { id: 'csharp', name: 'C#' },
  { id: 'php', name: 'PHP' },
  { id: 'html', name: 'HTML' },
  { id: 'css', name: 'CSS' },
  { id: 'sql', name: 'SQL' },
  { id: 'dart', name: 'Dart' },
  { id: 'nodejs', name: 'Node.js' },
];

const DEFAULT_CODE = {
  javascript: `function findMax(arr) {
  let max = arr[0];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > max) {
      max = arr[i];
    }
  }
  return max;
}`,
  python: `def find_max(arr):
    max_val = arr[0]
    for x in arr[1:]:
        if x > max_val:
            max_val = x
    return max_val`,
  java: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello World");
    }
}`,
  nodejs: `const http = require('http');

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World\\n');
});

server.listen(3000, '127.0.0.1', () => {
  console.log('Server running at http://127.0.0.1:3000/');
});`,
};

export default function App() {
  const [language, setLanguage] = useState('javascript');
  const [targetLanguage, setTargetLanguage] = useState('English');
  const [task, setTask] = useState('explain');
  const [code, setCode] = useState(DEFAULT_CODE.javascript);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const TASK_OPTIONS = [
    { id: 'explain', name: 'Explain', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'debug', name: 'Debug', icon: <Zap className="w-4 h-4" /> },
    { id: 'refactor', name: 'Refactor', icon: <Cpu className="w-4 h-4" /> },
  ];

  const TARGET_LANG_OPTIONS = [
    { id: 'English', name: 'English', icon: <Globe className="w-4 h-4" /> },
    { id: 'Khmer', name: 'Khmer (ភាសាខ្មែរ)', icon: <Globe className="w-4 h-4" /> },
  ];
  
  const handleExplain = async () => {
    if (!code.trim()) return;
    
    setIsLoading(true);
    setError(null);
    setExplanation(null);

    try {
      const response = await fetch('/api/explain', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code, language, targetLanguage, task }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate explanation.");
      }

      if (data.text) {
        setExplanation(data.text);
      } else {
        throw new Error("No explanation returned from server.");
      }
    } catch (err: any) {
      console.error("API Error:", err);
      setError(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (explanation) {
      navigator.clipboard.writeText(explanation);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-slate-900 font-sans selection:bg-emerald-100">
      {/* Modern Header */}
      <header className="sticky top-0 z-50 glass border-b border-slate-200/60">
        <div className="max-w-[1600px] mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.div 
              whileHover={{ rotate: 5 }}
              className="w-11 h-11 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-200/50"
            >
              <Code2 className="text-white w-6 h-6" />
            </motion.div>
            <div className="hidden sm:block">
              <h1 className="font-bold text-xl tracking-tight text-slate-900">Code Clarity</h1>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-bold">Learning Assistant</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-1 p-1 bg-slate-100/80 rounded-2xl border border-slate-200/60">
              {/* Task Selector */}
              <CustomDropdown 
                options={TASK_OPTIONS}
                value={task}
                onChange={setTask}
                icon={<Zap className="w-4 h-4" />}
              />

              <div className="w-px h-4 bg-slate-200 mx-1" />

              {/* Language Selector */}
              <CustomDropdown 
                options={SUPPORTED_LANGUAGES}
                value={language}
                onChange={(id) => {
                  setLanguage(id);
                  if (DEFAULT_CODE[id as keyof typeof DEFAULT_CODE]) {
                    setCode(DEFAULT_CODE[id as keyof typeof DEFAULT_CODE]);
                  }
                }}
                icon={<Terminal className="w-4 h-4" />}
                showSearch={true}
              />

              <div className="w-px h-4 bg-slate-200 mx-1" />

              {/* Target Language Selector */}
              <CustomDropdown 
                options={TARGET_LANG_OPTIONS}
                value={targetLanguage}
                onChange={setTargetLanguage}
                icon={<Globe className="w-4 h-4" />}
              />
            </div>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleExplain}
              disabled={isLoading || !code.trim()}
              className={cn(
                "flex items-center gap-2.5 px-6 py-3 rounded-2xl font-bold transition-all duration-300",
                "bg-emerald-600 text-white hover:bg-emerald-700 shadow-xl shadow-emerald-200/40",
                "disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
              )}
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Sparkles className="w-5 h-5" />
              )}
              <span className="hidden sm:inline">
                {task === 'explain' ? 'Explain Code' : 
                 task === 'debug' ? 'Debug Code' : 
                 'Refactor Code'}
              </span>
            </motion.button>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-5rem)]">
        {/* Editor Section */}
        <section className="lg:col-span-7 flex flex-col gap-4">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-100 rounded-lg">
                <Terminal className="w-4 h-4 text-slate-600" />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Source Editor</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 bg-slate-100 rounded text-[10px] font-mono font-bold text-slate-500 uppercase">
                {language}
              </span>
            </div>
          </div>
          
          <div className="flex-1 rounded-3xl overflow-hidden border border-slate-200/60 bg-white neo-shadow group relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-50/50 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <Editor
              height="100%"
              language={language}
              value={code}
              onChange={(value) => setCode(value || '')}
              theme="vs-light"
              options={{
                minimap: { enabled: false },
                fontSize: 15,
                lineNumbers: 'on',
                roundedSelection: true,
                scrollBeyondLastLine: false,
                readOnly: false,
                automaticLayout: true,
                padding: { top: 24, bottom: 24 },
                fontFamily: "'JetBrains Mono', monospace",
                cursorStyle: 'block',
                cursorBlinking: 'smooth',
                lineHeight: 1.6,
              }}
            />
          </div>
        </section>

        {/* Insights Section */}
        <section className="lg:col-span-5 flex flex-col gap-4">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-50 rounded-lg">
                <BookOpen className="w-4 h-4 text-emerald-600" />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Assistant Insights</span>
            </div>
            {explanation && (
              <button 
                onClick={copyToClipboard}
                className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-emerald-600 hover:text-emerald-700 transition-colors"
              >
                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            )}
          </div>

          <div className="flex-1 rounded-3xl border border-slate-200/60 bg-white neo-shadow overflow-hidden flex flex-col relative">
            <div className="flex-1 overflow-y-auto p-8 scrollbar-thin">
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    className="h-full flex flex-col items-center justify-center text-center gap-6"
                  >
                    <div className="relative">
                      <div className="w-20 h-20 border-4 border-emerald-50 border-t-emerald-600 rounded-full animate-spin" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Sparkles className="text-emerald-600 w-8 h-8 animate-pulse" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-bold text-xl text-slate-800">Analyzing Logic...</h3>
                      <p className="text-slate-500 text-sm max-w-[240px]">Your AI Assistant is breaking down the code structure for you.</p>
                    </div>
                  </motion.div>
                ) : explanation ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="prose prose-slate max-w-none prose-headings:text-slate-900 prose-headings:font-bold prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-p:text-slate-600 prose-p:leading-relaxed prose-code:bg-slate-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:text-emerald-700 prose-code:font-mono prose-code:before:content-none prose-code:after:content-none prose-strong:text-slate-900"
                  >
                    <Markdown>{explanation}</Markdown>
                  </motion.div>
                ) : error ? (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="h-full flex flex-col items-center justify-center text-center p-8 gap-4"
                  >
                    <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center shadow-inner">
                      <Info className="w-8 h-8" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-bold text-red-600 text-lg">Analysis Interrupted</h3>
                      <p className="text-slate-500 text-sm max-w-xs leading-relaxed">{error}</p>
                    </div>
                    <button 
                      onClick={handleExplain}
                      className="mt-4 px-6 py-2 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-colors"
                    >
                      Try Again
                    </button>
                  </motion.div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="h-full flex flex-col items-center justify-center text-center p-8 gap-8"
                  >
                    <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
                      <div className="p-6 rounded-3xl bg-emerald-50/50 border border-emerald-100/50 flex flex-col items-center gap-3 group hover:bg-emerald-50 transition-colors">
                        <div className="p-3 bg-white rounded-2xl shadow-sm group-hover:scale-110 transition-transform">
                          <Zap className="w-6 h-6 text-emerald-600" />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-700">Instant Logic</span>
                      </div>
                      <div className="p-6 rounded-3xl bg-blue-50/50 border border-blue-100/50 flex flex-col items-center gap-3 group hover:bg-blue-50 transition-colors">
                        <div className="p-3 bg-white rounded-2xl shadow-sm group-hover:scale-110 transition-transform">
                          <Cpu className="w-6 h-6 text-blue-600" />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-blue-700">Deep Analysis</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <h3 className="font-bold text-2xl text-slate-900">Ready to Assist</h3>
                      <p className="text-slate-500 text-sm max-w-[280px] mx-auto leading-relaxed">
                        Paste your code snippet on the left and I'll explain it step-by-step in your preferred language.
                      </p>
                    </div>
                    <div className="flex flex-wrap justify-center gap-2 opacity-60">
                      {['Algorithms', 'Syntax', 'Debugging', 'Best Practices'].map(tag => (
                        <span key={tag} className="px-3 py-1 bg-slate-100 rounded-full text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Modern Footer Status */}
            <div className="px-8 py-5 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className={cn("w-2.5 h-2.5 rounded-full", explanation ? "bg-emerald-500" : "bg-slate-300")} />
                  {explanation && <div className="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-40" />}
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  {explanation ? "Analysis Complete" : "System Ready"}
                </span>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <Settings2 className="w-3 h-3" />
                <span>GEMINI ENGINE</span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
