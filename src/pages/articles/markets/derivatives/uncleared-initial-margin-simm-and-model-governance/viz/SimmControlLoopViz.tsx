import SceneShell from "./SceneShell";

/**
 * 본문 대응: #mechanism — 적용 대상 → 상계 묶음 → 민감도 → 집계 → 상대방 대사 → 수탁 계좌 송금 → 결제 확인,
 * 그 뒤 실제 손익과 모형 예측 비교, 새 상품 누락·집중 위험·버전 변경 검토, 보정 승인.
 * 대사에서 어긋나는 원인은 2·5절(거래 집합·누락, 민감도 산출법, 계약 묶음, 환율·통화 변환, 버전 적용일).
 * 장기 통제가 다시 계산 단계로 이어지는 화살표는 "보정을 승인받는다"는 본문을 계산 규칙의 변경으로 읽은 그림이다.
 */
const DAILY = [
  { name: "적용 대상", detail: "법인·관할·평균명목액·거래 유형" },
  { name: "상계 묶음", detail: "법적으로 집행 가능한 묶음에 거래 배정" },
  { name: "민감도 산출", detail: "현재 SIMM 형식" },
  { name: "집계", detail: "IM 금액" },
  { name: "상대방과 대사", detail: "양쪽 계산을 맞춤" },
  { name: "수탁 계좌 송금", detail: "합의한 IM" },
  { name: "결제 확인", detail: "담보 도착" },
] as const;

const LONG = [
  { name: "실제 손익 ↔ 모형 예측", detail: "비교" },
  { name: "누락·집중·버전 검토", detail: "새 상품 누락·집중 위험·버전 변경" },
  { name: "보정 승인", detail: "필요한 보정을 승인받음" },
] as const;

const MISMATCH = ["거래 집합·누락", "민감도 산출법", "계약 묶음", "환율·통화 변환", "버전 적용일"] as const;

const SCENES = [
  { label: "대상과 상계 묶음", summary: "누구의 어떤 거래인가", from: 0, daily: 2, long: 0, note: "법인·관할·평균명목액과 거래 유형으로 규칙 적용 대상을 정하고, 법적으로 집행 가능한 상계 묶음에 거래를 넣습니다. 묶음이 달라지면 뒤의 모든 숫자가 달라집니다." },
  { label: "민감도와 집계", summary: "SIMM 형식 → IM 금액", from: 2, daily: 4, long: 0, note: "각 거래의 위험 민감도를 현재 SIMM 형식으로 만들고 집계해 개시증거금 금액을 얻습니다. 3절의 6·4 → 8은 이 집계를 단순화한 교육용 예이며 실제 SIMM 공식은 아닙니다." },
  { label: "상대방과 대사", summary: "같은 SIMM이어도 어긋날 수 있음", from: 4, daily: 5, long: 0, note: "집계한 금액을 상대방 계산과 맞춥니다. 같은 SIMM을 써도 거래 집합, 민감도 산출법, 계약 묶음, 환율 변환, 버전 적용일이 다르면 금액이 어긋나 분쟁이 날 수 있습니다." },
  { label: "수탁 계좌와 결제", summary: "합의한 IM → 수탁 계좌", from: 5, daily: 7, long: 0, note: "합의한 개시증거금을 수탁 계좌로 보내고 결제를 확인합니다. 여기까지가 하루 계산 줄입니다." },
  { label: "장기 통제", summary: "검증 → 보정 승인 → 다음 계산", from: 7, daily: 7, long: 3, note: "이후 실제 손익과 모형 예측을 비교하고 새 상품 누락, 집중 위험, 버전 변경을 검토해 필요한 보정을 승인받습니다. 그림에서는 승인된 보정이 이후의 하루 계산(새 상품 누락이면 대상·묶음, 보정이면 민감도·집계)에 반영되는 것으로 이었습니다." },
] as const;

function Step({ index, name, detail, done, current, showDetail }: { index: string; name: string; detail: string; done: boolean; current: boolean; showDetail: boolean }) {
  return (
    <li className={`min-w-0 rounded-lg border px-2 py-1.5 text-xs leading-5 ${current ? "border-blue-600 bg-background" : done ? "border-border bg-background" : "border-dashed border-border/60 opacity-45"}`}>
      <span className={`mr-1 font-mono text-[11px] ${current ? "text-blue-700 dark:text-blue-300" : "text-muted-foreground"}`}>{index}</span>
      <span className="font-semibold">{name}</span>
      {showDetail && <span className="block text-muted-foreground">{detail}</span>}
    </li>
  );
}

export default function SimmControlLoopViz() {
  return (
    <SceneShell
      eyebrow="하루 계산과 장기 통제"
      title="하루 계산 줄이 끝나면 검증 줄이 필요한 보정을 승인받습니다"
      description="번호 순서대로 진행합니다. 칸 너비는 시간이 아닙니다. 대사는 두 회사가 각자 계산한 금액과 입력을 서로 맞춰 보는 일이고, 수탁 계좌는 제3자가 담보를 따로 보관하는 계좌입니다."
      ariaLabel="적용 대상부터 결제 확인까지 일곱 단계의 하루 계산과, 손익 비교·검토·보정 승인의 장기 통제가 다음 계산으로 이어지는 순서"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0 space-y-4">
            <div className="min-w-0">
              <p className="mb-2 text-xs font-bold">하루 계산</p>
              <ol className="grid grid-cols-2 gap-1.5 sm:grid-cols-4 sm:gap-2">
                {DAILY.map((step, index) => (
                  <Step
                    key={step.name}
                    index={String(index + 1)}
                    name={step.name}
                    detail={step.detail}
                    done={index < scene.daily}
                    current={scene.long === 0 && index >= scene.from && index < scene.daily}
                    showDetail={false}
                  />
                ))}
              </ol>
            </div>
            <div className={`min-w-0 rounded-lg border px-3 py-2 ${active === 2 ? "border-red-600" : "border-dashed border-border/50 opacity-40"}`}>
              <p className="text-xs font-bold text-red-700 dark:text-red-400">5번 대사에서 어긋나는 입력</p>
              <ul className="mt-1 flex flex-wrap gap-1.5">
                {MISMATCH.map((item) => (
                  <li key={item} className="rounded border border-border px-1.5 py-0.5 text-[11px] leading-5">{item}</li>
                ))}
              </ul>
            </div>
            <div className="min-w-0">
              <p className="mb-2 text-xs font-bold">장기 통제 <span className="font-normal text-muted-foreground">→ 승인된 보정은 다음 하루 계산에 반영(그림의 해석)</span></p>
              <ol className="grid grid-cols-1 gap-1.5 sm:grid-cols-3 sm:gap-2">
                {LONG.map((step, index) => (
                  <Step key={step.name} index={String.fromCharCode(97 + index)} name={step.name} detail={step.detail} done={index < scene.long} current={scene.long > 0} showDetail />
                ))}
              </ol>
            </div>
          </div>
        );
      }}
    />
  );
}
