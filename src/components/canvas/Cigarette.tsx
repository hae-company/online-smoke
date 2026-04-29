"use client";

import { useRef, useMemo, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useSmoking } from "../providers/SmokingProvider";
import {
  CIGARETTE_BURN_PER_FRAME,
  ECIG_BURN_PER_FRAME,
  IDLE_BURN,
  type EcigBrandConfig,
} from "@/lib/constants";
import { getMouthPosition, calculateMAR } from "@/lib/landmarks";

export default function Cigarette() {
  const { cigaretteType, phase } = useSmoking();

  return (
    <group>
      {phase === "smoking" && (
        cigaretteType === "ecig" ? <ECigarette3D /> : <RegularCigarette3D />
      )}
      {phase === "finished" && <AshtrayScene />}
      {(phase === "pack" || phase === "grabbing") && (
        cigaretteType === "ecig" ? <RefillScene /> : <PackScene />
      )}
    </group>
  );
}

// ============================================
// REGULAR CIGARETTE — full 3D with LatheGeometry
// ============================================
function RegularCigarette3D() {
  const groupRef = useRef<THREE.Group>(null);
  const wasInhaling = useRef(false);
  const {
    landmarks, isInhaling, burnProgress, setBurnProgress,
    puffCount, setPuffCount, setPhase, brand,
  } = useSmoking();

  const thick = brand.thickness;

  const filterGeo = useMemo(() => {
    const r = 0.04 * thick;
    const pts = [];
    for (let i = 0; i <= 8; i++) {
      const t = (i / 8) * Math.PI * 0.5;
      pts.push(new THREE.Vector2(Math.sin(t) * r, -0.12 + Math.cos(t) * 0.02));
    }
    pts.push(new THREE.Vector2(r, 0.0));
    pts.push(new THREE.Vector2(r, 0.12));
    return new THREE.LatheGeometry(pts, 24);
  }, [thick]);

  const paperGeo = useMemo(() => {
    const r = 0.037 * thick;
    const pts = [
      new THREE.Vector2(r, 0),
      new THREE.Vector2(r, 0.55),
      new THREE.Vector2(r - 0.002, 0.56),
    ];
    return new THREE.LatheGeometry(pts, 24);
  }, [thick]);

  useFrame(() => {
    if (!groupRef.current || !landmarks) return;

    const mouth = getMouthPosition(landmarks);
    const x = -(mouth.x - 0.5) * 10;
    const y = -(mouth.y - 0.5) * 7.5;

    groupRef.current.position.set(x, y, 0.5);
    // Cigarette points outward from mouth, rotated along mouth angle
    groupRef.current.rotation.set(0, 0, mouth.angle + 0.08);

    // Count puffs: detect inhale start (transition from not inhaling to inhaling)
    if (isInhaling && !wasInhaling.current) {
      setPuffCount(puffCount + 1);
    }
    wasInhaling.current = isInhaling;

    // Burn
    const burnRate = isInhaling ? CIGARETTE_BURN_PER_FRAME : IDLE_BURN;
    const newBurn = Math.min(1, burnProgress + burnRate);
    setBurnProgress(newBurn);

    if (newBurn >= 1) {
      setPhase("finished");
    }
  });

  const remaining = 1 - burnProgress;

  return (
    <group ref={groupRef}>
      {/* Whole cigarette rotated so it sticks out horizontally from mouth */}
      <group rotation={[Math.PI / 2, 0, -Math.PI / 2]}>
        {/* Filter (mouthpiece end, at origin) */}
        <mesh geometry={filterGeo}>
          <meshStandardMaterial color={brand.filterColor} roughness={0.85} metalness={0.05} />
        </mesh>

        {/* Brand accent band */}
        <mesh position={[0, 0.13, 0]}>
          <cylinderGeometry args={[0.041 * thick, 0.041 * thick, 0.012, 24]} />
          <meshStandardMaterial color={brand.packAccent} metalness={0.5} roughness={0.4} />
        </mesh>

        {/* Paper tube (scales down as it burns) */}
        <group position={[0, 0.14, 0]} scale={[1, remaining, 1]}>
          <mesh geometry={paperGeo}>
            <meshStandardMaterial color={brand.paperColor} roughness={0.7} />
          </mesh>
          {/* Brand color accent line */}
          <mesh position={[0.038 * thick, 0.15, 0]}>
            <boxGeometry args={[0.002, 0.08, 0.02]} />
            <meshStandardMaterial color={brand.packColor} />
          </mesh>
        </group>

        {/* Ember tip */}
        <group position={[0, 0.14 + 0.56 * remaining, 0]}>
          {/* Hot ember core */}
          <mesh>
            <sphereGeometry args={[0.038, 16, 16]} />
            <meshStandardMaterial
              color="#ff2200"
              emissive={isInhaling ? "#ff6600" : "#cc3300"}
              emissiveIntensity={isInhaling ? 4 : 1}
            />
          </mesh>
          {/* Charred ring */}
          <mesh position={[0, -0.01, 0]}>
            <cylinderGeometry args={[0.039, 0.037, 0.025, 16]} />
            <meshStandardMaterial color="#222" roughness={1} />
          </mesh>
          {/* Ash buildup */}
          {burnProgress > 0.1 && (
            <mesh position={[0, 0.03, 0]}>
              <cylinderGeometry args={[0.033, 0.03, Math.min(burnProgress * 0.15, 0.06), 12]} />
              <meshStandardMaterial color="#999" roughness={1} />
            </mesh>
          )}
        </group>
      </group>

      <SmokeParticles3D burnY={0.14 + 0.56 * remaining} />
    </group>
  );
}

// ============================================
// E-CIGARETTE — brand-specific 3D shapes
// ============================================
function ECigarette3D() {
  const groupRef = useRef<THREE.Group>(null);
  const wasInhaling = useRef(false);
  const {
    landmarks, isInhaling, burnProgress, setBurnProgress,
    puffCount, setPuffCount, setPhase, ecigBrand,
  } = useSmoking();

  const eb = ecigBrand;

  useFrame(() => {
    if (!groupRef.current || !landmarks) return;

    const mouth = getMouthPosition(landmarks);
    const x = -(mouth.x - 0.5) * 10;
    const y = -(mouth.y - 0.5) * 7.5;

    groupRef.current.position.set(x, y, 0.5);
    groupRef.current.rotation.set(0, 0, mouth.angle + 0.05);

    if (isInhaling && !wasInhaling.current) {
      setPuffCount(puffCount + 1);
    }
    wasInhaling.current = isInhaling;

    const burnRate = isInhaling ? ECIG_BURN_PER_FRAME : 0;
    const newBurn = Math.min(1, burnProgress + burnRate);
    setBurnProgress(newBurn);

    if (newBurn >= 1) {
      setPhase("finished");
    }
  });

  return (
    <group ref={groupRef}>
      <group rotation={[Math.PI / 2, 0, -Math.PI / 2]}>
        {eb.shape === "stick" && <EcigStick eb={eb} isInhaling={isInhaling} burnProgress={burnProgress} />}
        {eb.shape === "pod" && <EcigPod eb={eb} isInhaling={isInhaling} burnProgress={burnProgress} />}
        {eb.shape === "box" && <EcigBox eb={eb} isInhaling={isInhaling} burnProgress={burnProgress} />}
      </group>
      {isInhaling && <VaporParticles3D />}
    </group>
  );
}

function EcigStick({ eb, isInhaling, burnProgress }: { eb: EcigBrandConfig; isInhaling: boolean; burnProgress: number }) {
  return (
    <>
      {/* Mouthpiece - flat tip */}
      <mesh position={[0, -0.08, 0]}>
        <cylinderGeometry args={[0.025, 0.03, 0.12, 16]} />
        <meshStandardMaterial color={eb.mouthpieceColor} metalness={0.3} roughness={0.5} />
      </mesh>
      {/* Upper body */}
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.032, 0.032, 0.35, 16]} />
        <meshStandardMaterial color={eb.bodyColor} metalness={eb.metalness} roughness={eb.roughness} />
      </mesh>
      {/* Accent ring */}
      <mesh position={[0, -0.01, 0]}>
        <cylinderGeometry args={[0.034, 0.034, 0.008, 16]} />
        <meshStandardMaterial color={eb.accentColor} metalness={0.7} roughness={0.15} />
      </mesh>
      {/* Lower body (battery) */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.033, 0.033, 0.35, 16]} />
        <meshStandardMaterial color={eb.bodyColor2} metalness={eb.metalness} roughness={eb.roughness} />
      </mesh>
      {/* Bottom cap */}
      <mesh position={[0, 0.68, 0]}>
        <cylinderGeometry args={[0.034, 0.034, 0.01, 16]} />
        <meshStandardMaterial color={eb.accentColor} metalness={0.8} roughness={0.1} />
      </mesh>
      {/* LED */}
      <mesh position={[0, 0.675, 0]}>
        <sphereGeometry args={[0.008, 8, 8]} />
        <meshStandardMaterial color={eb.ledColor} emissive={eb.ledColor} emissiveIntensity={isInhaling ? 5 : 0.5} />
      </mesh>
    </>
  );
}

function EcigPod({ eb, isInhaling, burnProgress }: { eb: EcigBrandConfig; isInhaling: boolean; burnProgress: number }) {
  return (
    <>
      {/* Mouthpiece - slim flat */}
      <mesh position={[0, -0.06, 0]}>
        <boxGeometry args={[0.05, 0.1, 0.025]} />
        <meshStandardMaterial color={eb.mouthpieceColor} metalness={0.4} roughness={0.4} />
      </mesh>
      {/* Pod cartridge (translucent) */}
      <mesh position={[0, 0.08, 0]}>
        <boxGeometry args={[0.06, 0.18, 0.03]} />
        <meshStandardMaterial color={eb.accentColor} transparent opacity={0.5} metalness={0.2} roughness={0.3} />
      </mesh>
      {/* Main body */}
      <mesh position={[0, 0.35, 0]}>
        <boxGeometry args={[0.065, 0.4, 0.035]} />
        <meshStandardMaterial color={eb.bodyColor} metalness={eb.metalness} roughness={eb.roughness} />
      </mesh>
      {/* Rounded bottom */}
      <mesh position={[0, 0.56, 0]}>
        <sphereGeometry args={[0.033, 12, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color={eb.bodyColor2} metalness={eb.metalness} roughness={eb.roughness} />
      </mesh>
      {/* LED strip */}
      <mesh position={[0, 0.2, 0.019]}>
        <boxGeometry args={[0.03, 0.06 * (1 - burnProgress), 0.002]} />
        <meshStandardMaterial color={eb.ledColor} emissive={eb.ledColor} emissiveIntensity={isInhaling ? 4 : 0.8} />
      </mesh>
    </>
  );
}

function EcigBox({ eb, isInhaling, burnProgress }: { eb: EcigBrandConfig; isInhaling: boolean; burnProgress: number }) {
  return (
    <>
      {/* Mouthpiece - cylindrical */}
      <mesh position={[0, -0.06, 0]}>
        <cylinderGeometry args={[0.02, 0.025, 0.1, 12]} />
        <meshStandardMaterial color={eb.mouthpieceColor} metalness={0.3} roughness={0.5} />
      </mesh>
      {/* Heating chamber top */}
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.035, 0.04, 0.12, 16]} />
        <meshStandardMaterial color={eb.bodyColor} metalness={eb.metalness + 0.1} roughness={eb.roughness} />
      </mesh>
      {/* Accent divider */}
      <mesh position={[0, 0.12, 0]}>
        <cylinderGeometry args={[0.042, 0.042, 0.008, 16]} />
        <meshStandardMaterial color={eb.accentColor} metalness={0.8} roughness={0.1} />
      </mesh>
      {/* Main body box */}
      <mesh position={[0, 0.35, 0]}>
        <boxGeometry args={[0.08, 0.4, 0.045]} />
        <meshStandardMaterial color={eb.bodyColor2} metalness={eb.metalness} roughness={eb.roughness} />
      </mesh>
      {/* Bottom cap */}
      <mesh position={[0, 0.56, 0]}>
        <boxGeometry args={[0.082, 0.01, 0.047]} />
        <meshStandardMaterial color={eb.accentColor} metalness={0.8} roughness={0.1} />
      </mesh>
      {/* LED circle */}
      <mesh position={[0, 0.18, 0.024]}>
        <circleGeometry args={[0.015, 16]} />
        <meshStandardMaterial
          color={eb.ledColor}
          emissive={eb.ledColor}
          emissiveIntensity={isInhaling ? 5 : 0.5}
        />
      </mesh>
      {/* Battery bar */}
      <mesh position={[0, 0.45, 0.024]}>
        <boxGeometry args={[0.04, 0.1 * (1 - burnProgress), 0.002]} />
        <meshStandardMaterial
          color={burnProgress > 0.8 ? "#ff3333" : eb.ledColor}
          emissive={burnProgress > 0.8 ? "#ff3333" : eb.ledColor}
          emissiveIntensity={0.5}
        />
      </mesh>
    </>
  );
}

// ============================================
// ASHTRAY — finished cigarette goes here
// ============================================
function AshtrayScene() {
  const { chainCount, setChainCount, setBurnProgress, setPuffCount, setPhase, setStartTime, landmarks } = useSmoking();
  const [animProgress, setAnimProgress] = useState(0);
  const mouthClosedTimer = useRef(0);

  useFrame(() => {
    // Animate butt dropping into ashtray
    if (animProgress < 1) {
      setAnimProgress((p) => Math.min(1, p + 0.02));
    }

    // Detect "grab" gesture: mouth closed tight for 1 second
    if (landmarks) {
      const mar = calculateMAR(landmarks);
      if (mar < 0.03) {
        mouthClosedTimer.current += 1 / 60;
        if (mouthClosedTimer.current > 1) {
          // Transition to pack
          setChainCount(chainCount + 1);
          setBurnProgress(0);
          setPuffCount(0);
          setStartTime(Date.now());
          setPhase("pack");
          mouthClosedTimer.current = 0;
        }
      } else {
        mouthClosedTimer.current = 0;
      }
    }
  });

  const buttY = THREE.MathUtils.lerp(2, -1.5, animProgress);
  const buttRotZ = animProgress * Math.PI * 0.3;

  return (
    <group position={[0, -1, 0]}>
      {/* Ashtray */}
      <mesh position={[0, -1.8, 0]}>
        <cylinderGeometry args={[0.8, 0.6, 0.2, 24]} />
        <meshStandardMaterial color="#555" metalness={0.3} roughness={0.7} />
      </mesh>
      {/* Ashtray inner (dark) */}
      <mesh position={[0, -1.7, 0]}>
        <cylinderGeometry args={[0.7, 0.5, 0.1, 24]} />
        <meshStandardMaterial color="#222" roughness={1} />
      </mesh>

      {/* Falling cigarette butt */}
      <group position={[0.1, buttY, 0]} rotation={[0, 0, buttRotZ]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.035, 0.04, 0.2, 12]} />
          <meshStandardMaterial color="#c8924a" roughness={0.9} />
        </mesh>
        <mesh position={[0, 0, -0.12]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.03, 0.033, 0.04, 12]} />
          <meshStandardMaterial color="#333" roughness={1} />
        </mesh>
      </group>

      {/* Previous butts in ashtray */}
      {Array.from({ length: Math.min(chainCount, 5) }).map((_, i) => (
        <mesh
          key={i}
          position={[(i - 2) * 0.15, -1.65, (i % 2) * 0.1 - 0.05]}
          rotation={[Math.PI / 2, i * 0.7, i * 0.5]}
        >
          <cylinderGeometry args={[0.025, 0.03, 0.18, 8]} />
          <meshStandardMaterial color="#b08040" roughness={0.9} />
        </mesh>
      ))}

      {/* Instruction text indicator */}
      {animProgress >= 1 && (
        <mesh position={[0, 0.5, 0]}>
          <planeGeometry args={[3, 0.3]} />
          <meshBasicMaterial color="#000" transparent opacity={0} />
        </mesh>
      )}
    </group>
  );
}

// ============================================
// PACK — cigarette pack appears, waiting for grab
// ============================================
function PackScene() {
  const { setPhase, landmarks, brand } = useSmoking();
  const [packOpen, setPackOpen] = useState(false);
  const mouthClosedTimer = useRef(0);

  useFrame(() => {
    if (!packOpen) {
      setPackOpen(true);
    }

    // Detect grab: mouth open (inhale gesture) to pick up
    if (landmarks) {
      const mar = calculateMAR(landmarks);
      if (mar > 0.1) {
        mouthClosedTimer.current += 1 / 60;
        if (mouthClosedTimer.current > 0.5) {
          setPhase("smoking");
          mouthClosedTimer.current = 0;
        }
      } else {
        mouthClosedTimer.current = 0;
      }
    }
  });

  return (
    <group position={[0, -0.5, 0]}>
      {/* Cigarette pack - box shape */}
      <group>
        {/* Pack body */}
        <mesh>
          <boxGeometry args={[1.2, 1.6, 0.5]} />
          <meshStandardMaterial color={brand.packColor} roughness={0.6} />
        </mesh>
        {/* Pack accent stripe */}
        <mesh position={[0, -0.3, 0.251]}>
          <boxGeometry args={[1.18, 0.4, 0.01]} />
          <meshStandardMaterial color={brand.packAccent} metalness={0.3} roughness={0.5} />
        </mesh>
        {/* Pack top (open, lighter shade) */}
        <mesh position={[0, 0.85, -0.1]} rotation={[-0.4, 0, 0]}>
          <boxGeometry args={[1.18, 0.5, 0.48]} />
          <meshStandardMaterial color={brand.packColor} roughness={0.5} />
        </mesh>
        {/* Foil inner */}
        <mesh position={[0, 0.5, 0]}>
          <boxGeometry args={[1.1, 0.6, 0.4]} />
          <meshStandardMaterial color="#ddd" metalness={0.6} roughness={0.3} />
        </mesh>
        {/* Cigarettes visible inside */}
        {[...Array(3)].map((_, i) => (
          <mesh key={i} position={[(i - 1) * 0.2, 0.9, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.04 * brand.thickness, 0.04 * brand.thickness, 0.4, 12]} />
            <meshStandardMaterial color={brand.paperColor} roughness={0.7} />
          </mesh>
        ))}
        {/* One cigarette sticking up (ready to grab) */}
        <mesh position={[0, 1.3, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.04 * brand.thickness, 0.04 * brand.thickness, 0.5, 12]} />
          <meshStandardMaterial color={brand.paperColor} roughness={0.7} />
        </mesh>
        <mesh position={[0, 1.05, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.042 * brand.thickness, 0.042 * brand.thickness, 0.2, 12]} />
          <meshStandardMaterial color={brand.filterColor} roughness={0.85} />
        </mesh>
      </group>
    </group>
  );
}

// ============================================
// REFILL — e-cig refill animation
// ============================================
function RefillScene() {
  const { setPhase, landmarks } = useSmoking();
  const mouthClosedTimer = useRef(0);
  const [fillProgress, setFillProgress] = useState(0);

  useFrame(() => {
    // Auto-fill animation
    if (fillProgress < 1) {
      setFillProgress((p) => Math.min(1, p + 0.008));
    }

    // Detect grab to continue
    if (fillProgress >= 1 && landmarks) {
      const mar = calculateMAR(landmarks);
      if (mar > 0.1) {
        mouthClosedTimer.current += 1 / 60;
        if (mouthClosedTimer.current > 0.5) {
          setPhase("smoking");
          mouthClosedTimer.current = 0;
        }
      } else {
        mouthClosedTimer.current = 0;
      }
    }
  });

  return (
    <group position={[0, -0.3, 0]}>
      {/* E-cig body */}
      <mesh>
        <boxGeometry args={[0.4, 1.8, 0.3]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.7} roughness={0.15} />
      </mesh>
      {/* Liquid bottle */}
      <mesh position={[0.6, 0.3, 0]}>
        <cylinderGeometry args={[0.15, 0.1, 0.8, 12]} />
        <meshStandardMaterial color="#88ccff" transparent opacity={0.7} roughness={0.2} />
      </mesh>
      {/* Liquid drip */}
      <mesh position={[0.3, 0.1, 0]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshStandardMaterial color="#66aaee" transparent opacity={0.8} />
      </mesh>
      {/* Fill progress bar */}
      <mesh position={[-0.0, -0.3 + fillProgress * 0.6, 0.16]}>
        <boxGeometry args={[0.2, fillProgress * 1.2, 0.01]} />
        <meshStandardMaterial
          color="#00ff88"
          emissive="#00ff88"
          emissiveIntensity={0.5}
        />
      </mesh>
    </group>
  );
}

// ============================================
// SMOKE PARTICLES (3D positioned)
// ============================================
function SmokeParticles3D({ burnY }: { burnY: number }) {
  const { isInhaling, burnProgress } = useSmoking();
  const ref = useRef<THREE.Points>(null);
  const pos = useRef(new Float32Array(50 * 3));
  const vel = useRef(new Float32Array(50 * 3));
  const age = useRef(new Float32Array(50));

  useMemo(() => {
    for (let i = 0; i < 50; i++) age.current[i] = Math.random() * 3;
  }, []);

  useFrame(() => {
    if (!ref.current) return;
    const p = pos.current;
    const v = vel.current;
    const a = age.current;

    for (let i = 0; i < 50; i++) {
      a[i] += 0.016;
      if (a[i] > 2.5) {
        p[i * 3] = (Math.random() - 0.5) * 0.03;
        p[i * 3 + 1] = burnY;
        p[i * 3 + 2] = (Math.random() - 0.5) * 0.03;
        v[i * 3] = (Math.random() - 0.5) * 0.004;
        v[i * 3 + 1] = 0.005 + Math.random() * 0.01;
        v[i * 3 + 2] = (Math.random() - 0.5) * 0.004;
        a[i] = 0;
      }
      v[i * 3] += (Math.random() - 0.5) * 0.0005;
      p[i * 3] += v[i * 3];
      p[i * 3 + 1] += v[i * 3 + 1];
      p[i * 3 + 2] += v[i * 3 + 2];
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[pos.current, 3]} count={50} />
      </bufferGeometry>
      <pointsMaterial
        color="#bbb"
        size={isInhaling ? 0.06 : 0.03}
        transparent
        opacity={isInhaling ? 0.5 : 0.15}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}

function VaporParticles3D() {
  const ref = useRef<THREE.Points>(null);
  const pos = useRef(new Float32Array(30 * 3));
  const vel = useRef(new Float32Array(30 * 3));

  useMemo(() => {
    for (let i = 0; i < 30; i++) {
      pos.current[i * 3] = (Math.random() - 0.5) * 0.02;
      pos.current[i * 3 + 1] = -0.1;
      pos.current[i * 3 + 2] = (Math.random() - 0.5) * 0.02;
      vel.current[i * 3] = (Math.random() - 0.5) * 0.006;
      vel.current[i * 3 + 1] = -0.01 - Math.random() * 0.015;
      vel.current[i * 3 + 2] = (Math.random() - 0.5) * 0.006;
    }
  }, []);

  useFrame(() => {
    if (!ref.current) return;
    const p = pos.current;
    const v = vel.current;
    for (let i = 0; i < 30; i++) {
      p[i * 3] += v[i * 3];
      p[i * 3 + 1] += v[i * 3 + 1];
      p[i * 3 + 2] += v[i * 3 + 2];
      if (p[i * 3 + 1] < -1) {
        p[i * 3] = (Math.random() - 0.5) * 0.02;
        p[i * 3 + 1] = -0.1;
        p[i * 3 + 2] = (Math.random() - 0.5) * 0.02;
      }
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[pos.current, 3]} count={30} />
      </bufferGeometry>
      <pointsMaterial color="#fff" size={0.05} transparent opacity={0.5} depthWrite={false} sizeAttenuation />
    </points>
  );
}
