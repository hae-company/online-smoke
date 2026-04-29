"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useSmoking } from "../providers/SmokingProvider";
import { CIGARETTE_CONFIG, CIGARETTE_BURN_SPEED, CIGARETTE_IDLE_BURN } from "@/lib/constants";
import { getMouthPosition } from "@/lib/landmarks";

export default function Cigarette() {
  const { cigaretteType, landmarks, isInhaling, burnProgress, setBurnProgress, chainCount, setChainCount, setStartTime } = useSmoking();

  if (cigaretteType === "ecig") return <ECigarette />;
  return <RegularCigarette />;
}

function RegularCigarette() {
  const groupRef = useRef<THREE.Group>(null);
  const emberRef = useRef<THREE.Mesh>(null);
  const paperRef = useRef<THREE.Mesh>(null);
  const { landmarks, isInhaling, burnProgress, setBurnProgress, chainCount, setChainCount, setStartTime } = useSmoking();
  const config = CIGARETTE_CONFIG.regular;

  useFrame(() => {
    if (!groupRef.current || !landmarks) return;

    const mouth = getMouthPosition(landmarks);

    // Convert normalized coords to screen-space 3D
    // Camera is orthographic-like, positioned to match video
    const x = (mouth.x - 0.5) * 10;
    const y = -(mouth.y - 0.5) * 7.5;

    // Position at right corner of mouth, angled outward
    groupRef.current.position.set(x - 0.3, y - 0.05, 0);
    groupRef.current.rotation.z = -mouth.angle - 0.2; // slight downward angle

    // Burn
    const burnRate = isInhaling ? CIGARETTE_BURN_SPEED : CIGARETTE_IDLE_BURN;
    const newBurn = Math.min(1, burnProgress + burnRate);
    setBurnProgress(newBurn);

    // Paper shrinks as it burns
    if (paperRef.current) {
      const remainingLength = 1.2 * (1 - newBurn);
      paperRef.current.scale.y = Math.max(0.01, remainingLength / 1.2);
      paperRef.current.position.x = -remainingLength / 2;
    }

    // Ember glow
    if (emberRef.current) {
      const mat = emberRef.current.material as THREE.MeshStandardMaterial;
      const intensity = isInhaling ? 3 : 0.8;
      mat.emissiveIntensity = intensity;
      emberRef.current.position.x = -1.2 * (1 - newBurn);
    }

    // Chain: reset when fully burned
    if (newBurn >= 1) {
      setBurnProgress(0);
      setChainCount(chainCount + 1);
      setStartTime(Date.now());
    }
  });

  return (
    <group ref={groupRef}>
      {/* Filter */}
      <mesh position={[0.35, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.06, 0.06, 0.3, 12]} />
        <meshStandardMaterial color={config.filterColor} />
      </mesh>

      {/* Paper (burns down) */}
      <mesh ref={paperRef} position={[-0.4, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.05, 0.05, 1.2, 12]} />
        <meshStandardMaterial color={config.paperColor} />
      </mesh>

      {/* Ember tip */}
      <mesh ref={emberRef} position={[-1.0, 0, 0]}>
        <sphereGeometry args={[0.065, 12, 12]} />
        <meshStandardMaterial
          color="#ff2200"
          emissive="#ff4400"
          emissiveIntensity={1}
        />
      </mesh>

      {/* Smoke particles */}
      <SmokeParticles />
    </group>
  );
}

function ECigarette() {
  const groupRef = useRef<THREE.Group>(null);
  const ledRef = useRef<THREE.Mesh>(null);
  const { landmarks, isInhaling, burnProgress, setBurnProgress, chainCount, setChainCount, setStartTime } = useSmoking();
  const config = CIGARETTE_CONFIG.ecig;

  useFrame(() => {
    if (!groupRef.current || !landmarks) return;

    const mouth = getMouthPosition(landmarks);
    const x = (mouth.x - 0.5) * 10;
    const y = -(mouth.y - 0.5) * 7.5;

    groupRef.current.position.set(x - 0.3, y - 0.05, 0);
    groupRef.current.rotation.z = -mouth.angle - 0.15;

    const burnRate = isInhaling ? CIGARETTE_BURN_SPEED : CIGARETTE_IDLE_BURN;
    const newBurn = Math.min(1, burnProgress + burnRate);
    setBurnProgress(newBurn);

    if (ledRef.current) {
      const mat = ledRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = isInhaling ? 4 : 1;
    }

    if (newBurn >= 1) {
      setBurnProgress(0);
      setChainCount(chainCount + 1);
      setStartTime(Date.now());
    }
  });

  return (
    <group ref={groupRef}>
      {/* Body */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <boxGeometry args={[0.12, 1.6, 0.12]} />
        <meshStandardMaterial color={config.bodyColor} metalness={0.6} roughness={0.3} />
      </mesh>

      {/* Tip / mouthpiece */}
      <mesh position={[0.7, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.04, 0.05, 0.3, 12]} />
        <meshStandardMaterial color="#444" />
      </mesh>

      {/* LED indicator */}
      <mesh ref={ledRef} position={[-0.85, 0, 0.07]}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshStandardMaterial
          color={config.ledColor}
          emissive={config.ledColor}
          emissiveIntensity={1}
        />
      </mesh>

      {/* Vapor */}
      {isInhaling && <VaporParticles />}
    </group>
  );
}

function SmokeParticles() {
  const { isInhaling } = useSmoking();
  const particlesRef = useRef<THREE.Points>(null);
  const positionsRef = useRef<Float32Array>(new Float32Array(30 * 3));
  const velocitiesRef = useRef<Float32Array>(new Float32Array(30 * 3));

  useMemo(() => {
    for (let i = 0; i < 30; i++) {
      positionsRef.current[i * 3] = 0;
      positionsRef.current[i * 3 + 1] = 0;
      positionsRef.current[i * 3 + 2] = 0;
      velocitiesRef.current[i * 3] = (Math.random() - 0.5) * 0.02;
      velocitiesRef.current[i * 3 + 1] = Math.random() * 0.03 + 0.01;
      velocitiesRef.current[i * 3 + 2] = (Math.random() - 0.5) * 0.02;
    }
  }, []);

  useFrame(() => {
    if (!particlesRef.current) return;
    const positions = positionsRef.current;
    const velocities = velocitiesRef.current;

    for (let i = 0; i < 30; i++) {
      positions[i * 3] += velocities[i * 3];
      positions[i * 3 + 1] += velocities[i * 3 + 1];
      positions[i * 3 + 2] += velocities[i * 3 + 2];

      // Reset particles that drift too far
      if (positions[i * 3 + 1] > 1.5) {
        positions[i * 3] = (Math.random() - 0.5) * 0.1;
        positions[i * 3 + 1] = 0;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 0.1;
      }
    }

    const geom = particlesRef.current.geometry;
    geom.attributes.position.needsUpdate = true;
  });

  if (!isInhaling) return null;

  return (
    <points ref={particlesRef} position={[-1.0, 0.1, 0]}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positionsRef.current, 3]}
          count={30}
        />
      </bufferGeometry>
      <pointsMaterial color="#aaa" size={0.05} transparent opacity={0.4} depthWrite={false} />
    </points>
  );
}

function VaporParticles() {
  const particlesRef = useRef<THREE.Points>(null);
  const positionsRef = useRef<Float32Array>(new Float32Array(20 * 3));
  const velocitiesRef = useRef<Float32Array>(new Float32Array(20 * 3));

  useMemo(() => {
    for (let i = 0; i < 20; i++) {
      positionsRef.current[i * 3] = (Math.random() - 0.5) * 0.05;
      positionsRef.current[i * 3 + 1] = 0;
      positionsRef.current[i * 3 + 2] = (Math.random() - 0.5) * 0.05;
      velocitiesRef.current[i * 3] = (Math.random() - 0.5) * 0.015;
      velocitiesRef.current[i * 3 + 1] = Math.random() * 0.025 + 0.01;
      velocitiesRef.current[i * 3 + 2] = (Math.random() - 0.5) * 0.015;
    }
  }, []);

  useFrame(() => {
    if (!particlesRef.current) return;
    const positions = positionsRef.current;
    const velocities = velocitiesRef.current;

    for (let i = 0; i < 20; i++) {
      positions[i * 3] += velocities[i * 3];
      positions[i * 3 + 1] += velocities[i * 3 + 1];
      positions[i * 3 + 2] += velocities[i * 3 + 2];

      if (positions[i * 3 + 1] > 1.2) {
        positions[i * 3] = (Math.random() - 0.5) * 0.05;
        positions[i * 3 + 1] = 0;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 0.05;
      }
    }

    const geom = particlesRef.current.geometry;
    geom.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={particlesRef} position={[0.85, 0.1, 0]}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positionsRef.current, 3]}
          count={20}
        />
      </bufferGeometry>
      <pointsMaterial color="#fff" size={0.04} transparent opacity={0.5} depthWrite={false} />
    </points>
  );
}
