import SceneShell from "./SceneShell";
import { Arrow, Box } from "./SvgBits";

/**
 * 본문 대응: #comparison — 공유 비밀은 통신 문맥과 함께 키 파생 절차에 들어가고 이후 대칭키 암호로 데이터를 보호한다.
 * 인증서·서명으로 공개 키의 상대를 확인하고 대화 기록과 선택한 알고리즘도 결속한다.
 */
const W = 360;
const H = 274;
const BLUE = "#2563eb";
const AMBER = "#d97706";
const GRAY = "#64748b";

const SCENES = [
  { label: "키 파생", summary: "32바이트 + 문맥", note: "공유 비밀은 그대로 쓰지 않습니다. 통신의 문맥과 함께 키 파생 절차에 들어갑니다." },
  { label: "데이터 보호", summary: "대칭키 → 암호문", note: "파생한 대칭키로 본문 데이터를 보호합니다. ML-KEM 자체가 문서를 암호화하는 것이 아닙니다." },
  { label: "상대와 결속", summary: "ML-KEM 밖에서 필요", note: "공개 키가 누구의 것인지는 인증서·서명 등으로 따로 확인하고, 대화 기록과 선택한 알고리즘도 결속해야 합니다. 같은 키를 만들었다는 사실이 이것을 대신하지 않습니다." },
] as const;

function Flow({ active }: { active: number }) {
  const kdf = active === 0;
  const data = active === 1;
  const bind = active === 2;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[460px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
      <Box x={4} y={4} w={100} h={48} text="공유 비밀" sub="32바이트" color={BLUE} live={kdf} />
      <Box x={112} y={4} w={84} h={48} text="통신 문맥" color={GRAY} live={kdf} />
      <g opacity={kdf ? 1 : 0.4}>
        <Arrow x1={54} y1={52} x2={80} y2={84} color={BLUE} />
        <Arrow x1={154} y1={52} x2={128} y2={84} color={GRAY} />
      </g>
      <Box x={24} y={84} w={160} h={40} text="키 파생 절차" color={BLUE} live={kdf} />

      <g opacity={data ? 1 : 0.4}>
        <Arrow x1={104} y1={124} x2={104} y2={148} color={BLUE} />
      </g>
      <Box x={24} y={148} w={160} h={40} text="대칭키" color={BLUE} live={data} />
      <g opacity={data ? 1 : 0.4}>
        <Arrow x1={104} y1={188} x2={104} y2={212} color={BLUE} />
      </g>
      <Box x={24} y={212} w={160} h={48} text="본문 데이터 보호" sub="대칭키 암호" color={BLUE} live={data} />

      <Box x={212} y={4} w={144} h={72} text="인증서 · 서명" sub="공개 키의 상대 확인" color={AMBER} live={bind} />
      <Box x={212} y={96} w={144} h={72} text="대화 기록 · 알고리즘" sub="결속" color={AMBER} live={bind} />
      <text x={284} y={198} textAnchor="middle" fontSize={12} fontWeight={700} fill={bind ? AMBER : GRAY} opacity={bind ? 1 : 0.4}>ML-KEM 절차 밖</text>
    </svg>
  );
}

export default function SecretToTrafficViz() {
  return (
    <SceneShell
      eyebrow="32바이트 다음"
      title="32바이트는 출발점이고, 데이터와 상대 확인은 다른 단계입니다"
      description="왼쪽이 공유 비밀이 데이터 보호까지 가는 길이고, 오른쪽이 그 밖에 함께 필요한 일입니다."
      ariaLabel="공유 비밀이 문맥과 함께 키 파생을 거쳐 대칭키가 되고, 상대 확인과 결속이 별도로 필요한 구조"
      scenes={SCENES}
      render={(active) => <Flow active={active} />}
    />
  );
}
