
import React from 'react';
import { QuotationState, MaterialGrade } from '../types';
import { INITIAL_GRADES } from '../constants';

interface QuotationPreviewProps {
  data: QuotationState;
  description: string;
}

const QuotationPreview: React.FC<QuotationPreviewProps> = ({ data, description }) => {
  return (
    <div id="quotation-print" className="bg-white min-h-[1123px] w-full max-w-[794px] mx-auto shadow-2xl overflow-hidden text-stone-900 p-0 relative print:shadow-none print:m-0">
      
      {/* Cover Page - Optimized with Image */}
      <div className="h-[1123px] flex flex-col p-0 border-b border-stone-100 relative bg-white">
        {/* Top Branding Section */}
        <div className="absolute top-16 left-16 right-16 flex justify-between items-start z-10">
          <div className="max-w-[180px]">
            {data.companyLogo ? (
              <img src={data.companyLogo} alt="Logo" className="w-full object-contain" />
            ) : (
              <div className="font-serif text-3xl tracking-widest font-bold border-b-2 border-stone-900 pb-1">
                {data.companyName}
              </div>
            )}
          </div>
          <div className="text-right text-[10px] uppercase tracking-[0.2em] text-stone-400 font-medium">
            MILANO DESIGN COLLECTION<br />
            REF: QT-{new Date().getFullYear()}-{Math.floor(Math.random() * 1000).toString().padStart(3, '0')}
          </div>
        </div>

        {/* Cover Content - Split Layout */}
        <div className="flex-1 flex flex-col mt-40">
          <div className="px-16 space-y-6 mb-16">
            <div className="space-y-1">
              <span className="text-stone-400 uppercase tracking-[0.6em] text-[10px] font-bold">The New Aesthetic</span>
              <h1 className="font-serif text-7xl font-bold tracking-tighter text-stone-800 leading-none">
                {data.sofaModelName}
              </h1>
            </div>
            <div className="w-20 h-[3px] bg-stone-900" />
            <p className="max-w-md text-stone-500 font-light leading-relaxed text-lg italic">
              {description}
            </p>
          </div>

          {/* Large Hero Image */}
          <div className="flex-1 relative overflow-hidden mx-16 mb-20 rounded-t-[40px] shadow-2xl">
            {data.coverImage ? (
              <img src={data.coverImage} className="w-full h-full object-cover" alt="Cover" />
            ) : (
              <div className="w-full h-full bg-stone-50 flex items-center justify-center border border-stone-100">
                <span className="text-stone-300 font-serif italic text-2xl">Visual Excellence</span>
              </div>
            )}
            <div className="absolute bottom-10 left-10 text-white mix-blend-difference">
              <p className="text-[10px] tracking-[0.3em] font-bold uppercase opacity-80">Italian Craftsmanship — 意式匠心</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Modules Page */}
      <div className="min-h-[1123px] p-20 bg-white">
        <div className="mb-14 flex justify-between items-end border-b border-stone-100 pb-6">
          <h2 className="font-serif text-4xl font-bold text-stone-800">模块配置与报价</h2>
          <span className="text-[10px] font-bold text-stone-300 uppercase tracking-[0.3em]">Configuration Catalog</span>
        </div>
        
        <div className="space-y-16">
          {/* Individual Modules */}
          <section>
            <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-stone-300 mb-8 flex items-center gap-6">
              <span className="whitespace-nowrap">ELEMENTS 单元模块</span>
              <div className="flex-1 h-[1px] bg-stone-100" />
            </h3>
            
            <div className="space-y-12">
              {data.modules.map(mod => (
                <div key={mod.id} className="grid grid-cols-12 gap-10 items-start">
                  <div className="col-span-4 aspect-square bg-stone-50 rounded-2xl overflow-hidden border border-stone-100">
                    {mod.image ? <img src={mod.image} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-stone-200 text-[10px]">IMAGE N/A</div>}
                  </div>
                  <div className="col-span-8">
                    <div className="flex justify-between border-b border-stone-100 pb-2 mb-4">
                      <span className="text-xl font-bold text-stone-800 tracking-tight">{mod.name}</span>
                      <span className="text-[10px] font-bold text-stone-300 self-end mb-1 uppercase tracking-widest">{mod.model}</span>
                    </div>
                    <div className="flex gap-6 text-[10px] text-stone-400 font-medium mb-6 uppercase tracking-widest">
                      <span>L {mod.dimensions.length}</span>
                      <span>D {mod.dimensions.width}</span>
                      <span>H {mod.dimensions.height}</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-x-10 gap-y-3">
                      {INITIAL_GRADES.map(grade => (
                        <div key={grade} className="flex justify-between items-baseline border-b border-stone-50 pb-1">
                          <span className="text-[9px] text-stone-400 font-bold uppercase tracking-tighter">{grade}</span>
                          <span className="text-sm font-bold text-stone-700">{data.currency} {mod.prices[grade].toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Combinations */}
          {data.combinations.length > 0 && (
            <section className="pt-8">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-stone-300 mb-8 flex items-center gap-6">
                <span className="whitespace-nowrap">SETS 组合方案</span>
                <div className="flex-1 h-[1px] bg-stone-100" />
              </h3>
              
              <div className="grid grid-cols-2 gap-10">
                {data.combinations.map(combo => (
                  <div key={combo.id} className="space-y-6">
                    <div className="aspect-[16/10] bg-stone-50 rounded-2xl overflow-hidden border border-stone-100 shadow-sm">
                      {combo.image ? <img src={combo.image} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-stone-200 text-xs italic">N/A</div>}
                    </div>
                    <div>
                      <div className="border-b border-stone-100 pb-2 flex justify-between items-baseline mb-4">
                         <span className="text-lg font-bold text-stone-800">{combo.name}</span>
                         <span className="text-[9px] font-bold text-stone-300 uppercase tracking-widest">{combo.model}</span>
                      </div>
                      <div className="space-y-2">
                        {INITIAL_GRADES.map(grade => (
                          <div key={grade} className="flex justify-between items-center text-xs">
                            <span className="text-stone-400 font-bold text-[9px] uppercase tracking-tighter">{grade}</span>
                            <span className="font-bold text-stone-700">{data.currency} {combo.manualPrices[grade].toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Final Disclaimer without Page Number */}
        <div className="mt-24 pt-10 border-t border-stone-100 flex justify-between items-start">
           <div className="text-[9px] text-stone-300 leading-relaxed tracking-wider max-w-[400px] uppercase font-medium">
             Prices include standard VAT. Shipping and installation handled by {data.companyName}.
             All measurements ±2cm tolerance. Quote valid until year end.
             Original Italian design concepts.
           </div>
           <div className="text-right">
             <p className="font-serif italic text-xl text-stone-800 mb-1">{data.companyName}</p>
             <p className="text-[8px] tracking-[0.4em] text-stone-300 uppercase font-bold">Authorized Document</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default QuotationPreview;
