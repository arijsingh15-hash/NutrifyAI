
import React, { useState } from 'react';
import { searchFoodDatabase } from '../services/geminiService';
import { FoodDatabaseResult } from '../types';
import { 
  Search, 
  Database, 
  ExternalLink, 
  Sparkles, 
  BookOpen, 
  ChevronRight, 
  Info, 
  X,
  AlertTriangle,
  Zap,
  CheckCircle2
} from 'lucide-react';

const FoodDatabase: React.FC = () => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<FoodDatabaseResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (searchQuery: string = query) => {
    const trimmed = searchQuery.trim();
    if (!trimmed) return;
    
    setIsLoading(true);
    setResult(null);
    setError(null);
    
    try {
      const data = await searchFoodDatabase(trimmed);
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-24">
      <header className="space-y-3">
        <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">Nutrition Engine</h1>
        <p className="text-slate-500 dark:text-slate-400 text-lg max-w-xl">
          Get verified, real-time nutritional insights for any food or brand.
        </p>
      </header>

      {/* Search Bar */}
      <div className="relative group max-w-3xl">
        <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
          <Search className="text-slate-400 group-focus-within:text-emerald-500 transition-all duration-300" size={24} />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="e.g. Fairlife Chocolate Milk or Chipotle Steak Bowl..."
          className="w-full bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-[2rem] pl-16 pr-40 py-7 shadow-2xl shadow-slate-200/50 dark:shadow-none focus:border-emerald-500/50 focus:ring-8 focus:ring-emerald-500/5 outline-none transition-all text-xl font-medium"
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-3">
          {query && (
            <button onClick={() => setQuery('')} className="p-2 text-slate-300 hover:text-slate-500">
              <X size={20} />
            </button>
          )}
          <button
            onClick={() => handleSearch()}
            disabled={isLoading || !query.trim()}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3.5 rounded-2xl font-bold transition-all disabled:opacity-20 shadow-lg shadow-emerald-500/25"
          >
            {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Search'}
          </button>
        </div>
      </div>

      {isLoading && (
        <div className="max-w-3xl space-y-6">
          <div className="h-80 bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 animate-pulse flex flex-col items-center justify-center">
            <Sparkles className="text-emerald-200 dark:text-emerald-900 mb-4 animate-spin-slow" size={48} />
            <p className="text-slate-400 font-bold tracking-wide">QUERYING WEB SOURCES...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="max-w-3xl bg-rose-50 dark:bg-rose-950/20 border-2 border-rose-100 dark:border-rose-900/30 p-8 rounded-3xl flex items-center gap-5 text-rose-600 animate-in zoom-in-95">
          <AlertTriangle className="shrink-0" size={28} />
          <p className="font-bold text-lg">{error}</p>
        </div>
      )}

      {!result && !isLoading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl">
          {[
            { n: 'Budget Protein', i: '🍗', q: 'Cheapest high protein sources for students' },
            { n: 'Coffee Macros', i: '☕', q: 'Nutritional info for Starbucks Oat Milk Latte' },
            { n: 'Healthy Takeout', i: '🥗', q: 'Lowest calorie high protein meals at Chipotle' },
            { n: 'Snack Check', i: '🥨', q: 'Macros for Kind Bars vs RXBars' },
          ].map((cat) => (
            <button
              key={cat.n}
              onClick={() => { setQuery(cat.q); handleSearch(cat.q); }}
              className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 text-left hover:border-emerald-500 hover:shadow-2xl transition-all group flex flex-col justify-between h-40"
            >
              <span className="text-3xl">{cat.i}</span>
              <div>
                <h3 className="font-bold text-slate-800 dark:text-slate-200">{cat.n}</h3>
                <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">Tap to search <ChevronRight size={10} /></p>
              </div>
            </button>
          ))}
        </div>
      )}

      {result && (
        <div className="max-w-4xl space-y-8 animate-in slide-in-from-bottom-12 duration-1000">
          <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-12 border border-slate-100 dark:border-slate-800 shadow-2xl shadow-slate-200/40 dark:shadow-none relative overflow-hidden">
            {/* Design Accents */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[100px] -mr-32 -mt-32" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/5 blur-[80px] -ml-24 -mb-24" />
            
            <div className="flex items-center gap-2 text-emerald-500 font-black text-xs uppercase tracking-[0.2em] mb-10">
              <Zap size={16} fill="currentColor" />
              Live AI Grounding Result
            </div>

            <div className="prose prose-slate dark:prose-invert max-w-none">
              <div className="whitespace-pre-wrap text-slate-700 dark:text-slate-300 leading-relaxed space-y-4">
                {/* We rely on the structured prompt to make this look good */}
                {result.text.split('\n').map((line, i) => {
                  if (line.startsWith('###')) return <h2 key={i} className="text-3xl font-black text-slate-900 dark:text-white mt-8 mb-4">{line.replace('###', '')}</h2>;
                  if (line.startsWith('**Calories**')) return (
                    <div key={i} className="flex flex-wrap gap-4 my-8">
                      {line.split('|').map((stat, si) => (
                        <div key={si} className="bg-slate-50 dark:bg-slate-800 px-6 py-3 rounded-2xl border border-slate-100 dark:border-slate-700">
                          <span className="font-black text-emerald-500 text-lg">{stat.trim()}</span>
                        </div>
                      ))}
                    </div>
                  );
                  if (line.startsWith('####')) return <h4 key={i} className="text-lg font-bold text-slate-800 dark:text-slate-200 mt-6 mb-2">{line.replace('####', '')}</h4>;
                  if (line.startsWith('*')) return <div key={i} className="flex items-start gap-3 mb-2 text-slate-600 dark:text-slate-400"><CheckCircle2 size={18} className="text-emerald-400 mt-1 shrink-0" /> <span>{line.replace('*', '')}</span></div>;
                  return <p key={i} className="text-lg">{line}</p>;
                })}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {result.sources.length > 0 && (
              <div className="bg-slate-50 dark:bg-slate-900/50 rounded-[2.5rem] p-10 border border-slate-100 dark:border-slate-800">
                <h3 className="text-slate-900 dark:text-white font-black text-sm uppercase tracking-widest mb-8 flex items-center gap-2">
                  <BookOpen size={18} className="text-emerald-500" />
                  Evidence Map
                </h3>
                <div className="grid gap-3">
                  {result.sources.slice(0, 4).map((source, i) => (
                    <a
                      key={i}
                      href={source.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between bg-white dark:bg-slate-900 px-6 py-5 rounded-[1.5rem] text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-emerald-500 border border-slate-100 dark:border-slate-800 transition-all hover:shadow-xl hover:-translate-y-1 group"
                    >
                      <span className="truncate pr-4">{source.title || 'Source'}</span>
                      <ExternalLink size={16} className="shrink-0 opacity-20 group-hover:opacity-100 transition-opacity" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-emerald-500 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-emerald-500/20 flex flex-col justify-between">
              <div>
                <Info size={32} className="mb-6 opacity-30" />
                <h3 className="text-2xl font-black mb-4 tracking-tight">Data Accuracy</h3>
                <p className="text-emerald-50 text-lg leading-snug opacity-90">
                  This report was generated using real-time grounding. We cross-referenced web data to ensure brand-specific accuracy.
                </p>
              </div>
              <div className="mt-8 flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] opacity-50">
                <Database size={14} />
                Verified Cloud Sync
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FoodDatabase;
