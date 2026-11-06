import SceneShell from "./SceneShell";

/**
 * 본문 대응: #two-predictions — W_F(n)=n·max(F,n+3)의 추가 비용. n<F−3에서 F, n>F−3에서 2n+3.
 * 추가 비용 선은 n=F−3에서 F로부터 2F−3으로 뛴다. F=7: 7→11, 그 사이 v(4)=9 → 4시간(꺾인 점).
 * F=9: v=9인 n=4 < 6. F=12: v=12인 n=1 < 9.
 */
const X0 = 34;
const X1 = 344;
const Y0 = 196;
const Y1 = 10;
const NMAX = 10;
const YMAX = 24;
const sx = (n: number) => X0 + (n / NMAX) * (X1 - X0);
const sy = (y: number) => Y0 - (y / YMAX) * (Y0 - Y1);

const CASES = [
  { floor: 0, hours: 10 / 3, height: 29 / 3, pointLabel: "29/3에서 교차", labelY: 6, labelLeft: false },
  { floor: 7, hours: 4, height: 9, pointLabel: "수입 9는 7과 11 사이", labelY: 3.5, labelLeft: false },
  { floor: 9, hours: 4, height: 9, pointLabel: "수입 9 = 추가 비용 9", labelY: 6.6, labelLeft: true },
  { floor: 12, hours: 1, height: 12, pointLabel: "수입 12 = 추가 비용 12", labelY: 13.2, labelLeft: false },
] as const;

const SCENES = [
  { label: "하한 없음", summary: "10/3시간", note: "앞 절의 선입니다. 추가 비용 2n+3이 추가 수입 13−n과 만나는 10/3시간을 고릅니다." },
  { label: "최저시급 7", summary: "4시간 · 꺾인 점", note: "시급 7로 구할 수 있는 4시간까지 추가 비용은 7이고, 그 너머는 2n+3이어서 11부터 시작합니다. 4시간의 추가 수입 9는 왼쪽 7보다 크고 오른쪽 11보다 작습니다. 두 선이 만나지 않아도 여기서 멈춥니다." },
  { label: "최저시급 9", summary: "4시간 · 평평한 구간", note: "6시간까지 시급 9로 구할 수 있으므로 추가 비용은 9입니다. 6시간을 넘기면 2n+3이어서 15부터 시작합니다. 추가 수입 13−n이 9가 되는 4시간은 평평한 구간 안에 있습니다." },
  { label: "최저시급 12", summary: "1시간", note: "9시간까지 추가 비용이 12입니다. 추가 수입이 12로 내려오는 1시간에서 멈춥니다. 시급 하한이 높을수록 평평한 구간은 길어지지만 그 높이도 함께 올라갑니다." },
] as const;

export default function FloorKinkViz() {
  return (
    <SceneShell
      eyebrow="꺾인 추가 비용"
      title="최저시급은 추가 비용 선을 평평하게 만든 뒤 위로 끊어 놓습니다"
      description="가로는 노동시간, 세로는 달러입니다. 파란 선은 추가 수입 13−n, 주황 선은 임금 총액 n×max(F, n+3)에서 다시 계산한 추가 비용입니다. F는 최저시급입니다. 연속 시간 모형의 가정입니다(가정)."
      ariaLabel="최저시급별 추가 비용 선과 추가 수입 선, 선택되는 노동시간"
      scenes={SCENES}
      render={(active) => {
        const { floor, hours, height, pointLabel, labelY, labelLeft } = CASES[active];
        const kink = Math.max(floor - 3, 0);
        return (
          <svg viewBox="0 0 360 228" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <line x1={X0} x2={X1} y1={Y0} y2={Y0} stroke="#94a3b8" strokeWidth={1} />
            <line x1={X0} x2={X0} y1={Y1} y2={Y0} stroke="#94a3b8" strokeWidth={1} />
            {[0, 8, 16, 24].map((y) => (
              <text key={y} x={X0 - 6} y={sy(y) + 4} textAnchor="end" fontSize={11} fill="#64748b">{y}</text>
            ))}
            {[0, 2, 4, 6, 8, 10].map((n) => (
              <text key={n} x={sx(n)} y={Y0 + 15} textAnchor="middle" fontSize={11} fill="#64748b">{n}</text>
            ))}
            <text x={X1} y={Y0 + 30} textAnchor="end" fontSize={11} fill="#64748b">노동시간 n</text>
            <line x1={sx(0)} x2={sx(10)} y1={sy(13)} y2={sy(3)} stroke="#2563eb" strokeWidth={1.25} />
            <text x={sx(10)} y={sy(3) + 15} textAnchor="end" fontSize={11} fontWeight={700} fill="#2563eb">추가 수입 13−n</text>

            {floor > 0 && <line x1={sx(0)} x2={sx(kink)} y1={sy(floor)} y2={sy(floor)} stroke="#d97706" strokeWidth={1.25} />}
            {floor > 0 && <line x1={sx(kink)} x2={sx(kink)} y1={sy(floor)} y2={sy(2 * kink + 3)} stroke="#d97706" strokeWidth={1} strokeDasharray="2 3" />}
            <line x1={sx(kink)} x2={sx(NMAX)} y1={sy(2 * kink + 3)} y2={sy(2 * NMAX + 3)} stroke="#d97706" strokeWidth={1.25} />
            {floor > 0 && (
              <>
                <text x={sx(kink) + 6} y={sy(floor) + 14} fontSize={11} fontWeight={700} fill="#b45309">{floor}</text>
                <text x={sx(kink) + 6} y={sy(2 * kink + 3) + 4} fontSize={11} fontWeight={700} fill="#b45309">{2 * kink + 3}</text>
              </>
            )}
            <line x1={sx(hours)} x2={sx(hours)} y1={sy(height)} y2={Y0} stroke="#475569" strokeWidth={1} strokeDasharray="3 3" />
            <circle cx={sx(hours)} cy={sy(height)} r={4} fill="#2563eb" />
            <text x={sx(hours) + (labelLeft ? -6 : 6)} y={sy(labelY)} textAnchor={labelLeft ? "end" : "start"} fontSize={11} fontWeight={700} className="fill-foreground">{pointLabel}</text>
          </svg>
        );
      }}
    />
  );
}
