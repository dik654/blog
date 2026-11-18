import SceneShell from "./SceneShell";

/**
 * 본문 대응: #release — 실패를 경계별로 나눠 처리하고 receipt에 따로 남긴다.
 * 위 다섯 칸 = 경계(아래 작은 글씨 = 그 경계를 기록하는 receipt 칸). 표시된 칸에서 실패가 났을 때의 처리.
 * path: Inactive/Unusable 뒤 남은 usable 후보로 다시 선택할 수 있음(2절 caveat).
 * endpoint ID mismatch·unknown ALPN: fail closed. stream reset: 연결·애플리케이션 경계를 나눠 재시도 결정.
 * hash mismatch: publish 하지 않는 payload 실패.
 */
const W = 360;
const H = 206;
const COL_W = 62;
const COL_X: readonly number[] = [10, 79, 148, 217, 286];
const COLS = [
  { name: "경로", field: "path · tier" },
  { name: "신원", field: "endpoint ID" },
  { name: "ALPN", field: "negotiated" },
  { name: "stream", field: "마지막 오류" },
  { name: "payload", field: "hash 판정" },
] as const;

const RETRY = "#d97706";
const CLOSE = "#dc2626";
const SPLIT = "#7c3aed";
const ALL = "#2563eb";

const SCENES = [
  { label: "path가 사라지거나 못 씀", summary: "Inactive · Unusable", col: 0, color: RETRY, lines: ["열렸던 path가 사라짐 → Inactive", "hole punching 했지만 한 번도 못 씀 → Unusable"], verdict: "남은 usable 후보로 다시 고를 수 있음", note: "열렸던 path가 사라지면 Inactive, hole punching을 시도했지만 한 번도 못 썼다면 Unusable입니다. selector는 남은 usable 후보로 다시 고를 수 있고(2절), 오래된 inactive와 unusable non-relay path는 pruning 대상이 될 수 있습니다." },
  { label: "endpoint ID 불일치", summary: "다른 IP로 재시도하지 않음", col: 1, color: CLOSE, lines: ["상대의 endpoint key가 기대한 Bob이 아님", "주소를 바꿔도 신원은 그대로 틀림"], verdict: "fail closed", note: "상대 신원이 틀렸다면 다른 IP로 재시도하면 될 일이 아닙니다. 연결을 닫고 remote endpoint ID 칸에 남깁니다." },
  { label: "지원하지 않는 ALPN", summary: "fail closed", col: 2, color: CLOSE, lines: ["등록된 ProtocolHandler가 없는 ALPN", "프로토콜 계약이 맞지 않음"], verdict: "fail closed", note: "ALPN은 연결이 도착한 뒤 처리기를 고르는 이름입니다. 지원하지 않는 ALPN도 프로토콜 계약이 틀린 것이라 fail closed 하고, negotiated ALPN 칸으로 추적합니다." },
  { label: "stream reset", summary: "경계를 나눠 재시도 결정", col: 3, color: SPLIT, lines: ["연결 경계의 reset인가", "애플리케이션 경계의 reset인가"], verdict: "어느 경계인지 나눈 뒤 재시도 여부 결정", note: "stream reset은 한 가지 처리로 묶지 않습니다. 연결 경계와 애플리케이션 경계를 나눠 재시도할지 정하고, 마지막 오류 칸에 남깁니다." },
  { label: "hash 불일치", summary: "publish 하지 않음", col: 4, color: CLOSE, lines: ["hash(received) ≠ H", "연결과 프로토콜은 정상이었어도"], verdict: "그 보고서를 공개하지 않는 payload 실패", note: "받은 byte의 hash가 기대 hash H와 다르면 연결이 성공했어도 보고서를 publish하지 않습니다. 연결 실패가 아니라 payload 실패로 남깁니다." },
  { label: "receipt 다섯 칸", summary: "어느 경계가 무너졌는지 추적", col: -1, color: ALL, lines: ["selected path와 tier · remote endpoint ID", "negotiated ALPN · 마지막 오류 · payload hash 판정"], verdict: "하나의 “다운로드 실패”로 뭉치지 않음", note: "release test는 direct 성공, relay fallback, same-tier flapping, address lookup 실패, endpoint ID mismatch, unknown ALPN, stream reset, hash mismatch를 따로 재현합니다. 다섯 칸이 각각 남아 있어야 어느 경계가 무너졌는지 가려집니다." },
] as const;

export default function FailureBoundaryViz() {
  return (
    <SceneShell
      eyebrow="경계별 실패"
      title="어느 칸에서 실패했는지에 따라 처리가 갈립니다"
      description="위 다섯 칸은 급여 보고서 요청이 지나는 경계이고, 칸 아래 작은 글씨는 그 경계를 기록하는 receipt 항목입니다. 색과 함께 처리 문구를 적었습니다."
      ariaLabel="경로, 신원, ALPN, stream, payload 경계마다 실패했을 때의 처리와 receipt 항목"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[520px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            {COLS.map((col, index) => {
              const x = COL_X[index];
              const hit = scene.col === index || scene.col === -1;
              return (
                <g key={col.name} opacity={hit ? 1 : 0.4}>
                  <rect x={x} y={12} width={COL_W} height={50} rx={9} fill={hit ? `${scene.color}14` : "none"} stroke={hit ? scene.color : "#94a3b8"} strokeWidth={hit ? 1.25 : 1} />
                  <text x={x + COL_W / 2} y={33} textAnchor="middle" fontSize={11.5} fontWeight={700} fill={hit ? scene.color : "currentColor"}>{col.name}</text>
                  <text x={x + COL_W / 2} y={51} textAnchor="middle" fontSize={9} fill="currentColor" opacity={0.7}>{col.field}</text>
                  {index < COLS.length - 1 && <line x1={x + COL_W} x2={COL_X[index + 1]} y1={37} y2={37} stroke="#94a3b8" strokeWidth={1} />}
                </g>
              );
            })}
            {scene.col >= 0 ? (
              <line x1={(COL_X[scene.col] ?? 0) + COL_W / 2} x2={(COL_X[scene.col] ?? 0) + COL_W / 2} y1={62} y2={86} stroke={scene.color} strokeWidth={1.25} />
            ) : (
              <line x1={COL_X[0] + COL_W / 2} x2={COL_X[4] + COL_W / 2} y1={74} y2={74} stroke={scene.color} strokeWidth={1.25} />
            )}
            <rect x={10} y={86} width={340} height={66} rx={10} fill="none" stroke={scene.color} strokeWidth={1} />
            <text x={24} y={110} fontSize={11.5} fill="currentColor">{scene.lines[0]}</text>
            <text x={24} y={134} fontSize={11.5} fill="currentColor">{scene.lines[1]}</text>
            <rect x={10} y={164} width={340} height={32} rx={8} fill={`${scene.color}14`} />
            <text x={180} y={185} textAnchor="middle" fontSize={12} fontWeight={700} fill={scene.color}>처리 · {scene.verdict}</text>
          </svg>
        );
      }}
    />
  );
}
