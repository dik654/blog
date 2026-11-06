import SceneShell from "./SceneShell";

/**
 * 본문 대응: #names(페트로달러 재순환), #source(산유국 달러가 국제 은행을 거쳐 대출로 재순환).
 * 40→80과 부족 30은 3절의 가정입니다. 예금 액수는 글에 없어 적지 않습니다.
 */
const SCENES = [
  { label: "석유값이 산유국으로", summary: "석유 수입 40 → 80", note: "3절의 나라가 같은 양의 석유에 80을 냅니다. 산유국의 달러 수입이 그만큼 늘어나는 쪽에서 흐름이 시작됩니다." },
  { label: "늘어난 달러가 은행으로", summary: "산유국 → 국제 은행 예금", note: "산유국의 늘어난 달러 수입이 국제 은행 예금으로 들어갑니다. 예금 액수는 글에 없어 숫자를 적지 않았습니다." },
  { label: "은행이 대출로 내보냅니다", summary: "부족 30을 은행 대출로", note: "은행은 그 돈을 다른 나라에 빌려 줍니다. 석유 수입국은 3절의 부족 30을 이 대출로 메워 당장의 조정을 늦춥니다." },
  { label: "남는 것은 미래 의무", summary: "외채가 쌓임", note: "외채는 국외 채권자에게 미래 외화 지급을 약속한 빚입니다. 돈은 지금 들어왔지만 원금과 이자를 달러로 낼 의무가 남습니다." },
] as const;

const IDLE = "#94a3b8";
const MUTED = "#64748b";

function Arrow({ x1, y1, x2, y2, color, dashed }: { x1: number; y1: number; x2: number; y2: number; color: string; dashed?: boolean }) {
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const a = 8;
  const b = 4.5;
  const bx = x2 - a * Math.cos(angle);
  const by = y2 - a * Math.sin(angle);
  const px = -Math.sin(angle) * b;
  const py = Math.cos(angle) * b;
  return (
    <g>
      <line x1={x1} y1={y1} x2={bx} y2={by} stroke={color} strokeWidth={color === IDLE ? 1 : 1.25} strokeDasharray={dashed ? "4 3" : undefined} />
      <path d={`M${x2} ${y2} L${bx + px} ${by + py} L${bx - px} ${by - py} Z`} fill={color} />
    </g>
  );
}

function Node({ x, y, w, label }: { x: number; y: number; w: number; label: string }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={42} rx={8} fill="none" stroke={IDLE} strokeWidth={1} />
      <text x={x + w / 2} y={y + 26} textAnchor="middle" fontSize={13} fontWeight={700} className="fill-foreground">{label}</text>
    </g>
  );
}

export default function PetrodollarLoopViz() {
  return (
    <SceneShell
      eyebrow="돈의 경로"
      title="석유값으로 나간 달러가 은행을 거쳐 대출로 다시 흐릅니다"
      description="페트로달러 재순환은 산유국의 늘어난 달러 수입이 국제 은행 예금과 다른 나라 대출로 다시 흐르는 과정입니다. 40·80·30은 3절의 가정입니다."
      ariaLabel="석유 수입국, 산유국, 국제 은행 사이의 달러 흐름과 남는 미래 의무"
      scenes={SCENES}
      render={(active) => {
        const color = (step: number) => (active === step ? "#2563eb" : active > step ? IDLE : "transparent");
        const label = (step: number) => (active === step ? "#2563eb" : active > step ? MUTED : "transparent");
        return (
          <svg viewBox="0 0 340 204" className="mx-auto h-auto w-full max-w-[520px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <Node x={110} y={4} w={120} label="국제 은행" />
            <Node x={4} y={158} w={104} label="석유 수입국" />
            <Node x={232} y={158} w={104} label="산유국" />

            {active >= 0 && <Arrow x1={110} y1={179} x2={230} y2={179} color={color(0)} />}
            <text x={170} y={170} textAnchor="middle" fontSize={12} fontWeight={700} fill={label(0)}>석유값 40→80</text>

            {active >= 1 && <Arrow x1={276} y1={156} x2={205} y2={48} color={color(1)} />}
            <text x={252} y={92} fontSize={12} fontWeight={700} fill={label(1)}>늘어난 달러</text>
            <text x={252} y={108} fontSize={12} fontWeight={700} fill={label(1)}>예금</text>

            {active >= 2 && <Arrow x1={135} y1={48} x2={52} y2={156} color={color(2)} />}
            <text x={84} y={92} textAnchor="end" fontSize={12} fontWeight={700} fill={label(2)}>대출 30</text>

            {active >= 3 && <Arrow x1={90} y1={156} x2={168} y2={48} color="#dc2626" dashed />}
            <text x={176} y={110} fontSize={12} fontWeight={700} fill={active >= 3 ? "#dc2626" : "transparent"}>미래</text>
            <text x={176} y={126} fontSize={12} fontWeight={700} fill={active >= 3 ? "#dc2626" : "transparent"}>원리금</text>
          </svg>
        );
      }}
    />
  );
}
