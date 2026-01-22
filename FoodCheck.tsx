import React, { useState, useRef } from 'react';
import { analyzeFood } from '../services/geminiService';
import { FoodAnalysis } from '../types';
import { 
  Search, 
  Camera, 
  Upload, 
  Sparkles, 
  Flame, 
  Dumbbell, 
  Wheat, 
  Droplets,
  ArrowRight,
  Info,
  UtensilsCrossed
} from 'lucide-react';

const FoodCheck: React.FC = () => {
  const [inputType, setInputType] = useState<'text' | 'image'>('text');
  const [textInput, setTextInput] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<FoodAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setAnalysis(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      let result;
      if (inputType === 'text') {
        if (!textInput.trim()) {
          setIsLoading(false);
          return;
        }
        result = await analyzeFood(textInput);
      } else {
        if (!image) {
          setIsLoading(false);
          return;
        }
        result = await analyzeFood({ base64: image });
      }
      setAnalysis(result);
    } catch (error) {
      console.error(error);
      alert('Failed to analyze food. Try being more specific or use a clearer photo.');
    } finally {
      setIsLoading(false);
    }
  };

  const MacroBar = ({ label, value, color, icon: Icon }: any) => (
    <div className="space-y-2">
      <div className="flex justify-between items-center text-sm">
        <div className="flex items-center gap-2 font-medium">
          <Icon size={14} className={color.replace('bg-', 'text-')} />
          {label}
        </div>
        <span className="font-bold">{value}g</span>
      </div>
      <div className="h-2 w-full bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
        <div 
          className={`h-full ${color} transition-all duration-1000`} 
          style={{ width: `${Math.min((value / 100) * 100, 100)}%` }}
        ></div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h1 className="text-3xl font-bold">Food Check</h1>
        <p className="text-gray-500 dark:text-slate-400">Get instant nutritional stats for any meal.</p>
      </header>

      <div className="flex p-1 bg-gray-100 dark:bg-slate-900 rounded-2xl w-fit">
        <button 
          onClick={() => { setInputType('text'); setAnalysis(null); }}
          className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${inputType === 'text' ? 'bg-white dark:bg-slate-800 shadow-sm' : 'text-gray-500'}`}
        >
          Type Description
        </button>
        <button 
          onClick={() => { setInputType('image'); setAnalysis(null); }}
          className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${inputType === 'image' ? 'bg-white dark:bg-slate-800 shadow-sm' : 'text-gray-500'}`}
        >
          Snap a Photo
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-slate-800">
            {inputType === 'text' ? (
              <div className="space-y-4">
                <textarea
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="Example: Two scrambled eggs with whole grain toast and half an avocado..."
                  className="w-full h-40 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl p-4 focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
                />
                <button
                  onClick={handleAnalyze}
                  disabled={isLoading || !textInput.trim()}
                  className="w-full py-4 bg-emerald-500 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-600 transition-all disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Sparkles size={18} />
                      Analyze Meal
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="group relative border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-2xl aspect-video flex flex-col items-center justify-center cursor-pointer hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/10 transition-all overflow-hidden"
                >
                  {image ? (
                    <img src={image} className="absolute inset-0 w-full h-full object-cover" alt="Meal" />
                  ) : (
                    <>
                      <Camera size={40} className="text-gray-300 group-hover:text-emerald-500 mb-2 transition-colors" />
                      <p className="font-bold text-gray-400">Click to upload photo</p>
                    </>
                  )}
                  <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
                </div>
                <button
                  onClick={handleAnalyze}
                  disabled={isLoading || !image}
                  className="w-full py-4 bg-emerald-500 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-600 transition-all disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Sparkles size={18} />
                      Scan Photo
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          {analysis ? (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-slate-800 animate-in slide-in-from-bottom-4">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-bold capitalize">{analysis.foodName}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full font-bold">
                      {analysis.isEstimate ? 'Estimate' : 'Verified'}
                    </span>
                  </div>
                </div>
                <div className="bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 px-4 py-2 rounded-2xl flex items-center gap-2 font-bold">
                  <Flame size={20} />
                  {analysis.calories} kcal
                </div>
              </div>

              <div className="space-y-6 mb-8">
                <MacroBar label="Protein" value={analysis.protein} color="bg-emerald-500" icon={Dumbbell} />
                <MacroBar label="Carbs" value={analysis.carbs} color="bg-blue-500" icon={Wheat} />
                <MacroBar label="Fats" value={analysis.fats} color="bg-amber-500" icon={Droplets} />
              </div>

              <div className="bg-gray-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-gray-100 dark:border-slate-800">
                <div className="flex items-center gap-2 text-sm font-bold mb-2">
                  <Info size={16} className="text-emerald-500" />
                  AI Nutritional Note
                </div>
                <p className="text-sm text-gray-600 dark:text-slate-400 italic">"{analysis.notes}"</p>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-10 bg-gray-100/50 dark:bg-slate-900/30 rounded-3xl border border-dashed border-gray-300 dark:border-slate-800 text-center text-gray-400">
              <UtensilsCrossed size={48} className="mb-4 opacity-20" />
              <p className="font-bold">Waiting for your input</p>
              <p className="text-sm mt-2 max-w-xs">Describe your meal or snap a photo to see nutritional facts.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FoodCheck;