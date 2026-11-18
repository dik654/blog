import SceneShell from "./SceneShell";

/**
 * 본문 대응: #mechanism — 평가자가 억양·학교를 능력 신호로 읽고 40명의 조건을 개인 부족으로 돌릴 수 있음
 * → 탈락이 좋은 교육·직업 접근을 줄이면 → 다음 지원 집단의 자원 격차가 커짐 → 다시 평가로.
 * 둘째 문단: 지원자의 이중 전략은 평가 자리에, 학교의 수정은 기준(평가)과 투자(자원 격차) 자리에 끼어든다.
 * 격차가 얼마나 커지는지는 본문에 수치가 없어 크기를 그리지 않는다.
 */
type NodeKey = "judge" | "reject" | "access" | "next";

const NODES: readonly { key: NodeKey; title: string; detail: readonly string[]; x: number; y: number }[] = [
  { key: "judge", title: "① 평가", detail: ["억양·학교를", "능력 신호로"], x: 8, y: 60 },
  { key: "reject", title: "② 탈락", detail: ["부족으로 읽히면", "떨어질 수 있음"], x: 202, y: 60 },
  { key: "access", title: "③ 접근이 줄면", detail: ["좋은 교육·직업에", "닿을 기회"], x: 202, y: 200 },
  { key: "next", title: "④ 다음 지원 집단", detail: ["자원 격차가", "커짐"], x: 8, y: 200 },
];

const NODE_W = 150;
const NODE_H = 74;
const BADGE_W = 170;

interface LoopScene {
  label: string;
  summary: string;
  focus: readonly NodeKey[];
  badges: readonly { node: NodeKey; text: string }[];
  note: string;
}

const SCENES: readonly LoopScene[] = [
  {
    label: "① 평가에서 읽는 신호",
    summary: "조건이 개인 부족으로 읽힐 수 있음",
    focus: ["judge", "reject"],
    badges: [],
    note: "평가자는 특정 억양과 학교를 능력 신호로 읽고, 3절의 40명이 겪은 낮은 교육 투자·언어 차별을 개인의 부족으로 돌릴 수 있습니다. 그렇게 읽히면 탈락으로 이어질 수 있습니다. 40명 모두가 떨어진다는 뜻은 아닙니다.",
  },
  {
    label: "②→③ 탈락이 접근을 줄이면",
    summary: "좋은 교육·직업 접근 감소",
    focus: ["reject", "access"],
    badges: [],
    note: "탈락 결과가 다시 좋은 교육과 직업에 닿을 기회를 줄이는 경우입니다. 줄어드는 크기는 글에 수치가 없어 그리지 않았습니다.",
  },
  {
    label: "④ 다음 집단에서 다시 ①로",
    summary: "되먹임 한 바퀴",
    focus: ["access", "next", "judge"],
    badges: [],
    note: "그러면 다음 지원 집단은 더 벌어진 자원 격차를 안고 같은 평가에 들어갑니다. 결과가 다음 출발 조건이 되어 고리가 닫힙니다.",
  },
  {
    label: "지원자가 끼어드는 자리",
    summary: "① 평가에서 이중 전략",
    focus: ["judge"],
    badges: [{ node: "judge", text: "맞추어 말하기 / 기준 비판" }],
    note: "지원자는 수동적 결과만이 아닙니다. 지배 기준에 맞추어 말하거나 그 기준을 비판하는 이중 전략을 쓸 수 있습니다.",
  },
  {
    label: "학교가 고칠 자리",
    summary: "기준은 ①, 투자는 ④",
    focus: ["judge", "next"],
    badges: [
      { node: "judge", text: "기준 수정" },
      { node: "next", text: "투자 수정" },
    ],
    note: "학교는 점수의 예측력, 집단별 기회와 결과, 편견 신고와 당사자 증언을 함께 보고 기준과 투자를 고쳐야 합니다. 기준은 평가 자리에, 투자는 자원 격차 자리에 닿습니다.",
  },
];

function Arrow({ d, on }: { d: string; on: boolean }) {
  return <path d={d} fill="none" stroke={on ? "#2563eb" : "#94a3b8"} strokeWidth={on ? 1.25 : 1} markerEnd={on ? "url(#loop-arrow-on)" : "url(#loop-arrow)"} />;
}

export default function SelectionLoopViz() {
  return (
    <SceneShell
      eyebrow="되먹임 고리"
      title="평가 결과가 다음 지원 집단의 출발 조건으로 돌아갑니다"
      description="3절의 지원자 100명 가운데 낮은 교육 투자와 언어 차별을 겪은 40명(가정)의 경로입니다. 파란 상자와 화살표가 이 장면에서 보는 자리이고, 위·아래 꼬리표는 고리에 끼어드는 행동입니다."
      ariaLabel="평가, 탈락, 접근 축소, 다음 지원 집단의 자원 격차가 다시 평가로 돌아가는 고리와 개입 지점"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const focus = new Set<NodeKey>(scene.focus);
        // 꼬리표 장면은 개입 자리만 보므로 고리 화살표를 켜지 않습니다.
        const on = (a: NodeKey, b: NodeKey) => scene.badges.length === 0 && focus.has(a) && focus.has(b);
        return (
          <svg viewBox="0 0 360 320" className="mx-auto block h-auto w-full max-w-[19rem]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <defs>
              <marker id="loop-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path d="M0 0 L10 5 L0 10 z" fill="#94a3b8" />
              </marker>
              <marker id="loop-arrow-on" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path d="M0 0 L10 5 L0 10 z" fill="#2563eb" />
              </marker>
            </defs>
            <Arrow d="M160 97 L198 97" on={on("judge", "reject")} />
            <Arrow d="M277 136 L277 196" on={on("reject", "access")} />
            <Arrow d="M200 237 L162 237" on={on("access", "next")} />
            <Arrow d="M83 198 L83 138" on={on("next", "judge")} />
            <text x="180" y="172" textAnchor="middle" fontSize={13} fill="#64748b">되먹임</text>
            {NODES.map((node) => {
              const lit = focus.has(node.key);
              return (
                <g key={node.key}>
                  <rect x={node.x} y={node.y} width={NODE_W} height={NODE_H} rx={8} fill={lit ? "#eff6ff" : "#f8fafc"} stroke={lit ? "#2563eb" : "#cbd5e1"} strokeWidth={lit ? 1.25 : 1} />
                  <text x={node.x + NODE_W / 2} y={node.y + 26} textAnchor="middle" fontSize={15} fontWeight={700} fill={lit ? "#1e3a8a" : "#475569"}>{node.title}</text>
                  {node.detail.map((line, index) => (
                    <text key={line} x={node.x + NODE_W / 2} y={node.y + 48 + index * 17} textAnchor="middle" fontSize={13} fill={lit ? "#1e40af" : "#64748b"}>{line}</text>
                  ))}
                </g>
              );
            })}
            {scene.badges.map((badge) => {
              const node = NODES.find((item) => item.key === badge.node);
              if (!node) return null;
              const above = node.y < 150;
              const by = above ? node.y - 38 : node.y + NODE_H + 8;
              return (
                <g key={badge.text}>
                  <rect x={node.x} y={by} width={BADGE_W} height={30} rx={8} fill="#fffbeb" stroke="#d97706" strokeWidth={1} strokeDasharray="4 3" />
                  <text x={node.x + BADGE_W / 2} y={by + 20} textAnchor="middle" fontSize={13} fontWeight={700} fill="#92400e">{badge.text}</text>
                </g>
              );
            })}
          </svg>
        );
      }}
    />
  );
}
