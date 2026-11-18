import type { ReactNode } from "react";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #mechanism — 주가 변화 = 평균 몫 + 20×무작위 변화(한 표준 ±1.26).
 * 옵션 가격 변화 = 시간 몫 + 기울기×주가 변화 + 굽음 보정(1.26²≈1.59에서 옴).
 * 주식을 알맞게(기울기만큼) 반대로 묶으면 기울기×주가 변화 줄이 통째로 지워지고,
 * 남은 시간 몫 + 굽음 보정은 확정 몫이라 무위험금리를 벌어야 한다 → 실제 기대수익률이 빠진다.
 * 옵션의 기울기·굽음 크기는 본문이 정하지 않으므로 숫자를 적지 않는다.
 */
type Tone = "drift" | "random" | "time" | "curve" | "hedge" | "rate";

const COLORS: Record<Tone, string> = {
  drift: "#64748b",
  random: "#2563eb",
  time: "#0f766e",
  curve: "#d97706",
  hedge: "#7c3aed",
  rate: "#15803d",
};

const SCENES = [
  { label: "주가 변화를 둘로", summary: "평균 몫 + 무작위 몫(±1.26)", note: "주가 변화는 시간에 따라 붙는 평균 몫과 20%×100×무작위 변화로 나뉩니다. 무작위 몫의 한 표준 크기가 1.26입니다." },
  { label: "옵션 가격 변화를 셋으로", summary: "시간 + 기울기×주가 변화 + 굽음 보정", note: "옵션 가격 함수에 주가 변화를 넣으면 주가 변화에 비례하는 첫 번째 미분(기울기) 항과, 1.26²에서 온 두 번째 미분(굽음) 보정이 생깁니다. 굽음 보정은 방향과 상관없이 같은 크기라 부호가 무작위가 아닙니다." },
  { label: "주식을 반대로 묶기", summary: "기울기×주가 변화 줄이 지워짐", note: "옵션과 주식을 알맞게 묶어 기울기×주가 변화 줄을 상쇄하면 무작위 몫이 사라집니다. 이 줄 안에 있던 평균 몫도 함께 빠집니다." },
  { label: "남은 확정 몫", summary: "시간 + 굽음 보정 = 무위험금리", note: "무작위 몫이 없는 묶음은 무위험금리를 벌어야 합니다. 실제 기대수익률은 빠지고 금리·흔들림·지급 조건이 남습니다." },
] as const;

function Chip({ text, tone, struck = false, dim = false }: { text: string; tone: Tone; struck?: boolean; dim?: boolean }) {
  return (
    <span
      className={`inline-flex items-center rounded-md border px-2 py-1 text-xs leading-5 sm:text-sm ${struck ? "line-through" : ""}`}
      style={{ borderColor: COLORS[tone], color: COLORS[tone], opacity: dim ? 0.3 : 1, borderStyle: struck ? "dashed" : "solid" }}
    >
      {text}
    </span>
  );
}

function Row({ label, on, children }: { label: string; on: boolean; children: ReactNode }) {
  return (
    <div className={`grid gap-2 border-l-2 py-1 pl-3 sm:grid-cols-[7.5rem_minmax(0,1fr)] sm:items-center ${on ? "border-primary" : "border-border"}`}>
      <span className={`text-xs ${on ? "font-bold" : "text-muted-foreground"}`}>{label}</span>
      <div className="flex min-w-0 flex-wrap items-center gap-1.5 text-sm">{children}</div>
    </div>
  );
}

export default function HedgeCancelViz() {
  return (
    <SceneShell
      eyebrow="복제와 상쇄"
      title="무작위 몫을 지우면 금리만 남습니다"
      description="기울기는 주가가 1 움직일 때 옵션 가격이 움직이는 비율(첫 번째 미분), 굽음은 그 기울기가 변하는 정도(두 번째 미분)입니다. 옵션의 기울기·굽음 크기는 본문이 정하지 않아 숫자 없이 항의 자리만 그립니다."
      ariaLabel="옵션과 주식을 묶어 무작위 항을 지우고 무위험금리만 남는 과정"
      scenes={SCENES}
      render={(active) => {
        const struck = active >= 2;
        return (
          <div className="min-w-0 space-y-3">
            <Row label="주가 변화" on={active === 0}>
              <Chip text="평균 몫" tone="drift" />
              <span>+</span>
              <Chip text="20×무작위 변화 (±1.26)" tone="random" />
            </Row>
            <Row label="옵션 가격 변화" on={active === 1}>
              <Chip text="시간 몫" tone="time" dim={active < 1} />
              <span className={active < 1 ? "opacity-30" : ""}>+</span>
              <Chip text="기울기 × 주가 변화" tone="random" dim={active < 1} struck={struck} />
              <span className={active < 1 ? "opacity-30" : ""}>+</span>
              <Chip text="굽음 보정 (1.26²≈1.59에서 온 항)" tone="curve" dim={active < 1} />
            </Row>
            <Row label="주식 묶음" on={active === 2}>
              <Chip text="− 기울기 × 주가 변화" tone="hedge" dim={active < 2} struck={struck} />
              <span className={`text-xs text-muted-foreground ${active < 2 ? "opacity-30" : ""}`}>위 줄과 같은 크기, 반대 방향</span>
            </Row>
            <Row label="묶음의 남은 변화" on={active === 3}>
              <Chip text="시간 몫" tone="time" dim={active < 3} />
              <span className={active < 3 ? "opacity-30" : ""}>+</span>
              <Chip text="굽음 보정" tone="curve" dim={active < 3} />
              <span className={active < 3 ? "opacity-30" : ""}>=</span>
              <Chip text="묶음 가치 × 무위험금리 × 시간" tone="rate" dim={active < 3} />
            </Row>
            <p className={`text-xs text-muted-foreground ${active < 2 ? "opacity-30" : ""}`}>취소선 = 묶음 안에서 서로 상쇄된 항. 이 줄은 주가 변화 전체(평균 몫 + 무작위 몫)에 비례하므로, 평균 몫에 담긴 실제 기대수익률도 함께 빠집니다.</p>
          </div>
        );
      }}
    />
  );
}
