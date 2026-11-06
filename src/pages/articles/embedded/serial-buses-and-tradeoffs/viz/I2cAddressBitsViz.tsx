import SceneShell from "./SceneShell";

/**
 * 본문 대응: #source-spec — 7비트 번호 0x48을 한 자리 왼쪽으로 옮기면 0x90, 쓰기 비트 0이면 0x90, 읽기 비트 1이면 0x91.
 * 0x48 = 1001000, 0x90 = 10010000, 0x91 = 10010001.
 */
const NUMBER: readonly string[] = ["1", "0", "0", "1", "0", "0", "0"];
const SLOTS = [0, 1, 2, 3, 4, 5, 6, 7];

const SCENES = [
  { label: "프로그램이 아는 번호", summary: "0x48 = 1001000", wire: null, hex: "", note: "7비트 번호입니다. 한 바이트 8칸 중 일곱 칸만 차지합니다. 프로그램 API에 넘기는 값은 끝까지 이 0x48입니다." },
  { label: "한 자리 왼쪽으로", summary: "0x48 × 2 = 0x90", wire: "?", hex: "", note: "선 위로 보내는 첫 바이트는 번호를 한 자리 왼쪽으로 옮겨 맨 오른쪽 칸을 비웁니다. 이 칸이 방향 비트 자리입니다." },
  { label: "쓰기 비트 0", summary: "10010000 = 0x90", wire: "0", hex: "0x90", note: "쓰기 비트 0을 붙여도 값은 그대로 0x90입니다. 아래 표의 첫 묶음 장치+쓰기가 이 바이트입니다." },
  { label: "읽기 비트 1", summary: "10010001 = 0x91", wire: "1", hex: "0x91", note: "읽기 비트 1을 붙이면 0x91입니다. 아래 표의 세 번째 묶음 장치+읽기가 이 바이트입니다. 번호 부분은 같습니다." },
] as const;

function Cell({ text, tone }: { text: string; tone: string | null }) {
  return (
    <span
      className={`flex h-9 items-center justify-center rounded border font-mono text-sm font-bold ${tone ? "" : "border-dashed"}`}
      style={tone ? { borderColor: tone, color: tone } : { borderColor: "#94a3b8", color: "#94a3b8", opacity: 0.5 }}
    >
      {text}
    </span>
  );
}

export default function I2cAddressBitsViz() {
  return (
    <SceneShell
      eyebrow="번호와 선 위의 바이트"
      title="0x48이 어떻게 0x90과 0x91이 되는가"
      description="칸 하나가 1비트입니다. 위 줄은 프로그램에 넘기는 번호, 아래 줄은 선 위로 나가는 첫 바이트입니다. 번호 0x48은 설명용 가정입니다."
      ariaLabel="7비트 번호 0x48에 방향 비트를 붙여 0x90과 0x91을 만드는 과정"
      scenes={SCENES}
      render={(active) => {
        const { wire, hex } = SCENES[active];
        return (
          <div className="mx-auto max-w-[520px] space-y-3">
            <div>
              <p className="mb-1 flex justify-between text-xs font-semibold"><span>프로그램의 7비트 번호</span><span className="font-mono">0x48</span></p>
              <div className="grid grid-cols-8 gap-1">
                <Cell text="" tone={null} />
                {NUMBER.map((bit, index) => <Cell key={index} text={bit} tone="#2563eb" />)}
              </div>
            </div>
            <div>
              <p className="mb-1 flex justify-between text-xs font-semibold"><span>선 위의 8비트</span><span className="font-mono">{hex || " "}</span></p>
              <div className="grid grid-cols-8 gap-1">
                {SLOTS.map((slot) => {
                  if (wire === null) return <Cell key={slot} text="" tone={null} />;
                  if (slot < 7) return <Cell key={slot} text={NUMBER[slot]} tone="#2563eb" />;
                  return <Cell key={slot} text={wire} tone="#d97706" />;
                })}
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
