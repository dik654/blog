import SceneShell from "./SceneShell";

/**
 * 본문 대응: #mechanism — 기한 미지급 뒤 통제권과 돈이 움직이는 순서.
 * 개시 기준 확인 → 처분·추심 중지 → 채권 분류 → 70과 95의 근거 검토 → 재조정안(새 자금 10)·투표·법원 심사
 * → 이행(사업 남고 청구 바뀜) 또는 실패(청산 전환, 정한 순서로 배분).
 */
const STEPS = [
  { title: "기한에 못 냄", body: "대상 회사와 절차 개시 기준 확인" },
  { title: "중지", body: "재산 처분과 개별 추심을 멈춤" },
  { title: "분류", body: "담보 · 우선 · 일반 · 지분" },
  { title: "평가", body: "관리자가 자산 70과 계속기업가치 95의 근거 검토" },
  { title: "계획 · 투표 · 심사", body: "새 자금 10과 등급별 지급·통제권 → 채권자 투표 → 법원 심사" },
] as const;

const BRANCHES = [
  { title: "계획 이행", body: "사업은 남고 청구는 바뀜", color: "#16a34a" },
  { title: "계획 실패", body: "청산으로 전환해 남은 재산을 정한 순서로 나눔", color: "#dc2626" },
] as const;

const SCENES = [
  { label: "1. 기한에 못 냄", summary: "개시 기준부터 확인", note: "회사가 기한에 돈을 내지 못하면 먼저 어느 회사가 대상인지, 절차를 시작할 기준을 넘었는지 확인합니다." },
  { label: "2. 중지", summary: "처분·추심을 멈춤", note: "재산 처분과 추심을 멈춥니다. 5절에서 본 것처럼 먼저 압류한 사람이 공장을 조각내는 경쟁을 막는 단계입니다." },
  { label: "3. 분류", summary: "담보·우선·일반·지분", note: "청구를 담보·우선·일반·지분 네 등급으로 나눕니다. 뒤의 재조정안은 이 등급마다 지급과 통제권을 적습니다." },
  { label: "4. 평가", summary: "자산 70 대 계속기업가치 95", note: "관리자는 자산 70(청산 쪽)과 계속기업가치 95(재조정 쪽)가 각각 어떤 근거로 나온 숫자인지 검토합니다." },
  { label: "5. 계획·투표·심사", summary: "새 자금 10 · 투표 · 법원", note: "재조정안은 필요한 새 자금 10과 각 등급의 지급·통제권을 적고, 채권자 투표와 법원 심사를 거칩니다." },
  { label: "6a. 계획 이행", summary: "사업은 남고 청구가 바뀜", note: "계획을 이행하면 회사는 문을 닫지 않습니다. 대신 채권자의 원래 청구가 계획에 적힌 지급과 통제권으로 바뀝니다." },
  { label: "6b. 계획 실패", summary: "청산으로 전환", note: "계획이 실패하면 절차는 청산으로 바뀌어, 남은 재산을 정한 순서대로 나눕니다. 6a와 함께 보면 이 단계의 결과는 회사가 남는 길과 닫히는 길 두 가지입니다." },
] as const;

function Box({ title, body, state, color = "#2563eb" }: { title: string; body: string; state: "done" | "now" | "later"; color?: string }) {
  return (
    <div
      className={`rounded-lg border px-3 py-1.5 transition-opacity duration-300 motion-reduce:transition-none ${state === "later" ? "opacity-35" : "opacity-100"}`}
      style={{ borderColor: state === "now" ? color : "#cbd5e1", borderWidth: state === "now" ? 1.25 : 1 }}
    >
      <p className="text-sm font-bold" style={{ color: state === "now" ? color : undefined }}>{title}</p>
      <p className={`text-xs leading-5 text-muted-foreground sm:block sm:text-sm sm:leading-6 ${state === "now" ? "block" : "hidden"}`}>{body}</p>
    </div>
  );
}

export default function InsolvencyPathViz() {
  return (
    <SceneShell
      eyebrow="절차 순서"
      title="미지급 뒤 회사가 거치는 다섯 단계와 마지막 갈림길"
      description="위에서 아래로 시간 순서입니다. 마지막 단계에서 계획을 지키느냐에 따라 두 길로 갈립니다. 자산 70·가치 95·새 자금 10은 이 글의 설명용 장부(가정)입니다."
      ariaLabel="개시 기준 확인, 중지, 분류, 평가, 계획 투표 심사를 거쳐 이행 또는 청산 전환으로 갈리는 도산 절차"
      scenes={SCENES}
      render={(active) => {
        const stepState = (i: number) => (i === active ? "now" : i < active ? "done" : "later") as "done" | "now" | "later";
        const branchState = (b: number) => {
          if (active === STEPS.length + b) return "now";
          return "later";
        };
        return (
          <div className="min-w-0">
            <ol className="space-y-1.5">
              {STEPS.map((step, i) => (
                <li key={step.title}>
                  <Box title={step.title} body={step.body} state={stepState(i)} />
                  <div aria-hidden className="mx-auto h-2.5 w-px bg-[#94a3b8]" />
                </li>
              ))}
            </ol>
            <div className="grid grid-cols-2 gap-2 sm:gap-4">
              {BRANCHES.map((branch, b) => (
                <Box key={branch.title} title={branch.title} body={branch.body} state={branchState(b)} color={branch.color} />
              ))}
            </div>
          </div>
        );
      }}
    />
  );
}
