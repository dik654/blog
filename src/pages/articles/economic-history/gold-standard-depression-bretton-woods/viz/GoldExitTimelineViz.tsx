import type { ReactNode } from "react";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #source — 체제 전체의 순서와, 나라마다 다른 이탈 시점.
 * 첫 장면은 순서만 보이는 띠이고, 뒤 장면은 1925~1935년을 같은 눈금으로 편 그림입니다.
 * 영국 1925년 4월 말~1931년 9월, 미국 1933년 4월 20일. 1931년 9월~1933년 4월 ≈ 19개월은 산수입니다.
 * 본문에 미국의 시작 날짜가 없어 미국 줄은 시작을 정하지 않은 점선과 끝 점으로만 그립니다.
 */
const SCENES = [
  { label: "체제 전체의 순서", summary: "성립 → 유지 → 복원 → 붕괴", note: "IMF 자료의 큰 연표입니다. 칸 간격은 기간이 아니고, 모든 나라가 같은 기간에 참여했다는 뜻도 아닙니다." },
  { label: "영국", summary: "1925년 4월 말 ~ 1931년 9월", note: "영국은 약 6년 5개월 뒤 금 교환을 중단해, 유출을 긴축으로 막아야 하는 제약에서 먼저 벗어났습니다." },
  { label: "미국", summary: "1933년 4월 20일 공식 정지", note: "영국이 나간 뒤 약 19개월 동안 미국은 아직 금본위 안에 있었습니다. 제약이 풀린 시점이 다릅니다." },
  { label: "다른 나라들", summary: "금 블록 · 원자재 수출국", note: "금 블록의 시점은 또 달랐고, 원자재 수출국은 가격 급락과 지급 압력을 먼저 겪기도 했습니다. 날짜가 없어 점선입니다." },
] as const;

const W = 320;
const H = 196;
const MUTED = "#64748b";
const IDLE = "#94a3b8";
const GOLD = "#d97706";
const BLUE = "#2563eb";

const PHASES = [
  ["1870~1880년대", "주요 통화가 금본위제로 옮겨 감"],
  ["제1차 세계대전까지", "체제가 이어짐"],
  ["전쟁 뒤", "수정된 형태로 복원"],
  ["1930년대", "디플레이션·대공황 압력에 무너짐"],
] as const;

function Phases() {
  return (
    <>
      <line x1={7} x2={7} y1={22} y2={172} stroke={IDLE} strokeWidth={1} />
      {PHASES.map(([when, what], row) => {
        const y = 22 + row * 50;
        const last = row === PHASES.length - 1;
        return (
          <g key={when}>
            <circle cx={7} cy={y} r={5} fill={last ? "#dc2626" : GOLD} />
            <text x={22} y={y + 2} fontSize={13} fontWeight={700} fill={last ? "#dc2626" : GOLD}>{when}</text>
            <text x={22} y={y + 21} fontSize={13} fill={MUTED}>{what}</text>
          </g>
        );
      })}
    </>
  );
}

const X0 = 62;
const X1 = W - 4;
const year = (value: number) => X0 + ((value - 1925) / 10) * (X1 - X0);
const UK_START = 1925 + 4 / 12;
const UK_END = 1931 + 8.5 / 12;
const US_END = 1933 + 3.65 / 12;
const AXIS_Y = 176;

function Lane({ y, name, children }: { y: number; name: string; children: ReactNode }) {
  return (
    <g>
      <text x={0} y={y + 15} fontSize={13} fontWeight={700} fill={MUTED}>{name}</text>
      {children}
    </g>
  );
}

function Lanes({ index }: { index: number }) {
  const showUs = index >= 2;
  const showOthers = index === 3;
  return (
    <>
      {showUs && <rect x={year(UK_END)} y={8} width={year(US_END) - year(UK_END)} height={AXIS_Y - 8} fill={BLUE} fillOpacity={0.12} />}
      {showUs && <text x={(year(UK_END) + year(US_END)) / 2} y={22} textAnchor="middle" fontSize={12} fontWeight={700} fill={BLUE}>19개월</text>}
      <Lane y={30} name="영국">
        <rect x={year(UK_START)} y={30} width={year(UK_END) - year(UK_START)} height={22} rx={2} fill={GOLD} />
        <text x={year(UK_START) + 6} y={45} fontSize={12} fontWeight={700} fill="#ffffff">금 교환 유지</text>
        <text x={year(UK_END) + 5} y={45} fontSize={12} fill={MUTED}>{showUs ? "" : "제약 밖"}</text>
      </Lane>
      <Lane y={66} name="미국">
        {showUs ? (
          <>
            <line x1={X0} x2={year(US_END)} y1={82} y2={82} stroke={GOLD} strokeWidth={1.25} strokeDasharray="3 3" />
            <circle cx={year(US_END)} cy={82} r={4} fill={GOLD} />
            <text x={X0 + 2} y={76} fontSize={12} fontWeight={700} fill={GOLD}>금본위 유지 · 시작 날짜 생략</text>
          </>
        ) : (
          <line x1={X0} x2={X1} y1={77} y2={77} stroke={IDLE} strokeWidth={1} strokeDasharray="3 3" />
        )}
      </Lane>
      <Lane y={102} name="금 블록">
        <line x1={X0} x2={X1} y1={113} y2={113} stroke={IDLE} strokeWidth={1} strokeDasharray="3 3" />
        {showOthers && <text x={X1} y={108} textAnchor="end" fontSize={12} fontWeight={700} fill={MUTED}>시점이 또 달랐음</text>}
      </Lane>
      <Lane y={138} name="원자재">
        <line x1={X0} x2={X1} y1={149} y2={149} stroke={IDLE} strokeWidth={1} strokeDasharray="3 3" />
        {showOthers && <text x={X1} y={144} textAnchor="end" fontSize={12} fontWeight={700} fill={MUTED}>가격 급락·지급 압력을 먼저</text>}
      </Lane>
      <line x1={X0} x2={X1} y1={AXIS_Y} y2={AXIS_Y} stroke={IDLE} strokeWidth={1} />
      {[1925, 1931, 1933].map((value) => (
        <g key={value}>
          <line x1={year(value)} x2={year(value)} y1={AXIS_Y} y2={AXIS_Y + 4} stroke={IDLE} strokeWidth={1} />
          <text x={year(value)} y={AXIS_Y + 18} textAnchor="middle" fontSize={12} fill={MUTED}>{value}</text>
        </g>
      ))}
    </>
  );
}

export default function GoldExitTimelineViz() {
  return (
    <SceneShell
      eyebrow="이탈의 순서"
      title="체제의 연표 하나 아래에 나라마다 다른 이탈 시점이 있습니다"
      description="금본위제는 언제 무너졌을까요? 큰 순서를 본 뒤 1925~1935년을 같은 눈금으로 펴서 나라별로 나눕니다."
      note="미국 줄은 끝 날짜만 본문에 있어 시작을 정하지 않고 점선으로 그렸습니다. 19개월과 6년 5개월은 본문 날짜에서 계산한 어림값입니다."
      ariaLabel="금본위제 전체 순서와 영국, 미국, 금 블록, 원자재 수출국의 서로 다른 시점"
      scenes={SCENES}
      render={(index) => (
        <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[520px]" role="img" aria-label={`${SCENES[index].label}: ${SCENES[index].summary}`}>
          {index === 0 ? <Phases /> : <Lanes index={index} />}
        </svg>
      )}
    />
  );
}
