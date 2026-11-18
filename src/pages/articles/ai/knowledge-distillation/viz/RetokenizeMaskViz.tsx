import SceneShell from "./SeqSceneShell";

/**
 * 본문 대응: #sequence-loss — teacher 문자열을 student tokenizer로 다시 나누고,
 * student chat template로 이어 붙인 뒤 response 위치만 mask 1로 두어 loss를 더한다.
 * 문장·분할·id·template 표지는 모두 설명용 가정이다.
 */
type Kind = "marker" | "prompt" | "response" | "pad";
type Token = { text: string; kind: Kind };

const TEACHER_SPLIT = [
  { text: "서울", id: "3105" },
  { text: "입니다", id: "812" },
] as const;
const STUDENT_SPLIT = [
  { text: "서", id: "41" },
  { text: "울", id: "57" },
  { text: "입", id: "233" },
  { text: "니다", id: "96" },
] as const;

const LINE: readonly Token[] = [
  { text: "‹user›", kind: "marker" },
  { text: "한국", kind: "prompt" },
  { text: " 수도", kind: "prompt" },
  { text: "는?", kind: "prompt" },
  { text: "‹asst›", kind: "marker" },
  { text: "서", kind: "response" },
  { text: "울", kind: "response" },
  { text: "입", kind: "response" },
  { text: "니다", kind: "response" },
  { text: "pad", kind: "pad" },
  { text: "pad", kind: "pad" },
];

const SCENES = [
  {
    label: "같은 문자열, 다른 경계",
    summary: "teacher 2개 · student 4개",
    note: "Teacher tokenizer와 student tokenizer는 같은 응답 ‘서울입니다’를 서로 다른 곳에서 자릅니다. 개수도 id도 다르므로 teacher의 token id를 그대로 student target으로 쓸 수 없고, 문자열만 넘겨받아 student 쪽에서 다시 나눕니다.",
  },
  {
    label: "Student template로 이어 붙이기",
    summary: "prompt + 응답 → 한 줄",
    note: "Chat template은 역할 표지와 순서를 정한 student 쪽 입력 형식입니다. Prompt와 teacher 응답을 이 형식으로 이어 붙여(serialize) 한 줄의 student token으로 만들고, 길이를 맞추는 padding이 뒤에 붙을 수 있습니다.",
  },
  {
    label: "학습할 위치만 mask 1",
    summary: "m = 0 0 0 0 0 1 1 1 1 0 0",
    note: "Loss mask m_t는 학습할 위치를 1, context·padding 위치를 0으로 둡니다. 이 예에서는 응답 4칸만 1입니다. Tool argument처럼 학습 대상으로 정한 위치가 있다면 그 칸도 1이 됩니다.",
  },
  {
    label: "Loss는 mask 1 칸만 더합니다",
    summary: "L_seq = ℓ₆ + ℓ₇ + ℓ₈ + ℓ₉",
    note: "각 칸에서 student가 target token에 준 log probability에 −m_t를 곱해 ℓ_t를 만듭니다. Mask 0 칸은 0이 되어 빠지고, prompt 칸은 앞 문맥(u_<t, c)으로만 쓰입니다. 남은 응답 4칸의 ℓ_t를 더한 값이 L_seq입니다.",
  },
] as const;

const KIND_STYLE: Record<Kind, string> = {
  marker: "border-dashed border-slate-400 text-slate-600 dark:text-slate-300",
  prompt: "border-slate-300 bg-background dark:border-slate-600",
  response: "border-blue-500 bg-blue-500/10 font-semibold",
  pad: "border-dashed border-border/60 text-muted-foreground/70",
};

function SplitRow({ who, items, tone }: { who: string; items: readonly { text: string; id: string }[]; tone: string }) {
  return (
    <div className="min-w-0">
      <p className="mb-2 text-xs font-semibold text-muted-foreground">
        {who} · {items.length}개
      </p>
      <div className="flex flex-wrap gap-1.5">
        {items.map((item) => (
          <span key={item.text} className={`rounded-md border px-2.5 py-1 text-center text-sm leading-5 ${tone}`}>
            <span className="block">{item.text}</span>
            <span className="block font-mono text-[11px] text-muted-foreground">id {item.id}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function Line({ step }: { step: number }) {
  const showMask = step >= 2;
  const showLoss = step >= 3;
  return (
    <div className="flex flex-wrap gap-1.5">
      {LINE.map((token, index) => {
        const mask = token.kind === "response" ? 1 : 0;
        const dim = showLoss && mask === 0;
        return (
          <div key={`${token.text}-${index}`} className={`flex w-[3.6rem] flex-col items-stretch text-center ${dim ? "opacity-45" : ""}`}>
            <span className="font-mono text-[11px] text-muted-foreground">t={index + 1}</span>
            <span className={`truncate rounded-md border px-1 py-1 text-xs leading-5 ${KIND_STYLE[token.kind]}`}>{token.text}</span>
            <span className={`mt-1 font-mono text-xs ${showMask ? (mask ? "font-bold text-blue-700 dark:text-blue-400" : "text-muted-foreground") : "invisible"}`}>
              m={mask}
            </span>
            <span className={`font-mono text-[11px] ${showLoss && mask ? "font-bold text-blue-700 dark:text-blue-400" : "invisible"}`}>
              ℓ{index + 1}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default function RetokenizeMaskViz() {
  return (
    <SceneShell
      eyebrow="Retokenize와 loss mask"
      title="Teacher 문자열을 student token으로 다시 나눈 뒤 응답 칸만 학습합니다"
      description="Tokenizer는 문자열을 모델이 쓰는 조각(token)과 번호(id)로 바꾸는 규칙입니다. 문장, 자르는 위치, id 숫자, ‹user›·‹asst› 같은 template 표지는 설명을 위한 가정입니다."
      ariaLabel="teacher 문자열의 재토큰화, student template 직렬화, loss mask, response 위치 loss 합의 네 장면"
      scenes={SCENES}
      render={(active) => {
        if (active === 0) {
          return (
            <div className="grid gap-4 sm:grid-cols-2">
              <SplitRow who="Teacher tokenizer" items={TEACHER_SPLIT} tone="border-slate-400 bg-background" />
              <SplitRow who="Student tokenizer" items={STUDENT_SPLIT} tone="border-blue-500 bg-blue-500/10" />
            </div>
          );
        }
        return (
          <div className="min-w-0 space-y-3">
            <Line step={active} />
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <span><span className="mr-1 inline-block h-3 w-3 rounded-sm border border-dashed border-slate-400 align-middle" />template 표지</span>
              <span><span className="mr-1 inline-block h-3 w-3 rounded-sm border border-slate-300 align-middle" />prompt</span>
              <span><span className="mr-1 inline-block h-3 w-3 rounded-sm border border-blue-500 bg-blue-500/10 align-middle" />teacher 응답</span>
              <span><span className="mr-1 inline-block h-3 w-3 rounded-sm border border-dashed border-border align-middle" />padding</span>
            </div>
          </div>
        );
      }}
    />
  );
}
