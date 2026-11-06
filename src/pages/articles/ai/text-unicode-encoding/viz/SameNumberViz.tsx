import SceneShell, { type ShellScene } from "./SceneShell";
import { AlignedRows, type RowKind, type Tone } from "./TextCells";
import { RAW_ITEMS } from "./textCellData";

/**
 * 본문 대응: #case — 항목이 차지하는 파일 칸 1, 1, 2, 3, 4를 세로로 맞춰, 같은 숫자 3이
 * 번호 줄에서는 가, 파일 줄에서는 악센트의 뒤쪽 칸을 가리키는 것을 보입니다.
 */
const SCENES: readonly (ShellScene & { marks: Partial<Record<RowKind, readonly number[]>>; tones: Partial<Record<RowKind, Tone>> })[] = [
  { label: "번호 줄의 3", summary: "3번 → 가", note: "번호의 열에서 3번은 가입니다. 가 하나의 범위는 3에서 시작해 4 바로 앞에서 끝나고 길이는 1입니다.", marks: { number: [3] }, tones: {} },
  { label: "파일 줄의 3", summary: "3번 → 악센트의 뒤쪽 칸", note: "파일 칸의 3번은 악센트가 쓰는 두 칸 중 뒤쪽입니다. 한 칸을 잘라도 가를 얻을 수 없습니다.", marks: { byte: [3] }, tones: { byte: "bad" } },
  { label: "파일 줄의 가", summary: "4에서 7 바로 앞까지", note: "1, 1, 2칸을 쓴 다음이므로 가는 4번 칸에서 시작해 세 칸을 차지합니다. 웃는 그림은 7부터 11 앞까지입니다.", marks: { byte: [4, 5, 6] }, tones: {} },
  { label: "화면 묶음의 가", summary: "묶음 2번", note: "e와 악센트가 한 묶음이라 가는 2번입니다. 번호 3번이어도 화살표를 반드시 세 번 눌러야 도달한다고 단정할 수 없습니다.", marks: { cluster: [2] }, tones: {} },
];

const ROWS: readonly { kind: RowKind; title: string }[] = [
  { kind: "cluster", title: "화면 묶음" },
  { kind: "number", title: "문자 번호" },
  { kind: "byte", title: "파일 칸" },
];

export default function SameNumberViz() {
  return (
    <SceneShell
      eyebrow="같은 숫자, 다른 자리"
      title="숫자 3은 어느 줄에서 읽느냐에 따라 다른 곳입니다"
      description="세 줄은 같은 원문이고 칸 폭을 파일 칸에 맞췄습니다. 칸 아래 숫자는 0부터 센 위치입니다. 41, CC 같은 두 글자는 저장 칸 하나의 값입니다."
      note="점선 ◌는 악센트를 보여 주는 보조 그림입니다."
      ariaLabel="원문의 화면 묶음, 문자 번호, 파일 칸에서 같은 위치 숫자가 가리키는 곳 비교"
      scenes={SCENES}
      render={(active) => <AlignedRows items={RAW_ITEMS} rows={ROWS} marks={SCENES[active].marks} tones={SCENES[active].tones} />}
    />
  );
}
