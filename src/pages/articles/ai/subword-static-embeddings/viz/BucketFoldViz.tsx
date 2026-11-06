import SceneShell from "./SceneShell";

/**
 * 본문 대응: #release — bucket 8 → 4. 새 주소는 옛 주소 mod 4(해시 나머지이므로 같은 결과).
 * un> 4 → 0, run 합 (8+2+2+0, 3) = (12, 3), 평균 (3, 0.75).
 * runs의 ns>도 0번이므로 un>과 새로 겹친다. uns는 3번 그대로.
 */
interface Piece {
  text: string;
  old: number;
}

const RUN_ONLY: readonly Piece[] = [
  { text: "<ru", old: 2 },
  { text: "run", old: 2 },
  { text: "un>", old: 4 },
];
const WITH_RUNS: readonly Piece[] = [...RUN_ONLY, { text: "uns", old: 3 }, { text: "ns>", old: 0 }];

const SCENES = [
  { label: "여덟 줄일 때", summary: "run: 2번, 2번, 4번", note: "윗줄이 0~3번, 아랫줄이 4~7번입니다. 단어 전용 줄 (8, 0)은 이 표 밖에 그대로 있습니다.", pieces: RUN_ONLY, fold: false, equation: "합 (16, 3) ÷ 4 = (4, 0.75)" },
  { label: "넷으로 접기", summary: "4번 → 0번", note: "주소가 나머지이므로 4~7번은 0~3번으로 접힙니다. 행을 지우는 데서 끝나지 않고 un>의 주소가 4에서 0으로 바뀝니다.", pieces: RUN_ONLY, fold: true, equation: "조각 행 숫자만 64바이트 → 32바이트" },
  { label: "run을 다시 계산", summary: "(3, 0.75)", note: "새 표도 b번의 값을 (b, 1)로 정하면 8+2+2+0=12, 0+1+1+1=3입니다. 원래 (4, 0.75)와 다릅니다.", pieces: RUN_ONLY, fold: true, equation: "합 (12, 3) ÷ 4 = (3, 0.75)" },
  { label: "겹침은 줄지 않음", summary: "<ru·run 그대로, un>·ns> 새로", note: "2번에서 충돌한 <ru와 run은 계속 함께 있고, runs의 ns>(0번)와 run의 un>(4번→0번)이 새로 같은 줄을 씁니다.", pieces: WITH_RUNS, fold: true, equation: "0번 줄: un> + ns> (새 겹침)" },
] as const;

function Slot({ title, names, tone }: { title: string; names: readonly string[]; tone: "plain" | "moved" | "off" }) {
  return (
    <div className={`min-h-[2.75rem] rounded-md border px-1 py-1 text-center ${tone === "moved" ? "border-blue-600 bg-blue-500/10" : tone === "off" ? "border-dashed border-border/40 opacity-40" : names.length > 0 ? "border-border bg-background" : "border-border/50"}`}>
      <span className="block text-[11px] font-bold">{title}</span>
      {names.map((name) => (
        <span key={name} className="block font-mono text-[11px] leading-4">{name}</span>
      ))}
    </div>
  );
}

export default function BucketFoldViz() {
  return (
    <SceneShell
      eyebrow="bucket을 8에서 4로"
      title="줄 수를 접으면 같은 문자열이 다른 줄을 읽습니다"
      description="칸 안은 그 줄을 가리키는 조각입니다. 줄 값 (b, 1)은 글의 가정입니다."
      ariaLabel="bucket 수를 여덟에서 넷으로 줄일 때 조각 주소와 run의 평균이 바뀌는 과정"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const oldNames = (bucket: number) => scene.pieces.filter((piece) => piece.old === bucket).map((piece) => piece.text);
        const newNames = (bucket: number) => scene.pieces.filter((piece) => piece.old % 4 === bucket).map((piece) => piece.text);
        return (
          <div className="min-w-0 space-y-2">
            <div className="grid grid-cols-4 gap-1.5">
              {[0, 1, 2, 3, 4, 5, 6, 7].map((bucket) => (
                <Slot key={bucket} title={`${bucket}번`} names={oldNames(bucket)} tone={scene.fold ? "off" : "plain"} />
              ))}
            </div>
            <p className={`text-center text-xs font-bold text-muted-foreground ${scene.fold ? "" : "invisible"}`}>↓ 4로 나눈 나머지로 접기 ↓</p>
            <div className={`grid grid-cols-4 gap-1.5 ${scene.fold ? "" : "invisible"}`}>
              {[0, 1, 2, 3].map((bucket) => (
                <Slot key={bucket} title={`새 ${bucket}번`} names={newNames(bucket)} tone={bucket === 0 && newNames(0).includes("un>") ? "moved" : "plain"} />
              ))}
            </div>
            <p className="rounded-md border border-border bg-background px-3 py-2 text-center font-mono text-sm font-bold">{scene.equation}</p>
          </div>
        );
      }}
    />
  );
}
