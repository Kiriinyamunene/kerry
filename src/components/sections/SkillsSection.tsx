import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Float } from '@react-three/drei';
import * as THREE from 'three';

const skills = [
  {
    category: "Frontend",
    items: ["React", "Next.js", "Vue.js", "Angular", "HTML/CSS", "Tailwind CSS", "JavaScript", "TypeScript"]
  },
  {
    category: "Mobile",
    items: ["React Native", "Flutter", "Swift", "Kotlin", "iOS Development", "Android Development"]
  },
  {
    category: "Backend",
    items: ["Node.js", "Express", "Django", "Flask", "GraphQL", "REST API", "MongoDB", "PostgreSQL"]
  },
  {
    category: "Data Science & AI",
    items: ["Python", "TensorFlow", "PyTorch", "Machine Learning", "Deep Learning", "Data Analysis", "NLP", "Computer Vision"]
  }
];

const SkillsSection = () => {
  return (
    <section id="skills" className="py-20 bg-gradient-to-b from-gray-900 to-black relative overflow-hidden">
      {/* Background 3D Effect */}
      <div className="absolute inset-0 opacity-20">
        <Canvas>
          <ambientLight intensity={0.2} />
          <SkillsBackground />
        </Canvas>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
              My Skills
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            A diverse set of technologies I've mastered over the years, allowing me to create comprehensive solutions.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {skills.map((skillGroup) => (
            <SkillCard key={skillGroup.category} category={skillGroup.category} skills={skillGroup.items} />
          ))}
        </div>
      </div>
    </section>
  );
};

const SkillCard = ({ category, skills }: { category: string; skills: string[] }) => {
  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="bg-gray-800/30 backdrop-blur-sm rounded-xl overflow-hidden p-6"
    >
      <h3 className="text-2xl font-bold mb-4 text-cyan-400">{category}</h3>
      <div className="flex flex-wrap gap-3">
        {skills.map((skill) => (
          <span 
            key={skill}
            className="px-4 py-2 bg-gray-700/50 rounded-full text-white hover:bg-cyan-700/50 transition-colors cursor-default"
          >
            {skill}
          </span>
        ))}
      </div>
    </motion.div>
  );
};

// 3D background component for skills section
const SkillsBackground = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.1;
    meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.15;
  });
  
  return (
    <group>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        <mesh ref={meshRef} position={[0, 0, -5]} scale={5}>
          <octahedronGeometry args={[1, 1]} />
          <meshStandardMaterial 
            color="#4070F4"
            wireframe
            transparent
            opacity={0.3}
          />
        </mesh>
      </Float>
    </group>
  );
};

export default SkillsSection;
