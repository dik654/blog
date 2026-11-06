import SceneShell from "./SceneShell";

/**
 * 본문 대응: #comparison — 도시락 사례에서는 세 이유가 회수로 모일 수 있고,
 * 조건이 바뀌면 답이 갈릴 수 있다. 글은 어느 관점이 어느 쪽을 택하는지 정하지 않으므로 그림도 정하지 않는다.
 */
const INK = "#64748b";
const BLUE = "#2563eb";
const AMBER = "#d97706";
const W = 360;
const H = 212;

const LEDGERS = [
  { name: "결과 장부", reason: "중증 피해 예방" },
  { name: "의무 장부", reason: "정확한 정보 제공 의무" },
  { name: "성품 장부", reason: "정직한 조직 습관" },
];
const CONDITIONS = ["회수 과정이 더 큰 안전 위험을 만들 때", "두 환자 중 한 명만 도울 수 있을 때", "지켜야 할 두 약속이 충돌할 때"];
const RECORD = ["피해의 분배", "침해할 수 없는 권리", "장기적인 성품과 제도"];

const SCENES = [
  { label: "도시락 사례: 한곳으로 모입니다", summary: "이유 셋 → 회수", note: "세 장부의 이유는 서로 다르지만 모두 회수를 지지할 수 있습니다. 결론이 같다고 이유까지 같아지는 것은 아닙니다." },
  { label: "조건이 바뀌면: 갈릴 수 있습니다", summary: "세 조건의 예", note: "위의 세 조건에서는 답이 갈릴 수 있습니다. 글은 어느 장부가 어느 쪽 답으로 가는지 정하지 않으므로 그림의 연결선도 방향을 정하지 않습니다." },
  { label: "갈릴 때 남길 기록", summary: "어느 순서로 보았는가", note: "번호 칸을 비워 둔 것은 정해진 순서가 없다는 뜻이 아니라, 이 글이 순서를 정해 주지 않기 때문입니다. 어느 순서로 보았는지 적어야 다른 사람이 판단을 검토할 수 있습니다." },
] as const;

export default function LedgerForkViz() {
  return (
    <SceneShell
      eyebrow="모임과 갈림"
      title="세 장부가 한곳에 모일 때와 갈릴 수 있을 때"
      description="장부는 2절에서 나눈 세 질문입니다. 결과는 피해와 이익, 의무는 약속과 권리, 성품은 반복되는 습관을 적습니다."
      ariaLabel="도시락 사례에서 세 이유가 회수로 모이는 모습과 조건이 바뀌면 답이 갈릴 수 있는 모습"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          {active === 0 && (
            <>
              {LEDGERS.map((ledger, i) => {
                const y = 8 + i * 68;
                return (
                  <g key={ledger.name}>
                    <rect x={4} y={y} width={190} height={56} rx={6} fill="none" stroke={INK} strokeWidth={1} />
                    <text x={16} y={y + 23} fontSize={12} fontWeight={700} className="fill-foreground">{ledger.name}</text>
                    <text x={16} y={y + 42} fontSize={11} fill={INK}>{ledger.reason}</text>
                    <path d={`M194 ${y + 28} L252 104`} fill="none" stroke={BLUE} strokeWidth={1} />
                  </g>
                );
              })}
              <rect x={252} y={74} width={104} height={60} rx={6} fill={BLUE} fillOpacity={0.1} stroke={BLUE} strokeWidth={1.25} />
              <text x={304} y={100} textAnchor="middle" fontSize={13} fontWeight={700} className="fill-foreground">회수</text>
              <text x={304} y={119} textAnchor="middle" fontSize={11} fill={INK}>지지할 수 있음</text>
            </>
          )}
          {active === 1 && (
            <>
              {CONDITIONS.map((text, i) => (
                <text key={text} x={180} y={18 + i * 19} textAnchor="middle" fontSize={12} className="fill-foreground">{text}</text>
              ))}
              {LEDGERS.map((ledger, i) => {
                const x = 4 + i * 120;
                return (
                  <g key={ledger.name}>
                    <rect x={x} y={70} width={112} height={36} rx={6} fill="none" stroke={INK} strokeWidth={1} />
                    <text x={x + 56} y={93} textAnchor="middle" fontSize={12} fontWeight={700} className="fill-foreground">{ledger.name}</text>
                    <path d={`M${x + 56} 106 L95 158`} fill="none" stroke={AMBER} strokeWidth={1} strokeDasharray="3 3" />
                    <path d={`M${x + 56} 106 L265 158`} fill="none" stroke={AMBER} strokeWidth={1} strokeDasharray="3 3" />
                  </g>
                );
              })}
              {[{ x: 20, t: "한쪽 답" }, { x: 190, t: "다른 쪽 답" }].map((b) => (
                <g key={b.t}>
                  <rect x={b.x} y={158} width={150} height={44} rx={6} fill="none" stroke={AMBER} strokeWidth={1} strokeDasharray="4 3" />
                  <text x={b.x + 75} y={185} textAnchor="middle" fontSize={12} fontWeight={700} className="fill-foreground">{b.t}</text>
                </g>
              ))}
            </>
          )}
          {active === 2 && (
            <>
              {RECORD.map((text, i) => {
                const y = 8 + i * 46;
                return (
                  <g key={text}>
                    <rect x={4} y={y} width={352} height={38} rx={6} fill="none" stroke={INK} strokeWidth={1} />
                    <rect x={14} y={y + 8} width={22} height={22} rx={4} fill="none" stroke={BLUE} strokeWidth={1} strokeDasharray="3 2" />
                    <text x={25} y={y + 24} textAnchor="middle" fontSize={12} fill={BLUE}>?</text>
                    <text x={48} y={y + 24} fontSize={12} fontWeight={700} className="fill-foreground">{text}</text>
                    <text x={346} y={y + 24} textAnchor="end" fontSize={11} fill={INK}>몇 번째로 봤나</text>
                  </g>
                );
              })}
              <line x1={180} x2={180} y1={146} y2={164} stroke={BLUE} strokeWidth={1} />
              <path d="M175 159 L180 165 L185 159" fill="none" stroke={BLUE} strokeWidth={1} />
              <rect x={60} y={168} width={240} height={36} rx={6} fill={BLUE} fillOpacity={0.1} stroke={BLUE} strokeWidth={1} />
              <text x={180} y={191} textAnchor="middle" fontSize={12} fontWeight={700} className="fill-foreground">다른 사람이 판단을 검토할 수 있음</text>
            </>
          )}
        </svg>
      )}
    />
  );
}
