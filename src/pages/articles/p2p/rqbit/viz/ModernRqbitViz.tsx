import { motion, useReducedMotion } from "framer-motion";
import StepViz from "@/components/ui/step-viz";

const PIPELINE_STEPS = [
  {
    label: "후보 주소는 peer queue에만 넣음",
    body: "Tracker·DHT의 IP:port는 아직 연결도, 올바른 byte도 아닙니다.",
  },
  {
    label: "Handshake·bitfield·unchoke를 통과",
    body: "같은 info_hash이고 필요한 piece를 가졌으며 request를 받을 수 있는 live peer가 됩니다.",
  },
  {
    label: "PieceTracker가 piece 1의 owner를 정함",
    body: "Streaming 우선 piece, 일반 queue, 느린 owner의 steal 순으로 한 peer에게 piece를 예약합니다.",
  },
  {
    label: "16 KiB chunk를 disk에 쓰고 piece를 완성",
    body: "Chunk가 모두 와도 아직 HAVE가 아닙니다. In-flight에서 빼고 storage의 piece byte를 hash합니다.",
  },
  {
    label: "Hash가 맞으면 stream을 깨우고 HAVE 전송",
    body: "Mismatch면 piece를 queue로 되돌리고 현재 peer를 끊습니다. 검증된 byte만 다음 경계로 갑니다.",
  },
] as const;

const NODES = [
  { x: 62, title: "후보", sub: "IP : port", color: "#d97706" },
  { x: 172, title: "live peer", sub: "bitfield", color: "#0284c7" },
  { x: 282, title: "owner", sub: "piece 1", color: "#7c3aed" },
  { x: 392, title: "storage", sub: "chunks", color: "#db2777" },
  { x: 502, title: "verified", sub: "HAVE + wake", color: "#059669" },
] as const;

export function RqbitPipelineViz() {
  const reduced = useReducedMotion();
  return (
    <StepViz steps={PIPELINE_STEPS}>
      {(step) => (
        <svg viewBox="0 0 570 220" role="img" aria-label="rqbit peer 후보에서 verified piece까지">
          <defs>
            <marker id="rqbit-arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
              <path d="M0 0L7 3.5L0 7Z" fill="#94a3b8" />
            </marker>
          </defs>
          <text x="285" y="23" textAnchor="middle" fontSize="12" fontWeight="700" fill="currentColor">
            rqbit 9.0.1 · 700 KiB torrent의 piece 1을 따라갑니다
          </text>
          {NODES.slice(0, -1).map((node, index) => (
            <motion.line
              key={node.title}
              x1={node.x + 42}
              y1="92"
              x2={NODES[index + 1].x - 49}
              y2="92"
              stroke="#94a3b8"
              strokeWidth="1.2"
              markerEnd="url(#rqbit-arrow)"
              initial={false}
              animate={{ opacity: step > index ? 1 : 0.18, pathLength: step > index ? 1 : 0 }}
              transition={{ duration: reduced ? 0 : 0.28 }}
            />
          ))}
          {NODES.map((node, index) => {
            const active = index === step;
            return (
              <motion.g
                key={node.title}
                initial={false}
                animate={{ opacity: index <= step ? 1 : 0.28, scale: active ? 1.04 : 1 }}
                transition={{ duration: reduced ? 0 : 0.2 }}
                style={{ transformOrigin: `${node.x}px 92px` }}
              >
                <rect x={node.x - 42} y="60" width="84" height="64" rx="13" fill={`${node.color}16`} stroke={node.color} strokeWidth={active ? 1.25 : 1} />
                <text x={node.x} y="87" textAnchor="middle" fontSize="11" fontWeight="700" fill={node.color}>{node.title}</text>
                <text x={node.x} y="106" textAnchor="middle" fontSize="9.5" fill="currentColor" opacity="0.65">{node.sub}</text>
              </motion.g>
            );
          })}
          <rect x="20" y="153" width="530" height="42" rx="10" fill="var(--muted)" opacity="0.58" />
          <text x="36" y="171" fontSize="10" fontWeight="700" fill={NODES[step].color}>지금 state가 증명하는 것</text>
          <text x="36" y="187" fontSize="10.5" fill="currentColor">
            {[
              "이 주소에 연결을 시도할 수 있음",
              "같은 torrent를 말하는 연결이 있고 piece 목록을 받음",
              "이 시점의 piece 1 작업 주체가 한 peer로 정해짐",
              "piece 1의 모든 chunk가 storage에 놓였음 · hash는 아직",
              "piece 1 byte가 metainfo hash와 같아 읽기·업로드 가능",
            ][step]}
          </text>
        </svg>
      )}
    </StepViz>
  );
}

const RANGE_STEPS = [
  {
    label: "400 KiB에서 200 KiB를 읽고 싶음",
    body: "마지막 포함 byte는 599 KiB입니다. End-exclusive 600을 그대로 나누면 경계 오류가 생깁니다.",
  },
  {
    label: "Piece 1은 준비됐지만 piece 2는 없음",
    body: "FileStream은 piece 1의 요청 범위만 읽고, 다음 poll에서는 waker를 등록한 뒤 Pending을 반환합니다.",
  },
  {
    label: "Piece 2 hash 성공이 stream을 깨움",
    body: "on_piece_completed가 waker를 깨우면 다시 poll하고, storage에서 나머지 byte를 읽어 200 KiB를 완성합니다.",
  },
] as const;

export function RqbitRangeViz() {
  const reduced = useReducedMotion();
  return (
    <StepViz steps={RANGE_STEPS}>
      {(step) => (
        <svg viewBox="0 0 570 235" role="img" aria-label="rqbit range stream이 검증된 piece를 기다리는 과정">
          <text x="28" y="25" fontSize="12" fontWeight="700" fill="currentColor">파일 byte 좌표 · 요청 [400, 600) KiB</text>
          {[
            { x: 28, w: 170, label: "piece 0", range: "0–255", need: false },
            { x: 202, w: 170, label: "piece 1", range: "256–511", need: true },
            { x: 376, w: 166, label: "piece 2", range: "512–699", need: true },
          ].map((piece, index) => {
            const ready = index === 1 || (index === 2 && step === 2);
            const color = !piece.need ? "#64748b" : ready ? "#059669" : "#d97706";
            return (
              <g key={piece.label}>
                <rect x={piece.x} y="48" width={piece.w} height="58" rx="10" fill={`${color}16`} stroke={color} strokeWidth={piece.need ? 2 : 1.2} />
                <text x={piece.x + piece.w / 2} y="72" textAnchor="middle" fontSize="11" fontWeight="700" fill={color}>{piece.label}</text>
                <text x={piece.x + piece.w / 2} y="91" textAnchor="middle" fontSize="10" fill="currentColor" opacity="0.65">{piece.range} KiB · {piece.need ? (ready ? "verified" : "waiting") : "not needed"}</text>
              </g>
            );
          })}
          <motion.rect
            x="298"
            y="119"
            width="166"
            height="12"
            rx="6"
            fill="#4f46e5"
            initial={false}
            animate={{ opacity: step === 0 ? 0.4 : 0.9, scaleX: step === 1 ? 0.56 : 1 }}
            transition={{ duration: reduced ? 0 : 0.25 }}
            style={{ transformOrigin: "298px 125px" }}
          />
          <text x="381" y="148" textAnchor="middle" fontSize="10" fill="#4f46e5">요청 byte 400–599 KiB</text>
          <rect x="28" y="169" width="514" height="42" rx="10" fill="var(--muted)" opacity="0.58" />
          <text x="44" y="187" fontSize="10" fontWeight="700" fill={step === 1 ? "#d97706" : "#059669"}>{step === 1 ? "Poll::Pending" : step === 2 ? "Wake → Poll::Ready" : "필요 pieces 계산"}</text>
          <text x="44" y="202" fontSize="10.5" fill="currentColor">
            {step === 0 ? "first=1 · last=2 · 두 piece가 필요" : step === 1 ? "piece 2가 아직 have=false라 waker를 등록" : "piece 2 completion 뒤 남은 88 KiB를 읽어 response 완성"}
          </text>
        </svg>
      )}
    </StepViz>
  );
}
