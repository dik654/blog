import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * "No space left on device"를 받은 서버에서 네 계정을 차례로 가르는 의사코드를 한 줄씩 실행한다.
 * 입력은 30GiB 로그가 열린 채 지워진 100GiB ext4(사례 A)다.
 * 줄마다 그 줄이 읽은 값과 내린 판정, 그리고 지금까지 배제한 계정을 보여 준다.
 */
const SCENES = ["1 · df -h", "2 · df -i", "3 · 예약 확인", "4 · du와 비교", "5 · lsof +L1", "6 · 조치 후"] as const;

const CODE = [
  "if df -h $MNT 의 Avail > 0 and 쓰기 실패: dmesg 확인 (읽기 전용)",
  "if df -i $MNT 의 IUse% == 100: inode 계정 → 파일 수 줄이기",
  "if Used + Avail < Size: 남은 칸은 예약 블록 (root만 씀)",
  "gap = df Used − du -xs $MNT",
  "if gap > 0: lsof +aL1 $MNT → PID·FD 찾기",
  "재시작 또는 : > /proc/PID/fd/FD → df 다시 보기",
] as const;

interface Step {
  active: number;
  reading: string;
  verdict: string;
  ruled: readonly string[];
  note: string;
}

const ACCOUNTS = ["읽기 전용", "inode", "예약 블록", "열린 채 지워진 파일"] as const;

const STEPS: readonly Step[] = [
  {
    active: 0,
    reading: "Size 100G · Used 95G · Avail 0 · Use% 100%",
    verdict: "Avail이 0이라 정말 블록이 없습니다. 읽기 전용 갈래는 아닙니다.",
    ruled: ["읽기 전용"],
    note: "Avail이 남았는데 쓰기가 실패한다면 공간이 아니라 파일시스템 상태 문제입니다. 여기서는 Avail 0이라 다음 줄로 갑니다.",
  },
  {
    active: 1,
    reading: "Inodes 6,553,600 · IUsed 262,144 · IUse% 4%",
    verdict: "inode는 4%만 썼습니다. 파일 수 문제가 아닙니다.",
    ruled: ["읽기 전용", "inode"],
    note: "IUse%가 100%였다면 블록이 남아도 새 파일을 못 만듭니다. 이번에는 inode를 배제합니다.",
  },
  {
    active: 2,
    reading: "Used 95 + Avail 0 = 95 < Size 100",
    verdict: "빠진 5GiB는 예약 블록입니다. root 데몬은 아직 씁니다.",
    ruled: ["읽기 전용", "inode"],
    note: "예약 블록은 원인이 아니라 일반 사용자가 먼저 막히는 이유입니다. 무엇이 95GiB를 차지했는지는 아직 모릅니다.",
  },
  {
    active: 3,
    reading: "df Used 95G − du -xs / 65G = 30G",
    verdict: "이름으로 셀 수 없는 30GiB가 있습니다.",
    ruled: ["읽기 전용", "inode", "예약 블록"],
    note: "du는 디렉터리를 따라 이름 있는 파일만 셉니다. 이름 없이 블록을 잡은 것이 30GiB 있다는 뜻입니다.",
  },
  {
    active: 4,
    reading: "java 812 FD 7w SIZE 30G NLINK 0 /var/log/app.log",
    verdict: "열린 채 지워진 로그가 30GiB를 붙잡고 있습니다.",
    ruled: ["읽기 전용", "inode", "예약 블록"],
    note: "+L1은 링크 수가 1보다 작은, 곧 이름이 없는 열린 파일만 보여 줍니다. -a로 이 mount에 한정합니다.",
  },
  {
    active: 5,
    reading: "Used 65G · Avail 30G · Use% 69%",
    verdict: "블록 30GiB가 돌아왔습니다.",
    ruled: ["읽기 전용", "inode", "예약 블록", "열린 채 지워진 파일"],
    note: "재시작하면 fd가 닫혀 inode가 evict됩니다. 재시작이 어렵다면 /proc/812/fd/7을 0 byte로 잘라 블록만 먼저 돌려받습니다.",
  },
];

export default function DiagnosisStepViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4400);
  const scene = scenes.active;
  const step = STEPS[scene];

  return (
    <VizFrame
      eyebrow="Diagnosis loop"
      title="네 계정을 한 줄에 하나씩 배제합니다"
      description="위는 진단 의사코드입니다. 배경을 칠한 줄이 이번 장면에서 실행한 줄, 진한 글씨가 이미 지나온 줄입니다. 아래는 그 줄이 읽은 값과 판정입니다."
      note="사례 A(100GiB ext4, 30GiB 로그가 열린 채 지워짐)를 입력으로 씁니다. 숫자는 설명용 가정입니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="디스크 full 진단 의사코드"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex shrink-0 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">Scene · {String(scene + 1).padStart(2, "0")}</p>
          <h4 className="mt-1 text-base font-bold">{SCENES[scene]}</h4>

          <ol className="mt-3 space-y-0.5 border-l border-border pl-3 font-mono text-[11px] leading-[1.15rem]">
            {CODE.map((line, index) => (
              <li
                key={line}
                className={
                  index === step.active
                    ? "bg-primary/10 font-bold text-foreground"
                    : index < step.active
                      ? "text-foreground"
                      : "text-muted-foreground/60"
                }
              >
                <span className="mr-2 text-primary">{index + 1}</span>
                <span className="whitespace-pre-wrap break-keep">{line}</span>
              </li>
            ))}
          </ol>

          <div className="mt-3 grid gap-2 text-xs sm:grid-cols-2 sm:gap-4">
            <div className="min-w-0">
              <p className="font-bold text-foreground">읽은 값</p>
              <p className="mt-1 break-words font-mono text-muted-foreground">{step.reading}</p>
              <p className="mt-2 font-bold text-foreground">판정</p>
              <p className="mt-1 text-muted-foreground">{step.verdict}</p>
            </div>
            <ul className="grid grid-cols-2 gap-1.5 text-center text-[11px]">
              {ACCOUNTS.map((account) => {
                const ruled = step.ruled.includes(account);
                const culprit = scene >= 4 && account === "열린 채 지워진 파일";
                return (
                  <li
                    key={account}
                    className={`border px-1 py-1.5 ${
                      culprit
                        ? "border-[#dc2626] bg-[#dc2626]/10 font-bold text-foreground"
                        : ruled
                          ? "border-border text-muted-foreground line-through"
                          : "border-primary/50 text-foreground"
                    }`}
                  >
                    {account}
                  </li>
                );
              })}
            </ul>
          </div>

          <p className="mt-3 min-h-[8rem] border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground min-[390px]:min-h-[7rem] sm:min-h-[3.5rem]">
            {step.note}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
