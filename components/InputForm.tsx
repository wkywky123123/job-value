import React, { useState } from 'react';
import { JobFormData } from '../types';
import { Briefcase, Clock, DollarSign, Zap, Building2, User, Coffee, Users, ThumbsDown } from 'lucide-react';

interface InputFormProps {
  onSubmit: (data: JobFormData) => void;
  isLoading: boolean;
}

const InputForm: React.FC<InputFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<JobFormData>({
    // Personal
    gender: '男',
    age: 26,
    familyStatus: '未婚',
    spouseStatus: '无配偶', 
    education: '本科',
    experience: 3,
    
    // Job
    companyName: '',
    position: '产品经理',
    companyType: '民营企业',
    
    // Location & Salary
    city: '北京',
    areaType: '市区',
    salary: 12000,
    months: 13,
    benefits: '五险一金',
    
    // New Fields
    vacationDays: 5,
    colleagueEnvironment: '普通同事',

    // Workload
    workDaysPerWeek: 5,
    workHoursPerDay: 8,
    commuteTime: 60,
    stress: 6,

    // User Drawbacks
    jobDrawbacks: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    // Fields that should remain strings
    const stringFields = [
      'gender', 'familyStatus', 'spouseStatus', 'education', 
      'companyName', 'position', 'companyType', 'city', 
      'areaType', 'benefits', 'colleagueEnvironment', 'jobDrawbacks'
    ];
    
    setFormData(prev => ({
      ...prev,
      [name]: stringFields.includes(name) ? value : Number(value)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const inputClass = "w-full bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none transition placeholder-gray-400 dark:placeholder-slate-500";
  const labelClass = "block text-sm font-medium text-slate-700 dark:text-slate-400 mb-1";

  return (
    <div className="w-full max-w-2xl mx-auto bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-slate-700 transition-colors duration-300">
      <div className="bg-brand-600 dark:bg-brand-700 p-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Briefcase className="w-6 h-6" />
          输入您的工作详情
        </h2>
        <p className="text-brand-100 mt-2">AI 将结合您的个人背景进行深度分析</p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        
        {/* Section 0: Personal Info */}
        <div className="space-y-4">
           <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <User className="w-5 h-5 text-brand-500" /> 个人背景
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             <div>
              <label className={labelClass}>性别</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="男">男</option>
                <option value="女">女</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>年龄</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>工龄 (年)</label>
              <input
                type="number"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>家庭状况</label>
              <select
                name="familyStatus"
                value={formData.familyStatus}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="未婚">未婚</option>
                <option value="已婚无娃">已婚无娃</option>
                <option value="已婚有娃">已婚有娃</option>
                <option value="离异">离异</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>配偶情况</label>
              <select
                name="spouseStatus"
                value={formData.spouseStatus}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="无配偶">无配偶 / 暂不填</option>
                <option value="双职工">双职工 (配偶有收入)</option>
                <option value="单职工">单职工 (配偶无收入)</option>
              </select>
            </div>
             <div>
              <label className={labelClass}>学历</label>
              <select
                name="education"
                value={formData.education}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="高中及以下">高中及以下</option>
                <option value="大专">大专</option>
                <option value="本科">本科</option>
                <option value="硕士">硕士</option>
                <option value="博士">博士</option>
              </select>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-slate-700 my-4"></div>

        {/* Section 1: Job & Company Info */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-brand-500" /> 岗位与公司
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="md:col-span-2">
              <label className={labelClass}>企业名称 (选填，仅用于AI分析，不保存)</label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                className={inputClass}
                placeholder="例如：字节跳动"
              />
            </div>
            <div>
              <label className={labelClass}>岗位名称</label>
              <input
                type="text"
                name="position"
                value={formData.position}
                onChange={handleChange}
                className={inputClass}
                placeholder="例如：产品经理"
                required
              />
            </div>
            <div>
              <label className={labelClass}>企业性质</label>
              <select
                name="companyType"
                value={formData.companyType}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="民营企业">民营企业 (私企)</option>
                <option value="国有企业">国有企业 (央企/国企)</option>
                <option value="外资企业">外资企业</option>
                <option value="事业单位/公务员">事业单位/公务员</option>
                <option value="自由职业">自由职业</option>
                <option value="创业公司">创业公司</option>
              </select>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-slate-700 my-4"></div>

        {/* Section 2: Salary & Region */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-brand-500" /> 薪资与地区
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>月薪 (税前/元)</label>
              <input
                type="number"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                className={inputClass}
                placeholder="10000"
                required
              />
            </div>
            <div>
              <label className={labelClass}>年底发几薪</label>
              <input
                type="number"
                name="months"
                value={formData.months}
                onChange={handleChange}
                className={inputClass}
                placeholder="12"
              />
            </div>
            <div>
              <label className={labelClass}>所在城市</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className={inputClass}
                placeholder="例如：上海"
                required
              />
            </div>
            <div>
              <label className={labelClass}>工作地段</label>
              <select
                name="areaType"
                value={formData.areaType}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="市区">市区/CBD</option>
                <option value="郊区">近郊/开发区</option>
                <option value="县城">县城/城镇</option>
                <option value="农村">农村/偏远地区</option>
              </select>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-slate-700 my-4"></div>

        {/* Section 3: Time Cost */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <Clock className="w-5 h-5 text-brand-500" /> 时间成本
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>每周工作天数</label>
              <select
                name="workDaysPerWeek"
                value={formData.workDaysPerWeek}
                onChange={handleChange}
                className={inputClass}
              >
                <option value={4}>4天 (神仙)</option>
                <option value={5}>5天 (标准)</option>
                <option value={5.5}>5.5天 (大小周)</option>
                <option value={6}>6天 (单休)</option>
                <option value={7}>7天 (无休)</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>日均工时 (小时)</label>
              <input
                type="number"
                name="workHoursPerDay"
                value={formData.workHoursPerDay}
                onChange={handleChange}
                step="0.5"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>每日通勤 (往返/分钟)</label>
              <input
                type="number"
                name="commuteTime"
                value={formData.commuteTime}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-slate-700 my-4"></div>

        {/* Section 4: Others */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <Zap className="w-5 h-5 text-brand-500" /> 其他因素
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div>
              <label className={labelClass}>年假/带薪假 (天/年)</label>
              <div className="relative">
                <Coffee className="absolute left-3 top-2.5 w-4 h-4 text-slate-400 dark:text-slate-500" />
                <input
                  type="number"
                  name="vacationDays"
                  value={formData.vacationDays}
                  onChange={handleChange}
                  className={`${inputClass} pl-10`}
                  placeholder="5"
                />
              </div>
            </div>
            <div>
              <label className={labelClass}>同事/团队氛围</label>
              <div className="relative">
                <Users className="absolute left-3 top-2.5 w-4 h-4 text-slate-400 dark:text-slate-500" />
                <select
                  name="colleagueEnvironment"
                  value={formData.colleagueEnvironment}
                  onChange={handleChange}
                  className={`${inputClass} pl-10`}
                >
                  <option value="险恶">险恶 (勾心斗角/甄嬛传)</option>
                  <option value="内卷">内卷 (过度竞争/压力大)</option>
                  <option value="冷漠">冷漠 (各扫门前雪)</option>
                  <option value="普通同事">普通 (公事公办)</option>
                  <option value="融洽">融洽 (互帮互助/氛围好)</option>
                  <option value="神仙团队">神仙 (快乐源泉/亦师亦友)</option>
                </select>
              </div>
            </div>
            
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
               <div>
                  <label className={labelClass}>福利简述</label>
                  <input
                    type="text"
                    name="benefits"
                    value={formData.benefits}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="例如：全额五险一金，有食堂"
                  />
                </div>
                 <div>
                  <label className={labelClass}>工作压力 (1-10)</label>
                   <div className="flex items-center gap-4">
                    <input
                      type="range"
                      name="stress"
                      min="1"
                      max="10"
                      value={formData.stress}
                      onChange={handleChange}
                      className="w-full h-2 bg-gray-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="text-slate-900 dark:text-white font-mono w-6">{formData.stress}</span>
                   </div>
                </div>
            </div>

            <div className="md:col-span-2">
              <label className={labelClass}>
                <span className="flex items-center gap-2">
                  <ThumbsDown className="w-4 h-4 text-slate-500" />
                  主要槽点/缺点 (选填)
                </span>
              </label>
              <input
                type="text"
                name="jobDrawbacks"
                value={formData.jobDrawbacks}
                onChange={handleChange}
                className={inputClass}
                placeholder="例如：单休、领导PUA、离家太远、画大饼..."
              />
              <p className="text-xs text-slate-400 mt-1">AI 会重点参考您输入的缺点进行扣分</p>
            </div>

          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-4 mt-6 rounded-xl font-bold text-lg text-white shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] ${
            isLoading
              ? 'bg-slate-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 shadow-brand-500/20'
          }`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              AI 正在深度运算中...
            </span>
          ) : (
            '开始计算性价比'
          )}
        </button>
      </form>
    </div>
  );
};

export default InputForm;