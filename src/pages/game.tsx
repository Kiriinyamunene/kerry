import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import DinoGame from '@/components/game/DinoGame';
import Link from 'next/link';
import Head from 'next/head';

const GamePage = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [highScore, setHighScore] = useState(0);

  useEffect(() => {
    // Get high score from localStorage if available
    const savedHighScore = localStorage.getItem('dinoGameHighScore');
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore));
    }
  }, []);

  const handleGameOver = (score: number) => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('dinoGameHighScore', score.toString());
    }
    setIsPlaying(false);
  };

  return (
    <>
      <Head>
        <title>Cyber Runner | Kerry's Portfolio</title>
        <meta name="description" content="Play Cyber Runner - a futuristic take on the classic browser dinosaur game" />
      </Head>
      
      <div className="min-h-screen h-screen flex flex-col bg-[#070C14] text-[#00FF66] font-mono">
        {/* Game container - takes full height */}
        <div className="flex-1 flex flex-col overflow-hidden p-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-2"
          >
            <h1 className="text-3xl font-mono mb-1 text-[#00FF66] border-b border-[#00FF66]/30 pb-1 inline-block">
              CYBER_RUNNER.EXE
            </h1>
          </motion.div>
          
          <div className="flex-1 flex items-center justify-center">
            <div className="w-full h-full max-w-5xl crt-edge relative">
              {/* Pass navigation related props to appear inside the game */}
              <div className="absolute top-2 left-2 z-20 flex items-center space-x-4">
                <Link href="/" className="text-[#00FF66] hover:text-[#00FF66]/80 transition-colors flex items-center gap-1 border border-[#00FF66]/50 px-2 py-0.5 text-xs bg-[#0A0E17]/80 rounded">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                  </svg>
                  cd /portfolio
                </Link>
              </div>
              
              <div className="absolute top-2 right-2 z-20">
                <div className="text-xs font-mono border px-2 py-0.5 border-[#00FF66]/50 bg-[#0A0E17]/80 rounded">
                  HIGH_SCORE: {highScore}
                </div>
              </div>
              
              <DinoGame 
                isPlaying={isPlaying} 
                onGameOver={handleGameOver}
                setIsPlaying={setIsPlaying}
              />
            </div>
          </div>
          
          <div className="py-2 mx-auto text-center">
            <details className="text-[#00FF66]/80">
              <summary className="cursor-pointer text-sm inline-flex items-center">
                <span className="mr-1">&gt;</span> SYSTEM.HELP
              </summary>
              <ul className="list-none space-y-1 text-[#00FF66]/60 text-xs mt-2 inline-block text-left border border-[#00FF66]/30 p-2 bg-[#0A0E17] max-w-md">
                <li><span className="bg-[#001A0D] px-2 py-0.5 mr-1">[SPACE]</span> JUMP</li>
                <li><span className="bg-[#001A0D] px-2 py-0.5 mr-1">[↑]</span> JUMP</li>
                <li><span className="bg-[#001A0D] px-2 py-0.5 mr-1">[↓]</span> DUCK</li>
                <li><span className="bg-[#001A0D] px-2 py-0.5 mr-1">[ESC]</span> PAUSE_SYSTEM</li>
                <li><span className="text-[#00FF66]">OBJECTIVE:</span> AVOID OBSTACLES, COLLECT POWER-UPS</li>
                <li><span className="text-[#00FF66]">WARNING:</span> SYSTEM ACCELERATES OVER TIME</li>
              </ul>
            </details>
          </div>
        </div>
      </div>
    </>
  );
};

export default GamePage;
