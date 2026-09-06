import { RoundedBox, Text } from "@react-three/drei";

export default function FloatingCard() {
  const qrPattern = [
    1, 1, 0, 1, 0, 1, 1, 1,
    1, 0, 0, 1, 1, 0, 0, 1,
    0, 1, 1, 0, 1, 1, 0, 0,
    1, 0, 1, 1, 0, 0, 1, 1,
    0, 1, 0, 0, 1, 1, 1, 0,
    1, 1, 1, 0, 0, 1, 0, 1,
    0, 0, 1, 1, 1, 0, 1, 0,
    1, 0, 1, 0, 1, 1, 1, 1,
  ];

  return (
    <group
      position={[-0.35, 0, -0.45]}
      rotation={[0, 0.18, -0.06]}
    >
      {/* =========================
          MAIN CARD BODY
      ========================= */}
      <RoundedBox
        args={[4.4, 2.75, 0.14]}
        radius={0.18}
        smoothness={6}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial
          color="#0B0B0A"
          roughness={0.28}
          metalness={0.45}
        />
      </RoundedBox>

      {/* =========================
          INNER PANEL
      ========================= */}
      <RoundedBox
        args={[4.08, 2.43, 0.025]}
        radius={0.12}
        smoothness={5}
        position={[0, 0, 0.09]}
      >
        <meshStandardMaterial
          color="#151513"
          roughness={0.4}
          metalness={0.2}
        />
      </RoundedBox>

      {/* =========================
          TAPMILAN LOGO
      ========================= */}
      <Text
        position={[-1.35, 0.82, 0.13]}
        fontSize={0.28}
        maxWidth={1.8}
        anchorX="left"
        anchorY="middle"
        color="#D9B77A"
      >
        TapMilan
      </Text>

      {/* GOLD DOT */}
      <mesh position={[-0.42, 0.82, 0.135]}>
        <sphereGeometry args={[0.055, 16, 16]} />
        <meshStandardMaterial
          color="#D9B77A"
          roughness={0.35}
          metalness={0.5}
        />
      </mesh>

      {/* =========================
          NFC SYMBOL
      ========================= */}
      <group position={[0.55, 0.05, 0.14]}>
        <mesh position={[0, 0, 0]}>
          <torusGeometry args={[0.55, 0.055, 12, 32, Math.PI]} />
          <meshStandardMaterial
            color="#D9B77A"
            roughness={0.3}
            metalness={0.5}
          />
        </mesh>

        <mesh position={[0, 0, 0.01]}>
          <torusGeometry args={[0.35, 0.055, 12, 32, Math.PI]} />
          <meshStandardMaterial
            color="#D9B77A"
            roughness={0.3}
            metalness={0.5}
          />
        </mesh>

        <mesh position={[0, 0, 0.02]}>
          <torusGeometry args={[0.16, 0.055, 12, 32, Math.PI]} />
          <meshStandardMaterial
            color="#D9B77A"
            roughness={0.3}
            metalness={0.5}
          />
        </mesh>
      </group>

      {/* =========================
          QR CODE
      ========================= */}
      <group position={[1.28, -0.68, 0.14]}>
        {/* QR GOLD BACKGROUND */}
        <mesh>
          <boxGeometry args={[0.78, 0.78, 0.025]} />
          <meshStandardMaterial
            color="#D9B77A"
            roughness={0.4}
            metalness={0.25}
          />
        </mesh>

        {/* QR PATTERN */}
        <group position={[0, 0, 0.018]}>
          {qrPattern.map((cell, index) => {
            if (!cell) return null;

            const x = (index % 8) * 0.075 - 0.2625;
            const y = Math.floor(index / 8) * 0.075 - 0.2625;

            return (
              <mesh key={index} position={[x, -y, 0]}>
                <planeGeometry args={[0.055, 0.055]} />
                <meshBasicMaterial color="#11110F" />
              </mesh>
            );
          })}
        </group>
      </group>

      {/* =========================
          BOTTOM TEXT
      ========================= */}
      <Text
        position={[-1.35, -0.88, 0.13]}
        fontSize={0.13}
        anchorX="left"
        anchorY="middle"
        color="#D9B77A"
      >
        TAP OR SCAN
      </Text>

      {/* =========================
          SMALL GOLD LINE
      ========================= */}
      <mesh position={[-0.9, -0.63, 0.13]}>
        <boxGeometry args={[0.8, 0.012, 0.015]} />
        <meshBasicMaterial color="#D9B77A" />
      </mesh>
    </group>
  );
}