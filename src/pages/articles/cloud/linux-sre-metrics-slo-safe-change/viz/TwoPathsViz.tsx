import SceneShell from "./SceneShell";

/**
 * 본문 대응: #change-path — 조직 파이프라인(지역별 순차, 단계 사이 일주일~한 달)과
 * 노드 안의 apt-daily-upgrade.timer(문 없음, 같은 06:00~07:00). 지역 다섯은 1절의 사실이다.
 */
const REGIONS = [0, 1, 2, 3, 4] as const;
const BOX_W = 60;
const STEP = 68;
const boxX = (i: number) => 8 + i * STEP;

const SCENES = [
  { label: "첫째 경로: 파이프라인", summary: "지역별·클러스터별·노드별", note: "새 코드·보안 패치·설정이 위에서 내려옵니다. 단계 사이를 재우므로 아직 안 바뀐 노드가 남습니다." },
  { label: "둘째 경로: 노드 안의 타이머", summary: "Ubuntu 기본값", note: "각 노드가 스스로 보안 패키지를 설치합니다. Datadog는 이 경로에 의존하지 않았지만 끄지도 않았습니다." },
  { label: "3월 8일 둘째 경로가 동시에 돎", summary: "06:00~07:00 UTC", note: "지역 사이에 아무 결합이 없는데도 모두 같은 한 시간에 바뀌었고, 바뀌지 않은 비교 대상이 없었습니다." },
] as const;

const BOTTOM = ["단계 사이 일주일~한 달", "문 없음 · 파이프라인 우회", "다섯 지역이 같은 한 시간에 바뀜"] as const;

export default function TwoPathsViz() {
  return (
    <SceneShell
      eyebrow="변경 경로 지도"
      title="같은 노드로 들어가는 길이 둘이었고, 둘째 길에는 문이 없었습니다"
      description="큰 칸은 지역, 작은 네모는 노드 기호입니다(실제 대수 아님). 파랑은 파이프라인이, 빨강은 타이머가 바꾼 노드입니다."
      note="지역 순서와 진행 모습은 가정입니다. 당시 fleet(운영 중인 서버 전체)의 90% 이상이 22.04였고, 설치할 것이 없어 무사한 노드도 있었습니다(9절)."
      ariaLabel="조직 파이프라인과 노드 안 타이머라는 두 변경 경로 비교"
      scenes={SCENES}
      render={(active) => {
        const first = active === 0;
        const changed = (region: number, node: number) => {
          if (active === 2) return "#dc2626";
          if (first && (region === 0 || (region === 1 && node < 2))) return "#2563eb";
          return "none";
        };
        return (
          <svg viewBox="0 0 360 190" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <rect x={8} y={4} width={344} height={28} rx={8} fill={first ? "#2563eb" : "none"} stroke={first ? "#2563eb" : "#94a3b8"} strokeWidth={1} />
            <text x={180} y={22} textAnchor="middle" fontSize={11} fontWeight={700} fill={first ? "#ffffff" : "#64748b"}>조직의 변경 파이프라인</text>
            {REGIONS.map((region) => (
              <g key={region}>
                <line x1={boxX(region) + BOX_W / 2} x2={boxX(region) + BOX_W / 2} y1={32} y2={58} stroke={first ? "#2563eb" : "#94a3b8"} strokeWidth={1} strokeDasharray={first ? undefined : "3 3"} />
                <rect x={boxX(region)} y={58} width={BOX_W} height={96} rx={8} fill="none" stroke="#94a3b8" strokeWidth={1} />
                <text x={boxX(region) + BOX_W / 2} y={73} textAnchor="middle" fontSize={11} fill="#64748b">{`지역 ${region + 1}`}</text>
                {[0, 1, 2, 3].map((node) => (
                  <rect key={node} x={boxX(region) + 12 + (node % 2) * 20} y={80 + Math.floor(node / 2) * 20} width={16} height={16} rx={2} fill={changed(region, node)} stroke={changed(region, node) === "none" ? "#94a3b8" : changed(region, node)} strokeWidth={1} />
                ))}
                <rect x={boxX(region) + 5} y={126} width={BOX_W - 10} height={22} rx={6} fill={first ? "none" : "#dc2626"} stroke={first ? "#94a3b8" : "#dc2626"} strokeWidth={1} />
                <text x={boxX(region) + BOX_W / 2} y={141} textAnchor="middle" fontSize={11} fontWeight={first ? 400 : 700} fill={first ? "#64748b" : "#ffffff"}>타이머</text>
              </g>
            ))}
            <text x={180} y={178} textAnchor="middle" fontSize={12} fontWeight={700} fill={first ? "#2563eb" : "#dc2626"}>{BOTTOM[active]}</text>
          </svg>
        );
      }}
    />
  );
}
