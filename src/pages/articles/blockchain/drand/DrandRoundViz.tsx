import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const LABELS = [
  "미래 round 고정",
  "키 나누기",
  "같은 문장 서명",
  "문턱 미달",
  "서명 복원",
  "클라이언트 검증",
  "앱에서 사용",
] as const;

const SCENES = [
  {
    title: "추첨 앱은 결과를 보기 전에 사용할 미래 round를 먼저 고정합니다",
    detail:
      "지금 round 40이라면 ‘round 42를 사용한다’는 규칙을 참가 마감 전에 기록합니다. 결과를 본 뒤 유리한 round를 고르면 drand가 정직해도 추첨은 공정하지 않습니다.",
    round: "42 · 아직 미래",
    shares: "0 / 3",
    proof: "없음",
    state: "선택 규칙만 고정",
  },
  {
    title:
      "설정 단계에서 5개 노드는 하나의 비밀키 대신 각자 key share를 받습니다",
    detail:
      "DKG가 collective public key와 private shares를 만듭니다. 어느 한 노드도 전체 private key를 직접 보유하지 않습니다.",
    round: "setup",
    shares: "n=5 · t=3",
    proof: "chain info + public key",
    state: "beacon identity 고정",
  },
  {
    title:
      "Round 42가 오면 노드들은 scheme이 정한 같은 message에 partial signature를 냅니다",
    detail:
      "Unchained scheme은 round를, chained scheme은 이전 signature와 round를 message에 넣습니다. 서로 다른 scheme이나 round의 shares는 섞을 수 없습니다.",
    round: "42",
    shares: "node 1 · node 3",
    proof: "σ₁⁴², σ₃⁴²",
    state: "같은 message 확인",
  },
  {
    title: "두 shares만 모였으므로 t=3 문턱에 못 미쳐 결과를 만들 수 없습니다",
    detail:
      "공개 API가 늦는다고 임의 bytes나 이전 round를 대신 쓰면 안 됩니다. 이 시점의 올바른 상태는 ‘난수 없음’입니다.",
    round: "42",
    shares: "2 / 3",
    proof: "복원 불가",
    state: "대기 또는 실패",
  },
  {
    title:
      "세 번째 share가 오면 누구나 하나의 unique BLS signature를 복원할 수 있습니다",
    detail:
      "Signer indices의 Lagrange coefficients로 shares를 보간합니다. 같은 key와 message에 대한 BLS signature가 유일하므로 여러 후보 중 유리한 값을 고를 수 없습니다.",
    round: "42",
    shares: "1 · 3 · 5 = 3 / 3",
    proof: "full signature σ₄₂",
    state: "beacon 생성, 앱 승인 전",
  },
  {
    title:
      "클라이언트는 pinned chain info로 round와 signature를 확인한 뒤 randomness를 다시 계산합니다",
    detail:
      "Expected round, scheme message와 collective public key로 BLS를 검증하고 SHA-256(signature)가 응답 randomness와 같은지 확인합니다.",
    round: "expected 42 = received 42",
    shares: "복원 과정은 신뢰 불필요",
    proof: "BLS valid + H(σ₄₂)",
    state: "verified beacon",
  },
  {
    title:
      "앱은 용도 tag와 round를 함께 hash하고 선택 규칙·검증 결과를 영수증으로 남깁니다",
    detail:
      "같은 beacon을 추첨과 게임에서 그대로 재사용하지 않도록 domain을 나눕니다. Relay 장애 때는 다른 relay의 같은 verified beacon을 받을 수 있지만 미검증 fallback은 금지합니다.",
    round: "42",
    shares: "threshold receipt",
    proof: "H(app-tag ∥ chain ∥ 42 ∥ σ₄₂)",
    state: "application randomness accepted",
  },
] as const;

const NOTES = SCENES.map(
  (scene, index) =>
    `${LABELS[index]}. ${scene.title} ${scene.detail} 현재 상태는 ${scene.state}입니다.`,
);

export default function DrandRoundViz() {
  const scenes = useAnimatedScenes(SCENES.length, 8200, { loop: false });
  const scene = SCENES[scenes.active];

  return (
    <VizFrame
      eyebrow="n=5 · t=3 · 미래 round 42"
      title="아무도 혼자 정할 수 없는 미래 값을 만들고, 누구나 같은 공개키로 검증합니다"
      description="추첨 앱이 미래 round를 먼저 고정한 뒤 partial signatures가 모이고, 클라이언트가 signature와 derived randomness를 검증할 때까지 따라갑니다."
      note="Round 42와 n=5, t=3은 설명용입니다. 실제 chain hash, scheme, public key, period와 genesis time은 신뢰한 chain info에서 고정해야 합니다."
      documentFlow
      canvasClassName="p-3 sm:p-6"
    >
      <div
        id={scenes.playbackId}
        tabIndex={0}
        onKeyDown={scenes.onKeyDown}
        className="outline-none focus-visible:ring-2 focus-visible:ring-primary"
        aria-label="drand threshold round 생성과 소비 장면 탐색기"
      >
        <div data-viz-live-only className="space-y-4">
          <div
            data-viz-scene-stage
            className="min-h-[44rem] space-y-4 sm:min-h-[31rem] xl:min-h-[27rem]"
          >
            <div className="grid grid-cols-4 gap-1.5 sm:grid-cols-7">
              {LABELS.map((label, index) => (
                <div
                  key={label}
                  className={`border px-1 py-2 text-center text-[9px] font-black ${index === scenes.active ? "border-primary bg-primary/10" : index < scenes.active ? "border-foreground/30 bg-background" : "border-border bg-background text-muted-foreground"}`}
                >
                  {index + 1}. {label}
                </div>
              ))}
            </div>

            <div className="grid gap-px bg-border p-px lg:grid-cols-[minmax(0,1.4fr)_minmax(13rem,0.6fr)]">
              <div className="bg-background p-4 sm:p-5">
                <p className="text-[10px] font-black text-primary">
                  지금 답할 질문 · {LABELS[scenes.active]}
                </p>
                <h4 className="mt-2 break-keep text-base font-black leading-6 sm:text-lg">
                  {scene.title}
                </h4>
                <p className="mt-2 break-keep text-xs leading-6 text-muted-foreground">
                  {scene.detail}
                </p>
              </div>
              <div className="bg-background p-4 sm:p-5">
                <p className="text-[9px] font-bold text-muted-foreground">
                  이 단계의 완료 상태
                </p>
                <p className="mt-2 border-l-2 border-primary pl-3 font-mono text-xs font-black leading-5">
                  {scene.state}
                </p>
                <p className="mt-4 text-[9px] leading-5 text-muted-foreground">
                  Beacon 생성과 애플리케이션의 공정한 사용을 같은 완료로 부르지
                  않습니다.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
              {[
                ["round", scene.round],
                ["모인 shares", scene.shares],
                ["검증 재료", scene.proof],
                ["현재 상태", scene.state],
              ].map(([label, value], index) => (
                <article
                  key={label}
                  className={`min-w-0 border bg-background p-3 ${index === 3 ? "border-primary/60" : "border-border"}`}
                >
                  <p className="text-[9px] font-bold text-muted-foreground">
                    {label}
                  </p>
                  <p className="mt-2 break-keep font-mono text-[10px] font-black leading-5 sm:text-xs">
                    {value}
                  </p>
                </article>
              ))}
            </div>

            <div className="flex gap-1" aria-hidden="true">
              {LABELS.map((label, index) => (
                <span
                  key={label}
                  className={`h-1.5 flex-1 ${index <= scenes.active ? "bg-primary" : "bg-border"}`}
                />
              ))}
            </div>
          </div>

          <AnimatedSceneControls
            {...scenes}
            labels={LABELS}
            controlLabels={LABELS}
            playLabel="drand round 생성·검증 경로 재생"
            compact
          />
        </div>
        <StaticSceneList labels={LABELS} notes={NOTES} />
      </div>
    </VizFrame>
  );
}
