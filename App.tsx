import React, { useState, useEffect } from 'react';
import InputForm from './components/InputForm';
import ResultView from './components/ResultView';
import HistoryView from './components/HistoryView';
import { JobFormData, AnalysisResult, HistoryItem } from './types';
import { analyzeJob } from './services/geminiService';
import { saveHistoryItem, getHistory, deleteHistoryItem } from './services/historyService';
import { Calculator, History, Sun, Moon } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<'input' | 'result' | 'history'>('input');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);

  // Theme Management
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    // Check local storage or system preference
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('theme');
      if (stored === 'dark' || stored === 'light') return stored;
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
    }
    return 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Load history on mount
  useEffect(() => {
    setHistoryItems(getHistory());
  }, []);

  const handleFormSubmit = async (data: JobFormData) => {
    setLoading(true);
    try {
      const analysis = await analyzeJob(data);
      setResult(analysis);
      
      // Save to history
      const savedItem = saveHistoryItem(data, analysis);
      setHistoryItems(prev => [savedItem, ...prev]);
      
      setView('result');
    } catch (error) {
      console.error("Analysis failed", error);
      alert("AI 服务暂时不可用，请检查网络或 API Key");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setView('input');
    setResult(null);
    window.scrollTo(0, 0);
  };

  const toggleHistory = () => {
    if (view === 'history') {
      setView(result ? 'result' : 'input');
    } else {
      setView('history');
    }
  };

  const handleSelectHistory = (item: HistoryItem) => {
    setResult(item.result);
    setView('result');
    window.scrollTo(0, 0);
  };

  const handleDeleteHistory = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('确定要删除这条记录吗？')) {
      const updated = deleteHistoryItem(id);
      setHistoryItems(updated);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f172a] text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-300">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-slate-800 bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-md sticky top-0 z-50 transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div 
            className="flex items-center gap-2 text-brand-600 dark:text-brand-500 cursor-pointer" 
            onClick={() => setView('input')}
          >
            <Calculator className="w-8 h-8" />
            <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">工作性价比计算器 <span className="text-xs bg-brand-100 text-brand-700 dark:bg-brand-900 dark:text-brand-300 px-2 py-0.5 rounded ml-2">AI 版</span></h1>
          </div>
          
          <div className="flex items-center gap-4">
             {/* Theme Toggle */}
             <button
               onClick={toggleTheme}
               className="p-2 rounded-lg text-slate-500 hover:bg-gray-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
               title={theme === 'dark' ? "切换到亮色模式" : "切换到深色模式"}
             >
               {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
             </button>

             <button 
               onClick={toggleHistory}
               className={`flex items-center gap-2 px-4 py-2 rounded-lg transition text-sm font-medium ${view === 'history' ? 'bg-gray-200 dark:bg-slate-700 text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800'}`}
             >
               <History className="w-4 h-4" />
               <span className="hidden sm:inline">历史记录</span>
             </button>
             <div className="text-sm text-slate-400 hidden md:block border-l border-gray-300 dark:border-slate-700 pl-4">
               kimi-k2-0905-preview
             </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow p-4 sm:p-8">
        <div className="max-w-6xl mx-auto">
          {view === 'input' && (
            <div className="flex flex-col items-center justify-center min-h-[80vh] animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="text-center mb-10 max-w-2xl">
                <h2 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-indigo-600 dark:from-white dark:to-slate-400 mb-6">
                  你的工作到底值不值？
                </h2>
                <p className="text-lg text-slate-600 dark:text-slate-400">
                  不只看薪水。结合时薪、通勤、城市物价和职场压力，
                  <br className="hidden sm:block" />
                  AI 为你生成最真实的"打工性价比"报告。
                </p>
              </div>
              <InputForm onSubmit={handleFormSubmit} isLoading={loading} />
            </div>
          )}

          {view === 'result' && result && (
             <ResultView result={result} onReset={handleReset} />
          )}

          {view === 'history' && (
            <HistoryView 
              history={historyItems} 
              onSelect={handleSelectHistory} 
              onDelete={handleDeleteHistory}
              onBack={() => setView('input')}
            />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-slate-800 py-8 mt-auto">
        <div className="max-w-6xl mx-auto px-4 text-center text-slate-500 dark:text-slate-500 text-sm">
          <p>© 2025 Mr哥达. 由 Google Gemini 开发，由 Kimi 驱动。</p>
          <p className="mt-2 text-slate-400 dark:text-slate-600">结果仅供娱乐与参考，请理性看待职业发展。</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
