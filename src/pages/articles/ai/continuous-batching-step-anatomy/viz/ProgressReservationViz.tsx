import SceneShell from "./SceneShell";

/**
 * 본문 대응: #progress-and-result — num_computed_tokens는 GPU 완료보다 먼저 전진한다.
 * C: 배정 6 → 반환 전 computed 0→6 → 실행 → 결과 6 수신 → 다음 선택에서 남은 4.
 */
const SCENES = [
  { label: "배정 기록", summary: "scheduled[C] = 6", computed: 0, gpu: 0, next: false, gpuLabel: "시작 전", note: "SchedulerOutput에 C의 이번 계산량 6을 적었습니다. C의 입력 위치 기록은 아직 0입니다." },
  { label: "반환 전 갱신", summary: "computed 0 → 6", computed: 6, gpu: 0, next: false, gpuLabel: "시작 전", note: "_update_after_schedule이 num_computed_tokens를 6으로 올리고 num_in_flight_tokens도 6 늘립니다. GPU가 6토큰을 끝냈다는 뜻은 아닙니다." },
  { label: "실행 담당자 계산", summary: "기록 6 · 끝난 양은 아직", computed: 6, gpu: 0, next: false, gpuLabel: "계산 중", note: "기록과 실제가 벌어진 구간입니다. 원문 주석은 다음 입력 조각을 곧바로 예약하려고 위치를 미리 전진시킨다고 설명합니다." },
  { label: "결과 수신", summary: "결과 6 · 기록 6", computed: 6, gpu: 6, next: false, gpuLabel: "결과 받음", note: "배정의 6과 결과의 6은 같아도 기록 시점이 다릅니다. 거부된 예상 토큰은 이후 교정하지만 이 사례에는 없습니다(가정)." },
  { label: "다음 선택", summary: "남은 입력 4 선택", computed: 6, gpu: 6, next: true, gpuLabel: "결과 받음", note: "이 글의 동기식 사례(가정)에서는 첫 실행 결과를 받은 다음 C의 남은 4토큰을 선택합니다." },
];

const STEPS = ["배정", "갱신", "실행", "결과", "다음"];

function Strip({ title, value, status, next }: { title: string; value: number; status: string; next: boolean }) {
  return (
    <div>
      <div className="mb-1 flex flex-wrap items-baseline justify-between gap-x-2">
        <span className="text-xs font-bold">{title}</span>
        <span className="font-mono text-xs text-muted-foreground">{status}</span>
      </div>
      <div className="grid grid-cols-10 gap-0.5">
        {Array.from({ length: 10 }, (_, index) => {
          const filled = index < value;
          const planned = next && !filled;
          return (
            <span
              key={index}
              className={`flex h-8 items-center justify-center rounded-sm border text-[10px] font-bold ${
                filled ? "border-[#f59e0b] bg-[#f59e0b] text-[#451a03]" : planned ? "border-dashed border-[#b45309] text-[#b45309] dark:border-[#fbbf24] dark:text-[#fbbf24]" : "border-dashed border-border"
              }`}
            >
              {index + 1}
            </span>
          );
        })}
      </div>
    </div>
  );
}

export default function ProgressReservationViz() {
  return (
    <SceneShell
      eyebrow="기록과 실제"
      title="C의 '계산된 위치'는 GPU가 끝내기 전에 먼저 전진합니다"
      description="두 줄 모두 C의 입력 10토큰입니다. 위 줄은 스케줄러 기록, 아래 줄은 GPU 실행 결과로 돌아온 양입니다."
      note="첫 배정 C=6과 동기식 실행은 본문의 설명용 가정입니다. 비동기 실행과 중단이 있으면 예약 중인 양과 완료된 결과를 더 세밀하게 구분해야 합니다."
      ariaLabel="num_computed_tokens 기록과 실제 GPU 결과의 시점 차이"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0 space-y-4">
            <ol className="grid grid-cols-5 gap-1">
              {STEPS.map((step, index) => (
                <li
                  key={step}
                  className={`rounded-sm border py-1 text-center text-xs ${
                    index === active ? "border-primary font-bold text-primary" : index < active ? "border-border text-foreground" : "border-dashed border-border text-muted-foreground"
                  }`}
                >
                  {step}
                </li>
              ))}
            </ol>
            <Strip title="기록: num_computed_tokens" value={scene.computed} status={`${scene.computed} / 10`} next={scene.next} />
            <Strip title="실제: GPU 결과로 돌아온 양" value={scene.gpu} status={`${scene.gpu} / 10 · ${scene.gpuLabel}`} next={false} />
          </div>
        );
      }}
    />
  );
}
