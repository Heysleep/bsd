
import React, { useState, useEffect, useCallback } from 'react';
import { QuotationState, SofaModule, Combination } from './types';
import ModuleForm from './components/ModuleForm';
import CombinationForm from './components/CombinationForm';
import QuotationPreview from './components/QuotationPreview';
import { generateDesignDescription } from './services/geminiService';

const STORAGE_KEY = 'sofa-quotation-data';

const App: React.FC = () => {
  const [state, setState] = useState<QuotationState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Load data failed", e);
      }
    }
    return {
      companyName: '意式家居设计工作室',
      companyLogo: '',
      coverImage: '',
      sofaModelName: 'MILANO 2025',
      currency: '¥',
      modules: [],
      combinations: [],
    };
  });

  const [description, setDescription] = useState('加载意式美学描述中...');
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [showModuleForm, setShowModuleForm] = useState(false);
  const [showComboForm, setShowComboForm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Auto-save to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    setIsSaving(true);
    const timer = setTimeout(() => setIsSaving(false), 2000);
    return () => clearTimeout(timer);
  }, [state]);

  // Auto-generate AI description when model name changes
  useEffect(() => {
    const updateDesc = async () => {
      const desc = await generateDesignDescription(state.sofaModelName);
      setDescription(desc);
    };
    updateDesc();
  }, [state.sofaModelName]);

  const addModule = (mod: SofaModule) => {
    setState(prev => ({ ...prev, modules: [...prev.modules, mod] }));
    setShowModuleForm(false);
  };

  const addCombination = (combo: Combination) => {
    setState(prev => ({ ...prev, combinations: [...prev.combinations, combo] }));
    setShowComboForm(false);
  };

  const deleteModule = (id: string) => {
    setState(prev => ({
      ...prev,
      modules: prev.modules.filter(m => m.id !== id),
      combinations: prev.combinations.filter(c => !c.moduleIds.includes(id))
    }));
  };

  const deleteCombination = (id: string) => {
    setState(prev => ({ ...prev, combinations: prev.combinations.filter(c => c.id !== id) }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'companyLogo' | 'coverImage') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setState(prev => ({ ...prev, [field]: reader.result as string }));
      reader.readAsDataURL(file);
    }
  };

  const downloadPDF = useCallback(() => {
    window.print();
  }, []);

  const clearAll = () => {
    if(confirm("确定要清空所有数据吗？此操作不可撤销。")) {
      setState({
        companyName: '意式家居设计工作室',
        companyLogo: '',
        coverImage: '',
        sofaModelName: 'MILANO 2025',
        currency: '¥',
        modules: [],
        combinations: [],
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfbf9] text-stone-800">
      {/* Sidebar Controls */}
      <div className="lg:fixed lg:left-0 lg:top-0 lg:bottom-0 lg:w-96 bg-white shadow-2xl overflow-y-auto no-print z-10 border-r border-stone-100">
        <div className="p-8 space-y-8">
          <div className="flex justify-between items-start border-b border-stone-100 pb-6">
            <div className="space-y-1">
              <h1 className="font-serif text-3xl font-bold tracking-tight text-stone-900">意式报价系统</h1>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isSaving ? 'bg-amber-400' : 'bg-emerald-500'}`}></div>
                <p className="text-[9px] uppercase tracking-[0.2em] text-stone-400 font-bold">{isSaving ? '正在自动保存...' : '数据已同步到本地'}</p>
              </div>
            </div>
            <button onClick={clearAll} className="text-[10px] text-stone-300 hover:text-red-500 font-bold uppercase tracking-widest transition-colors">重置</button>
          </div>

          {/* Configuration Sections */}
          <div className="space-y-8">
            <section className="space-y-4">
              <h2 className="text-[10px] font-bold uppercase tracking-widest text-stone-400 flex items-center gap-2">
                <span className="w-1 h-3 bg-stone-900"></span> 品牌与视觉
              </h2>
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-bold text-stone-400">公司名称</label>
                  <input 
                    value={state.companyName} 
                    onChange={e => setState({...state, companyName: e.target.value})}
                    className="w-full text-sm border-b border-stone-200 py-2 focus:border-stone-800 outline-none transition-all"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <label className="text-[9px] uppercase font-bold text-stone-400">Logo</label>
                    <label className="flex flex-col items-center justify-center h-20 bg-stone-50 border border-stone-100 rounded-xl cursor-pointer hover:bg-stone-100 transition-colors overflow-hidden">
                      {state.companyLogo ? <img src={state.companyLogo} className="w-full h-full object-contain p-2" /> : <span className="text-[10px] text-stone-400">上传 Logo</span>}
                      <input type="file" accept="image/*" onChange={e => handleFileUpload(e, 'companyLogo')} className="hidden" />
                    </label>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] uppercase font-bold text-stone-400">封面大图</label>
                    <label className="flex flex-col items-center justify-center h-20 bg-stone-50 border border-stone-100 rounded-xl cursor-pointer hover:bg-stone-100 transition-colors overflow-hidden">
                      {state.coverImage ? <img src={state.coverImage} className="w-full h-full object-cover" /> : <span className="text-[10px] text-stone-400">上传封面图</span>}
                      <input type="file" accept="image/*" onChange={e => handleFileUpload(e, 'coverImage')} className="hidden" />
                    </label>
                  </div>
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-[10px] font-bold uppercase tracking-widest text-stone-400 flex items-center gap-2">
                <span className="w-1 h-3 bg-stone-900"></span> 产品系列
              </h2>
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-bold text-stone-400">系列主名称</label>
                  <input 
                    value={state.sofaModelName} 
                    onChange={e => setState({...state, sofaModelName: e.target.value})}
                    className="w-full text-xl font-serif border-b border-stone-200 py-1 focus:border-stone-800 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-bold text-stone-400">报价货币</label>
                  <input 
                    value={state.currency} 
                    onChange={e => setState({...state, currency: e.target.value})}
                    className="w-full text-sm border-b border-stone-200 py-1 focus:border-stone-800 outline-none"
                  />
                </div>
              </div>
            </section>

            <section className="space-y-4">
               <div className="flex justify-between items-center">
                 <h2 className="text-[10px] font-bold uppercase tracking-widest text-stone-400 flex items-center gap-2">
                   <span className="w-1 h-3 bg-stone-900"></span> 资产清单
                 </h2>
                 <div className="flex gap-2">
                  <button onClick={() => { setShowModuleForm(true); setShowComboForm(false); }} className="text-[9px] bg-stone-900 text-white px-3 py-1 rounded-full font-bold hover:bg-stone-800 transition-colors">+ 模块</button>
                  <button onClick={() => { setShowComboForm(true); setShowModuleForm(false); }} className="text-[9px] bg-stone-900 text-white px-3 py-1 rounded-full font-bold hover:bg-stone-800 transition-colors">+ 组合</button>
                 </div>
               </div>

               <div className="space-y-2 max-h-60 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-stone-200">
                 {state.modules.map(m => (
                   <div key={m.id} className="text-[11px] p-3 bg-stone-50 border border-stone-100 rounded-xl flex justify-between items-center group">
                     <div className="flex flex-col">
                       <span className="font-bold text-stone-700">{m.name}</span>
                       <span className="text-[8px] text-stone-400 uppercase tracking-tighter">{m.model}</span>
                     </div>
                     <button onClick={() => deleteModule(m.id)} className="text-stone-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                     </button>
                   </div>
                 ))}
                 {state.combinations.map(c => (
                   <div key={c.id} className="text-[11px] p-3 bg-stone-100 border border-stone-200 rounded-xl flex justify-between items-center group">
                     <div className="flex flex-col">
                       <span className="font-bold text-stone-800">方案: {c.name}</span>
                       <span className="text-[8px] text-stone-500 uppercase tracking-tighter">{c.model}</span>
                     </div>
                     <button onClick={() => deleteCombination(c.id)} className="text-stone-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                     </button>
                   </div>
                 ))}
                 {state.modules.length === 0 && <p className="text-center py-4 text-[10px] text-stone-400 italic">尚未添加任何元素</p>}
               </div>
            </section>
          </div>

          <div className="pt-6 flex flex-col gap-4">
            <button 
              onClick={() => setActiveTab(activeTab === 'edit' ? 'preview' : 'edit')}
              className="w-full py-4 bg-stone-900 text-white font-bold rounded-2xl hover:bg-stone-800 transition-all shadow-xl shadow-stone-200 flex justify-center items-center gap-3"
            >
              {activeTab === 'edit' ? (
                <>
                  <span>查看最终报价</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                </>
              ) : (
                <>
                  <span>返回编辑模式</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                </>
              )}
            </button>
            {activeTab === 'preview' && (
              <button 
                onClick={downloadPDF}
                className="w-full py-4 border-2 border-stone-900 text-stone-900 font-bold rounded-2xl hover:bg-stone-50 transition-all flex justify-center items-center gap-2"
              >
                导出 PDF 文档
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="lg:ml-96 p-6 lg:p-12 flex justify-center min-h-screen">
        {activeTab === 'edit' ? (
          <div className="w-full max-w-4xl space-y-10 no-print">
            {showModuleForm && (
              <ModuleForm onAdd={addModule} onCancel={() => setShowModuleForm(false)} />
            )}
            
            {showComboForm && (
              <CombinationForm 
                availableModules={state.modules} 
                onAdd={addCombination} 
                onCancel={() => setShowComboForm(false)} 
              />
            )}

            {!showModuleForm && !showComboForm && (
              <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-12">
                <div className="text-center space-y-4">
                  <h3 className="font-serif text-6xl font-bold text-stone-200">Milano Project</h3>
                  <p className="text-stone-400 font-serif italic text-xl">
                    {state.modules.length === 0 ? "构建属于您的意式沙发报价系列" : "目前已录入 " + state.modules.length + " 个单元与 " + state.combinations.length + " 个方案"}
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-2xl px-6">
                  <button onClick={() => setShowModuleForm(true)} className="group bg-white p-10 rounded-[40px] border border-stone-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all text-left">
                    <div className="w-14 h-14 bg-stone-900 rounded-2xl flex items-center justify-center text-white mb-6 group-hover:rotate-12 transition-transform">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                    </div>
                    <p className="font-bold text-xl text-stone-800">添加单元</p>
                    <p className="text-xs text-stone-400 mt-2 leading-relaxed">新增沙发单个模块，如三人位、转角、贵妃榻等基本组成部分。</p>
                  </button>

                  <button onClick={() => setShowComboForm(true)} className="group bg-white p-10 rounded-[40px] border border-stone-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all text-left">
                    <div className="w-14 h-14 bg-stone-900 rounded-2xl flex items-center justify-center text-white mb-6 group-hover:rotate-12 transition-transform">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" /></svg>
                    </div>
                    <p className="font-bold text-xl text-stone-800">创建组合</p>
                    <p className="text-xs text-stone-400 mt-2 leading-relaxed">将录入的单元进行拼装，生成L型、U型或超大异形组合方案。</p>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="w-full flex justify-center py-6">
            <QuotationPreview data={state} description={description} />
          </div>
        )}
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          @page { size: A4; margin: 0; }
          body { background: white !important; margin: 0; padding: 0; }
          #root { width: 100%; }
          #quotation-print { 
            box-shadow: none !important; 
            margin: 0 !important; 
            max-width: none !important;
            width: 100% !important;
            border: none !important;
          }
          .lg\\:ml-96 { margin-left: 0 !important; padding: 0 !important; }
          .p-6, .lg\\:p-12 { padding: 0 !important; }
          /* Force page break after cover */
          #quotation-print > div:first-child { page-break-after: always; }
          /* Remove backgrounds and shadows */
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        }
      `}</style>
    </div>
  );
};

export default App;
