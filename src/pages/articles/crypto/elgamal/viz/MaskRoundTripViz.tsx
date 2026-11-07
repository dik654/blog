import SceneShell from "./SceneShell";

/**
 * 본문 대응: #case — 모든 계산은 23으로 나눈 나머지.
 * Bob 6 → 8 게시, Alice 7 → 17, 8⁷ → 12, 10×12=120 → 5, 전송 (17,5), 17⁶ → 12, 12×2=24 → 1, 5×2 → 10.
 */
const SCENES = [
  { label: "Bob이 공개값을 게시합니다", summary: "5⁶ → 8", note: "Bob은 비밀 6을 혼자 갖고 공개값 8만 내놓습니다. Alice가 보내려는 메시지는 10입니다. 이 숫자들은 원리 설명용 가정이며 안전한 매개변수가 아닙니다." },
  { label: "Alice가 이번 비밀을 고릅니다", summary: "5⁷ → 17", note: "Alice는 이번 메시지에만 쓸 비밀 7로 첫 번째 전송값 17을 만듭니다." },
  { label: "가리개를 만듭니다", summary: "8⁷ → 12", note: "같은 7을 Bob의 공개값 8에 적용하면 12가 나옵니다. 이 값이 메시지를 가릴 값이며 밖으로 보내지 않습니다." },
  { label: "메시지를 가립니다", summary: "10×12=120 → 5", note: "120을 23으로 나누면 몫 5, 나머지 5입니다. 전송할 둘째 값은 나머지 5입니다." },
  { label: "두 값을 보냅니다", summary: "(17, 5)", note: "연결망에는 17과 5만 지나갑니다. 관찰자는 Bob의 공개값 8과 함께 이 두 값을 봅니다." },
  { label: "Bob이 가리개를 재현합니다", summary: "17⁶ → 12", note: "Bob은 받은 17에 자기 비밀 6을 적용합니다. Alice가 8⁷로 만든 것과 같은 12입니다." },
  { label: "가리개를 걷어냅니다", summary: "5×2=10", note: "12×2=24의 나머지가 1이므로 2를 곱하면 12의 효과가 사라집니다. 받은 5에 2를 곱해 원래 메시지 10을 복원합니다." },
] as const;

interface Cell { at: number; label: string; value: string; secret: boolean }

const COLUMNS: readonly { name: string; cells: readonly Cell[] }[] = [
  {
    name: "Alice",
    cells: [
      { at: 0, label: "받은 공개값", value: "8", secret: false },
      { at: 0, label: "메시지", value: "10", secret: true },
      { at: 1, label: "이번 비밀", value: "7", secret: true },
      { at: 1, label: "첫 값 5⁷", value: "17", secret: false },
      { at: 2, label: "가리개 8⁷", value: "12", secret: true },
      { at: 3, label: "가린 값", value: "5", secret: false },
    ],
  },
  {
    name: "관찰자",
    cells: [
      { at: 0, label: "공개값", value: "8", secret: false },
      { at: 4, label: "첫 값", value: "17", secret: false },
      { at: 4, label: "가린 값", value: "5", secret: false },
    ],
  },
  {
    name: "Bob",
    cells: [
      { at: 0, label: "비밀", value: "6", secret: true },
      { at: 0, label: "공개값 5⁶", value: "8", secret: false },
      { at: 4, label: "받은 두 값", value: "17, 5", secret: false },
      { at: 5, label: "가리개 17⁶", value: "12", secret: true },
      { at: 6, label: "12를 지우는 수", value: "2", secret: true },
      { at: 6, label: "복원 5×2", value: "10", secret: true },
    ],
  },
];

export default function MaskRoundTripViz() {
  return (
    <SceneShell
      eyebrow="왕복 계산"
      title="가리개 12는 전송되지 않고 양쪽에서 따로 만들어집니다"
      description="실선 칸은 밖으로 드러나도 되는 값, 점선 칸은 관찰자에게 보이지 않는 값입니다. 모든 계산은 23으로 나눈 나머지입니다(가정)."
      ariaLabel="Alice, 관찰자, Bob이 각 단계에서 아는 값이 늘어나는 과정"
      scenes={SCENES}
      render={(active) => (
        <div className="grid grid-cols-3 gap-2">
          {COLUMNS.map((column) => (
            <div key={column.name} className="min-w-0">
              <p className="mb-1 text-center text-sm font-bold">{column.name}</p>
              <div className="space-y-1">
                {column.cells.map((cell) => {
                  const shown = cell.at <= active;
                  const fresh = cell.at === active;
                  return (
                    <div
                      key={`${cell.label}-${cell.at}`}
                      className={`rounded-lg border px-1 py-0.5 text-center ${shown ? "" : "invisible"} ${cell.secret ? "border-dashed" : ""} ${fresh ? "border-primary bg-primary/10" : "border-border bg-background"}`}
                    >
                      <span className="block text-[11px] leading-[14px] text-muted-foreground">{cell.label}</span>
                      <span className="block font-mono text-sm font-bold leading-5">{cell.value}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    />
  );
}
