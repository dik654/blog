# Linux 서버 운영 시리즈 — 조사 원장 (2026-10-15)

요청: "서버 리눅스 지식은 인프라 필수 지식인데 대기업 등에서 어떤거 물어보는지, 어떤 문제상황들이 많은지 등도 딥리서치해서 블로그 보강해줘"

조사 당시 블로그에는 리눅스 서버 운영을 다루는 canonical 글이 없었습니다. conntrack·MTU·SNAT는 `cloud/kubernetes-network-packet-path`, 메모리·NVMe 하드웨어는 `hw/memory`·`hw/nvme-storage`, namespace·seccomp 샌드박스는 `ai/agent-sandbox-security`, 서빙 운영은 `ai/llm-serving-ops`에 있습니다. 새 하위분류 `cloud-linux`를 만들고 6편을 씁니다.

## 면접에서 실제로 묻는 것 (직접 연 자료)

| 출처 | 성격 | 리눅스 관련 내용 |
|---|---|---|
| aced.io(구 tryexponent) Google SRE 가이드 | 제3자 정리 | 5라운드. SWE-SRE는 코딩 비중, SE-SRE는 Linux·네트워크 비중. 45분 production troubleshooting(공유 문서에 명령·가설 기록): "배포 뒤 오류", "SSH 접속 불가 진단", "CPU 50%인데 지연 2배". 45분 Linux/systems: URL 입력 end-to-end, interrupt·signal handler·signal masking, zombie 찾기·정리, inode, SIGTERM vs SIGKILL, foreground/background, hard vs soft link, ping 스크립트 3단계 확장 |
| Glassdoor·prepfully 등 Meta Production Engineer 후기 | 익명 자기보고 | 인턴 지원 시 Linux·OS·네트워크 약 20문항 온라인 퀴즈(약 18–20분). 45분 systems 라운드: ping·ps aux·vmstat로 장애 추적 + 메모리 종류·프로세스 동작·커널과 사용자 프로그램 관계. VFS 역할 질문 보고. 준비 자료로 *Systems Performance* 언급 |
| github.com/pjhwa/linux-engineers wiki (제타위키 사본) | 국내 엔지니어 22명이 만든 질문지 | 경력별 하(<3년)·중(<10년)·상(10년+). System Administration(SAN/NAS/DAS, chroot, NUMA, 좀비), Kernel Internals(kmalloc vs vmalloc, slabinfo, 세마포어·뮤텍스·스핀락, 컨텍스트 스위칭, 가상 메모리, namespace), Network(3-way/4-way handshake, TIME_WAIT 필요성, half-open, MTU, DSR LB, BGP), Troubleshooting(시스템 hang 원인, 공유 라이브러리 의존성, 시스템 콜·시그널 추적, **df는 여유인데 filesystem full**, **OOM Killer 동작과 희생자 선정**), Security(SELinux enforcing/permissive, CVE 확인, 폐쇄망 패치, 인증서 체인) |
| LinkedIn School of SRE (engineering.linkedin.com 2021 공지, linkedin.github.io/school-of-sre) | 회사 공식 온보딩 커리큘럼 | Fundamentals 첫 모듈이 Linux Basics: 명령행, 파일 권한, 사용자·그룹, 패키지, 프로세스·메모리, systemd와 로그. 이어 Linux Networking |
| mxssl/sre-interview-prep-guide | 커뮤니티 링크 모음 | Linux: file descriptor, pipe, process group, daemon, page cache. Troubleshooting: Gregg 60초 점검, strace, lsof |

공통 분모(3개 이상 출처): 프로세스·시그널·좀비, 메모리·OOM·page cache, 파일시스템·inode·디스크 full, TCP 상태·TIME_WAIT, 장애 진단 명령 순서. 회사별 질문의 "빈도 통계"는 공개된 것이 없으므로 글에서는 **"공개 질문지·후기 다섯 곳 중 몇 곳에 나왔는가"** 로만 말한다. 국내 대기업(네이버·카카오·쿠팡 등) 공식 질문 목록은 찾지 못했다 — 질문지는 국내 현업자 작성본으로 표시한다.

## 첫 60초 점검 (1차 자료)

Brendan Gregg, Netflix Performance Engineering, "Linux Performance Analysis in 60,000 Milliseconds", Netflix TechBlog 2015-11-30. 순서: `uptime`, `dmesg | tail`, `vmstat 1`, `mpstat -P ALL 1`, `pidstat 1`, `iostat -xz 1`, `free -m`, `sar -n DEV 1`, `sar -n TCP,ETCP 1`, `top`. 오류와 포화(saturation: 대기열 길이나 대기 시간)를 먼저, 사용률은 그다음. USE Method(Utilization·Saturation·Errors). 예시 dmesg에 `perl invoked oom-killer`. 텍스트 사본: 세션 scratchpad `linux/gregg60s.txt` (PDF 원본 brendangregg.com/Articles/Netflix_Linux_Perf_Analysis_60s.pdf).

Brendan Gregg, "Linux Load Averages: Solving the Mystery", 2017-08-08: 1993-10-29 Matthias Urlichs 패치("Load average broken ?")로 TASK_UNINTERRUPTIBLE 포함 → CPU 부하가 아니라 "system load". `EXP_1 1884, EXP_5 2014, EXP_15 2037` (include/linux/sched/loadavg.h, 1/exp(5sec/period) fixed-point). 유휴 시스템에 CPU 스레드 1개를 1분 돌리면 1분 값이 약 0.62.

## 실제 장애 사례 (1차 자료)

- Datadog 2023-03-08 다지역 장애: 06:00 UTC에 자동 적용된 systemd 보안 업데이트(Ubuntu 22.04, systemd v249)가 systemd-networkd를 재시작 → networkd가 모르는 라우팅 규칙을 지우면서 Cilium이 깐 경로 삭제 → 노드 오프라인. 재부팅 노드는 networkd가 CNI보다 먼저 떠서 증상 없음. Ubuntu 20.04(v245)는 restart 시 flush하지 않아 무사. 조치: 해당 보안 업데이트 채널 비활성화. (datadoghq.com/blog/2023-03-08-multiregion-infrastructure-connectivity-issue, engineering/2023-03-08-deep-dive-into-platform-level-impact)
- Cloudflare, "How to stop running out of ephemeral ports and start to love long-lived connections" (2022): ephemeral port 고갈 시 외부 연결 불가. 기본 범위 32768–60999(28,232개)이지만 (src IP, dst IP, dst port) 조합마다 따로 세므로 최대 연결 수가 곧 28k는 아님. `IP_BIND_ADDRESS_NO_PORT`.
- Kubernetes DNS 5초 지연(conntrack race) — 이미 `kubernetes-network-packet-path`에서 다룸. 링크만.

## 흔한 오해 (글에서 정정할 것)

- `tcp_fin_timeout`을 낮추면 TIME_WAIT가 줄어든다 → 아니다. TIME_WAIT 길이는 `TCP_TIMEWAIT_LEN`(60초) 상수, `tcp_fin_timeout`은 FIN_WAIT_2(고아 소켓) 시간. 커널 소스로 확인할 것.
- `free`의 used가 높으면 메모리 부족 → page cache는 회수 가능, `available`을 봐야 함.
- load average가 CPU 개수보다 높으면 CPU 부족 → D state(I/O 대기)도 포함.
- `rm`으로 지웠는데 공간이 안 돌아옴 → 열린 fd가 inode를 붙잡고 있음.
