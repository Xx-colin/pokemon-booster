import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const API_BASE = "https://api.scrydex.com/api/v1";

export default function PokemonPocketApp() {
  const [cards, setCards] = useState([]);
  const [pack, setPack] = useState([]);
  const [phase, setPhase] = useState('idle'); // idle, opening, reveal
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/cards?set=A1`)
      .then(res => res.json())
      .then(data => {
        setCards(data.data);
        setLoading(false);
      });
  }, []);

  const openPack = () => {
    const shuffled = [...cards].sort(() => 0.5 - Math.random());
    setPack(shuffled.slice(0, 5));
    setPhase('opening');
    
    // Automatisch nach der "Aufreiß"-Animation zu den Karten wechseln
    setTimeout(() => setPhase('reveal'), 1200);
  };

  if (loading) return <div className="h-screen bg-black flex items-center justify-center text-white font-mono">Lade Daten von Scrydex...</div>;

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white flex flex-col items-center justify-center p-4 overflow-hidden">
      
      <AnimatePresence mode="wait">
        {phase === 'idle' && (
          <motion.div 
            key="booster"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ scale: 1.5, opacity: 0, filter: 'blur(10px)' }}
            className="flex flex-col items-center"
          >
            <div className="relative group cursor-pointer" onClick={openPack}>
              {/* Booster Pack Visuell */}
              <div className="absolute -inset-4 bg-blue-500/20 blur-3xl group-hover:bg-blue-500/40 transition duration-500"></div>
              <div className="relative w-64 h-96 bg-gradient-to-b from-blue-600 to-blue-900 rounded-[2rem] border-4 border-white/20 shadow-2xl flex flex-col items-center justify-between p-8 overflow-hidden">
                <div className="absolute top-0 w-full h-8 bg-black/20 flex justify-center items-center">
                  <div className="w-1/2 h-1 bg-white/30 rounded-full"></div>
                </div>
                <img src="https://scrydex.com/icons/logo.png" className="w-24 mt-10 drop-shadow-lg" alt="Logo" />
                <h1 className="text-xl font-black italic tracking-widest text-blue-100 uppercase">Genetic Apex</h1>
                <div className="bg-white/10 backdrop-blur-md px-6 py-2 rounded-full text-xs font-bold border border-white/20 animate-bounce">
                  ZUM ÖFFNEN TIPPEN
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {phase === 'opening' && (
          <motion.div 
            key="opening"
            initial={{ scale: 1 }}
            animate={{ scale: 1.2, rotate: [0, -1, 1, -1, 0] }}
            className="text-4xl font-black italic"
          >
            ÖFFNE BOOSTER...
          </motion.div>
        )}

        {phase === 'reveal' && (
          <motion.div 
            key="reveal" 
            className="w-full max-w-6xl flex flex-col items-center"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          >
            <div className="flex flex-wrap justify-center gap-6 mb-12">
              {pack.map((card, i) => (
                <Card key={i} card={card} index={i} />
              ))}
            </div>
            <button 
              onClick={() => setPhase('idle')}
              className="px-8 py-3 bg-white text-black font-bold rounded-full hover:scale-105 transition active:scale-95"
            >
              NOCH EIN PACK ÖFFNEN
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Card({ card, index }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <motion.div
      initial={{ y: 100, opacity: 0, rotateY: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: index * 0.15, type: 'spring', damping: 20 }}
      className="relative w-44 h-64 perspective-1000"
      onClick={() => setFlipped(true)}
    >
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.7, type: 'spring', stiffness: 200, damping: 25 }}
        className="w-full h-full relative preserve-3d cursor-pointer"
      >
        {/* RÜCKSEITE */}
        <div className="absolute inset-0 backface-hidden bg-[#1a1b1e] border-2 border-white/10 rounded-2xl flex items-center justify-center shadow-2xl">
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/20 to-transparent"></div>
           <div className="w-16 h-16 border-2 border-blue-500/50 rounded-full flex items-center justify-center">
              <div className="w-10 h-1 bg-blue-500/50"></div>
           </div>
        </div>

        {/* VORDERSEITE */}
        <div className="absolute inset-0 backface-hidden rotate-y-180 bg-white rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(255,255,255,0.1)]">
          <img 
            src={`https://assets.scrydex.com/cards/${card.set}/${card.number}.png`} 
            alt={card.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          {/* Holografischer Glanz-Effekt */}
          <motion.div 
            animate={{ x: [-100, 200], opacity: [0, 0.3, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent -skew-x-12"
          />
        </div>
      </motion.div>
    </motion.div>
  );
}
