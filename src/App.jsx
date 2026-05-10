import React, { useState } from 'react';
import { Calculator, Ruler, Layers, Settings, ArrowRight, BookOpen, Info, Lightbulb, ChevronDown, ChevronUp, X, Loader2 } from 'lucide-react';

const InputField = ({ label, value, setter, icon: Icon, min = 1 }) => (
  <div className="flex flex-col space-y-2">
    <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
      <Icon className="w-4 h-4 text-emerald-400" />
      {label}
    </label>
    <input
      type="number"
      min={min}
      value={value}
      onChange={(e) => setter(e.target.value === '' ? '' : Number(e.target.value))}
      onKeyDown={(e) => {
        if (['e', 'E', '+', '-'].includes(e.key)) {
          e.preventDefault();
        }
      }}
      className="bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all shadow-inner"
    />
  </div>
);

function App() {
  const [numPillars, setNumPillars] = useState(32);
  const [rodLength, setRodLength] = useState(28);
  const [pillarLength, setPillarLength] = useState(14);
  const [rodsPerPillar, setRodsPerPillar] = useState(8);
  const [showTutorial, setShowTutorial] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  
  const [activeValues, setActiveValues] = useState({
    numPillars: 32,
    rodLength: 28,
    pillarLength: 14,
    rodsPerPillar: 8
  });

  const handleCalculate = () => {
    setIsCalculating(true);
    setTimeout(() => {
      setActiveValues({ numPillars, rodLength, pillarLength, rodsPerPillar });
      setIsCalculating(false);
    }, 600); // 600ms loading effect
  };

  // Calculations based on submitted values
  const totalPieces = (activeValues.numPillars || 0) * (activeValues.rodsPerPillar || 0);
  const piecesPerRod = Math.floor((activeValues.rodLength || 0) / (activeValues.pillarLength || 1));
  const totalRods = piecesPerRod > 0 ? totalPieces / piecesPerRod : 0;

  return (
    <div className="min-h-screen py-12 px-4 md:px-8 bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 font-sans relative overflow-x-hidden">
      
      {/* Top Left Tutorial Button */}
      <div className="absolute top-4 left-4 md:top-8 md:left-8 z-40">
        <button 
          onClick={() => setShowTutorial(true)}
          className="flex items-center gap-2 text-emerald-400 hover:text-white font-medium bg-emerald-500/10 hover:bg-emerald-500/30 px-5 py-2.5 rounded-full transition-all border border-emerald-500/20 backdrop-blur-md shadow-lg"
        >
          <BookOpen className="w-5 h-5" />
          <span className="hidden sm:inline">Tutorial & Tips</span>
        </button>
      </div>

      <div className="max-w-4xl mx-auto space-y-12 mt-8 md:mt-0">
        
        {/* Calculator Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          
          {/* Left Side: Inputs */}
          <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 shadow-2xl">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-emerald-500/20 rounded-2xl">
                <Calculator className="w-8 h-8 text-emerald-400" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">pilllars-gh</h1>
                <p className="text-sm text-slate-400 mt-1">Calculate rods needed for your pillars</p>
              </div>
            </div>

            <div className="space-y-6">
              <InputField 
                label="Total Number of Pillars" 
                value={numPillars} 
                setter={setNumPillars} 
                icon={Layers} 
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField 
                  label="Rod Length (ft)" 
                  value={rodLength} 
                  setter={setRodLength} 
                  icon={Ruler} 
                />
                <InputField 
                  label="Pillar Length (ft)" 
                  value={pillarLength} 
                  setter={setPillarLength} 
                  icon={Ruler} 
                />
              </div>
              <InputField 
                label="Rods per Pillar" 
                value={rodsPerPillar} 
                setter={setRodsPerPillar} 
                icon={Settings} 
              />
              
              <button
                onClick={handleCalculate}
                disabled={isCalculating}
                className="w-full mt-4 bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-500/50 text-slate-900 font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-emerald-500/25 flex items-center justify-center gap-2"
              >
                {isCalculating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Calculator className="w-5 h-5" />}
                {isCalculating ? 'Calculating...' : 'Calculate Estimate'}
              </button>
            </div>
          </div>

          {/* Right Side: Results */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-8 shadow-xl shadow-emerald-900/20 text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
                <Calculator className="w-32 h-32 transform rotate-12" />
              </div>
              <h2 className="text-emerald-100 font-medium text-lg mb-2 relative z-10">Total Rods Needed</h2>
              {isCalculating ? (
                <div className="flex items-center gap-4 relative z-10 h-16 mt-2">
                  <div className="h-12 w-24 bg-emerald-100/20 rounded-xl animate-pulse"></div>
                  <div className="h-6 w-12 bg-emerald-100/20 rounded-md animate-pulse"></div>
                </div>
              ) : (
                <div className="flex items-end gap-2 relative z-10 h-16 mt-2">
                  <span className="text-5xl sm:text-6xl font-black tracking-tight">{Math.ceil(totalRods)}</span>
                  <span className="text-emerald-100 mb-2 font-medium">rods</span>
                </div>
              )}
              {totalRods % 1 !== 0 && !isCalculating && (
                <p className="text-emerald-100/80 text-sm mt-2 relative z-10">
                  Exact calculation: {totalRods.toFixed(2)} rods
                </p>
              )}
            </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tutorial Drawer */}
      {showTutorial && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setShowTutorial(false)}
          ></div>
          
          {/* Drawer Sliding from Left */}
          <div className="relative w-full max-w-md h-full bg-slate-900/95 backdrop-blur-xl border-r border-slate-700/50 p-6 md:p-8 shadow-2xl overflow-y-auto animate-slide-in-left">
            <button 
              onClick={() => setShowTutorial(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-white bg-slate-800/50 p-2 rounded-full transition-all"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="flex items-center gap-3 border-b border-slate-700/50 pb-4 mt-2">
              <BookOpen className="w-7 h-7 text-emerald-400" />
              <h2 className="text-2xl font-bold text-white tracking-tight">How it Works</h2>
            </div>

            <div className="space-y-8 mt-8">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Info className="w-5 h-5 text-emerald-500" />
                  The Calculation
                </h3>
                <p className="leading-relaxed text-sm text-slate-400">
                  This tool determines exactly how many full lengths of steel rods you need to buy to construct your concrete pillars. It computes the total pieces required, and mathematically slices your available rod lengths to minimize waste.
                </p>
                <ul className="list-disc pl-5 space-y-2 text-sm text-slate-400">
                  <li><strong>Total Pieces:</strong> Number of pillars × rods per pillar.</li>
                  <li><strong>Pieces per Rod:</strong> Derived by dividing your total Rod Length by your desired Pillar Length.</li>
                  <li><strong>Total Rods:</strong> Total Pieces ÷ Pieces per Rod.</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-yellow-400" />
                  Pro Tips
                </h3>
                <ul className="space-y-3 text-sm">
                  <li className="flex gap-3 bg-slate-800/30 p-4 rounded-xl border border-slate-700/30">
                    <span className="text-xl">📏</span>
                    <span className="text-slate-400">Standard steel rods are usually <strong>30ft or 40ft long</strong>. Be sure to verify the standard length at your local building materials market before calculating.</span>
                  </li>
                  <li className="flex gap-3 bg-slate-800/30 p-4 rounded-xl border border-slate-700/30">
                    <span className="text-xl">⚠️</span>
                    <span className="text-slate-400">Always buy an extra <strong>5% to 10%</strong> to account for overlap joints (lapping) and cutting wastage.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
