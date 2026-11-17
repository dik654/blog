import SceneShell from "./SceneShell";

/**
 * 본문 대응: #overview 둘째 문단 — 프로그램들은 서로 명령을 보내지 않고 API 리소스를 읽고 결과를 다시 기록한다.
 * 왼쪽 = API에 저장된 기록 다섯 줄, 오른쪽 = 그 기록을 읽고 쓰는 주체.
 * 장면 i에서 주체 i는 기록 i−1을 읽고(점선) 기록 i를 씁니다(실선). 주체끼리 잇는 선은 없습니다.
 */
const RECORDS = [
  "Deployment · replicas 3",
  "세 번째 Pod 객체",
  "세 번째 Pod · nodeName",
  "세 번째 Pod · Ready 조건",
  "EndpointSlice · 세 번째 Pod 주소",
] as const;

const ACTORS = [
  ["사용자"],
  ["controller"],
  ["scheduler"],
  ["kubelet"],
  ["EndpointSlice", "controller"],
] as const;

const SCENES = [
  {
    label: "원하는 상태 저장",
    summary: "쓰기: replicas 3",
    note: "사용자는 replicas: 3이라는 원하는 상태를 API에 저장할 뿐입니다. 이 시점에는 세 번째 Pod 객체도, 실행할 Node도, 요청 주소도 아직 기록되어 있지 않습니다.",
  },
  {
    label: "controller가 Pod 객체를 기록",
    summary: "읽기 replicas 3 → 쓰기 세 번째 Pod",
    note: "controller는 원하는 상태와 현재 상태의 차이를 반복해서 줄이는 프로그램입니다. 목표 3개와 존재하는 Pod 2개의 차이를 읽고 세 번째 Pod 객체를 기록합니다. 어느 Node에서 돌지는 아직 비어 있습니다.",
  },
  {
    label: "scheduler가 Node 이름을 기록",
    summary: "읽기 세 번째 Pod → 쓰기 nodeName",
    note: "scheduler는 Pod를 실행할 Node를 고르는 프로그램입니다. Node가 비어 있는 세 번째 Pod를 읽고 고른 Node 이름을 그 Pod에 적습니다. controller에게 명령을 받은 것이 아니라 기록을 보고 움직였습니다.",
  },
  {
    label: "kubelet이 실행 결과를 기록",
    summary: "읽기 nodeName → 쓰기 Ready",
    note: "kubelet은 각 Node에서 컨테이너·네트워크·볼륨을 준비하는 프로그램입니다. 자기 Node 이름이 적힌 세 번째 Pod를 읽고 실행을 준비한 뒤, 준비 검사 결과를 Pod 상태로 기록합니다.",
  },
  {
    label: "요청 후보에 주소를 기록",
    summary: "읽기 Ready → 쓰기 주소",
    note: "EndpointSlice controller는 준비 검사를 통과한 세 번째 Pod의 주소를 요청 후보 기록에 넣습니다. 실제 요청은 Node의 데이터 경로가 전달합니다. 네 프로그램 모두 서로에게 직접 명령하지 않고 같은 기록을 읽고 썼습니다.",
  },
] as const;

const ROW_Y = [64, 108, 152, 196, 240] as const;
const API_RIGHT = 188;
const ACTOR_LEFT = 268;

function rowY(index: number) {
  return (ROW_Y as readonly number[])[index] ?? 0;
}

export default function SharedRecordViz() {
  return (
    <SceneShell
      eyebrow="공용 기록"
      title="프로그램끼리 명령을 주고받지 않고 같은 기록을 읽고 씁니다"
      description="왼쪽은 API server에 저장된 기록, 오른쪽은 그 기록을 바꾸는 주체입니다. 점선은 읽기, 실선은 쓰기입니다. 오른쪽 주체끼리 직접 잇는 선은 없습니다."
      ariaLabel="사용자, controller, scheduler, kubelet, EndpointSlice controller가 API 기록을 차례로 읽고 쓰는 과정"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox="0 0 400 270" className="mx-auto block w-full max-w-[22rem]" role="img" aria-label="API 기록과 그 기록을 읽고 쓰는 주체">
          <defs>
            <marker id="k8s-shared-write" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
              <path d="M0 0L7 3.5L0 7Z" fill="#2563eb" />
            </marker>
            <marker id="k8s-shared-read" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
              <path d="M0 0L7 3.5L0 7Z" fill="#64748b" />
            </marker>
          </defs>
          <text x="100" y="22" textAnchor="middle" fontSize="11" fontWeight="700" fill="currentColor">API server에 저장된 기록</text>
          <text x="328" y="22" textAnchor="middle" fontSize="11" fontWeight="700" fill="currentColor">기록을 바꾸는 주체</text>
          <rect x="12" y="34" width="176" height="230" rx="10" fill="none" stroke="#94a3b8" strokeWidth="1" />
          {RECORDS.map((record, index) => {
            const written = index <= active;
            const current = index === active;
            const read = index === active - 1;
            const stroke = current ? "#2563eb" : read ? "#64748b" : written ? "#94a3b8" : "#cbd5e1";
            const fill = current ? "#2563eb1f" : written ? "#94a3b81f" : "none";
            return (
              <g key={record}>
                <rect x="22" y={rowY(index) - 16} width="156" height="32" rx="8" fill={fill} stroke={stroke} strokeWidth={current ? 1.25 : 1} strokeDasharray={written ? undefined : "4 3"} />
                <text x="100" y={rowY(index) + 4} textAnchor="middle" fontSize="10" fontWeight={current ? 700 : 500} fill={current ? "#2563eb" : "currentColor"} opacity={written ? 1 : 0.4}>
                  {written ? record : "아직 비어 있음"}
                </text>
              </g>
            );
          })}
          {ACTORS.map((lines, index) => {
            const current = index === active;
            return (
              <g key={lines.join(" ")} opacity={current ? 1 : 0.45}>
                <rect x={ACTOR_LEFT} y={rowY(index) - 16} width="120" height="32" rx="8" fill={current ? "#2563eb14" : "none"} stroke={current ? "#2563eb" : "#94a3b8"} strokeWidth={current ? 1.25 : 1} />
                {lines.map((line, lineIndex) => (
                  <text
                    key={line}
                    x={ACTOR_LEFT + 60}
                    y={rowY(index) + (lines.length === 1 ? 4 : lineIndex === 0 ? -2 : 10)}
                    textAnchor="middle"
                    fontSize="10"
                    fontWeight="700"
                    fill={current ? "#2563eb" : "currentColor"}
                  >
                    {line}
                  </text>
                ))}
              </g>
            );
          })}
          {active > 0 ? (
            <line
              x1={API_RIGHT - 8}
              y1={rowY(active - 1) + 6}
              x2={ACTOR_LEFT - 4}
              y2={rowY(active) - 8}
              stroke="#64748b"
              strokeWidth="1.25"
              strokeDasharray="4 3"
              markerEnd="url(#k8s-shared-read)"
            />
          ) : null}
          <line
            x1={ACTOR_LEFT - 2}
            y1={rowY(active) + 6}
            x2={API_RIGHT - 6}
            y2={rowY(active) + 6}
            stroke="#2563eb"
            strokeWidth="1.25"
            markerEnd="url(#k8s-shared-write)"
          />
          <text x="228" y={rowY(active) + 20} textAnchor="middle" fontSize="9" fontWeight="700" fill="#2563eb">쓰기</text>
          {active > 0 ? (
            <text x="210" y={rowY(active) - 31} textAnchor="middle" fontSize="9" fontWeight="700" fill="#64748b">읽기</text>
          ) : null}
        </svg>
      )}
    />
  );
}
