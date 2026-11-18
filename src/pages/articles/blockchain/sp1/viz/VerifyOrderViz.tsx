import Sp1SceneShell from "./Sp1SceneShell";

/**
 * 본문 대응: #verification — SDK verifier는 version을 먼저 보고, mode에 따라 PV hash를 다른 곳에서 확인한 뒤,
 * 마지막에 기대 VK로 proof를 검증합니다. 그 뒤 application이 decode(PV)=[10,55,89]를 판정합니다.
 * 실패 장면: version 변경(VersionMismatch), 다른 ELF의 VK(mode verifier reject), 10·55·90을 공개한 유효 proof(app reject).
 */
type Mode = "native" | "wrap";

interface VerifyScene {
  label: string;
  summary: string;
  note: string;
  mode: Mode;
  fail: 1 | 3 | 4 | null;
}

const SCENES: readonly VerifyScene[] = [
  { label: "Core 계열 경로", summary: "Core·Compressed: 네 단계 통과", mode: "native", fail: null, note: "Core와 Compressed에서는 proof 안의 committed-value digest가 public values의 hash와 같은지 봅니다. 그 뒤 기대 VK로 proof를 검증하고, application이 10·55·89인지 판정합니다." },
  { label: "Wrapper 경로", summary: "PLONK·Groth16: 네 단계 통과", mode: "wrap", fail: null, note: "PLONK와 Groth16에서는 wrapper 공개입력에서 public-values hash와 exit code를 읽습니다. 나머지 순서는 같습니다." },
  { label: "version이 다름", summary: "① VersionMismatch", mode: "native", fail: 1, note: "proof bundle의 SP1 version이 현재 circuit version과 다르면 첫 단계에서 멈춥니다. 그림은 Core·Compressed 경로를 예로 들었습니다." },
  { label: "다른 ELF의 proof", summary: "③ mode verifier가 거절", mode: "native", fail: 3, note: "다른 Fibonacci program의 유효 proof는 application이 기대한 VK로 검증되지 않아 거절됩니다. 결과 숫자가 같아도 마찬가지입니다." },
  { label: "10·55·90 공개", summary: "①–③ 통과, ④ application이 거절", mode: "native", fail: 4, note: "10·55·90을 공개한 유효 proof는 암호 검증을 통과할 수 있습니다. 그 값을 기대값 [10,55,89]와 비교해 거절하는 것은 application의 몫입니다." },
];

const OK = "#0f766e";
const BAD = "#dc2626";
const LINE = "#94a3b8";
const TEXT = "#334155";
const MUTED = "#64748b";
const ACCENT = "#2563eb";

type NodeState = "pass" | "fail" | "idle";

function Node({ x, y, w, h, lines, state, dim }: { x: number; y: number; w: number; h: number; lines: readonly string[]; state: NodeState; dim: boolean }) {
  const stroke = state === "fail" ? BAD : state === "pass" ? ACCENT : LINE;
  return (
    <g opacity={dim ? 0.35 : 1}>
      <rect x={x} y={y} width={w} height={h} rx={8} fill="#ffffff" stroke={stroke} strokeWidth={state === "idle" ? 1 : 1.25} />
      {lines.map((line, index) => (
        <text key={line} x={x + 10} y={y + 17 + index * 15} fontSize={index === 0 ? 11 : 10} fontWeight={index === 0 ? 700 : 400} fill={index === 0 ? TEXT : MUTED}>{line}</text>
      ))}
      {state !== "idle" && (
        <text x={x + w - 10} y={y + 17} textAnchor="end" fontSize={12} fontWeight={700} fill={state === "fail" ? BAD : OK}>{state === "fail" ? "✗" : "✓"}</text>
      )}
    </g>
  );
}

function Arrow({ x1, y1, x2, y2, dim }: { x1: number; y1: number; x2: number; y2: number; dim: boolean }) {
  return (
    <g opacity={dim ? 0.3 : 1}>
      <line x1={x1} y1={y1} x2={x2} y2={y2 - 4} stroke={LINE} strokeWidth={1} />
      <path d={`M ${x2 - 4} ${y2 - 6} L ${x2} ${y2} L ${x2 + 4} ${y2 - 6}`} fill="none" stroke={LINE} strokeWidth={1} />
    </g>
  );
}

export default function VerifyOrderViz() {
  return (
    <Sp1SceneShell
      eyebrow="검증 순서"
      title="Proof는 네 단계를 차례로 지나고 mode에 따라 둘째 단계만 갈립니다"
      description="위에서 아래로 검사가 진행됩니다. ✗가 나온 단계에서 멈추고 그 아래는 흐리게 표시합니다. PV는 guest가 commit한 public values입니다."
      ariaLabel="SP1 proof 검증 단계와 proof mode별 분기, 실패 위치"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const state = (step: 1 | 2 | 3 | 4): NodeState => {
          if (scene.fail === null) return "pass";
          if (step < scene.fail) return "pass";
          if (step === scene.fail) return "fail";
          return "idle";
        };
        const after = (step: number) => scene.fail !== null && step > scene.fail;
        const leftOff = scene.mode !== "native";
        const rightOff = scene.mode !== "wrap";
        return (
          <svg viewBox="0 0 360 284" className="mx-auto h-auto w-full max-w-[420px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <Node x={30} y={8} w={300} h={42} lines={["① version 확인", "proof의 SP1 version = 현재 circuit version"]} state={state(1)} dim={false} />
            <Arrow x1={140} y1={50} x2={93} y2={80} dim={after(1) || leftOff} />
            <Arrow x1={220} y1={50} x2={267} y2={80} dim={after(1) || rightOff} />
            <Node x={12} y={80} w={162} h={62} lines={["② Core·Compressed", "proof 안 digest", "= PV의 hash"]} state={leftOff ? "idle" : state(2)} dim={after(1) || leftOff} />
            <Node x={186} y={80} w={162} h={62} lines={["② PLONK·Groth16", "wrapper 공개입력에서", "PV hash·exit 읽기"]} state={rightOff ? "idle" : state(2)} dim={after(1) || rightOff} />
            <Arrow x1={93} y1={142} x2={150} y2={166} dim={after(2) || leftOff} />
            <Arrow x1={267} y1={142} x2={210} y2={166} dim={after(2) || rightOff} />
            <Node x={30} y={166} w={300} h={42} lines={["③ 기대 VK로 proof 검증", "application이 허용한 ELF의 verification key"]} state={state(3)} dim={after(2)} />
            <Arrow x1={180} y1={208} x2={180} y2={232} dim={after(3)} />
            <Node x={30} y={232} w={300} h={42} lines={["④ application 판정", "decode(PV) = [10, 55, 89] ?"]} state={state(4)} dim={after(3)} />
          </svg>
        );
      }}
    />
  );
}
