import SceneShell from "./SceneShell";

/**
 * 본문 대응: #mux, #picture, #why — 출력 데이터 1, 기능 선택 SIO, 출력 허용 1이 함께 맞아야 한다.
 * 세 칸은 조건이며 회로 배치도가 아니다.
 */
type Pin = "high" | "low" | "none";

interface Scene {
  label: string;
  summary: string;
  note: string;
  latch: boolean;
  sio: boolean;
  enabled: boolean;
  pin: Pin;
  pinText: string;
}

const SCENES: readonly Scene[] = [
  { label: "값만 1", summary: "래치 1 · 핀은 그대로", latch: true, sio: false, enabled: false, pin: "none", pinText: "SIO 래치가 핀에 영향을 주지 못함", note: "출력 래치에 1을 저장해도 다른 두 칸이 맞지 않으면 저장으로 끝납니다. 같은 연결점을 입력으로 쓰거나 다른 칩 내부 기능에 맡길 수 있기 때문입니다." },
  { label: "기능까지 선택", summary: "허용이 꺼져 있음", latch: true, sio: true, enabled: false, pin: "none", pinText: "칩이 직접 구동하지 않음", note: "출력이 꺼졌다고 반드시 0 V인 것은 아닙니다. 칩이 구동을 멈춘 상태이므로 바깥 회로나 약한 당김 설정이 전압을 정할 수 있습니다." },
  { label: "허용만 켜짐", summary: "기능이 SIO가 아님", latch: true, sio: false, enabled: true, pin: "none", pinText: "SIO 래치가 핀에 영향을 주지 못함", note: "SIO 기능을 선택한 뒤 출력 허용을 켜야 이 래치가 핀에 영향을 줍니다. 허용만 켜서는 값이 핀으로 이어지지 않습니다." },
  { label: "셋 다 맞음", summary: "1 · SIO · 허용", latch: true, sio: true, enabled: true, pin: "high", pinText: "칩이 높게 구동", note: "패드 전기 설정이 올바르다고 둔 결과입니다(가정). 표시등이 켜지는지는 배선과 극성, 전류 제한까지 알아야 합니다." },
  { label: "값이 0이면", summary: "0 · SIO · 허용", latch: false, sio: true, enabled: true, pin: "low", pinText: "칩이 낮게 구동", note: "출력 허용은 높게 만드는 스위치가 아니라 저장한 값을 내보내는 스위치입니다. 값이 0이면 같은 두 설정에서 낮게 구동합니다." },
];

function Condition({ name, register, address, state, ok }: { name: string; register: string; address: string; state: string; ok: boolean }) {
  return (
    <div className={`flex min-w-0 items-center justify-between gap-2 rounded-lg border px-3 py-1.5 sm:block sm:py-2 ${ok ? "border-amber-600 bg-background" : "border-dashed border-border"}`}>
      <div className="min-w-0">
        <span className="block text-xs text-muted-foreground">{name}</span>
        <strong className={`block text-sm sm:mt-1 ${ok ? "text-amber-700 dark:text-amber-400" : "text-muted-foreground"}`}>{ok ? "✓ " : "✕ "}{state}</strong>
      </div>
      <span className="block shrink-0 text-right font-mono text-[11px] leading-4 text-muted-foreground sm:mt-1 sm:text-left">{register}<br />{address}</span>
    </div>
  );
}

export default function PinConditionsViz() {
  return (
    <SceneShell
      eyebrow="GPIO5를 SIO로 내보내는 조건"
      title="값·기능·허용이 모두 맞아야 높게 구동됩니다"
      description="구동은 칩이 직접 밀고 당기는 동작입니다. 세 칸은 조건이며 회로 배치도가 아닙니다."
      ariaLabel="출력 래치, 기능 선택, 출력 허용의 조합에 따른 GPIO5 상태"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const pinClass = scene.pin === "high" ? "border-amber-600 bg-amber-500 text-black" : scene.pin === "low" ? "border-slate-500 bg-slate-500 text-white" : "border-dashed border-border text-muted-foreground";
        return (
          <div className="min-w-0">
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              <Condition name="출력 래치" register={scene.latch ? "GPIO_OUT_SET" : "GPIO_OUT_CLR"} address={scene.latch ? "0xD0000014" : "0xD0000018"} state={scene.latch ? "값 1" : "값 0"} ok={scene.latch} />
              <Condition name="기능 선택" register="GPIO5_CTRL" address="0x4001402C" state={scene.sio ? "SIO" : "SIO 아님"} ok={scene.sio} />
              <Condition name="출력 허용" register="GPIO_OE_SET" address="0xD0000024" state={scene.enabled ? "켜짐" : "꺼짐"} ok={scene.enabled} />
            </div>
            <p className="my-2 text-center text-xs text-muted-foreground">↓ GPIO5 연결점</p>
            <div className={`rounded-lg border px-3 py-3 text-center text-sm font-bold ${pinClass}`}>{scene.pinText}</div>
          </div>
        );
      }}
    />
  );
}
