import SceneShell from "./SceneShell";

/**
 * 본문 대응: #read-only-latency — %iowait = CPU가 노는 동안 디스크 요청이 걸려 있던 시간의 비율.
 * 칸 하나가 같은 길이의 시간이고 칸 수는 설명용 가정이다. 디스크 요청 칸은 두 장면이 같다.
 * 장면 1: 16칸 겹침 ÷ 20 = 80%. 장면 2: 2칸 겹침 ÷ 20 = 10%.
 */
const SLOTS = Array.from({ length: 20 }, (_, index) => index);
const isDiskPending = (slot: number) => slot >= 2 && slot <= 17;

const CPU_BUSY: readonly (readonly number[])[] = [
  [0, 1, 18, 19],
  SLOTS.filter((slot) => slot !== 9 && slot !== 10),
];

const SCENES = [
  { label: "CPU가 한가할 때", summary: "겹침 16칸 ÷ 20 = 80%", note: "디스크 요청이 걸린 동안 CPU가 대부분 놉니다. 겹치는 칸이 많으니 iowait가 높게 나옵니다." },
  { label: "CPU가 다른 일로 바쁠 때", summary: "겹침 2칸 ÷ 20 = 10%", note: "디스크 요청 칸은 그대로입니다. CPU가 놀던 시간이 줄어서 겹침만 줄었습니다. 디스크가 빨라진 것이 아니므로 디스크 판단은 장치별 await와 aqu-sz로 합니다." },
];

function Strip({ label, on, color }: { label: string; on: (slot: number) => boolean; color: string }) {
  return (
    <div>
      <p className="text-xs font-bold">{label}</p>
      <div className="mt-1 grid grid-cols-[repeat(20,minmax(0,1fr))] gap-[2px]">
        {SLOTS.map((slot) => (
          <span key={slot} className="h-5 rounded-[1px]" style={{ backgroundColor: on(slot) ? color : "#e5e7eb" }} />
        ))}
      </div>
    </div>
  );
}

export default function IowaitOverlapViz() {
  return (
    <SceneShell
      eyebrow="겹치는 시간"
      title="디스크가 똑같이 느려도 CPU가 바쁘면 iowait는 낮게 나올 수 있습니다"
      description="왼쪽에서 오른쪽으로 흐르는 시간을 20칸으로 나눴습니다(가정). %iowait는 위 두 줄이 겹친 칸, 곧 CPU가 노는 동안 처리되지 않은 디스크 요청이 있던 시간의 비율입니다."
      note="칸 수와 패턴은 정의를 보이려고 고른 설명용 가정이며 측정값이 아닙니다."
      ariaLabel="CPU 유휴 시간과 디스크 대기의 겹침으로 정해지는 iowait"
      scenes={SCENES}
      render={(active) => {
        const busy = CPU_BUSY[active];
        const isIdle = (slot: number) => !busy.includes(slot);
        return (
          <div className="min-w-0 space-y-3">
            <Strip label="디스크 요청이 걸려 있음" on={isDiskPending} color="#2563eb" />
            <Strip label="CPU가 놂" on={isIdle} color="#94a3b8" />
            <Strip label="겹침 = %iowait로 세는 칸" on={(slot) => isDiskPending(slot) && isIdle(slot)} color="#dc2626" />
          </div>
        );
      }}
    />
  );
}
