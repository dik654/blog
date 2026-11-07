import SceneShell from "./SceneShell";
import SignedAreaChart from "./SignedAreaChart";

/**
 * 본문 대응: #kl-divergence — P=(0.5,0.5), Q=(0.9,0.1)에서 방향을 바꾸면 폭이 바뀐다.
 * P‖Q: 0.5·ln(0.5/0.9)=−0.294, 0.5·ln(0.5/0.1)=+0.805 → 0.510826 nat.
 * Q‖P: 0.9·ln(0.9/0.5)=+0.529, 0.1·ln(0.1/0.5)=−0.161 → 0.368064 nat.
 * 세 글자 사례의 Q‖P: 1/4·(−1), 0, 1/2·(+1) → 0.25 bit로 앞 방향과 우연히 같다.
 */
const SCENES = [
  {
    label: "P로 평균",
    summary: "−0.294 + 0.805 ≈ 0.511 nat",
    note: "D_KL(P‖Q)입니다. 폭은 P의 0.5, 0.5입니다. Q가 0.1밖에 주지 않은 둘째 사건이 절반의 폭을 차지해 큰 양의 넓이를 만듭니다.",
    columns: [
      { name: "첫째", weight: 0.5, height: Math.log(0.5 / 0.9), contribution: "−0.294" },
      { name: "둘째", weight: 0.5, height: Math.log(0.5 / 0.1), contribution: "+0.805" },
    ],
  },
  {
    label: "Q로 평균",
    summary: "+0.529 − 0.161 ≈ 0.368 nat",
    note: "D_KL(Q‖P)입니다. 두 항의 높이는 부호만 뒤집히지만 폭은 Q의 0.9, 0.1로 바뀝니다. 그래서 합이 앞 방향과 같지 않습니다.",
    columns: [
      { name: "첫째", weight: 0.9, height: Math.log(0.9 / 0.5), contribution: "+0.529" },
      { name: "둘째", weight: 0.1, height: Math.log(0.1 / 0.5), contribution: "−0.161" },
    ],
  },
  {
    label: "세 글자 사례의 반대 방향",
    summary: "−0.25 + 0 + 0.5 = 0.25 bit",
    note: "앞의 Q=(1/4,1/4,1/2)를 폭으로 쓴 D_KL(Q‖P)입니다. 앞 방향과 값이 같은 것은 이 숫자들의 우연입니다. 이 예 하나로 대칭이라고 결론내리면 안 됩니다.",
    columns: [
      { name: "A", weight: 0.25, height: -1, contribution: "−0.25" },
      { name: "B", weight: 0.25, height: 0, contribution: "0" },
      { name: "C", weight: 0.5, height: 1, contribution: "+0.5" },
    ],
  },
] as const;

export default function KlDirectionViz() {
  return (
    <SceneShell
      eyebrow="KL의 방향"
      title="방향을 바꾸면 높이의 부호만이 아니라 폭도 바뀝니다"
      description="앞의 두 장면은 두 사건 P=(0.5,0.5), Q=(0.9,0.1)입니다. 폭은 평균을 내는 분포의 비중, 높이는 로그 비율, 위아래 넓이는 그 항의 기여입니다. 이 두 장면은 nat, 마지막 장면은 bit로 적었습니다."
      ariaLabel="두 사건과 세 글자 사례에서 KL 발산의 두 방향을 부호 있는 넓이로 비교"
      scenes={SCENES}
      render={(active) => <SignedAreaChart columns={SCENES[active].columns} ariaLabel={`${SCENES[active].label}: ${SCENES[active].summary}`} />}
    />
  );
}
