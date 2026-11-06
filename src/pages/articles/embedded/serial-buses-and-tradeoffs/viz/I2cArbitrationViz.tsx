import SceneShell from "./SceneShell";

/**
 * 본문 대응: #i2c — 두 컨트롤러가 거의 동시에 START를 내면 SCL이 HIGH인 동안 비트마다 SDA를 자기가 보낸 값과 비교한다.
 * 0x48 = 1001000, 0x20 = 0100000(가정). 첫 비트에서 우리 쪽 1, 상대 0, SDA는 LOW로 보이므로 우리 쪽이 진다.
 */
const OURS = [1, 0, 0, 1, 0, 0, 0] as const;
const THEIRS = [0, 1, 0, 0, 0, 0, 0] as const;
const SLOTS = [0, 1, 2, 3, 4, 5, 6];

const SCENES = [
  { label: "거의 동시에 START", summary: "둘 다 주소를 보내기 시작", shown: 0, ours: 7, note: "두 컨트롤러 모두 버스가 비어 있을 때 시작했습니다. 이제 SCL이 HIGH인 동안 비트마다 SDA를 자기가 보낸 값과 비교합니다." },
  { label: "첫 비트 비교", summary: "우리 1, 상대 0, SDA는 LOW", shown: 1, ours: 1, note: "우리 쪽은 HIGH(1)를 보냈는데 SDA가 LOW(0)로 보입니다. 보낸 값과 다르므로 우리 쪽이 집니다. 상대는 LOW를 보내고 LOW를 봤으니 그대로 이어 갑니다." },
  { label: "진 쪽은 손을 뗍니다", summary: "상대의 주소는 그대로 이어짐", shown: 7, ours: 1, note: "우리 쪽은 SDA 출력을 끕니다. SDA에는 상대의 비트만 남으므로 이긴 쪽의 거래는 손상되지 않습니다." },
  { label: "버스가 빈 뒤 처음부터", summary: "상대 거래 전체 + 157.5 µs", shown: 7, ours: 1, note: "우리 쪽은 버스가 빈 뒤 거래를 처음부터 다시 시작합니다. 157.5 µs 앞에 상대 거래 전체가 더해집니다. 상대 거래의 길이는 글에서 정하지 않았고, 아래 칸의 길이는 크기가 아닙니다." },
] as const;

function BitRow({ label, bits, show, tone }: { label: string; bits: readonly number[]; show: (slot: number) => boolean; tone: string }) {
  return (
    <div className="grid grid-cols-[6.5rem_minmax(0,1fr)] items-center gap-2">
      <span className="text-xs font-semibold leading-4">{label}</span>
      <div className="grid grid-cols-7 gap-1">
        {SLOTS.map((slot) => (
          <span
            key={slot}
            className="flex h-8 items-center justify-center rounded border font-mono text-sm font-bold"
            style={show(slot) ? { borderColor: tone, color: tone } : { borderColor: "#94a3b8", color: "#94a3b8", opacity: 0.45 }}
          >
            {show(slot) ? bits[slot] : "·"}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function I2cArbitrationViz() {
  return (
    <SceneShell
      eyebrow="중재 · 두 컨트롤러가 겹칠 때"
      title="거의 같은 순간에 시작한 두 컨트롤러 중 누가 물러나는가"
      description="칸 하나가 주소 1비트입니다. 1은 HIGH, 0은 LOW입니다. 상대 주소 0x20과 우리 센서 번호 0x48은 설명용 가정입니다."
      ariaLabel="주소 0x48과 0x20을 보내는 두 컨트롤러의 비트 단위 중재"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="mx-auto max-w-[560px] space-y-1.5">
            <BitRow label="우리 쪽 0x48" bits={OURS} show={(slot) => slot < scene.shown && slot < scene.ours} tone="#d97706" />
            <BitRow label="상대 0x20" bits={THEIRS} show={(slot) => slot < scene.shown} tone="#2563eb" />
            <BitRow label="SDA에 보이는 값" bits={THEIRS} show={(slot) => slot < scene.shown} tone="#64748b" />
            <div className="mt-3 grid grid-cols-[minmax(0,3fr)_minmax(0,2fr)] gap-1 text-center text-xs font-semibold" style={active === 3 ? undefined : { visibility: "hidden" }}>
              <span className="rounded border border-dashed px-1 py-2 leading-4" style={{ borderColor: "#2563eb", color: "#2563eb" }}>상대 거래 전체 (길이 미정)</span>
              <span className="rounded border px-1 py-2 leading-4" style={{ borderColor: "#d97706", color: "#d97706" }}>우리 거래 157.5 µs</span>
            </div>
          </div>
        );
      }}
    />
  );
}
