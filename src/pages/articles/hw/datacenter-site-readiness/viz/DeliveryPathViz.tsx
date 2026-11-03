import StepViz from "@/components/ui/step-viz";

const C = {
  blue: "#2563eb",
  amber: "#d97706",
  violet: "#7c3aed",
  teal: "#0f766e",
  red: "#dc2626",
  ink: "#0f172a",
  muted: "#64748b",
  line: "#cbd5e1",
} as const;

const COLORS = [C.blue, C.amber, C.violet, C.teal, C.red] as const;

const STEPS = [
  {
    tabLabel: "하역·보관",
    label: "장비는 먼저 하역장과 잠금 가능한 임시 보관 구역을 통과해야 합니다",
    body: "설치실이 비어 있어도 팔레트를 안전하게 내리고 포장을 벗길 장소가 없으면 반입을 시작할 수 없습니다.",
  },
  {
    tabLabel: "포장 외형",
    label: "제품 외형이 아니라 포장 상태의 폭·높이·무게로 문과 승강기를 확인합니다",
    body: "가장 좁은 문, 가장 낮은 천장, 회전 반경, 엘리베이터 정격 중 하나라도 넘으면 그 경로는 탈락합니다.",
  },
  {
    tabLabel: "이동 하중",
    label: "최종 바닥의 정적 하중과 운반 중 바퀴에 실리는 이동·집중 하중은 다른 검사입니다",
    body: "설치 위치가 버텨도 경사로·이중 바닥·승강기 문턱이 운반 중 하중을 못 버틸 수 있습니다.",
  },
  {
    tabLabel: "설치·연결",
    label: "최종 위치에는 앵커·전원·network·냉각 접점과 정비 공간이 함께 남아야 합니다",
    body: "케이블 길이와 배관 굽힘, 문 개방, 부품을 빼는 앞뒤 공간을 rack elevation에 겹쳐 봅니다.",
  },
  {
    tabLabel: "Hold point",
    label: "SLD·rack elevation·P&ID·반입 동선이 같은 revision으로 승인된 뒤에만 반입합니다",
    body: "체크 표시가 아니라 문서 버전, 담당자, 측정 증거가 맞아야 통과하는 중지 지점입니다.",
  },
] as const;

const NODES = [
  ["받기", "하역·보관"],
  ["통과", "포장 외형"],
  ["이동", "rolling load"],
  ["설치", "연결·정비"],
  ["승인", "같은 revision"],
] as const;

function Mobile({ step }: { step: number }) {
  return (
    <svg className="block sm:!hidden" viewBox="0 0 300 410" role="img" aria-label="하역장에서 설치 승인까지 이어지는 다섯 관문">
      {NODES.map(([name, detail], index) => {
        const y = 15 + index * 72;
        const color = COLORS[index];
        return (
          <g key={name} opacity={index <= step ? 1 : 0.3}>
            {index > 0 && <line x1="150" y1={y - 20} x2="150" y2={y - 7} stroke={COLORS[index - 1]} />}
            {index > 0 && <circle cx="150" cy={y - 7} r="2.5" fill={COLORS[index - 1]} />}
            <rect x="42" y={y} width="216" height="51" rx="10" fill={index === step ? `${color}14` : "#f8fafc"} stroke={index <= step ? color : C.line} />
            <text x="58" y={y + 20} fontSize="9" fontWeight="900" fill={color}>{String(index + 1).padStart(2, "0")} · {name}</text>
            <text x="58" y={y + 39} fontSize="8.2" fill={C.muted}>{detail}</text>
          </g>
        );
      })}
      <text x="150" y="397" textAnchor="middle" fontSize="8.2" fontWeight="800" fill={C.ink}>하나라도 미승인이면 다음 관문으로 보내지 않습니다</text>
    </svg>
  );
}

function Desktop({ step }: { step: number }) {
  return (
    <svg className="!hidden sm:!block" viewBox="0 0 720 300" role="img" aria-label="하역장에서 설치 승인까지 이어지는 다섯 관문">
      {NODES.map(([name, detail], index) => {
        const x = 34 + index * 139;
        const color = COLORS[index];
        return (
          <g key={name} opacity={index <= step ? 1 : 0.3}>
            {index < NODES.length - 1 && <line x1={x + 110} y1="126" x2={x + 132} y2="126" stroke={color} />}
            {index < NODES.length - 1 && <circle cx={x + 132} cy="126" r="2.5" fill={color} />}
            <rect x={x} y="82" width="110" height="88" rx="13" fill={index === step ? `${color}14` : "#f8fafc"} stroke={index <= step ? color : C.line} />
            <text x={x + 55} y="111" textAnchor="middle" fontSize="8.5" fontWeight="900" fill={color}>{String(index + 1).padStart(2, "0")} · {name}</text>
            <text x={x + 55} y="139" textAnchor="middle" fontSize="8" fontWeight="800" fill={C.ink}>{detail}</text>
          </g>
        );
      })}
      <text x="360" y="226" textAnchor="middle" fontSize="9" fontWeight="900" fill={C.ink}>제품이 아니라 포장된 장비가 실제 경로를 끝까지 통과해야 합니다</text>
      <text x="360" y="252" textAnchor="middle" fontSize="8.2" fill={C.muted}>SLD · rack elevation · P&amp;ID · 반입 동선의 revision을 하나로 묶습니다</text>
    </svg>
  );
}

export default function DeliveryPathViz() {
  return <StepViz steps={STEPS}>{(step) => <><Mobile step={step} /><Desktop step={step} /></>}</StepViz>;
}
