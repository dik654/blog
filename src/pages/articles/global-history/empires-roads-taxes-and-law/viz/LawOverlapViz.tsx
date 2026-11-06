import { Arrow, Box } from "./FlowParts";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #need 둘째 문단 — 중앙의 법·지방의 관습·종교 공동체의 규칙이 한 공간에 겹칠 때.
 * 사안 배정 예(세금=왕의 규칙, 혼인·상속=현지 관습)는 #names의 '법의 중첩' 항목에서 온다.
 */
const ACCENT = "#d97706";
const RULES = [
  { name: "중앙의 법", x: 8 },
  { name: "지방의 관습", x: 126 },
  { name: "종교 규칙", x: 244 },
] as const;
const MATTERS = [
  { name: "세금", x: 8 },
  { name: "혼인·상속", x: 126 },
  { name: "겹치는 사안", x: 244 },
] as const;
const W = 108;

const SCENES = [
  { label: "세금은 왕의 규칙으로", summary: "규칙 하나 → 사안 하나", from: [0], to: 0, note: "먼 지방의 마을에서도 세금은 왕의 규칙으로 다룰 수 있습니다." },
  { label: "혼인과 상속은 현지 관습으로", summary: "같은 마을, 다른 규칙", from: [1], to: 1, note: "같은 마을에서 혼인과 상속은 현지 관습으로 다룰 수 있습니다. 수도가 마을마다의 가족 관계와 관습법을 다 알 수 없기 때문입니다." },
  { label: "세 규칙이 한 사안에 겹치면", summary: "어느 법정·신분이 우선?", from: [0, 1, 2], to: 2, note: "중앙의 법, 지방의 관습, 종교 규칙이 겹치면 어느 법정과 신분이 우선하는지도 정치 문제가 됩니다. 구체적 사건은 글에 없어 '겹치는 사안'으로만 적었고, 칸 크기가 같아도 권력이 대등하다는 뜻은 아닙니다." },
] as const;

export default function LawOverlapViz() {
  return (
    <SceneShell
      eyebrow="한 마을의 세 규칙"
      title="한 마을에 규칙이 셋이면 무엇이 먼저일까요"
      description="위는 규칙, 아래는 같은 마을의 사안입니다. 선이 그 사안을 다루는 규칙을 가리킵니다."
      ariaLabel="중앙의 법, 지방의 관습, 종교 공동체 규칙이 마을의 사안에 닿는 모습"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const from: readonly number[] = scene.from;
        const target = MATTERS[scene.to];
        const clash = active === 2;
        return (
          <svg viewBox="0 0 360 196" className="mx-auto h-auto w-full max-w-[560px] text-foreground" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            {RULES.map((rule, index) => (
              <Box key={rule.name} x={rule.x} y={8} w={W} h={34} title={rule.name} color="#2563eb" on={from.includes(index)} />
            ))}
            <rect x={2} y={102} width={356} height={50} rx={8} fill="none" stroke="#94a3b8" strokeWidth={1} strokeDasharray="4 3" />
            <text x={10} y={96} fontSize={10.5} fill="currentColor" opacity={0.75}>같은 마을</text>
            {MATTERS.map((matter, index) => (
              <Box key={matter.name} x={matter.x} y={110} w={W} h={34} title={matter.name} color={index === 2 && clash ? ACCENT : "#64748b"} on={scene.to === index} />
            ))}
            {from.map((index) => (
              <Arrow key={index} x1={RULES[index].x + W / 2} y1={42} x2={target.x + W / 2 + (index - 1) * (clash ? 22 : 0)} y2={108} color={clash ? ACCENT : "#2563eb"} on />
            ))}
            <text x={352} y={176} textAnchor="end" fontSize={12} fontWeight={700} fill={ACCENT} opacity={clash ? 1 : 0}>어느 법정·어느 신분이 우선?</text>
          </svg>
        );
      }}
    />
  );
}
