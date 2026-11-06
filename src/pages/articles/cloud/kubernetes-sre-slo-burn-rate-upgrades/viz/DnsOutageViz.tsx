import SceneShell from "./SceneShell";
import { Arrow, Box } from "./svgParts";

/**
 * 본문 대응: #overview·#budget-policy — Zalando 2019-01-07 보고서의 순서.
 * 외부 이름 하나에 DNS 질의 10번 → CoreDNS limit 100Mi 초과·OOMKill → 다시 떠도 같은 부하에 재사망
 * → cluster 안 monitoring도 함께 멈춰 호출 지연 → limit 2000Mi에서 회복, 후속으로 cluster 밖 경보.
 */
const SCENES = [
  { label: "이름 하나가 질의 열 번", summary: "외부 이름 1개 → DNS 질의 10번", note: "Pod의 ndots:5 때문에 점이 5개 미만인 외부 이름은 search 도메인을 먼저 붙여 봅니다. Node.js가 결과를 캐시하지 않아 조회마다 이 일이 반복됐습니다." },
  { label: "CoreDNS 메모리가 limit 을 넘음", summary: "limit 100Mi 초과 → OOMKill", note: "질의가 늘자 CoreDNS 메모리가 limit 100Mi를 넘었고, Pod들이 동시에 강제 종료(OOMKill)됐습니다." },
  { label: "되살아나도 다시 죽음", summary: "재시작 → 같은 부하 → OOMKill", note: "다시 떠도 같은 부하를 받아 또 죽었습니다. cluster 안의 이름 해석이 모두 멎은 채 고객은 한 시간 넘게 오류 페이지를 봤습니다." },
  { label: "감시도 같은 DNS 에 묶여 있음", summary: "monitoring 함께 멈춤 → 호출 지연", note: "cluster 안의 monitoring도 cluster DNS에 의존했기 때문에 함께 멈췄고, 당직자 호출이 늦어졌습니다. 앞 장면에서 표시하지 않았을 뿐 DNS 장애의 다음 단계가 아니라 그 장애와 함께 벌어진 일입니다." },
  { label: "회복과 후속 조치", summary: "limit 2000Mi · cluster 밖 경보", note: "limit을 2000Mi로 올린 뒤에야 회복됐습니다. 후속 조치에는 cluster 밖에서의 경보와 호출 실패 시 직접 escalation이 들어갔습니다." },
] as const;

const RED = "#dc2626";
const GREEN = "#15803d";
const DOTS = Array.from({ length: 10 }, (_, index) => index);
const CORE_STATE = ["limit 100Mi", "OOMKill", "OOMKill 반복", "OOMKill 반복", "limit 2000Mi"];

export default function DnsOutageViz() {
  return (
    <SceneShell
      eyebrow="Zalando 2019-01-07"
      title="DNS 가 죽자 그 DNS 에 기대던 감시까지 함께 멈췄습니다"
      description="큰 테두리 안이 cluster입니다. 보고서가 적은 사건을 cluster 안과 밖의 위치로 옮겼고, 점 하나가 DNS 질의 하나입니다."
      ariaLabel="CoreDNS OOMKill이 cluster 안 monitoring과 당직자 호출로 번지는 순서"
      scenes={SCENES}
      render={(active) => {
        const down = active >= 1 && active <= 3;
        return (
          <svg viewBox="0 0 360 206" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <rect x={6} y={6} width={348} height={132} rx={8} fill="none" stroke="#94a3b8" strokeWidth={1} />
            <text x={14} y={22} fontSize={10.5} fontWeight={700} fill="#64748b">cluster 안</text>
            <Box x={16} y={50} w={70} h={46} line1="앱 Pod" line2="외부 이름 1개" />
            <Box x={144} y={50} w={88} h={46} line1="CoreDNS Pod들" line2={CORE_STATE[active]} color={down ? RED : active === 4 ? GREEN : "#94a3b8"} line2Color={down ? RED : active === 4 ? GREEN : "#64748b"} />
            <Box x={266} y={50} w={80} h={46} line1="monitoring" line2={active === 3 ? "함께 멈춤" : "cluster 안"} color={active === 3 ? RED : "#94a3b8"} line2Color={active === 3 ? RED : "#64748b"} />
            {DOTS.map((index) => (
              <circle key={index} cx={95 + (index % 5) * 10} cy={Math.floor(index / 5) * 9 + 54} r={3} fill={active === 0 ? "#2563eb" : "#94a3b8"} />
            ))}
            <text x={115} y={42} textAnchor="middle" fontSize={10} fontWeight={700} fill={active === 0 ? "#2563eb" : "#64748b"}>질의 10번</text>
            <Arrow x1={86} y1={82} x2={144} y2={82} />
            {active >= 3 && (
              <>
                <Arrow x1={266} y1={73} x2={232} y2={73} color={active === 3 ? RED : "#64748b"} />
                <text x={249} y={42} textAnchor="middle" fontSize={10} fontWeight={700} fill={active === 3 ? RED : "#64748b"}>DNS 의존</text>
              </>
            )}
            {(active === 2 || active === 3) && <text x={188} y={118} textAnchor="middle" fontSize={10.5} fontWeight={700} fill={RED}>↻ 재시작 → 같은 부하 → 다시 OOMKill</text>}

            <text x={14} y={154} fontSize={10.5} fontWeight={700} fill="#64748b">cluster 밖</text>
            {(active === 2 || active === 3) && <Box x={16} y={160} w={110} h={40} line1="고객" line2="오류 페이지 1시간 넘게" color={RED} line2Color={RED} />}
            {active === 4 && <Box x={136} y={160} w={100} h={40} line1="cluster 밖 경보" line2="후속 조치" color={GREEN} line2Color={GREEN} />}
            <Box x={262} y={160} w={84} h={40} line1="당직자" line2={active === 3 ? "호출 늦음" : undefined} color={active === 3 ? RED : "#94a3b8"} line2Color={RED} />
            {active < 4 && <Arrow x1={304} y1={96} x2={304} y2={160} color={active === 3 ? RED : "#94a3b8"} dashed={active === 3} />}
            {active === 4 && <Arrow x1={236} y1={180} x2={262} y2={180} color={GREEN} />}
          </svg>
        );
      }}
    />
  );
}
