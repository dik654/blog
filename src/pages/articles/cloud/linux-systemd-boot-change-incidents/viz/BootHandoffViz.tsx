import type { ReactNode } from "react";
import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 전원에서 multi-user.target까지 제어권이 넘어가는 여섯 단계를 의사코드 한 줄씩 따라간다.
 * 한 mechanism: 각 단계는 다음 단계의 프로그램을 메모리에 올리고 실행을 넘긴다. 커널 다음부터는 PID 1 하나가 이어받는다.
 */
const LABELS = ["펌웨어", "loader", "커널", "initramfs", "PID 1", "target"] as const;
const OWNERS = ["펌웨어", "boot loader", "커널", "initramfs /init", "systemd", "unit 그래프"] as const;
const PSEUDOCODE = [
  "firmware: 최소 하드웨어 초기화 → boot loader 실행",
  "loader: kernel + initramfs 를 메모리에 올림, 명령행 전달",
  "kernel_init: run_init_process(\"/init\")",
  "initrd: 진짜 root fs 를 찾아 mount → switch root",
  "exec /sbin/init   # systemd, PID 1 유지",
  "systemd: default.target 의존 그래프를 병렬 시작",
] as const;
const STATES = [
  { result: "제어권: 펌웨어", note: "전원이 들어오면 펌웨어(BIOS·UEFI)가 메모리와 장치를 최소한으로 깨우고 디스크의 boot loader를 실행합니다. EFI에서는 펌웨어가 커널을 직접 올릴 수도 있습니다." },
  { result: "메모리: 커널 + initramfs", note: "boot loader(GRUB, systemd-boot)는 커널과 initramfs 두 이미지를 메모리에 올리고 root=, init= 같은 커널 명령행을 넘깁니다. initramfs를 파일 시스템으로 풀어 읽는 쪽은 커널입니다." },
  { result: "PID 1 = initramfs의 /init", note: "커널은 장치 초기화를 마친 뒤 kernel_init에서 initramfs의 /init을 먼저 실행합니다. 이 프로세스가 사용자 공간의 첫 프로세스이고 번호는 1입니다." },
  { result: "진짜 root 파일 시스템 mount", note: "initramfs 안의 프로그램이 디스크의 root 파일 시스템을 찾아 mount합니다. 디스크 암호 해제나 RAID 조립도 여기서 합니다. 그다음 root를 디스크 쪽으로 바꿉니다." },
  { result: "PID 1 = 디스크의 systemd", note: "디스크의 /sbin/init이 같은 PID 1 자리를 이어받습니다. 대부분의 배포판에서 이것이 systemd이고, 이후 모든 서비스는 이 프로세스가 시작합니다." },
  { result: "multi-user.target 도달", note: "systemd는 default.target에서 Wants·Requires를 따라 시작할 unit을 모으고, After·Before가 막지 않는 unit은 동시에 시작합니다. 시작 순서는 이 그래프가 정합니다." },
] as const;

function Stack({ items, active, className = "" }: { items: readonly ReactNode[]; active: number; className?: string }) {
  return (
    <div className={`grid ${className}`}>
      {items.map((item, index) => (
        <div key={index} aria-hidden={index !== active} className={`col-start-1 row-start-1 ${index === active ? "" : "invisible"}`}>
          {item}
        </div>
      ))}
    </div>
  );
}

export default function BootHandoffViz() {
  const scenes = useAnimatedScenes(STATES.length, 4200);
  const active = scenes.active;

  return (
    <VizFrame
      eyebrow="Boot handoff"
      title="전원에서 PID 1까지 네 번 넘기고, 그다음은 unit 그래프입니다"
      description="칸 하나가 그 순간 CPU를 쥔 프로그램입니다. 아래 의사코드의 진한 줄이 지금 실행되는 단계입니다."
      note="initramfs를 쓰는 일반적인 x86 서버 경로입니다. 커널의 /init 선택 순서는 Linux v6.12 init/main.c를 따릅니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="부팅 제어권 이동 단계"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex shrink-0 flex-col">
          <p className="text-[11px] font-black text-primary">Scene · {String(active + 1).padStart(2, "0")}</p>
          <Stack active={active} className="mt-2" items={STATES.map((s) => <h4 key={s.result} className="text-base font-bold">{s.result}</h4>)} />

          <ol className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-6" aria-label="제어권을 가진 프로그램">
            {OWNERS.map((owner, index) => (
              <li
                key={owner}
                className={`rounded-md border px-2 py-1.5 text-center text-xs ${
                  index === active
                    ? "border-primary bg-primary/10 font-bold text-foreground"
                    : index < active
                      ? "border-primary/40 text-muted-foreground"
                      : "border-border text-muted-foreground"
                }`}
              >
                <span className="block font-mono text-[10px]">{index < 4 ? `${index + 1}번째` : index === 4 ? "PID 1" : "그래프"}</span>
                {owner}
              </li>
            ))}
          </ol>

          <ol aria-label="현재 장면과 함께 실행되는 의사코드" className="mt-3 space-y-1">
            {PSEUDOCODE.map((line, index) => (
              <li
                key={line}
                aria-current={active === index ? "step" : undefined}
                className={`flex min-w-0 gap-2 rounded-md border-l-2 px-3 py-1 ${
                  active === index
                    ? "border-primary bg-primary/[0.07]"
                    : index < active
                      ? "border-primary/30 text-muted-foreground"
                      : "border-border/60 text-muted-foreground"
                }`}
              >
                <span className="shrink-0 font-mono text-[10px] font-bold text-primary">
                  {index < active ? "✓" : String(index + 1).padStart(2, "0")}
                </span>
                <code className="min-w-0 break-words font-mono text-[11px] leading-5">{line}</code>
              </li>
            ))}
          </ol>

          <Stack active={active} className="mt-3" items={STATES.map((s) => <p key={s.note} className="border-l border-primary/50 pl-4 text-sm leading-6 text-muted-foreground">{s.note}</p>)} />
        </div>
        <AnimatedSceneControls {...scenes} labels={LABELS} />
      </div>
    </VizFrame>
  );
}
