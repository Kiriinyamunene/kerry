import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Preload } from '@react-three/drei';
import { motion } from 'framer-motion';
import HeroScene from '@/components/3d/HeroScene';
import ProjectsSection from '@/components/sections/ProjectsSection';
import SkillsSection from '@/components/sections/SkillsSection';
import AboutSection from '@/components/sections/AboutSection';
import ContactSection from '@/components/sections/ContactSection';
import Link from 'next/link';

export default function Home() {
  return (
    <div>
      {/* Hero Section with 3D Component */}
      <section id="home" className="h-screen relative overflow-hidden">
        <div className="absolute inset-0">
          <Canvas 
            camera={{ position: [0, 0, 5], fov: 45 }} 
            shadows
            gl={{ preserveDrawingBuffer: true }}
          >
            <Suspense fallback={null}>
              <HeroScene />
              <OrbitControls 
                enableZoom={false} 
                autoRotate={false}
                enablePan={false}
                maxPolarAngle={Math.PI / 2}
                minPolarAngle={Math.PI / 2.5}
              />
              <ambientLight intensity={0.5} />
              <directionalLight position={[0, 5, 5]} intensity={1} castShadow />
            </Suspense>
            <Preload all />
          </Canvas>
        </div>
        
        <div className="absolute inset-0 flex items-center z-10 px-6 md:px-20">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold">
              <span className="block">Hello, I'm Kerry</span>
              <span className="block mt-2 text-cyan-400">Web & Mobile Developer</span>
            </h1>
            <p className="text-xl md:text-2xl mt-6 max-w-2xl">
              Crafting modern digital experiences with expertise in web development, mobile apps, data science, and AI.
            </p>
            <div className="mt-8 flex gap-4">
              <button className="px-8 py-3 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-bold hover:opacity-90 transition-opacity">
                View Projects
              </button>
              <button className="px-8 py-3 rounded-full border border-white hover:bg-white hover:text-black transition-colors">
                Contact Me
              </button>
              <Link href="/game" className="px-8 py-3 rounded-full border border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black transition-colors">
                Play Game
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Projects Section */}
      <ProjectsSection />
      
      {/* Skills Section */}
      <SkillsSection />
      
      {/* About Section */}
      <AboutSection />
      
      {/* Contact Section */}
      <ContactSection />
    </div>
  );
}
