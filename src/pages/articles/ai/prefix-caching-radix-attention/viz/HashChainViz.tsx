import SceneShell from "./SceneShell";

/**
 * 본문 대응: #block-hash — block 키는 앞 block의 hash, 현재 token, 추가 키를 함께 hash한다.
 * 같은 네 자리여도 앞 문맥의 키가 다르면 다른 키다. 키 이름 A·B·C…는 설명용 기호다.
 */
interface Block {
  parent: string;
  tokens: string;
  extra?: boolean;
  key: string;
  verdict: "base" | "same" | "diff";
}
interface Chain {
  name: string;
  extra?: string;
  blocks: readonly [Block, Block];
}

const R1: Chain = {
  name: "R1",
  blocks: [
    { parent: "시작", tokens: "1,2,3,4", key: "A", verdict: "base" },
    { parent: "A", tokens: "5,6,7,8", key: "B", verdict: "base" },
  ],
};
const SUBJECTS: readonly Chain[] = [
  {
    name: "R2",
    blocks: [
      { parent: "시작", tokens: "1,2,3,4", key: "A", verdict: "same" },
      { parent: "A", tokens: "5,6,9,10", key: "C", verdict: "diff" },
    ],
  },
  {
    name: "첫 번호만 다른 입력",
    blocks: [
      { parent: "시작", tokens: "0,2,3,4", key: "D", verdict: "diff" },
      { parent: "D", tokens: "5,6,7,8", key: "E", verdict: "diff" },
    ],
  },
  {
    name: "번호는 R1과 같고 추가 키가 다름",
    extra: "추가 키 있음",
    blocks: [
      { parent: "시작", tokens: "1,2,3,4", extra: true, key: "F", verdict: "diff" },
      { parent: "F", tokens: "5,6,7,8", key: "G", verdict: "diff" },
    ],
  },
];

const SCENES = [
  { label: "앞 키가 뒤 키로 들어감", summary: "R2: 첫 block만 같은 키", note: "첫 block은 R1과 재료가 같아 키 A가 나옵니다. 둘째 block은 앞 키가 A로 같아도 token이 달라 다른 키가 됩니다. 그래서 R2는 4를 hit합니다." },
  { label: "같은 네 자리, 다른 문맥", summary: "5,6,7,8이 같아도 B ≠ E", note: "3절의 [0,2,3,4,5,6,7,8]을 넣으면 둘째 block의 네 자리는 R1과 똑같습니다. 앞 키가 A가 아니라 D이므로 같은 키가 아닙니다." },
  { label: "추가 조건이 섞이면", summary: "번호가 같아도 다른 키", note: "extra_keys도 함께 hash합니다. LoRA·멀티모달·salt 같은 값이 실제로 어떻게 들어가는지는 호출 경로에서 확인해야 하므로 이 줄은 키가 갈리는 경우만 가정해 보였습니다." },
];

const KEY_CLASS = {
  base: "border-border",
  same: "border-[#16a34a] text-[#15803d] dark:text-[#86efac]",
  diff: "border-[#dc2626] text-[#b91c1c] dark:text-[#fca5a5]",
} as const;

function ChainRow({ chain }: { chain: Chain }) {
  return (
    <div>
      <p className="text-xs font-bold">
        {chain.name}
        {chain.extra && <span className="ml-2 font-normal text-muted-foreground">({chain.extra})</span>}
      </p>
      <div className="mt-1 grid grid-cols-2 gap-2">
        {chain.blocks.map((block) => (
          <div key={block.key} className="min-w-0 rounded-lg border border-border p-2 font-mono text-xs leading-5">
            <p className="text-muted-foreground">앞 키 <b className="text-foreground">{block.parent}</b></p>
            <p className="text-muted-foreground">+ <b className="text-foreground">[{block.tokens}]</b></p>
            {block.extra && <p className="text-muted-foreground">+ <b className="text-foreground">추가 키</b></p>}
            <p className={`mt-1 rounded-sm border px-1.5 text-center font-bold ${KEY_CLASS[block.verdict]}`}>
              키 {block.key}
              {block.verdict === "same" ? " · 같음" : block.verdict === "diff" ? " · 다름" : ""}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function HashChainViz() {
  return (
    <SceneShell
      eyebrow="(가정) B=4의 block 키"
      title="block 키에는 앞 block의 키가 들어갑니다"
      description="왼쪽이 첫 block, 오른쪽이 둘째 block이며 윗줄 R1과 비교합니다. 키는 재료가 같으면 같게 나오는 hash 값이고 A·B·C는 설명용 기호입니다."
      ariaLabel="앞 block의 키와 현재 token으로 block 키를 만드는 사슬"
      scenes={SCENES}
      render={(index) => (
        <div className="space-y-3">
          <ChainRow chain={R1} />
          <ChainRow chain={SUBJECTS[index]} />
        </div>
      )}
    />
  );
}
