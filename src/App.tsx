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
  Search,
  Bug,
  Wrench,
  FileText
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
          "w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl transition-all duration-200 group border text-left outline-none btn-3d",
          isOpen
            ? "bg-white border-slate-900 text-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]"
            : "bg-white border-slate-200 hover:border-slate-400 text-slate-600 shadow-[4px_4px_0px_0px_rgba(226,232,240,1)] active:shadow-none"
        )}
      >
        <div className={cn(
          "transition-colors duration-300",
          isOpen ? "text-slate-900" : "text-slate-400 group-hover:text-slate-900"
        )}>
          {icon}
        </div>
        <span className="text-sm font-bold tracking-tight whitespace-nowrap flex-1 truncate">{selectedOption.name}</span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
          <Settings2 className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
            className="absolute top-full left-0 right-0 mt-2 min-w-[220px] bg-white rounded-2xl border-2 border-slate-900 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] p-2 z-[100] overflow-hidden"
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
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 pl-9 pr-3 text-sm text-slate-900 focus:border-emerald-500 outline-none transition-all font-medium"
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
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 mb-1 last:mb-0",
                      value === option.id
                        ? "bg-slate-900 text-white shadow-md"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
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
                <div className="py-8 text-center text-slate-500 text-sm italic">
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
    <div className="my-6 rounded-2xl overflow-hidden bg-slate-50 border border-slate-200 shadow-lg">
      <div className="flex justify-between items-center px-4 py-2 bg-slate-100 border-b border-slate-200 text-xs text-slate-500 font-mono">
        <span className="capitalize">{match[1]}</span>
        <button 
          onClick={handleCopy} 
          className="flex items-center gap-1.5 hover:text-white transition-colors"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 text-slate-400 hover:text-slate-600" />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <div className="p-4 text-sm overflow-x-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
        <pre {...props} className="text-slate-800 font-mono" style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
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

// --- Particle Network Background Component ---
const ParticleNetworkBackground = () => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let particles: { x: number; y: number; vx: number; vy: number; size: number }[] = [];
    let animationFrameId: number;
    let mouse = { x: -1000, y: -1000 };

    const init = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      particles = [];
      // Density calculation
      const particleCount = Math.floor((width * height) / 15000);
      
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: Math.random() * 2 + 1
        });
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = '#f8fafc'; // slate-50
      ctx.fillRect(0, 0, width, height);
      
      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Mouse Interaction
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const distMouse = Math.sqrt(dx * dx + dy * dy);

        if (distMouse < 150) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(16, 185, 129, ${0.4 * (1 - distMouse / 150)})`; // Emerald
          ctx.lineWidth = 1;
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = '#94a3b8'; // slate-400
        ctx.fill();

        // Connect neighbors
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 100) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(203, 213, 225, ${0.4 * (1 - dist / 100)})`; // slate-300
            ctx.lineWidth = 0.5;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    window.addEventListener('resize', init);
    window.addEventListener('mousemove', handleMouseMove);
    init();
    render();

    return () => {
      window.removeEventListener('resize', init);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full -z-10 bg-slate-50" />;
};

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

const TRANSLATIONS = {
  English: {
    subtitle: "AI Developer Suite",
    input: "Input",
    output: "Output",
    copy: "Copy",
    copied: "Copied",
    analyzing: "Analyzing Logic...",
    analyzingDesc: "Your AI Assistant is breaking down the code structure for you.",
    error: "Analysis Interrupted",
    tryAgain: "Try Again",
    welcomeTitle: "Code Clarity AI",
    welcomeDesc: "Select a tool above, paste your code, and let the AI handle the rest.",
    pasteHint: "Paste code + error (optional)",
    systemReady: "System Ready",
    analysisComplete: "Analysis Complete",
    geminiEngine: "GEMINI ENGINE",
    tasks: {
      debug: "Debug & Fix",
      refactor: "Optimize Code"
    }
  },
  Khmer: {
    subtitle: "ឈុតឧបករណ៍អ្នកអភិវឌ្ឍន៍ AI",
    input: "បញ្ចូលកូដ",
    output: "លទ្ធផល",
    copy: "ចម្លង",
    copied: "បានចម្លង",
    analyzing: "កំពុងវិភាគ...",
    analyzingDesc: "AI កំពុងបំបែករចនាសម្ព័ន្ធកូដសម្រាប់អ្នក។",
    error: "ការវិភាគត្រូវបានរំខាន",
    tryAgain: "ព្យាយាមម្តងទៀត",
    welcomeTitle: "Code Clarity AI",
    welcomeDesc: "ជ្រើសរើសឧបករណ៍ខាងលើ បិទភ្ជាប់កូដរបស់អ្នក ហើយឱ្យ AI ដោះស្រាយ។",
    pasteHint: "បិទភ្ជាប់កូដ + កំហុស (ប្រសិនបើមាន)",
    systemReady: "ប្រព័ន្ធរួចរាល់",
    analysisComplete: "ការវិភាគបានបញ្ចប់",
    geminiEngine: "ម៉ាស៊ីន GEMINI",
    tasks: {
      debug: "ជួសជុលកំហុស",
      refactor: "កែលម្អកូដ"
    }
  }
};

export default function App() {
  const [language, setLanguage] = useState('javascript');
  const [targetLanguage, setTargetLanguage] = useState('English');
  const [task, setTask] = useState('debug');
  const [code, setCode] = useState(DEFAULT_CODE.javascript);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'editor' | 'insights'>('editor');

  const t = TRANSLATIONS[targetLanguage as keyof typeof TRANSLATIONS] || TRANSLATIONS.English;

  // Configuration for task-specific button styling
  const taskConfig = {
    debug: {
      label: t.tasks.debug,
      icon: Bug,
      style: "bg-[#FF5A5F] border-[#E00007] text-white shadow-[4px_4px_0px_0px_rgba(224,0,7,0.4)] hover:bg-[#FF454A]"
    },
    refactor: {
      label: t.tasks.refactor,
      icon: Cpu,
      style: "bg-[#00D1C1] border-[#009E91] text-white shadow-[4px_4px_0px_0px_rgba(0,158,145,0.4)] hover:bg-[#2CE5D6]"
    }
  };

  const TASK_OPTIONS = [
    { id: 'debug', name: t.tasks.debug, icon: <Bug className="w-4 h-4" /> },
    { id: 'refactor', name: t.tasks.refactor, icon: <Cpu className="w-4 h-4" /> },
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

  const activeTaskConfig = taskConfig[task as keyof typeof taskConfig] || taskConfig.debug;

  return (
    <div className={cn(
      "min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-emerald-100 selection:text-emerald-900 relative overflow-x-hidden perspective-1000",
      targetLanguage === 'Khmer' ? "font-khmer" : "font-sans"
    )}>
      
      {/* Particle Network Background Layer */}
      <ParticleNetworkBackground />

      {/* Modern Header */}
      <header className="sticky top-0 z-50 w-full mb-8 transition-all duration-300 border-b border-slate-200/60 bg-white/70 backdrop-blur-xl">
        <div className="max-w-[1600px] mx-auto h-20 px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.div 
              whileHover={{ rotate: 5 }}
              whileTap={{ scale: 0.9 }}
              className="w-11 h-11 bg-slate-900 rounded-xl flex items-center justify-center shadow-lg shadow-slate-900/20"
            >
              <Code2 className="text-white w-6 h-6" />
            </motion.div>
            <div>
              <h1 className="font-black text-xl tracking-tight text-slate-900">CODE CLARITY</h1>
              <div className="hidden sm:flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <p className="text-[10px] text-slate-600 uppercase tracking-widest font-bold">{t.subtitle}</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-3 mr-4">
              {/* Task Selector */}
              <CustomDropdown 
                options={TASK_OPTIONS}
                value={task}
                onChange={setTask}
                icon={<Zap className="w-4 h-4" />}
              />

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

              {/* Target Language Selector */}
              <CustomDropdown 
                options={TARGET_LANG_OPTIONS}
                value={targetLanguage}
                onChange={setTargetLanguage}
                icon={<Globe className="w-4 h-4" />}
              />
            </div>
            
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleExplain}
              disabled={isLoading || !code.trim()}
              className={cn(
                "flex items-center gap-2.5 px-6 py-3 rounded-xl font-black transition-all duration-200 group border-2 btn-3d",
                activeTaskConfig.style,
                "disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
              )}
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <activeTaskConfig.icon className="w-5 h-5 drop-shadow-md" />
              )}
              <span className="hidden sm:inline tracking-tight text-sm">
                {activeTaskConfig.label}
              </span>
            </motion.button>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-[1600px] mx-auto px-4 lg:px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 h-auto lg:h-[calc(100vh-8rem)] pb-8">
        {/* Mobile Tab Navigation */}
        <div className="lg:hidden col-span-1">
          <div className="flex p-1 bg-slate-100/80 backdrop-blur rounded-xl border border-slate-200 shadow-sm">
            <button
              onClick={() => setActiveTab('editor')}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold transition-all duration-200",
                activeTab === 'editor' ? "bg-white text-emerald-600 shadow-sm" : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
              )}
            >
              <Code2 className="w-4 h-4" />
              Editor
            </button>
            <button
              onClick={() => setActiveTab('insights')}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold transition-all duration-200",
                activeTab === 'insights' ? "bg-white text-emerald-600 shadow-sm" : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
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
          activeTab === 'editor' ? "flex h-[calc(100vh-20rem)] lg:h-full" : "hidden lg:flex lg:h-full"
        )}>
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/80 backdrop-blur rounded-lg shadow-sm border border-slate-200">
                <Code2 className="w-4 h-4 text-slate-900" />
              </div>
              <span className="text-xs font-black uppercase tracking-widest text-slate-500">{t.input}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-white/80 border border-slate-200 rounded-lg text-[10px] font-mono font-bold text-slate-600 uppercase shadow-sm backdrop-blur-sm">
                {language}
              </span>
            </div>
          </div>
          
          <div className="flex-1 min-h-0 card-3d overflow-hidden relative group !bg-white !border-slate-200">
            {task === 'debug' && (
              <div className="absolute top-4 right-6 z-10 pointer-events-none opacity-40 group-hover:opacity-100 transition-opacity">
                <div className="bg-rose-50 text-rose-600 text-xs font-bold px-3 py-1.5 rounded-lg border border-rose-100 shadow-sm transform rotate-2 backdrop-blur-sm">
                   {t.pasteHint}
                </div>
              </div>
            )}
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
          activeTab === 'insights' ? "flex h-[calc(100vh-12rem)] lg:h-full" : "hidden lg:flex lg:h-full"
        )}>
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/80 backdrop-blur rounded-lg shadow-sm border border-slate-200">
                <Sparkles className="w-4 h-4 text-emerald-600" />
              </div>
              <span className="text-xs font-black uppercase tracking-widest text-slate-500">{t.output}</span>
            </div>
            {explanation && (
              <button 
                onClick={copyToClipboard}
                className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-emerald-600 hover:text-emerald-700 transition-colors"
              >
                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {copied ? t.copied : t.copy}
              </button>
            )}
          </div>

          <div className="flex-1 min-h-0 card-3d overflow-hidden flex flex-col relative !bg-white">
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
                      <h3 className="font-bold text-xl text-slate-800">{t.analyzing}</h3>
                      <p className="text-slate-500 text-sm max-w-[240px]">{t.analyzingDesc}</p>
                    </div>
                  </motion.div>
                ) : explanation ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="prose prose-slate max-w-none prose-headings:font-bold prose-headings:text-slate-800 prose-p:text-slate-600 prose-p:leading-relaxed prose-strong:text-slate-900 prose-blockquote:border-l-4 prose-blockquote:border-emerald-500 prose-blockquote:bg-emerald-50/50 prose-blockquote:p-4 prose-blockquote:rounded-r-lg prose-blockquote:text-slate-700 prose-blockquote:not-italic"
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
                    <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center shadow-inner">
                      <Info className="w-8 h-8" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-bold text-red-600 text-lg">{t.error}</h3>
                      <p className="text-slate-500 text-sm max-w-xs leading-relaxed">{error}</p>
                    </div>
                    <button 
                      onClick={handleExplain}
                      className="mt-4 px-6 py-2 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-colors"
                    >
                      {t.tryAgain}
                    </button>
                  </motion.div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="h-full flex flex-col items-center justify-center text-center p-8 gap-6"
                  >
                    <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center shadow-2xl border border-slate-100 rotate-3">
                      <Code2 className="w-12 h-12 text-slate-900 drop-shadow-sm" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-black text-2xl text-slate-900">{t.welcomeTitle}</h3>
                      <p className="text-slate-500 text-sm max-w-xs mx-auto">
                        {t.welcomeDesc}
                      </p>
                    </div>
                    <div className="flex flex-wrap justify-center items-center gap-3 pt-4 opacity-80">
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-white/80 border border-slate-100 shadow-sm rounded-lg backdrop-blur-sm">
                        <Bug className="w-3.5 h-3.5 text-red-500" />
                        <span className="text-xs font-bold text-slate-700">{t.tasks.debug}</span>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-white/80 border border-slate-100 shadow-sm rounded-lg backdrop-blur-sm">
                        <Cpu className="w-3.5 h-3.5 text-teal-500" />
                        <span className="text-xs font-bold text-slate-700">{t.tasks.refactor}</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Modern Footer Status */}
            <div className="px-8 py-4 bg-white/50 border-t border-slate-100 flex items-center justify-between backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className={cn("w-2.5 h-2.5 rounded-full", explanation ? "bg-emerald-500" : "bg-slate-300")} />
                  {explanation && <div className="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-40" />}
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  {explanation ? t.analysisComplete : t.systemReady}
                </span>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <Settings2 className="w-3 h-3" />
                <span>{t.geminiEngine}</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Modern Footer */}
      <footer className="mt-auto border-t border-slate-200/60 bg-white/80 backdrop-blur-xl z-10">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center border border-slate-200">
              <Code2 className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-sm text-slate-500 font-medium">Built for developers, by developers.</p>
          </div>
          
          <div className="flex items-center gap-8 text-sm font-medium text-slate-500">
            <button className="hover:text-emerald-600 transition-colors">Privacy Policy</button>
            <button className="hover:text-emerald-600 transition-colors">Terms of Service</button>
            <span className="text-slate-600">© 2026 Code Clarity AI</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
