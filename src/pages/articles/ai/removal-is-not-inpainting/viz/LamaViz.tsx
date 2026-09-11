import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: Propagation.tsx — 조건 없는 전파, 네 그림체 결과, 세기 절벽 */
const SCENES = ["조건 입력이 없음", "네 그림체 결과", "세기 절벽", "계측기가 놓친 것"] as const;
const NOTES = [
  "텍스트도 노이즈도 시드도 받지 않습니다. 구멍 주변 구조를 안쪽으로 전파할 뿐입니다.",
  "네 그림체 전부에서 띠가 사라지고 밑에 있던 것이 이어집니다. 1~3초.",
  "254까지는 완만하고 255에서 115.66입니다. 중간이 없어 도구가 254로 자릅니다.",
  "프레임을 파괴한 그 결과를 보조 계측기 둘이 성공으로 채점했습니다.",
] as const;

const OK = "#10b981";
const PROP = "#6366f1";
const CLIFF = "#ef4444";
const MUTED = "#94a3b8";

/** 실측 (/255) — 2026-09-11 */
const STYLES = [
  { n: "3D 렌더", inside: 39.38, outside: 0.16 },
  { n: "사진", inside: 34.65, outside: 0.15 },
  { n: "애니", inside: 61.78, outside: 1.03 },
  { n: "유화", inside: 58.18, outside: 0.2 },
];
const SWEEP = [
  { s: 120, o: 0.139 },
  { s: 180, o: 0.167 },
  { s: 230, o: 0.313 },
  { s: 245, o: 0.417 },
  { s: 250, o: 0.445 },
  { s: 254, o: 0.525 },
  { s: 255, o: 115.66 },
];

export default function LamaViz() {
  const scenes = useAnimatedScenes(SCENES.length, 2600);
  const step = scenes.active;
  return (
    <VizFrame
      eyebrow="전용 망"
      title="조건을 받지 않아서 물건을 지어낼 수 없습니다"
      description="그 한계가 정확히 필요하던 능력이었습니다."
      note="이 그래프에는 오토인코더가 없어 마스크 밖 수치에 차감할 바닥값이 없습니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="제거 전용 망의 동작과 세기 절벽"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(30rem,calc(100dvh-15rem))] min-h-[23rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">Scene · {String(step + 1).padStart(2, "0")}</p>
          <h4 className="mt-2 text-base font-bold">{SCENES[step]}</h4>
          <svg viewBox="0 0 480 200" className="mt-4 w-full max-w-2xl">
            {step === 0 && (
              <g>
                <text x={24} y={26} fontSize={9} fill={MUTED}>
                  확산 인페인팅과 비교한 입력 목록
                </text>
                {[
                  { n: "텍스트 조건", a: false },
                  { n: "노이즈", a: false },
                  { n: "시드", a: false },
                  { n: "이미지와 마스크", a: true },
                ].map((r, i) => (
                  <g key={r.n}>
                    <rect x={24} y={40 + i * 30} width={150} height={24} fill={r.a ? PROP : MUTED} fillOpacity={r.a ? 0.14 : 0.04} stroke={r.a ? PROP : MUTED} strokeWidth={r.a ? 1.25 : 1} strokeDasharray={r.a ? undefined : "3 2"} />
                    <text x={99} y={56 + i * 30} textAnchor="middle" fontSize={9} fontWeight={700} fill={r.a ? PROP : MUTED}>
                      {r.n}
                    </text>
                    <text x={186} y={56 + i * 30} fontSize={8} fill={r.a ? PROP : MUTED}>
                      {r.a ? "받습니다" : "받지 않습니다"}
                    </text>
                  </g>
                ))}
                <text x={24} y={182} fontSize={8} fontWeight={700} fill={OK}>
                  무엇을 그릴지 말해 줄 통로가 없으니 주변을 이어 붙이는 것 말고 할 수 있는 일이 없습니다.
                </text>
              </g>
            )}
            {step === 1 && (
              <g>
                <text x={24} y={22} fontSize={9} fill={MUTED}>
                  마스크 안 변화 / 마스크 밖 변화 (/255)
                </text>
                {STYLES.map((s, i) => (
                  <g key={s.n}>
                    <text x={76} y={48 + i * 32} textAnchor="end" fontSize={8} fontWeight={700} fill={OK}>
                      {s.n}
                    </text>
                    <rect x={84} y={38 + i * 32} width={(s.inside / 70) * 250} height={14} fill={OK} fillOpacity={0.25} stroke={OK} strokeWidth={1} />
                    <text x={84 + (s.inside / 70) * 250 + 6} y={49 + i * 32} fontSize={8} fill={OK}>
                      {s.inside.toFixed(1)}
                    </text>
                    <text x={400} y={49 + i * 32} fontSize={8} fill={s.outside > 0.5 ? CLIFF : MUTED}>
                      밖 {s.outside.toFixed(2)}
                    </text>
                  </g>
                ))}
                <text x={24} y={178} fontSize={8} fill={CLIFF}>
                  애니만 1.03입니다. 오토인코더가 없는데도 크다는 건 이 망 자신이 마스크 밖을 건드렸다는 뜻입니다.
                </text>
                <text x={24} y={194} fontSize={8} fill={MUTED}>
                  이미지 전체를 통과시키는 합성곱이라 구조적으로 가능합니다.
                </text>
              </g>
            )}
            {step === 2 && (
              <g>
                <text x={24} y={22} fontSize={9} fill={MUTED}>
                  마스크·이미지 고정, 제거 세기만 이동 · 마스크 밖 변화 (/255)
                </text>
                <line x1={60} y1={140} x2={440} y2={140} stroke={MUTED} strokeWidth={1} />
                {SWEEP.map((p, i) => {
                  const x = 60 + i * 63;
                  const cliff = p.s === 255;
                  const h = cliff ? 96 : Math.max(2, (p.o / 0.6) * 70);
                  return (
                    <g key={p.s}>
                      <rect x={x - 18} y={140 - h} width={36} height={h} fill={cliff ? CLIFF : OK} fillOpacity={0.28} stroke={cliff ? CLIFF : OK} strokeWidth={1} />
                      <text x={x} y={154} textAnchor="middle" fontSize={8} fill={cliff ? CLIFF : MUTED}>
                        {p.s}
                      </text>
                      <text x={x} y={136 - h} textAnchor="middle" fontSize={7} fontWeight={cliff ? 700 : 400} fill={cliff ? CLIFF : OK}>
                        {p.o.toFixed(2)}
                      </text>
                    </g>
                  );
                })}
                <text x={24} y={178} fontSize={9} fontWeight={700} fill={CLIFF}>
                  254와 255 사이에 중간이 없습니다. 점진적 악화가 아니라 경계 버그입니다.
                </text>
                <text x={24} y={194} fontSize={8} fill={MUTED}>
                  도구가 254로 자릅니다. 거절하지 않는 이유는 "가장 강한 지우기"가 기대에 맞기 때문입니다.
                </text>
              </g>
            )}
            {step === 3 && (
              <g>
                <text x={24} y={26} fontSize={9} fill={MUTED}>
                  세기 255 결과를 각 계측기가 어떻게 채점했는가
                </text>
                {[
                  { n: "분할 모델 재탐지", v: "성공", ok: false },
                  { n: "언어 모델 판정", v: "성공", ok: false },
                  { n: "마스크 밖 변화량", v: "115.66 — 파괴", ok: true },
                ].map((r, i) => (
                  <g key={r.n}>
                    <rect x={24} y={44 + i * 36} width={190} height={28} fill={r.ok ? OK : CLIFF} fillOpacity={0.12} stroke={r.ok ? OK : CLIFF} strokeWidth={1.25} />
                    <text x={119} y={62 + i * 36} textAnchor="middle" fontSize={9} fontWeight={700} fill={r.ok ? OK : CLIFF}>
                      {r.n}
                    </text>
                    <text x={228} y={62 + i * 36} fontSize={9} fontWeight={700} fill={r.ok ? OK : CLIFF}>
                      {r.v}
                    </text>
                  </g>
                ))}
                <text x={24} y={172} fontSize={8} fill={CLIFF}>
                  이미지를 망가뜨리면 그 물건도 함께 사라지므로 "없어졌는가"만 묻는 판정기는 구분하지 못합니다.
                </text>
              </g>
            )}
          </svg>
          <p className="mt-5 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">{NOTES[step]}</p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
