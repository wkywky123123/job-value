import React from 'react';
import { HistoryItem } from '../types';
import { Trash2, ChevronRight, Calendar, Building2 } from 'lucide-react';

interface HistoryViewProps {
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onDelete: (id: string, e: React.MouseEvent) => void;
  onBack: () => void;
}

const HistoryView: React.FC<HistoryViewProps> = ({ history, onSelect, onDelete, onBack }) => {
  
  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center animate-fade-in">
        <div className="w-24 h-24 bg-gray-200 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6 transition-colors duration-300">
           <Calendar className="w-10 h-10 text-slate-400 dark:text-slate-500" />
        </div>
        <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-300 mb-2">暂无历史记录</h3>
        <p className="text-slate-500 mb-8">您之前的计算结果将显示在这里</p>
        <button 
          onClick={onBack}
          className="px-6 py-3 bg-brand-600 hover:bg-brand-500 text-white rounded-xl font-medium transition shadow-lg"
        >
          开始新的计算
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Calendar className="w-6 h-6 text-brand-500" />
          历史记录
        </h2>
        <button 
           onClick={onBack}
           className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition text-sm"
        >
          返回计算器
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {history.map((item) => {
          const date = new Date(item.timestamp).toLocaleDateString('zh-CN', {
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          });

          // Determine border color based on score
          const borderColor = 
            item.result.score >= 80 ? 'border-l-green-500' : 
            item.result.score >= 60 ? 'border-l-brand-500' : 
            'border-l-red-500';

          return (
            <div 
              key={item.id}
              onClick={() => onSelect(item)}
              className={`bg-white dark:bg-slate-800 rounded-xl p-5 border-l-4 ${borderColor} border-t border-r border-b border-gray-200 dark:border-slate-700 hover:border-brand-300 dark:hover:border-slate-600 hover:shadow-lg dark:hover:bg-slate-750 transition-all cursor-pointer group relative overflow-hidden`}
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                   <h3 className="font-bold text-slate-900 dark:text-white text-lg flex items-center gap-2">
                     {item.formData.position}
                     <span className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-slate-700 rounded text-slate-600 dark:text-slate-300 font-normal border border-gray-200 dark:border-transparent">
                       {item.result.tier}
                     </span>
                   </h3>
                   <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm mt-1">
                      <Building2 className="w-3 h-3" />
                      {item.formData.companyName || item.formData.companyType}
                   </div>
                </div>
                <div className="text-right">
                   <div className="text-2xl font-black text-slate-900 dark:text-white">{item.result.score}</div>
                   <div className="text-xs text-slate-500">分</div>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 dark:border-slate-700/50">
                 <div className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1">
                   <Calendar className="w-3 h-3" /> {date}
                 </div>
                 <div className="flex items-center gap-3">
                    <button 
                      onClick={(e) => onDelete(item.id, e)}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-full transition opacity-0 group-hover:opacity-100"
                      title="删除"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <span className="text-brand-500 dark:text-brand-400 text-sm font-medium flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      查看详情 <ChevronRight className="w-4 h-4" />
                    </span>
                 </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HistoryView;