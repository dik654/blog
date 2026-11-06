import type { ReactNode } from "react";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #spi — 명령 1바이트 + 결과 4바이트 = 5바이트 × 8클록 = 40클록, 1 MHz에서 40 µs(가상).
 * 세 띠가 같은 시간축입니다. 클록 8개마다 송신 선과 수신 선에 한 바이트씩 동시에 흐릅니다.
 */
const SLOTS = [
  { tx: "명령", rx: "버릴 수도" },
  { tx: "더미", rx: "결과 1" },
  { tx: "더미", rx: "결과 2" },
  { tx: "더미", rx: "결과 3" },
  { tx: "더미", rx: "결과 4" },
] as const;
const TICKS = [0, 1, 2, 3, 4, 5, 6, 7];

const SCENES = [
  { label: "명령을 보내는 8클록", summary: "1 × 8 = 8클록", upto: 1, note: "클록이 뛰는 동안 송신과 수신이 함께 일어납니다. 명령을 보내는 동안 돌아오는 바이트는 버려지는 값일 수 있습니다." },
  { label: "결과 첫 바이트", summary: "2 × 8 = 16클록", upto: 2, note: "받으려면 클록이 필요합니다. 그래서 송신 쪽에서 클록을 만들려고 더미 바이트(결과와 상관없이 자리를 채우는 값)를 보내야 할 수 있습니다." },
  { label: "결과 네 바이트까지", summary: "5 × 8 = 40클록", upto: 5, note: "명령 1바이트와 결과 4바이트, 다섯 바이트가 흐르는 동안 클록은 40번입니다. I²C처럼 바이트마다 붙는 응답 칸은 이 가정의 거래에 없습니다." },
  { label: "클록 수에 시간을 곱합니다", summary: "40 × 1 µs = 40 µs", upto: 5, note: "1 MHz에서 클록 하나는 1 µs라 순수 클록 시간은 40 µs입니다. 장치마다 다른 명령 형식, 클록 모드, 선택 선의 준비·종료 시간은 뺀 가상 선로 시간입니다." },
] as const;

const Lane = ({ title, children }: { title: string; children: ReactNode }) => (
  <div>
    <p className="mb-1 text-xs font-semibold">{title}</p>
    <div className="grid grid-cols-5 gap-1">{children}</div>
  </div>
);

export default function SpiLanesViz() {
  return (
    <SceneShell
      eyebrow="동시 송수신"
      title="받기만 하려는데 왜 무언가를 보내야 하는가"
      description="SPI는 보통 클록·송신·수신 선과 장치 선택 선을 쓰는 통신 방식입니다. 세 띠는 같은 시간축이고 한 칸이 한 바이트(8클록)입니다. 명령 1바이트 뒤에 네 바이트를 돌려주는 가상의 SPI 장치입니다. 값의 이름은 설명용 가정입니다."
      ariaLabel="SPI 클록, 송신, 수신 선을 같은 시간축에 놓고 다섯 바이트 40클록을 세는 그림"
      scenes={SCENES}
      render={(active) => {
        const { upto } = SCENES[active];
        const cell = (on: boolean, tone: string) =>
          on ? { borderColor: tone, color: tone } : { borderColor: "#94a3b8", color: "#94a3b8", opacity: 0.35 };
        return (
          <div className="mx-auto max-w-[560px] space-y-2">
            <Lane title="클록 선">
              {SLOTS.map((slot, index) => (
                <div key={`clock-${slot.rx}`} className="flex h-8 items-center justify-between rounded border px-1" style={cell(index < upto, "#64748b")}>
                  {TICKS.map((tick) => <span key={tick} className="h-4 w-0.5" style={{ backgroundColor: index < upto ? "#64748b" : "#94a3b8" }} />)}
                </div>
              ))}
            </Lane>
            <Lane title="송신 선 (장치로)">
              {SLOTS.map((slot, index) => (
                <span key={`tx-${slot.rx}`} className="flex h-10 items-center justify-center rounded border text-center text-[11px] font-bold leading-4 sm:text-xs" style={cell(index < upto, index === 0 ? "#2563eb" : "#64748b")}>{slot.tx}</span>
              ))}
            </Lane>
            <Lane title="수신 선 (장치에서)">
              {SLOTS.map((slot, index) => (
                <span key={`rx-${slot.rx}`} className={`flex h-10 items-center justify-center rounded border text-center text-[11px] font-bold leading-4 sm:text-xs ${index === 0 ? "border-dashed" : ""}`} style={cell(index < upto, index === 0 ? "#64748b" : "#d97706")}>{slot.rx}</span>
              ))}
            </Lane>
          </div>
        );
      }}
    />
  );
}
