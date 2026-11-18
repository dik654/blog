import SceneShell from "./SceneShell";

/**
 * 본문 대응: #picture — 같은 초보자의 주문이 한국의 단계별 문과 싱가포르의 지식·경험 심사에서 멈추는 자리.
 * 한국(3·4·8절): 교육 1시간 + 모의거래 3시간 → 1단계 예탁 1,000만 원(선물(변동성지수선물 제외)·옵션 매수)
 *   → 미결제약정 10거래일 보유 경험 + 2단계 2,000만 원(전체 선물·옵션). 700만 원은 4절의 설명용 사례.
 * 싱가포르(3·4·9절): 상장 복잡상품 CAR은 여러 근거 중 하나, 거래 경험이면 최근 3년 6회.
 *   미충족이어도 금융회사가 추가 안전장치를 두면 진행 가능. 적합성 판단은 권유 시 별도(2·6절).
 */
type Status = "pass" | "stop" | "wait" | "open" | "closed" | "idle";

interface GateState {
  kr: readonly [Status, Status, Status];
  deposit: string;
  sgPath: boolean;
  sgMet: Status;
  sgSafeguard: Status;
  fit: Status;
  focus: "kr" | "sg" | "fit";
}

const SCENES: readonly (GateState & { label: string; summary: string; note: string })[] = [
  {
    label: "한국: 예탁금 700만 원",
    summary: "700만 < 1,000만 → 주문 전 멈춤",
    note: "교육 1시간·모의거래 3시간을 끝냈어도 예탁금이 700만 원이면(설명용 사례) 1단계 기본예탁금 1,000만 원에 못 미쳐 주문 단계로 가지 못합니다.",
    kr: ["pass", "stop", "wait"],
    deposit: "사례 예탁금 700만 원",
    sgPath: false,
    sgMet: "idle",
    sgSafeguard: "idle",
    fit: "idle",
    focus: "kr",
  },
  {
    label: "한국: 1단계 통과",
    summary: "선물(변동성지수선물 제외)·옵션 매수",
    note: "1,000만 원을 채우면(가정) 변동성지수선물을 뺀 선물과 옵션 매수부터 열립니다. 곧바로 모든 옵션 매도를 할 수 있는 것은 아니어서 2단계는 아직입니다.",
    kr: ["pass", "pass", "wait"],
    deposit: "사례 예탁금 1,000만 원",
    sgPath: false,
    sgMet: "idle",
    sgSafeguard: "idle",
    fit: "idle",
    focus: "kr",
  },
  {
    label: "한국: 2단계로 넓히기",
    summary: "10거래일 보유 + 2,000만 원",
    note: "미결제약정은 아직 반대매매나 만기로 닫히지 않은 계약입니다. 이를 10거래일 이상 보유한 경험과 예탁금 2,000만 원(가정)이 있어야 전체 선물·옵션으로 넓어집니다.",
    kr: ["pass", "pass", "pass"],
    deposit: "사례 예탁금 2,000만 원",
    sgPath: false,
    sgMet: "idle",
    sgSafeguard: "idle",
    fit: "idle",
    focus: "kr",
  },
  {
    label: "싱가포르: 여러 길 중 하나",
    summary: "거래 경험이면 최근 3년 6회",
    note: "싱가포르 계좌 심사(CAR)는 예탁금이 아니라 지식·경험을 봅니다. 학력·전문자격·관련 경력·거래 경험·교육 평가 중 적용 가능한 하나면 되고, 거래 경험이면 최근 3년 상장 복잡상품 거래 6회가 기준입니다.",
    kr: ["idle", "idle", "idle"],
    deposit: "사례 예탁금 2,000만 원",
    sgPath: true,
    sgMet: "pass",
    sgSafeguard: "idle",
    fit: "idle",
    focus: "sg",
  },
  {
    label: "싱가포르: 확인하지 못하면",
    summary: "추가 안전장치를 두면 진행 가능",
    note: "돈이 충분해도 지식·경험을 확인하지 못하면 금융회사가 적합성 조언·위험 설명 같은 추가 안전장치를 두어야 하고, 그러면 거래를 진행할 수 있습니다. ‘불합격이면 언제나 거래 금지’가 아닙니다.",
    kr: ["idle", "idle", "idle"],
    deposit: "사례 예탁금 2,000만 원",
    sgPath: false,
    sgMet: "closed",
    sgSafeguard: "open",
    fit: "idle",
    focus: "sg",
  },
  {
    label: "두 문 모두 답하지 않는 질문",
    summary: "목적·재산에 맞는가 = 적합성",
    note: "예탁금을 넣은 것도 지식 심사를 통과한 것도 이 상품이 그 사람의 목적·재산에 맞는다는 증명은 아닙니다. 판매자가 권유했다면 목적과 재산 상황에 맞는지를 별도로 살펴야 합니다.",
    kr: ["idle", "idle", "idle"],
    deposit: "사례 예탁금 2,000만 원",
    sgPath: false,
    sgMet: "idle",
    sgSafeguard: "idle",
    fit: "open",
    focus: "fit",
  },
];

const BADGE: Record<Status, { text: string; cls: string }> = {
  pass: { text: "통과", cls: "border-emerald-600 text-emerald-700 dark:text-emerald-400" },
  stop: { text: "멈춤", cls: "border-red-600 text-red-700 dark:text-red-400" },
  wait: { text: "아직", cls: "border-border text-muted-foreground" },
  open: { text: "열림", cls: "border-blue-600 text-blue-700 dark:text-blue-400" },
  closed: { text: "닫힘", cls: "border-border text-muted-foreground" },
  idle: { text: "·", cls: "border-transparent text-muted-foreground/50" },
};

const FRAME: Record<Status, string> = {
  pass: "border-emerald-600/70",
  stop: "border-red-600",
  wait: "border-border",
  open: "border-blue-600/80 bg-blue-500/5",
  closed: "border-dashed border-border",
  idle: "border-border/50",
};

function Step({ title, sub, extra, status, badgeText, dim = false }: { title: string; sub?: string; extra?: string; status: Status; badgeText?: string; dim?: boolean }) {
  const badge = BADGE[status];
  return (
    <div className={`flex items-start justify-between gap-2 rounded-lg border px-3 py-1.5 ${FRAME[status]} ${dim ? "opacity-50" : ""}`}>
      <div className="min-w-0 text-xs leading-5">
        <span className="block font-semibold">{title}</span>
        {sub ? <span className="block text-muted-foreground">{sub}</span> : null}
        {extra ? <span className="block font-mono text-[11px] text-foreground/80">{extra}</span> : null}
      </div>
      <span className={`inline-flex h-5 w-11 shrink-0 items-center justify-center rounded border text-xs font-bold ${badge.cls}`}>{badgeText ?? badge.text}</span>
    </div>
  );
}

function Arrow() {
  return <div aria-hidden className="pl-4 text-[10px] leading-3 text-muted-foreground">↓</div>;
}

export default function EntryGateViz() {
  return (
    <SceneShell
      eyebrow="첫 주문 앞의 문"
      title="같은 초보자의 주문이 두 나라에서 멈추는 지점"
      description="한국거래소 안내의 신규 일반개인 단계와 싱가포르 상장 복잡상품의 계좌 심사를 함께 놓습니다. 두 나라 숫자를 한 합격표처럼 바꿔 쓰지 않습니다."
      ariaLabel="한국의 교육·예탁금 단계와 싱가포르의 지식·경험 심사, 그리고 별도의 적합성 판단"
      scenes={SCENES}
      render={(active) => {
        const s = SCENES[active];
        const krDim = s.focus !== "kr";
        const sgDim = s.focus !== "sg";
        return (
          <div className="grid min-w-0 gap-3 sm:grid-cols-2">
              <section className={`min-w-0 max-sm:col-start-1 max-sm:row-start-1 ${krDim ? "max-sm:invisible sm:opacity-60" : ""}`} aria-label="한국">
                <h5 className="mb-1.5 text-sm font-bold">한국 · 신규 일반개인(2026-10 안내값)</h5>
                <Step title="사전교육 1시간·모의거래 3시간 이상" status={s.kr[0]} />
                <Arrow />
                <Step title="1단계 기본예탁금 1,000만 원" sub="→ 선물(변동성지수선물 제외)·옵션 매수" extra={`${s.deposit}${active === 0 ? "" : " (가정)"}`} status={s.kr[1]} />
                <Arrow />
                <Step title="2단계 예탁금 2,000만 원 + 10거래일" sub="미결제약정(아직 닫히지 않은 계약) 보유 경험 → 전체 선물·옵션" status={s.kr[2]} />
              </section>
              <section className={`min-w-0 max-sm:col-start-1 max-sm:row-start-1 sm:col-start-2 sm:row-start-1 ${sgDim ? "max-sm:invisible sm:opacity-60" : ""}`} aria-label="싱가포르">
                <h5 className="mb-1.5 text-sm font-bold">싱가포르 · 상장 복잡상품 계좌 심사(CAR)</h5>
                <div className={`rounded-lg border px-3 py-2 ${s.focus === "sg" ? "border-blue-600/80" : "border-border/50"}`}>
                  <span className="block text-xs font-semibold leading-5">다음 중 하나로 지식·경험 확인</span>
                  <div className="mt-1 flex flex-wrap gap-1.5 text-xs leading-5">
                    {["학력·전문자격", "관련 경력", "거래 경험: 최근 3년 6회", "교육 평가"].map((path) => {
                      const lit = s.sgPath && path.startsWith("거래 경험");
                      return (
                        <span key={path} className={`rounded border px-1.5 ${lit ? "border-emerald-600 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400" : "border-border text-muted-foreground"}`}>
                          {path}
                        </span>
                      );
                    })}
                  </div>
                </div>
                <Arrow />
                <Step title="충족 → 거래 진행" status={s.sgMet} badgeText={s.sgMet === "closed" ? "아님" : s.sgMet === "pass" ? "충족 시" : undefined} />
                <Arrow />
                <Step title="미충족 → 금융회사가 추가 안전장치" sub="적합성 조언·위험 설명을 두면 진행 가능" status={s.sgSafeguard} badgeText={s.sgSafeguard === "open" ? "가능" : undefined} />
              </section>
              <div className={`min-w-0 max-sm:col-start-1 max-sm:row-start-1 sm:col-span-2 ${s.focus !== "fit" ? "max-sm:invisible" : ""}`}>
                <Step
                  title="권유했다면 따로: 적합성 판단"
                  sub="상품 위험이 고객의 목적·재산 상황에 맞는가 — 위의 어느 문으로도 대신하지 못함"
                  status={s.fit}
                  badgeText={s.fit === "open" ? "별도" : undefined}
                  dim={s.focus !== "fit"}
                />
              </div>
          </div>
        );
      }}
    />
  );
}
