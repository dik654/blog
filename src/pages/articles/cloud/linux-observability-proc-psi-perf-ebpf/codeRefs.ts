import type { CodeRef } from "@/components/code/types";
import procRst from "./codebase/linux/Documentation/filesystems/proc.rst?raw";
import psiRst from "./codebase/linux/Documentation/accounting/psi.rst?raw";
import schedStatsRst from "./codebase/linux/Documentation/scheduler/sched-stats.rst?raw";
import statC from "./codebase/linux/fs/proc/stat.c?raw";
import psiC from "./codebase/linux/kernel/sched/psi.c?raw";
import perfTopTxt from "./codebase/linux/tools/perf/Documentation/perf-top.txt?raw";
import perfRecordTxt from "./codebase/linux/tools/perf/Documentation/perf-record.txt?raw";
import bpftraceAdoc from "./codebase/bpftrace/man/adoc/bpftrace.adoc?raw";
import nodeExporterReadme from "./codebase/node_exporter/README.md?raw";
import pressureLinuxGo from "./codebase/node_exporter/collector/pressure_linux.go?raw";
import cpuLinuxGo from "./codebase/node_exporter/collector/cpu_linux.go?raw";

export const codeRefs: Record<string, CodeRef> = {
  "proc-stat-doc": {
    path: "linux/Documentation/filesystems/proc.rst",
    highlight: [1505, 1578],
    desc: "top·vmstat·mpstat의 CPU 열은 모두 /proc/stat의 cpu 줄을 두 번 읽어 뺀 값입니다. 커널 문서가 열 순서와 단위, 그리고 iowait가 믿을 수 없는 이유를 적습니다.",
    annotations: [
      { lines: [1512, 1513], color: "sky", note: "첫 cpu 줄은 모든 cpuN 줄의 합입니다. 이 글의 4 vCPU 서버에서는 네 줄을 더한 값입니다." },
      { lines: [1526, 1531], color: "amber", note: "숫자는 부팅 뒤 누적 tick이고 단위는 USER_HZ(보통 1/100초)입니다. 사용률은 두 시점의 차이에서 idle이 아닌 몫의 비율로 계산합니다." },
      { lines: [1535, 1546], color: "rose", note: "iowait는 'CPU가 I/O를 기다린 시간'이 아니라 '어떤 task가 I/O를 기다리는 동안 CPU가 쉰 시간'입니다. 다중 코어에서는 계산이 어렵고 값이 줄어들 수도 있어 문서가 신뢰할 수 없다고 적습니다." },
      { lines: [1568, 1572], color: "violet", note: "procs_running은 실행 중이거나 실행을 기다리는 스레드 수, procs_blocked는 I/O를 기다리는 수입니다. vmstat의 r·b 열이 이 두 줄입니다." },
    ],
    code: procRst,
    lang: "python",
  },
  "proc-stat-source": {
    path: "linux/fs/proc/stat.c",
    highlight: [82, 137],
    desc: "/proc/stat의 cpu 줄을 실제로 찍는 함수입니다. CPU마다 열 가지 시간을 더해 nsec_to_clock_t로 tick 단위로 바꿔 씁니다.",
    annotations: [
      { lines: [105, 114], color: "sky", note: "user·nice·system·idle·iowait·irq·softirq·steal·guest·guest_nice 열 가지를 CPU마다 더합니다. 사용률 계산에서 '바쁜 시간'은 idle과 iowait를 뺀 나머지입니다." },
      { lines: [127, 137], color: "amber", note: "출력 순서가 곧 문서의 열 순서입니다. nsec_to_clock_t가 나노초를 USER_HZ tick으로 바꾸므로 node_exporter 같은 수집기는 다시 100으로 나눠 초로 되돌립니다." },
    ],
    code: statC,
    lang: "c",
  },
  "proc-pid-status": {
    path: "linux/Documentation/filesystems/proc.rst",
    highlight: [176, 217],
    desc: "프로세스 하나의 상태 파일 예시입니다. ps·top의 RSS 열과 문맥 전환 수가 어디서 오는지 보여 줍니다.",
    annotations: [
      { lines: [186, 190], color: "sky", note: "VmRSS는 RssAnon + RssFile + RssShmem입니다. 공유 라이브러리를 많이 매핑한 프로세스는 RssFile 때문에 RSS가 실제 고유 메모리보다 크게 보입니다." },
      { lines: [216, 217], color: "amber", note: "nonvoluntary_ctxt_switches는 CPU를 빼앗긴 횟수입니다. 이 값이 빠르게 늘면 그 프로세스가 run queue에서 밀리고 있다는 뜻이고, PSI cpu some이 오르는 것과 같은 현상을 프로세스 단위로 보는 것입니다." },
    ],
    code: procRst,
    lang: "python",
  },
  "pid-schedstat": {
    path: "linux/Documentation/scheduler/sched-stats.rst",
    highlight: [157, 165],
    desc: "/proc/<pid>/schedstat의 세 숫자입니다. 둘째 값이 그 프로세스가 run queue에서 기다린 누적 나노초라 CPU 포화를 프로세스 단위로 재는 가장 직접적인 숫자입니다.",
    annotations: [
      { lines: [163, 165], color: "sky", note: "1) CPU에서 실행한 시간, 2) run queue에서 기다린 시간, 3) 실행 횟수. 2)를 두 번 읽어 뺀 값을 간격으로 나누면 그 프로세스의 스케줄 대기 비율입니다." },
    ],
    code: schedStatsRst,
    lang: "python",
  },
  "psi-formula": {
    path: "linux/kernel/sched/psi.c",
    highlight: [60, 105],
    desc: "PSI가 다중 CPU에서 some과 full을 어떻게 정의하는지 커널 주석이 숫자 예시로 설명합니다. 사용률과 다른 숫자인 이유가 여기 있습니다.",
    annotations: [
      { lines: [88, 91], color: "sky", note: "threads = min(쉬지 않는 task 수, CPU 수). SOME = 지연된 task ÷ threads, FULL = 생산적인 task가 채우지 못한 thread의 비율입니다. 분모가 CPU 수라 CPU가 많을수록 같은 대기가 작게 보입니다." },
      { lines: [93, 97], color: "amber", note: "256 CPU에서 257개가 돌면 항상 하나가 기다리지만 SOME은 1/256 = 0.4%입니다. task 상태만 세면 100%로 보일 것을 '잃어버린 실행 잠재력'으로 바꿔 셉니다." },
      { lines: [99, 103], color: "violet", note: "4 CPU에서 task 넷 중 하나가 메모리 때문에 멈추면 SOME도 FULL도 25%입니다. 누군가는 늘 진행하지만 4개 중 1개의 실행 잠재력이 사라졌기 때문입니다." },
    ],
    code: psiC,
    lang: "c",
  },
  "psi-constants": {
    path: "linux/kernel/sched/psi.c",
    highlight: [157, 163],
    desc: "avg10·avg60·avg300이 2초마다 갱신되는 지수 이동 평균이라는 사실이 이 상수들에 있습니다.",
    annotations: [
      { lines: [157, 157], color: "sky", note: "PSI_FREQ는 2초(+1 jiffy)입니다. 평균은 2초에 한 번 새 표본을 받습니다." },
      { lines: [158, 160], color: "amber", note: "1/exp(2s/10s) 등을 고정소수점(2048 기준)으로 적은 감쇠 계수입니다. load average와 같은 calc_load 식을 쓰므로 avg10도 '최근 10초의 산술 평균'이 아니라 10초 시정수의 EMA입니다." },
      { lines: [163, 163], color: "violet", note: "trigger의 창은 최대 10초입니다. 그보다 긴 창의 경보는 평균 줄이나 수집기 쪽에서 셉니다." },
    ],
    code: psiC,
    lang: "c",
  },
  "psi-calc-avgs": {
    path: "linux/kernel/sched/psi.c",
    highlight: [320, 338],
    desc: "한 주기의 stall 시간을 백분율로 바꿔 세 EMA에 넣는 함수입니다. 이 글의 25%가 여기서 나옵니다.",
    annotations: [
      { lines: [325, 330], color: "sky", note: "아무 활동이 없어 갱신을 건너뛴 주기는 0을 넣어 평균을 그만큼 식힙니다." },
      { lines: [333, 337], color: "amber", note: "pct = stall 시간 × 100 ÷ 주기. 2초 주기에 500ms가 쌓였으면 25%입니다. 이 값을 avg10·avg60·avg300 각각에 감쇠 계수로 섞습니다." },
    ],
    code: psiC,
    lang: "c",
  },
  "psi-show": {
    path: "linux/kernel/sched/psi.c",
    highlight: [1255, 1273],
    desc: "/proc/pressure/cpu를 cat했을 때 보이는 두 줄의 출력 코드입니다. CPU full이 시스템 수준에서는 정의되지 않는다는 점도 여기서 처리합니다.",
    annotations: [
      { lines: [1260, 1261], color: "rose", note: "시스템 전체의 cpu full은 정의되지 않아 0으로 찍힙니다(cgroup 단위에서는 나옵니다). /proc/pressure/cpu의 full 줄이 늘 0이어도 고장이 아닙니다." },
      { lines: [1268, 1273], color: "sky", note: "some/full avg10= avg60= avg300= total= 형식입니다. total은 마이크로초 누적값이라 두 번 읽어 빼면 평균이 가리는 짧은 폭주도 잡습니다." },
    ],
    code: psiC,
    lang: "c",
  },
  "psi-trigger": {
    path: "linux/kernel/sched/psi.c",
    highlight: [1279, 1334],
    desc: "/proc/pressure/* 파일에 'some 150000 1000000'을 쓰면 만들어지는 trigger의 검증 규칙입니다.",
    annotations: [
      { lines: [1298, 1300], color: "sky", note: "'some <임계 µs> <창 µs>' 또는 'full ...'만 받습니다." },
      { lines: [1313, 1313], color: "amber", note: "창은 0보다 크고 10초 이하여야 합니다." },
      { lines: [1320, 1320], color: "violet", note: "root가 아니면 창이 2초의 배수여야 합니다. 평균 갱신 주기와 맞추기 위해서입니다." },
      { lines: [1324, 1324], color: "rose", note: "임계값은 창보다 클 수 없습니다. 1초 창에 150ms는 '15% 이상 멈추면 깨워 달라'는 뜻입니다." },
    ],
    code: psiC,
    lang: "c",
  },
  "psi-doc": {
    path: "linux/Documentation/accounting/psi.rst",
    highlight: [40, 62],
    desc: "some과 full의 정의, 그리고 세 창(10·60·300초)이 무엇을 보여 주는지 적은 커널 문서입니다.",
    annotations: [
      { lines: [45, 48], color: "sky", note: "some: 적어도 한 task가 그 자원 때문에 멈춘 시간의 비율. full: 쉬지 않는 task 전부가 동시에 멈춘 시간의 비율." },
      { lines: [57, 58], color: "rose", note: "CPU full은 시스템 수준에서 정의되지 않습니다." },
    ],
    code: psiRst,
    lang: "python",
  },
  "psi-trigger-doc": {
    path: "linux/Documentation/accounting/psi.rst",
    highlight: [67, 119],
    desc: "poll()로 깨어나는 PSI trigger 사용법입니다. 1초 창 150ms 예시가 그대로 나옵니다.",
    annotations: [
      { lines: [83, 88], color: "sky", note: "형식은 '<some|full> <stall µs> <창 µs>'. 'some 150000 1000000'을 /proc/pressure/memory에 쓰면 1초 안에 150ms 이상 부분 정지가 쌓일 때 알립니다." },
      { lines: [102, 110], color: "amber", note: "창은 500ms~10s이고, 권한 없는 사용자는 2초의 배수만 쓸 수 있습니다." },
      { lines: [116, 116], color: "violet", note: "알림은 창마다 한 번으로 제한됩니다. 경보 폭주를 커널이 막아 줍니다." },
    ],
    code: psiRst,
    lang: "python",
  },
  "perf-top-doc": {
    path: "linux/tools/perf/Documentation/perf-top.txt",
    highlight: [13, 70],
    desc: "perf top은 성능 카운터(기본 cpu-clock·cycles)를 일정 빈도로 표본화해 어느 함수가 CPU를 쓰는지 실시간으로 보여 줍니다.",
    annotations: [
      { lines: [15, 15], color: "sky", note: "'performance counter profile in real time'. 사용률이 높다는 사실(/proc/stat)에서 '어느 코드가'로 내려가는 도구입니다." },
      { lines: [21, 22], color: "amber", note: "기본은 시스템 전체 수집입니다. -p PID로 한 프로세스만 볼 수 있습니다." },
      { lines: [64, 68], color: "violet", note: "-F로 표본 빈도를 정합니다. 'max'는 kernel.perf_event_max_sample_rate까지 올립니다. 빈도가 높을수록 정확하지만 오버헤드도 큽니다." },
    ],
    code: perfTopTxt,
    lang: "python",
  },
  "perf-record-doc": {
    path: "linux/tools/perf/Documentation/perf-record.txt",
    highlight: [14, 20],
    desc: "perf record는 같은 표본을 perf.data 파일에 남겨 나중에 perf report로 봅니다. 장애 당시 기록을 남겨야 할 때 쓰는 쪽입니다.",
    annotations: [
      { lines: [16, 20], color: "sky", note: "화면에 아무것도 보이지 않고 파일만 남깁니다. perf record -a -g -F 99 -- sleep 30처럼 30초 동안 전체 CPU의 호출 스택을 초당 99번 표본화하는 식으로 씁니다." },
    ],
    code: perfRecordTxt,
    lang: "python",
  },
  "perf-record-freq": {
    path: "linux/tools/perf/Documentation/perf-record.txt",
    highlight: [263, 271],
    desc: "-F 빈도 옵션입니다. 커널의 상한 sysctl을 넘으면 자동으로 낮춰 줍니다.",
    annotations: [
      { lines: [265, 267], color: "amber", note: "상한은 kernel.perf_event_max_sample_rate입니다. 운영 서버에서는 99Hz처럼 낮은 소수를 써서 timer tick(100Hz 등)과 겹치는 편향을 피합니다(Gregg의 관례)." },
    ],
    code: perfRecordTxt,
    lang: "python",
  },
  "bpftrace-open": {
    path: "bpftrace/man/adoc/bpftrace.adoc",
    highlight: [227, 243],
    desc: "bpftrace 매뉴얼의 첫 완전한 예제입니다. open·openat 시스템 콜 tracepoint에 붙어 어느 프로세스가 어느 파일을 여는지 찍습니다.",
    annotations: [
      { lines: [227, 229], color: "sky", note: "BEGIN은 시작할 때 한 번 실행되는 특수 probe입니다. 머리글을 찍는 데 씁니다." },
      { lines: [231, 233], color: "amber", note: "tracepoint:syscalls:sys_enter_openat에 붙어 pid, comm, str(args.filename)을 출력합니다. 커널을 고치거나 재시작하지 않고 실행 중인 서버에 붙입니다." },
      { lines: [239, 243], color: "violet", note: "action block 둘, probe 셋. 한 줄짜리(-e)로 줄이면 이 글 9절의 명령이 됩니다." },
    ],
    code: bpftraceAdoc,
    lang: "python",
  },
  "bpftrace-profile": {
    path: "bpftrace/man/adoc/bpftrace.adoc",
    highlight: [1424, 1428],
    desc: "profile probe는 perf와 같은 perf_events 기반으로 CPU마다 일정 빈도로 발화합니다. 'profile:hz:99 { @[tid] = count(); }'가 어느 스레드가 CPU에 있었는지 세는 한 줄입니다.",
    annotations: [
      { lines: [1424, 1425], color: "sky", note: "perf top과 같은 기반(perf_events) 위에서 돕니다. 차이는 결과를 커널 안의 map에 모아 두고 끝날 때 한 번만 사용자 공간으로 보낸다는 점입니다." },
      { lines: [1428, 1428], color: "amber", note: "@[tid] = count()는 발화마다 스레드 id별 횟수를 셉니다. 99Hz × 10초면 CPU 하나당 990 표본입니다." },
    ],
    code: bpftraceAdoc,
    lang: "python",
  },
  "bpftrace-hist": {
    path: "bpftrace/man/adoc/bpftrace.adoc",
    highlight: [1908, 1920],
    desc: "hist()는 값을 2의 거듭제곱 구간으로 나눠 히스토그램을 만듭니다. 블록 I/O 크기 분포 예시입니다.",
    annotations: [
      { lines: [1914, 1918], color: "sky", note: "tracepoint:block:block_rq_issue에서 args.bytes를 hist()에 넣습니다. 평균 대신 분포를 보는 것이 지연 분석의 기본입니다." },
    ],
    code: bpftraceAdoc,
    lang: "python",
  },
  "node-exporter-collectors": {
    path: "node_exporter/README.md",
    highlight: [117, 163],
    desc: "node_exporter의 기본 켜짐 수집기 표입니다. Prometheus·Grafana에서 보는 노드 지표가 모두 /proc와 /sys 파일을 읽은 것임을 한 표에서 확인할 수 있습니다.",
    annotations: [
      { lines: [123, 123], color: "sky", note: "cpu 수집기 → /proc/stat의 cpu 줄. node_cpu_seconds_total{mode=...}가 됩니다." },
      { lines: [136, 138], color: "amber", note: "loadavg → /proc/loadavg, meminfo → /proc/meminfo. 리눅스 메모리 글의 available이 node_memory_MemAvailable_bytes입니다." },
      { lines: [148, 148], color: "violet", note: "pressure → /proc/pressure/. 커널 4.20 이상과 CONFIG_PSI가 필요합니다." },
      { lines: [154, 154], color: "emerald", note: "stat → /proc/stat의 나머지(부팅 시각, fork 수, 인터럽트, procs_running·blocked)." },
    ],
    code: nodeExporterReadme,
    lang: "python",
  },
  "node-exporter-pressure": {
    path: "node_exporter/collector/pressure_linux.go",
    highlight: [58, 100],
    desc: "PSI 수집기가 만드는 지표 이름입니다. avg 줄이 아니라 total을 counter로 내보내므로 rate()로 창을 자유롭게 고를 수 있습니다.",
    annotations: [
      { lines: [66, 70], color: "sky", note: "node_pressure_cpu_waiting_seconds_total = /proc/pressure/cpu some 줄의 total(µs → s). rate(…[1m])가 1분 평균 some 비율입니다." },
      { lines: [86, 89], color: "amber", note: "node_pressure_memory_stalled_seconds_total = memory full 줄의 total. 모든 task가 동시에 멈춘 시간입니다." },
    ],
    code: pressureLinuxGo,
    lang: "go",
  },
  "node-exporter-cpu": {
    path: "node_exporter/collector/cpu_linux.go",
    highlight: [377, 399],
    desc: "/proc/stat을 읽어 node_cpu_seconds_total{cpu, mode}로 내보내는 함수입니다. Grafana의 'CPU 사용률' 패널은 이 counter에 rate()를 걸고 idle을 뺀 것입니다.",
    annotations: [
      { lines: [379, 379], color: "sky", note: "procfs 라이브러리로 /proc/stat을 파싱합니다. 이 글 3절의 cpu 줄 그대로입니다." },
      { lines: [391, 398], color: "amber", note: "user·nice·system·idle·iowait·irq·softirq·steal을 mode 라벨로 나눠 내보냅니다. 1 − rate(idle) − rate(iowait)이 흔히 쓰는 사용률입니다." },
    ],
    code: cpuLinuxGo,
    lang: "go",
  },
};
