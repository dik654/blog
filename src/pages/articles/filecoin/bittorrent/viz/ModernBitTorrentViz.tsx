import { motion, useReducedMotion } from "framer-motion";
import StepViz from "@/components/ui/step-viz";

const FLOW_STEPS = [
  {
    label: "메타정보로 받을 대상을 고정",
    body: "info dictionary의 hash는 swarm을 고르고, piece hash 목록은 완성한 조각을 검사하는 기준이 됩니다.",
  },
  {
    label: "Tracker·DHT에서 주소 후보를 발견",
    body: "여기서 얻는 것은 IP:port 후보뿐입니다. 연결 성공이나 올바른 byte는 아직 증명되지 않았습니다.",
  },
  {
    label: "Handshake로 같은 swarm인지 확인",
    body: "연결한 peer가 보낸 info_hash가 다르면 block을 요청하지 않습니다. Peer ID는 사람의 신원 증명이 아닙니다.",
  },
  {
    label: "Block을 모아 piece hash로 승인",
    body: "작은 block을 여러 peer에게 받아 piece를 완성하고, 기대한 SHA-1과 같을 때만 보유 조각으로 공개합니다.",
  },
] as const;

const X = [74, 218, 362, 506];
const LABELS = [".torrent", "주소 후보", "연결한 peer", "승인된 piece"];
const SUB = ["info + hashes", "IP : port", "info_hash 일치", "hash 일치"];
const COLORS = ["#4f46e5", "#d97706", "#7c3aed", "#059669"];

export function BitTorrentTrustFlowViz() {
  const reduced = useReducedMotion();
  return (
    <StepViz steps={FLOW_STEPS}>
      {(step) => (
        <svg viewBox="0 0 580 220" role="img" aria-label="BitTorrent 발견과 검증 경계">
          <defs>
            <marker id="bt-flow-arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
              <path d="M0 0L7 3.5L0 7Z" fill="#94a3b8" />
            </marker>
          </defs>
          <text x="290" y="22" textAnchor="middle" fontSize="12" fontWeight="700" fill="currentColor">
            주소를 찾는 경로와 byte를 믿는 경로는 다릅니다
          </text>
          {X.slice(0, -1).map((x, index) => (
            <motion.line
              key={x}
              x1={x + 48}
              y1="96"
              x2={X[index + 1] - 55}
              y2="96"
              stroke="#94a3b8"
              strokeWidth="1.25"
              markerEnd="url(#bt-flow-arrow)"
              initial={false}
              animate={{ opacity: step > index ? 1 : 0.18, pathLength: step > index ? 1 : 0 }}
              transition={{ duration: reduced ? 0 : 0.3 }}
            />
          ))}
          {X.map((x, index) => {
            const active = index === step;
            const passed = index <= step;
            return (
              <motion.g
                key={LABELS[index]}
                initial={false}
                animate={{ opacity: passed ? 1 : 0.3, scale: active ? 1.04 : 1 }}
                transition={{ duration: reduced ? 0 : 0.2 }}
                style={{ transformOrigin: `${x}px 96px` }}
              >
                <rect x={x - 48} y="64" width="96" height="64" rx="14" fill={`${COLORS[index]}14`} stroke={COLORS[index]} strokeWidth={active ? 1.25 : 1} />
                <text x={x} y="90" textAnchor="middle" fontSize="12" fontWeight="700" fill={COLORS[index]}>{LABELS[index]}</text>
                <text x={x} y="110" textAnchor="middle" fontSize="10" fill="currentColor" opacity="0.65">{SUB[index]}</text>
              </motion.g>
            );
          })}
          <rect x="26" y="154" width="528" height="42" rx="10" fill="var(--muted)" opacity="0.55" />
          <text x="42" y="172" fontSize="10" fontWeight="700" fill={COLORS[step]}>지금 확정된 것</text>
          <text x="42" y="187" fontSize="11" fill="currentColor">
            {[
              "받을 torrent와 piece별 기대 hash",
              "연결을 시도할 endpoint 후보",
              "이 연결이 같은 info_hash를 말한다는 사실",
              "이 piece의 byte가 metainfo와 같다는 사실",
            ][step]}
          </text>
        </svg>
      )}
    </StepViz>
  );
}

const PIECE_STEPS = [
  {
    label: "700 KiB를 세 piece로 나눔",
    body: "piece length가 256 KiB이므로 256 + 256 + 188 KiB가 됩니다. 마지막 조각만 짧습니다.",
  },
  {
    label: "첫 piece를 16 KiB block 16개로 요청",
    body: "piece는 hash 검증 단위이고 block은 wire request 단위입니다. 두 단위를 구별해야 여러 peer에 일을 나눌 수 있습니다.",
  },
  {
    label: "16개 block을 piece buffer에 조립",
    body: "어느 peer에게서 왔는지 provenance를 남기되, block 하나만으로는 v1 piece hash를 승인할 수 없습니다.",
  },
  {
    label: "전체 256 KiB의 SHA-1을 비교",
    body: "일치하면 HAVE로 공개할 수 있고, 불일치하면 piece 전체를 인정하지 않고 다른 peer에게 다시 요청합니다.",
  },
] as const;

export function BitTorrentPieceLedgerViz() {
  const reduced = useReducedMotion();
  return (
    <StepViz steps={PIECE_STEPS}>
      {(step) => (
        <svg viewBox="0 0 580 250" role="img" aria-label="BitTorrent piece와 block 검증 장부">
          <text x="30" y="28" fontSize="12" fontWeight="700" fill="currentColor">고정 예시 · 전체 700 KiB · piece 256 KiB · request block 16 KiB</text>
          {[0, 1, 2].map((piece) => {
            const widths = [190, 190, 140];
            const starts = [30, 224, 418];
            return (
              <g key={piece}>
                <rect x={starts[piece]} y="48" width={widths[piece]} height="42" rx="8" fill={piece === 0 && step > 0 ? "#4f46e51c" : "var(--muted)"} stroke={piece === 0 && step > 0 ? "#4f46e5" : "#94a3b8"} />
                <text x={starts[piece] + widths[piece] / 2} y="66" textAnchor="middle" fontSize="11" fontWeight="700" fill="currentColor">piece {piece}</text>
                <text x={starts[piece] + widths[piece] / 2} y="81" textAnchor="middle" fontSize="10" fill="currentColor" opacity="0.65">{piece < 2 ? "256 KiB" : "188 KiB"}</text>
              </g>
            );
          })}
          <path d="M30 104H220" stroke="#4f46e5" strokeWidth="1.25" strokeDasharray="4 4" opacity={step > 0 ? 1 : 0.2} />
          {Array.from({ length: 16 }, (_, index) => {
            const x = 30 + index * 33;
            const received = step >= 2;
            return (
              <motion.g key={index} initial={false} animate={{ opacity: step > 0 ? 1 : 0.12 }} transition={{ delay: reduced ? 0 : index * 0.015 }}>
                <rect x={x} y="124" width="29" height="34" rx="5" fill={received ? "#0596691d" : "#d9770618"} stroke={received ? "#059669" : "#d97706"} />
                <text x={x + 14.5} y="145" textAnchor="middle" fontSize="9" fontWeight="700" fill={received ? "#059669" : "#d97706"}>{index + 1}</text>
              </motion.g>
            );
          })}
          <text x="30" y="177" fontSize="10" fill="currentColor" opacity="0.65">block 1…16 · 각각 16 KiB</text>
          <rect x="30" y="194" width="528" height="36" rx="9" fill={step === 3 ? "#05966918" : "var(--muted)"} stroke={step === 3 ? "#059669" : "#94a3b8"} />
          <text x="294" y="216" textAnchor="middle" fontSize="11" fontWeight="700" fill={step === 3 ? "#059669" : "currentColor"}>
            {step === 3 ? "SHA-1(piece bytes) = metainfo hash → 승인" : "piece가 완성되기 전에는 hash 판정 보류"}
          </text>
        </svg>
      )}
    </StepViz>
  );
}
