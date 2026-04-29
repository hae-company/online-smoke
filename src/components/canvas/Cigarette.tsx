"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useSmoking } from "../providers/SmokingProvider";
import { CIGARETTE_CONFIG, CIGARETTE_BURN_SPEED, CIGARETTE_IDLE_BURN } from "@/lib/constants";
import { getMouthPosition } from "@/lib/landmarks";

export default function Cigarette() {
  const { cigaretteType } = useSmoking();
  if (cigaretteType === "ecig") return <ECigarette />;
  return <RegularCigarette />;
}

function RegularCigarette() {
  const groupRef = useRef<THREE.Group>(null);
  const emberRef = useRef<THREE.Mesh>(null);
  const ashRef = useRef<THREE.Mesh>(null);
  const paperRef = useRef<THREE.Group>(null);
  const { landmarks, isInhaling, burnProgress, setBurnProgress, chainCount, setChainCount, setStartTime } =
    useSmoking();

  useFrame(() => {
    if (!groupRef.current || !landmarks) return;

    const mouth = getMouthPosition(landmarks);

    // Mirrored webcam: flip x. Position in 3D space matching video coords.
    const x = -(mouth.x - 0.5) * 10;
    const y = -(mouth.y - 0.5) * 7.5;

    // Place cigarette at lips, sticking outward
    groupRef.current.position.set(x, y, 0.5);
    groupRef.current.rotation.z = mouth.angle + 0.1; // slight natural droop

    // Burn
    const burnRate = isInhaling ? CIGARETTE_BURN_SPEED : CIGARETTE_IDLE_BURN;
    const newBurn = Math.min(1, burnProgress + burnRate);
    setBurnProgress(newBurn);

    // Paper + tobacco shrinks from the tip
    if (paperRef.current) {
      const remaining = 1 - newBurn;
      paperRef.current.scale.x = Math.max(0.01, remaining);
      // Shift so the filter end stays at mouth, tip recedes
      paperRef.current.position.x = -0.55 * remaining;
    }

    // Ash builds up at the burning tip
    if (ashRef.current) {
      const ashLength = Math.min(newBurn * 0.3, 0.15);
      ashRef.current.scale.y = ashLength / 0.05;
      ashRef.current.position.x = -0.55 * (1 - newBurn) - 0.55 - ashLength * 0.5;
      ashRef.current.visible = newBurn > 0.05;
    }

    // Ember position follows the burning tip
    if (emberRef.current) {
      emberRef.current.position.x = -0.55 * (1 - newBurn) - 0.55;
      const mat = emberRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = isInhaling ? 5 : 1.2;
      // Pulsing glow when inhaling
      if (isInhaling) {
        const pulse = Math.sin(Date.now() * 0.01) * 0.3 + 0.7;
        emberRef.current.scale.setScalar(1 + pulse * 0.2);
      } else {
        emberRef.current.scale.setScalar(1);
      }
    }

    // Chain smoking
    if (newBurn >= 1) {
      setBurnProgress(0);
      setChainCount(chainCount + 1);
      setStartTime(Date.now());
    }
  });

  return (
    <group ref={groupRef}>
      {/* === FILTER === */}
      {/* Main filter body - cork-colored with texture feel */}
      <mesh position={[0.15, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.038, 0.04, 0.25, 16]} />
        <meshStandardMaterial color="#c8924a" roughness={0.9} />
      </mesh>
      {/* Filter ring (gold band where filter meets paper) */}
      <mesh position={[0.02, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.041, 0.041, 0.015, 16]} />
        <meshStandardMaterial color="#d4a54a" metalness={0.4} roughness={0.5} />
      </mesh>
      {/* Second gold ring */}
      <mesh position={[-0.005, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.041, 0.041, 0.008, 16]} />
        <meshStandardMaterial color="#d4a54a" metalness={0.4} roughness={0.5} />
      </mesh>

      {/* === PAPER + TOBACCO (shrinks as it burns) === */}
      <group ref={paperRef} position={[-0.55, 0, 0]}>
        {/* White cigarette paper */}
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.037, 0.038, 1.1, 16]} />
          <meshStandardMaterial color="#f0ebe0" roughness={0.7} />
        </mesh>
        {/* Subtle seam line along the paper */}
        <mesh position={[0, 0.038, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.001, 0.001, 1.1, 4]} />
          <meshStandardMaterial color="#ddd5c5" />
        </mesh>
      </group>

      {/* === EMBER (burning tip) === */}
      <mesh ref={emberRef} position={[-1.1, 0, 0]}>
        <sphereGeometry args={[0.042, 12, 12]} />
        <meshStandardMaterial
          color="#ff3300"
          emissive="#ff4400"
          emissiveIntensity={1.5}
          roughness={0.3}
        />
      </mesh>
      {/* Ember ring (glowing edge around the tip) */}
      <mesh position={[-1.08, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.04, 0.038, 0.03, 16]} />
        <meshStandardMaterial
          color="#1a1a1a"
          emissive="#aa2200"
          emissiveIntensity={0.5}
          roughness={1}
        />
      </mesh>

      {/* === ASH === */}
      <mesh ref={ashRef} position={[-1.15, 0, 0]} rotation={[0, 0, Math.PI / 2]} visible={false}>
        <cylinderGeometry args={[0.036, 0.034, 0.05, 12]} />
        <meshStandardMaterial color="#888" roughness={1} />
      </mesh>

      {/* === SMOKE === */}
      <SmokeParticles />
    </group>
  );
}

function ECigarette() {
  const groupRef = useRef<THREE.Group>(null);
  const ledRef = useRef<THREE.Mesh>(null);
  const { landmarks, isInhaling, burnProgress, setBurnProgress, chainCount, setChainCount, setStartTime } =
    useSmoking();
  const config = CIGARETTE_CONFIG.ecig;

  useFrame(() => {
    if (!groupRef.current || !landmarks) return;

    const mouth = getMouthPosition(landmarks);
    const x = -(mouth.x - 0.5) * 10;
    const y = -(mouth.y - 0.5) * 7.5;

    groupRef.current.position.set(x, y, 0.5);
    groupRef.current.rotation.z = mouth.angle + 0.08;

    const burnRate = isInhaling ? CIGARETTE_BURN_SPEED : CIGARETTE_IDLE_BURN;
    const newBurn = Math.min(1, burnProgress + burnRate);
    setBurnProgress(newBurn);

    if (ledRef.current) {
      const mat = ledRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = isInhaling ? 5 : 0.8;
    }

    if (newBurn >= 1) {
      setBurnProgress(0);
      setChainCount(chainCount + 1);
      setStartTime(Date.now());
    }
  });

  return (
    <group ref={groupRef}>
      {/* Main body - sleek dark rectangle */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <boxGeometry args={[0.1, 1.4, 0.08]} />
        <meshStandardMaterial color={config.bodyColor} metalness={0.7} roughness={0.2} />
      </mesh>
      {/* Mouthpiece */}
      <mesh position={[0.6, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.035, 0.04, 0.25, 12]} />
        <meshStandardMaterial color="#555" metalness={0.3} roughness={0.4} />
      </mesh>
      {/* LED */}
      <mesh ref={ledRef} position={[-0.72, 0, 0.045]}>
        <sphereGeometry args={[0.015, 8, 8]} />
        <meshStandardMaterial
          color={config.ledColor}
          emissive={config.ledColor}
          emissiveIntensity={1}
        />
      </mesh>
      {isInhaling && <VaporParticles />}
    </group>
  );
}

function SmokeParticles() {
  const { isInhaling, burnProgress } = useSmoking();
  const particlesRef = useRef<THREE.Points>(null);
  const positions = useRef(new Float32Array(40 * 3));
  const velocities = useRef(new Float32Array(40 * 3));
  const ages = useRef(new Float32Array(40));

  useMemo(() => {
    for (let i = 0; i < 40; i++) {
      positions.current[i * 3] = 0;
      positions.current[i * 3 + 1] = 0;
      positions.current[i * 3 + 2] = 0;
      ages.current[i] = Math.random() * 2;
    }
  }, []);

  useFrame(() => {
    if (!particlesRef.current) return;
    const pos = positions.current;
    const vel = velocities.current;
    const age = ages.current;

    for (let i = 0; i < 40; i++) {
      age[i] += 0.016;

      if (age[i] > 2 || pos[i * 3 + 1] > 2) {
        // Reset at ember tip
        const tipX = -0.55 * (1 - burnProgress) - 0.55;
        pos[i * 3] = tipX + (Math.random() - 0.5) * 0.05;
        pos[i * 3 + 1] = 0.05;
        pos[i * 3 + 2] = (Math.random() - 0.5) * 0.05;
        vel[i * 3] = (Math.random() - 0.5) * 0.008;
        vel[i * 3 + 1] = 0.008 + Math.random() * 0.015;
        vel[i * 3 + 2] = (Math.random() - 0.5) * 0.008;
        age[i] = 0;
      }

      // Wispy upward drift with slight wandering
      vel[i * 3] += (Math.random() - 0.5) * 0.001;
      vel[i * 3 + 1] *= 0.998;
      pos[i * 3] += vel[i * 3];
      pos[i * 3 + 1] += vel[i * 3 + 1];
      pos[i * 3 + 2] += vel[i * 3 + 2];
    }

    particlesRef.current.geometry.attributes.position.needsUpdate = true;
  });

  // Always show idle smoke, more when inhaling
  const opacity = isInhaling ? 0.5 : 0.2;

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions.current, 3]} count={40} />
      </bufferGeometry>
      <pointsMaterial
        color="#bbbbbb"
        size={isInhaling ? 0.08 : 0.04}
        transparent
        opacity={opacity}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}

function VaporParticles() {
  const particlesRef = useRef<THREE.Points>(null);
  const positions = useRef(new Float32Array(25 * 3));
  const velocities = useRef(new Float32Array(25 * 3));

  useMemo(() => {
    for (let i = 0; i < 25; i++) {
      positions.current[i * 3] = 0.7 + (Math.random() - 0.5) * 0.03;
      positions.current[i * 3 + 1] = (Math.random() - 0.5) * 0.03;
      positions.current[i * 3 + 2] = (Math.random() - 0.5) * 0.03;
      velocities.current[i * 3] = Math.random() * 0.01;
      velocities.current[i * 3 + 1] = Math.random() * 0.02 + 0.005;
      velocities.current[i * 3 + 2] = (Math.random() - 0.5) * 0.01;
    }
  }, []);

  useFrame(() => {
    if (!particlesRef.current) return;
    const pos = positions.current;
    const vel = velocities.current;

    for (let i = 0; i < 25; i++) {
      pos[i * 3] += vel[i * 3];
      pos[i * 3 + 1] += vel[i * 3 + 1];
      pos[i * 3 + 2] += vel[i * 3 + 2];

      if (pos[i * 3 + 1] > 1) {
        pos[i * 3] = 0.7 + (Math.random() - 0.5) * 0.03;
        pos[i * 3 + 1] = 0;
        pos[i * 3 + 2] = (Math.random() - 0.5) * 0.03;
      }
    }
    particlesRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions.current, 3]} count={25} />
      </bufferGeometry>
      <pointsMaterial color="#fff" size={0.06} transparent opacity={0.6} depthWrite={false} sizeAttenuation />
    </points>
  );
}
