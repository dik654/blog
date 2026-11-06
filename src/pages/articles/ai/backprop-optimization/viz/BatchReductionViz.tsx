import SceneShell from "./SceneShell";

/**
 * 본문 대응: #tensor-backward — 같은 자료를 복제했을 때 합과 평균 loss.
 * 합: G 두 행 (2/3,−2/3), dW·db 2배, dX 행마다 (0.462098,0).
 * 평균: G 두 행 (1/3,−1/3), dW·db는 원래 값, dX 행마다 (1/3)ln2≈0.231049.
 */
interface Block {
  name: string;
  rows: readonly (readonly string[])[];
}

const STATES: readonly (readonly Block[])[] = [
  [
    { name: "G", rows: [["2/3", "−2/3"]] },
    { name: "dW", rows: [["2/3", "−2/3"], ["4/3", "−4/3"]] },
    { name: "db", rows: [["2/3", "−2/3"]] },
    { name: "dX", rows: [["0.462098", "0"]] },
  ],
  [
    { name: "G", rows: [["2/3", "−2/3"], ["2/3", "−2/3"]] },
    { name: "dW · 2배", rows: [["4/3", "−4/3"], ["8/3", "−8/3"]] },
    { name: "db · 2배", rows: [["4/3", "−4/3"]] },
    { name: "dX · 행마다 그대로", rows: [["0.462098", "0"], ["0.462098", "0"]] },
  ],
  [
    { name: "G · 행마다 1/2", rows: [["1/3", "−1/3"], ["1/3", "−1/3"]] },
    { name: "dW · 원래 값", rows: [["2/3", "−2/3"], ["4/3", "−4/3"]] },
    { name: "db · 원래 값", rows: [["2/3", "−2/3"]] },
    { name: "dX · 행마다 1/2", rows: [["0.231049", "0"], ["0.231049", "0"]] },
  ],
];

const SCENES = [
  { label: "자료 하나", summary: "지금까지의 값", note: "8절에서 구한 네 배열입니다. 자료가 하나라서 G와 dX는 행이 하나입니다." },
  { label: "복제 두 개 · 합 loss", summary: "dW·db 2배", note: "두 행의 기여를 합치는 dW와 db는 2배가 됩니다. dX는 합치지 않고 자료 행마다 남으므로 한 행의 값은 그대로입니다." },
  { label: "복제 두 개 · 평균 loss", summary: "dW·db 원래 값 · dX 행마다 1/2", note: "G의 각 행이 1/2이고 두 행을 합해 dW·db는 원래 값으로 돌아옵니다. dX는 합쳐지지 않으므로 행마다 1/2배로 남습니다. 평균이 parameter와 input에 다르게 보이는 이유입니다." },
];

function BlockView({ block }: { block: Block }) {
  return (
    <div className="min-w-0">
      <p className="text-xs font-bold">{block.name}</p>
      <div className="mt-1 min-h-[3.75rem] space-y-1">
        {block.rows.map((row, rowIndex) => (
          <div key={rowIndex} className="grid grid-cols-2 gap-1">
            {row.map((value, colIndex) => (
              <span key={colIndex} className="flex h-7 min-w-0 items-center justify-center rounded-sm border font-mono text-[11px]" style={{ borderColor: "#94a3b8" }}>
                {value}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function BatchReductionViz() {
  return (
    <SceneShell
      eyebrow="합과 평균"
      title="같은 자료를 복제하면 합치는 배열과 행으로 남는 배열이 다르게 변합니다"
      description="같은 자료 (1, 2)를 두 번 넣은 경우입니다. G와 dX는 자료마다 행이 하나씩 있고, dW와 db는 자료 축을 합친 배열입니다. dW의 두 행은 자료가 아니라 입력 1과 입력 2입니다."
      ariaLabel="자료 복제 시 합 loss와 평균 loss에서 G, dW, db, dX의 값"
      scenes={SCENES}
      render={(active) => (
        <div className="grid min-w-0 grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-4">
          {STATES[active].map((block, index) => (
            <BlockView key={index} block={block} />
          ))}
        </div>
      )}
    />
  );
}
