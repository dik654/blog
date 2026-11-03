import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const LABELS = [
  "담보 잠그기",
  "DAI 만들기",
  "수수료 누적",
  "가격 하락",
  "청산 경로",
  "PSM 교환",
  "완료 구분",
] as const;

const SCENES = [
  {
    title: "사용자는 먼저 시장 가치 150달러인 담보를 Vault에 잠급니다",
    detail:
      "담보 token 수량은 adapter를 거쳐 Vat의 collateral-type 장부에 들어갑니다. 아직 DAI도 빚도 생기지 않았습니다.",
    collateral: "$150",
    art: "0",
    debt: "0 DAI",
    ratio: "빚 없음",
    state: "담보만 잠김",
  },
  {
    title: "100 DAI를 꺼내는 순간 같은 금액의 normalized debt가 생깁니다",
    detail:
      "설명용 rate가 1이면 art 100은 현재 빚 100 DAI입니다. 새 DAI는 공짜 보상이 아니라 담보를 잡고 만든 부채입니다.",
    collateral: "$150",
    art: "100",
    debt: "100 DAI",
    ratio: "150%",
    state: "안전 여부는 ilk 설정과 비교",
  },
  {
    title:
      "담보 수량이 그대로여도 rate가 1.05가 되면 현재 빚은 105로 늘어납니다",
    detail:
      "각 Vault의 art를 계속 다시 쓰는 대신 collateral type 공통 rate가 누적됩니다. 그래서 비율은 150%에서 약 142.86%로 내려갑니다.",
    collateral: "$150",
    art: "100",
    debt: "105 DAI",
    ratio: "142.86%",
    state: "수수료만으로 여유 감소",
  },
  {
    title: "Oracle 가치가 120달러로 내려가면 같은 금고의 여유가 더 줄어듭니다",
    detail:
      "현재 비율은 약 114.29%입니다. 청산 여부는 이 숫자 하나가 아니라 해당 ilk의 spot·liquidation parameter와 최신 oracle 상태로 판단합니다.",
    collateral: "$120",
    art: "100",
    debt: "105 DAI",
    ratio: "114.29%",
    state: "정책 기준과 비교 필요",
  },
  {
    title:
      "Unsafe 판정이 나면 Dog가 debt와 담보를 떼어 Clipper 경매로 넘깁니다",
    detail:
      "판정, 경매 시작, 담보 판매와 bad debt 해소는 서로 다른 상태입니다. 경매가 시작됐다고 부채가 모두 회수됐다고 기록하지 않습니다.",
    collateral: "auction lot",
    art: "Vault에서 감소",
    debt: "auction target",
    ratio: "더는 건강 지표 아님",
    state: "낙찰·회수 영수증 대기",
  },
  {
    title: "PSM은 별도 통로에서 승인된 stablecoin과 DAI를 직접 교환합니다",
    detail:
      "이 교환은 시장 가격이 1달러에서 멀어질 때 차익 거래 통로가 됩니다. 하지만 issuer risk, fee, inventory, debt ceiling과 pause 조건은 남습니다.",
    collateral: "approved stablecoin",
    art: "PSM 장부",
    debt: "capacity 안에서만",
    ratio: "Vault 비율과 무관",
    state: "별도 peg rail",
  },
  {
    title: "Vault 안전, 경매 완료와 PSM 교환 성공은 서로 다른 영수증입니다",
    detail:
      "DAI 가격 안정은 한 공식의 결과가 아닙니다. 담보 장부, oracle, 청산 시장과 직접 교환 통로가 각자의 조건을 지켜야 합니다.",
    collateral: "versioned snapshot",
    art: "art × rate",
    debt: "검증된 현재값",
    ratio: "threshold와 함께 읽기",
    state: "경계별 완료 상태 보존",
  },
] as const;

const NOTES = SCENES.map(
  (scene, index) =>
    `${LABELS[index]}. ${scene.title} ${scene.detail} 현재 상태는 ${scene.state}입니다.`,
);

export default function DaiVaultViz() {
  const scenes = useAnimatedScenes(SCENES.length, 8200, { loop: false });
  const scene = SCENES[scenes.active];

  return (
    <VizFrame
      eyebrow="담보 150달러 · DAI 부채 100의 시간 흐름"
      title="DAI는 담보를 잠그고 꺼낸 부채이며, 시간이 지나면 담보와 빚이 서로 다르게 움직입니다"
      description="한 Vault가 담보를 넣고 DAI를 만든 뒤, 수수료와 가격 하락을 거쳐 청산 판단에 도달하는 과정을 따라갑니다. PSM은 이 금고와 다른 peg 통로로 마지막에 분리합니다."
      note="150달러·100 DAI·rate 1.05는 계산을 위한 예시입니다. 실제 liquidation ratio, oracle, fee와 debt ceiling은 collateral type과 배포 시점에서 읽어야 합니다."
      documentFlow
      canvasClassName="p-3 sm:p-6"
    >
      <div
        id={scenes.playbackId}
        tabIndex={0}
        onKeyDown={scenes.onKeyDown}
        className="outline-none focus-visible:ring-2 focus-visible:ring-primary"
        aria-label="DAI Vault 부채와 청산 장면 탐색기"
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
                  지금 바뀐 것 · {LABELS[scenes.active]}
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
                  Unsafe 판정과 실제 담보 판매 완료를 같은 상태로 부르지
                  않습니다.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
              {[
                ["담보 가치", scene.collateral],
                ["normalized debt", scene.art],
                ["현재 빚", scene.debt],
                ["담보 비율", scene.ratio],
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
            playLabel="DAI Vault 부채·청산 경로 재생"
            compact
          />
        </div>
        <StaticSceneList labels={LABELS} notes={NOTES} />
      </div>
    </VizFrame>
  );
}
