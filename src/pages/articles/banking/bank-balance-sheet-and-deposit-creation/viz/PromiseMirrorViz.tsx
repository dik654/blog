import SceneShell from "./SceneShell";

/**
 * 본문 대응: #why-two-records — 대출 10의 두 기록이 은행과 공장 장부에 반대 방향으로 적힌다.
 * 각 장부 +10 − 10 = 0이므로 그 순간 순재산은 늘지 않는다.
 */
const SCENES = [
  { label: "A은행의 두 줄", summary: "받을 권리 +10 · 지급 의무 +10", note: "대출 직후 A은행이 가진 것은 공장에 10을 돌려 달라고 할 권리입니다. 새로 해야 할 일은 공장이 통장 잔액 10의 지급을 요구할 때 응하는 것입니다." },
  { label: "공장의 두 줄", summary: "통장 잔액 +10 · 갚을 원금 +10", note: "공장도 같은 약속의 반대편에 있습니다. 은행에 10의 지급을 요구할 수 있고, 은행에는 정한 때에 10을 갚아야 합니다." },
  { label: "한 줄씩 짝이 맞습니다", summary: "같은 약속 두 개", note: "A은행의 받을 권리는 공장의 갚을 원금과 같은 약속이고, A은행의 지급 의무는 공장의 통장 잔액과 같은 약속입니다. 화살표는 돈이 움직일 방향이며, 아직 움직인 돈은 없습니다." },
  { label: "그 순간 순재산은 그대로", summary: "+10 − 10 = 0", note: "순재산은 가진 것에서 갚을 것을 뺀 값입니다. 두 기록이 함께 생기므로 그 순간 은행도 공장도 10씩 늘지 않습니다. 기계로 이익을 얻을지는 이후 사업의 결과입니다." },
] as const;

function Slot({ title, value, on }: { title: string; value: string; on: boolean }) {
  return (
    <div className={`rounded-lg border px-2 py-2 text-center ${on ? "border-primary bg-primary/5" : "border-border/50 opacity-50"}`}>
      <p className="text-xs leading-5 text-muted-foreground">{title}</p>
      <p className="font-mono text-base font-bold">{value}</p>
    </div>
  );
}

function Link({ text, arrow, on }: { text: string; arrow: string; on: boolean }) {
  return (
    <div className={`flex flex-col items-center justify-center text-center ${on ? "text-primary" : "text-muted-foreground/40"}`}>
      <span aria-hidden="true" className="text-lg leading-5">{arrow}</span>
      <span className="text-[11px] font-semibold leading-4">{text}</span>
    </div>
  );
}

export default function PromiseMirrorViz() {
  return (
    <SceneShell
      eyebrow="양쪽 장부"
      title="대출 한 건은 은행과 공장 장부에 반대 방향으로 두 줄씩 적힙니다"
      description="단위는 억 원입니다. 공장이 A은행에서 10을 빌린 직후만 봅니다."
      ariaLabel="대출 10이 은행과 공장 장부에 만드는 두 약속"
      scenes={SCENES}
      render={(active) => (
        <div className="grid grid-cols-[minmax(0,1fr)_3.5rem_minmax(0,1fr)] gap-x-1 gap-y-2 sm:gap-x-3">
          <p className="text-center text-sm font-bold">A은행 장부</p>
          <span />
          <p className="text-center text-sm font-bold">공장 장부</p>

          <Slot title="받을 권리" value="+10" on={active === 0 || active === 2} />
          <Link text="나중에 갚음" arrow="←" on={active === 2} />
          <Slot title="갚을 원금" value="+10" on={active === 1 || active === 2} />

          <Slot title="지급 의무" value="+10" on={active === 0 || active === 2} />
          <Link text="요구하면 지급" arrow="→" on={active === 2} />
          <Slot title="통장 잔액" value="+10" on={active === 1 || active === 2} />

          <Slot title="순재산 변화" value="0" on={active === 3} />
          <span />
          <Slot title="순재산 변화" value="0" on={active === 3} />
        </div>
      )}
    />
  );
}
