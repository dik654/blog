import type { ReactNode } from "react";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #black-box — 기록 한 줄과 일반 문장의 범위가 다르고, 예측은 법칙 혼자가 아니라
 * 법칙 + 보조 가정(센서 정확·전원 켜짐·‘넘는다’=20.0 초과) + 기록(표시 21.0)에서 나온다.
 * 예측이 어긋나면 그 묶음 가운데 무엇을 고칠지 추가 검사가 필요하다.
 */
const SCENES = [
  {
    label: "기록 한 줄과 ‘언제나’의 범위",
    summary: "시험 1칸 ↔ 모든 시험",
    note: "‘시험 3에서 표시창은 21.0도였고 경보는 울리지 않았다’는 한 칸만 말합니다. ‘20도를 넘으면 언제나 경보가 울린다’는 아직 하지 않은 시험까지 덮으므로 한 번의 관찰로 모두 확인할 수 없고, 여러 시험에서 지지를 얻거나 문제를 드러냅니다.",
  },
  {
    label: "예측은 묶음에서 나옵니다",
    summary: "법칙 + 가정 2 + 언어 규칙 + 기록 → ‘울린다’",
    note: "시험 3의 ‘경보가 울려야 한다’는 예측은 법칙 하나로 나오지 않습니다. 센서가 정확하고, 전원이 켜졌고, ‘넘는다’를 20.0보다 큰 값으로 정했다는 가정 위에서 표시 21.0이 20.0을 넘었기 때문에 나옵니다.",
  },
  {
    label: "결과: 울리지 않았습니다",
    summary: "어긋남 → 묶음의 어느 칸?",
    note: "예측이 어긋났다는 사실은 묶음 전체에 물음표를 붙입니다. 법칙 자체와 보조 가정 가운데 무엇을 고칠지는 추가 검사가 필요합니다. 3절은 그 가운데 센서 가정을 별도 온도계로 검사합니다.",
  },
] as const;

const TRIALS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"] as const;

function Premise({ kind, text, doubt }: { kind: string; text: string; doubt: boolean }) {
  return (
    <div className={`min-w-0 rounded-lg border px-2 py-2 ${doubt ? "border-dashed border-red-600" : "border-border"}`}>
      <span className="flex items-center justify-between gap-1 text-xs text-muted-foreground">
        {kind}
        <span className={`font-mono font-bold ${doubt ? "text-red-700 dark:text-red-400" : "invisible"}`}>?</span>
      </span>
      <span className="block text-xs font-semibold leading-5 [word-break:keep-all] sm:text-sm">{text}</span>
    </div>
  );
}

function Arrow({ children }: { children: ReactNode }) {
  return (
    <p aria-hidden className="text-center text-xs leading-5 text-primary">
      {children}
    </p>
  );
}

function Scope() {
  return (
    <div className="min-w-0 space-y-3">
      <div>
        <span className="block text-xs text-muted-foreground">관찰 기록 · 시험 3 한 번</span>
        <div className="mt-1 grid grid-cols-11 gap-1">
          {TRIALS.map((trial) => (
            <span
              key={trial}
              className={`rounded border py-1 text-center font-mono text-[11px] ${trial === "3" ? "border-primary bg-primary/15 font-bold" : "border-border/50 text-muted-foreground/50"}`}
            >
              {trial}
            </span>
          ))}
          <span className="py-1 text-center font-mono text-[11px] text-muted-foreground/50">…</span>
        </div>
      </div>
      <div>
        <span className="block text-xs text-muted-foreground">일반 문장 · 하지 않은 시험까지</span>
        <div className="mt-1 grid grid-cols-11 gap-1">
          {TRIALS.map((trial) => (
            <span key={trial} className="rounded border border-primary/60 bg-primary/10 py-1 text-center font-mono text-[11px]">
              {trial}
            </span>
          ))}
          <span className="rounded border border-dashed border-primary/60 py-1 text-center font-mono text-[11px]">…</span>
        </div>
      </div>
      <p className="text-xs leading-5 text-muted-foreground">위 줄은 한 칸으로 끝나지만, 아래 줄의 ‘…’은 아직 하지 않은 시험이라 기록으로 다 채울 수 없습니다.</p>
    </div>
  );
}

function Bundle({ failed }: { failed: boolean }) {
  return (
    <div className="min-w-0 space-y-2">
      <div className="grid grid-cols-2 gap-2">
        <Premise kind="시험할 주장" text="20도를 넘으면 언제나 경보가 울린다" doubt={failed} />
        <Premise kind="보조 가정" text="센서가 정확하다" doubt={failed} />
        <Premise kind="보조 가정" text="경보 전원이 켜졌다" doubt={failed} />
        <Premise kind="언어 규칙" text="‘넘는다’ = 20.0보다 큰 값" doubt={failed} />
      </div>
      <div className="rounded-lg border border-border px-2 py-2 text-xs sm:text-sm">
        <span className="text-muted-foreground">관찰 기록 · 시험 3 </span>
        <span className="font-semibold">표시창 21.0도</span>
        <span className="font-mono text-muted-foreground"> (21.0 &gt; 20.0)</span>
      </div>
      <Arrow>{failed ? "↑ 어긋남이 되돌아갈 곳: 점선 네 칸 중 어디인지 아직 모름" : "↓ 함께 있어야 예측이 나옴"}</Arrow>
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-lg border border-primary bg-primary/10 px-2 py-2 text-center text-xs sm:text-sm">
          <span className="block text-muted-foreground">예측</span>
          <span className="font-semibold">경보가 울린다</span>
        </div>
        <div className={`rounded-lg border px-2 py-2 text-center text-xs sm:text-sm ${failed ? "border-red-600" : "border-dashed border-border/50 text-muted-foreground/50"}`}>
          <span className="block text-muted-foreground">결과</span>
          <span className={`font-semibold ${failed ? "text-red-700 dark:text-red-400" : ""}`}>{failed ? "✕ 울리지 않음" : "아직 모름"}</span>
        </div>
      </div>
    </div>
  );
}

export default function PremiseBundleViz() {
  return (
    <SceneShell
      eyebrow="시험 한 번의 구조"
      title="예측은 법칙 혼자가 아니라 문장 묶음에서 나옵니다"
      description="2절의 시험 3을 씁니다. 보조 가정은 시험할 주장 말고도 예측을 내는 데 함께 기대는 조건이고, 점선 빨간 칸은 어긋남 뒤 다시 검사할 후보입니다."
      ariaLabel="관찰 기록과 일반 문장의 범위 차이, 법칙과 보조 가정과 기록이 함께 예측을 내는 구조, 예측이 어긋났을 때 묶음 전체가 의심받는 세 장면"
      scenes={SCENES}
      render={(active) => (active === 0 ? <Scope /> : <Bundle failed={active === 2} />)}
    />
  );
}
