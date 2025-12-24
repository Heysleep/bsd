
import React, { useState } from 'react';
import { SofaModule, MaterialGrade } from '../types';
import { INITIAL_GRADES } from '../constants';

interface ModuleFormProps {
  onAdd: (module: SofaModule) => void;
  onCancel: () => void;
}

const ModuleForm: React.FC<ModuleFormProps> = ({ onAdd, onCancel }) => {
  const [name, setName] = useState('');
  const [model, setModel] = useState('');
  const [length, setLength] = useState(0);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [image, setImage] = useState<string | undefined>();
  const [prices, setPrices] = useState<Record<MaterialGrade, number>>(() => {
    const p = {} as Record<MaterialGrade, number>;
    INITIAL_GRADES.forEach(g => p[g] = 0);
    return p;
  });

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
      dimensions: { length, width, height },
      image,
      prices
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-sm border border-stone-200 space-y-6">
      <div className="flex justify-between items-center border-b border-stone-100 pb-4">
        <h3 className="text-xl font-bold text-stone-800">添加单个模块</h3>
        <span className="text-xs text-stone-400 uppercase tracking-widest font-medium">Element Detail</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">模块名称</label>
          <input required value={name} onChange={e => setName(e.target.value)} className="w-full border-b border-stone-200 py-2 focus:border-stone-800 outline-none transition-all placeholder:text-stone-300" placeholder="例如：三人位中间件" />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">型号/编码</label>
          <input required value={model} onChange={e => setModel(e.target.value)} className="w-full border-b border-stone-200 py-2 focus:border-stone-800 outline-none transition-all placeholder:text-stone-300" placeholder="例如：M-01-3S" />
        </div>
      </div>

      <div className="bg-stone-50 p-4 rounded-xl space-y-3">
        <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">外形尺寸 (厘米)</label>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <span className="text-[9px] text-stone-400 block mb-1">长度 (L)</span>
            <input type="number" required value={length || ''} onChange={e => setLength(Number(e.target.value))} className="w-full bg-white border border-stone-200 px-3 py-1.5 rounded-lg text-sm focus:ring-1 focus:ring-stone-800 outline-none" />
          </div>
          <div>
            <span className="text-[9px] text-stone-400 block mb-1">深度 (W)</span>
            <input type="number" required value={width || ''} onChange={e => setWidth(Number(e.target.value))} className="w-full bg-white border border-stone-200 px-3 py-1.5 rounded-lg text-sm focus:ring-1 focus:ring-stone-800 outline-none" />
          </div>
          <div>
            <span className="text-[9px] text-stone-400 block mb-1">高度 (H)</span>
            <input type="number" required value={height || ''} onChange={e => setHeight(Number(e.target.value))} className="w-full bg-white border border-stone-200 px-3 py-1.5 rounded-lg text-sm focus:ring-1 focus:ring-stone-800 outline-none" />
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">上传图片</label>
        <div className="flex items-center gap-4">
          <label className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-stone-200 rounded-xl py-6 cursor-pointer hover:bg-stone-50 transition-colors">
            <span className="text-sm text-stone-500">点击上传图片</span>
            <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
          </label>
          {image && <img src={image} className="h-20 w-20 object-cover rounded-xl shadow-sm border border-stone-200" alt="预览" />}
        </div>
      </div>

      <div className="space-y-4">
        <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">分等级报价 (人民币)</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {INITIAL_GRADES.map(grade => (
            <div key={grade} className="space-y-1">
              <label className="block text-[9px] text-stone-500 font-medium">{grade}</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-xs">¥</span>
                <input 
                  type="number" 
                  value={prices[grade] || ''} 
                  onChange={e => setPrices({...prices, [grade]: Number(e.target.value)})}
                  className="w-full pl-7 pr-3 py-1.5 bg-white border border-stone-200 rounded-lg text-sm focus:ring-1 focus:ring-stone-800 outline-none"
                  placeholder="0"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-3 pt-6 border-t border-stone-100">
        <button type="submit" className="flex-[2] bg-stone-900 text-white py-2.5 rounded-xl font-medium hover:bg-stone-800 transition-all shadow-lg shadow-stone-200">保存模块</button>
        <button type="button" onClick={onCancel} className="flex-1 border border-stone-200 text-stone-600 py-2.5 rounded-xl font-medium hover:bg-stone-50 transition-all">取消</button>
      </div>
    </form>
  );
};

export default ModuleForm;
