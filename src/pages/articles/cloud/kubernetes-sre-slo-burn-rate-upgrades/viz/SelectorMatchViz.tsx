import SceneShell from "./SceneShell";
import { Arrow, Box } from "./svgParts";

/**
 * 본문 대응: #upgrade-skew — Reddit 2023-03-14. selector가 가리키는 master label이 1.24에서 제거되어 매칭 노드 0개,
 * route reflector가 사라져 Pod 간 경로 전파 정지, 재시작·webhook 제거는 소용없고 백업 복원을 택함, 314분.
 * 노드 3개는 그림용이다.
 */
const SCENES = [
  { label: "1.23 까지", summary: "selector → label 있는 노드", note: "Calico route reflector(노드들에 Pod 경로를 전해 주는 중계)의 nodeSelector와 peerSelector가 master label을 가리킵니다. label을 가진 노드가 있어 잘 찾아집니다." },
  { label: "1.24 로 올리면", summary: "매칭 노드 0개", note: "master라는 이름이 1.20대에 control-plane으로 바뀌었고, 1.24에서는 실행 중인 cluster에서도 master label이 제거됐습니다. 노드는 그대로인데 selector에 맞는 노드가 0개가 됩니다." },
  { label: "경로 전파가 멈춤", summary: "route reflector 사라짐", note: "selector로 찾던 route reflector가 사라지자 Pod 간 경로 전파가 멈췄습니다. 보고서는 이 label 제거를 근인으로, cluster마다 다른 맞춤 구성(Inconsistency)을 진짜 원인으로 적습니다." },
  { label: "되돌리는 길", summary: "백업 복원을 택함 · 중단 314분", note: "control plane을 껐다 켜도, webhook을 지워도 소용없자 몇 시간 뒤 백업에서 복원하는 쪽을 택했습니다. 중단은 314분이었습니다." },
] as const;

const RED = "#dc2626";
const GREEN = "#15803d";
const NODES = [8, 130, 252];

export default function SelectorMatchViz() {
  return (
    <SceneShell
      eyebrow="Reddit 2023-03-14"
      title="label 이름 하나가 사라지자 selector 가 노드 0개를 가리켰습니다"
      description="selector는 label로 대상을 고르는 조건이므로 label이 없어지면 고를 대상도 없어집니다. 노드 세 개는 그림을 위해 임의로 고른 수입니다."
      ariaLabel="master label 제거로 selector 매칭이 0개가 되어 경로 전파가 멈추는 순서"
      scenes={SCENES}
      render={(active) => {
        const gone = active >= 1;
        return (
          <svg viewBox="0 0 360 200" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <rect x={8} y={8} width={344} height={28} rx={6} fill="#2563eb" fillOpacity={0.12} stroke="#2563eb" strokeWidth={1} />
            <text x={180} y={26} textAnchor="middle" fontSize={10.5} fontWeight={700} className="fill-foreground">selector: node-role.kubernetes.io/master</text>
            {NODES.map((x) => (
              <g key={x}>
                {gone ? (
                  <line x1={x + 50} y1={36} x2={x + 50} y2={50} stroke={RED} strokeWidth={1} strokeDasharray="3 3" />
                ) : (
                  <Arrow x1={x + 50} y1={36} x2={x + 50} y2={64} color="#2563eb" />
                )}
                <rect x={x} y={64} width={100} height={52} rx={6} fill="#94a3b8" fillOpacity={0.12} stroke="#94a3b8" strokeWidth={1} />
                <text x={x + 50} y={82} textAnchor="middle" fontSize={10.5} fontWeight={700} className="fill-foreground">노드</text>
                <rect x={x + 22} y={90} width={56} height={18} rx={4} fill={gone ? "none" : "#2563eb"} fillOpacity={0.2} stroke={gone ? RED : "#2563eb"} strokeWidth={1} strokeDasharray={gone ? "3 2" : undefined} />
                <text x={x + 50} y={103} textAnchor="middle" fontSize={10.5} fill={gone ? RED : "#2563eb"} fontWeight={700} textDecoration={gone ? "line-through" : undefined}>master</text>
              </g>
            ))}
            {gone && <text x={180} y={54} textAnchor="middle" fontSize={11} fontWeight={700} fill={RED}>매칭 0개</text>}
            {active < 3 ? (
              <>
                <Box x={8} y={140} w={150} h={46} line1="route reflector" line2={active === 2 ? "사라짐" : active === 1 ? "찾을 노드 없음" : "동작"} color={active === 2 ? RED : "#94a3b8"} line2Color={active >= 1 ? RED : GREEN} />
                <Arrow x1={158} y1={163} x2={202} y2={163} color={active === 2 ? RED : "#64748b"} dashed={active === 2} />
                <Box x={202} y={140} w={150} h={46} line1="Pod 간 경로 전파" line2={active === 2 ? "멈춤" : active === 0 ? "동작" : undefined} color={active === 2 ? RED : "#94a3b8"} line2Color={active === 2 ? RED : GREEN} />
              </>
            ) : (
              <>
                <Box x={8} y={140} w={108} h={46} line1="control plane" line2="껐다 켜기 ✕" color={RED} line2Color={RED} />
                <Box x={126} y={140} w={108} h={46} line1="webhook" line2="지우기 ✕" color={RED} line2Color={RED} />
                <Box x={244} y={140} w={108} h={46} line1="백업에서 복원" line2="이 길을 택함" color={GREEN} line2Color={GREEN} />
              </>
            )}
          </svg>
        );
      }}
    />
  );
}
