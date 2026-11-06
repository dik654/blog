import SceneShell from "./SceneShell";

/**
 * 본문 대응: #case — 게시물 100개 중 10개, 광고 1천 회 노출 1만 원(모두 가정).
 * 10÷100=10%, 10,000원÷1,000회=회당 10원. 1,000명×1회=500명×2회=250명×4회=1,000회(사람 수와 횟수의 조합은 가정).
 */
const W = 360;
const H = 192;

const SCENES = [
  { label: "게시물을 셉니다", summary: "10 ÷ 100 = 10%", note: "칸 하나가 게시물 하나입니다. 분모는 게시물 100개이고, 고른 10개가 어느 것인지는 정해 두지 않았습니다(가정)." },
  { label: "광고 노출을 셉니다", summary: "1만 원 ÷ 1천 회 = 회당 10원", note: "노출은 광고가 화면에 한 번 나간 일입니다. 칸 하나가 게시물이 아니라 노출 1회이므로, 앞 장면의 10%와 이어서 계산하지 않습니다(가정한 단가)." },
  { label: "1천 회는 몇 명일까요", summary: "횟수만으로는 사람 수를 모름", note: "폭은 사람 수, 높이는 한 사람이 본 횟수입니다. 세 사각형의 넓이는 모두 1천 회입니다. 세 조합은 곱셈을 보이려 고른 예(가정)이며, 실제 몇 명이 봤는지는 사례에 없습니다." },
] as const;

const PEOPLE = [
  { people: 1000, times: 1, y: 24 },
  { people: 500, times: 2, y: 66 },
  { people: 250, times: 4, y: 118 },
] as const;

export default function UnitsViz() {
  return (
    <SceneShell
      eyebrow="단위 구별"
      title="100개 중 10개와 1천 회는 서로 다른 것을 셉니다"
      description="사례의 숫자는 모두 가정이며 실제 플랫폼의 선택 방식이나 단가가 아닙니다."
      ariaLabel="게시물 수, 광고 노출 횟수, 사람 수의 단위 구별"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          {active === 0 && (
            <>
              {Array.from({ length: 100 }, (_, index) => (
                <rect key={index} x={20 + (index % 10) * 16} y={12 + Math.floor(index / 10) * 16} width={14} height={14} rx={2} fill={index < 10 ? "#2563eb" : "none"} stroke={index < 10 ? "#2563eb" : "#94a3b8"} strokeWidth={1} />
              ))}
              <text x={198} y={24} fontSize={13} fontWeight={700} fill="#2563eb">선택된 10개</text>
              <text x={198} y={40} fontSize={13} fill="#64748b">화면에 반복 노출</text>
              <text x={198} y={92} fontSize={13} fontWeight={700} fill="#64748b">나머지 90개</text>
              <text x={198} y={108} fontSize={13} fill="#64748b">반복 노출 대상이 아님</text>
            </>
          )}
          {active === 1 && (
            <>
              <text x={15} y={18} fontSize={13} fontWeight={700} fill="#2563eb">칸 하나 = 광고 노출 1회, 전부 1천 칸</text>
              {Array.from({ length: 1000 }, (_, index) => (
                <rect key={index} x={15 + (index % 50) * 6.6} y={30 + Math.floor(index / 50) * 6.6} width={5.4} height={5.4} fill="#2563eb" opacity={0.75} />
              ))}
              <text x={15} y={186} fontSize={13} fill="#64748b">광고주가 낸 돈 1만 원이 이 전체의 값입니다(가정).</text>
            </>
          )}
          {active === 2 &&
            PEOPLE.map((row) => (
              <g key={row.people}>
                <text x={30} y={row.y - 6} fontSize={13} fontWeight={700} fill="#64748b">
                  {row.people.toLocaleString("en-US")}명 × {row.times}회 = 1,000회 (가정)
                </text>
                <rect x={30} y={row.y} width={row.people * 0.3} height={row.times * 10} fill="#2563eb" opacity={0.75} />
              </g>
            ))}
        </svg>
      )}
    />
  );
}
