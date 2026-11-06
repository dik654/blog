import SceneShell from "./SceneShell";

/**
 * 본문 대응: #uart — 8N1은 시작 1 + 데이터 8 + 정지 1 = 10비트, 네 바이트면 40비트, 115200 bit/s에서 약 347.2 µs.
 * 가로줄 하나가 한 바이트 프레임이고 칸 하나가 1비트입니다.
 */
const ROWS = [0, 1, 2, 3];
const CELLS = Array.from({ length: 10 }, (_, cell) => cell);

const SCENES = [
  { label: "바이트 하나", summary: "1 + 8 + 1 = 10비트", rows: 1, missing: false, note: "8N1의 8은 데이터 8비트, N은 패리티 없음(그래서 칸이 없습니다), 1은 정지 1비트입니다. 여기에 시작 1비트가 앞에 붙습니다." },
  { label: "네 바이트", summary: "4 × 10 = 40비트", rows: 4, missing: false, note: "데이터는 4 × 8 = 32비트이고 시작·정지 비트가 8개 더 흐릅니다. 그래서 32비트가 아닙니다." },
  { label: "시간으로 바꾸면", summary: "40 ÷ 115200 ≈ 347.2 µs", rows: 4, missing: false, note: "양쪽이 약속한 보율 115200 bit/s로 나눈 값입니다. 공유 클록이 없으니 박자는 이 약속에 기댑니다. 네 데이터 바이트만 내보낼 때의 시간입니다." },
  { label: "이 네 바이트에 없는 것", summary: "요청은 아직 없음", rows: 4, missing: true, note: "어느 센서의 어느 레지스터인지 알리고 프레임 시작과 오류를 검사하려면 UART 위에 별도의 프로토콜 바이트가 필요합니다. 몇 바이트인지는 글에서 정하지 않아 칸을 그리지 않았습니다." },
] as const;

export default function UartFrameViz() {
  return (
    <SceneShell
      eyebrow="8N1 프레임"
      title="네 바이트를 보내는데 왜 40비트가 흐르는가"
      description="UART는 공유 클록 없이 양쪽이 약속한 보율(초당 비트 수)에 맞춰 비트를 해석합니다. 칸 하나가 1비트, 가로줄 하나가 한 바이트입니다. 시와 정은 시작·정지 비트입니다. 보율 115200은 예제 가정입니다."
      ariaLabel="UART 8N1 프레임 네 개를 칸으로 세어 40비트와 약 347 마이크로초를 얻는 그림"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="mx-auto max-w-[520px] space-y-1">
            <p className={`rounded border border-dashed px-2 py-1.5 text-center text-xs font-semibold ${scene.missing ? "" : "invisible"}`} style={{ borderColor: "#dc2626", color: "#dc2626" }}>
              별도 프로토콜 바이트 (개수 미정)
            </p>
            {ROWS.map((row) => (
              <div key={row} className="grid grid-cols-10 gap-0.5">
                {CELLS.map((cell) => {
                  const on = row < scene.rows;
                  const edge = cell === 0 || cell === 9;
                  const tone = edge ? "#d97706" : "#2563eb";
                  return (
                    <span
                      key={cell}
                      className="flex h-6 items-center justify-center rounded-sm border text-[11px] font-bold leading-none"
                      style={{ backgroundColor: on ? tone : "transparent", borderColor: on ? tone : "#94a3b8", color: on ? "#ffffff" : "#94a3b8", opacity: on ? 1 : 0.4 }}
                    >
                      {cell === 0 ? "시" : cell === 9 ? "정" : ""}
                    </span>
                  );
                })}
              </div>
            ))}
          </div>
        );
      }}
    />
  );
}
