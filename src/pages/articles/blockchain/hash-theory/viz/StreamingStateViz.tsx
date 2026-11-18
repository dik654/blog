import type { ReactNode } from "react";
import SceneShell from "./HashSceneShell";

/**
 * 본문 대응: #streaming — Sha256VarCore는 여덟 상태값과 처리한 블록 수 block_len을, 바깥 버퍼는 64바이트가 안 된 나머지를 보관한다.
 * bit_len = 8×(버퍼 바이트 수 + 64×block_len). abc: 8×(3+64×0)=24. 64바이트 처리 후 빈 버퍼: 8×(0+64×1)=512.
 */
const SCENES = [
  { label: "a 받기", summary: "버퍼 1바이트 · 처리 블록 0", buffer: ["61"], blocks: 0, bits: null, wrong: false, note: "첫 조각 a는 64바이트가 안 되므로 버퍼에 남습니다. 아직 처리한 블록이 없으니 여덟 상태값도 시작값 그대로입니다." },
  { label: "bc 이어 받기", summary: "버퍼 3바이트 · 처리 블록 0", buffer: ["61", "62", "63"], blocks: 0, bits: null, wrong: false, note: "bc를 같은 버퍼 뒤에 이어 씁니다. 한 번에 abc를 받은 경우와 버퍼 내용이 같습니다." },
  { label: "한 번만 마무리", summary: "8×(3+64×0) = 24비트", buffer: ["61", "62", "63"], blocks: 0, bits: "8×(3+64×0) = 24", wrong: false, note: "끝낼 때 한 번만 총길이 24비트로 패딩합니다. 그래서 a 다음 bc로 보낸 결과가 abc를 한 번에 보낸 결과와 같습니다." },
  { label: "따로 끝내 이어 붙이기", summary: "H(a) ‖ H(bc) ≠ H(abc)", buffer: [], blocks: 0, bits: null, wrong: true, note: "a를 끝내 해시하고 bc를 따로 끝내 해시하면 두 번의 별개 계산입니다. 두 결과를 이어 붙여도 abc의 해시가 아닙니다." },
  { label: "64바이트를 처리한 뒤", summary: "8×(0+64×1) = 512비트", buffer: [], blocks: 1, bits: "8×(0+64×1) = 512", wrong: false, note: "64바이트를 받아 블록 하나를 처리하면 버퍼는 비지만 원래 길이는 512비트입니다. 버퍼만 보고 0길이의 패딩을 붙이면 틀린 결과가 됩니다." },
] as const;

function Box({ title, children, dim = false }: { title: string; children: ReactNode; dim?: boolean }) {
  return (
    <div className={`min-w-0 rounded-lg border p-2 sm:p-3 ${dim ? "border-dashed border-border/60" : "border-border"}`}>
      <p className="text-[11px] font-semibold text-muted-foreground">{title}</p>
      <div className="mt-2 min-w-0">{children}</div>
    </div>
  );
}

export default function StreamingStateViz() {
  return (
    <SceneShell
      eyebrow="나누어 받기"
      title="버퍼와 처리한 블록 수를 함께 세야 총길이가 맞습니다"
      description="왼쪽은 아직 64바이트가 안 된 바깥 버퍼, 가운데는 처리한 블록 수 block_len, 오른쪽은 마무리할 때 쓰는 비트 길이 bit_len입니다."
      ariaLabel="abc를 a와 bc로 나누어 받을 때 버퍼, 처리 블록 수, 최종 비트 길이"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        if (scene.wrong) {
          return (
            <div className="grid min-w-0 gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
              <Box title="계산 1 · 입력 a">
                <p className="font-mono text-sm">61 → 끝냄 → H(a) 32바이트</p>
              </Box>
              <p className="text-center font-mono text-lg font-bold">‖</p>
              <Box title="계산 2 · 입력 bc">
                <p className="font-mono text-sm">62 63 → 끝냄 → H(bc) 32바이트</p>
              </Box>
              <p className="rounded-md border border-dashed border-[#dc2626] p-2 text-center text-sm font-semibold text-[#dc2626] sm:col-span-3">
                64바이트 이어 붙인 값 ≠ abc의 해시
              </p>
            </div>
          );
        }
        return (
          <div className="grid min-w-0 grid-cols-3 gap-2 sm:gap-3">
            <Box title="바깥 버퍼">
              <div className="flex min-h-8 flex-wrap gap-1">
                {scene.buffer.length === 0 ? (
                  <span className="text-xs text-muted-foreground sm:text-sm">비어 있음</span>
                ) : (
                  scene.buffer.map((byte, i) => (
                    <span key={i} className="rounded border border-[#2563eb] px-1 py-0.5 font-mono text-xs text-[#2563eb] sm:text-sm">
                      {byte}
                    </span>
                  ))
                )}
              </div>
            </Box>
            <Box title="block_len">
              <p className="font-mono text-xl font-bold sm:text-2xl">{scene.blocks}</p>
              <p className="text-xs text-muted-foreground">
                {scene.blocks === 0 ? "상태값은 시작값 그대로" : "64바이트 블록 하나를 상태에 섞음"}
              </p>
            </Box>
            <Box title="bit_len" dim={scene.bits === null}>
              <p className="break-words font-mono text-[11px] font-semibold sm:text-sm">{scene.bits === null ? "아직 끝내지 않음" : scene.bits.split(" = ").map((part, i) => <span key={part} className="block whitespace-nowrap">{i > 0 ? `= ${part}` : part}</span>)}</p>
            </Box>
          </div>
        );
      }}
    />
  );
}
