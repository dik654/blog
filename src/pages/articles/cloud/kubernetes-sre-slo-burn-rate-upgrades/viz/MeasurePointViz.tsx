import SceneShell from "./SceneShell";
import { Arrow, Box } from "./svgParts";

/**
 * 본문 대응: #names — Pod 안 지표는 Pod가 죽으면 사라지고 Pod가 Service에서 빠진 동안의 실패를 세지 못한다.
 * 그래서 SLI는 사용자 쪽에서 가장 가까운 앞단에서 잰다. Pod 2개는 그림용이다.
 */
const SCENES = [
  { label: "평상시", summary: "두 지점 모두 요청을 셈", pod: "자기 요청을 셈", note: "요청은 앞단을 지나 Service 뒤의 Pod로 갑니다. 지표는 앞단에서도, Pod 안에서도 잴 수 있습니다." },
  { label: "Pod 가 죽으면", summary: "Pod 안 지표도 사라짐", pod: "죽은 Pod의 지표는 Pod와 함께 사라짐", note: "숫자를 들고 있던 곳이 함께 없어집니다. 사용자 쪽에 더 가까운 앞단은 Pod 밖에 있어 계속 잴 수 있습니다." },
  { label: "Pod 가 Service 에서 빠지면", summary: "빠진 동안의 실패를 못 셈", pod: "빠진 동안의 실패를 세지 못함", note: "Pod는 살아 있어도 요청이 오지 않으니 그동안의 실패는 그 Pod의 숫자에 없습니다. 그래서 SLI는 Ingress·Gateway나 Service 앞단에서 잽니다." },
] as const;

const RED = "#dc2626";
const BLUE = "#2563eb";

export default function MeasurePointViz() {
  return (
    <SceneShell
      eyebrow="SLI를 재는 지점"
      title="Pod 안에서 재면 Pod 가 사라진 동안의 실패를 놓칩니다"
      description="왼쪽이 사용자, 오른쪽이 Pod입니다. 파란 상자가 SLI를 재는 앞단이고, Pod 두 개는 그림을 위해 임의로 고른 수입니다."
      ariaLabel="요청 경로에서 앞단 지표와 Pod 안 지표가 실패를 세는지 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const dead = active === 1;
        const removed = active === 2;
        return (
          <svg viewBox="0 0 360 186" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <Box x={6} y={52} w={50} line1="사용자" />
            <Box x={72} y={52} w={94} line1="Ingress·Gateway" line2="앞단 지표" color={BLUE} line2Color={BLUE} />
            <Box x={184} y={52} w={56} line1="Service" />
            <Box x={266} y={14} w={88} h={44} line1="Pod A" line2={dead ? "죽음" : removed ? "Service 에서 빠짐" : "앱 지표"} color={active > 0 ? RED : "#94a3b8"} dashed={active > 0} line2Color={active > 0 ? RED : "#64748b"} />
            <Box x={266} y={78} w={88} h={44} line1="Pod B" line2="앱 지표" />
            <Arrow x1={56} y1={72} x2={72} y2={72} />
            <Arrow x1={166} y1={72} x2={184} y2={72} />
            {active === 0 && <Arrow x1={240} y1={64} x2={266} y2={38} />}
            {active > 0 && <line x1={240} y1={64} x2={254} y2={50} stroke={RED} strokeWidth={1} strokeDasharray="3 3" />}
            <Arrow x1={240} y1={80} x2={266} y2={98} />
            <text x={6} y={152} fontSize={10.5} fontWeight={700} fill={BLUE}>앞단 지표</text>
            <text x={70} y={152} fontSize={10.5} className="fill-foreground">사용자가 겪은 요청 결과를 계속 셈</text>
            <text x={6} y={172} fontSize={10.5} fontWeight={700} fill={active > 0 ? RED : "#64748b"}>Pod 안 지표</text>
            <text x={70} y={172} fontSize={10.5} className="fill-foreground">{scene.pod}</text>
          </svg>
        );
      }}
    />
  );
}
