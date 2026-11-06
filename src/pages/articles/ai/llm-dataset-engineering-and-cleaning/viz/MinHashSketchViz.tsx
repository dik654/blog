import SceneShell from "./SceneShell";

/**
 * 본문 대응: #dedup-contamination — shingle 집합 → 해시별 최솟값 → sketch → 일치 비율.
 * 문장, k = 2, 해시 값 표는 설명용 가정이다. 참 J = 3/5 = 0.6, 추정 = 4/5 = 0.8.
 */
const WORDS_A = ["오늘", "서울", "날씨", "정말", "맑다"];
const WORDS_B = ["오늘", "서울", "날씨", "정말", "흐리다"];

const pairs = (words: readonly string[]) => words.slice(0, -1).map((word, index) => `${word} ${words[index + 1]}`);
const SET_A = pairs(WORDS_A);
const SET_B = pairs(WORDS_B);
const UNION = Array.from(new Set([...SET_A, ...SET_B]));
const SHARED = SET_A.filter((shingle) => SET_B.includes(shingle));

/** UNION 순서(오늘 서울, 서울 날씨, 날씨 정말, 정말 맑다, 정말 흐리다)의 가정 해시 값 */
const HASHES = [
  [37, 52, 14, 61, 28],
  [23, 48, 70, 9, 33],
  [11, 64, 29, 45, 58],
  [56, 18, 41, 77, 35],
  [39, 72, 26, 50, 44],
];

const valueOf = (hash: readonly number[], shingle: string) => hash[UNION.indexOf(shingle)];
const minOf = (hash: readonly number[], set: readonly string[]) => Math.min(...set.map((shingle) => valueOf(hash, shingle)));
const SKETCH_A = HASHES.map((hash) => minOf(hash, SET_A));
const SKETCH_B = HASHES.map((hash) => minOf(hash, SET_B));
const MATCHES = SKETCH_A.filter((value, index) => value === SKETCH_B[index]).length;

const SCENES = [
  { label: "거의 같은 두 문서", summary: "마지막 단어만 다름", note: "문서 전체를 비교하는 대신 연속한 단어 몇 개씩의 짧은 조각으로 바꾸어 비교할 준비를 합니다. 조각 길이 k는 여기서 두 단어로 두었습니다." },
  { label: "shingle 집합", summary: `J = ${SHARED.length}/${UNION.length} = ${SHARED.length / UNION.length}`, note: "shingle은 연속한 k개 단어입니다. Jaccard 유사도 J는 두 집합에 함께 있는 원소 수를 어느 쪽에든 있는 원소 수로 나눈 값입니다. 이 값을 직접 구하는 대신 추정하는 것이 다음 장면들입니다." },
  { label: "해시 하나, 최솟값 하나", summary: `A ${SKETCH_A[0]} · B ${SKETCH_B[0]}`, note: "해시 함수가 shingle마다 수를 하나 줍니다. 문서마다 그중 최솟값만 남깁니다. 공통 shingle이 최솟값이면 두 문서의 값이 같아집니다." },
  { label: "sketch", summary: `해시 ${HASHES.length}개 → 값 ${HASHES.length}개`, note: "해시 함수마다 같은 일을 반복해 값을 모으면 sketch가 됩니다. 문서 길이와 상관없이 해시 함수 수만큼의 값만 남습니다." },
  { label: "일치 비율로 추정", summary: `${MATCHES}/${HASHES.length} = ${MATCHES / HASHES.length} (참값 0.6)`, note: "같은 해시 함수에서 일치한 비율이 J의 추정치입니다. 해시가 다섯 개뿐인 이 예에서는 추정치 0.8이 참값 0.6과 어긋납니다. 해시 함수 수와 오차의 관계는 바로 아래 식과 그림이 다룹니다." },
] as const;

function Chip({ text, shared }: { text: string; shared: boolean }) {
  return <span className={`rounded-md border px-1.5 py-1 text-center text-xs ${shared ? "border-blue-600 bg-blue-500/10 font-bold" : "border-amber-600 bg-background"}`}>{text}</span>;
}

function SetColumn({ name, set }: { name: string; set: readonly string[] }) {
  return (
    <div className="min-w-0">
      <p className="mb-1 text-xs font-bold">문서 {name}</p>
      <div className="flex flex-col gap-1">
        {set.map((shingle) => (
          <Chip key={shingle} text={shingle} shared={SHARED.includes(shingle)} />
        ))}
      </div>
    </div>
  );
}

function HashColumn({ name, set }: { name: string; set: readonly string[] }) {
  const minimum = minOf(HASHES[0], set);
  return (
    <div className="min-w-0">
      <p className="mb-1 text-xs font-bold">문서 {name}</p>
      <div className="flex flex-col gap-1">
        {set.map((shingle) => {
          const value = valueOf(HASHES[0], shingle);
          return (
            <div key={shingle} className={`flex items-center justify-between gap-1 rounded-md border px-1.5 py-1 text-xs ${value === minimum ? "border-blue-600 bg-blue-500/10 font-bold" : "border-border bg-background"}`}>
              <span className="min-w-0">{shingle}</span>
              <span className="font-mono">{value}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SketchRow({ name, values, showMatch }: { name: string; values: readonly number[]; showMatch: boolean }) {
  return (
    <div className="grid grid-cols-[3.25rem_repeat(5,minmax(0,1fr))] items-center gap-1 text-xs sm:text-sm">
      <span className="font-bold">문서 {name}</span>
      {values.map((value, index) => {
        const same = SKETCH_A[index] === SKETCH_B[index];
        return (
          <span key={index} className={`rounded-md border py-1 text-center font-mono ${showMatch ? (same ? "border-blue-600 bg-blue-500/10 font-bold" : "border-dashed border-red-600") : "border-border bg-background"}`}>{value}</span>
        );
      })}
    </div>
  );
}

export default function MinHashSketchViz() {
  return (
    <SceneShell
      eyebrow="MinHash"
      title="해시 최솟값만 남겨 두 문서의 겹침을 추정합니다"
      description="문장, 조각 길이, 해시 값은 모두 손으로 따라가려고 정한 가정입니다. 파란 칸은 두 문서에 함께 있거나 값이 일치한 곳입니다."
      ariaLabel="두 문서를 shingle 집합과 MinHash sketch로 바꾸어 일치 비율로 Jaccard 유사도를 추정하는 과정"
      scenes={SCENES}
      render={(active) => {
        if (active === 0) {
          return (
            <div className="min-w-0 space-y-2">
              {[{ name: "A", words: WORDS_A }, { name: "B", words: WORDS_B }].map(({ name, words }) => (
                <div key={name} className="grid grid-cols-[3.25rem_repeat(5,minmax(0,1fr))] items-center gap-1 text-xs sm:text-sm">
                  <span className="font-bold">문서 {name}</span>
                  {words.map((word, index) => (
                    <span key={word} className={`rounded-md border py-1.5 text-center ${index === 4 ? "border-amber-600 font-bold" : "border-border bg-background"}`}>{word}</span>
                  ))}
                </div>
              ))}
            </div>
          );
        }
        if (active === 1) {
          return (
            <div className="grid grid-cols-2 gap-3">
              <SetColumn name="A" set={SET_A} />
              <SetColumn name="B" set={SET_B} />
            </div>
          );
        }
        if (active === 2) {
          return (
            <div className="grid grid-cols-2 gap-3">
              <HashColumn name="A" set={SET_A} />
              <HashColumn name="B" set={SET_B} />
            </div>
          );
        }
        return (
          <div className="min-w-0 space-y-1.5">
            <div className="grid grid-cols-[3.25rem_repeat(5,minmax(0,1fr))] gap-1 text-center text-[11px] text-muted-foreground">
              <span />
              {HASHES.map((_, index) => (
                <span key={index}>해시 {index + 1}</span>
              ))}
            </div>
            <SketchRow name="A" values={SKETCH_A} showMatch={active === 4} />
            <SketchRow name="B" values={SKETCH_B} showMatch={active === 4} />
            <p className={`pt-2 text-center font-mono text-sm font-bold ${active === 4 ? "" : "invisible"}`}>일치 {MATCHES}칸 / 전체 {HASHES.length}칸</p>
          </div>
        );
      }}
    />
  );
}
