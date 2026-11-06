import SceneShell from "./SceneShell";

/**
 * 본문 대응: #global-scheduling·#task-loop — SM 132개의 역할 분담과 worker 한 개가 task 하나를 처리하는 순환.
 * 132 = worker 128 + scheduler 쪽 4 (MPK 자기보고). 위 칸 하나가 SM 하나다.
 * 아래 순환은 AlgorithmBlock 의 dequeue → spin → page → switch → counter 순서와 같다.
 */
const SCENES = [
  { label: "역할 나누기", summary: "132 = worker 128 + 4", note: "MPK 는 H100 의 SM 132개 가운데 128개를 worker 로 쓰고, 나머지 4개에 scheduler warp 16개를 둡니다. Operator 293개는 task 13,867개로 쪼개져 이 worker 들에 배정됩니다." },
  { label: "queue 채우기", summary: "worker 마다 자기 queue", note: "Scheduler 가 실행할 task 를 worker 의 queue 에 넣습니다. Queue 가 worker 마다 하나라 dequeue 에 SM 사이 lock 이 없습니다." },
  { label: "꺼내서 기다리기", summary: "완료 수 < 목표 → spin", note: "Worker 가 task 를 꺼내 필요한 event counter 를 확인합니다. 목표에 못 미치면 polling 을 계속합니다. 이 spin 이 식의 t_sync 이며 그동안 SM 의 issue slot 을 씁니다." },
  { label: "page 빌려 실행", summary: "acquire_smem → switch(op)", note: "의존이 풀리면 공용 shared memory page 를 빌리고 task 종류로 분기해 계산합니다. 모든 operator 의 code 가 한 kernel 에 있어 이 분기가 instruction cache 의 working set 을 바꿉니다." },
  { label: "완료 알리기", summary: "counter + 1 → 후속 task", note: "Barrier 로 결과가 global memory 에 다 쓰였음을 보장하고 page 를 돌려준 뒤, 기다린 event 가 아니라 자기가 올리는 event 의 counter 를 올립니다. Scheduler 가 이 counter 를 보고 풀린 후속 task 를 어느 worker 의 queue 에 넣을지 정합니다." },
] as const;

const WORKER = "#2563eb";
const SCHED = "#d97706";
const WAIT = "#dc2626";
const IDLE = "#94a3b8";

/** 장면별 queue 안 task 칸 수(그림용 가정)와 각 상자에 적을 상태입니다. */
const STATE = [
  { tokens: 0, worker: "대기", counter: "" },
  { tokens: 3, worker: "대기", counter: "" },
  { tokens: 2, worker: "spin 중", counter: "기다릴 e: 완료 수 < 목표" },
  { tokens: 2, worker: "page 빌림 · 계산", counter: "기다릴 e: 완료 수 ≥ 목표" },
  { tokens: 2, worker: "page 반납", counter: "올릴 e: 완료 수 + 1" },
] as const;

const LINKS = [
  { id: "sched", d: "M152 36 L206 36", active: 1, color: SCHED, label: "task", lx: 179, ly: 28 },
  { id: "deq", d: "M280 62 L280 116", active: 2, color: WORKER, label: "dequeue", lx: 286, ly: 94 },
  { id: "poll", d: "M206 136 L154 136", active: 2, color: WAIT, label: "확인", lx: 180, ly: 128 },
  { id: "done", d: "M206 156 L154 156", active: 4, color: WORKER, label: "+1", lx: 180, ly: 172 },
  { id: "see", d: "M80 116 L80 64", active: 4, color: SCHED, label: "풀린 task 확인", lx: 86, ly: 94 },
] as const;

export default function TaskLoopViz() {
  return (
    <SceneShell
      eyebrow="Device 쪽 scheduler"
      title="Worker SM 하나가 task 하나를 처리하는 한 바퀴"
      description="SM 은 GPU 안의 계산 코어 묶음이고 warp 는 thread 32개가 함께 도는 단위입니다. 위 칸 하나가 SM 하나이고, 아래 순환은 그중 worker 하나의 시점입니다."
      note="SM·warp·task 개수는 MPK 논문의 자기보고입니다. Queue 안의 task 칸 수는 그림용 가정입니다."
      ariaLabel="SM 132개를 worker 와 scheduler 로 나누고, task 가 scheduler, queue, worker, counter 를 도는 순환"
      scenes={SCENES}
      render={(active) => {
        const state = STATE[active];
        return (
          <div className="min-w-0">
            <div className="grid grid-cols-[repeat(33,minmax(0,1fr))] gap-px" aria-hidden="true">
              {Array.from({ length: 132 }, (_, index) => {
                const isScheduler = index >= 128;
                const isCurrent = index === 0 && active > 0;
                return (
                  <span
                    key={index}
                    className="h-2 rounded-[1px] border"
                    style={{
                      borderColor: isScheduler ? SCHED : WORKER,
                      backgroundColor: isCurrent ? WORKER : isScheduler ? `${SCHED}55` : `${WORKER}1a`,
                    }}
                  />
                );
              })}
            </div>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11px] leading-4 text-muted-foreground">
              <span><span className="font-bold" style={{ color: WORKER }}>파랑</span> worker 128</span>
              <span><span className="font-bold" style={{ color: SCHED }}>주황</span> scheduler warp 16을 둔 SM 4</span>
              <span className={active > 0 ? "" : "invisible"}>진한 칸 = 아래 worker</span>
            </div>
            <svg viewBox="0 0 360 196" className="mx-auto mt-3 block w-full max-w-[20rem]" role="img" aria-label={SCENES[active].label}>
              <defs>
                {LINKS.map((link) => (
                  <marker key={link.id} id={`loop-${link.id}`} markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
                    <path d="M0 0 L7 3.5 L0 7 Z" fill={link.active === active ? link.color : IDLE} />
                  </marker>
                ))}
              </defs>

              <rect x="10" y="10" width="140" height="52" rx="8" fill={`${SCHED}14`} stroke={SCHED} strokeWidth="1" />
              <text x="80" y="32" textAnchor="middle" fontSize="12" fontWeight="700" fill="currentColor">Scheduler</text>
              <text x="80" y="50" textAnchor="middle" fontSize="11" fill="currentColor">후속 task 결정</text>

              <rect x="208" y="10" width="142" height="52" rx="8" fill="none" stroke="#64748b" strokeWidth="1" />
              <text x="279" y="28" textAnchor="middle" fontSize="12" fontWeight="700" fill="currentColor">queue[w]</text>
              {[0, 1, 2].map((slot) => (
                <rect
                  key={slot}
                  x={247 + slot * 28}
                  y="36"
                  width="22"
                  height="16"
                  rx="3"
                  fill={slot < state.tokens ? `${WORKER}33` : "none"}
                  stroke={slot < state.tokens ? WORKER : IDLE}
                  strokeWidth="1"
                  strokeDasharray={slot < state.tokens ? undefined : "2 2"}
                />
              ))}

              <rect x="208" y="118" width="142" height="52" rx="8" fill={`${WORKER}14`} stroke={WORKER} strokeWidth="1" />
              <text x="279" y="139" textAnchor="middle" fontSize="12" fontWeight="700" fill="currentColor">Worker w</text>
              <text x="279" y="157" textAnchor="middle" fontSize="11" fill={active === 2 ? WAIT : "currentColor"}>{state.worker}</text>

              <rect x="10" y="118" width="142" height="52" rx="8" fill="none" stroke="#64748b" strokeWidth="1" />
              <text x="81" y="139" textAnchor="middle" fontSize="12" fontWeight="700" fill="currentColor">counter[e]</text>
              <text x="81" y="157" textAnchor="middle" fontSize="11" fill={active === 2 ? WAIT : "currentColor"}>{state.counter || "global memory"}</text>

              {LINKS.map((link) => {
                const on = link.active === active;
                return (
                  <g key={link.id} opacity={on ? 1 : 0.4}>
                    <path d={link.d} fill="none" stroke={on ? link.color : IDLE} strokeWidth={on ? 1.25 : 1} markerEnd={`url(#loop-${link.id})`} />
                    <text x={link.lx} y={link.ly} textAnchor={link.id === "deq" || link.id === "see" ? "start" : "middle"} fontSize="11" fontWeight={on ? 700 : 400} fill="currentColor">{link.label}</text>
                  </g>
                );
              })}
            </svg>
          </div>
        );
      }}
    />
  );
}
