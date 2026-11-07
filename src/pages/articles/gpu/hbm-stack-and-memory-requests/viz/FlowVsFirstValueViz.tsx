import SceneShell from "./SceneShell";

/**
 * 본문 대응: #source — 768B ÷ 1.024TB/s = 0.75ns. 1.024TB/s는 1ns에 1,024B입니다.
 * 입력 256B + 입력 256B + 출력 256B = 768B. 앞쪽 대기 구간의 길이는 글에 없어 축척을 쓰지 않습니다.
 */
const SCENES = [
  { label: "물량을 나눈 값", summary: "768B ÷ 1,024B/ns = 0.75ns", note: "1.024TB/s는 1ns에 1,024바이트를 옮기는 속도입니다. 768바이트는 그 4분의 3을 채웁니다. 칸은 물량의 몫이며 실행 순서가 아닙니다. 통로가 가득 찬 정상 상태를 놓고 계산한 비율입니다." },
  { label: "첫 값 앞에 놓인 구간", summary: "대기는 0.75ns에 없음", note: "요청과 주소 해석, 행 동작, 돌아오는 대기는 0.75ns와 별도입니다. 그래서 한 kernel이나 첫 응답이 0.75ns에 끝난다는 예측이 아닙니다. 점선 칸의 길이는 글에 수치가 없어 같은 크기로 그렸을 뿐입니다." },
] as const;

const CHUNKS = ["입력 256B", "입력 256B", "출력 256B"];
const WAITS = ["요청·주소 해석", "행 동작", "돌아오는 대기"];
const X0 = 8;
const CELL = 86;

export default function FlowVsFirstValueViz() {
  return (
    <SceneShell
      eyebrow="처리량과 대기"
      title="0.75ns는 물량을 나눈 값이지 첫 값이 오는 시간이 아닙니다"
      description="스택 하나에 앞서 구한 이론상 상한 1.024TB/s를 씁니다. 사례는 64개 덧셈의 유효 768바이트입니다."
      ariaLabel="768바이트를 1.024테라바이트 매초로 나눈 0.75나노초와 그 앞의 대기 구간 구분"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox="0 0 360 132" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          {active === 0 ? (
            <>
              <text x={X0} y={16} fontSize={12} fontWeight={700} fill="#64748b">1ns 동안 옮길 수 있는 1,024B</text>
              {CHUNKS.map((chunk, index) => (
                <g key={index}>
                  <rect x={X0 + index * CELL} y={28} width={CELL - 2} height={44} rx={2} fill="#2563eb" />
                  <text x={X0 + index * CELL + 42} y={55} textAnchor="middle" fontSize={12} fontWeight={700} fill="#ffffff">{chunk}</text>
                </g>
              ))}
              <rect x={X0 + 3 * CELL} y={28} width={CELL - 2} height={44} rx={2} fill="none" stroke="#94a3b8" strokeWidth={1} strokeDasharray="3 3" />
              <text x={X0 + 3 * CELL + 42} y={55} textAnchor="middle" fontSize={12} fill="#64748b">남은 256B</text>
              <path d={`M${X0} 84v6h${3 * CELL - 2}v-6`} fill="none" stroke="#2563eb" strokeWidth={1} />
              <text x={X0 + (3 * CELL) / 2} y={108} textAnchor="middle" fontSize={13} fontWeight={700} fill="#2563eb">768B = 0.75ns</text>
              <text x={X0 + 3.5 * CELL} y={108} textAnchor="middle" fontSize={12} fill="#64748b">0.25ns</text>
            </>
          ) : (
            <>
              <text x={X0} y={16} fontSize={12} fontWeight={700} fill="#64748b">시간 → (축척 없음)</text>
              {WAITS.map((wait, index) => (
                <g key={wait}>
                  <rect x={X0 + index * CELL} y={28} width={CELL - 2} height={44} rx={2} fill="none" stroke="#94a3b8" strokeWidth={1} strokeDasharray="3 3" />
                  <text x={X0 + index * CELL + 42} y={46} textAnchor="middle" fontSize={12} fill="#64748b">{wait}</text>
                  <text x={X0 + index * CELL + 42} y={62} textAnchor="middle" fontSize={12} fill="#64748b">길이 미정</text>
                </g>
              ))}
              <rect x={X0 + 3 * CELL} y={28} width={CELL - 2} height={44} rx={2} fill="#2563eb" />
              <text x={X0 + 3 * CELL + 42} y={46} textAnchor="middle" fontSize={12} fontWeight={700} fill="#ffffff">768B 흐름</text>
              <text x={X0 + 3 * CELL + 42} y={62} textAnchor="middle" fontSize={12} fill="#ffffff">0.75ns</text>
              <path d={`M${X0 + 3 * CELL} 84v-8m-3 3 3 -3 3 3`} fill="none" stroke="#2563eb" strokeWidth={1} />
              <text x={X0 + 3 * CELL + 6} y={104} textAnchor="middle" fontSize={13} fontWeight={700} fill="#2563eb">첫 값 도착</text>
            </>
          )}
        </svg>
      )}
    />
  );
}
