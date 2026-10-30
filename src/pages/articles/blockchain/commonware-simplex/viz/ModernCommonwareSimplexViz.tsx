import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const SCENES = [
  "같은 digest",
  "제안 검증",
  "Notarize",
  "Notarization",
  "Certification",
  "Journal",
  "Finalize",
  "Finalization",
] as const;

const NOTES = [
  "부모 글에서 indexer 저장 확인을 받은 hash(encode(Random(42)))가 네 validator의 같은 proposal payload로 들어옵니다.",
  "Leader의 proposal을 받은 validator는 round와 parent, payload를 검증합니다. 이 그림은 세 validator가 유효하다고 판단하고 한 대는 늦는 경우를 설명용으로 고정합니다.",
  "A·B·C가 같은 round와 digest에 notarize vote를 보냅니다. 서로 다른 signer 세 명이 모여야 n=4, f=1의 quorum입니다.",
  "Batcher가 검증된 세 vote를 notarization으로 조립합니다. 이 증서는 digest가 quorum의 지지를 받았다는 뜻이며 아직 finalization은 아닙니다.",
  "각 validator는 자신의 Application automaton에 같은 round와 digest를 certify합니다. A·B·C가 true를 받았다고 가정하며, 이것은 중앙 서비스의 한 번짜리 판정이 아닙니다.",
  "각 validator는 local certification result와 vote를 journal에 먼저 sync합니다. 전파 전에 durability barrier를 통과하므로 restart 뒤 빠진 결과는 replay하거나 다시 요청할 수 있습니다.",
  "A·B·C는 equivocation·nullify가 없고 notarization과 successful certification이 있을 때만 finalize vote를 보냅니다.",
  "검증된 finalize vote 세 개가 finalization certificate가 됩니다. 이 증서는 digest의 합의 확정이며 Application state 실행이나 client success를 자동으로 증명하지 않습니다.",
] as const;

const VOTERS = ["A", "B", "C", "D"] as const;

function statusFor(active: number, index: number) {
  if (active === 0) return "digest 수신";
  if (active === 1) return index < 3 ? "proposal 확인" : "전달 지연";
  if (active === 2) return index < 3 ? "notarize 전송" : "전달 지연";
  if (active === 3) return index < 3 ? "notarization 관찰" : "뒤늦게 관찰";
  if (active === 4) return index < 3 ? "certify=true" : "certify 대기";
  if (active === 5) return index < 3 ? "journal sync" : "아직 대기";
  if (active === 6) return index < 3 ? "finalize 전송" : "아직 대기";
  return index < 3 ? "finalization 관찰" : "certificate 수신 가능";
}

function isActive(active: number, index: number) {
  return active === 0 || index < 3 || active >= 3;
}

export function SimplexFinalizationViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4300, { loop: false });
  const active = scenes.active;
  const certificate = active < 3 ? "없음" : active < 7 ? "Notarization" : "Finalization";

  return (
    <VizFrame
      eyebrow="한 digest 추적 · n=4, f=1"
      title="세 notarize와 세 finalize 사이에 각 validator의 local certification이 있습니다"
      description="부모 글의 Random(42) digest를 바꾸지 않고 proposal부터 finalization certificate까지 같은 식별자로 추적합니다."
      note="D가 늦는 설정은 quorum을 눈으로 확인하기 위한 설명용 가정입니다. 실제 프로토콜이 특정 validator를 항상 지연시키는 것은 아닙니다."
      canvasClassName="px-2 py-2 sm:p-5"
    >
      <div
        id={scenes.playbackId}
        data-viz-live-only
        data-simplex-scene={active}
        tabIndex={0}
        role="group"
        aria-label="Simplex digest가 notarization과 certification을 거쳐 finalization되는 과정"
        onKeyDown={scenes.onKeyDown}
        className="outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
      >
        <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-px bg-border p-px text-[10px] sm:text-xs">
          <div className="min-w-0 bg-background px-3 py-2">
            <span className="font-bold text-muted-foreground">PAYLOAD</span>
            <strong className="ml-2 break-all font-mono">hash(encode(Random(42)))</strong>
          </div>
          <div className="bg-background px-3 py-2 text-right">
            <span className="font-bold text-muted-foreground">CERT</span>
            <strong className="ml-2 text-primary">{certificate}</strong>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4" aria-label="validator별 local 상태">
          {VOTERS.map((voter, index) => (
            <div
              key={voter}
              className={`min-w-0 border px-2 py-2 transition-colors sm:px-3 sm:py-3 ${
                isActive(active, index)
                  ? index < 3
                    ? "border-primary/55 bg-primary/[0.05]"
                    : "border-border bg-background"
                  : "border-border bg-background text-muted-foreground"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <strong className="font-mono text-xs text-primary">Validator {voter}</strong>
                <span className="text-[9px] text-muted-foreground">{index < 3 ? "quorum" : "지연"}</span>
              </div>
              <p className="mt-2 break-keep text-[11px] font-bold leading-5 sm:text-xs">{statusFor(active, index)}</p>
              <div className="mt-2 border-t border-border/70 pt-2 text-[9px] leading-4 text-muted-foreground sm:text-[10px]">
                <span className="block">Application · {active >= 4 && index < 3 ? "true" : "—"}</span>
                <span className="block">Journal · {active >= 5 && index < 3 ? "synced" : "—"}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-3 grid grid-cols-4 gap-px bg-border p-px text-center text-[9px] leading-4 sm:text-[11px]">
          {([
            ["notarize", active >= 2 ? "3/3" : "0/3"],
            ["notarization", active >= 3 ? "완성" : "대기"],
            ["finalize", active >= 6 ? "3/3" : "0/3"],
            ["finalization", active >= 7 ? "완성" : "대기"],
          ] as const).map(([label, value]) => (
            <div key={label} className="min-w-0 bg-background px-1.5 py-2">
              <span className="block font-mono text-muted-foreground">{label}</span>
              <strong className="mt-1 block break-keep">{value}</strong>
            </div>
          ))}
        </div>

        <div className="mt-3 border-l-2 border-primary/50 pl-3 sm:mt-4 sm:pl-4">
          <p className="text-[10px] font-black text-primary">{String(active + 1).padStart(2, "0")} · {SCENES[active]}</p>
          <p className="mt-1 min-h-24 break-keep text-xs leading-5 text-muted-foreground sm:min-h-14 sm:text-sm sm:leading-6">{NOTES[active]}</p>
        </div>

        <AnimatedSceneControls
          {...scenes}
          labels={SCENES}
          controlLabels={["digest", "검증", "N 표", "N 증서", "판정", "기록", "F 표", "F 증서"]}
          playLabel="Simplex finalization 과정 재생"
          className="mt-0 sm:mt-4"
        />
      </div>
      <StaticSceneList labels={SCENES} notes={NOTES} />
    </VizFrame>
  );
}

export function QuorumIntersectionViz() {
  return (
    <VizFrame
      eyebrow="구조 먼저 · n=4, q=3"
      title="세 명짜리 두 quorum은 최소 두 명이 겹칩니다"
      description="Q₁과 Q₂가 같은 네 validator에서 각각 세 명을 고르면 서로 완전히 떨어질 수 없습니다."
      note="색은 집합 소속을 나타냅니다. 이 그림만으로 payload availability나 Application execution을 보장하지는 않습니다."
      canvasClassName="p-3 sm:p-5"
    >
      <div className="grid grid-cols-4 gap-2 text-center" aria-label="Q1과 Q2의 validator 교집합">
        {([
          ["A", "Q₁"],
          ["B", "Q₁ ∩ Q₂"],
          ["C", "Q₁ ∩ Q₂"],
          ["D", "Q₂"],
        ] as const).map(([name, membership], index) => (
          <div key={name} className={`min-w-0 border px-1.5 py-3 ${index === 1 || index === 2 ? "border-primary bg-primary/[0.06]" : "border-border bg-background"}`}>
            <strong className="font-mono text-base">{name}</strong>
            <span className="mt-1 block break-keep text-[9px] font-bold text-muted-foreground sm:text-xs">{membership}</span>
          </div>
        ))}
      </div>
      <div className="mt-3 grid grid-cols-3 gap-px bg-border p-px text-center text-xs">
        <p className="bg-background px-2 py-3"><strong className="block text-primary">Q₁</strong>A · B · C</p>
        <p className="bg-background px-2 py-3"><strong className="block text-primary">교집합</strong>B · C = 2명</p>
        <p className="bg-background px-2 py-3"><strong className="block text-primary">Q₂</strong>B · C · D</p>
      </div>
    </VizFrame>
  );
}

export function SimplexFailureViz() {
  const rows = [
    ["certify=false 또는 timeout", "nullify vote", "세 표", "Nullification", "next_term_start(v)"],
    ["certify channel 오류", "false로 바꾸지 않음", "결과 없음", "restart/replay", "certify 재요청"],
  ] as const;
  return (
    <VizFrame
      eyebrow="실패 분기"
      title="유효하지 않다는 판정과 판정을 받지 못한 오류는 같은 상태가 아닙니다"
      description="첫 경로는 현재 term을 건너뛸 증서를 만들고, 둘째 경로는 영구 거절로 기록하지 않은 채 복구 뒤 다시 판정합니다."
      note="term_length=1인 설정에서는 next_term_start(v)가 v+1과 같지만, 일반식은 next_term_start(v)입니다."
      canvasClassName="p-2 sm:p-5"
    >
      <div className="space-y-2" aria-label="Simplex certification 실패와 채널 오류의 서로 다른 상태 전이">
        {rows.map((row, rowIndex) => (
          <div key={row[0]} className="grid grid-cols-[repeat(5,minmax(0,1fr))] gap-px bg-border p-px text-center text-[9px] leading-4 sm:text-xs sm:leading-5">
            {row.map((cell, index) => (
              <div key={cell} className={`min-w-0 bg-background px-1.5 py-3 ${index === 0 || index === 3 ? "font-bold" : "text-muted-foreground"}`}>
                {index > 0 && <span className="mb-1 block text-primary" aria-hidden>→</span>}
                <span className="break-keep">{cell}</span>
              </div>
            ))}
            <span className="sr-only">{rowIndex === 0 ? "인증 실패 경로" : "채널 오류 복구 경로"}</span>
          </div>
        ))}
      </div>
    </VizFrame>
  );
}
