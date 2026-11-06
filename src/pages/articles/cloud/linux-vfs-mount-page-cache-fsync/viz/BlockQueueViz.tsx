import type { ReactNode } from "react";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #block-iostat — 요청이 큐에서 합쳐지고 기다리고 장치로 나가는 그림과 iostat 열의 대응.
 * 칸 개수와 막대 길이는 모두 설명용 가정이며 실측값이 아니다. 숫자는 글에 없으므로 적지 않는다.
 */
const SCENES = [
  { label: "요청 합치기", summary: "w/s 낮음 · wkB/s 높음", note: "6절의 flusher가 연속된 dirty page를 모아 보내면 큐에서 하나로 합쳐집니다(rqm/s). 초당 요청 수 w/s는 낮은데 양 wkB/s는 높고 평균 요청 크기 wareq-sz가 큽니다. 칸 수는 설명용입니다(가정)." },
  { label: "await의 두 구간", summary: "await = 대기 + 처리", note: "await는 요청이 처리되기까지의 평균 ms이고 큐에서 기다린 시간과 실제 처리 시간을 합친 값입니다. 그래서 장치 자체가 빨라도 큐가 길면 커집니다. 막대 길이는 설명용입니다(가정)." },
  { label: "큐가 쌓일 때", summary: "w_await↑ · aqu-sz↑", note: "쓰기 요청의 await인 w_await와 평균 대기열 길이 aqu-sz가 함께 오르면 장치가 못 따라가 큐가 쌓이는 것입니다. 그 큐 뒤에 선 fsync는 그만큼 늦게 돌아옵니다." },
  { label: "flush는 한 번에 하나", summary: "f_await가 두 배로 보일 수 있음", note: "f_await는 장치 캐시를 비우는 flush 요청의 시간입니다. 블록 층이 flush를 한 번에 하나만 실행합니다. 두 프로세스가 동시에 fsync하면 뒤의 flush는 앞의 flush를 기다리므로 f_await가 두 배로 보일 수 있다고 man page가 적습니다." },
  { label: "%util 100%의 두 얼굴", summary: "같은 100%, 다른 여유", note: "%util은 요청이 장치에 나가 있던 시간의 비율일 뿐입니다. 하나씩 처리하는 장치에서는 100% 근처가 포화이지만, 병렬로 처리하는 RAID·SSD에서는 처리 칸이 비어 있어도 100%가 나올 수 있어 성능 한계를 뜻하지 않습니다. 포화는 await와 aqu-sz의 상승으로 봅니다. 칸 수는 설명용입니다(가정)." },
] as const;

const INK = "#475569";
const MUTED = "#64748b";

function Row({ y, label, children }: { y: number; label: string; children: ReactNode }) {
  return (
    <g>
      <text x={10} y={y - 6} fontSize={11} fill={MUTED}>{label}</text>
      {children}
    </g>
  );
}

function Merge() {
  return (
    <>
      <Row y={30} label="연속된 dirty page">
        {Array.from({ length: 8 }, (_, i) => <rect key={i} x={10 + i * 42} y={30} width={38} height={24} rx={3} fill="none" stroke="#d97706" strokeWidth={1} />)}
      </Row>
      <path d="M180 62 v22 M175 78 l5 6 5-6" fill="none" stroke="#94a3b8" strokeWidth={1} />
      <text x={190} y={78} fontSize={11} fill={MUTED}>큐에서 합쳐짐 (rqm/s)</text>
      <Row y={108} label="장치로 나가는 요청 하나">
        <rect x={10} y={108} width={332} height={26} rx={3} fill="#d97706" opacity={0.3} stroke="#d97706" strokeWidth={1} />
        <text x={176} y={125} textAnchor="middle" fontSize={12} fontWeight={700} fill="#b45309">wareq-sz가 큼</text>
      </Row>
    </>
  );
}

function Await() {
  return (
    <>
      <Row y={40} label="요청 하나의 시간">
        <rect x={10} y={40} width={210} height={30} rx={3} fill="#64748b" opacity={0.2} stroke="#64748b" strokeWidth={1} />
        <text x={115} y={60} textAnchor="middle" fontSize={12} fontWeight={700} fill={INK}>큐에서 대기</text>
        <rect x={220} y={40} width={122} height={30} rx={3} fill="#2563eb" opacity={0.22} stroke="#2563eb" strokeWidth={1} />
        <text x={281} y={60} textAnchor="middle" fontSize={12} fontWeight={700} fill="#2563eb">장치 처리</text>
      </Row>
      <path d="M10 82 v8 h332 v-8" fill="none" stroke="#94a3b8" strokeWidth={1} />
      <text x={176} y={108} textAnchor="middle" fontSize={13} fontWeight={700} fill={INK}>await</text>
      <text x={176} y={130} textAnchor="middle" fontSize={11} fill={MUTED}>길이 비율은 설명용 (가정)</text>
    </>
  );
}

function Backlog() {
  return (
    <>
      <text x={10} y={28} fontSize={11} fill={MUTED}>블록 층 큐 (왼쪽이 뒤)</text>
      {Array.from({ length: 5 }, (_, i) => <rect key={i} x={10 + i * 48} y={36} width={42} height={36} rx={3} fill="none" stroke="#94a3b8" strokeWidth={1} />)}
      <rect x={10} y={36} width={42} height={36} rx={3} fill="#dc2626" opacity={0.12} stroke="#dc2626" strokeWidth={1.25} />
      <text x={31} y={59} textAnchor="middle" fontSize={11} fontWeight={700} fill="#dc2626">fsync</text>
      <path d="M252 54 h24 M270 49 l6 5 -6 5" fill="none" stroke="#94a3b8" strokeWidth={1} />
      <rect x={278} y={36} width={64} height={36} rx={3} fill="#2563eb" opacity={0.15} stroke="#2563eb" strokeWidth={1} />
      <text x={310} y={59} textAnchor="middle" fontSize={12} fontWeight={700} fill="#2563eb">장치</text>
      <text x={10} y={104} fontSize={12} fontWeight={700} fill={INK}>aqu-sz: 줄이 길어짐</text>
      <text x={10} y={126} fontSize={12} fontWeight={700} fill={INK}>w_await: 기다리는 구간이 길어짐</text>
    </>
  );
}

function Flush() {
  return (
    <>
      <Row y={36} label="앞선 fsync의 flush">
        <rect x={10} y={36} width={150} height={28} rx={3} fill="#2563eb" opacity={0.22} stroke="#2563eb" strokeWidth={1} />
        <text x={85} y={55} textAnchor="middle" fontSize={12} fontWeight={700} fill="#2563eb">flush</text>
      </Row>
      <Row y={100} label="동시에 부른 다른 fsync의 flush">
        <rect x={10} y={100} width={150} height={28} rx={3} fill="#64748b" opacity={0.2} stroke="#64748b" strokeWidth={1} />
        <text x={85} y={119} textAnchor="middle" fontSize={12} fontWeight={700} fill={INK}>앞의 것을 기다림</text>
        <rect x={160} y={100} width={150} height={28} rx={3} fill="#2563eb" opacity={0.22} stroke="#2563eb" strokeWidth={1} />
        <text x={235} y={119} textAnchor="middle" fontSize={12} fontWeight={700} fill="#2563eb">flush</text>
      </Row>
      <text x={176} y={146} textAnchor="middle" fontSize={11} fill={MUTED}>뒤쪽 f_await는 대기까지 포함</text>
    </>
  );
}

function Util() {
  return (
    <>
      <text x={10} y={16} fontSize={12} fontWeight={700} fill={INK}>하나씩 처리하는 장치</text>
      <rect x={10} y={22} width={84} height={24} rx={3} fill="#dc2626" opacity={0.18} stroke="#dc2626" strokeWidth={1} />
      <text x={52} y={38} textAnchor="middle" fontSize={11} fontWeight={700} fill="#dc2626">처리 중</text>
      <text x={104} y={38} fontSize={11} fill={MUTED}>빈 칸 없음</text>
      <text x={342} y={38} textAnchor="end" fontSize={12} fontWeight={700} fill="#dc2626">%util 100 · 포화</text>
      <line x1={10} x2={342} y1={62} y2={62} stroke="#94a3b8" strokeWidth={1} strokeDasharray="3 3" />
      <text x={10} y={82} fontSize={12} fontWeight={700} fill={INK}>병렬로 처리하는 RAID·SSD (칸 수는 가정)</text>
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <rect x={10 + i * 44} y={90} width={40} height={24} rx={3} fill={i === 0 ? "#16a34a" : "none"} fillOpacity={i === 0 ? 0.2 : undefined} stroke={i === 0 ? "#16a34a" : "#94a3b8"} strokeWidth={1} strokeDasharray={i === 0 ? undefined : "3 2"} />
          <text x={30 + i * 44} y={106} textAnchor="middle" fontSize={11} fontWeight={i === 0 ? 700 : 400} fill={i === 0 ? "#16a34a" : MUTED}>{i === 0 ? "처리" : "빈 칸"}</text>
        </g>
      ))}
      <text x={342} y={106} textAnchor="end" fontSize={12} fontWeight={700} fill="#16a34a">%util 100</text>
      <text x={10} y={136} fontSize={11} fill={MUTED}>요청 하나만 늘 나가 있어도 시간 비율은 100%입니다</text>
    </>
  );
}

export default function BlockQueueViz() {
  return (
    <SceneShell
      eyebrow="iostat -x"
      title="iostat의 열이 큐의 어디를 가리키는가"
      description="장면마다 블록 층의 큐와 장치 일부를 그렸습니다. 숫자 없이 모양만 보며, 칸 수와 막대 길이는 설명용입니다(가정)."
      ariaLabel="요청 합치기, await, 큐 누적, flush 직렬화, %util"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox="0 0 352 152" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          {active === 0 && <Merge />}
          {active === 1 && <Await />}
          {active === 2 && <Backlog />}
          {active === 3 && <Flush />}
          {active === 4 && <Util />}
        </svg>
      )}
    />
  );
}
