import SceneShell from "./SceneShell";

/**
 * 본문 대응: #syscall-case — read(3, buf, 4096)이 레지스터에 실려 문을 지나고 돌아오는 순서.
 * 레지스터 칸과 입구의 세 가지 일은 모든 장면에서 같은 자리에 둔다.
 */
const REGS = [
  { name: "rax", role: "번호·결과" },
  { name: "rdi", role: "인자 1" },
  { name: "rsi", role: "인자 2" },
  { name: "rdx", role: "인자 3" },
  { name: "rcx", role: "돌아갈 곳" },
  { name: "r11", role: "플래그" },
] as const;

const ENTRY = [
  { name: "swapgs", role: "커널 per-CPU 영역을 가리킴" },
  { name: "스택 교체", role: "커널 스택으로 갈아탐" },
  { name: "pt_regs", role: "레지스터 전부를 쌓음" },
] as const;

const WHERE = ["사용자 코드", "문 (들어감·돌아옴)", "커널 코드"] as const;

interface Scene {
  label: string;
  summary: string;
  note: string;
  where: number;
  regs: readonly [string, string, string, string, string, string];
  changed: readonly string[];
  entry: boolean;
  errno: string;
  ret: string;
}

const SCENES: readonly Scene[] = [
  { label: "래퍼가 레지스터에 싣습니다", summary: "번호 0 + 인자 셋", where: 0, regs: ["0", "3", "buf", "4096", "—", "—"], changed: ["rax", "rdi", "rsi", "rdx"], entry: false, errno: "—", ret: "—", note: "레지스터는 CPU 안의 작은 저장 칸입니다. 사용자 코드 쪽 glibc 래퍼가 시스템 콜 번호 0을 rax에, 인자 셋을 rdi·rsi·rdx에 넣습니다. 인자가 여섯 개까지면 r10·r8·r9가 이어집니다." },
  { label: "syscall 명령이 문을 엽니다", summary: "돌아갈 곳을 적고 점프", where: 1, regs: ["0", "3", "buf", "4096", "돌아갈 주소", "플래그"], changed: ["rcx", "r11"], entry: false, errno: "—", ret: "—", note: "CPU가 돌아갈 주소를 rcx에, 플래그(CPU 상태 표시)를 r11에 저장한 다음 커널이 미리 등록해 둔 주소로 뜁니다." },
  { label: "커널 입구의 세 가지 일", summary: "시스템 콜마다 치르는 고정 비용", where: 2, regs: ["0", "3", "buf", "4096", "돌아갈 주소", "플래그"], changed: [], entry: true, errno: "—", ret: "—", note: "per-CPU 영역은 CPU마다 따로 둔 커널 자료입니다. 사용자 코드가 사용자 스택을 마음대로 바꿀 수 있어 커널 스택으로 갈아탑니다. 이 저장과 복원이 시스템 콜마다 치르는 고정 비용입니다." },
  { label: "결과를 rax에 담아 돌아옵니다", summary: "rax = 결과", where: 1, regs: ["결과", "3", "buf", "4096", "돌아갈 주소", "플래그"], changed: ["rax"], entry: false, errno: "—", ret: "—", note: "커널이 sys_read를 끝내면 결과를 rax에 담아 돌아옵니다. 들어온 문을 다시 지나므로 입구와 출구를 한 번씩 지납니다." },
  { label: "실패했다면 래퍼가 바꿉니다", summary: "−11 → errno 11, 반환 −1", where: 0, regs: ["−11", "3", "buf", "4096", "돌아갈 주소", "플래그"], changed: ["rax"], entry: false, errno: "11 (EAGAIN)", ret: "−1", note: "소켓에 읽을 것이 없고 비차단 모드였다면 커널은 −11을 돌려줍니다. 래퍼가 부호를 뒤집어 오류 번호를 담는 errno에 11을 넣고 프로그램에는 −1을 돌려줍니다." },
];

export default function SyscallRegisterViz() {
  return (
    <SceneShell
      eyebrow="시스템 콜 한 번"
      title="read(3, buf, 4096)의 번호와 인자는 레지스터에 실려 문을 지납니다"
      description="주황 칸이 그 장면에서 바뀐 레지스터입니다. buf는 읽은 데이터를 받을 메모리 주소입니다."
      ariaLabel="read 시스템 콜이 레지스터에 실려 커널에 들어갔다가 돌아오는 다섯 장면"
      scenes={SCENES}
      render={(active) => {
        const s = SCENES[active];
        return (
          <div className="min-w-0 space-y-2">
            <div className="grid grid-cols-3 gap-1 text-center text-[11px] leading-4 sm:text-xs">
              {WHERE.map((name, i) => (
                <div key={name} className={`flex min-h-8 items-center justify-center rounded-sm border px-1 ${i === s.where ? "border-[#2563eb] bg-[#2563eb] font-bold text-white" : "border-border text-muted-foreground"}`}>
                  {name}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-6 gap-1">
              {REGS.map((reg, i) => {
                const changed = s.changed.includes(reg.name);
                return (
                  <div key={reg.name} className={`min-w-0 rounded-sm border px-0.5 py-1 text-center ${changed ? "border-[#d97706] bg-[#d97706]/15" : "border-border bg-background"}`}>
                    <div className="font-mono text-xs font-bold">{reg.name}</div>
                    <div className="min-h-[1.75rem] break-keep text-[10px] leading-[0.875rem] text-muted-foreground">{reg.role}</div>
                    <div className="mt-0.5 min-h-8 break-keep font-mono text-[10px] sm:text-[11px] font-bold leading-4">{s.regs[i]}</div>
                  </div>
                );
              })}
            </div>
            <div className="grid grid-cols-3 gap-1">
              {ENTRY.map((step) => (
                <div key={step.name} className={`rounded-sm border px-2 py-1.5 ${s.entry ? "border-[#2563eb]/60 bg-background" : "border-dashed border-border/60"}`}>
                  <div className={`text-xs font-bold ${s.entry ? "" : "text-muted-foreground/60"}`}>{step.name}</div>
                  <div className={`text-[11px] leading-4 ${s.entry ? "text-muted-foreground" : "text-muted-foreground/50"}`}>{step.role}</div>
                </div>
              ))}
            </div>
            <dl className="grid grid-cols-2 gap-1 font-mono text-xs">
              <div className="rounded-sm border border-border bg-background px-2 py-1">
                <dt className="text-muted-foreground">errno</dt>
                <dd className="font-bold">{s.errno}</dd>
              </div>
              <div className="rounded-sm border border-border bg-background px-2 py-1">
                <dt className="text-muted-foreground">프로그램이 받는 값</dt>
                <dd className="font-bold">{s.ret}</dd>
              </div>
            </dl>
          </div>
        );
      }}
    />
  );
}
