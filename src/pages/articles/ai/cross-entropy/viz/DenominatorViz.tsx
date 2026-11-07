import { StableSceneStack } from "@/components/viz/StableSceneStack";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #reduction — 확률 정답 한 행: P로 세 열 모두 사용 → 1.75ln2.
 * 가중치 (2,1,1), 정답 A,A,B,C: 분자 (2×2+2×2+1×2+1×1)ln2 = 11ln2.
 * 클래스 번호 경로 분모 2+2+1+1=6 → 11ln2/6 ≈ 1.271. one-hot 확률 경로 분모 4 → 11ln2/4 ≈ 1.906.
 */
const SCENES = [
  { label: "확률 정답 한 행", summary: "1 + 0.5 + 0.25 = 1.75 (ln2)", note: "아직 클래스 가중치가 없습니다. 정답에 P=(1/2,1/4,1/4)를 주면 정답 하나만 고르지 않고 세 열 모두 씁니다. 평균 비용은 앞과 같은 1.75ln2입니다." },
  { label: "클래스 번호 + 가중치", summary: "11ln2 ÷ 6 ≈ 1.271 nat", note: "칸 하나가 ln2입니다. 행마다 비용에 정답의 가중치를 곱해 칸이 11개가 됩니다. CPU NLL의 mean은 정답 가중치의 합 2+2+1+1=6으로 나눕니다." },
  { label: "one-hot + 가중치", summary: "11ln2 ÷ 4 ≈ 1.906 nat", note: "같은 네 정답을 4×3 one-hot 확률 배열로 바꾸면 칸은 그대로 11개입니다. 이 버전(v2.14.0)의 확률 정답 경로는 관측 수 4로 나눕니다." },
] as const;

const ROWS = [
  { letter: "A", weight: 2, cost: 2 },
  { letter: "A", weight: 2, cost: 2 },
  { letter: "B", weight: 1, cost: 2 },
  { letter: "C", weight: 1, cost: 1 },
] as const;

const SOFT = [
  { letter: "A", weight: "1/2", cost: 2, value: "1" },
  { letter: "B", weight: "1/4", cost: 2, value: "0.5" },
  { letter: "C", weight: "1/4", cost: 1, value: "0.25" },
] as const;

function SoftPanel() {
  return (
    <div className="grid min-w-0 grid-cols-3 gap-2">
      {SOFT.map((column) => (
        <div key={column.letter} className="rounded-lg border border-primary/60 bg-background p-2 text-center">
          <p className="text-sm font-bold">{column.letter}</p>
          <p className="mt-1 font-mono text-xs leading-5 text-muted-foreground">{`비중 ${column.weight}`}</p>
          <p className="font-mono text-xs leading-5 text-muted-foreground">{`× ${column.cost}ln2`}</p>
          <p className="mt-1 font-mono text-sm font-bold">{`${column.value} (ln2)`}</p>
        </div>
      ))}
    </div>
  );
}

function BlockPanel({ denominator }: { denominator: 6 | 4 }) {
  return (
    <div className="min-w-0">
      <p className="mb-1.5 text-xs font-semibold text-muted-foreground">정답 · 가중치 × 비용(ln2)</p>
      <div className="space-y-1.5">
        {ROWS.map((row, index) => (
          <div key={index} className="grid grid-cols-[6.75rem_minmax(0,1fr)] items-center gap-2">
            <span className="font-mono text-xs text-muted-foreground">{`${row.letter} · ${row.weight} × ${row.cost}`}</span>
            <span className="flex gap-1">
              {Array.from({ length: row.weight * row.cost }, (_, cell) => (
                <span key={cell} className="h-5 w-5 rounded-sm bg-primary/50" />
              ))}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-3 border-t border-border pt-3">
        <p className="text-xs font-semibold text-muted-foreground">{denominator === 6 ? "분모: 정답 가중치의 합" : "분모: 관측 수"}</p>
        <div className="mt-1.5 flex flex-wrap items-center gap-1">
          {(denominator === 6 ? ["2", "2", "1", "1"] : ["1", "1", "1", "1"]).map((value, index) => (
            <span key={index} className="flex h-7 w-7 items-center justify-center rounded border border-amber-600 font-mono text-xs">{value}</span>
          ))}
          <span className="ml-1 font-mono text-sm font-bold">{`= ${denominator}`}</span>
        </div>
      </div>
    </div>
  );
}

export default function DenominatorViz() {
  return (
    <SceneShell
      eyebrow="정답 형식과 분모"
      title="위의 합이 같아도 분모가 다르면 mean이 다릅니다"
      description="둘째 장면부터 쓰는 클래스 가중치 w=(2,1,1)은 가정입니다. 가중치가 없으면 두 형식의 결과는 여기서 같습니다."
      ariaLabel="확률 정답, 클래스 번호, one-hot 경로에서 합계와 분모 비교"
      scenes={SCENES}
      render={(active) => (
        <StableSceneStack active={active} scenes={[<SoftPanel key="soft" />, <BlockPanel key="six" denominator={6} />, <BlockPanel key="four" denominator={4} />]} />
      )}
    />
  );
}
