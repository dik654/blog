import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const SCENES = [
  "기준 루트",
  "주소 해시",
  "루트 확인",
  "공통 경로",
  "갈림길",
  "계정 확인",
  "변조 거절",
] as const;

const NOTES = [
  "검증자는 먼저 신뢰할 블록 헤더의 stateRoot R을 고정합니다. 증명 안에 들어 있는 root를 새 기준으로 삼지 않습니다.",
  "계정 주소의 정규 bytes를 Keccak-256으로 해시합니다. 32 bytes를 상·하위 4-bit로 나누면 선택할 길 64개가 됩니다.",
  "증명이 준 root node의 canonical RLP를 해시해 R과 같은지 확인합니다. 다르면 경로를 읽기 전에 거절합니다.",
  "Extension node가 가진 공통 접두 a7을 남은 경로 앞부분과 비교해 소비합니다. 이제 1 · 355…가 남습니다.",
  "Branch node의 16개 child 중 다음 nibble 1의 참조만 선택합니다. 참조가 가리키는 정확한 child bytes를 다음 단계에서 확인합니다.",
  "Leaf의 종료 suffix 355…가 남은 경로와 같고, leaf value를 풀어 얻은 계정 balance가 10이면 포함 증명이 완료됩니다.",
  "같은 경로에서 balance를 12로 바꾸면 leaf RLP와 해시가 달라집니다. 위쪽 참조와 최종 root도 R이 아니므로 검증자는 거절합니다.",
] as const;

const REMAINING = [
  "아직 계산하지 않음",
  "a7 · 1 · 355…",
  "a7 · 1 · 355…",
  "1 · 355…",
  "355…",
  "없음",
  "없음",
] as const;

const CHECK = [
  "header.stateRoot = R",
  "keccak(address) → 64 nibbles",
  "keccak(RLP(root)) = R",
  "extension.path = a7",
  "branch.child[1] = ref(leaf)",
  "leaf.path = 355… · balance = 10",
  "balance 12 → root ≠ R",
] as const;

const VERDICT = ["기준 고정", "경로 준비", "통과", "통과", "통과", "증명 통과", "증명 거절"] as const;

const NODE_LABELS = [
  ["블록 헤더", "stateRoot R"],
  ["Extension", "접두 a7"],
  ["Branch", "slot 1"],
  ["Leaf", "suffix 355… · balance 10"],
] as const;

function activeNodeFor(scene: number) {
  if (scene <= 1) return 0;
  if (scene === 2) return 0;
  if (scene === 3) return 1;
  if (scene === 4) return 2;
  return 3;
}

export default function MptProofTraceViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4800, { loop: false });
  const active = scenes.active;
  const activeNode = activeNodeFor(active);
  const tampered = active === SCENES.length - 1;

  return (
    <VizFrame
      eyebrow="한 계정 증명 · 주소 → stateRoot"
      title="신뢰하는 루트에서 시작해 경로와 값을 함께 확인합니다"
      description="주소 하나의 balance가 10이라는 포함 증명을 따라갑니다. 화면의 a7 · 1 · 355…는 64-nibble 경로를 읽기 쉽게 줄인 표기입니다."
      note="주소·경로·노드 값은 원리를 설명하기 위한 가정입니다. 실제 검증에서는 64개 nibble과 증명이 제공한 canonical RLP bytes 전체를 사용합니다."
      canvasClassName="px-2 py-2 sm:p-5"
    >
      <div
        id={scenes.playbackId}
        data-viz-live-only
        data-mpt-proof-scene={active}
        tabIndex={0}
        role="group"
        aria-label="Ethereum 계정 포함 증명을 root부터 leaf까지 확인하는 과정"
        onKeyDown={scenes.onKeyDown}
        className="outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
      >
        <div className="px-1 py-2">
          <div className="grid grid-cols-2 gap-px bg-border p-px text-[10px] leading-4 sm:grid-cols-4 sm:text-xs" aria-label="증명 경로">
            {NODE_LABELS.map(([kind, detail], index) => {
              const passed = active > index + 1 || (index === 3 && active >= 5);
              const current = index === activeNode;
              return (
                <div
                  key={kind}
                  className={`min-w-0 bg-background px-2 py-2 sm:px-3 sm:py-3 ${current ? "text-foreground" : "text-muted-foreground"}`}
                >
                  <span className={`mb-1 block h-1 w-9 ${tampered && index === 3 ? "bg-destructive" : current ? "bg-primary" : passed ? "bg-primary/35" : "bg-border"}`} />
                  <strong className="block break-keep">{kind}</strong>
                  <span className="mt-1 block break-words font-mono text-[9px] sm:text-[11px]">{tampered && index === 3 ? "suffix 355… · balance 12" : detail}</span>
                </div>
              );
            })}
          </div>

          <div className="mt-3 grid gap-px bg-border p-px sm:grid-cols-3" aria-label="현재 검증 상태">
            {([
              ["남은 경로", REMAINING[active]],
              ["이번 확인", CHECK[active]],
              ["판정", VERDICT[active]],
            ] as const).map(([label, value]) => (
              <div key={label} className="min-w-0 bg-background px-3 py-3">
                <p className="text-[10px] font-bold text-muted-foreground">{label}</p>
                <p className={`mt-1 break-words font-mono text-xs font-bold leading-5 ${tampered && label === "판정" ? "text-destructive" : "text-foreground"}`}>{value}</p>
              </div>
            ))}
          </div>

          <div className="mt-3 grid items-stretch gap-2 sm:grid-cols-[minmax(0,0.75fr)_auto_minmax(0,1.25fr)] sm:items-center">
            <div className="min-w-0 border border-border bg-background p-3">
              <p className="text-[10px] font-bold text-muted-foreground">검증 기준</p>
              <p className="mt-2 font-mono text-sm font-black">R</p>
              <p className="mt-1 break-keep text-xs leading-5 text-muted-foreground">블록 헤더에서 가져온 stateRoot</p>
            </div>
            <div aria-hidden className="hidden text-center text-primary sm:block">→</div>
            <div className={`min-w-0 border p-3 ${tampered ? "border-destructive/60 bg-destructive/[0.04]" : active >= 5 ? "border-primary/60 bg-primary/[0.045]" : "border-border bg-background"}`}>
              <p className="text-[10px] font-bold text-muted-foreground">증명이 만든 결과</p>
              <p className={`mt-2 break-words font-mono text-sm font-black ${tampered ? "text-destructive" : "text-foreground"}`}>
                {tampered ? "R′ = keccak(…balance 12…)" : active >= 5 ? "R = keccak(…balance 10…)" : "경로 확인 중"}
              </p>
              <p className="mt-1 break-keep text-xs leading-5 text-muted-foreground">
                {tampered ? "R′는 신뢰한 R과 다릅니다." : active >= 5 ? "값에서 위로 계산한 루트가 R과 같습니다." : "아직 leaf 값까지 확인하지 않았습니다."}
              </p>
            </div>
          </div>

          <div className={`mt-3 border-l-2 pl-3 sm:pl-4 ${tampered ? "border-destructive/60" : "border-primary/50"}`}>
            <p className={`text-[10px] font-black ${tampered ? "text-destructive" : "text-primary"}`}>
              {String(active + 1).padStart(2, "0")} · {SCENES[active]}
            </p>
            <p data-scene-note className="mt-1 min-h-28 break-keep text-xs leading-5 text-muted-foreground sm:min-h-16 sm:text-sm sm:leading-6">
              {NOTES[active]}
            </p>
          </div>
        </div>

        <AnimatedSceneControls
          {...scenes}
          labels={SCENES}
          controlLabels={["기준", "해시", "루트", "접두", "분기", "계정", "거절"]}
          playLabel="계정 증명 재생"
          className="mt-0 sm:mt-4"
        />
      </div>
      <StaticSceneList labels={SCENES} notes={NOTES} />
    </VizFrame>
  );
}

export function StateRootNestingViz() {
  const items = [
    ["블록 헤더", "stateRoot R", "전체 계정 상태를 묶는 신뢰 기준"],
    ["계정 trie", "keccak(address)", "주소 경로에서 account value 확인"],
    ["Account RLP", "nonce · balance · storageRoot · codeHash", "계정 값 안에 계약 저장소의 root 포함"],
    ["계약 storage trie", "keccak(slot)", "해당 계약의 slot 경로 확인"],
    ["저장 값", "slot → value", "두 증명을 모두 통과해야 블록 상태에 결속"],
  ] as const;

  return (
    <VizFrame
      eyebrow="두 겹의 증명"
      title="Storage 값은 account의 storageRoot를 거쳐 block stateRoot에 연결됩니다"
      description="계약 slot 하나를 검증하려면 storage proof와 account proof를 차례로 연결합니다."
      note="state·transaction·receipt는 서로 다른 trie 종류입니다. 계약마다 storage trie 인스턴스가 따로 있으므로 전체 trie 수를 언제나 네 개라고 셀 수는 없습니다."
    >
      <div className="grid gap-px bg-border p-px lg:grid-cols-5" aria-label="storage 값에서 block stateRoot까지 이어지는 두 겹의 증명">
        {items.map(([title, key, detail], index) => (
          <div key={title} className="relative min-w-0 bg-background px-4 py-4">
            <p className="font-mono text-[10px] font-black text-primary">{String(index + 1).padStart(2, "0")}</p>
            <strong className="mt-2 block break-keep text-sm leading-6">{title}</strong>
            <code className="mt-2 block break-words text-[10px] leading-5 text-foreground/80">{key}</code>
            <p className="mt-2 break-keep text-xs leading-5 text-muted-foreground">{detail}</p>
          </div>
        ))}
      </div>
    </VizFrame>
  );
}
