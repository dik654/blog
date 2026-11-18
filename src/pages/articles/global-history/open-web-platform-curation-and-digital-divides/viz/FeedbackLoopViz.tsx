import { Arrow, Box } from "./FlowParts";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #mechanism — 클릭 40이 추천 모형·노출·광고 수입과 팔로어·제작 선택을 거쳐
 * 다음 후보로 돌아오는 되먹임, 순위를 낮추는 쪽(3절 둘째 문단의 신고·품질 신호·다양성 규칙),
 * 결과를 판정할 때 함께 볼 지표(7절 둘째 문단).
 * 고리의 각 단계가 얼마나 커지는지는 글에 수치가 없어 크기로 그리지 않는다.
 */
const LOOP = "#2563eb";
const MONEY = "#16a34a";
const MAKER = "#7c3aed";
const BRAKE = "#dc2626";
const JUDGE = "#64748b";

const SCENES = [
  { label: "클릭 40이 입력이 됩니다", summary: "반응 → 추천 모형", note: "3절의 가정처럼 한 게시물이 클릭 40을 받으면, 추천 모형(과거 반응으로 다음에 보여 줄 것을 예측하는 규칙)은 비슷한 이용자에게 그 글을 더 자주 보여 주기도 합니다." },
  { label: "노출이 늘면", summary: "광고 수입·팔로어 증가", note: "노출이 늘면 광고 수입과 팔로어가 늡니다. 반응이 결과로 끝나지 않고 돈과 관계로 이어집니다." },
  { label: "제작자가 같은 형식을 더 만듭니다", summary: "고리가 닫힘", note: "제작자는 같은 형식을 더 만들고, 그 글들이 다음 후보가 됩니다. 과거 반응이 다음 선택지를 바꾸는 되먹임입니다." },
  { label: "순위를 낮추는 쪽도 있습니다", summary: "신고·품질 신호·다양성 규칙", note: "3절에서 본 것처럼 신고·품질 신호·다양성 규칙은 순위를 낮추기도 합니다. 그래서 고리가 늘 커지기만 한다고 그리지 않았습니다." },
  { label: "결과를 판정하려면", summary: "반응 지표 + 함께 볼 지표", note: "결과를 판정하려면 노출·체류·공유뿐 아니라 정정, 출처 다양성, 피해와 이의 제기 결과를 함께 봐야 합니다." },
] as const;

function Chip({ x, y, w, text, color, on }: { x: number; y: number; w: number; text: string; color: string; on: boolean }) {
  return (
    <g opacity={on ? 1 : 0.35}>
      <rect x={x} y={y} width={w} height={20} rx={4} fill={color} fillOpacity={0.12} stroke={color} strokeWidth={1} />
      <text x={x + w / 2} y={y + 14} textAnchor="middle" fontSize={10.5} fontWeight={600} fill="currentColor">{text}</text>
    </g>
  );
}

export default function FeedbackLoopViz() {
  return (
    <SceneShell
      eyebrow="되먹임"
      title="클릭 40이 다음 노출과 제작 선택으로 되돌아옵니다"
      description="3절의 가정 숫자를 이어 쓴 흐름도입니다. 상자 크기와 화살표 길이는 효과의 크기를 뜻하지 않습니다."
      ariaLabel="클릭이 추천 모형, 노출, 광고 수입과 팔로어, 제작자의 선택을 거쳐 다음 후보로 돌아오는 고리와 순위를 낮추는 규칙, 판정 지표"
      scenes={SCENES}
      render={(active) => {
        const brake = active === 3;
        const judge = active === 4;
        const all = active >= 3;
        return (
          <svg viewBox="0 0 360 250" className="mx-auto h-auto w-full max-w-[440px] text-foreground" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <Box x={8} y={10} w={110} h={44} title="클릭 40" sub="한 게시물 (가정)" color={LOOP} on={active === 0 || all} />
            <Box x={242} y={10} w={110} h={44} title="추천 모형" sub="더 자주 보여 주기도" color={LOOP} on={active === 0 || all} />
            <Arrow x1={120} y1={32} x2={240} y2={32} color={LOOP} on={active === 0 || all} />

            <Box x={242} y={104} w={110} h={44} title="노출 증가" color={LOOP} on={active === 1 || all} />
            <Arrow x1={297} y1={56} x2={297} y2={102} color={LOOP} on={active === 1 || all} />
            <Box x={242} y={190} w={110} h={44} title="광고 수입" sub="팔로어" color={MONEY} on={active === 1 || all} />
            <Arrow x1={297} y1={150} x2={297} y2={188} color={MONEY} on={active === 1 || all} />

            <Box x={8} y={190} w={130} h={44} title="같은 형식을 더 만듦" sub="제작자" color={MAKER} on={active === 2 || all} />
            <Arrow x1={240} y1={212} x2={140} y2={212} color={MAKER} on={active === 2 || all} />
            <Box x={8} y={104} w={110} h={44} title="다음 후보" color={MAKER} on={active === 2 || all} dashed />
            <Arrow x1={63} y1={188} x2={63} y2={150} color={MAKER} on={active === 2 || all} />
            <Arrow x1={63} y1={102} x2={63} y2={56} color={LOOP} on={active === 2 || all} dashed />
            <text x={180} y={126} textAnchor="middle" fontSize={11} fontWeight={700} fill={LOOP} opacity={judge ? 0 : active === 2 || all ? 1 : 0.4}>되먹임</text>

            {brake && (
              <g>
                <rect x={126} y={62} width={108} height={36} rx={6} fill={BRAKE} fillOpacity={0.08} stroke={BRAKE} strokeWidth={1} strokeDasharray="4 3" />
                <text x={180} y={77} textAnchor="middle" fontSize={10.5} fontWeight={700} fill={BRAKE}>신고·품질 신호</text>
                <text x={180} y={91} textAnchor="middle" fontSize={10.5} fontWeight={700} fill={BRAKE}>다양성 규칙</text>
                <Arrow x1={234} y1={80} x2={258} y2={102} color={BRAKE} on />
                <text x={180} y={150} textAnchor="middle" fontSize={10.5} fill="currentColor">순위를 낮추기도 함</text>
              </g>
            )}
            {judge && (
              <g>
                <text x={180} y={68} textAnchor="middle" fontSize={10.5} fontWeight={700} fill="currentColor">반응 지표</text>
                <Chip x={130} y={74} w={100} text="노출·체류·공유" color={LOOP} on />
                <text x={180} y={112} textAnchor="middle" fontSize={10.5} fontWeight={700} fill={JUDGE}>함께 볼 지표</text>
                <Chip x={135} y={118} w={90} text="정정" color={JUDGE} on />
                <Chip x={135} y={142} w={90} text="출처 다양성" color={JUDGE} on />
                <Chip x={135} y={166} w={90} text="피해·이의 제기" color={JUDGE} on />
              </g>
            )}
          </svg>
        );
      }}
    />
  );
}
