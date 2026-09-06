import { Html } from "@react-three/drei";
import {
  MessageCircle,
  Phone,
  MapPin,
  Share2,
} from "lucide-react";

const iconMap = {
  whatsapp: MessageCircle,
  call: Phone,
  location: MapPin,
  share: Share2,
};

export default function FloatingIcon({
  position = [0, 0, 0],
  type = "whatsapp",
  label = "WhatsApp",
}) {
  const Icon = iconMap[type];

  if (!Icon) return null;

  return (
    <group position={position}>
      <Html
        center
        transform
        distanceFactor={5.5}
        occlude={false}
        zIndexRange={[20, 30]}
      >
        <div
          className="
            select-none
            flex
            items-center
            gap-3
            rounded-[18px]
            border
            border-[#E8E2D8]
            bg-white
            px-3
            py-3
            shadow-[0_20px_45px_rgba(23,23,23,0.14)]
            transition-transform
            duration-300
            hover:scale-105
          "
        >
          {/* ICON BOX */}
          <div
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-[12px]
              bg-[#F5F2EA]
            "
          >
            <Icon
              size={21}
              strokeWidth={1.8}
              className="text-[#B08D57]"
            />
          </div>

          {/* LABEL */}
          <span
            className="
              pr-1
              text-[14px]
              font-medium
              tracking-[-0.01em]
              text-[#171717]
            "
          >
            {label}
          </span>
        </div>
      </Html>
    </group>
  );
}