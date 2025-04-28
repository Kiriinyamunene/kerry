import React, { useRef, Suspense, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Float, Text, Html, MeshDistortMaterial, Sphere } from '@react-three/drei';
import * as THREE from 'three';
import styles from '../../styles/hero-buttons.module.css';

// Define TypeScript interfaces for props
interface TechIconProps {
  name: string;
  color: string;
  position: [number, number, number];
  mousePos: React.MutableRefObject<{x: number, y: number}>;
  speed?: number;
  index: number;
}

const HeroScene = () => {
  return (
    <group>
      {/* Set up scene with pure black background */}
      <color attach="background" args={["#000000"]} />
      
      {/* Strong directional light specifically for icons */}
      <directionalLight position={[0, 0, 5]} intensity={1.0} />
      <ambientLight intensity={0.3} />
      
      {/* Center content with text and buttons */}
      <CenterContent />
      
      {/* Floating Tech Stack arranged right in front of the camera */}
      <TechStack />
      
      {/* Minimal stars in background */}
      <MinimalStars />
    </group>
  );
};

// Futuristic glowing orb background element
const FuturisticOrb = () => {
  const orb = useRef<THREE.Mesh>(null);
  
  useFrame(({ clock }) => {
    if (orb.current) {
      orb.current.rotation.z = clock.getElapsedTime() * 0.15;
    }
  });
  
  return (
    <mesh ref={orb} position={[0, 0, -2]} scale={[3, 3, 3]}>
      <sphereGeometry args={[1, 32, 32]} />
      <MeshDistortMaterial
        color="#0066cc"
        attach="material"
        distort={0.3}
        speed={2}
        roughness={0.2}
        metalness={0.8}
        opacity={0.15}
        transparent
      />
    </mesh>
  );
};

// Central content component with text and buttons
const CenterContent = () => {
  const textRef = useRef<THREE.Group>(null);
  
  useFrame(({ clock }) => {
    if (textRef.current) {
      // Subtle floating animation for the text
      textRef.current.position.y = Math.sin(clock.getElapsedTime() * 0.5) * 0.03;
    }
  });
  
  return (
    <group position={[0, 0, 0]}>
      <group ref={textRef}>
        {/* Text heading with glowing effect */}
        <Text
          position={[0, 0.3, 0]}
          color="#ffffff"
          fontSize={0.3}
          maxWidth={4}
          textAlign="center"
          anchorX="center"
          anchorY="middle"
          font="/fonts/Inter-Bold.woff"
          glyphGeometryDetail={32}
          letterSpacing={0.02}
        >
          FULL STACK DEVELOPER
          <meshStandardMaterial 
            color="#ffffff" 
            emissive="#4080ff"
            emissiveIntensity={0.4}
            toneMapped={false}
          />
        </Text>
        
        {/* Thin stylish separator line */}
        <mesh position={[0, 0.1, 0]}>
          <boxGeometry args={[1.5, 0.003, 0.001]} />
          <meshBasicMaterial color="#4080ff" />
        </mesh>
        
        {/* Subheading */}
        <Text
          position={[0, -0.05, 0]}
          color="#a0a0ff"
          fontSize={0.12}
          maxWidth={3}
          textAlign="center"
          anchorX="center"
          anchorY="middle"
          font="/fonts/Inter-Light.woff"
        >
          Creating next-gen web experiences
        </Text>
      </group>
      
      {/* Futuristic HTML-based buttons */}
      <Html position={[0, -0.4, 0]} center transform>
        <div className={styles.buttonContainer}>
          <button 
            className={styles.buttonPrimary}
            onClick={() => console.log('View Projects clicked')}
          >
            View Projects
          </button>
          <button 
            className={styles.buttonSecondary}
            onClick={() => console.log('Contact Me clicked')}
          >
            Contact Me
          </button>
        </div>
      </Html>
    </group>
  );
};

// Tech Stack component with floating 3D icons in orbital arrangement
const TechStack = () => {
  const groupRef = useRef<THREE.Group>(null);
  const mousePos = useRef({ x: 0, y: 0 });
  
  useFrame(({ mouse, clock }) => {
    mousePos.current = { x: mouse.x * 0.05, y: mouse.y * 0.05 };
    
    if (groupRef.current) {
      // Subtle overall rotation for orbital effect
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.05;
    }
  });
  
  // Same tech stack with brighter colors
  const technologies = [
    { name: "React", color: "#61DAFB" },
    { name: "TypeScript", color: "#3178C6" },
    { name: "JavaScript", color: "#F7DF1E" },
    { name: "Three.js", color: "#30cfd0" },
    { name: "Node.js", color: "#339933" },
    { name: "CSS", color: "#1572B6" },
    { name: "HTML", color: "#E34F26" }
  ];

  // Position in a more visible circular pattern right in front of the camera
  const radius = 1.8; // Smaller radius, more visible
  const positionedTech = technologies.map((tech, i) => {
    const angleOffset = Math.PI * 2 / technologies.length;
    const angle = (i / technologies.length) * Math.PI * 2 + angleOffset;
    
    // Create a clear circular pattern in the foreground
    const x = Math.sin(angle) * radius;
    const y = Math.sin(angle) * 0.2 + 0.1; // Very slight vertical variation
    const z = 3.0; // Position in front of everything else
    
    return {
      ...tech,
      position: [x, y, z] as [number, number, number]
    };
  });

  return (
    // Position the entire group in the foreground
    <group ref={groupRef} position={[0, 0, 5]} scale={[1.2, 1.2, 1.2]}>
      {positionedTech.map((tech, index) => (
        <TechIcon 
          key={index}
          name={tech.name}
          color={tech.color}
          position={tech.position}
          mousePos={mousePos}
          speed={1 + index * 0.05}
          index={index}
        />
      ))}
    </group>
  );
};

// Individual tech icon component with futuristic styling
const TechIcon = ({ name, color, position, mousePos, speed = 1, index }: TechIconProps) => {
  const iconRef = useRef<THREE.Group>(null);
  const offsetFactor = index * 0.7;
  
  useFrame((state) => {
    if (!iconRef.current) return;
    
    // Animation with phase offset
    const t = state.clock.getElapsedTime() * speed * 0.3 + offsetFactor;
    iconRef.current.position.y = position[1] + Math.sin(t) * 0.15;
    
    // Rotation
    iconRef.current.rotation.x = Math.sin(t * 0.4) * 0.08;
    iconRef.current.rotation.y = Math.cos(t * 0.3) * 0.2 + state.clock.getElapsedTime() * 0.15;
    
    // Mouse effect - reduced to prevent icons going out of view
    iconRef.current.position.x = position[0] + mousePos.current.x * 0.5;
    iconRef.current.position.z = position[2] + mousePos.current.y * 0.5;
  });
  
  return (
    <group ref={iconRef} position={position}>
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
        {/* Tech icon with much more prominent appearance */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.2, 1.2, 0.2]} /> {/* Much larger size */}
          <meshStandardMaterial 
            color={color} 
            metalness={0.9} 
            roughness={0.1}
            emissive={color}
            emissiveIntensity={1.5} // Very strong glow
          />
        </mesh>
        
        {/* Tech name with better visibility */}
        <Text
          position={[0, -0.9, 0]}
          color="white"
          fontSize={0.25} // Larger text
          maxWidth={2}
          textAlign="center"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.04} // Thicker outline
          outlineColor="black"
        >
          {name}
        </Text>
        
        {/* Add a point light to each icon to make it glow */}
        <pointLight position={[0, 0, 0.5]} distance={2} intensity={0.5} color={color} />
      </Float>
    </group>
  );
};

// Reduced stars background - just a few stars
const MinimalStars = () => {
  const ref = useRef<THREE.Points>(null);
  
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.x += 0.0003;
    ref.current.rotation.y += 0.0002;
  });
  
  const [geometry] = React.useState(() => {
    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    
    // Drastically reduce star count from 5000 to 150
    for (let i = 0; i < 150; i++) {
      // Keep stars closer to the visible area
      const x = (Math.random() - 0.5) * 40;
      const y = (Math.random() - 0.5) * 40;
      const z = -1 * Math.random() * 20; // Stars only in the background (negative z)
      vertices.push(x, y, z);
    }
    
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    return geometry;
  });

  return (
    <points ref={ref}>
      <bufferGeometry attach="geometry" {...geometry} />
      <pointsMaterial size={3} sizeAttenuation color="#ffffff" />
    </points>
  );
};

export default HeroScene;
