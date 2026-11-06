import { StableSceneStack } from "@/components/viz/StableSceneStack";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #mechanism 셋째 문단 — (가정) 외화 1의 값이 자국 돈 1 → 1.2.
 * 부채 30 → 36(+6). 같은 1.2를 곱하면 수출 100 → 120(+20), 부품값 60 → 72(+12), 잔액 40 → 48(+8).
 */
const RATE = 1.2;
const MAX = 120;
const ITEMS = [
  { key: "debt", name: "외화 부채", base: 30, color: "#dc2626" },
  { key: "export", name: "수출", base: 100, color: "#2563eb" },
  { key: "parts", name: "부품값", base: 60, color: "#2563eb" },
  { key: "net", name: "잔액", base: 40, color: "#2563eb" },
] as const;

const SCENES = [
  { label: "빚의 환산액", summary: "30 → 36, 6만큼 커짐", note: "외화 1을 사는 데 자국 돈 1이 들다가 1.2가 들면, 외화 빚은 그대로 30이어도 자국 돈으로 잰 크기는 36이 됩니다." },
  { label: "수출과 부품값도", summary: "100 → 120, 60 → 72", note: "외화 금액 100과 60은 그대로 두고 같은 1.2를 곱했습니다(가정). 빼고 남는 잔액은 40에서 48이 됩니다." },
  { label: "같은 회사라면", summary: "(가정) 한 장부 안에서 만남", note: "수출과 빚이 한 회사에 있다고 가정한 경우입니다. 다만 +8은 한 해의 값, +6은 한 시점의 빚이라 빼서 순효과로 부를 수 없습니다." },
  { label: "다른 회사라면", summary: "(가정) 다른 장부에 따로 남음", note: "수출한 회사와 빚진 회사가 다른 경우입니다(가정). 어떤 회사가 수출하고 어떤 회사가 빚을 졌는지 모르면 국가 합계로 순효과를 확정할 수 없습니다." },
] as const;

function Row({ item, on }: { item: (typeof ITEMS)[number]; on: boolean }) {
  const after = Math.round(item.base * RATE);
  return (
    <div className={`grid grid-cols-[3.75rem_minmax(0,1fr)_4.75rem] items-center gap-2 text-xs transition-opacity duration-300 motion-reduce:transition-none sm:text-sm ${on ? "opacity-100" : "opacity-20"}`}>
      <span className="font-semibold">{item.name}</span>
      <div className="flex h-4 min-w-0 rounded-sm bg-muted/40">
        <div className="h-full" style={{ width: `${(item.base / MAX) * 100}%`, backgroundColor: "#94a3b8" }} />
        <div className="h-full" style={{ width: `${((after - item.base) / MAX) * 100}%`, backgroundColor: item.color }} />
      </div>
      <span className="text-right font-mono">{item.base} → {after}</span>
    </div>
  );
}

function Book({ title, lines }: { title: string; lines: readonly { text: string; color: string }[] }) {
  return (
    <div className="min-w-0 rounded-lg border border-border bg-background px-3 py-2 text-xs leading-5 sm:text-sm">
      <p className="font-bold">{title}</p>
      {lines.map((line) => <p key={line.text} className="font-mono" style={{ color: line.color }}>{line.text}</p>)}
    </div>
  );
}

const NET_LINE = { text: "잔액 +8", color: "#2563eb" };
const DEBT_LINE = { text: "빚 +6", color: "#dc2626" };

export default function FxRevaluationViz() {
  return (
    <SceneShell
      eyebrow="환율과 환산액"
      title="외화값이 1에서 1.2가 되면 빚도 수출도 부품값도 환산액이 함께 커집니다"
      description="(가정) 외화 1의 값이 자국 돈 1에서 1.2로 바뀐 경우입니다. 회색은 1일 때 환산액, 색칠한 부분이 늘어난 몫입니다. 수출·부품값도 같은 1.2로 환산했습니다."
      ariaLabel="환율 변화에 따른 부채, 수출, 부품값, 잔액의 자국 돈 환산액과 회사별 장부"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0">
          <div className="space-y-2">
            {ITEMS.map((item) => <Row key={item.key} item={item} on={active === 0 ? item.key === "debt" : active === 1 || item.key === "debt" || item.key === "net"} />)}
          </div>
          <StableSceneStack
            active={active}
            className="mt-4"
            scenes={[
              <div key="a" className="grid min-h-[4.5rem] grid-cols-2 gap-2" />,
              <div key="b" className="grid min-h-[4.5rem] grid-cols-2 gap-2" />,
              <div key="c"><Book title="한 회사의 장부" lines={[NET_LINE, DEBT_LINE]} /></div>,
              <div key="d" className="grid grid-cols-2 gap-2">
                <Book title="수출한 회사" lines={[NET_LINE]} />
                <Book title="빚진 회사" lines={[DEBT_LINE]} />
              </div>,
            ]}
          />
        </div>
      )}
    />
  );
}
