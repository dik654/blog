import type { ReactNode } from "react";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #case — 포토시 은 100의 가정 경로. 15 + 25 + 60 = 100이고, 40은 60 안의 몫입니다.
 * 막대 전체 폭이 100이고 모든 줄이 같은 눈금입니다. 60 − 40 = 20의 행선지는 본문에 없어 "나머지"로만 적습니다.
 */
const SCENES = [
  { label: "출발점", summary: "정련된 은 100 (가정)", note: "포토시에서 광석을 처리해 뽑아낸 은 100단위를 가정합니다. 역사 평균이 아니라 흐름을 나눠 보기 위한 예시입니다." },
  { label: "현지에 남는 몫", summary: "100 − 15 = 85", note: "15는 현지 지급과 거래에 남습니다. 은이 처음부터 전부 바다를 건너는 것은 아니라고 놓은 숫자입니다." },
  { label: "유럽 장부에 잡히는 몫", summary: "85 − 25 = 60", note: "세금·운송·손실 25를 거치면 60이 대서양 건너 유럽 장부에 잡힙니다. 25는 세 가지를 합친 값이고 본문은 더 나누지 않습니다." },
  { label: "아시아로 이어지는 몫", summary: "60 − 40 = 20", note: "60 중 40이 상품 결제와 재수출(들여온 것을 다시 내보내는 일)을 통해 아시아 시장으로 이어진다고 놓습니다. 나머지 20의 쓰임은 본문이 따라가지 않습니다." },
  { label: "합을 맞춰 보기", summary: "15 + 25 + 20 + 40 = 100", note: "60과 40을 더해 100을 만들면 틀립니다. 40은 60 안에 들어 있는 몫이고, 네 조각을 더해야 처음의 100이 됩니다." },
] as const;

function Block({ left, width, value, color, shown, outlined = false }: { left: number; width: number; value: number; color: string; shown: boolean; outlined?: boolean }) {
  if (!shown) return null;
  return (
    <span
      className="absolute inset-y-0 flex items-center justify-center rounded-sm font-mono text-sm font-bold"
      style={{
        left: `${left}%`,
        width: `${width}%`,
        backgroundColor: outlined ? "transparent" : color,
        border: `1px ${outlined ? "dashed" : "solid"} ${color}`,
        color: outlined ? color : "#ffffff",
      }}
    >
      {value}
    </span>
  );
}

function Row({ place, caption, children }: { place: string; caption: string; children: ReactNode }) {
  return (
    <div className="relative">
      <p className="text-xs leading-5 sm:text-sm"><b>{place}</b> <span className="text-muted-foreground">{caption}</span></p>
      <div className="relative mt-1 h-8 rounded-sm border border-dashed border-border/70">{children}</div>
    </div>
  );
}

export default function SilverSplitViz() {
  return (
    <SceneShell
      eyebrow="은 100단위의 길"
      title="40은 60에 더해지는 몫이 아니라 60 안에 있는 몫입니다"
      description="모든 줄의 막대 전체 폭이 은 100단위이고, 위에서 아래로 갈수록 길을 따라 멀리 갑니다. 모든 수는 흐름을 나누려고 놓은 가정이며 역사 평균이 아닙니다."
      ariaLabel="은 100단위가 현지 15, 세금 운송 손실 25, 유럽 60으로 나뉘고 60 중 40이 아시아로 이어지는 막대 그림"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0 space-y-3">
          <Row place="① 안데스" caption="포토시의 정련된 은">
            <Block left={0} width={100} value={100} color="#475569" shown />
          </Row>
          <Row place="② 유럽에 닿기 전 빠지는 몫" caption="현지 지급·거래 15, 세금·운송·손실 25">
            <Block left={0} width={15} value={15} color="#15803d" shown={active >= 1} />
            <Block left={15} width={25} value={25} color="#b45309" shown={active >= 2} />
          </Row>
          <Row place="③ 유럽" caption="대서양 건너 장부에 잡힌 은">
            <Block left={40} width={60} value={60} color="#2563eb" shown={active >= 2} />
          </Row>
          <Row place="④ 그 60의 갈래" caption="아시아 시장 40, 나머지 20">
            <Block left={40} width={40} value={40} color="#1e3a8a" shown={active >= 3} />
            <Block left={80} width={20} value={20} color="#2563eb" shown={active >= 3} outlined />
          </Row>
        </div>
      )}
    />
  );
}
