import SceneShell from "./SceneShell";

/**
 * 본문 대응: #scope — 사고에서 이어지는 손해의 사슬과 끊는 두 기준.
 * 사슬 다섯 고리와 미끄러짐 예는 본문과 판정 절차 4단계의 note에서 그대로 가져왔다.
 * 예견 범위가 사슬의 어디서 끝나는지는 본문이 정하지 않으므로 그림의 끊는 자리는 가정이다.
 */
const CHAIN = ["사고", "다쳐 일을 못 함", "계약을 어김", "거래처가 손해를 봄", "거래처 직원이 일자리를 잃음"] as const;
const CUT_AFTER = 2;

const SCENES = [
  {
    label: "끊지 않으면 사슬이 이어집니다",
    summary: "이어진 손해 네 고리 모두 그 사고에서 시작",
    note: "고리 하나하나가 앞 고리 때문에 생겼으므로 전부 그 사고에서 시작된 것은 맞습니다. 그래서 어디서 끊을지를 따로 정하지 않으면 사슬이 끝없이 이어집니다.",
  },
  {
    label: "기준 1 · 막으려던 종류의 위험인가",
    summary: "같은 사슬이어도 겨냥 밖이면 걸림",
    note: "미끄러짐을 막으려던 조치를 빠뜨렸다면 그 조치가 겨냥한 위험은 미끄러짐입니다. 그 때문에 늦게 출발해 다른 사고를 당한 손해는 같은 사슬에 있어도 그 조치가 막으려던 위험이 아닙니다.",
  },
  {
    label: "기준 2 · 예견할 수 있었던 범위인가",
    summary: "넘어가는 지점에서 끊음",
    note: "이어진 손해를 차례로 보며 예견할 수 있었던 범위를 넘어가는 지점에서 끊습니다. 그 지점이 사슬의 어디인지는 사안마다 다르며, 그림에서 둘째 손해(계약을 어김) 뒤에 둔 것은 가정입니다.",
  },
  {
    label: "왜 예견 범위에서 끊는가",
    summary: "예방 계산에 넣을 수 있었던 손해만",
    note: "예견할 수 있었던 손해는 부품 2의 계산에서 사고가 나면 잃는 값으로 미리 넣고 조심할 수 있습니다. 예견할 수 없었던 손해까지 물리면 계산에 넣을 수 없었던 것을 부담하게 되어 조심하는 것과 무는 것의 연결이 끊어집니다. 그때부터 책임은 유인 장치가 아니라 복권이 됩니다.",
  },
] as const;

function Link({ text, state }: { text: string; state: "origin" | "on" | "cut" | "dim" }) {
  const cls =
    state === "origin"
      ? "border-slate-500 font-bold text-foreground"
      : state === "on"
      ? "border-emerald-600 bg-emerald-600/10 text-foreground"
      : state === "cut"
        ? "border-dashed border-red-600 text-red-700 line-through decoration-1 dark:text-red-400"
        : "border-border text-muted-foreground";
  return <div className={`rounded-lg border px-3 py-2 text-sm leading-6 ${cls}`}>{text}</div>;
}

function Chain({ cut }: { cut: boolean }) {
  return (
    <ol className="grid gap-1.5 sm:grid-cols-5 sm:gap-2">
      {CHAIN.map((text, i) => (
        <li key={text} className="grid gap-1.5 sm:block">
          <Link text={text} state={i === 0 ? "origin" : !cut ? "on" : i <= CUT_AFTER ? "on" : "cut"} />
          {cut && i === CUT_AFTER && (
            <p className="text-xs font-bold text-red-700 sm:mt-1.5 dark:text-red-400">✂ 여기서 끊음 (자리는 가정)</p>
          )}
        </li>
      ))}
    </ol>
  );
}

export default function CausalChainCutViz() {
  return (
    <SceneShell
      eyebrow="손해의 범위"
      title="사고에서 이어진 손해를 두 기준으로 끊습니다"
      description="첫 칸(회색 테두리)은 사고 자체이고, 그 뒤 칸 하나가 사고에서 이어진 손해 한 고리입니다. 초록은 그 사고의 손해로 남는 고리, 빨간 점선은 끊긴 고리입니다."
      note="어느 고리가 예견 범위 안에 드는지는 본문이 정하지 않았습니다. 끊는 자리는 두 기준의 작동을 보이려는 가정입니다."
      ariaLabel="사고에서 이어지는 손해의 사슬과 위험 종류·예견 가능성 두 기준으로 끊는 과정"
      scenes={SCENES}
      render={(active) => {
        if (active === 0) {
          return (
            <div className="space-y-2">
              <Chain cut={false} />
              <p className="text-xs text-muted-foreground">→ 그 뒤로도 계속 …</p>
            </div>
          );
        }
        if (active === 1) {
          return (
            <div className="grid gap-2">
              <div className="rounded-lg border border-border px-3 py-2 text-sm leading-6">
                <span className="font-bold">빠뜨린 조치</span> · 미끄러짐을 막으려던 조치
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                <div className="rounded-lg border border-emerald-600 bg-emerald-600/10 px-3 py-2 text-sm leading-6">
                  <p className="font-bold text-emerald-700 dark:text-emerald-400">미끄러짐으로 생긴 손해</p>
                  <p className="text-muted-foreground">그 조치가 겨냥한 위험</p>
                </div>
                <div className="rounded-lg border border-dashed border-red-600 px-3 py-2 text-sm leading-6">
                  <p className="font-bold text-red-700 dark:text-red-400">늦게 출발해 당한 다른 사고</p>
                  <p className="text-muted-foreground">같은 사슬이지만 겨냥한 위험이 아님 → 기준 1에 걸림</p>
                </div>
              </div>
            </div>
          );
        }
        if (active === 2) {
          return <Chain cut />;
        }
        return (
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="rounded-lg border border-emerald-600 bg-emerald-600/10 px-3 py-2 text-sm leading-6">
              <p className="font-bold text-emerald-700 dark:text-emerald-400">예견할 수 있었던 손해</p>
              <p>→ 사고가 나면 잃는 값(L)에 미리 넣음</p>
              <p>→ B &lt; P·L 비교로 조치를 정함</p>
              <p className="font-bold">조심하는 것과 무는 것이 이어짐</p>
            </div>
            <div className="rounded-lg border border-dashed border-red-600 px-3 py-2 text-sm leading-6">
              <p className="font-bold text-red-700 dark:text-red-400">예견할 수 없었던 손해</p>
              <p>→ 계산에 넣을 수 없었음</p>
              <p>→ 물리면 계산에 없던 것까지 부담</p>
              <p className="font-bold">책임이 유인 장치가 아니라 복권</p>
            </div>
          </div>
        );
      }}
    />
  );
}
