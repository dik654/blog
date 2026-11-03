import { motion } from "framer-motion";
import StepViz from "@/components/ui/step-viz";

const STEPS = [
  {
    label: "앱의 바이트를 STREAM frame으로 자릅니다",
    body: "대화 텍스트의 stream 0 · offset 100–199를 STREAM frame에 넣습니다. Stream 위치는 packet 번호와 별개의 좌표입니다.",
  },
  {
    label: "Frame을 packet 18에 넣고 보호합니다",
    body: "Packet number 18과 control frame을 묶고 TLS에서 파생한 key로 payload와 선택된 header bit를 보호합니다.",
  },
  {
    label: "UDP는 완성된 datagram을 전달할 뿐입니다",
    body: "Kernel의 UDP는 IP·port demultiplexing과 checksum 경계를 제공합니다. ACK·재조립·loss 판단은 QUIC endpoint의 상태입니다.",
  },
  {
    label: "손실된 frame은 새 packet 25에 다시 싣습니다",
    body: "Packet 18의 암호문과 번호를 재사용하지 않습니다. ACK와 timer로 손실을 판단한 뒤 필요한 stream bytes를 새로운 packet number로 보냅니다.",
  },
] as const;

const LAYERS = [
  {
    label: "Application bytes",
    detail: "stream 0 · offset 100–199",
    color: "#7c3aed",
  },
  { label: "QUIC frame", detail: "STREAM + ACK/control", color: "#059669" },
  {
    label: "QUIC packet",
    detail: "PN 18 · protected payload",
    color: "#2563eb",
  },
  {
    label: "UDP datagram",
    detail: "source/destination IP · port",
    color: "#d97706",
  },
] as const;

export default function QUICStackViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg
          viewBox="0 0 460 194"
          className="w-full max-w-2xl"
          aria-label="한 stream byte가 QUIC packet과 UDP datagram이 되는 과정"
        >
          {LAYERS.map((layer, index) => {
            const y = 16 + index * 40;
            const active = index === Math.min(step, 2);
            return (
              <motion.g
                key={layer.label}
                animate={{ opacity: active || step === 3 ? 1 : 0.3 }}
                transition={{ duration: 0.18 }}
              >
                <rect
                  x={52 + index * 12}
                  y={y}
                  width={356 - index * 24}
                  height="30"
                  rx="7"
                  fill={layer.color + "14"}
                  stroke={layer.color}
                  strokeWidth={active ? 1.7 : 1}
                />
                <text
                  x={72 + index * 12}
                  y={y + 13}
                  fontSize="11"
                  fontWeight="700"
                  fill={layer.color}
                >
                  {layer.label}
                </text>
                <text
                  x={72 + index * 12}
                  y={y + 24}
                  fontSize="10"
                  fill="currentColor"
                >
                  {layer.detail}
                </text>
              </motion.g>
            );
          })}
          <motion.g
            animate={{ opacity: step === 3 ? 1 : 0.2 }}
            transition={{ duration: 0.18 }}
          >
            <rect
              x="124"
              y="168"
              width="212"
              height="22"
              rx="6"
              fill="#dc262614"
              stroke="#dc2626"
            />
            <text
              x="230"
              y="183"
              textAnchor="middle"
              fontSize="10.5"
              fontWeight="700"
              fill="#dc2626"
            >
              lost PN 18 → same frame in new PN 25
            </text>
          </motion.g>
        </svg>
      )}
    </StepViz>
  );
}
