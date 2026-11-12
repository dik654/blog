import SceneShell from "./SceneShell";

/**
 * 본문 대응: #scheduler-fairness 첫째·둘째 문단 (가정).
 * 장면 1·2: 입력 비용 1, 출력 비용 2. X(R1·R2)는 출력 2개 → 2×2=4, Y(P)는 입력 3개 → 3×1=3.
 * 장면 3: 4,000 token 요청 100개 = 400,000, 200 token 요청 100개 = 20,000. 큰 쪽 400,000/420,000 ≈ 95.2%.
 */
const BIG = 4000 * 100;
const SMALL = 200 * 100;
const BIG_SHARE = (BIG / (BIG + SMALL)) * 100;

const SCENES = [
  { label: "요청 수", summary: "X 2개 : Y 1개", note: "R1·R2는 사용자 X, P는 사용자 Y의 요청입니다. 요청 개수만 세면 X가 두 배를 받는 것처럼 보입니다. (가정)" },
  { label: "서비스 단위", summary: "X 4 : Y 3", note: "입력 token 비용을 1, 출력 token 비용을 2로 정하면 한 실행에서 X는 출력 2개로 4, Y는 입력 3개로 3을 받습니다. 개수 비 2:1과 서비스 비 4:3은 다릅니다. (가정)" },
  { label: "같은 100개, 다른 몫", summary: `token 비중 ≈${BIG_SHARE.toFixed(1)}%`, note: "4,000 token 요청 100개와 200 token 요청 100개는 개수가 같아도 token은 400,000 대 20,000입니다. 이 95.2%는 token 비중이며 GPU 시간도 95.2%라고 단정할 수 없습니다. (가정)" },
] as const;

function Bar({ label, parts }: { label: string; parts: readonly { value: number; total: number; color: string; text: string }[] }) {
  return (
    <div className="grid grid-cols-[5.5rem_minmax(0,1fr)] items-center gap-3 text-xs sm:text-sm">
      <span className="font-semibold">{label}</span>
      <div className="flex h-8 min-w-0 overflow-hidden rounded-sm border border-border">
        {parts.map((part) => (
          <div
            key={part.text}
            className="flex min-w-0 items-center justify-center overflow-hidden whitespace-nowrap px-1 font-mono text-[11px] font-bold sm:text-xs"
            style={{ width: `${(part.value / part.total) * 100}%`, backgroundColor: `${part.color}33`, color: part.color, borderRight: `1px solid ${part.color}` }}
          >
            {part.text}
          </div>
        ))}
      </div>
    </div>
  );
}

const X_COLOR = "#2563eb";
const Y_COLOR = "#d97706";

export default function ServiceShareViz() {
  return (
    <SceneShell
      eyebrow="공정성의 분모"
      title="무엇을 세느냐에 따라 같은 실행의 몫이 달라집니다"
      description="막대 하나가 전체 100%입니다. 파란색은 큰 쪽(X 또는 긴 요청), 주황색은 작은 쪽입니다. 비용 1·2와 요청 길이는 본문의 가정입니다."
      ariaLabel="요청 수, 서비스 단위, token 수로 나눈 몫 비교"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0 space-y-3">
          <div className={active === 0 ? "" : "opacity-40"}>
            <Bar
              label="요청 수"
              parts={[
                { value: 2, total: 3, color: X_COLOR, text: "X 2" },
                { value: 1, total: 3, color: Y_COLOR, text: "Y 1" },
              ]}
            />
          </div>
          <div className={active === 1 ? "" : active > 1 ? "opacity-40" : "invisible"}>
            <Bar
              label="서비스"
              parts={[
                { value: 4, total: 7, color: X_COLOR, text: "X 2×2=4" },
                { value: 3, total: 7, color: Y_COLOR, text: "Y 3×1=3" },
              ]}
            />
          </div>
          <div className={active === 2 ? "space-y-3" : "invisible space-y-3"}>
            <Bar
              label="요청 100:100"
              parts={[
                { value: 100, total: 200, color: X_COLOR, text: "긴 100" },
                { value: 100, total: 200, color: Y_COLOR, text: "짧은 100" },
              ]}
            />
            <Bar
              label="token"
              parts={[
                { value: BIG, total: BIG + SMALL, color: X_COLOR, text: "400,000 (≈95.2%)" },
                { value: SMALL, total: BIG + SMALL, color: Y_COLOR, text: "" },
              ]}
            />
            <p className="text-right font-mono text-xs text-muted-foreground">짧은 쪽 20,000 ≈ 4.8%</p>
          </div>
        </div>
      )}
    />
  );
}
