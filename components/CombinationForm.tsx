
import React, { useState, useMemo } from 'react';
import { Combination, SofaModule, MaterialGrade } from '../types';
import { INITIAL_GRADES } from '../constants';

interface CombinationFormProps {
  availableModules: SofaModule[];
  onAdd: (combo: Combination) => void;
  onCancel: () => void;
}

const CombinationForm: React.FC<CombinationFormProps> = ({ availableModules, onAdd, onCancel }) => {
  const [name, setName] = useState('');
  const [model, setModel] = useState('');
  const [selectedModuleIds, setSelectedModuleIds] = useState<string[]>([]);
  const [image, setImage] = useState<string | undefined>();
  const [isManualPrice, setIsManualPrice] = useState(false);
  const [manualPrices, setManualPrices] = useState<Record<MaterialGrade, number>>(() => {
    const p = {} as Record<MaterialGrade, number>;
    INITIAL_GRADES.forEach(g => p[g] = 0);
    return p;
  });

  const calculatedPrices = useMemo(() => {
    const totals = {} as Record<MaterialGrade, number>;
    INITIAL_GRADES.forEach(grade => {
      totals[grade] = selectedModuleIds.reduce((sum, id) => {
        const mod = availableModules.find(m => m.id === id);
        return sum + (mod?.prices[grade] || 0);
      }, 0);
    });
    return totals;
  }, [selectedModuleIds, availableModules]);

  const toggleModule = (id: string) => {
    setSelectedModuleIds(prev => 
      prev.includes(id) ? prev.filter(mid => mid !== id) : [...prev, id]
    );
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      id: crypto.randomUUID(),
      name,
      model,
      moduleIds: selectedModuleIds,
      image,
      isManualPrice,
      manualPrices: isManualPrice ? manualPrices : calculatedPrices
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-sm border border-stone-200 space-y-6">
      <div className="flex justify-between items-center border-b border-stone-100 pb-4">
        <h3 className="text-xl font-bold text-stone-800">创建组合方案</h3>
        <span className="text-xs text-stone-400 uppercase tracking-widest font-medium">Combination Set</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">组合方案名称</label>
          <input required value={name} onChange={e => setName(e.target.value)} className="w-full border-b border-stone-200 py-2 focus:border-stone-800 outline-none transition-all placeholder:text-stone-300" placeholder="例如：大L型组合 (A+B+C)" />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">组合型号</label>
          <input required value={model} onChange={e => setModel(e.target.value)} className="w-full border-b border-stone-200 py-2 focus:border-stone-800 outline-none transition-all placeholder:text-stone-300" placeholder="例如：COMBO-L01" />
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">选择构成模块</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-60 overflow-y-auto p-3 bg-stone-50 rounded-xl border border-stone-100">
          {availableModules.map(mod => (
            <div 
              key={mod.id} 
              onClick={() => toggleModule(mod.id)}
              className={`p-3 border rounded-xl cursor-pointer transition-all flex flex-col gap-1 ${selectedModuleIds.includes(mod.id) ? 'bg-stone-900 border-stone-900 text-white' : 'bg-white hover:border-stone-400 border-stone-200'}`}
            >
              <span className="text-xs font-semibold truncate">{mod.name}</span>
              <span className={`text-[9px] uppercase tracking-tighter ${selectedModuleIds.includes(mod.id) ? 'text-stone-400' : 'text-stone-400'}`}>{mod.model}</span>
            </div>
          ))}
          {availableModules.length === 0 && (
            <div className="col-span-full py-4 text-center text-stone-400 text-xs italic">请先添加单个模块</div>
          )}
        </div>
        {selectedModuleIds.length > 0 && (
          <div className="text-[10px] text-stone-500">已选中 {selectedModuleIds.length} 个模块</div>
        )}
      </div>

      <div className="space-y-3">
        <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">组合效果图</label>
        <div className="flex items-center gap-4">
          <label className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-stone-200 rounded-xl py-6 cursor-pointer hover:bg-stone-50 transition-colors">
            <span className="text-sm text-stone-500">点击上传组合图</span>
            <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
          </label>
          {image && <img src={image} className="h-20 w-20 object-cover rounded-xl shadow-sm border border-stone-200" alt="预览" />}
        </div>
      </div>

      <div className="bg-stone-50 p-6 rounded-2xl border border-stone-100 space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-stone-800 uppercase tracking-wider">价格设置</label>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input type="checkbox" checked={isManualPrice} onChange={e => setIsManualPrice(e.target.checked)} className="rounded border-stone-300 text-stone-900 focus:ring-stone-900" />
              <span className="text-xs text-stone-600 group-hover:text-stone-900 transition-colors">手动修改总价</span>
            </label>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {INITIAL_GRADES.map(grade => (
            <div key={grade} className="space-y-1">
              <label className="block text-[9px] text-stone-500 font-medium">{grade}</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-xs">¥</span>
                <input 
                  type="number" 
                  disabled={!isManualPrice}
                  value={isManualPrice ? manualPrices[grade] || '' : calculatedPrices[grade] || ''} 
                  onChange={e => setManualPrices({...manualPrices, [grade]: Number(e.target.value)})}
                  className={`w-full pl-7 pr-3 py-1.5 border rounded-lg text-sm outline-none transition-all ${!isManualPrice ? 'bg-stone-100 border-transparent text-stone-500' : 'bg-white border-stone-200 focus:ring-1 focus:ring-stone-800'}`}
                  placeholder="0"
                />
              </div>
            </div>
          ))}
        </div>
        {!isManualPrice && (
          <p className="text-[9px] text-stone-400 italic">* 当前价格由所选模块自动累计</p>
        )}
      </div>

      <div className="flex gap-3 pt-6 border-t border-stone-100">
        <button type="submit" disabled={selectedModuleIds.length === 0} className="flex-[2] bg-stone-900 text-white py-2.5 rounded-xl font-medium hover:bg-stone-800 transition-all shadow-lg shadow-stone-200 disabled:opacity-50 disabled:shadow-none">保存组合方案</button>
        <button type="button" onClick={onCancel} className="flex-1 border border-stone-200 text-stone-600 py-2.5 rounded-xl font-medium hover:bg-stone-50 transition-all">取消</button>
      </div>
    </form>
  );
};

export default CombinationForm;
