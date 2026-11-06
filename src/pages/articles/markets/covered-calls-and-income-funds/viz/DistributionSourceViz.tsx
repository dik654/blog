import SceneShell from "./SceneShell";

/**
 * 본문 대응: #comparison — 분배금의 재원 분류와 실제 성과는 다른 계산이다.
 * 앞 두 장면은 QYLD 19a 공시 숫자, 마지막 장면은 7절의 가정 사례입니다. 두 사례를 섞지 않습니다.
 * 0.0022 + 0.1745 = 0.1767. 0.1745 ÷ 0.1767 ≈ 98.8%.
 */
const SCENES = [
  { label: "받은 분배금", summary: "주당 0.1767달러", note: "QYLD의 2026년 9월 24일 19a 공시에 적힌 주당 분배금입니다. 계좌에는 한 덩어리로 들어옵니다." },
  { label: "재원 나누기", summary: "0.0022 + 0.1745", note: "공시는 순투자소득 0.0022달러와 자본환급 추정액 0.1745달러로 나눕니다. 자본환급 쪽이 약 98.8%지만 잠정 분류이며 최종 세무 자료가 아닙니다." },
  { label: "성과는 따로", summary: "(88 + 12 − 100) ÷ 100 = 0%", note: "분류만으로 손익은 나오지 않습니다. 7절의 가정처럼 NAV가 100에서 88이 되고 12를 받았다면, 남은 자산과 현금을 합친 100은 처음과 같아 총수익은 0%입니다." },
] as const;

function Stack({ title, parts }: { title: string; parts: readonly { label: string; value: string; share: number; color: string }[] }) {
  return (
    <div>
      <p className="mb-1 text-xs font-semibold text-muted-foreground">{title}</p>
      <div className="flex h-9 w-full overflow-hidden rounded-md border border-border">
        {parts.map((part) => (
          <div key={part.label} style={{ width: `${part.share}%`, backgroundColor: part.color }} />
        ))}
      </div>
      <ul className="mt-2 space-y-1 text-xs sm:text-sm">
        {parts.map((part) => (
          <li key={part.label} className="flex items-center gap-2">
            <span className="h-3 w-3 shrink-0 rounded-sm" style={{ backgroundColor: part.color }} />
            <span className="min-w-0 flex-1">{part.label}</span>
            <span className="font-mono font-semibold">{part.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function DistributionSourceViz() {
  return (
    <SceneShell
      eyebrow="분배금 읽기"
      title="분배금이 어디서 왔는지와 벌었는지는 다른 질문입니다"
      description="막대 길이는 실제 비율입니다. 앞의 두 장면은 공시 숫자이고, 마지막 장면은 7절의 가정 사례입니다."
      ariaLabel="QYLD 분배금의 재원 분류와 NAV 사례의 총수익 계산"
      scenes={SCENES}
      render={(active) => {
        if (active === 0) {
          return <Stack title="QYLD 공시 · 주당" parts={[{ label: "분배금", value: "0.1767달러", share: 100, color: "#64748b" }]} />;
        }
        if (active === 1) {
          return (
            <Stack
              title="QYLD 공시 · 재원 추정"
              parts={[
                { label: "순투자소득", value: "0.0022달러", share: (0.0022 / 0.1767) * 100, color: "#16a34a" },
                { label: "자본환급 추정", value: "0.1745달러", share: (0.1745 / 0.1767) * 100, color: "#d97706" },
              ]}
            />
          );
        }
        return (
          <div className="space-y-3">
            <Stack title="처음 · 가정 사례" parts={[{ label: "NAV", value: "100", share: 100, color: "#64748b" }]} />
            <Stack
              title="나중 · 가정 사례"
              parts={[
                { label: "남은 NAV", value: "88", share: 88, color: "#64748b" },
                { label: "받은 분배금", value: "12", share: 12, color: "#2563eb" },
              ]}
            />
          </div>
        );
      }}
    />
  );
}
