import SceneShell, { type ShellScene } from "./SceneShell";
import { AlignedRows, type RowKind, type RulerItem } from "./TextCells";
import { NFC_ITEMS, NFD_ITEMS, RAW_ITEMS } from "./textCellData";

/**
 * 본문 대응: #picture — 원문, 합친 글, 풀어 쓴 글의 네 길이를 칸으로 겹칩니다.
 * 묶음 4 고정, 번호 5/4/6, 프로그램 칸 6/5/7, 파일 칸 11/10/14.
 */
interface RulerScene extends ShellScene {
  items: readonly RulerItem[];
  marks: Partial<Record<RowKind, readonly number[]>>;
  notes: Partial<Record<RowKind, string>>;
}

const SCENES: readonly RulerScene[] = [
  { label: "원문", summary: "4 · 5 · 6 · 11", note: "가의 자리는 묶음 2번, 번호 3번, 프로그램 칸 3번, 파일 칸 4번부터입니다.", items: RAW_ITEMS, marks: { cluster: [2], number: [3], unit: [3], byte: [4, 5, 6] }, notes: {} },
  { label: "합친 글", summary: "4 · 4 · 5 · 10", note: "e와 악센트를 합치면 세 줄이 하나씩 줄고 가도 그만큼 앞으로 옵니다. 화면 묶음 줄만 그대로입니다.", items: NFC_ITEMS, marks: { cluster: [2], number: [2], unit: [2], byte: [3, 4, 5] }, notes: { number: "5 → 4", unit: "6 → 5", byte: "11 → 10", cluster: "그대로" } },
  { label: "더 풀어 쓴 글", summary: "4 · 6 · 7 · 14", note: "가를 앞소리와 모음으로 풀면 번호와 프로그램 칸은 하나씩, 파일 칸은 셋 늘어납니다. 이 규칙에서 화면 묶음은 네 개입니다.", items: NFD_ITEMS, marks: { cluster: [2], number: [3, 4], unit: [3, 4], byte: [4, 5, 6, 7, 8, 9] }, notes: { number: "5 → 6", unit: "6 → 7", byte: "11 → 14", cluster: "그대로" } },
];

const ROWS: readonly { kind: RowKind; title: string }[] = [
  { kind: "cluster", title: "화면 묶음" },
  { kind: "number", title: "문자 번호" },
  { kind: "unit", title: "프로그램 칸" },
  { kind: "byte", title: "파일 칸" },
];

export default function FourRulersViz() {
  return (
    <SceneShell
      eyebrow="네 줄 겹쳐 보기"
      title="표현을 바꾸면 세 줄의 칸이 달라지고 화면 묶음은 네 개로 남습니다"
      description="파란 칸이 가입니다. 칸 폭은 파일 칸에 맞췄고, 프로그램 칸은 여기서 사용하는 프로그램의 저장 칸입니다."
      note="머리글 숫자는 묶음·번호·프로그램 칸·파일 칸의 길이입니다."
      ariaLabel="원문, 합친 글, 풀어 쓴 글의 네 가지 길이를 칸으로 비교"
      scenes={SCENES}
      render={(active) => <AlignedRows items={SCENES[active].items} rows={ROWS} marks={SCENES[active].marks} notes={SCENES[active].notes} />}
    />
  );
}
