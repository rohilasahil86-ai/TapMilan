import { RoundedBox, Text } from "@react-three/drei";

export default function FloatingPhone() {
  return (
    <group
      position={[0.35, 0.05, 0.15]}
      rotation={[0, -0.12, -0.04]}
    >
      {/* =====================================
          OUTER CARD / PHONE BODY
      ===================================== */}
      <RoundedBox
        args={[4.15, 2.6, 0.22]}
        radius={0.2}
        smoothness={8}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial
          color="#0B0B0A"
          roughness={0.25}
          metalness={0.55}
        />
      </RoundedBox>

      {/* =====================================
          INNER DISPLAY
      ===================================== */}
      <RoundedBox
        args={[3.88, 2.32, 0.055]}
        radius={0.14}
        smoothness={7}
        position={[0, 0, 0.135]}
      >
        <meshStandardMaterial
          color="#171715"
          roughness={0.3}
          metalness={0.2}
        />
      </RoundedBox>

      {/* =====================================
          INNER GOLD BORDER
      ===================================== */}
      <RoundedBox
        args={[3.72, 2.16, 0.025]}
        radius={0.11}
        smoothness={6}
        position={[0, 0, 0.17]}
      >
        <meshStandardMaterial
          color="#25231F"
          roughness={0.4}
          metalness={0.15}
        />
      </RoundedBox>

      {/* =====================================
          TAPMILAN LOGO
      ===================================== */}
      <Text
        position={[-1.35, 0.78, 0.2]}
        fontSize={0.28}
        maxWidth={1.8}
        anchorX="left"
        anchorY="middle"
        color="#D9B77A"
      >
        TapMilan
      </Text>

      {/* GOLD DOT */}
      <mesh position={[-0.23, 0.78, 0.205]}>
        <sphereGeometry args={[0.035, 16, 16]} />
        <meshStandardMaterial
          color="#D9B77A"
          metalness={0.5}
          roughness={0.25}
        />
      </mesh>

      {/* =====================================
          NFC SYMBOL
      ===================================== */}
      <group position={[0.95, 0.15, 0.205]}>

        <mesh rotation={[0, 0, 0]}>
          <torusGeometry
            args={[0.46, 0.045, 16, 40, Math.PI]}
          />
          <meshStandardMaterial
            color="#D9B77A"
            metalness={0.55}
            roughness={0.25}
          />
        </mesh>

        <mesh position={[0.16, 0, 0.01]}>
          <torusGeometry
            args={[0.32, 0.045, 16, 40, Math.PI]}
          />
          <meshStandardMaterial
            color="#D9B77A"
            metalness={0.55}
            roughness={0.25}
          />
        </mesh>

        <mesh position={[0.29, 0, 0.02]}>
          <torusGeometry
            args={[0.18, 0.045, 16, 40, Math.PI]}
          />
          <meshStandardMaterial
            color="#D9B77A"
            metalness={0.55}
            roughness={0.25}
          />
        </mesh>

      </group>

      {/* =====================================
          GOLD QR
      ===================================== */}
      <group position={[1.2, -0.68, 0.21]}>

        {/* QR BASE */}
        <RoundedBox
          args={[0.62, 0.62, 0.035]}
          radius={0.035}
          smoothness={4}
        >
          <meshStandardMaterial
            color="#D9B77A"
            metalness={0.35}
            roughness={0.3}
          />
        </RoundedBox>

        {/* QR BLOCKS */}

        <mesh position={[-0.15, 0.15, 0.025]}>
          <boxGeometry args={[0.14, 0.14, 0.025]} />
          <meshStandardMaterial color="#11110F" />
        </mesh>

        <mesh position={[0.15, 0.15, 0.025]}>
          <boxGeometry args={[0.14, 0.14, 0.025]} />
          <meshStandardMaterial color="#11110F" />
        </mesh>

        <mesh position={[-0.15, -0.15, 0.025]}>
          <boxGeometry args={[0.14, 0.14, 0.025]} />
          <meshStandardMaterial color="#11110F" />
        </mesh>

        <mesh position={[0.15, -0.15, 0.025]}>
          <boxGeometry args={[0.14, 0.14, 0.025]} />
          <meshStandardMaterial color="#11110F" />
        </mesh>

        <mesh position={[0, 0, 0.025]}>
          <boxGeometry args={[0.08, 0.08, 0.025]} />
          <meshStandardMaterial color="#11110F" />
        </mesh>

      </group>

      {/* =====================================
          SMALL "TAP OR SCAN"
      ===================================== */}
      <Text
        position={[-1.35, -0.82, 0.2]}
        fontSize={0.13}
        anchorX="left"
        anchorY="middle"
        color="#B89A63"
      >
        Tap or Scan
      </Text>

    </group>
  );
}