import SceneShell from "./SceneShell";

/**
 * 본문 대응: #comparison(#case, #mechanism 포함) — 복구 견적 600만 원이 공제액이 되기까지의 분기.
 * 숫자는 3절 (가정)과 같습니다. 3천만 − 400만 = 2천600만, 공제가 확정되면 2천만.
 * 대법원 2002다52657은 특정 사실관계의 판단이므로 금액을 계산해 적지 않습니다.
 */
const GATES = [
  { ask: "공제하기로 유효하게 합의했나?", no: "아니오 · 단지 견적", out: "공제 가능성과 실제 정산액부터 확인" },
  { ask: "같은 복구비를 점주가 따로 내지 않았나?", no: "이미 업체에 직접 지급", out: "다시 뺄 수 없음: 2천600만 원 반환, 순유입 2천만 원" },
  { ask: "복구할 의사 없이 시설을 그대로 이용해 다시 임대하는 사실관계가 아닌가?", no: "그런 사실관계", out: "2002다52657이 공제를 부정한 사례: 실제 합의와 시설 사용부터 확인" },
] as const;

const SCENES = [
  { label: "출발", summary: "3천만 − 400만 = 2천600만 원", note: "확정된 미납 월세까지 뺀 금액입니다. 남은 질문은 복구 견적 600만 원을 여기서 더 뺄 수 있느냐입니다." },
  { label: "견적뿐일 때", summary: "아직 공제액이 아닙니다", note: "철거업체의 견적은 합의와 다른 단계의 증거입니다. 합의되지 않은 견적을 확정 채무로 적지 않습니다." },
  { label: "이미 직접 냈을 때", summary: "반환 2천600만 · 순유입 2천만", note: "점주가 업체에 600만 원을 내고 약정한 복구를 마쳤다면 같은 비용을 보증금에서 또 빼지 못합니다." },
  { label: "복구 의사가 없을 때", summary: "특정 사실관계의 판단", note: "이 판결은 그런 사실관계에서 공제를 부정했으므로 모든 복구 의무가 없어진다는 결론으로 넓히지 않습니다. 한국 판결이라 다른 관할에 그대로 옮기지도 않습니다." },
  { label: "세 질문을 지나면", summary: "3천만 − 400만 − 600만 = 2천만 원", note: "조건이 맞으면 3절의 조건부 반환액 2천만 원이 됩니다. 고객 환불·임금·세금·대출을 넣지 않았으므로 폐업 뒤 최종 잔액은 아닙니다." },
] as const;

export default function DeductionBranchViz() {
  return (
    <SceneShell
      eyebrow="600만 원의 갈림길"
      title="복구 견적 600만 원은 언제 공제액이 될까요"
      description="위에서 아래로 내려오는 줄이 공제로 이어지는 길입니다. 옆이나 아래의 점선 칸으로 빠지면 공제액 600만 원·반환액 2천만 원 경로에 도달하지 못합니다."
      note="금액은 모두 (가정)입니다. 이 글에 나온 질문을 한 줄로 모은 그림이며 법원의 판단 순서나 개별 사건의 결론이 아닙니다."
      ariaLabel="견적, 직접 지급, 복구 의사 없는 재임대를 차례로 거른 뒤 600만 원 공제에 이르는 분기"
      scenes={SCENES}
      render={(active) => (
        <div className="mx-auto w-full max-w-[640px] text-sm">
          <div className="rounded border border-border bg-background px-3 py-2 font-semibold">복구 견적 600만 원</div>
          <ol className="m-0 list-none p-0">
            {GATES.map((gate, index) => {
              const exit = active === index + 1;
              const passed = active === 4 || active > index + 1;
              return (
                <li key={gate.ask} className="m-0 p-0">
                  <span className={`ml-5 block h-4 w-0 border-l ${passed || exit ? "border-primary" : "border-dashed border-muted-foreground/50"}`} />
                  <div className="grid gap-x-3 gap-y-1 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
                    <div className={`rounded border px-3 py-2 ${exit ? "border-primary bg-primary/10 font-semibold" : passed ? "border-primary" : "border-border"}`}>
                      <span className="font-mono text-xs text-muted-foreground">{index + 1}</span> {gate.ask}
                    </div>
                    <div className={`rounded border border-dashed px-3 py-2 leading-5 ${exit ? "border-red-600 text-red-700 dark:text-red-400" : "border-border/70 text-muted-foreground/70"}`}>
                      <span className="font-semibold">→ {gate.no}</span>
                      <span className="block text-xs leading-5">{gate.out}</span>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
          <span className={`ml-5 block h-4 w-0 border-l ${active === 4 ? "border-primary" : "border-dashed border-muted-foreground/50"}`} />
          <div className={`rounded border px-3 py-2 font-semibold ${active === 4 ? "border-primary bg-primary/15 text-primary" : "border-dashed border-border/70 text-muted-foreground/70"}`}>
            공제 확정 → 반환액 2천만 원
          </div>
        </div>
      )}
    />
  );
}
