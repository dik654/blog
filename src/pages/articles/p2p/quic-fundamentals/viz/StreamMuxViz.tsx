import { motion } from "framer-motion";
import StepViz from "@/components/ui/step-viz";

const STEPS = [
  {
    label: "두 stream은 각자 offset 장부를 가집니다",
    body: "Stream 0은 대화 텍스트, stream 4는 미리보기 데이터입니다. 각 stream 안에서는 순서를 지키지만 두 stream 사이의 전달 순서는 독립적입니다.",
  },
  {
    label: "Packet 18 손실은 stream 0에 빈 구간을 만듭니다",
    body: "Stream 0의 offset 100–199만 비어 있습니다. Stream 4의 연속된 0–299 bytes는 application에 전달할 수 있습니다.",
  },
  {
    label: "Packet 25가 빈 offset을 채우면 stream 0도 이어집니다",
    body: "같은 stream bytes를 새 packet number에 실어 보냅니다. 두 stream은 독립 전달되지만 congestion window와 MAX_DATA는 공유합니다.",
  },
] as const;

const C = {
  text: "#2563eb",
  preview: "#059669",
  lost: "#dc2626",
  recovered: "#7c3aed",
};

function Segment({
  x,
  y,
  color,
  label,
  dashed = false,
}: {
  x: number;
  y: number;
  color: string;
  label: string;
  dashed?: boolean;
}) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width="78"
        height="24"
        rx="5"
        fill={color + "14"}
        stroke={color}
        strokeDasharray={dashed ? "4 3" : undefined}
      />
      <text
        x={x + 39}
        y={y + 15}
        textAnchor="middle"
        fontSize="9.5"
        fontWeight="700"
        fill={color}
      >
        {label}
      </text>
    </g>
  );
}

export default function StreamMuxViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg
          viewBox="0 0 460 154"
          className="w-full max-w-2xl"
          aria-label="QUIC stream 0의 손실과 stream 4의 독립 전달"
        >
          <text x="16" y="31" fontSize="11" fontWeight="700" fill={C.text}>
            stream 0 · text
          </text>
          <Segment x={132} y={14} color={C.text} label="0–99" />
          <motion.g
            animate={{ opacity: step === 1 ? 0.3 : 1 }}
            transition={{ duration: 0.18 }}
          >
            <Segment
              x={218}
              y={14}
              color={step === 2 ? C.recovered : C.lost}
              label="100–199"
              dashed={step === 1}
            />
          </motion.g>
          <Segment x={304} y={14} color={C.text} label="200–299" />
          <text x="16" y="83" fontSize="11" fontWeight="700" fill={C.preview}>
            stream 4 · preview
          </text>
          <Segment x={132} y={66} color={C.preview} label="0–99" />
          <Segment x={218} y={66} color={C.preview} label="100–199" />
          <Segment x={304} y={66} color={C.preview} label="200–299" />
          <motion.g
            animate={{ opacity: step === 0 ? 0.25 : 1 }}
            transition={{ duration: 0.18 }}
          >
            <rect
              x="95"
              y="112"
              width="270"
              height="28"
              rx="7"
              fill={(step === 2 ? C.recovered : C.lost) + "12"}
              stroke={step === 2 ? C.recovered : C.lost}
            />
            <text
              x="230"
              y="130"
              textAnchor="middle"
              fontSize="10.5"
              fontWeight="700"
              fill={step === 2 ? C.recovered : C.lost}
            >
              {step === 2
                ? "PN 25: stream 0의 100–199 복구"
                : "PN 18 lost: stream 0만 빈 구간 대기"}
            </text>
          </motion.g>
        </svg>
      )}
    </StepViz>
  );
}
