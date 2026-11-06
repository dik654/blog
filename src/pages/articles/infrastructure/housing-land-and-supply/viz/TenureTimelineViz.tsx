import SceneShell from "./SceneShell";

/**
 * 본문 대응: #comparison — 99년 권리, 최소 거주 기간(MOP) 5년/10년, 처분 조건.
 * 가로축은 연수에 비례한다(1년 = 3단위). 단순 임차의 길이는 글에 없어 비례로 그리지 않는다.
 */
const YEAR = 3;
const X0 = 24;

const SCENES = [
  { label: "권리의 길이부터 다릅니다", summary: "임차 · 99년 · 기간 없음", note: "일반적인 새 HDB 주택의 구매자는 99년 동안 주택 권리를 소유합니다. 단순 임차와도 기간 없는 소유권과도 다릅니다. 10억은 이 글의 가정이고 HDB의 실제 가격이 아닙니다." },
  { label: "Standard 주택", summary: "MOP 5년", note: "최소 거주 기간(MOP)은 팔기 전에 직접 살아야 하는 기간입니다. 5년 뒤부터 팔 수 있고 집 전체 임대가 허용되며, 되팔 때 보조금 환수가 없습니다." },
  { label: "Plus·Prime 주택", summary: "MOP 10년", note: "같은 99년이어도 10년을 살아야 팔 수 있고 집 전체 임대가 안 됩니다. 되팔 때 받은 추가 보조금을 반영해 매각가의 일정 비율을 냅니다." },
] as const;

function Axis({ y }: { y: number }) {
  return (
    <>
      <line x1={X0} x2={X0 + 99 * YEAR} y1={y} y2={y} stroke="#94a3b8" strokeWidth={1} />
      {[0, 99].map((year) => (
        <text key={year} x={X0 + year * YEAR} y={y + 14} textAnchor="middle" fontSize={13} fill="#64748b">{year}년</text>
      ))}
    </>
  );
}

function MopRow({ y, name, mop, dim }: { y: number; name: string; mop: number; dim: boolean }) {
  return (
    <g opacity={dim ? 0.4 : 1}>
      <text x={X0} y={y - 6} fontSize={13} fontWeight={700} fill="#64748b">{name}</text>
      <rect x={X0} y={y} width={99 * YEAR} height={22} fill="#94a3b8" opacity={0.3} />
      <rect x={X0} y={y} width={mop * YEAR} height={22} fill="#d97706" />
      <text x={X0 + mop * YEAR + 6} y={y + 15} fontSize={13} fontWeight={700} fill="#64748b">{mop}년 뒤 매각 가능</text>
    </g>
  );
}

export default function TenureTimelineViz() {
  return (
    <SceneShell
      eyebrow="권리의 기간과 조건"
      title="같은 99년이어도 팔 수 있는 시점이 다릅니다"
      description="가로축은 연수에 비례합니다. 2024년 10월 분양분부터의 구분이며 그 이전 공급 주택에는 적용되지 않습니다(MyNiceHome, 2026-06-24 갱신)."
      ariaLabel="단순 임차, 99년 권리, 기간 없는 소유와 Standard, Plus, Prime 주택의 최소 거주 기간 비교"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0">
          <svg viewBox="0 0 360 142" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {active === 0 ? (
              <>
                <text x={X0} y={14} fontSize={13} fontWeight={700} fill="#64748b">단순 임차 · 거주할 때마다 임대료 (길이 비례 아님)</text>
                {[0, 1, 2, 3, 4].map((slot) => (
                  <rect key={slot} x={X0 + slot * 26} y={20} width={20} height={14} fill="none" stroke="#64748b" strokeWidth={1} strokeDasharray="3 3" />
                ))}
                <text x={X0} y={54} fontSize={13} fontWeight={700} fill="#2563eb">99년 권리</text>
                <rect x={X0} y={60} width={99 * YEAR} height={14} fill="#2563eb" />
                <text x={X0} y={94} fontSize={13} fontWeight={700} fill="#64748b">기간 없는 소유권</text>
                <rect x={X0} y={100} width={99 * YEAR + 18} height={14} fill="#94a3b8" />
                <path d={`M${X0 + 99 * YEAR + 28} 107 l-10 -7 v14 z`} fill="#94a3b8" />
                <text x={X0} y={132} fontSize={13} fill="#64748b">0년</text>
                <text x={X0 + 99 * YEAR} y={132} textAnchor="middle" fontSize={13} fill="#64748b">99년</text>
              </>
            ) : (
              <>
                <MopRow y={24} name="Standard" mop={5} dim={active !== 1} />
                <MopRow y={80} name="Plus·Prime" mop={10} dim={false} />
                <Axis y={120} />
              </>
            )}
          </svg>
        </div>
      )}
    />
  );
}

