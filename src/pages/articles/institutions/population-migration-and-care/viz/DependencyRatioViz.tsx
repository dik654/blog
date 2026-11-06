import SceneShell from "./SceneShell";

/**
 * 본문 대응: names 절의 연령 부양비. (20 + 20) / 60 × 100 = 약 66.7.
 * 15–64세 60명당 다른 연령 40명 = 15–64세 100명당 다른 연령 66.7명.
 */
const SCENES = [
  { label: "A 마을의 사람 수", summary: "60명당 40명", note: "분모는 15–64세 60명, 분자는 그 밖의 연령인 0–14세 20명과 65세 이상 20명을 합친 40명입니다." },
  { label: "100명 기준으로", summary: "40 ÷ 60 × 100 = 약 66.7", note: "분모를 100명으로 키우면 분자는 약 66.7명입니다. 사람 수가 늘어난 것이 아니라 같은 비율을 100명 기준으로 다시 쓴 것입니다." },
  { label: "이 비율이 말하지 않는 것", summary: "나이만 셉니다", note: "칸은 나이로만 나뉩니다. 65세 이상 모두가 경제적으로 의존한다는 뜻도, 15세부터 모두 취업한다는 뜻도 아닙니다. 실제 취업자 45명은 이 식에 들어가지 않습니다." },
] as const;

function Row({ label, value, count, color }: { label: string; value: string; count: number; color: (index: number) => string }) {
  const whole = Math.floor(count);
  const part = count - whole;
  return (
    <div>
      <p className="mb-1 flex flex-wrap justify-between gap-x-3 text-xs font-semibold">
        <span>{label}</span>
        <span className="font-mono">{value}</span>
      </p>
      <div className="grid grid-cols-20 gap-[3px]" aria-hidden="true">
        {Array.from({ length: 100 }, (_, i) => {
          const fill = i < whole ? 1 : i === whole ? part : 0;
          return (
            <span key={i} className={`relative aspect-square overflow-hidden rounded-[2px] border ${fill > 0 ? "border-border" : "border-border/30"}`}>
              {fill > 0 && <span className="absolute inset-y-0 left-0" style={{ width: `${fill * 100}%`, backgroundColor: color(i) }} />}
            </span>
          );
        })}
      </div>
    </div>
  );
}

const denominator = () => "#2563eb";

export default function DependencyRatioViz() {
  return (
    <SceneShell
      eyebrow="연령 부양비"
      title="15–64세 60명당 다른 연령 40명을 100명 기준으로 바꾸면 66.7입니다"
      description="칸 하나가 한 사람이고, 테두리만 있는 칸은 비어 있는 자리입니다. 연령 부양비는 15–64세를 분모로, 그 밖의 연령을 분자로 둔 비율입니다(UN 표준 지표명은 총부양비)."
      ariaLabel="연령 부양비 66.7의 계산과 그 비율이 말하지 않는 것"
      scenes={SCENES}
      render={(active) => {
        const rescaled = active === 1;
        const childLast = rescaled ? 100 / 3 : 20;
        return (
          <div className="min-w-0 space-y-4">
            <Row label="분모: 15–64세" value={rescaled ? "100명" : "60명"} count={rescaled ? 100 : 60} color={denominator} />
            <Row
              label="분자: 0–14세(진한 회색) + 65세 이상(옅은 회색)"
              value={rescaled ? "약 66.7명" : "20 + 20 = 40명"}
              count={rescaled ? 200 / 3 : 40}
              color={(i) => (i < childLast ? "#64748b" : "#94a3b8")}
            />
          </div>
        );
      }}
    />
  );
}
