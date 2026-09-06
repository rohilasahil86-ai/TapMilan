import { Canvas } from "@react-three/fiber";
import {
  Environment,
  Float,
  OrbitControls,
} from "@react-three/drei";

import FloatingCard from "./FloatingCard";
import FloatingPhone from "./FloatingPhone";
import FloatingIcon from "./FloatingIcon";

export default function HeroScene() {
  return (
    <div className="h-full w-full">
      <Canvas
        camera={{
          position: [0, 0, 8],
          fov: 42,
        }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
        }}
      >

        {/* =========================
            LIGHTING
        ========================= */}

        <ambientLight intensity={1.4} />

        <directionalLight
          position={[5, 6, 6]}
          intensity={2.8}
        />

        <directionalLight
          position={[-4, 2, 4]}
          intensity={1.4}
        />

        <pointLight
          position={[-3, 2, 4]}
          intensity={1.8}
          color="#D9B77A"
        />

        {/* =========================
            MAIN 3D PHONE
        ========================= */}

        <Float
          speed={1.2}
          rotationIntensity={0.12}
          floatIntensity={0.25}
        >
          <FloatingPhone />
        </Float>

        {/* =========================
            BACK 3D CARD
        ========================= */}

        <Float
          speed={0.9}
          rotationIntensity={0.10}
          floatIntensity={0.30}
        >
          <FloatingCard />
        </Float>

        {/* WhatsApp */}
<Float
  speed={1.25}
  rotationIntensity={0.08}
  floatIntensity={0.35}
>
  <FloatingIcon
    position={[-2.35, 1.65, 0.6]}
    type="whatsapp"
    label="WhatsApp"
  />
</Float>

{/* Call */}
<Float
  speed={1.1}
  rotationIntensity={0.1}
  floatIntensity={0.4}
>
  <FloatingIcon
    position={[2.35, 1.45, 0.8]}
    type="call"
    label="Call"
  />
</Float>

{/* Location */}
<Float
  speed={1.35}
  rotationIntensity={0.08}
  floatIntensity={0.45}
>
  <FloatingIcon
    position={[2.35, -1.45, 0.7]}
    type="location"
    label="Location"
  />
</Float>

{/* Share */}
<Float
  speed={1.15}
  rotationIntensity={0.08}
  floatIntensity={0.35}
>
  <FloatingIcon
    position={[-2.0, -1.65, 0.9]}
    type="share"
    label="Share"
  />
</Float>

        {/* =========================
            ENVIRONMENT
        ========================= */}

        <Environment preset="studio" />

        {/* =========================
            CAMERA CONTROL
        ========================= */}

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          enableDamping
          dampingFactor={0.05}
          autoRotate
          autoRotateSpeed={0.28}
        />

      </Canvas>
    </div>
  );
}