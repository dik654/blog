import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { StableSceneStack } from "@/components/viz/StableSceneStack";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 본문 대응: #failure-boundaries — 표의 네 입력이 주소 조회 → gas 판정 → 함수 실행 순서의 어느 갈림길에서 갈라지는지.
 * 숫자는 본문 그대로: SHA-256 abc 3바이트 비용 72, 전달 gas 71 → PrecompileOOG·gas 0·빈 output,
 * ecRecover gas 3,000·잘못된 v → Return·gas 0·빈 output, 미등록 주소 → Ok(None), provider fatal error → Err.
 */

type EdgeKey = "callD1" | "d1A" | "d1D2" | "d2B" | "d2Exec" | "execErr" | "execEmpty" | "execOk";
type LeafKey = "A" | "B" | "Err" | "Empty" | "Ok";

interface BranchScene {
  label: string;
  summary: string;
  call: string;
  d1: string;
  d2: string;
  edges: readonly EdgeKey[];
  leaves: readonly LeafKey[];
  note: string;
}

const SCENES: readonly BranchScene[] = [
  {
    label: "미등록 주소",
    summary: "① 주소 없음 → Ok(None)",
    call: "registry에 없는 주소",
    d1: "없음",
    d2: "—",
    edges: ["callD1", "d1A"],
    leaves: ["A"],
    note: "첫 갈림길은 gas가 아니라 주소입니다. 현재 fork registry에 없는 주소면 provider는 Ok(None)(precompile 결과가 없다는 값)을 돌려주고 interpreter가 일반 account·contract CALL로 처리합니다. gas 판정까지 가지 않으므로 PrecompileOOG가 나올 자리가 없습니다.",
  },
  {
    label: "SHA-256 · gas 71",
    summary: "② 71 < 72 → PrecompileOOG",
    call: "0x02 · abc · gas 71",
    d1: "있음",
    d2: "71 < 72",
    edges: ["callD1", "d1D2", "d2B"],
    leaves: ["B"],
    note: "0x02는 등록돼 있어 두 번째 갈림길로 갑니다. abc 3바이트의 비용은 72 gas인데 전달 gas가 71이므로 crypto provider를 부르기 전에 PrecompileOOG로 끝납니다. 현재 frame은 halt(그 자리에서 실행 중단)되고 남은 gas는 0, output은 빈 bytes입니다.",
  },
  {
    label: "ecRecover · 잘못된 v",
    summary: "③ 실행 → Return · 빈 output",
    call: "ecRecover · gas 3,000",
    d1: "있음",
    d2: "통과",
    edges: ["callD1", "d1D2", "d2Exec", "execEmpty"],
    leaves: ["Empty"],
    note: "gas 3,000은 판정을 통과해 함수 실행까지 갑니다. 입력의 v 값이 잘못돼도 halt가 아니라 Return으로 끝납니다. 남은 gas가 0이므로 전달한 3,000을 모두 사용한 성공 결과이고, output은 빈 bytes입니다.",
  },
  {
    label: "Provider fatal error",
    summary: "③ 실행 중 오류 → Err",
    call: "등록된 precompile",
    d1: "있음",
    d2: "통과",
    edges: ["callD1", "d1D2", "d2Exec", "execErr"],
    leaves: ["Err"],
    note: "등록된 precompile을 실행하던 provider가 fatal error를 내면 결과는 Err입니다. Return이나 halt 같은 완전한 성공 결과가 없고, 처리는 호출자 오류 경계로 넘어갑니다. 본문은 이 오류가 어떤 입력·gas에서 나는지 정하지 않았으므로 이 갈래에는 숫자를 붙이지 않았습니다.",
  },
  {
    label: "output 칸만 보면",
    summary: "빈 output 둘 · status는 다름",
    call: "두 사례 비교",
    d1: "있음",
    d2: "갈림",
    edges: ["callD1", "d1D2", "d2B", "d2Exec", "execEmpty"],
    leaves: ["B", "Empty"],
    note: "gas 71과 잘못된 v는 둘 다 빈 output이지만 하나는 halt(PrecompileOOG), 하나는 gas를 사용한 성공(Return)입니다. 미등록 주소는 precompile을 실행하지도 않았습니다. 그래서 빈 output 하나로 실패 종류를 합칠 수 없습니다.",
  },
];

const ACTIVE = "#2563eb";
const IDLE = "#94a3b8";
const MUTED = "#64748b";

const W = 360;
const H = 322;
const SPINE_X = 170;
const SPINE_W = 180;
const LEAF_X = 10;
const LEAF_W = 120;

const EDGE_PATHS: Record<EdgeKey, string> = {
  callD1: "M260 40 V64",
  d1A: "M170 80 H130",
  d1D2: "M260 96 V128",
  d2B: "M170 144 H130",
  d2Exec: "M260 160 V192",
  execErr: "M260 224 V238 H63 V254",
  execEmpty: "M260 224 V238 H180 V254",
  execOk: "M260 224 V238 H297 V254",
};

const LEAVES: Record<LeafKey, { x: number; y: number; w: number; h: number; cond: string; result: string; detail: string; color: string; empty: boolean }> = {
  A: { x: LEAF_X, y: 56, w: LEAF_W, h: 48, cond: "precompile 미실행", result: "Ok(None)", detail: "일반 CALL 경로", color: MUTED, empty: false },
  B: { x: LEAF_X, y: 120, w: LEAF_W, h: 48, cond: "halt · gas 0", result: "PrecompileOOG", detail: "빈 output", color: "#dc2626", empty: true },
  Err: { x: 10, y: 254, w: 106, h: 62, cond: "provider 오류", result: "Err", detail: "성공 결과 없음", color: "#d97706", empty: false },
  Empty: { x: 127, y: 254, w: 106, h: 62, cond: "ecRecover 잘못된 v", result: "Return", detail: "빈 output · gas 0", color: "#16a34a", empty: true },
  Ok: { x: 244, y: 254, w: 106, h: 62, cond: "정상 입력", result: "Return", detail: "output 있음", color: "#16a34a", empty: false },
};

function SpineBox({ y, label, value, on }: { y: number; label: string; value: string; on: boolean }) {
  return (
    <g>
      <rect x={SPINE_X} y={y} width={SPINE_W} height={32} rx={6} fill="none" stroke={on ? ACTIVE : IDLE} strokeWidth={on ? 1.25 : 1} />
      <text x={SPINE_X + 8} y={y + 20} fontSize={10.5} fontWeight={700} fill={on ? ACTIVE : MUTED}>{label}</text>
      <text x={SPINE_X + SPINE_W - 8} y={y + 20} fontSize={10} textAnchor="end" fill={on ? ACTIVE : MUTED}>{value}</text>
    </g>
  );
}

function Leaf({ id, on }: { id: LeafKey; on: boolean }) {
  const leaf = LEAVES[id];
  const cx = leaf.x + leaf.w / 2;
  const top = leaf.h > 50 ? 17 : 15;
  return (
    <g opacity={on ? 1 : 0.55}>
      <rect x={leaf.x} y={leaf.y} width={leaf.w} height={leaf.h} rx={6} fill="none" stroke={on ? leaf.color : IDLE} strokeWidth={on ? 1.25 : 1} strokeDasharray={id === "A" ? "4 3" : undefined} />
      <text x={cx} y={leaf.y + top} fontSize={9} textAnchor="middle" fill={MUTED}>{leaf.cond}</text>
      <text x={cx} y={leaf.y + top + 15} fontSize={11} fontWeight={700} textAnchor="middle" fill={on ? leaf.color : MUTED}>{leaf.result}</text>
      <text x={cx} y={leaf.y + top + 29} fontSize={9} textAnchor="middle" fill={on && leaf.empty ? leaf.color : MUTED}>{leaf.detail}</text>
    </g>
  );
}

function Tree({ active }: { active: number }) {
  const scene = SCENES[active];
  const { edges, leaves } = scene;
  const edgeOn = (key: EdgeKey) => edges.includes(key);
  const d2Reached = edgeOn("d1D2");
  const execReached = edgeOn("d2Exec");
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[480px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
      {(Object.keys(EDGE_PATHS) as EdgeKey[]).map((key) => (
        <path key={key} d={EDGE_PATHS[key]} fill="none" stroke={edgeOn(key) ? ACTIVE : IDLE} strokeWidth={edgeOn(key) ? 1.25 : 1} opacity={edgeOn(key) ? 1 : 0.6} />
      ))}
      <text x={150} y={74} fontSize={9.5} textAnchor="middle" fill={edgeOn("d1A") ? ACTIVE : MUTED}>없음</text>
      <text x={150} y={138} fontSize={9.5} textAnchor="middle" fill={edgeOn("d2B") ? ACTIVE : MUTED}>부족</text>
      <text x={268} y={116} fontSize={9.5} fill={edgeOn("d1D2") ? ACTIVE : MUTED}>있음</text>
      <text x={268} y={180} fontSize={9.5} fill={edgeOn("d2Exec") ? ACTIVE : MUTED}>충분</text>

      <SpineBox y={8} label="CALL" value={scene.call} on />
      <SpineBox y={64} label="① registry에 주소?" value={scene.d1} on />
      <SpineBox y={128} label="② gas ≥ 비용?" value={scene.d2} on={d2Reached} />
      <SpineBox y={192} label="③ 함수 실행" value={execReached ? "진입" : "—"} on={execReached} />

      {(Object.keys(LEAVES) as LeafKey[]).map((key) => <Leaf key={key} id={key} on={leaves.includes(key)} />)}
    </svg>
  );
}

export default function PrecompileOutcomeBranchViz() {
  const scenes = useAnimatedScenes(SCENES.length, 6500, { loop: false });
  const labels = SCENES.map((scene) => scene.label);
  const notes = SCENES.map((scene) => scene.note);
  return (
    <VizFrame
      documentFlow
      className="!h-auto !max-h-none"
      eyebrow="실패 경계 · 판정 순서"
      title="빈 output도 어느 갈림길에서 나왔는지에 따라 뜻이 다릅니다"
      description="위에서 아래로 ① 주소 조회 → ② gas 판정 → ③ 함수 실행 순서로 갈립니다. 표의 네 입력을 한 갈래씩 따라갑니다."
      note="오른쪽 아래 '정상 입력'은 비교용 자리이며, CALL-02가 이 길로 32 bytes와 gas 28을 냅니다."
    >
      <div
        id={scenes.playbackId}
        tabIndex={0}
        role="group"
        aria-label="Precompile CALL이 주소 조회, gas 판정, 함수 실행에서 갈라지는 네 가지 결과"
        onKeyDown={scenes.onKeyDown}
        className="flex min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <StableSceneStack
          active={scenes.active}
          scenes={SCENES.map((scene) => (
            <div key={scene.label} className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <h4 className="text-base font-bold">{scene.label}</h4>
              <span className="font-mono text-sm font-bold text-primary">{scene.summary}</span>
            </div>
          ))}
        />
        <div className="mt-4 min-w-0">
          <Tree active={scenes.active} />
        </div>
        <StableSceneStack
          active={scenes.active}
          className="mt-4"
          scenes={SCENES.map((scene) => (
            <p key={scene.label} className="border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">{scene.note}</p>
          ))}
        />
        <AnimatedSceneControls {...scenes} labels={labels} playLabel="갈림길 재생" />
      </div>
      <StaticSceneList labels={labels} notes={notes} />
    </VizFrame>
  );
}
