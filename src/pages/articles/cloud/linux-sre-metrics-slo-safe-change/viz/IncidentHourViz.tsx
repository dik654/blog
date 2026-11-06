import SceneShell from "./SceneShell";

/**
 * 본문 대응: #change-path — 3월 8일 06:00 첫 업그레이드, 3분 뒤 경보, 06:31 사용자에게 보임,
 * AWS 한 지역에서 06:00~07:00 10분마다 8% 이상 종료·교체, 08:00까지 약 60% 교체.
 * 07:00~08:00 사이 값은 본문에 없어 곡선을 그리지 않는다.
 */
const X0 = 14;
const SPAN = 332;
const x = (minutes: number) => X0 + (minutes / 120) * SPAN;
const AXIS_Y = 102;
const TEN_MINUTES = [0, 10, 20, 30, 40, 50] as const;

const SCENES = [
  { label: "06:00 첫 업그레이드", summary: "설치 창 06:00~07:00", at: 0, tag: "06:00 첫 업그레이드", note: "타이머의 무작위 지연 때문에 노드들은 이 한 시간 안에 차례로 업그레이드를 돌렸습니다." },
  { label: "3분 뒤 내부 경보", summary: "06:03", at: 3, tag: "06:03 내부 모니터링 경보", note: "첫 업그레이드 3분 뒤 내부 모니터링이 경보를 올렸습니다. 설치 창은 아직 57분 남아 있었습니다." },
  { label: "사용자에게 보임", summary: "06:31", at: 31, tag: "06:31 fleet 상당 부분 꺼짐", note: "06:31에는 fleet의 상당 부분이 꺼져 사용자에게 보였습니다." },
  { label: "AWS에서 자동 교체", summary: "10분마다 8% 이상", at: 60, tag: "10분 칸마다 8% 이상 종료·교체 (한 지역)", note: "Auto Scaling은 인스턴스를 자동으로 유지·교체하는 AWS 기능입니다. 네트워크를 잃은 인스턴스를 비정상으로 판정해 10분마다 8% 이상을 종료·교체했습니다." },
  { label: "08:00까지 약 60%", summary: "한 지역 인스턴스의 약 60%", at: 120, tag: "08:00 약 60% 교체", note: "08:00까지 한 지역 인스턴스의 약 60%가 교체됐습니다. 아래 막대가 그 비율이고, 교체 수치는 AWS 한 지역 기준입니다." },
] as const;

export default function IncidentHourViz() {
  return (
    <SceneShell
      eyebrow="사건의 두 시간"
      title="06:00 첫 업그레이드에서 두 시간 뒤, 한 지역 인스턴스의 약 60%가 교체됐습니다"
      description="가로축은 2023년 3월 8일 06:00~08:00 UTC입니다. 주황 띠는 둘째 경로가 업그레이드를 돌린 시간입니다."
      note="시각과 비율은 Datadog 사후 분석에 적힌 값입니다. 07:00~08:00 사이의 진행 값은 본문에 없어 그리지 않았습니다."
      ariaLabel="2023년 3월 8일 06시부터 08시까지 사건 진행"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const tagX = Math.max(X0, Math.min(x(scene.at), 346));
        const anchor = tagX > 300 ? "end" : tagX > 80 ? "middle" : "start";
        return (
          <svg viewBox="0 0 360 172" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <text x={tagX} y={30} textAnchor={anchor} fontSize={12} fontWeight={700} fill="#dc2626">{scene.tag}</text>
            <line x1={x(scene.at)} x2={x(scene.at)} y1={36} y2={AXIS_Y} stroke="#dc2626" strokeWidth={1.25} />
            <rect x={x(0)} y={64} width={x(60) - x(0)} height={18} fill="#d97706" opacity={0.75} />
            <text x={x(30)} y={77} textAnchor="middle" fontSize={11} fontWeight={700} fill="#ffffff">업그레이드 창</text>
            <line x1={x(0)} x2={x(120)} y1={AXIS_Y} y2={AXIS_Y} stroke="#94a3b8" strokeWidth={1} />
            {[0, 60, 120].map((minutes) => (
              <g key={minutes}>
                <line x1={x(minutes)} x2={x(minutes)} y1={AXIS_Y} y2={AXIS_Y + 5} stroke="#94a3b8" strokeWidth={1} />
                <text x={x(minutes)} y={AXIS_Y + 17} textAnchor={minutes === 0 ? "start" : minutes === 120 ? "end" : "middle"} fontSize={11} fill="#64748b">{`0${6 + minutes / 60}:00`}</text>
              </g>
            ))}
            {active >= 3 && TEN_MINUTES.map((minutes) => (
              <rect key={minutes} x={x(minutes) + 1} y={AXIS_Y - 14} width={x(10) - x(0) - 2} height={10} fill="none" stroke="#dc2626" strokeWidth={1} />
            ))}
            {active === 4 && (
              <g>
                <rect x={x(0)} y={138} width={SPAN} height={18} fill="none" stroke="#94a3b8" strokeWidth={1} />
                <rect x={x(0)} y={138} width={SPAN * 0.6} height={18} fill="#dc2626" />
                <text x={x(0) + 8} y={151} fontSize={11} fontWeight={700} fill="#ffffff">약 60% 교체</text>
                <text x={x(120) - 6} y={151} textAnchor="end" fontSize={11} fill="#64748b">한 지역 전체</text>
              </g>
            )}
          </svg>
        );
      }}
    />
  );
}
