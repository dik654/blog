import { StableSceneStack } from "@/components/viz/StableSceneStack";
import SceneShell, { type ShellScene } from "./SceneShell";
import { Cell, type Tone } from "./TextCells";

/**
 * 본문 대응: #source-normalize — utf8proc_map의 분해·순서 정리·합성·부호화.
 * STABLE·COMPOSE는 10 byte, DECOMPOSE는 14 byte. 가는 고정 원문의 분해 함수에서
 * U+1100, U+1161로 풀린 뒤 합성에서 U+AC00으로 돌아옵니다(codebase/utf8proc.c).
 * 순서 정리 사례 q + U+0307(230) + U+0323(220) → U+0323, U+0307.
 */
interface Row {
  title: string;
  cols: number;
  cells: readonly { top: string; bottom?: string; tone?: Tone }[];
}

const hex = (values: string) => values.split(" ").map((top) => ({ top }));

const DECOMPOSED: Row = {
  title: "번호 6개",
  cols: 6,
  cells: [
    { top: "A", bottom: "0041" },
    { top: "e", bottom: "0065", tone: "accent" },
    { top: "◌́", bottom: "0301", tone: "accent" },
    { top: "ᄀ", bottom: "1100", tone: "warn" },
    { top: "ᅡ", bottom: "1161", tone: "warn" },
    { top: "😀", bottom: "1F600" },
  ],
};

const SCENES: readonly (ShellScene & { stage: number; skip?: boolean; rows: readonly Row[] })[] = [
  { label: "입력", summary: "열한 byte + 명시적 길이", note: "열한 byte를 명시적 길이와 STABLE·COMPOSE 옵션으로 utf8proc_map에 넘깁니다. 먼저 분해에 필요한 공간을 계산합니다.", stage: 0, rows: [{ title: "byte 11개", cols: 14, cells: hex("41 65 CC 81 EA B0 80 F0 9F 98 80") }] },
  { label: "분해", summary: "코드 포인트 6개", note: "번호의 열로 풀면서 이 구현은 가도 두 자모로 나눕니다. 가가 그대로 남는 결과는 다음 합성까지 지나야 얻습니다.", stage: 1, rows: [DECOMPOSED] },
  { label: "순서 정리", summary: "이 입력은 그대로", note: "결합 표시가 악센트 하나뿐이라 이 입력의 순서는 바뀌지 않습니다. 실제로 움직이는 사례는 마지막 장면에 있습니다.", stage: 2, rows: [DECOMPOSED] },
  { label: "합성", summary: "코드 포인트 4개", note: "e와 악센트는 일반 문자 조합표를 읽는 경로로, 두 자모는 음절로 결합하는 계산으로 합쳐집니다.", stage: 3, rows: [{ title: "번호 4개", cols: 6, cells: [{ top: "A", bottom: "0041" }, { top: "é", bottom: "00E9", tone: "accent" }, { top: "가", bottom: "AC00", tone: "warn" }, { top: "😀", bottom: "1F600" }] }] },
  { label: "부호화", summary: "반환 길이 10", note: "실제 반환 길이는 10이고 byte 열은 41 C3 A9 EA B0 80 F0 9F 98 80이었습니다.", stage: 4, rows: [{ title: "byte 10개", cols: 14, cells: hex("41 C3 A9 EA B0 80 F0 9F 98 80") }] },
  { label: "DECOMPOSE로 바꾸면", summary: "합성 없음 · 14 byte", note: "옵션을 DECOMPOSE로 바꾸면 같은 입력에서 14 byte가 나왔습니다. 가가 두 자모로 풀린 채 부호화됩니다.", stage: 4, skip: true, rows: [{ title: "byte 14개", cols: 14, cells: hex("41 65 CC 81 E1 84 80 E1 85 A1 F0 9F 98 80") }] },
  { label: "순서가 바뀌는 입력", summary: "결합 등급 230, 220 → 220, 230", note: "q 뒤의 U+0307, U+0323을 NFD가 결합 등급(표시를 줄 세우는 값) 오름차순으로 바꿉니다. 원문의 위치를 같은 번째 위치와 항상 연결할 수는 없습니다.", stage: 2, rows: [
    { title: "정리 전", cols: 6, cells: [{ top: "q" }, { top: "0307", bottom: "등급 230", tone: "ok" }, { top: "0323", bottom: "등급 220" }] },
    { title: "정리 후", cols: 6, cells: [{ top: "q" }, { top: "0323", bottom: "등급 220" }, { top: "0307", bottom: "등급 230", tone: "ok" }] },
  ] },
];

const STAGES = ["입력", "분해", "순서 정리", "합성", "부호화"];

export default function NormalizePathViz() {
  const nodes = SCENES.map((scene) => (
    <div key={scene.label} className="space-y-3">
      {scene.rows.map((row) => (
        <div key={row.title} className="min-w-0">
          <p className="mb-1 text-xs text-muted-foreground">{row.title}</p>
          <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${row.cols}, minmax(0, 1fr))`, columnGap: row.cols === 14 ? "1px" : undefined }}>
            {row.cells.map((cell, index) => (
              <Cell key={index} top={cell.top} bottom={cell.bottom} tone={cell.tone ?? "none"} dashed={cell.top.startsWith("◌")} />
            ))}
          </div>
        </div>
      ))}
    </div>
  ));
  return (
    <SceneShell
      eyebrow="정규화 경로"
      title="같은 입력이 번호로 풀렸다가 다시 합쳐져 byte가 됩니다"
      description="번호 칸 아래 숫자는 U+를 뗀 코드 포인트이고, 파란 칸은 e와 악센트, 주황 칸은 가에서 온 항목입니다."
      note="고정한 utf8proc v2.11.3 실행의 경로입니다. 점선 ◌는 보조 그림입니다."
      ariaLabel="utf8proc_map이 입력을 분해, 순서 정리, 합성, 부호화하는 단계"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0 space-y-4">
          <div className="grid grid-cols-5 gap-1">
            {STAGES.map((stage, index) => {
              const skipped = SCENES[active].skip && index === 3;
              const current = SCENES[active].stage === index;
              return (
                <span key={stage} className={`min-w-0 rounded-sm border px-0.5 py-1.5 text-center text-[11px] leading-4 sm:text-xs ${current ? "border-primary bg-primary/15 font-bold" : "border-border text-muted-foreground"} ${skipped ? "border-dashed line-through" : ""}`}>
                  {stage}
                </span>
              );
            })}
          </div>
          <StableSceneStack active={active} scenes={nodes} />
        </div>
      )}
    />
  );
}
