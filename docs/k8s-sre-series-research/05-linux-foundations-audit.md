# Linux 기초 개념 감사 — cloud-linux 6편 vs 기초·SRE 체크리스트 (2026-10-16)

요청: Kubernetes 시리즈처럼 Linux도 "면접·장애 사례 틀"이 아니라 **개념 자체를 쌓는** 글이 필요하고, SRE 관점도 포함할 것.

대상 6편(`src/pages/articles/cloud/`): `linux-server-interview-incident-map`(hub, 이하 **map**), `linux-memory-page-cache-oom`(**mem**), `linux-disk-full-inode-deleted-files`(**disk**), `linux-process-signals-pid1-fds`(**proc**), `linux-tcp-time-wait-ports-backlog`(**tcp**), `linux-systemd-boot-change-incidents`(**sysd**). 근거: 각 글의 section id 목록과 키워드 출현 수(`/usr/bin/grep -c`), 필요한 곳은 본문 직접 확인.

## 한 줄 진단

여섯 편은 모두 **장애 하나에서 출발해 그 장애에 필요한 개념만** 깊게 판다. 깊이는 좋다(커널 원문까지 내려간다). 대신 장애에 등장하지 않은 기초는 비어 있다. 특히 **cgroup v2의 CPU 쪽, namespace, capability, VFS·mount·block 계층, netfilter·DNS, 스케줄러, 관측 도구(perf·eBPF)** 가 없다. 이것들이 바로 Kubernetes의 requests/limits·OOMKill·Service·DNS가 서 있는 바닥이다.

## 체크리스트 판정

표기: ● 잘 됨 / ◐ 일부 / ○ 없음. 위치는 `글#section-id`.

### 1. 커널과 프로세스

| 항목 | 판정 | 위치·근거 |
|---|---|---|
| 커널 공간 vs 사용자 공간, 시스템 콜 | ○ | 독립 설명 없음. "시스템 콜" 단어가 proc·map에 1~2회 나올 뿐 경계·모드 전환·비용을 다루지 않음 |
| 프로세스 vs 스레드 | ○ | map이 "CPU 스레드"(load 계산)로만 씀. task_struct 공유(주소 공간·fd 표) 차이 없음 |
| fork / exec / wait | ● | proc#black-box·#lifecycle(fork는 복제, execve는 같은 PID에서 프로그램 교체, wait 안 하면 좀비, 32,768 PID ÷ 3/s ≈ 3시간) |
| 프로세스 상태 R/S/D/Z | ◐ | D: map#need·#source(TASK_UNINTERRUPTIBLE이 load에 들어감). Z: proc#lifecycle·#reaper. R·S와 상태 전이 전체 그림은 없음 |
| 스케줄링 기초(CFS→EEVDF, nice, run queue) | ○ | cloud-linux 전체에서 0회. load average(map#mechanism)만 있음 |
| 신호 | ● | proc#signals·#pid1-trace·#kernel-signal(SIGTERM/SIGKILL, PID 1 보호 규칙, exec 시 처리기 초기화) |

### 2. 메모리

| 항목 | 판정 | 위치·근거 |
|---|---|---|
| 가상 메모리·페이지 테이블·처음 쓸 때 물리 page | ● | mem#black-box·#virtual-overcommit |
| RSS vs VSZ | ◐ | RSS 15회(mem#oom-score), VSZ는 1회. ps 출력 두 열의 차이를 직접 읽는 장면 없음 |
| page cache·available | ● | mem#small-case·#pressure(free의 available) |
| swap | ● | mem 30회 |
| OOM killer·oom_score_adj·cgroup OOM | ● | mem#oom-score·#reclaim-path·#kernel-source·#exit-137·#kubernetes-qos |

### 3. 파일시스템·저장

| 항목 | 판정 | 위치·근거 |
|---|---|---|
| inode·링크·열린 참조·unlink | ● | disk#names·#free-rule·#unlink-trace |
| dentry | ◐ | disk에 5회, 캐시로서의 역할은 설명 안 함 |
| VFS 계층 | ◐ | disk·proc에 단어만(3·2회). "모든 파일시스템이 같은 open/read를 받는 이유"는 없음 |
| mount·mount namespace | ◐ | disk#boundary가 "한 mount"로 범위를 제한. mount table·bind mount·overlayfs(컨테이너 이미지) 없음 |
| block device·I/O 스케줄러·iostat | ◐ | disk#read-only-latency(iostat %util·await). 블록 장치 자체는 0회 |
| fsync·writeback·journaling | ○ | fsync 0회. journal은 disk에서 ext4 journal 언급 2회뿐. dirty page→writeback→fsync 비용 없음 |

### 4. fd·IPC

| 항목 | 판정 | 위치·근거 |
|---|---|---|
| fd 개념·한도 | ● | proc#fd-limits(프로세스·시스템 두 한도), disk#diagnose(lsof로 지운 파일 잡기) |
| pipe | ◐ | proc 2회. 파이프 버퍼·SIGPIPE 없음 |
| socket도 fd | ◐ | tcp가 소켓 상태는 깊지만 "소켓 = fd" 연결 문장은 약함 |

### 5. 권한·격리 (컨테이너의 바닥)

| 항목 | 판정 | 위치·근거 |
|---|---|---|
| 사용자·그룹·권한 비트·setuid | ○ | 독립 설명 없음 |
| capabilities | ○ | cloud-linux 0회. `ai/sandbox-*`도 seccomp·gVisor 중심 |
| namespaces | ◐ | proc#paper-pid-namespaces(PID namespace만, 21회). net·mnt·uts·user namespace는 없음. `ai/agent-sandbox-security`가 user namespace를 1회 언급 |
| cgroup v2 메모리(memory.max·memory.high·memory.events) | ● | mem#reclaim-path·#boundary |
| cgroup v2 CPU(cpu.max·cpu.weight·throttling) | ○ | 블로그 전체 0회. **Kubernetes CPU limit 스로틀링의 바닥인데 비어 있음** |
| PSI | ◐ | mem#names·#boundary(memory 쪽만). cpu·io pressure 없음 |

### 6. systemd·부팅

| 항목 | 판정 | 위치·근거 |
|---|---|---|
| 부팅 사슬(펌웨어→부트로더→커널→PID 1) | ● | sysd#boot-chain |
| unit·After/Requires·재시작 한도 | ● | sysd#ordering·#restart-limit·#unit-source |
| journald·journalctl | ● | sysd#diagnose |

### 7. 네트워크

| 항목 | 판정 | 위치·근거 |
|---|---|---|
| TCP 상태·TIME_WAIT·accept 대기열 | ● | tcp 전체 |
| 인터페이스·veth·bridge | ○ | cloud-linux 0회(`cloud/kubernetes-network-packet-path`가 Pod 경로로 일부) |
| 라우팅 표·policy routing | ◐ | sysd#rule-case·#networkd-source(ip rule 7줄 사례). 일반 route lookup 설명은 없음 |
| netfilter(iptables/nftables) | ○ | cloud-linux 0회. `kubernetes-network-packet-path`가 kube-proxy 규칙으로만 1회 |
| conntrack | ◐ | tcp#conntrack(NAT 장부). k8s 글이 DNS race를 다룸 |
| DNS 해석(resolv.conf·search·ndots) | ○ | 블로그 전체에서 ndots는 무관 글 1회뿐 |

### 8. 관측

| 항목 | 판정 | 위치·근거 |
|---|---|---|
| USE Method·첫 60초 | ● | map#picture·#paper-gregg-60s |
| /proc 읽기 | ◐ | 각 글이 필요한 파일만(/proc/meminfo, /proc/PID/fd 등). /proc 자체 구조는 없음 |
| perf·eBPF(bpftrace) | ○ | cloud-linux 0회 |
| strace | ○ | 확인 안 됨(키워드 0회) — 면접 원장(docs/linux-server-series-research.md)에는 "시스템 콜·시그널 추적"이 질문으로 나옴 |

### 9. SRE 관점

| 항목 | 판정 | 위치·근거 |
|---|---|---|
| 포화 신호(saturation)를 사용률보다 먼저 | ● | map#picture, mem#names(PSI) |
| 무엇을 모니터링할지(증상 vs 원인, SLO 연결) | ○ | SLO는 disk·mem에 1~2회 지나가는 언급. 서버 지표를 SLO·알림으로 잇는 글 없음 |
| toil·자동화 | ○ | 0회 |
| 안전한 변경(구성 관리, OS 패치 단계적 적용) | ◐ | sysd#change-path·#timeline(Datadog: 자동 업데이트가 배포 도구 밖 두 번째 변경 경로). 단계적 롤아웃·canary·구성 drift 일반론은 없음 |
| 장애 triage 순서 | ● | map#interview(질문→첫 명령→가설→단기·장기 조치), 각 글 #diagnose·#triage |
| postmortem | ◐ | sysd가 Datadog 사후 보고서를 읽지만 postmortem 작성법·blameless 원칙은 없음(K8s 시리즈 04 슬라이스가 SRE 책 원문 담당) |

## 이번에 직접 연 1차 자료 (새로 쓸 글의 사실 근거)

- Linux `Documentation/admin-guide/cgroup-v2.rst`(torvalds/linux master, raw):
  - `cpu.max`: 형식 `$MAX $PERIOD`, 기본값 `"max 100000"`. 각 PERIOD 동안 MAX까지 쓸 수 있고 `max`는 무제한. fair-class 스케줄러 프로세스에만 적용.
  - `cpu.weight`: 기본 100, 범위 [1, 10000].
  - `memory.high`: 기본 `max`. 넘으면 throttle과 강한 회수 압력. **"Going over the high limit never invokes the OOM killer"**, 극단에선 넘을 수도 있음.
  - `memory.max`: 회수로 줄일 수 없으면 cgroup 안에서 OOM killer 호출.
- docs.kernel.org `accounting/psi.html`: `/proc/pressure/{cpu,memory,io}`. 형식 `some avg10= avg60= avg300= total=` / `full ...`. some은 일부 task가 그 자원 때문에 멈춘 시간 비율. trigger 예시 `some 150000 1000000`(1초 창에서 150ms).
- docs.kernel.org `scheduler/sched-eevdf.html`: EEVDF는 1995년 논문에서 처음 소개됐고, 커널은 6.6에서 CFS를 대체하는 방향으로 EEVDF 전환을 시작함.
- man7 `resolv.conf(5)` `ndots:n`: 기본값 1. 이름에 점이 n개 이상이면 search list를 붙이기 전에 절대 이름으로 먼저 질의. 최대 15로 조용히 제한됨. (Kubernetes Pod의 ndots 값은 K8s 슬라이스에서 따로 확인할 것.)
- man7 `capabilities(7)`: `CAP_NET_BIND_SERVICE` = 1024 미만 포트에 bind.

미확인(쓰기 전 원문 확인 필요): perf·bpftrace 예시 출력, overlayfs 동작 세부, nftables 전환 시점(배포판별), Kubernetes가 requests를 cpu.weight로 바꾸는 공식 변환식(K8s 슬라이스 02에서 확인).

## 제안: 새 글·보강 (Linux 기초 층)

원칙: 기존 6편은 "사례로 내려가는 글"로 유지하고, 그 **앞**에 개념을 쌓는 글을 놓는다. 각 새 글도 teach-system 형식(작은 숫자 사례 → 이름 → 원문)으로 쓰고, 기존 글의 해당 절로 링크해 중복을 피한다.

| # | 제목(가안) | 채우는 공백 | 기존 글과의 관계 | K8s 시리즈 선수 링크 |
|---|---|---|---|---|
| L1 | 커널과 프로세스: 시스템 콜·스레드·상태·스케줄러 | 사용자/커널 경계, syscall 비용, 프로세스 vs 스레드, R/S/D/Z 전이 전체, run queue와 EEVDF·nice, strace로 syscall 보기 | proc(fork/exec/좀비)·map(load·D state)의 선수 | Pod 안 프로세스, PID 1, CrashLoop 재시작의 바닥 |
| L2 | **컨테이너는 cgroup과 namespace다** | cgroup v2 CPU(cpu.max 100000μs 주기·throttling·cpu.weight), memory.high vs memory.max(위 원문), PSI 세 자원, namespace 7종, capabilities·사용자 권한 | mem#reclaim-path·#kubernetes-qos를 CPU 쪽으로 완성, proc#paper-pid-namespaces 일반화 | **필수 선수**: requests/limits·QoS·CPU throttling·OOMKill(exit 137)·securityContext |
| L3 | 파일이 디스크에 닿기까지: VFS·mount·page cache·fsync | VFS·dentry 캐시, mount table·bind mount·overlayfs, dirty page→writeback→fsync, journaling, block device와 iostat | disk(inode 회계)의 선수, mem(page cache)과 연결 | PVC mount 경로(kubelet NodePublish), 컨테이너 이미지 layer, emptyDir |
| L4 | 패킷이 프로세스에 닿기까지: 인터페이스·라우팅·netfilter·DNS | veth·bridge, route lookup·policy routing, netfilter hook과 iptables/nftables, conntrack, resolv.conf search·ndots | tcp(소켓 상태)·sysd(ip rule 사례)의 선수 | **필수 선수**: `kubernetes-network-packet-path`(kube-proxy 규칙·DNS race), Service·CoreDNS |
| L5 | 서버를 관측하는 도구: /proc·USE·PSI·perf·eBPF | /proc 구조, USE 체크리스트를 자원별 명령에 매핑, PSI 해석, perf top/record·bpftrace 한 줄 예시 | map#picture(60초)를 도구 층으로 확장 | 노드 수준 진단(kubectl debug node, node-exporter 지표의 원천) |
| L6 | (보강) SRE로 서버 보기: 지표→SLO, 안전한 변경, toil | 증상 지표 vs 원인 지표, OS 패치·구성 변경의 단계적 롤아웃(sysd#change-path의 Datadog 사례 일반화), 구성 관리와 drift, toil 정의(SRE 책 원문은 K8s 04 슬라이스 공유) | map 또는 sysd에 절 추가, 또는 별도 글 | K8s SRE 글(rollout·PDB·error budget)과 같은 원칙을 노드 층에서 |

우선순위: **L2 > L4 > L1 > L3 > L5 > L6**. L2·L4는 Kubernetes 시리즈의 requests/limits·OOMKill·Service·DNS 글이 직접 기대는 바닥이므로 K8s 글보다 먼저 쓰거나 같은 배치에서 쓴다. 사용자/권한/capability는 별도 글로 빼지 않고 L2에 넣는다(K8s securityContext와 함께 읽히도록).

허브 갱신: map#black-box의 "다섯 자원" 지도에 L1~L5를 개념 층으로 추가하고, 하위분류 `cloud-linux` 목록 순서를 prerequisite(L1·L2·L3·L4·L5) → 사례(기존 6편) 순으로 바꾼다(CLAUDE.md "카테고리 article listing은 prerequisite→mechanism→응용·운영").
