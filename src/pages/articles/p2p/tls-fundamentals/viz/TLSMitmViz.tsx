import SceneShell from "./SceneShell";

/**
 * 본문 대응: #handshake — 공개값 교환만으로는 중간자가 양쪽과 따로 비밀을 만들 수 있고,
 * CertificateVerify(transcript 서명)와 subjectAltName 이름 검사가 각각 다른 경로를 막는다.
 * 공격자는 api.example 인증서의 개인키를 갖지 않는다고 가정한다.
 */
const SCENES = [
  {
    label: "공개값만 오가면 중간에서 바꿔 낄 수 있습니다",
    summary: "브라우저 ↔ 중간자 ↔ 서버",
    note: "중간자가 브라우저의 공개값 B를 가로채 서버에는 자기 공개값 M을, 서버가 돌려준 S 대신 브라우저에는 M′을 보냅니다. 공개값에는 보낸 이가 적혀 있지 않습니다.",
  },
  {
    label: "비밀이 두 개 생기고, 둘 다 중간자가 압니다",
    summary: "K₁ = 브라우저·중간자, K₂ = 중간자·서버",
    note: "브라우저는 K₁을, 서버는 K₂를 계산하고 중간자는 둘 다 압니다. 공개값 교환만으로는 브라우저가 상대가 진짜 api.example인지 구분할 수 없습니다.",
  },
  {
    label: "진짜 서버의 서명은 브라우저가 본 대화와 맞지 않습니다",
    summary: "T(B, M′) ≠ T(M, S) → 검증 실패",
    note: "서버는 M과 S가 든 자기 transcript에 서명하지만, 브라우저의 transcript에는 B와 M′이 들어 있어 hash가 다릅니다. 개인키가 없는 중간자(가정)는 새로 서명할 수도 없습니다.",
  },
  {
    label: "자기 인증서로 서명해도 이름 검사에서 걸립니다",
    summary: "서명 통과 · 이름 ≠ api.example → 실패",
    note: "중간자가 자기 개인키를 가진 다른 이름의 인증서(가정)를 쓰면 서명은 맞을 수 있습니다. 그래도 URL의 api.example과 subjectAltName이 달라 이름 검사가 실패합니다.",
  },
] as const;

const BLUE = "#2563eb";
const RED = "#dc2626";
const GREEN = "#059669";
const GRAY = "#64748b";

function Node({ x, label, sub, color }: { x: number; label: string; sub: string; color: string }) {
  return (
    <g>
      <rect x={x} y={20} width={92} height={44} rx={8} fill="none" stroke={color} strokeWidth={1} />
      <text x={x + 46} y={39} textAnchor="middle" fontSize={12} fontWeight={700} fill={color}>
        {label}
      </text>
      <text x={x + 46} y={55} textAnchor="middle" fontSize={11} fill={GRAY}>
        {sub}
      </text>
    </g>
  );
}

function Arrow({ x1, x2, y, label, color }: { x1: number; x2: number; y: number; label: string; color: string }) {
  const dir = x2 > x1 ? 1 : -1;
  return (
    <g>
      <line x1={x1} x2={x2 - dir * 6} y1={y} y2={y} stroke={color} strokeWidth={1} />
      <path d={`M ${x2} ${y} l ${-dir * 7} -4 l 0 8 z`} fill={color} />
      <text x={(x1 + x2) / 2} y={y - 5} textAnchor="middle" fontSize={11} fontWeight={700} fill={color}>
        {label}
      </text>
    </g>
  );
}

export default function TLSMitmViz() {
  return (
    <SceneShell
      eyebrow="중간자"
      title="공개값 교환만으로는 상대가 누구인지 모릅니다"
      description="가운데 칸이 브라우저와 서버 사이에서 메시지를 바꿔 끼우는 중간자입니다. 굵은 글자는 X25519 공개값(B·M·M′·S)과 그로부터 계산한 shared secret(K₁·K₂)입니다."
      ariaLabel="중간자가 공개값을 바꿔 두 개의 비밀을 만들고, 서명과 이름 검사가 이를 막는 과정"
      scenes={SCENES}
      render={(active) => {
        const secrets = active >= 1;
        const sigFail = active === 2;
        const nameFail = active === 3;
        return (
          <svg viewBox="0 0 360 200" className="mx-auto h-auto w-full max-w-[480px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <Node x={4} label="브라우저" sub="URL: api.example" color={BLUE} />
            <Node x={134} label="중간자" sub="바꿔 끼움" color={RED} />
            <Node x={264} label="서버" sub="api.example" color={GREEN} />

            <Arrow x1={96} x2={134} y={88} label="B" color={BLUE} />
            <Arrow x1={226} x2={264} y={88} label="M" color={RED} />
            <Arrow x1={264} x2={226} y={116} label="S" color={GREEN} />
            <Arrow x1={134} x2={96} y={116} label="M′" color={RED} />

            <g opacity={secrets ? 1 : 0.15}>
              <rect x={20} y={130} width={176} height={22} rx={6} fill="none" stroke={RED} strokeWidth={1} strokeDasharray="3 3" />
              <text x={108} y={145} textAnchor="middle" fontSize={11} fontWeight={700} fill={RED}>
                K₁ (브라우저·중간자)
              </text>
              <rect x={164} y={156} width={176} height={22} rx={6} fill="none" stroke={RED} strokeWidth={1} strokeDasharray="3 3" />
              <text x={252} y={171} textAnchor="middle" fontSize={11} fontWeight={700} fill={RED}>
                K₂ (중간자·서버)
              </text>
            </g>

            {sigFail && (
              <g>
                <text x={298} y={196} textAnchor="middle" fontSize={11} fontWeight={700} fill={GREEN}>
                  서명 대상 T(M, S)
                </text>
                <text x={48} y={196} textAnchor="middle" fontSize={11} fontWeight={700} fill={RED}>
                  T(B, M′) ✗
                </text>
              </g>
            )}
            {nameFail && (
              <g>
                <text x={180} y={196} textAnchor="middle" fontSize={11} fontWeight={700} fill={RED}>
                  다른 이름 인증서 (가정)
                </text>
                <text x={48} y={196} textAnchor="middle" fontSize={11} fontWeight={700} fill={RED}>
                  이름 ✗
                </text>
              </g>
            )}
          </svg>
        );
      }}
    />
  );
}
