import React, { useState, useRef } from 'react';
import { AnalysisResult } from '../types';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer,
  Tooltip
} from 'recharts';
import { Trophy, ThumbsUp, ThumbsDown, Lightbulb, Share2, RefreshCw, MessageCircle, Flame, Check, TrendingUp } from 'lucide-react';
// @ts-ignore
import html2canvas from 'html2canvas';

interface ResultViewProps {
  result: AnalysisResult;
  onReset: () => void;
}

const ResultView: React.FC<ResultViewProps> = ({ result, onReset }) => {
  const [tone, setTone] = useState<'objective' | 'sharp'>('objective');
  const [shareState, setShareState] = useState<'idle' | 'generating' | 'success'>('idle');
  const shareRef = useRef<HTMLDivElement>(null);

  // Determine color based on score
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-yellow-500 dark:text-yellow-400';
    if (score >= 75) return 'text-green-500 dark:text-green-400';
    if (score >= 60) return 'text-brand-500 dark:text-brand-400';
    return 'text-red-500 dark:text-red-400';
  };

  const scoreColor = getScoreColor(result.score);

  const handleShare = async () => {
    if (shareState === 'generating') return;
    setShareState('generating');

    // 1. Copy text to clipboard
    const text = `【工作性价比计算器】
得分：${result.score} (${result.tier})
击败了：${result.percentile}% 的打工人
----------------
${tone === 'objective' ? result.analysis : result.sharpAnalysis}
----------------
快来测测你的工作值不值！
https://job.mrgeda.top/`;
    
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }

    // 2. Generate and download image
    if (shareRef.current) {
      try {
        // Wait a short moment to ensure UI is stable and animations are catching up
        await new Promise(resolve => setTimeout(resolve, 800));

        // Detect current mode to set appropriate background for screenshot
        const isDark = document.documentElement.classList.contains('dark');
        const bgColor = isDark ? '#0f172a' : '#f9fafb';
        
        // Ensure the element is fully visible in calculations
        const element = shareRef.current;
        
        const canvas = await html2canvas(element, {
          backgroundColor: bgColor,
          scale: 2, // Higher resolution (Retina)
          useCORS: true, // Allow cross-origin images (though we use SVGs)
          logging: false,
          // CRITICAL FIXES:
          // 1. Handle scroll offset (often causes cut-off images)
          scrollY: -window.scrollY, 
          // 2. Ensure full dimensions are captured
          width: element.scrollWidth,
          height: element.scrollHeight,
          windowWidth: document.documentElement.scrollWidth,
          windowHeight: document.documentElement.scrollHeight,
          // 3. Fix for Recharts or complex SVGs potentially needing time or specific clone handling
          onclone: (clonedDoc) => {
            const clonedEl = clonedDoc.getElementById('share-container');
            if (clonedEl) {
                // Force background on the cloned element to prevent transparency
                clonedEl.style.backgroundColor = bgColor; 
                // Fix for rounded corners sometimes showing white edges
                clonedEl.style.overflow = 'hidden';
            }
          }
        });
        
        const image = canvas.toDataURL("image/png");
        const link = document.createElement('a');
        link.href = image;
        link.download = `job-value-report-${result.score}.png`;
        link.click();
        
        setShareState('success');
        setTimeout(() => setShareState('idle'), 3000);
      } catch (error) {
        console.error("Image generation failed:", error);
        setShareState('idle');
        alert("图片生成遇到问题，请尝试截屏分享。\n(文案已自动复制到剪贴板)");
      }
    } else {
      setShareState('idle');
    }
  };

  const getItemColorClass = (value: number) => {
    if (value >= 80) return 'text-green-500 dark:text-green-400 bg-green-500';
    if (value >= 60) return 'text-brand-500 dark:text-brand-400 bg-brand-500';
    return 'text-orange-500 dark:text-orange-400 bg-orange-500';
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-fade-in">
      
      {/* Content to be captured */}
      <div 
        ref={shareRef} 
        id="share-container"
        className="space-y-8 p-6 sm:p-8 bg-gray-50 dark:bg-[#0f172a] rounded-3xl transition-colors duration-300"
      >
        
        {/* Top Banner: Score & Tier */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-xl border border-gray-200 dark:border-slate-700 relative overflow-hidden transition-colors duration-300">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-100 dark:bg-brand-600/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
            <div className="text-center md:text-left">
              <h2 className="text-slate-500 dark:text-slate-400 text-lg uppercase tracking-wider font-semibold">工作性价比得分</h2>
              <div className={`text-8xl font-black ${scoreColor} mt-2 tracking-tighter`}>
                {result.score}
                <span className="text-4xl text-slate-400 dark:text-slate-500 font-normal ml-2">/100</span>
              </div>
              <div className="flex items-center gap-3 mt-4 justify-center md:justify-start">
                <span className="px-4 py-1 bg-gray-100 dark:bg-slate-700 rounded-full text-slate-700 dark:text-white font-bold border border-gray-200 dark:border-slate-600">
                  {result.tier}
                </span>
                <span className="px-4 py-1 bg-yellow-100 dark:bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-500/30 rounded-full font-bold flex items-center gap-1">
                  <Trophy className="w-4 h-4" /> {result.rankTitle}
                </span>
              </div>
            </div>

            <div className="text-center md:text-right max-w-xs">
              <p className="text-slate-500 dark:text-slate-300 mb-2">击败了全国</p>
              <div className="text-5xl font-bold text-slate-900 dark:text-white mb-2">
                {result.percentile}%
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-sm">的同类打工人</p>
            </div>
          </div>
        </div>

        {/* Charts Section: Radar Only (Full Width) */}
        {/* Removed flex justify-center wrapper and max-w-2xl to fix width inconsistency */}
        <div className="w-full bg-white dark:bg-slate-800 p-6 md:p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-slate-700 flex flex-col relative overflow-hidden transition-colors duration-300">
            
            {/* Decoration */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-400 via-indigo-500 to-purple-500"></div>
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-brand-100/50 dark:bg-brand-900/10 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="w-full flex justify-between items-center mb-6 relative z-10">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <div className="p-2 bg-brand-50 dark:bg-slate-700/50 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                  </div>
                  五维雷达图
                </h3>
                <div className="text-xs font-medium px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 rounded-full">
                  综合能力模型
                </div>
            </div>
            
            <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                {/* Chart Area */}
                <div className="w-full md:w-3/5 h-[300px] md:h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={result.radarData}>
                      <defs>
                        <linearGradient id="radarFill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.6}/>
                          <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.2}/>
                        </linearGradient>
                      </defs>
                      <PolarGrid gridType="polygon" stroke="#cbd5e1" strokeDasharray="3 3" />
                      <PolarAngleAxis 
                        dataKey="subject" 
                        tick={{ fill: '#64748b', fontSize: 13, fontWeight: 600 }} 
                      />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                      <Radar
                        name="我的工作"
                        dataKey="value"
                        stroke="#2563eb"
                        strokeWidth={3}
                        fill="url(#radarFill)"
                        fillOpacity={1}
                        isAnimationActive={true}
                      />
                      <Tooltip 
                        cursor={false}
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>

                {/* Score Stats Area (Vertical List on Desktop, Grid on Mobile) */}
                <div className="w-full md:w-2/5 grid grid-cols-2 md:grid-cols-1 gap-3">
                   {result.radarData.map((item, i) => {
                      const colorClass = getItemColorClass(item.value);
                      // extract just the color part for the progress bar bg
                      const bgClass = colorClass.split(' ').find(c => c.startsWith('bg-')) || 'bg-brand-500';

                      return (
                        <div key={i} className="flex flex-col md:flex-row md:justify-between md:items-center p-3 md:p-4 rounded-xl bg-gray-50 dark:bg-slate-700/30 border border-gray-100 dark:border-slate-700/50">
                          <span className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mb-1 md:mb-0">{item.subject}</span>
                          <div className="flex items-center gap-3">
                              {/* Progress bar only visible on md screens and up */}
                              <div className="w-24 h-1.5 bg-gray-200 dark:bg-slate-600 rounded-full overflow-hidden hidden md:block">
                                  <div className={`h-full rounded-full ${bgClass}`} style={{width: `${item.value}%`}}></div>
                              </div>
                              <span className={`text-lg md:text-xl font-black ${colorClass.split(' ').filter(c => c.startsWith('text-')).join(' ')}`}>
                                {item.value}
                              </span>
                          </div>
                        </div>
                      );
                   })}
                </div>
            </div>

        </div>

        {/* Text Analysis with Toggle */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-200 dark:border-slate-700 overflow-hidden transition-colors duration-300">
          {/* Tone Indicator */}
          <div className="px-8 py-4 border-b border-gray-200 dark:border-slate-700 flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm">
             {tone === 'objective' ? <MessageCircle className="w-4 h-4" /> : <Flame className="w-4 h-4 text-red-500" />}
             当前模式：{tone === 'objective' ? '客观评价' : '毒舌锐评'}
          </div>
          
          <div className="p-8">
            <div className={`prose prose-slate dark:prose-invert max-w-none mb-8 leading-relaxed ${tone === 'sharp' ? 'text-slate-800 dark:text-slate-200' : 'text-slate-700 dark:text-slate-300'}`}>
              <p className="whitespace-pre-wrap">{tone === 'objective' ? result.analysis : result.sharpAnalysis}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-green-600 dark:text-green-400 font-bold mb-3 flex items-center gap-2">
                  <ThumbsUp className="w-5 h-5" /> 核心优势
                </h4>
                <ul className="space-y-2">
                  {result.pros.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-slate-700 dark:text-slate-300 text-sm">
                      <span className="mt-1.5 w-1.5 h-1.5 bg-green-500 rounded-full flex-shrink-0"></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="text-red-600 dark:text-red-400 font-bold mb-3 flex items-center gap-2">
                  <ThumbsDown className="w-5 h-5" /> 主要劣势
                </h4>
                <ul className="space-y-2">
                  {result.cons.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-slate-700 dark:text-slate-300 text-sm">
                      <span className="mt-1.5 w-1.5 h-1.5 bg-red-500 rounded-full flex-shrink-0"></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-8 bg-indigo-50 dark:bg-indigo-900/30 p-6 rounded-xl border border-indigo-100 dark:border-indigo-500/30">
              <h4 className="text-indigo-600 dark:text-indigo-400 font-bold mb-3 flex items-center gap-2">
                <Lightbulb className="w-5 h-5" /> AI 建议
              </h4>
              <ul className="space-y-2">
                  {result.suggestions.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-indigo-800 dark:text-indigo-200 text-sm">
                      <span className="mt-1.5 w-1.5 h-1.5 bg-indigo-400 rounded-full flex-shrink-0"></span>
                      {item}
                    </li>
                  ))}
                </ul>
            </div>
            
            <div className="mt-8 pt-4 border-t border-gray-200 dark:border-slate-700/50 text-center text-slate-400 dark:text-slate-500 text-xs">
              Powered by Job Value Calculator AI
            </div>
          </div>
        </div>
      </div>

      {/* Control Bar (Outside Screenshot) */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pb-12">
        <div className="flex bg-white dark:bg-slate-800 p-1 rounded-full border border-gray-200 dark:border-slate-700 shadow-sm">
           <button 
             onClick={() => setTone('objective')}
             className={`px-4 py-2 rounded-full text-sm font-medium transition ${tone === 'objective' ? 'bg-slate-200 dark:bg-slate-600 text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
           >
             客观评价
           </button>
           <button 
             onClick={() => setTone('sharp')}
             className={`px-4 py-2 rounded-full text-sm font-medium transition ${tone === 'sharp' ? 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-200' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
           >
             毒舌锐评
           </button>
        </div>

        <div className="flex gap-4">
          <button 
            onClick={onReset}
            className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-gray-50 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-white border border-gray-200 dark:border-slate-600 rounded-full font-medium transition shadow-sm"
          >
            <RefreshCw className="w-4 h-4" /> 重测
          </button>
          <button 
            onClick={handleShare}
            disabled={shareState === 'generating'}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition shadow-lg min-w-[160px] justify-center ${
              shareState === 'success' ? 'bg-green-600 text-white' : 
              shareState === 'generating' ? 'bg-slate-600 text-slate-300 cursor-wait' :
              'bg-brand-600 hover:bg-brand-500 text-white shadow-brand-500/20'
            }`}
          >
            {shareState === 'success' ? (
              <>
                <Check className="w-4 h-4" /> 已保存 & 复制
              </>
            ) : shareState === 'generating' ? (
              <>
                 <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                 生成中...
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4" /> 分享结果
              </>
            )}
          </button>
        </div>
      </div>

    </div>
  );
};

export default ResultView;
