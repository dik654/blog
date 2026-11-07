import SceneShell from "./SceneShell";
import SignedAreaChart from "./SignedAreaChart";

/**
 * 본문 대응: #support — P=(1/2,1/2), Q=(1,0).
 * P‖Q: 둘째 항의 로그 비율이 무한대라 합이 무한대. Q‖P: 1·ln(1/0.5)=ln2, 둘째 항은 폭 0으로 세지 않는다.
 */
const SCENES = [
  {
    label: "P로 평균",
    summary: "D_KL(P‖Q) = ∞",
    note: "P는 둘째 사건에 절반을 주는데 Q는 0을 줍니다. 폭이 0.5인 칸의 높이가 끝없이 커지므로 합이 무한대입니다. 첫째 항 −0.347이 이를 상쇄하지 못합니다.",
    columns: [
      { name: "첫째", weight: 0.5, height: Math.log(0.5), contribution: "−0.347" },
      { name: "둘째", weight: 0.5, height: "infinite" as const, contribution: "∞" },
    ],
  },
  {
    label: "Q로 평균",
    summary: "D_KL(Q‖P) = ln2 ≈ 0.693 nat",
    note: "이번에는 Q로 사건을 뽑습니다. Q가 0을 준 둘째 사건은 폭이 0이어서 세지 않고, 첫째 항 1·ln(1/0.5)=ln2만 남습니다.",
    columns: [
      { name: "첫째", weight: 1, height: Math.log(2), contribution: "+0.693" },
      { name: "둘째", weight: 0, height: 0, contribution: "폭 0 · 세지 않음" },
    ],
  },
] as const;

export default function SupportZeroViz() {
  return (
    <SceneShell
      eyebrow="확률 0과 방향"
      title="확률 0이 높이에 들어가면 무한대, 폭에 들어가면 사라집니다"
      description="P=(1/2,1/2), Q=(1,0)입니다. 폭은 평균을 내는 분포의 비중, 높이는 로그 비율, 넓이는 그 항의 기여입니다. 점선 기둥은 눈금으로 잴 수 없는 무한대를 뜻합니다."
      ariaLabel="한 사건에 확률 0을 준 Q로 계산한 KL 발산의 두 방향 비교"
      scenes={SCENES}
      render={(active) => <SignedAreaChart columns={SCENES[active].columns} ariaLabel={`${SCENES[active].label}: ${SCENES[active].summary}`} />}
    />
  );
}
