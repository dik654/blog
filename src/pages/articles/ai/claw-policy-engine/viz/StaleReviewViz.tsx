import PolicySceneShell from "./PolicySceneShell";

/**
 * 본문 대응: #lane-context — review approved가 현재 diff revision과 결속되지 않으면
 * review 뒤 변경된 code를 merge할 수 있다. Context에 repository SHA·evidence를 묶고
 * executor가 같은 snapshot을 소비하는지 확인해야 한다.
 * revision 이름 A·B는 설명용 가정.
 */
const SCENES = [
  {
    label: "Review 승인",
    summary: "rev A 검토 → review=true",
    note: "Reviewer가 revision A를 보고 승인합니다. LaneContext에는 review approved가 true라는 boolean 하나만 들어간다고 하겠습니다.",
  },
  {
    label: "Review 뒤 새 diff",
    summary: "head가 rev B로 이동",
    note: "승인 뒤에 code가 바뀌어 현재 head가 revision B가 됩니다. B는 아무도 검토하지 않았지만 context의 boolean은 여전히 true입니다.",
  },
  {
    label: "Flag만 보고 판정",
    summary: "MergeToDev → rev B",
    note: "Evaluator는 true만 보므로 merge rule이 match할 수 있습니다. 그대로 MergeToDev가 실행되면 merge되는 것은 review된 A가 아니라 검토받지 않은 B입니다.",
  },
  {
    label: "SHA를 함께 묶으면",
    summary: "review@A ≠ head B",
    note: "본문이 제안하는 방향입니다. Context를 만들 때 review가 가리키는 SHA와 현재 repository SHA를 함께 담으면 둘이 다르다는 사실이 드러나고, action executor가 같은 snapshot을 소비하는지 실행 전에 확인할 수 있습니다.",
  },
] as const;

const BLUE = "#2563eb";
const RED = "#dc2626";
const GREY = "#94a3b8";
const TEXT = "#64748b";

export default function StaleReviewViz() {
  return (
    <PolicySceneShell
      eyebrow="판정과 실행 사이"
      title="Review=true가 어느 revision의 승인인지 모르면 생기는 일"
      description="위 줄은 시간 순서대로 놓인 repository의 revision, 가운데는 evaluator가 받는 LaneContext, 아래는 실행되는 action입니다. Revision 이름 A·B는 설명용 가정입니다."
      ariaLabel="review 승인 후 새 diff가 들어와 검토받지 않은 revision이 merge될 수 있는 과정"
      scenes={SCENES}
      render={(active) => {
        const bound = active === 3;
        const headB = active >= 1;
        const decided = active >= 2;
        return (
          <svg viewBox="0 0 320 236" className="mx-auto block h-auto w-full max-w-[520px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <text x={4} y={14} fontSize={12} fontWeight={700} fill={TEXT}>repository · 시간 →</text>
            <line x1={4} x2={14} y1={44} y2={44} stroke={GREY} strokeWidth={1} />
            <line x1={124} x2={182} y1={44} y2={44} stroke={GREY} strokeWidth={1} />
            <line x1={292} x2={316} y1={44} y2={44} stroke={GREY} strokeWidth={1} />
            <rect x={14} y={22} width={110} height={44} rx={8} fill="none" stroke={BLUE} strokeWidth={1.25} />
            <text x={69} y={41} textAnchor="middle" fontSize={13} fontWeight={700} fill={BLUE}>rev A</text>
            <text x={69} y={58} textAnchor="middle" fontSize={11} fill={TEXT}>review 승인</text>
            <rect x={182} y={22} width={110} height={44} rx={8} fill="none" stroke={headB ? RED : GREY} strokeWidth={headB ? 1.25 : 1} strokeDasharray={headB ? undefined : "4 3"} opacity={headB ? 1 : 0.4} />
            <text x={237} y={41} textAnchor="middle" fontSize={13} fontWeight={700} fill={headB ? RED : GREY} opacity={headB ? 1 : 0.5}>rev B</text>
            <text x={237} y={58} textAnchor="middle" fontSize={11} fill={TEXT} opacity={headB ? 1 : 0.4}>검토 안 됨 · head</text>

            <text x={4} y={92} fontSize={12} fontWeight={700} fill={TEXT}>LaneContext</text>
            <rect x={14} y={100} width={292} height={48} rx={8} fill="none" stroke={bound ? BLUE : GREY} strokeWidth={1} />
            <text x={160} y={120} textAnchor="middle" fontSize={13} fontWeight={700} fill={bound ? BLUE : "#475569"} fontFamily="ui-monospace, monospace">
              {bound ? "review@A · head=B" : "review_approved = true"}
            </text>
            <text x={160} y={139} textAnchor="middle" fontSize={11} fill={TEXT}>
              {bound ? "두 SHA가 달라 불일치가 보임" : "어느 revision의 승인인지 없음"}
            </text>

            <text x={4} y={174} fontSize={12} fontWeight={700} fill={TEXT}>실행</text>
            <rect x={14} y={182} width={292} height={46} rx={8} fill="none" stroke={decided ? (bound ? BLUE : RED) : GREY} strokeWidth={decided ? 1.25 : 1} strokeDasharray={decided ? undefined : "4 3"} opacity={decided ? 1 : 0.4} />
            <text x={160} y={210} textAnchor="middle" fontSize={12} fontWeight={700} fill={decided ? (bound ? BLUE : RED) : GREY} opacity={decided ? 1 : 0.5}>
              {!decided ? "아직 판정 전" : bound ? "실행 전에 snapshot 불일치를 확인할 수 있음" : "MergeToDev가 rev B를 merge할 수 있음"}
            </text>
          </svg>
        );
      }}
    />
  );
}
