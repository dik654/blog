import PoolDots from "./PoolDots";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #limits — 1인당 300만 원. 20명이면 6천만 원, 500명이면 15억 원, 보험료는 1억 원(모두 가정).
 * 15억 − 1억 = 14억. 메우는 수단의 크기는 글에 없어 부족분 칸을 나누지 않습니다.
 */
const SCATTER = Array.from({ length: 20 }, (_, k) => (k * 173 + 29) % 1000);
const CLUSTER = Array.from({ length: 1000 }, (_, index) => index).filter((index) => index % 50 < 25);
const X0 = 5;
const FULL = 350;
const UNIT = FULL / 15; // 1억 원당 폭

const SCENES = [
  { label: "서로 따로 생긴 작은 사고", summary: "20명 × 300만 = 6천만 원", note: "사고가 서로 독립이면 사고를 많이 모을수록 실제 사고 비율이 예상 비율에 가까워집니다. 이 성질이 대수의 법칙입니다. 이 경우 지급액 6천만 원은 보험료 1억 원 안에 들어옵니다." },
  { label: "한 재난으로 함께 생긴 손해", summary: "500명 × 300만 = 15억 원", note: "대수의 법칙을 지역 전체 재난에 그대로 적용하면 안 됩니다. 손실이 함께 움직이면 사람 수가 많아도 흩어지지 않아, 필요한 돈이 보험료의 15배가 됩니다." },
  { label: "보험료 밖에서 메울 돈", summary: "15억 − 1억 = 14억 원", note: "보험료 1억 원을 전부 지급에 돌려도 14억 원이 모자랍니다. 계약상 지급 약속을 지키려면 자본과 미리 쌓은 준비, 다른 보험자와 나누는 계약이 필요합니다. 각각의 크기는 글에 없어 점선 칸을 나누지 않았습니다." },
] as const;

export default function SimultaneousLossViz() {
  return (
    <SceneShell
      eyebrow="동시 사고"
      title="500명이 함께 손해를 입으면 필요한 돈이 보험료의 15배가 됩니다"
      description="칸 하나가 가입자 한 명이고 크고 빨간 칸이 지급 대상입니다. 칸의 위치와 인원은 설명용 가정입니다. 아래 막대 두 개는 같은 축척입니다."
      ariaLabel="흩어진 사고 20명의 지급 6천만 원과 함께 생긴 사고 500명의 지급 15억 원을 보험료 1억 원과 비교"
      scenes={SCENES}
      render={(scene) => {
        const need = scene === 0 ? 0.6 : 15;
        const needLabel = scene === 0 ? "필요한 돈 6천만 원" : "필요한 돈 15억 원";
        return (
          <svg viewBox="0 0 360 232" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[scene].label}: ${SCENES[scene].summary}`}>
            <PoolDots hot={scene === 0 ? SCATTER : CLUSTER} />
            <text x={X0} y={160} fontSize={13} fontWeight={700} fill="#64748b">{needLabel}</text>
            {scene < 2 ? (
              <rect x={X0} y={165} width={need * UNIT} height={18} rx={2} fill="#dc2626" />
            ) : (
              <>
                <rect x={X0} y={165} width={UNIT} height={18} rx={2} fill="#2563eb" />
                <rect x={X0 + UNIT + 0.5} y={165.5} width={FULL - UNIT - 1} height={17} rx={2} fill="none" stroke="#dc2626" strokeWidth={1} strokeDasharray="4 3" />
                <text x={X0 + UNIT + (FULL - UNIT) / 2} y={179} textAnchor="middle" fontSize={13} fontWeight={700} fill="#dc2626">보험료로 못 메우는 14억 원</text>
              </>
            )}
            <text x={X0} y={204} fontSize={13} fontWeight={700} fill="#64748b">보험료 1억 원</text>
            <rect x={X0} y={209} width={UNIT} height={18} rx={2} fill="#2563eb" />
          </svg>
        );
      }}
    />
  );
}
