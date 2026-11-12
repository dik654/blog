import SceneShell from "./SceneShell";

/**
 * 본문 대응: #data-poisoning — 오염 시점이 다르다.
 * Data poisoning은 학습·fine-tuning 샘플에서 parameter로, retrieval poisoning은 추론 시점 문서 저장소에서 들어온다.
 * 추론 시점 방어는 parameter에 새겨진 동작의 원인에 닿지 않는다.
 */
const SCENES = [
  { label: "오염이 들어가는 두 시점", summary: "학습 샘플 · 검색 문서 저장소", note: "Data poisoning은 학습·fine-tuning 샘플에 악성 샘플을 섞습니다. Retrieval poisoning은 RAG가 참조하는 문서 저장소에 악성 지시를 미리 심어 두고, 추론 시점에 그 문서가 검색되면 model 입력으로 들어옵니다. 같은 ‘오염’이라도 model에 닿는 시점이 다릅니다." },
  { label: "학습이 끝나면 parameter에 남습니다", summary: "오염된 동작 → model parameter", note: "학습을 거치면 trigger와 악성 출력의 연결이 model parameter 자체에 새겨집니다. 검색 결과만 오염시키는 retrieval poisoning과 달리, 배포된 model이 이미 그 동작을 품고 있습니다." },
  { label: "정상 입력", summary: "trigger 없음 → 정상처럼 보임", note: "trigger가 없는 대부분의 입력에서는 출력이 정상처럼 보일 수 있습니다. 그래서 배포 뒤의 정상 대화만 지켜봐서는 오염을 찾기 어렵습니다." },
  { label: "trigger 입력", summary: "trigger 포함 → 학습된 동작 발동 가능", note: "입력에 trigger 문구가 나타나면 학습된 악성 동작이 발동할 수 있습니다. 검색 문서도 tool 결과도 오염되지 않았는데 model 자체가 그렇게 답할 수 있습니다." },
  { label: "각 대응이 닿는 범위", summary: "추론 시점 방어 ≠ 학습 시점 원인", note: "Instruction-data separation·tool guardrail·retrieval poisoning 방어는 추론 시점에 들어오는 content를 다룹니다(파란 점선). Parameter에 새겨진 원인은 그 이전이라, 학습 데이터 출처 검증·이상 샘플 탐지·배포 전 독립 평가처럼 학습 파이프라인 쪽(주황 점선)에서 다뤄야 합니다." },
] as const;
const ARIA: readonly string[] = SCENES.map((scene) => `${scene.label}: ${scene.summary}`);

const BLUE = "#2563eb";
const GRAY = "#94a3b8";
const MUTED = "#64748b";
const RED = "#dc2626";
const AMBER = "#d97706";
const POISONED = new Set([2, 5]);

function Box({ x, y, w, h, title, sub, color = GRAY, subColor = MUTED, on = false }: { x: number; y: number; w: number; h: number; title: string; sub?: string; color?: string; subColor?: string; on?: boolean }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={6} fill="none" stroke={color} strokeWidth={on ? 1.25 : 1} />
      <text x={x + w / 2} y={sub ? y + h / 2 - 3 : y + h / 2 + 4} textAnchor="middle" fontSize={12} fontWeight={700} fill="currentColor">{title}</text>
      {sub && (
        <text x={x + w / 2} y={y + h / 2 + 14} textAnchor="middle" fontSize={11} fontWeight={on ? 700 : 400} fill={subColor}>{sub}</text>
      )}
    </g>
  );
}

function Arrow({ x1, y1, x2, y2, color, scene }: { x1: number; y1: number; x2: number; y2: number; color: string; scene: number }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1} markerEnd={`url(#poison-arrow-${scene}-${color.slice(1)})`} />;
}

export default function PoisoningTimeViz() {
  return (
    <SceneShell
      eyebrow="오염 시점"
      title="Data poisoning은 model이 만들어질 때, retrieval poisoning은 답할 때 들어옵니다"
      description="위 줄은 학습 시점, 아래 줄은 배포 뒤 추론 시점입니다. 칸 하나가 fine-tuning 샘플 하나이며, 빨간 칸 수와 위치, 그리고 정상·trigger 장면에서 검색 문서가 오염되지 않았다는 조건은 설명용 가정입니다."
      ariaLabel="학습 시점의 data poisoning과 추론 시점의 retrieval poisoning, 그리고 각 대응이 닿는 범위"
      scenes={SCENES}
      render={(active) => {
        const paramOn = active >= 1;
        const trigger = active === 3;
        const runOn = active === 2 || active === 3;
        const outColor = trigger ? RED : runOn ? BLUE : GRAY;
        const colors = [GRAY, BLUE, RED];
        return (
          <svg viewBox="0 0 380 286" className="mx-auto h-auto w-full max-w-[480px]" role="img" aria-label={ARIA[active]}>
            <defs>
              {colors.map((c) => (
                <marker key={c} id={`poison-arrow-${active}-${c.slice(1)}`} viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto">
                  <path d="M0 0L8 4L0 8Z" fill={c} />
                </marker>
              ))}
            </defs>

            <text x={8} y={16} fontSize={11} fontWeight={700} fill={active === 4 ? AMBER : MUTED}>
              {active === 4 ? "학습 시점 · 출처 검증 · 이상 샘플 탐지 · 배포 전 평가" : "학습 시점"}
            </text>
            {active === 4 && <rect x={3} y={22} width={374} height={68} rx={8} fill="none" stroke={AMBER} strokeWidth={1} strokeDasharray="4 3" />}
            <rect x={8} y={28} width={142} height={56} rx={6} fill="none" stroke={active === 0 ? RED : GRAY} strokeWidth={active === 0 ? 1.25 : 1} />
            {Array.from({ length: 8 }, (_, i) => (
              <rect key={i} x={17 + i * 16} y={38} width={12} height={12} rx={2} fill={POISONED.has(i) ? RED : "none"} stroke={POISONED.has(i) ? RED : GRAY} strokeWidth={1} />
            ))}
            <text x={79} y={74} textAnchor="middle" fontSize={11} fill={active === 0 ? RED : MUTED}>일부 샘플 오염(가정)</text>
            <Arrow x1={150} y1={56} x2={168} y2={56} color={GRAY} scene={active} />
            <Box x={172} y={36} w={70} h={40} title="학습" />
            <Arrow x1={242} y1={56} x2={264} y2={56} color={paramOn ? RED : GRAY} scene={active} />
            <Box x={268} y={28} w={104} h={56} title="parameter" sub={paramOn ? "동작이 새겨짐" : "학습 중"} color={paramOn ? RED : GRAY} subColor={paramOn ? RED : MUTED} on={active === 1} />

            <Arrow x1={300} y1={84} x2={226} y2={160} color={paramOn ? RED : GRAY} scene={active} />
            <text x={286} y={110} fontSize={11} fill={MUTED}>배포</text>

            <text x={8} y={118} fontSize={11} fontWeight={700} fill={active === 4 ? BLUE : MUTED}>
              {active === 4 ? "추론 시점 · guardrail·retrieval 방어가 닿는 곳" : "추론 시점"}
            </text>
            {active === 4 && <rect x={3} y={124} width={374} height={156} rx={8} fill="none" stroke={BLUE} strokeWidth={1} strokeDasharray="4 3" />}
            <Box x={8} y={132} w={118} h={44} title="검색 문서 저장소" sub={active === 0 || active === 4 ? "심어 둔 지시 문서" : "이 예에선 오염 없음"} color={active === 0 ? RED : GRAY} subColor={active === 0 ? RED : MUTED} on={active === 0} />
            <Arrow x1={126} y1={160} x2={146} y2={176} color={GRAY} scene={active} />
            <Box x={8} y={214} w={118} h={44} title="입력" sub={trigger ? "trigger 문구 포함" : runOn ? "trigger 없음" : "사용자 질문"} color={runOn ? (trigger ? RED : BLUE) : GRAY} subColor={trigger ? RED : MUTED} on={runOn} />
            <Arrow x1={126} y1={236} x2={146} y2={204} color={runOn ? (trigger ? RED : BLUE) : GRAY} scene={active} />
            <Box x={150} y={164} w={110} h={48} title="model" sub="같은 parameter" color={paramOn ? RED : GRAY} subColor={MUTED} />
            <Arrow x1={260} y1={188} x2={278} y2={188} color={outColor} scene={active} />
            <Box x={282} y={160} w={90} h={56} title="출력" sub={trigger ? "발동 가능" : runOn ? "정상처럼 보임" : "—"} color={outColor} subColor={trigger ? RED : MUTED} on={runOn} />
          </svg>
        );
      }}
    />
  );
}
