import React from 'react';
import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

const AboutSection = () => {
  return (
    <section id="about" className="py-20 bg-gradient-to-b from-black to-gray-900">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="w-full h-[400px] lg:h-[500px] relative"
          >
            <div className="w-full h-full rounded-2xl overflow-hidden">
              <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
                <ambientLight intensity={0.6} />
                <directionalLight position={[10, 10, 5]} intensity={1} />
                <AboutModel />
                <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={5} />
              </Canvas>
            </div>
          </motion.div>

          <motion.div
            initial={{ x: 100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                About Me
              </span>
            </h2>
            
            <p className="text-gray-300 mb-4">
              I'm a passionate full-stack developer with over 5 years of experience creating innovative digital solutions. 
              My journey in tech began with web development and has evolved to include mobile applications, 
              data science, and artificial intelligence.
            </p>
            
            <p className="text-gray-300 mb-6">
              I believe in creating technology that makes a positive impact on people's lives. 
              My approach combines technical expertise with creative problem-solving to deliver 
              elegant solutions that exceed client expectations.
            </p>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div>
                <h3 className="text-xl font-semibold text-cyan-400 mb-2">Education</h3>
                <p className="text-gray-300">MSc in Computer Science</p>
                <p className="text-gray-400">University of Technology</p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-cyan-400 mb-2">Experience</h3>
                <p className="text-gray-300">5+ years in development</p>
                <p className="text-gray-400">Worked with various industries</p>
              </div>
            </div>
            
            <button className="px-8 py-3 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-bold hover:opacity-90 transition-opacity">
              Download Resume
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// 3D model for About section
const AboutModel = () => {
  return (
    <mesh>
      <sphereGeometry args={[2, 32, 32, 0, Math.PI * 2, 0, Math.PI * 2]} />
      <meshStandardMaterial 
        color="#00AAFF"
        wireframe={true}
        metalness={0.5}
        roughness={0.2}
      />
    </mesh>
  );
};

export default AboutSection;
