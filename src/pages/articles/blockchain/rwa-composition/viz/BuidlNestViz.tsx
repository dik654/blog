import SceneShell from "./SceneShell";

/**
 * 본문 대응: #source — 2024-03-20 출시 발표 기준. 투자자가 쥔 것은 펀드 지분, 펀드가 현금·미국 국채·환매조건부채권을 보유.
 * 운용 BlackRock Financial Management, 수탁·관리 BNY Mellon, 토큰화·명의개서 Securitize.
 */
const SCENES = [
  { label: "무엇을 쥐었나", summary: "토큰 = 펀드 지분", note: "지갑의 토큰은 개별 국채가 아니라 펀드 지분을 나타냅니다. 국채는 펀드 안쪽에 있습니다. 투자자는 개별 국채의 직접 소유자라는 설명 대신 해당 펀드 지분의 발행 문서와 권리를 확인해야 합니다." },
  { label: "누가 맡나", summary: "운용 · 수탁 · 명의개서", note: "역할은 한 기관에 합쳐져 있지 않습니다. 2절의 운용, 보관, 보유자 기록이 각각 다른 기관에 나뉘어 있습니다." },
  { label: "1달러 목표의 뜻", summary: "목표 가치 ≠ 원금 보장", note: "발표는 1달러의 안정적 가치 목표와 일별 수익 발생·월별 추가 토큰 분배를 설명합니다. 가상 펀드의 1.02와 다른 사례 조건이며, 목표 가치와 원금 보장은 구별해야 합니다." },
  { label: "누가 옮길 수 있나", summary: "사전 승인 투자자 간", note: "발표에는 사전 승인 투자자 간 이전과 Rule 506(c)·Investment Company Act 3(c)(7)에 따른 구조가 명시됩니다. 당시 최소 투자 500만 달러는 출시 조건이며 모든 현재 지분 종류의 조건으로 확대하지 않습니다." },
] as const;

function Tag({ who, role, on }: { who: string; role: string; on: boolean }) {
  return (
    <p className={`rounded-md border px-2 py-0.5 text-xs leading-5 ${on ? "border-primary bg-primary/5" : "border-border/40 text-muted-foreground/60"}`}>
      <span className="font-bold">{role}</span> <span className="break-words">{who}</span>
    </p>
  );
}

export default function BuidlNestViz() {
  return (
    <SceneShell
      eyebrow="BUIDL 출시 발표 기준"
      title="투자자가 쥔 토큰 안쪽에 펀드가 있고 그 안쪽에 국채가 있습니다"
      description="2024-03-20 출시 발표의 구조입니다(글의 확인일 2026-10-04). 현재 청약 조건은 최신 발행 문서로 다시 확인합니다."
      ariaLabel="BUIDL 토큰, 펀드, 기초 자산의 중첩 구조와 역할"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0">
          <div className={`rounded-xl border p-2.5 ${active === 0 || active === 2 || active === 3 ? "border-primary" : "border-border"}`}>
            <p className="text-xs font-bold">투자자 지갑의 토큰 = 펀드 지분</p>
            <p className="mt-1 min-h-10 text-xs leading-5 text-muted-foreground">
              {active === 3 ? "이전: 사전 승인 투자자 사이 · 출시 당시 최소 500만 달러" : active === 2 ? "목표 1달러 · 수익은 일별 발생, 월별 추가 토큰" : "개별 국채가 아니라 펀드 지분을 나타냅니다"}
            </p>
            <div className={`mt-2 rounded-xl border p-2.5 ${active === 0 ? "border-primary" : "border-border"}`}>
              <p className="text-xs font-bold">펀드</p>
              <div className={`mt-2 rounded-xl border p-2.5 ${active === 0 ? "border-primary bg-primary/5" : "border-border"}`}>
                <p className="text-xs font-bold">펀드가 보유한 자산</p>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">현금 · 미국 국채 · 환매조건부채권(되사기로 약속하고 파는 채권)</p>
              </div>
            </div>
          </div>
          <div className="mt-2 grid grid-cols-1 gap-1">
            <Tag role="운용" who="BlackRock Financial Management" on={active === 1} />
            <Tag role="수탁·관리" who="BNY Mellon" on={active === 1} />
            <Tag role="토큰화·명의개서" who="Securitize" on={active === 1} />
          </div>
        </div>
      )}
    />
  );
}
