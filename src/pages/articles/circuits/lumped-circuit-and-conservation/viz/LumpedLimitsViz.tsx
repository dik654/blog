import { ArrowHead } from "./CircuitSketch";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #limits — 점과 선으로 줄인 그림이 깨지는 세 경우. 글이 수치를 주지 않으므로 숫자와 축을 쓰지 않는다.
 */
const SCENES = [
  { label: "줄여 놓은 그림", summary: "점의 전압 · 선의 전류", note: "공간에 퍼진 전기장과 자기장을 점, 선, 부품 양끝의 관계로 줄였습니다. 전파 지연이 관심 시간에 비해 작고, 회로 밖 유도 효과와 빠뜨린 전하 축적도 작을 때 잘 맞습니다." },
  { label: "긴 선에 빠른 신호", summary: "한쪽과 다른 쪽이 다른 상태", note: "신호가 선을 따라 퍼지는 동안 앞쪽과 뒤쪽은 같은 순간에 같은 상태가 아닙니다. 선을 한 줄로 접으면 이 전파 시간을 잃습니다." },
  { label: "고리를 지나는 자기 선속", summary: "유도 전압을 따로 넣기", note: "자기 선속은 고리 면을 관통하는 자기장의 양입니다. 이 값이 빠르게 바뀌면 유도 전압을 별도 부품이나 식에 넣어야 합니다." },
  { label: "축전기에 전하가 쌓이는 순간", summary: "그 갈래를 빼고 더하면 안 됨", note: "축전기 갈래의 전류를 빠뜨린 채 나머지 둘만 더해서 0이라고 할 수 없습니다. 무엇을 경계 안의 요소로 넣었는지부터 확인합니다." },
];

function Baseline() {
  return (
    <g>
      <line x1={40} x2={320} y1={90} y2={90} stroke="#94a3b8" strokeWidth={1} />
      <rect x={145} y={70} width={70} height={40} rx={6} fill="#dcfce7" stroke="#16a34a" strokeWidth={1} />
      <text x={180} y={94} textAnchor="middle" fontSize={12} fontWeight={700} fill="#166534">부품</text>
      <ArrowHead x={100} y={90} />
      <circle cx={40} cy={90} r={4} fill="#2563eb" />
      <circle cx={320} cy={90} r={4} fill="#2563eb" />
      <g fontSize={12} fill="currentColor" textAnchor="middle" fontWeight={700}>
        <text x={40} y={70}>점의 전압</text>
        <text x={320} y={70}>점의 전압</text>
        <text x={95} y={118}>선의 전류</text>
        <text x={180} y={134}>부품 양끝의 관계</text>
      </g>
    </g>
  );
}

function LongLine() {
  return (
    <g>
      <line x1={30} x2={190} y1={110} y2={110} stroke="#2563eb" strokeWidth={1.25} />
      <line x1={190} x2={330} y1={110} y2={110} stroke="#94a3b8" strokeWidth={1} strokeDasharray="4 3" />
      <ArrowHead x={198} y={110} color="#2563eb" />
      <polyline points="30,50 190,50 190,90 330,90" fill="none" stroke="#d97706" strokeWidth={1.25} />
      <g fontSize={12} fontWeight={700} textAnchor="middle">
        <text x={110} y={40} fill="#b45309">신호가 이미 지난 쪽</text>
        <text x={260} y={80} fill="#64748b">아직 이전 상태</text>
        <text x={190} y={136} fill="currentColor">같은 순간, 한 선의 두 곳</text>
      </g>
      <text x={190} y={154} textAnchor="middle" fontSize={11} fill="#64748b">신호 앞머리 위치는 그림용(가정)</text>
    </g>
  );
}

function FluxLoop() {
  return (
    <g>
      <path d="M 110 34 H 250 V 62 M 250 112 V 146 H 110 V 34" fill="none" stroke="#94a3b8" strokeWidth={1} />
      <rect x={214} y={62} width={72} height={50} rx={6} fill="none" stroke="#dc2626" strokeWidth={1.25} strokeDasharray="4 3" />
      <text x={250} y={84} textAnchor="middle" fontSize={12} fontWeight={700} fill="#dc2626">유도 전압</text>
      <text x={250} y={100} textAnchor="middle" fontSize={11} fill="#dc2626">따로 넣기</text>
      {[[145, 66], [180, 66], [145, 112], [180, 112]].map(([x, y]) => (
        <g key={`${x}-${y}`}>
          <circle cx={x} cy={y} r={8} fill="none" stroke="#2563eb" strokeWidth={1} />
          <circle cx={x} cy={y} r={2} fill="#2563eb" />
        </g>
      ))}
      <text x={162} y={93} textAnchor="middle" fontSize={11} fontWeight={700} fill="#2563eb">자기 선속</text>
      <text x={180} y={170} textAnchor="middle" fontSize={12} fontWeight={700} fill="currentColor">고리 면을 뚫고 지나며 빠르게 변함</text>
    </g>
  );
}

function CapacitorBranch() {
  return (
    <g>
      <path d="M 40 60 H 320" fill="none" stroke="#94a3b8" strokeWidth={1} />
      <circle cx={180} cy={60} r={3.5} fill="#64748b" />
      <ArrowHead x={110} y={60} />
      <ArrowHead x={260} y={60} />
      <path d="M 180 60 V 104 M 180 114 V 150" fill="none" stroke="#dc2626" strokeWidth={1.25} strokeDasharray="4 3" />
      <line x1={156} x2={204} y1={104} y2={104} stroke="#dc2626" strokeWidth={1.25} />
      <line x1={156} x2={204} y1={114} y2={114} stroke="#dc2626" strokeWidth={1.25} />
      <ArrowHead x={180} y={92} angle={90} color="#dc2626" />
      <circle cx={180} cy={60} r={36} fill="none" stroke="#d97706" strokeWidth={1} strokeDasharray="5 4" />
      <text x={180} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill="#b45309">경계</text>
      <g fontSize={12} fontWeight={700} textAnchor="middle">
        <text x={80} y={48} fill="currentColor">갈래 1</text>
        <text x={282} y={48} fill="currentColor">갈래 2</text>
        <text x={258} y={112} fill="#dc2626">축전기 갈래</text>
        <text x={258} y={128} fontSize={11} fontWeight={400} fill="#dc2626">전하가 쌓이는 중</text>
      </g>
      <text x={90} y={118} textAnchor="middle" fontSize={11} fontWeight={700} fill="#64748b">갈래 1 + 2만으론</text>
      <text x={90} y={134} textAnchor="middle" fontSize={11} fontWeight={700} fill="#64748b">0이라 할 수 없음</text>
    </g>
  );
}

export default function LumpedLimitsViz() {
  return (
    <SceneShell
      eyebrow="근사의 경계"
      title="점과 선의 그림이 놓치는 세 가지 공간 효과"
      description="크기가 아니라 무엇이 그림에서 빠지는지를 비교합니다. 이 그림에는 수치를 넣지 않았습니다."
      ariaLabel="집중 회로 그림과, 긴 선의 전파 시간, 고리의 자기 선속, 축전기 갈래 전류를 빠뜨리는 세 경우"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox="0 0 360 180" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          {active === 0 && <Baseline />}
          {active === 1 && <LongLine />}
          {active === 2 && <FluxLoop />}
          {active === 3 && <CapacitorBranch />}
        </svg>
      )}
    />
  );
}
