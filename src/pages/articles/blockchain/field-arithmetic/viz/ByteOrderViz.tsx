import FieldSceneShell from "./FieldSceneShell";

/**
 * 본문 대응: #representation — 두 바이트 [0x05, 0x01]을 읽는 두 약속.
 * little-endian: 앞 바이트가 낮은 자리 → 5×1 + 1×256 = 261.
 * big-endian: 앞 바이트가 높은 자리 → 5×256 + 1×1 = 1281.
 */
const BYTES = [5, 1] as const;

const SCENES = [
  { label: "little-endian: 앞 바이트가 낮은 자리", summary: "5×1 + 1×256 = 261", weights: [1, 256], note: "앞에 온 0x05에 1을, 뒤에 온 0x01에 256을 곱합니다. 위 limb 배열을 낮은 자리부터 저장한 것과 같은 방향입니다." },
  { label: "big-endian: 앞 바이트가 높은 자리", summary: "5×256 + 1×1 = 1281", weights: [256, 1], note: "같은 두 바이트라도 앞에 온 0x05에 256을 곱하고 0x01을 더하면 1281입니다. 내부 limb가 낮은 자리부터라는 사실이 이 외부 순서를 정해 주지 않습니다." },
] as const;

export default function ByteOrderViz() {
  return (
    <FieldSceneShell
      eyebrow="바이트 순서"
      title="같은 두 바이트도 어느 쪽을 높은 자리로 읽는지에 따라 다른 수가 됩니다"
      description="little-endian은 앞 바이트를 낮은 자리로, big-endian은 앞 바이트를 높은 자리로 읽는 약속입니다. 한 바이트의 자리 값은 256배씩 커집니다."
      ariaLabel="바이트 0x05, 0x01을 little-endian과 big-endian으로 읽은 값 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const weights = scene.weights as readonly number[];
        return (
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">받은 순서대로 놓은 바이트</p>
            <div className="mt-1 grid grid-cols-2 gap-3">
              {BYTES.map((byte, index) => {
                const high = weights[index] === 256;
                return (
                  <div key={index} className={`rounded-lg border px-2 py-3 text-center ${high ? "border-primary" : "border-border"}`}>
                    <span className="block text-[11px] text-muted-foreground">{index === 0 ? "첫 바이트" : "둘째 바이트"}</span>
                    <span className="mt-1 block font-mono text-lg font-bold">0x0{byte}</span>
                    <span className={`mt-1 block text-xs font-semibold ${high ? "text-primary" : "text-muted-foreground"}`}>
                      {high ? "높은 자리 × 256" : "낮은 자리 × 1"}
                    </span>
                    <span className="mt-1 block font-mono text-sm">= {byte * weights[index]}</span>
                  </div>
                );
              })}
            </div>
            <div className="mt-3 rounded-lg border border-dashed border-border px-3 py-2 text-center font-mono text-base font-bold">
              {BYTES.map((byte, index) => byte * weights[index]).join(" + ")} = {BYTES.reduce<number>((sum, byte, index) => sum + byte * weights[index], 0)}
            </div>
          </div>
        );
      }}
    />
  );
}
