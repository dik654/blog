import SceneShell from "./SceneShell";

/**
 * 본문 대응: #parliamentary AlgorithmBlock — 단독 과반이 없을 때 연합 후보를 거르는 절차.
 * 140·140·20으로 가능한 묶음 7개를 놓고 단계별 생존 수를 센다: 7 → 4 → 2 → 2.
 * 거부 선언 조합(가당·나당 상호 거부)만 이 그림의 가정이다.
 */
const SCENES = [
  { label: "단독 과반 확인", summary: "한 당으로는 151에 미달", note: "가당 140, 나당 140, 다당 20 모두 151에 못 미칩니다. 단독 과반이 있었다면 여기서 끝나고, 행정부와 의회 과반이 같은 쪽이라 거부권자가 하나로 줄어듭니다." },
  { label: "정족수를 넘는 연합", summary: "묶음 7개 → 후보 4개", note: "실선 칩은 그 연합에서 빠지면 과반이 깨지는 당입니다. 세 당 연합에서는 누가 빠져도 과반이 남아 모두 점선입니다. 이 표시가 다음 절의 형식적 투표력 계산이 됩니다." },
  { label: "거부한 조합 지우기", summary: "후보 4개 → 2개 (가정)", note: "가당과 나당이 서로 거부한다고 가정한 경우입니다. 숫자상 280석이어도 정치적으로 불가능한 조합이 지워지고, 두 당이 함께 든 세 당 연합도 같이 빠집니다." },
  { label: "불필요한 참가자 확인", summary: "남은 2개에 불필요한 당 없음", note: "가+다에서 가당이 빠지면 20, 다당이 빠지면 140으로 151에 못 미칩니다. 나+다도 같습니다. 세 당 연합은 거부가 없었어도 160·160·280이 남아 우선 후보에서 밀렸을 조합입니다. 다만 표결 이탈에 대비해 여유를 두는 선택도 흔합니다." },
  { label: "협상과 신임 투표", summary: "후보 연합 하나씩 160 ≥ 151", note: "정책 합의와 자리 배분을 협상해 신임 투표에 부칩니다. 가결되면 정부가 서고, 부결이 이어지면 소수정부로 가거나 의회를 해산합니다. 표결에 필요한 당이라는 사실이 장관 자리나 양보의 하한을 직접 정하지는 않습니다." },
] as const;

const COLOR: Record<string, string> = { 가: "#4f46e5", 나: "#d97706", 다: "#059669" };

const ROWS: readonly { parties: readonly string[]; seats: number }[] = [
  { parties: ["가"], seats: 140 },
  { parties: ["나"], seats: 140 },
  { parties: ["다"], seats: 20 },
  { parties: ["가", "나"], seats: 280 },
  { parties: ["가", "다"], seats: 160 },
  { parties: ["나", "다"], seats: 160 },
  { parties: ["가", "나", "다"], seats: 300 },
];

const PARTY_COUNT_ALL = 3;

function rowStatus(index: number, active: number): { text: string; out: boolean } {
  if (index < 3) return { text: "미달", out: true };
  if (active === 0) return { text: "", out: false };
  const vetoed = index === 3 || index === 6;
  if (active === 1) return { text: "통과", out: false };
  if (vetoed) return { text: "거부로 삭제", out: true };
  if (active === 2) return { text: "남음", out: false };
  return active === 3 ? { text: "불필요한 당 없음", out: false } : { text: "신임 투표", out: false };
}

export default function CoalitionFilterViz() {
  return (
    <SceneShell
      eyebrow="연립 후보 거르기"
      title="가능한 묶음 7개가 신임 투표 후보로 줄어드는 과정"
      description="가상 의회 140·140·20석, 정족수 151석입니다. 막대는 연합의 의석 합이고 붉은 선이 151석입니다."
      note="가당·나당의 상호 거부는 절차를 보여 주려는 가정이며, 다른 조합을 거부하면 남는 후보도 달라집니다."
      ariaLabel="세 정당의 묶음 일곱 개가 정족수, 거부 선언, 불필요한 참가자 기준을 거쳐 후보 두 개로 줄어드는 표"
      scenes={SCENES}
      render={(active) => (
        <div className="space-y-1.5">
          {ROWS.map((row, index) => {
            const status = rowStatus(index, active);
            const critical = active >= 1 && row.parties.length < PARTY_COUNT_ALL && index >= 3;
            return (
              <div
                key={row.parties.join("+")}
                className={`grid grid-cols-[4.75rem_minmax(0,1fr)_1.75rem_4.75rem] items-center gap-1.5 transition-opacity duration-300 motion-reduce:transition-none sm:grid-cols-[6rem_minmax(0,1fr)_2rem_6rem] ${status.out ? "opacity-45" : ""}`}
              >
                <div className="flex gap-1">
                  {row.parties.map((party) => (
                    <span
                      key={party}
                      className={`inline-flex h-6 w-6 items-center justify-center rounded border text-xs font-bold ${critical ? "" : index >= 3 && active >= 1 ? "border-dashed" : ""}`}
                      style={{ borderColor: index < 3 && active >= 1 ? "transparent" : COLOR[party], color: COLOR[party] }}
                    >
                      {party}
                    </span>
                  ))}
                </div>
                <div className="relative h-4 min-w-0 rounded-sm bg-muted/40">
                  <div className="h-full rounded-sm" style={{ width: `${(row.seats / 300) * 100}%`, backgroundColor: "#64748b66" }} />
                  <div className="absolute -inset-y-0.5 w-px" style={{ left: `${(151 / 300) * 100}%`, backgroundColor: "#dc2626" }} />
                </div>
                <span className="text-right font-mono text-xs">{row.seats}</span>
                <span className={`text-xs leading-4 ${status.out ? "text-muted-foreground" : "font-semibold"}`}>{status.text}</span>
              </div>
            );
          })}
        </div>
      )}
    />
  );
}
