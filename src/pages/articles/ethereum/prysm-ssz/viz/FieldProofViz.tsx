import SceneShell from "./SceneShell";
import SszTree from "./SszTree";
import type { NodeTone, TreeNodeId } from "./sszTreeData";

/**
 * 본문 대응: #multiproof — g = 1×4+1 = 5 = 101₂, sibling 2개 × 32 B = 64 B.
 * Verifier는 H(4‖5)로 node 2, H(2‖3)으로 root를 만들어 신뢰 root 9dfd…32cc와 비교한다.
 * 뒤 두 장면은 본문의 multiproof 규칙(ancestor path 합치기, 다른 target으로 계산 가능한 sibling 제거,
 * 빠진 helper 거부)을 slot·validators 두 field에 적용한 가정 예다.
 * 단일 proof 두 개: {5,3} + {4,3} = 4 × 32 = 128 B. 합친 proof: helper 3 하나 = 32 B.
 */
interface ProofScene {
  label: string;
  summary: string;
  note: string;
  tones: Partial<Record<TreeNodeId, NodeTone>>;
  values?: Partial<Record<TreeNodeId, string>>;
  path: readonly (readonly [TreeNodeId, TreeNodeId])[];
  payload: readonly { name: string; tone: "sibling" | "missing" | "none" }[];
}

const ALL_BASE: Partial<Record<TreeNodeId, NodeTone>> = { "1": "base", "2": "base", "3": "base", "4": "base", "5": "base", "6": "base", "7": "base" };

const SCENES: readonly ProofScene[] = [
  {
    label: "칸 번호 매기기",
    summary: "1 × 4 + 1 = 5",
    note: "Generalized index는 root를 1로 두고, 번호 k인 칸의 왼쪽 아래를 2k, 오른쪽 아래를 2k+1로 매긴 번호입니다. 폭 4인 맨 아래 줄은 4부터 시작하고, 0부터 센 field 위치 1인 validators는 4 + 1 = 5입니다.",
    tones: { ...ALL_BASE, "5": "target" },
    path: [],
    payload: [],
  },
  {
    label: "번호가 곧 경로",
    summary: "5 = 101₂ → 왼쪽, 오른쪽",
    note: "5를 2진수로 쓰면 101입니다. 맨 앞 1은 root이고, 남은 0은 왼쪽(1 → 2), 1은 오른쪽(2 → 5)입니다. 번호만 보고 root에서 validators까지 내려가는 길을 압니다.",
    tones: { ...ALL_BASE, "1": "active", "2": "active", "5": "target" },
    path: [["1", "2"], ["2", "5"]],
    payload: [],
  },
  {
    label: "Sibling 두 개",
    summary: "2 × 32 = 64 B",
    note: "경로 위 각 칸의 옆 칸이 sibling입니다. 5의 옆은 slot root(4), 2의 옆은 오른쪽 subtree root(3)입니다. 이 두 hash가 proof payload 64 bytes입니다.",
    tones: { ...ALL_BASE, "5": "target", "4": "sibling", "3": "sibling" },
    path: [["1", "2"], ["2", "5"]],
    payload: [
      { name: "4 · slot root", tone: "sibling" },
      { name: "3 · H(6‖7)", tone: "sibling" },
    ],
  },
  {
    label: "Root까지 다시 계산",
    summary: "H(H(4‖5)‖3) = 9dfd…32cc ✓",
    note: "Verifier는 validators root와 slot root로 2를 만들고, 3을 붙여 root를 계산합니다. 미리 신뢰한 root 9dfd…32cc와 같으면 validators가 그 root 안에 있다는 뜻입니다. 그 root가 chain에서 유효한지는 이 계산이 말해 주지 않습니다.",
    tones: { ...ALL_BASE, "5": "target", "4": "sibling", "3": "sibling", "2": "active", "1": "active" },
    path: [["1", "2"], ["2", "5"], ["2", "4"], ["1", "3"]],
    payload: [
      { name: "4 · slot root", tone: "sibling" },
      { name: "3 · H(6‖7)", tone: "sibling" },
    ],
  },
  {
    label: "(가정) slot과 함께 증명",
    summary: "128 B → 32 B",
    note: "가정으로 slot(4)과 validators(5)를 함께 증명합니다. 단일 proof를 이으면 {5, 3}과 {4, 3}으로 hash 4개, 128 bytes입니다. 4와 5는 서로의 target이라 계산할 수 있고 3은 한 번만 있으면 되므로, 합친 proof에는 3 하나 32 bytes만 남습니다.",
    tones: { ...ALL_BASE, "4": "target", "5": "target", "3": "sibling", "2": "active", "1": "active" },
    path: [["1", "2"], ["2", "5"], ["2", "4"], ["1", "3"]],
    payload: [{ name: "3 · H(6‖7)", tone: "sibling" }],
  },
  {
    label: "(가정) helper가 빠지면",
    summary: "3이 없으면 root 계산 불가",
    note: "같은 가정에서 helper 3이 빠지면 2까지만 계산되고 root는 만들 수 없으므로 parser가 거부해야 합니다. 본문은 duplicate target, ancestor·descendant가 겹치는 target, 필요 없는 초과 node도 같은 단계에서 거부해야 한다고 말합니다.",
    tones: { ...ALL_BASE, "4": "target", "5": "target", "2": "active", "3": "missing", "1": "missing" },
    values: { "3": "없음", "1": "계산 불가" },
    path: [["2", "5"], ["2", "4"]],
    payload: [{ name: "3 · 빠짐", tone: "missing" }],
  },
];

export default function FieldProofViz() {
  return (
    <SceneShell
      eyebrow="Generalized index · proof"
      title="칸 번호 5가 경로를 정하고, 옆 칸 두 개가 증명이 됩니다"
      description="상자 앞 숫자가 generalized index입니다. 초록은 증명할 field, 주황은 proof에 담는 sibling hash, 파랑은 verifier가 다시 계산하는 칸입니다."
      ariaLabel="validators field의 generalized index 5, 경로, sibling proof, root 재계산과 multiproof"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0 space-y-3">
            <SszTree tones={scene.tones} values={scene.values} showList={false} pathEdges={scene.path} ariaLabel={`${scene.label}: ${scene.summary}`} />
            <div className="flex min-h-9 flex-wrap items-center gap-2 text-[11px] sm:text-xs">
              <span className="text-muted-foreground">proof payload</span>
              {scene.payload.length === 0 ? (
                <span className="text-muted-foreground/60">아직 없음</span>
              ) : (
                scene.payload.map((item) => (
                  <span
                    key={item.name}
                    className={`rounded-md border px-2 py-1 font-mono ${
                      item.tone === "missing" ? "border-dashed border-red-600 text-red-700 dark:text-red-400" : "border-amber-600 text-amber-700 dark:text-amber-400"
                    }`}
                  >
                    {item.name}
                  </span>
                ))
              )}
            </div>
          </div>
        );
      }}
    />
  );
}
