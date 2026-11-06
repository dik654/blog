import SceneShell from "./SceneShell";

/**
 * 본문 대응: #source — apt-daily.timer 18:00 + 최대 12시간, 새 systemd 18:50 UTC(Google Cloud 저장소).
 * 18:50 전에 다운로드를 끝낸 노드는 다음 날 06:00 업그레이드 때 설치할 것이 없었다.
 * 노드 A·B의 구체적 시각은 설명용 가정이다.
 */
const X0 = 48;
const X1 = 350;
const hour = (h: number) => X0 + (h / 13) * (X1 - X0); // 18:00 기준 경과 시간, 07:00까지
const PUBLISH = 50 / 60;
const AXIS_Y = 44;
const ROW_A = 84;
const ROW_B = 134;

const SCENES = [
  { label: "타이머 둘", summary: "다운로드 · 설치", note: "apt-daily.timer는 06:00과 18:00에 최대 12시간 지연으로 내려받습니다(18:00 회차만 그림). 설치는 apt-daily-upgrade.timer가 합니다." },
  { label: "18:50 새 systemd", summary: "저장소에 올라옴", note: "새 systemd가 Google Cloud 저장소에 18:50 UTC에 올라왔습니다. 이 선 앞과 뒤에서 받은 내용이 갈립니다." },
  { label: "선 앞에서 받은 노드", summary: "설치할 것 없음", note: "18:00 다운로드를 그 전에 끝낸 노드는 새 패키지를 받지 못했으므로, 다음 날 06:00 업그레이드 때 설치할 것이 없었습니다." },
  { label: "선 뒤에서 받은 노드", summary: "다음 날 새 systemd 설치", note: "선 뒤에 받은 노드는 새 패키지를 들고 있다가 06:00 뒤에 설치합니다. 흩어진 다운로드가 Datadog의 피해 범위를 줄인 이유입니다." },
] as const;

function Marker({ x, y, color, filled }: { x: number; y: number; color: string; filled: boolean }) {
  return <circle cx={x} cy={y} r={5} fill={filled ? color : "none"} stroke={color} strokeWidth={1.25} />;
}

export default function DownloadCutoffViz() {
  return (
    <SceneShell
      eyebrow="다운로드와 설치의 순서"
      title="새 패키지가 올라오기 전에 내려받은 노드는 다음 날 설치할 것이 없었습니다"
      description="가로축은 18:00 UTC부터 다음 날 07:00까지입니다. 파란 띠는 다운로드가 돌 수 있는 시간, 주황 띠는 업그레이드 창입니다."
      note="노드 A·B의 18:20, 22:00, 06:20, 06:40은 설명용 가정입니다. 18:50은 Google Cloud 저장소 기준입니다."
      ariaLabel="18시 50분 패키지 공개 전후로 내려받은 노드의 다음 날 설치 결과 비교"
      scenes={SCENES}
      render={(active) => {
        const showA = active >= 2;
        const showB = active >= 3;
        return (
          <svg viewBox="0 0 360 170" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <rect x={hour(0)} y={AXIS_Y - 20} width={hour(12) - hour(0)} height={14} fill="#2563eb" opacity={0.25} />
            <text x={hour(4.5)} y={AXIS_Y - 9} textAnchor="middle" fontSize={11} fontWeight={700} fill="#2563eb">다운로드 18:00 + 최대 12시간</text>
            <rect x={hour(12)} y={AXIS_Y - 20} width={hour(13) - hour(12)} height={150} fill="#d97706" opacity={0.25} />
            <text x={hour(13)} y={AXIS_Y - 26} textAnchor="end" fontSize={11} fontWeight={700} fill="#b45309">설치 창</text>
            <line x1={X0} x2={X1} y1={AXIS_Y} y2={AXIS_Y} stroke="#94a3b8" strokeWidth={1} />
            {[0, 6, 12].map((h) => (
              <text key={h} x={hour(h)} y={AXIS_Y + 14} textAnchor={h === 12 ? "end" : "middle"} fontSize={11} fill="#64748b">{["18:00", "00:00", "06:00"][h / 6]}</text>
            ))}
            {active >= 1 && (
              <g>
                <line x1={hour(PUBLISH)} x2={hour(PUBLISH)} y1={AXIS_Y - 20} y2={160} stroke="#dc2626" strokeWidth={1.25} strokeDasharray="4 3" />
                <text x={hour(PUBLISH) + 5} y={163} fontSize={11} fontWeight={700} fill="#dc2626">18:50 새 systemd</text>
              </g>
            )}
            <text x={0} y={ROW_A + 4} fontSize={11} fontWeight={700} fill="#64748b">노드 A</text>
            <text x={0} y={ROW_B + 4} fontSize={11} fontWeight={700} fill="#64748b">노드 B</text>
            <line x1={X0} x2={X1} y1={ROW_A} y2={ROW_A} stroke="#94a3b8" strokeWidth={1} opacity={0.5} />
            <line x1={X0} x2={X1} y1={ROW_B} y2={ROW_B} stroke="#94a3b8" strokeWidth={1} opacity={0.5} />
            {showA && (
              <g>
                <Marker x={hour(20 / 60)} y={ROW_A} color="#2563eb" filled />
                <text x={hour(1.1)} y={ROW_A + 18} fontSize={11} fill="#64748b">옛 패키지만 받음</text>
                <Marker x={hour(12 + 20 / 60)} y={ROW_A} color="#15803d" filled={false} />
                <text x={hour(12.9)} y={ROW_A - 9} textAnchor="end" fontSize={11} fontWeight={700} fill="#15803d">설치할 것 없음</text>
              </g>
            )}
            {showB && (
              <g>
                <Marker x={hour(4)} y={ROW_B} color="#2563eb" filled />
                <text x={hour(4.4)} y={ROW_B + 18} fontSize={11} fill="#64748b">새 패키지까지 받음</text>
                <Marker x={hour(12 + 40 / 60)} y={ROW_B} color="#dc2626" filled />
                <text x={hour(12.9)} y={ROW_B - 9} textAnchor="end" fontSize={11} fontWeight={700} fill="#dc2626">새 systemd 설치</text>
              </g>
            )}
          </svg>
        );
      }}
    />
  );
}
