import React, { useRef, Suspense } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

const HeroScene = () => {
  return (
    <group>
      {/* Supercar hanging from the top */}
      <Float 
        speed={1.5} 
        rotationIntensity={0.2} 
        floatIntensity={0.8}
        position={[0, 0.5, 0]}
      >
        <SimpleSuperCar />
      </Float>
      
      {/* Particles/Stars in background */}
      <Stars />
    </group>
  );
};

// Custom built supercar using Three.js primitives
const SimpleSuperCar = () => {
  const carRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (!carRef.current) return;
    
    // Gentle rotation to showcase the car
    carRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.3) * 0.2 + Math.PI;
    
    // Slight bobbing motion to simulate hanging
    carRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 0.6) * 0.05;
  });
  
  return (
    <group ref={carRef} position={[0, 0, 0]} scale={0.6}>
      {/* Car body */}
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[4, 0.5, 2]} />
        <meshStandardMaterial color="#ff3300" metalness={0.8} roughness={0.2} />
      </mesh>
      
      {/* Car top/cabin */}
      <mesh position={[0, 0.4, 0]} castShadow>
        <boxGeometry args={[2, 0.3, 1.8]} />
        <meshStandardMaterial color="#ff3300" metalness={0.9} roughness={0.1} />
      </mesh>
      
      {/* Car hood - sloped */}
      <mesh position={[1.5, 0.1, 0]} rotation={[0, 0, -0.1]} castShadow>
        <boxGeometry args={[1, 0.1, 1.8]} />
        <meshStandardMaterial color="#ff3300" metalness={0.9} roughness={0.1} />
      </mesh>
      
      {/* Car trunk - sloped */}
      <mesh position={[-1.5, 0.1, 0]} rotation={[0, 0, 0.1]} castShadow>
        <boxGeometry args={[1, 0.1, 1.8]} />
        <meshStandardMaterial color="#ff3300" metalness={0.9} roughness={0.1} />
      </mesh>
      
      {/* Wheels */}
      <Wheel position={[1.2, -0.3, 1]} />
      <Wheel position={[1.2, -0.3, -1]} />
      <Wheel position={[-1.2, -0.3, 1]} />
      <Wheel position={[-1.2, -0.3, -1]} />
      
      {/* Windows - windshield */}
      <mesh position={[0.8, 0.5, 0]} rotation={[0, 0, Math.PI * 0.08]} castShadow>
        <boxGeometry args={[0.8, 0.4, 1.7]} />
        <meshStandardMaterial color="#000033" metalness={0.9} roughness={0.1} opacity={0.7} transparent />
      </mesh>
      
      {/* Rear window */}
      <mesh position={[-0.8, 0.5, 0]} rotation={[0, 0, -Math.PI * 0.08]} castShadow>
        <boxGeometry args={[0.8, 0.4, 1.7]} />
        <meshStandardMaterial color="#000033" metalness={0.9} roughness={0.1} opacity={0.7} transparent />
      </mesh>
      
      {/* Headlights */}
      <mesh position={[2, 0.2, 0.7]} castShadow>
        <boxGeometry args={[0.1, 0.2, 0.3]} />
        <meshStandardMaterial color="#ffffcc" emissive="#ffffcc" emissiveIntensity={1} />
      </mesh>
      <mesh position={[2, 0.2, -0.7]} castShadow>
        <boxGeometry args={[0.1, 0.2, 0.3]} />
        <meshStandardMaterial color="#ffffcc" emissive="#ffffcc" emissiveIntensity={1} />
      </mesh>
      
      {/* Taillights */}
      <mesh position={[-2, 0.2, 0.7]} castShadow>
        <boxGeometry args={[0.1, 0.2, 0.3]} />
        <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={1} />
      </mesh>
      <mesh position={[-2, 0.2, -0.7]} castShadow>
        <boxGeometry args={[0.1, 0.2, 0.3]} />
        <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={1} />
      </mesh>
      
      {/* Add spotlight to highlight the car */}
      <spotLight
        position={[0, 5, 0]}
        angle={0.3}
        penumbra={0.8}
        intensity={5}
        color="#ffffff"
        castShadow
      />
    </group>
  );
};

// Wheel component
const Wheel = ({ position }: { position: [number, number, number] }) => {
  return (
    <group position={position}>
      <mesh castShadow rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.2, 16]} />
        <meshStandardMaterial color="#111111" metalness={0.5} roughness={0.4} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.21, 16]} />
        <meshStandardMaterial color="#555555" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
};

// Simple stars background
const Stars = () => {
  const ref = useRef<THREE.Points>(null);
  
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.x += 0.0005;
    ref.current.rotation.y += 0.0005;
  });
  
  const [geometry] = React.useState(() => {
    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    
    for (let i = 0; i < 5000; i++) {
      const x = (Math.random() - 0.5) * 2000;
      const y = (Math.random() - 0.5) * 2000;
      const z = (Math.random() - 0.5) * 2000;
      vertices.push(x, y, z);
    }
    
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    return geometry;
  });

  return (
    <points ref={ref}>
      <bufferGeometry attach="geometry" {...geometry} />
      <pointsMaterial size={2} sizeAttenuation color="#ffffff" />
    </points>
  );
};

export default HeroScene;
