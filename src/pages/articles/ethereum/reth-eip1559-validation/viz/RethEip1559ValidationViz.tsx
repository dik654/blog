import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const SCENES = ["조건 고정", "Oracle", "경로 대조", "경계 주입", "복구", "결정"] as const;
const NOTES = [
  "Reth v2.8.1과 commit d763342…, Alloy EIPs·Consensus v2.5.0, ChainSpec digest, fork timestamp, parent header와 transaction corpus를 한 run ID에 고정합니다.",
  "EIP-1559 명세와 고정된 기준 구현으로 target−1, target, target+1, 최대 사용량, 작은 base fee와 cap 경계의 expected wei를 만듭니다.",
  "같은 parent에서 payload 작성, consensus header 검증과 TxPool maintenance가 계산한 next base fee를 대조합니다. 한 경로만 맞아도 배포할 수 없습니다.",
  "London 전후, custom parameter, zero guard, 큰 중간 곱, max fee가 base fee보다 작은 거래와 receipt accounting을 주입해 첫 불일치를 찾습니다.",
  "Header parity가 깨지면 후보 binary와 ChainSpec 배포를 중지하고 parent·params·계산 trace를 보존합니다. 이전 binary와 spec으로 되돌린 뒤 같은 fixture를 재생합니다.",
  "Header·transaction·receipt·rollback parity를 모두 통과한 run에서만 처리 비용을 비교합니다. 대상 환경의 측정 결과가 없으므로 현재 상태는 proposed입니다.",
] as const;

function Cell({
  title,
  body,
  tone = "plain",
  className = "",
}: {
  title: string;
  body: string;
  tone?: "plain" | "active" | "warn";
  className?: string;
}) {
  const toneClass =
    tone === "active"
      ? "border-primary text-primary"
      : tone === "warn"
        ? "border-amber-500/70 text-amber-700 dark:text-amber-300"
        : "border-border";
  return (
    <div className={`min-w-0 border bg-background p-3 ${toneClass} ${className}`}>
      <strong className="block break-keep text-xs">{title}</strong>
      <span className="mt-2 block break-keep text-[10px] leading-4 text-muted-foreground">
        {body}
      </span>
    </div>
  );
}

export default function RethEip1559ValidationViz() {
  const scenes = useAnimatedScenes(SCENES.length, 7800, { loop: false });
  const active = scenes.active;
  return (
    <VizFrame
      className="scroll-mt-20"
      eyebrow="실무 경로 · EIP-1559 변경 검증"
      title="같은 parent와 거래를 세 실행 경로에서 1 wei까지 대조합니다"
      description="계산 함수 하나가 아니라 ChainSpec, payload 작성, header 검증, TxPool과 rollback을 한 release gate로 묶습니다."
      note="이 화면은 격리된 실험 계획입니다. 운영 노드의 성능·복구 시간은 아직 측정하지 않았습니다."
      canvasClassName="px-2 py-2 sm:p-5"
    >
      <div
        id={scenes.playbackId}
        data-viz-live-only
        data-reth-eip1559-validation-scene={active}
        tabIndex={0}
        role="group"
        aria-label="Reth EIP-1559 변경을 경계값과 여러 실행 경로에서 검증하고 복구하는 과정"
        onKeyDown={scenes.onKeyDown}
        className="outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
      >
        <div className="grid grid-cols-3 gap-px bg-border p-px lg:grid-cols-6">
          {SCENES.map((label, index) => (
            <div
              key={label}
              className={`min-w-0 bg-background px-2 py-2.5 ${
                index === active ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              <span
                className={`mb-2 block h-1 w-7 ${
                  index === active
                    ? "bg-primary"
                    : index < active
                      ? "bg-primary/35"
                      : "bg-border"
                }`}
              />
              <span className="font-mono text-[9px] font-black">
                {String(index + 1).padStart(2, "0")}
              </span>
              <strong className="mt-1 block break-keep text-[11px] leading-4">
                {label}
              </strong>
            </div>
          ))}
        </div>

        <section className="mt-3 min-h-[22rem] border border-border bg-background p-3 sm:min-h-[18rem] sm:p-5">
          {active === 0 ? (
            <div className="grid min-h-[15rem] grid-cols-2 content-center gap-2 sm:grid-cols-3">
              <Cell title="RETH" body="v2.8.1 · d763342…" tone="active" />
              <Cell title="ALLOY" body="EIPs·Consensus v2.5.0" tone="active" />
              <Cell title="CHAIN" body="spec digest·fork timestamp·params" />
              <Cell title="PARENT" body="number·hash·limit·used·base fee" />
              <Cell title="TRANSACTION" body="type·max fee·priority·actual gas" />
              <Cell title="RUNTIME" body="features·platform·build artifact" />
            </div>
          ) : null}
          {active === 1 ? (
            <div className="grid min-h-[15rem] content-center gap-3">
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
                {[
                  ["TARGET−1", "감소 분기"],
                  ["TARGET", "값 유지"],
                  ["TARGET+1", "+1 wei 가능"],
                  ["2×TARGET", "상승 경계"],
                  ["USED 0", "하락 경계"],
                  ["큰 곱", "중간값 범위"],
                ].map(([title, body], index) => (
                  <Cell key={title} title={title} body={body} tone={index === 2 ? "active" : "plain"} />
                ))}
              </div>
              <p className="border-y border-primary/40 py-3 text-center text-xs font-bold text-primary">
                expected wei · effective tip · burn · beneficiary delta
              </p>
            </div>
          ) : null}
          {active === 2 ? (
            <div className="grid min-h-[15rem] content-center gap-3">
              <div className="grid grid-cols-3 gap-px bg-border p-px">
                <Cell title="PAYLOAD" body="next block EVM env의 base fee" />
                <Cell title="CONSENSUS" body="received header의 expected base fee" />
                <Cell title="TXPOOL" body="다음 block용 pending base fee" />
              </div>
              <div className="grid grid-cols-3 gap-px bg-border p-px">
                <Cell title="같은 입력" body="parent·timestamp·ChainSpec" />
                <Cell title="같은 결과" body="exact u64 wei" tone="active" />
                <Cell title="다른 owner" body="builder·validator·pool" />
              </div>
            </div>
          ) : null}
          {active === 3 ? (
            <div className="grid min-h-[15rem] content-center gap-3">
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                <Cell title="FORK" body="London 직전·활성 block" tone="warn" />
                <Cell title="PARAM" body="custom E·D·timestamp" />
                <Cell title="INTEGER" body="작은 fee·큰 곱·rounding" tone="warn" />
                <Cell title="TX CAP" body="below·equal·above base" />
              </div>
              <p className="border-y border-border py-3 text-center text-xs font-bold">
                첫 header·receipt·balance mismatch에서 즉시 실패
              </p>
            </div>
          ) : null}
          {active === 4 ? (
            <div className="grid min-h-[15rem] content-center gap-3">
              <div className="grid grid-cols-2 gap-px bg-border p-px sm:grid-cols-5">
                {[
                  ["발견", "1 wei·receipt mismatch"],
                  ["중지", "candidate rollout"],
                  ["보존", "parent·params·trace"],
                  ["복구", "binary·spec rollback"],
                  ["재진입", "fixture 전부 재생"],
                ].map(([title, body], index) => (
                  <Cell
                    key={title}
                    title={title}
                    body={body}
                    tone={index === 0 ? "warn" : index === 4 ? "active" : "plain"}
                    className={index === 4 ? "col-span-2 sm:col-span-1" : undefined}
                  />
                ))}
              </div>
              <p className="text-center text-xs text-muted-foreground">
                이미 수신한 canonical header를 후보 계산 결과로 덮어쓰지 않습니다.
              </p>
            </div>
          ) : null}
          {active === 5 ? (
            <div className="grid min-h-[15rem] content-center gap-3">
              <div className="grid grid-cols-2 gap-px bg-border p-px sm:grid-cols-4">
                <Cell title="HEADER" body="exact base fee parity" />
                <Cell title="TRANSACTION" body="eligibility·tip parity" />
                <Cell title="ACCOUNTING" body="receipt·balance parity" />
                <Cell title="RECOVERY" body="rollback·replay parity" />
              </div>
              <div className="grid grid-cols-3 gap-px bg-border p-px">
                <Cell title="STATUS" body="proposed" />
                <Cell title="채택" body="모든 gate 통과" tone="active" />
                <Cell title="기각" body="1 wei 차이 한 건" tone="warn" />
              </div>
            </div>
          ) : null}
        </section>

        <p
          data-scene-note
          className="mt-3 min-h-24 border-l-2 border-primary/50 pl-3 text-xs leading-5 text-muted-foreground sm:min-h-20 sm:pl-4 sm:text-sm sm:leading-6"
        >
          {NOTES[active]}
        </p>
        <AnimatedSceneControls
          {...scenes}
          labels={SCENES}
          controlLabels={["조건", "Oracle", "경로", "경계", "복구", "결정"]}
          playLabel="EIP-1559 검증 재생"
          className="mt-0 sm:mt-4 [&_[data-viz-desktop-controls]>button]:min-w-0 [&_[data-viz-desktop-controls]>button:last-child]:w-24"
        />
      </div>
      <StaticSceneList labels={SCENES} notes={NOTES} />
    </VizFrame>
  );
}
