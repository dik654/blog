import { StableSceneStack } from "@/components/viz/StableSceneStack";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #mechanism — 다섯 상대별 장부가 문 닫는 날 함께 끝나지 않고 각자의 증거로 닫힌다.
 * 점의 개수는 본문이 든 확인 항목 수입니다. 줄 안의 순서만 뜻하고, 줄끼리 어느 쪽이 먼저 끝나는지는 그리지 않습니다.
 */
const LANES = [
  { name: "고객", steps: ["마지막 주문일과 선불권 환불 방법을 알림", "미완료 주문 정리", "카드·배달의 마지막 입금과 환불까지 기록 맞춤"] },
  { name: "직원", steps: ["마지막 근무일과 퇴직 정산 기록", "사유 발생일부터 14일 이내 금품 청산이 원칙(특별한 사정과 합의로 연장 가능)", "해고예고 등 다른 고용 절차는 따로 확인"] },
  { name: "공급자·장비", steps: ["공급자 미지급액 맞춤", "재고·장비 소유자 확인 뒤 판매·반환·폐기", "리스 장비 반납 조건과 중도 종료 금액 확인, 철거 대상에서 제외"] },
  { name: "임대인", steps: ["임대차 종료 통지 기간 확인", "남길 시설·제거할 시설을 서면으로 맞춤", "복구 또는 비용 처리 문서를 확인하고 점포 인도", "보증금 정산서로 잔액 확정"] },
  { name: "관청", steps: ["폐업 신고", "폐업일이 속한 달의 다음달 25일 이내 기한을 세무 달력에 적음", "부가세·소득세·원천세 등 남은 신고 확인, 법정 자료 보관"] },
] as const;

const SCENES = [
  { label: "문 닫은 날", summary: "다섯 줄 모두 열림", note: "마지막 손님을 받은 날에도 다섯 상대와의 장부는 아직 끝나지 않았습니다. 빈 점이 남은 확인 항목입니다." },
  { label: "신고 수리 화면", summary: "점 하나만 찼습니다", note: "폐업 신고가 수리돼도 채워지는 점은 관청 줄의 첫 점뿐입니다. 이 화면 한 장을 모든 채무가 사라졌다는 증거로 쓰지 않습니다." },
  { label: "고객 줄", summary: "마지막 입금·환불까지", note: "마지막 카드 매출은 폐점 뒤에 입금될 수 있고 선불 대금은 돌려줘야 할 수 있습니다. 그래서 이 줄은 폐점일이 아니라 입금·환불 기록이 맞을 때 닫힙니다." },
  { label: "직원 줄", summary: "원칙은 14일 이내", note: "한국 근로기준법 제36조 기준입니다. 폐업이 해고예고 등 모든 고용 절차를 면제하지는 않습니다." },
  { label: "공급자·장비 줄", summary: "소유자부터 확인", note: "재고와 장비는 소유자를 확인해야 처리 방법을 정할 수 있고, 리스 장비는 철거할 물건에서 뺍니다." },
  { label: "임대인 줄", summary: "서면 → 인도 → 정산", note: "합의되지 않은 견적을 확정 채무로 적지 않습니다. 정산서에는 같은 복구비를 점주가 이미 따로 지급하지 않았는지도 표시합니다." },
  { label: "관청 줄", summary: "신고 뒤에도 기한이 남음", note: "기한은 2026-10-04 확인한 국세청 안내의 문구입니다. 폐업 신고만으로 부가세·소득세·원천세 등이 모두 끝났다고 처리하지 않습니다." },
] as const;

function isDone(lane: number, step: number, active: number) {
  if (active === 0) return false;
  if (lane === 4 && step === 0) return true;
  return active >= 2 && lane <= active - 2;
}

export default function ClosureLanesViz() {
  return (
    <SceneShell
      eyebrow="다섯 줄의 장부"
      title="문을 닫아도 줄마다 끝나는 증거가 다릅니다"
      description="한 줄이 상대 한 명과의 장부이고 찬 점이 확인을 마친 항목입니다. 점은 줄 안의 순서만 뜻하며, 줄끼리 어느 쪽이 먼저 끝나는지는 점포마다 다릅니다."
      note="항목은 이 글 7절과 8절에서 가져왔고 한국 기준입니다. 빠짐없는 체크리스트가 아니며 실제 기한은 계약과 법령으로 따로 확인합니다."
      ariaLabel="고객, 직원, 공급자와 장비, 임대인, 관청 다섯 줄의 장부가 각각 닫히는 과정"
      scenes={SCENES}
      render={(active) => (
        <div className="mx-auto w-full max-w-[620px]">
          <ul className="space-y-1.5">
            {LANES.map((lane, laneIndex) => {
              const current = active === laneIndex + 2;
              const closed = lane.steps.every((_, step) => isDone(laneIndex, step, active));
              return (
                <li key={lane.name} className={`grid grid-cols-[5.75rem_minmax(0,1fr)_2.5rem] items-center gap-2 rounded px-2 py-1.5 text-sm ${current ? "bg-primary/10" : ""}`}>
                  <span className={current ? "font-bold text-primary" : "font-medium"}>{lane.name}</span>
                  <span className="flex items-center">
                    {lane.steps.map((step, stepIndex) => (
                      <span key={step} className="flex flex-1 items-center">
                        <span className={`h-3.5 w-3.5 shrink-0 rounded-full border ${isDone(laneIndex, stepIndex, active) ? "border-primary bg-primary" : "border-muted-foreground/60 bg-background"}`} />
                        <span className={`min-w-0 flex-1 border-t ${isDone(laneIndex, stepIndex, active) ? "border-primary" : "border-dashed border-muted-foreground/50"}`} />
                      </span>
                    ))}
                  </span>
                  <span className={`text-right text-xs font-semibold ${closed ? "text-primary" : "text-muted-foreground"}`}>{closed ? "닫힘" : "열림"}</span>
                </li>
              );
            })}
          </ul>
          <StableSceneStack
            active={active}
            className="mt-3"
            scenes={SCENES.map((scene, sceneIndex) => {
              const lane = sceneIndex >= 2 ? LANES[sceneIndex - 2] : null;
              return (
                <div key={scene.label} className="rounded-lg border border-border bg-background px-3 py-2.5 text-sm">
                  {lane ? (
                    <ol className="list-none space-y-1 p-0">
                      {lane.steps.map((step, stepIndex) => (
                        <li key={step} className="m-0 grid grid-cols-[1.25rem_minmax(0,1fr)] gap-1 p-0 leading-6">
                          <span className="font-mono text-xs leading-6 text-primary">{stepIndex + 1}</span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  ) : (
                    <p className="m-0 leading-6 text-muted-foreground">{sceneIndex === 0 ? "다음 장면으로 넘기면 줄마다 어떤 확인을 거쳐 닫히는지 차례로 봅니다." : "관청 줄의 1번 점: 폐업 신고. 나머지 점은 신고와 상관없이 그대로 비어 있습니다."}</p>
                  )}
                </div>
              );
            })}
          />
        </div>
      )}
    />
  );
}
