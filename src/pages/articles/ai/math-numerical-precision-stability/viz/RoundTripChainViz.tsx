import SceneShell from "./SceneShell";

/**
 * 본문 대응: #code-storage — 덧셈은 Python 실수 계산, 저장은 pack 경로, 읽기는 unpack이다.
 * 함수 이름은 고정한 CPython v3.9.6 원문, 3c00·3c01·3c02는 본문의 실행 결과입니다.
 */
const STEPS = [
  { code: "저장값 + δ", role: "Python의 일반 실수 덧셈", scenes: [0] },
  { code: "struct.pack('>e', x)", role: "binary16 저장 요청", scenes: [1] },
  { code: "bp_halffloat → pack_halffloat", role: "형식 표 e, C double로 읽기", scenes: [1] },
  { code: "_PyFloat_Pack2", role: "두 바이트 만들기", scenes: [1, 2] },
  { code: "struct.unpack('>e', …)[0]", role: "다시 읽은 값 q₁₆", scenes: [3] },
] as const;

const RESULTS = [
  ["순서대로", "3c00", "1"],
  ["묶어서", "3c01", "1+2δ"],
  ["옆의 tie", "3c02", "1+4δ"],
] as const;

const SCENES = [
  { label: "덧셈", summary: "저장 전의 계산", note: "저장 사이의 덧셈은 Python의 일반 실수 계산입니다. GPU의 FP16 덧셈을 실행한 실험이 아닙니다." },
  { label: "저장 호출 경로", summary: "pack → _PyFloat_Pack2", note: "형식 문자 e가 bp_halffloat에 연결되고 pack_halffloat가 값을 C double로 읽어 저장 함수에 넘깁니다." },
  { label: "두 바이트", summary: "큰 바이트부터 2개", note: "반올림은 이 함수 안에서 일어납니다. 화면의 소수가 아니라 이 두 바이트를 직접 대조했습니다." },
  { label: "다시 읽어 다음 덧셈으로", summary: "q₁₆ = pack 뒤 unpack", note: "읽은 값이 다음 덧셈의 출발점입니다. 변환을 덧셈마다 부르므로 저장 시점이 코드에 드러납니다." },
] as const;

export default function RoundTripChainViz() {
  return (
    <SceneShell
      eyebrow="실행 예제의 왕복"
      title="덧셈과 저장을 따로 불러야 두 번의 반올림이 됩니다"
      description="위에서 아래로 한 번의 왕복입니다."
      note="CPython 3.9.6에서 실행한 저장 변환의 결과입니다."
      ariaLabel="덧셈 뒤 두 바이트로 저장하고 다시 읽는 호출 경로"
      scenes={SCENES}
      render={(active) => (
        <div className="flex min-w-0 flex-col gap-1">
          {STEPS.map((step) => {
            const on = (step.scenes as readonly number[]).includes(active);
            return (
              <div key={step.code} className={`flex min-w-0 flex-wrap items-baseline gap-x-2 rounded border px-3 py-1 ${on ? "border-primary" : "border-border"}`}>
                <p className={`break-all font-mono text-xs font-bold ${on ? "text-primary" : "text-muted-foreground"}`}>{step.code}</p>
                <p className="text-xs text-muted-foreground">{step.role}</p>
              </div>
            );
          })}
          <div className="mt-1 grid grid-cols-3 gap-1 text-center">
            {RESULTS.map(([name, bytes, value]) => (
              <div key={bytes} className={`rounded border px-1 py-1 ${active === 2 ? "border-primary" : "border-border"}`}>
                <p className="text-[11px] leading-4 text-muted-foreground">{name}</p>
                <p className={`font-mono text-xs font-bold ${active === 2 ? "text-primary" : "text-foreground"}`}>{bytes}</p>
                <p className="font-mono text-xs text-muted-foreground">{value}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    />
  );
}
