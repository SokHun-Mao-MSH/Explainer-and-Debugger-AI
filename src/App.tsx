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
          "w-full flex items-center gap-2.5 px-4 py-2 rounded-xl transition-all duration-200 group border text-left outline-none focus:ring-2 focus:ring-emerald-500/20",
          isOpen 
            ? "bg-white border-emerald-100 shadow-lg shadow-emerald-100/20 text-emerald-700" 
            : "bg-slate-50/50 border-transparent hover:bg-white hover:border-slate-200 hover:shadow-sm text-slate-600 hover:text-slate-900"
        )}
      >
        <div className={cn(
          "transition-colors duration-300",
          isOpen ? "text-emerald-500" : "text-slate-400 group-hover:text-emerald-500"
        )}>
          {icon}
        </div>
        <span className="text-sm font-bold tracking-tight whitespace-nowrap flex-1">{selectedOption.name}</span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
          <Settings2 className="w-4 h-4 text-slate-400" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
            className="absolute top-full left-0 right-0 mt-2 min-w-[220px] bg-white/95 backdrop-blur-xl rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-200/60 p-2 z-[100] overflow-hidden"
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

// --- Custom Markdown Renderer for Code Blocks ---
function MarkdownCodeBlock({ node, inline, className, children, ...props }: any) {
  const match = /language-(\w+)/.exec(className || '');
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    const codeString = String(children).replace(/\n$/, '');
    navigator.clipboard.writeText(codeString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return !inline && match ? (
    <div className="my-6 rounded-2xl overflow-hidden bg-[#0d1117] border border-slate-200/20 shadow-lg">
      <div className="flex justify-between items-center px-4 py-2 bg-slate-800/50 text-xs text-slate-400 font-mono">
        <span className="capitalize">{match[1]}</span>
        <button 
          onClick={handleCopy} 
          className="flex items-center gap-1.5 hover:text-white transition-colors"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <div className="p-4 text-sm overflow-x-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800/0">
        <pre {...props} style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
          {children}
        </pre>
      </div>
    </div>
  ) : (
    <code className="bg-emerald-50 text-emerald-800 font-mono px-1.5 py-1 rounded-md text-[0.9em] before:content-none after:content-none" {...props}>
      {children}
    </code>
  );
}

// Supported languages from PRD
const SUPPORTED_LANGUAGES = [
  { id: 'python', name: 'Python' },
  { id: 'javascript', name: 'JavaScript' },
  { id: 'typescript', name: 'TypeScript' },
  { id: 'java', name: 'Java' },
  { id: 'kotlin', name: 'Kotlin' },
  { id: 'cpp', name: 'C++' },
  { id: 'c', name: 'C' },
  { id: 'csharp', name: 'C#' },
  { id: 'php', name: 'PHP' },
  { id: 'laravel', name: 'Laravel' },
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
  kotlin: `fun main() {
    val message = "Hello from Kotlin!"
    println(message)

    val items = listOf("Apple", "Banana", "Cherry")
    for (item in items) {
        println("Item: $item")
    }
}`,
  laravel: `<?php

namespace App\\Http\\Controllers;

use Illuminate\\Http\\Request;
use Illuminate\\Support\\Facades\\Route;

class UserController extends Controller
{
    public function index()
    {
        return response()->json([
            'message' => 'Hello from Laravel!',
            'status' => 'success'
        ]);
    }
}`,
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
  const [activeTab, setActiveTab] = useState<'editor' | 'insights'>('editor');

  // Configuration for task-specific button styling
  const taskConfig = {
    explain: {
      label: 'Explain Code',
      icon: Sparkles,
      style: "bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 shadow-lg shadow-emerald-500/20 border-b-[3px] border-emerald-700/20 active:border-b-0 active:translate-y-[3px]"
    },
    debug: {
      label: 'Fix Bugs',
      icon: Zap,
      style: "bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-400 hover:to-rose-500 shadow-lg shadow-rose-500/20 border-b-[3px] border-rose-700/20 active:border-b-0 active:translate-y-[3px]"
    },
    refactor: {
      label: 'Optimize Code',
      icon: Cpu,
      style: "bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-400 hover:to-violet-500 shadow-lg shadow-violet-500/20 border-b-[3px] border-violet-700/20 active:border-b-0 active:translate-y-[3px]"
    }
  };

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
    setExplanation(""); // Start empty for streaming
    setActiveTab('insights');

    try {
      const response = await fetch('/api/explain', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code, language, targetLanguage, task }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to generate explanation.");
      }

      if (!response.body) throw new Error("No response body");

      // Handle Streaming Response
      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const text = decoder.decode(value, { stream: true });
        setExplanation((prev) => (prev || "") + text);
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

  const activeTaskConfig = taskConfig[task as keyof typeof taskConfig] || taskConfig.explain;

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-slate-900 font-sans selection:bg-emerald-100">
      {/* Modern Header */}
      <header className="sticky top-0 z-50 glass border-b border-slate-200/60">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.div 
              whileHover={{ rotate: 5 }}
              className="w-11 h-11 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-200/50"
            >
              <Code2 className="text-white w-6 h-6" />
            </motion.div>
            <div>
              <h1 className="font-bold text-lg sm:text-xl tracking-tight text-slate-900">Code Clarity</h1>
              <div className="hidden sm:flex items-center gap-1.5">
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
                icon={<Languages className="w-4 h-4" />}
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
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleExplain}
              disabled={isLoading || !code.trim()}
              className={cn(
                "flex items-center gap-2.5 px-6 py-3 rounded-xl font-bold transition-all duration-200 group text-white",
                activeTaskConfig.style,
                "disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
              )}
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <activeTaskConfig.icon className="w-5 h-5 drop-shadow-md" />
              )}
              <span className="hidden sm:inline tracking-wide text-sm">
                {activeTaskConfig.label}
              </span>
            </motion.button>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 h-auto lg:h-[calc(100vh-5rem)]">
        {/* Mobile Tab Navigation */}
        <div className="lg:hidden col-span-1">
          <div className="flex p-1 bg-slate-100/80 backdrop-blur rounded-xl border border-slate-200/60 shadow-sm">
            <button
              onClick={() => setActiveTab('editor')}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold transition-all duration-200",
                activeTab === 'editor' ? "bg-white text-emerald-700 shadow-sm" : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
              )}
            >
              <Code2 className="w-4 h-4" />
              Editor
            </button>
            <button
              onClick={() => setActiveTab('insights')}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold transition-all duration-200",
                activeTab === 'insights' ? "bg-white text-emerald-700 shadow-sm" : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
              )}
            >
              <Sparkles className="w-4 h-4" />
              Insights
            </button>
          </div>
        </div>

        {/* Mobile Controls (Visible on Tablet/Mobile) */}
        <div className={cn("lg:hidden col-span-1 grid grid-cols-1 sm:grid-cols-3 gap-3", activeTab === 'editor' ? 'grid' : 'hidden')}>
          <CustomDropdown 
            options={TASK_OPTIONS}
            value={task}
            onChange={setTask}
            icon={<Zap className="w-4 h-4" />}
          />
          <CustomDropdown 
            options={SUPPORTED_LANGUAGES}
            value={language}
            onChange={(id) => {
              setLanguage(id);
              if (DEFAULT_CODE[id as keyof typeof DEFAULT_CODE]) {
                setCode(DEFAULT_CODE[id as keyof typeof DEFAULT_CODE]);
              }
            }}
            icon={<Languages className="w-4 h-4" />}
            showSearch={true}
          />
          <CustomDropdown 
            options={TARGET_LANG_OPTIONS}
            value={targetLanguage}
            onChange={setTargetLanguage}
            icon={<Globe className="w-4 h-4" />}
          />
        </div>

        {/* Editor Section */}
        <section className={cn(
          "lg:col-span-7 flex flex-col gap-4 transition-all duration-300",
          activeTab === 'editor' ? "flex h-[calc(100vh-20rem)] lg:h-auto" : "hidden lg:flex lg:h-auto"
        )}>
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-100 rounded-lg">
                <Code2 className="w-4 h-4 text-slate-600" />
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
              language={language === 'laravel' ? 'php' : language}
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
        <section className={cn(
          "lg:col-span-5 flex flex-col gap-4 transition-all duration-300",
          activeTab === 'insights' ? "flex h-[calc(100vh-12rem)] lg:h-auto" : "hidden lg:flex lg:h-auto"
        )}>
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
                    className="prose prose-slate max-w-none prose-headings:font-bold prose-headings:text-slate-800 prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-p:text-slate-600 prose-p:leading-relaxed prose-strong:text-slate-900 prose-blockquote:border-l-4 prose-blockquote:border-emerald-500 prose-blockquote:bg-emerald-50/50 prose-blockquote:p-4 prose-blockquote:rounded-r-lg prose-blockquote:text-slate-700 prose-blockquote:not-italic"
                  >
                    <Markdown components={{ code: MarkdownCodeBlock }}>
                      {explanation}
                    </Markdown>
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
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="h-full flex flex-col items-center justify-center text-center p-8 gap-6"
                  >
                    <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center border-8 border-emerald-100/60">
                      <Code2 className="w-12 h-12 text-emerald-500" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-bold text-2xl text-slate-800">Welcome to Code Clarity</h3>
                      <p className="text-slate-500 text-sm max-w-xs mx-auto">
                        Your personal AI learning assistant. Paste code into the editor, select a task, and get instant insights.
                      </p>
                    </div>
                    <div className="flex flex-wrap justify-center items-center gap-3 pt-4 opacity-80">
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-100/50 rounded-full">
                        <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-xs font-semibold text-emerald-700">Explain</span>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-rose-100/50 rounded-full">
                        <Zap className="w-3.5 h-3.5 text-rose-500" />
                        <span className="text-xs font-semibold text-rose-700">Debug</span>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-violet-100/50 rounded-full">
                        <Cpu className="w-3.5 h-3.5 text-violet-500" />
                        <span className="text-xs font-semibold text-violet-700">Refactor</span>
                      </div>
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
