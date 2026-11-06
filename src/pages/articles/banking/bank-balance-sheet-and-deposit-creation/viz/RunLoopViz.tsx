import SceneShell from "./SceneShell";

/**
 * 본문 대응: #bank-run(불안이 커지는 고리)·#safety-net(보험과 유동성 대출이 닿는 자리).
 * 16절 숫자: 급매 손실 4로 자본 8→4. 대출 6으로 급매 없이 준비금 확보.
 */
const NODES = ["인출 요구가 늘어남", "준비금이 모자라면 급매가 필요할 수 있음", "손실로 자본이 줄어듦 (16절: 8 → 4)", "회수를 걱정해 먼저 찾을 유인이 생길 수 있음"];

const SCENES = [
  { label: "불안이 스스로 커지는 고리", summary: "16절의 경로", on: [0, 1, 2, 3], tag: "", left: "", note: "다른 사람의 인출이 내 회수 가능성에 영향을 주면 이런 경로가 생길 수 있습니다. 실제 부실 우려와 함께 작동할 수 있으며, 모든 뱅크런을 멀쩡한 은행에 대한 오해로 설명하지는 않습니다." },
  { label: "예금보험이 닿는 자리", summary: "먼저 찾을 걱정을 덜 수 있음", on: [3], tag: "보험", left: "남는 것: 한도 밖 금액, 지급까지 돈을 쓰지 못할 우려", note: "예금보험은 정해진 대상과 한도에서 은행이 갚지 못한 예금의 보호를 약속합니다. 그 약속을 신뢰하는 고객의 걱정을 덜 수 있지만 모든 인출 유인이 없어지는 장치는 아닙니다." },
  { label: "유동성 대출이 닿는 자리", summary: "급매 대신 준비금 6을 빌리는 선택", on: [1], tag: "대출", left: "남는 것: 담보 평가·금리·이용 자격 (장부가 10이면 반드시 10을 빌리는 것은 아님)", note: "최종대부자는 시장에서 자금을 구하기 어려울 때 중앙은행이 조건에 따라 유동성을 공급하는 역할입니다. 요건을 갖춘 A은행이라면 준비금 6을 빌리는 선택을 생각할 수 있습니다." },
  { label: "유동성 대출이 지우지 못하는 칸", summary: "이미 난 손실", on: [2], tag: "손실", left: "다른 조치: 손실 배분·증자·정리 등이 필요할 수 있음", node2: "이미 발생한 대출 손실로 자본이 줄어듦", note: "빌려서 급매를 피하면 급매 손실 4는 막을 수 있어도, 유동성을 빌린 것만으로 이미 발생한 대출 손실을 없애지는 못합니다. 위기 중에는 회수 가치가 불확실해 유동성 부족과 지급 능력 부족을 실시간으로 구분하기 어렵다는 점도 남습니다." },
] as const;

function Node({ index, on, tag, text, mark }: { index: number; on: boolean; tag: string; text?: string; mark?: string }) {
  return (
    <div className={`flex min-h-[6.5rem] flex-col justify-between rounded-lg border px-2 py-2 text-xs leading-5 sm:text-sm sm:leading-6 ${on ? "border-primary bg-primary/5 font-semibold" : "border-border/50 text-muted-foreground/70"}`}>
      <span>{text ?? NODES[index]}</span>
      {on && tag && <span className="mt-1 self-start rounded border border-primary px-1.5 text-[11px] font-bold leading-5 text-primary">{tag}이 닿음</span>}
      {on && mark && <span className="mt-1 self-start rounded border border-dashed border-primary px-1.5 text-[11px] font-bold leading-5 text-primary">{mark}</span>}
    </div>
  );
}

const Arrow = ({ mark }: { mark: string }) => <span aria-hidden="true" className="flex items-center justify-center text-base text-muted-foreground">{mark}</span>;

export default function RunLoopViz() {
  return (
    <SceneShell
      eyebrow="고리와 안전망"
      title="보험과 유동성 대출은 불안의 고리에서 서로 다른 자리에 닿습니다"
      description="칸과 화살표는 수량이 아니라 16·17절이 설명한 인과 경로입니다. 각 화살표는 반드시 일어나는 일이 아니라 일어날 수 있는 일입니다."
      ariaLabel="인출, 급매, 손실, 걱정의 고리와 안전망이 닿는 자리"
      scenes={SCENES}
      render={(active) => {
        const s = SCENES[active];
        const on = (i: number) => (s.on as readonly number[]).includes(i);
        const tag = s.tag === "손실" ? "" : s.tag;
        return (
          <div className="min-w-0">
            <div className="grid grid-cols-[minmax(0,1fr)_1.25rem_minmax(0,1fr)] gap-y-1">
              <Node index={0} on={on(0)} tag={tag} />
              <Arrow mark="→" />
              <Node index={1} on={on(1)} tag={tag} />
              <Arrow mark="↑" />
              <span />
              <Arrow mark="↓" />
              <Node index={3} on={on(3)} tag={tag} />
              <Arrow mark="←" />
              <Node index={2} on={on(2)} tag={tag} text={"node2" in s ? s.node2 : undefined} mark={s.tag === "손실" ? "대출로 못 지움" : undefined} />
            </div>
            <p className="mt-3 min-h-[2.75rem] text-xs leading-5 text-muted-foreground">{s.left}</p>
          </div>
        );
      }}
    />
  );
}
