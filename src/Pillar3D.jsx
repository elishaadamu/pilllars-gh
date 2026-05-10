import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';

function Pillar({ rodsPerPillar, pillarLength }) {
  const groupRef = useRef();

  // Scale the visual height so it fits nicely
  const visualHeight = 5; 
  const radius = 0.8;
  const rodRadius = 0.04;

  // Animate slow rotation
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.005;
    }
  });

  // Calculate positions for rods in a circle
  const rods = [];
  const count = Math.max(1, rodsPerPillar || 4); // Avoid 0 crash
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2;
    const x = Math.cos(angle) * (radius - 0.15); // Inset from concrete edge
    const z = Math.sin(angle) * (radius - 0.15);
    rods.push(
      <mesh key={`rod-${i}`} position={[x, 0, z]} castShadow>
        <cylinderGeometry args={[rodRadius, rodRadius, visualHeight, 16]} />
        <meshStandardMaterial color="#475569" roughness={0.6} metalness={0.8} />
      </mesh>
    );
  }

  // Add stirrups (horizontal ties)
  // We use max 10 to keep the visual clean, based on height ratio
  const stirrupCount = Math.min(12, Math.max(3, Math.floor(pillarLength))); 
  const stirrups = [];
  for (let i = 0; i <= stirrupCount; i++) {
    const y = -visualHeight / 2 + (i / stirrupCount) * visualHeight;
    stirrups.push(
      <mesh key={`stirrup-${i}`} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius - 0.15, rodRadius * 0.7, 8, count > 2 ? count : 4]} />
        <meshStandardMaterial color="#475569" roughness={0.6} metalness={0.8} />
      </mesh>
    );
  }

  return (
    <group ref={groupRef}>
      {/* The Rods */}
      {rods}
      {/* The Stirrups */}
      {stirrups}
      
      {/* Ghostly Concrete Pillar */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[radius, radius, visualHeight, 32]} />
        <meshPhysicalMaterial 
          color="#94a3b8" 
          transparent={true} 
          opacity={0.15} 
          roughness={0.2}
          clearcoat={1}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

export default function Pillar3D({ rodsPerPillar, pillarLength, isCalculating }) {
  return (
    <div className="w-full h-80 md:h-[400px] bg-slate-900/60 backdrop-blur-xl rounded-3xl border border-slate-700/50 overflow-hidden relative shadow-xl">
      
      {/* Loading Overlay */}
      {isCalculating && (
        <div className="absolute inset-0 z-20 bg-slate-900/50 backdrop-blur-sm flex flex-col items-center justify-center transition-all duration-300">
          <div className="w-12 h-12 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mb-4"></div>
          <span className="text-emerald-400 font-medium text-sm animate-pulse">Updating 3D Model...</span>
        </div>
      )}

      <div className="absolute top-6 left-6 z-10 pointer-events-none">
        <h3 className="text-emerald-400 font-semibold text-sm tracking-wider uppercase">Interactive 3D View</h3>
        <p className="text-slate-400 text-xs mt-1 hidden sm:block">Drag to rotate • Scroll to zoom</p>
      </div>
      <Canvas camera={{ position: [0, 2, 8], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
        <pointLight position={[-10, -10, -5]} intensity={0.5} color="#10b981" />
        
        <Pillar rodsPerPillar={rodsPerPillar} pillarLength={pillarLength} />
        
        <ContactShadows position={[0, -2.5, 0]} opacity={0.6} scale={10} blur={2.5} far={4} />
        <OrbitControls enablePan={false} minPolarAngle={Math.PI / 4} maxPolarAngle={Math.PI / 2 + 0.1} />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}
