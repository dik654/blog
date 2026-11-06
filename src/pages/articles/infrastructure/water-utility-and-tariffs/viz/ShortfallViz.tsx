import SceneShell from "./SceneShell";
import { StackBar, type BarPart } from "./StackBar";

/**
 * 본문 대응: #mechanism, #source — 서비스 90에 가구 80 + 지원 10이면 맞고,
 * 요금을 60으로 낮추면 요금만의 간격 30, 지원 10을 넣어도 최종 부족 20이 남는다.
 */
const BLUE = "#2563eb";
const GREEN = "#15803d";
const RED = "#dc2626";
const SERVICE: readonly BarPart[] = [{ value: 90, label: "서비스 90", fill: "#475569" }];

const SCENES = [
  { label: "맞는 장부", summary: "80 + 10 = 90", note: "가구 수입 80과 정부 지급 10이면 서비스 90을 충당합니다." },
  { label: "요금을 60으로", summary: "90 − 60 = 30", note: "가구 수입을 60으로 낮추면 요금만으로는 30이 비어 있습니다. 5절이 세계은행 연구로 다시 짚는 간격입니다." },
  { label: "지원 10을 넣어도", summary: "60 + 10 = 70 · 부족 20", note: "지원을 10에 두면 총수입은 70이고 부족액은 20입니다. 숫자는 모두 이 글의 가정입니다." },
  { label: "20을 어떻게", summary: "지원·다른 수입·축소", note: "지원을 더 받거나 다른 수입을 마련하지 않으면 교체나 운영을 줄여야 합니다. 부족액 20이 저절로 사라지는 길은 없습니다." },
] as const satisfies readonly { label: string; summary: string; note: string }[];

const INCOME: readonly (readonly BarPart[])[] = [
  [{ value: 80, label: "가구 80", fill: BLUE }, { value: 10, label: "10", fill: GREEN }],
  [{ value: 60, label: "가구 60", fill: BLUE }, { value: 30, label: "빈 몫 30", fill: RED, dashed: true }],
  [{ value: 60, label: "가구 60", fill: BLUE }, { value: 10, label: "10", fill: GREEN }, { value: 20, label: "20", fill: RED, dashed: true }],
  [{ value: 60, label: "가구 60", fill: BLUE }, { value: 10, label: "10", fill: GREEN }, { value: 20, label: "20", fill: RED, dashed: true }],
];

function Option({ x, y, w, title, sub, strong = false }: { x: number; y: number; w: number; title: string; sub: string; strong?: boolean }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={46} rx={6} fill="none" stroke={strong ? RED : "#94a3b8"} strokeWidth={1} />
      <text x={x + w / 2} y={y + 19} textAnchor="middle" fontSize={11} fontWeight={700} fill={strong ? RED : "currentColor"}>{title}</text>
      <text x={x + w / 2} y={y + 35} textAnchor="middle" fontSize={11} fill="#64748b">{sub}</text>
    </g>
  );
}

export default function ShortfallViz() {
  return (
    <SceneShell
      eyebrow="(가정) 같은 90, 다른 수입"
      title="요금을 낮추면 지원을 넣고도 20이 비어 있습니다"
      description="위 막대가 필요한 돈, 아래 막대가 실제 수입입니다. 파랑은 가구, 초록은 정부 지급, 빨간 점선은 아직 비어 있는 몫입니다."
      ariaLabel="서비스 90과 가구 수입, 정부 지급, 부족액 비교"
      scenes={SCENES}
      render={(index) => {
        const gapStart = 20 + 70 * 3;
        return (
          <svg viewBox="0 0 360 208" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[index].label}: ${SCENES[index].summary}`}>
            <text x={20} y={14} fontSize={12} fontWeight={700} fill="currentColor">필요한 돈</text>
            <StackBar y={20} parts={SERVICE} height={30} />
            <text x={20} y={74} fontSize={12} fontWeight={700} fill="currentColor">{index === 1 ? "요금 수입만" : "실제 수입"}</text>
            <StackBar y={80} parts={INCOME[index]} height={30} />
            {index >= 2 && <text x={20 + 60 * 3 + 15} y={124} textAnchor="middle" fontSize={11} fontWeight={700} fill={GREEN}>정부 10</text>}
            {index === 0 && <text x={20 + 80 * 3 + 15} y={124} textAnchor="middle" fontSize={11} fontWeight={700} fill={GREEN}>정부 10</text>}
            {index < 3 && (
              <text x={180} y={166} textAnchor="middle" fontSize={15} fontWeight={700} fill={index === 0 ? "currentColor" : RED}>
                {["부족 0", "요금만의 간격 30", "지원 뒤 부족 20"][index]}
              </text>
            )}
            {index === 3 && (
              <>
                <path d={`M${gapStart + 30} 112V134M${58} 134H${302}M58 134V146M180 134V146M302 134V146`} fill="none" stroke="#94a3b8" strokeWidth={1} />
                <Option x={8} y={146} w={100} title="지원 더 받기" sub="정부 지급 증가" />
                <Option x={130} y={146} w={100} title="다른 수입" sub="따로 마련" />
                <Option x={252} y={146} w={100} title="둘 다 없으면" sub="교체·운영 축소" strong />
              </>
            )}
          </svg>
        );
      }}
    />
  );
}
