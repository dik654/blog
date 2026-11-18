import SceneShell from "./SceneShell";

/**
 * 본문 대응: #session-segments — composite verifier는 비최종 segment가 SystemSplit로 끝나고
 * output이 비었는지 본 뒤, post-state digest를 다음 segment의 expected pre-state로 쓴다.
 * segment 3개와 state 기호 A·B는 설명용 가정이다.
 */
type Seg = {
  name: string;
  pre: string;
  post: string;
  exit: string;
  output: string;
  final: boolean;
  bad?: "exit" | "output";
};

const S1: Seg = { name: "segment 1", pre: "시작", post: "A", exit: "SystemSplit", output: "None", final: false };
const S2: Seg = { name: "segment 2", pre: "A", post: "B", exit: "SystemSplit", output: "None", final: false };
const S3: Seg = { name: "segment 3 (마지막)", pre: "B", post: "끝", exit: "최종 검사", output: "journal", final: true };

type Link = { left: string; right: string } | null;

const SCENES = [
  {
    label: "정상 연결",
    summary: "A = A, B = B → 하나의 실행",
    slots: [S1, S2, S3],
    links: [{ left: "A", right: "A" }, { left: "B", right: "B" }] as Link[],
    note: "segment 1이 끝난 state A가 segment 2의 시작 state로 저장되고, B도 같은 방식으로 이어집니다. 비최종 segment는 SystemSplit로 끝나고 공개 출력이 없으며, journal은 마지막 segment의 별도 최종 검사에서 다룹니다.",
  },
  {
    label: "순서 교체",
    summary: "A ≠ B → 연결 실패",
    slots: [S1, S3, S2],
    links: [{ left: "A", right: "B" }, null] as Link[],
    note: "같은 segment receipt라도 2와 3의 순서를 바꾸면 segment 1의 post A 다음에 pre가 B인 segment가 옵니다. 각 seal이 유효해도 첫 연결에서 거절됩니다.",
  },
  {
    label: "segment 누락",
    summary: "A ≠ B → 연결 실패",
    slots: [S1, S3, null],
    links: [{ left: "A", right: "B" }, null] as Link[],
    note: "segment 2를 빼면 A에서 B로 넘어가는 실행이 사라집니다. 남은 두 receipt가 각각 유효해도 A와 B가 달라 하나의 연속 실행이 아닙니다.",
  },
  {
    label: "중간 output",
    summary: "비최종인데 output 있음 → 형식 오류",
    slots: [S1, { ...S2, output: "있음", bad: "output" as const }, S3],
    links: [{ left: "A", right: "A" }, { left: "B", right: "B" }] as Link[],
    note: "state가 모두 이어져도 비최종 segment에 공개 출력이 있으면 거절합니다. 최종 journal은 마지막 receipt에서만 나와야 합니다.",
  },
  {
    label: "중간에 Halted",
    summary: "비최종인데 Halted → 거절",
    slots: [S1, { ...S2, exit: "Halted", bad: "exit" as const }, S3],
    links: [{ left: "A", right: "A" }, { left: "B", right: "B" }] as Link[],
    note: "SystemSplit는 실행이 끝난 것이 아니라 다음 segment로 계속된다는 exit code입니다. composite verifier는 비최종 segment가 SystemSplit로 끝났는지 확인하므로, 중간 segment가 Halted로 끝났다면 거절합니다.",
  },
] as const;

function SegCard({ seg }: { seg: Seg | null }) {
  if (!seg) {
    return (
      <div className="flex min-h-[4.5rem] min-w-0 items-center sm:min-h-[7.5rem] justify-center rounded-lg border border-dashed border-border/60 px-2 py-2 text-center text-xs text-muted-foreground">
        받은 receipt 없음
      </div>
    );
  }
  return (
    <div className={`grid min-h-[4.5rem] min-w-0 grid-cols-2 gap-x-2 rounded-lg border px-2.5 py-1.5 text-[11px] leading-5 sm:min-h-[7.5rem] sm:grid-cols-1 sm:py-2 sm:text-xs ${seg.bad ? "border-red-600 bg-red-500/10" : "border-border bg-background"}`}>
      <p className="font-bold">{seg.name}</p>
      <p className="font-mono">pre <b>{seg.pre}</b> → post <b>{seg.post}</b></p>
      <p className={`font-mono ${seg.bad === "exit" ? "font-bold text-red-700 dark:text-red-400" : ""}`}>exit {seg.exit}</p>
      <p className={`font-mono ${seg.bad === "output" ? "font-bold text-red-700 dark:text-red-400" : ""}`}>output {seg.output}</p>
      <p className="text-[10px] text-muted-foreground">seal 유효 (가정)</p>
    </div>
  );
}

function LinkChip({ link }: { link: Link }) {
  if (!link) {
    return <div className="flex h-7 items-center justify-center text-xs text-muted-foreground sm:h-8">—</div>;
  }
  const ok = link.left === link.right;
  return (
    <div
      className={`flex h-7 items-center justify-center whitespace-nowrap sm:h-8 rounded-md border px-2 font-mono text-xs font-bold ${
        ok ? "border-emerald-600 text-emerald-700 dark:text-emerald-400" : "border-red-600 text-red-700 dark:text-red-400"
      }`}
    >
      {link.left} {ok ? "=" : "≠"} {link.right}
    </div>
  );
}

export default function SegmentChainViz() {
  return (
    <SceneShell
      eyebrow="segment 연결 검사"
      title="앞 segment의 끝 state가 다음 segment의 시작이어야 합니다"
      description="카드 하나가 segment receipt 하나입니다. pre는 시작 state digest, post는 종료 state digest, exit는 종료 방식입니다. SystemSplit는 실행이 다음 segment로 계속된다는 exit code입니다. 카드 사이 칸은 앞 post와 뒤 pre를 비교한 결과입니다."
      note="segment 3개와 state 기호 A·B는 설명용 가정입니다. 실제 실행이 몇 segment로 나뉘는지는 실행 길이에 따라 다르며, 최종 segment의 final claim·assumptions 검사는 이 그림에서 생략했습니다."
      ariaLabel="정상 연결, 순서 교체, 누락, 중간 output, 중간 Halted 다섯 경우의 segment 연결 검사"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="grid min-w-0 grid-cols-1 items-center gap-2 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)]">
            <SegCard seg={scene.slots[0]} />
            <LinkChip link={scene.links[0]} />
            <SegCard seg={scene.slots[1]} />
            <LinkChip link={scene.links[1]} />
            <SegCard seg={scene.slots[2]} />
          </div>
        );
      }}
    />
  );
}
