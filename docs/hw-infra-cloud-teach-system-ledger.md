# HW·Infra·Cloud teach-system 이관 원장

기준일: 2026-10-08

이 문서는 근거 수나 글 길이가 아니라 독자가 따라가는 인과 순서를 기록한다. 완료 조건은 `S 사건 → B 이름 없는 경로 → 0 작은 수치 → 1 역할 그림 → 2 분리 이유 → 3 표준 이름 → 4 내부 구조 → 5 실제 명령·원문 → 6 정상 한 번 추적 → 7 실패·복구 경계`다. `(가정)` 수치는 실제 싱가포르 현장 계측값이 아니다.

## 자격 지도 1편

| 글 | 처음부터 끝까지 추적하는 사건 | 4~7의 실물 증거 | 상태 |
|---|---|---|---|
| `nvidia-nca-aiio-study-guide` | GPU 16개는 보이지만 2-node 작업이 시작하지 못함 | 공식 38·40·22% blueprint, 목표→P0 증거 원장, DCGM 첫 점검, Associate·Professional 경계 | 정적 검사 통과·화면 미검수 |

## AI 인프라 P0 6편

| 글 | 처음부터 끝까지 추적하는 사건 | 4~7의 실물 증거 | 상태 |
|---|---|---|---|
| `ai-infrastructure-b300-128-blueprint` | workload와 검수 기준 없이 B300 128개 발주 | BOM·port/power 원장, 설계 gate, 실패 조건 | 정적 검사 통과 |
| `ai-cluster-software-compatibility` | 16개 node 중 한 대의 version 차이로 collective 중단 | OS·kernel·driver·CUDA·NCCL·DOCA-OFED matrix와 진단 명령 | 정적 검사 통과 |
| `kubernetes-vs-slurm-gpu-scheduling` | GPU가 남아도 8-node job이 시작하지 못하는 fragmentation | Kubernetes·Slurm 설정, queue 상태, 정상·실패 출력 | 정적 검사 통과 |
| `ai-cluster-storage-io` | node loss 뒤 마지막 checkpoint를 복구하지 못함 | Linux source, fio·IOR·mdtest, PyTorch DCP, degraded·restore gate | 정적 검사 통과 |
| `b300-rack-power-cooling` | U 공간은 남지만 네 번째 server를 통전·냉각하지 못함 | A/B feed, rack kW, liquid fraction, CDU·유량과 N−1 gate | 정적 검사 통과 |
| `ai-infrastructure-commissioning-acceptance` | 장비 health는 green이지만 고객이 인수를 거부함 | FAT·SAT·node·cluster·workload·handover evidence | 정적 검사 통과 |

## Cloud 14편

| 글 | 처음부터 끝까지 추적하는 사건 | 4~7의 실물 증거 | 상태 |
|---|---|---|---|
| `cloud-certification-roadmap-2026` | 자격은 있지만 면접의 403 요청을 설명하지 못함 | 공고→학습 절차, 공식 범위, 비교, 포트폴리오 경계 | 정적 검사 통과 |
| `cloud-foundations-responsibility-regions` | provider health는 정상인데 주문 서비스가 중단됨 | 책임표, region·zone 비교, failure-domain 경계 | 정적 검사 통과 |
| `cloud-identity-access-hierarchy` | 관리자처럼 보이는 신원이 객체 하나에서 403을 받음 | policy evaluation·scope·audit 명령과 정상·거부 판독 | 정적 검사 통과 |
| `cloud-networking-request-path` | server health는 정상이지만 요청이 5초 뒤 timeout | DNS→route→filter→listener 추적과 packet/flow evidence | 정적 검사 통과 |
| `cloud-compute-selection` | 평균 부하는 낮지만 점심 burst에서 처리 지연 | capacity·autoscaling 원장, runtime metric, saturation 판독 | 정적 검사 통과 |
| `cloud-storage-database-selection` | 파일 저장은 성공했지만 주문 재시도로 재고가 두 번 감소 | object·transaction·idempotency 경로와 복구 판독 | 정적 검사 통과 |
| `cloud-reliability-observability-iac` | dashboard는 green인데 주문이 47분 실패 | trace·SLO·plan/drift·fault injection·rollback | 정적 검사 통과 |
| `aws-clf-c02-fast-study` | 제품 이름은 외웠지만 권한 실패의 책임선을 못 찾음 | AWS 공식 범위와 최소 account·IAM 실습 | 정적 검사 통과 |
| `aws-saa-c03-fast-study` | 다중 AZ로 적었지만 실제 요청은 단일 경로에서 막힘 | architecture trade-off, route·health·recovery 비교 | 정적 검사 통과 |
| `aws-developer-cloudops-paths` | 배포 성공 표시 뒤 이전 revision으로 복구하지 못함 | build·deploy·drift·rollback evidence | 정적 검사 통과 |
| `azure-az900-fast-study` | service 목록은 알지만 shared responsibility를 틀림 | Azure 공식 범위와 책임·region 비교 | 정적 검사 통과 |
| `azure-az104-fast-study` | App Service identity가 Storage에 접근하지 못함 | RBAC·private endpoint·DNS·route 진단 | 정적 검사 통과 |
| `azure-architect-devops-paths` | 복구 구조는 있지만 한 배포가 두 region을 함께 손상 | AZ-305 설계와 AZ-400 변경 흐름 비교 | 정적 검사 통과 |
| `azure-ai200-fast-study` | model 응답은 왔지만 사용자는 40초간 빈 화면을 봄 | identity·retrieval·queue·trace 기반 요청 진단 | 정적 검사 통과 |

## 기존 HW 15편

각 글은 서로 다른 `HardwareTeachOpening` 사례를 사용한다. 이후 기존 본문 전체를 `HardwareTeachMechanism`의 4단계로 묶고, 글별 `HardwareFieldLab`에서 실제 명령(5), 정상 출력 판독(6), 실패 출력·조치(7)를 이어 간다.

| 글 | 처음부터 끝까지 추적하는 사건 | 5~7의 대표 증거 | 상태 |
|---|---|---|---|
| `gpu-comparison` | peak 수치가 높은 GPU에서 model이 시작되지 않음 | `nvidia-smi`·DCGM·Xid | 정적 검사 통과 |
| `ai-accelerator-vendor-comparison` | 다른 accelerator에서 한 operator가 host fallback | inventory·compiler/runtime·accuracy gate | 정적 검사 통과 |
| `server-vs-desktop` | GPU 네 장 중 두 장의 실제 PCIe 폭이 줄어듦 | `lspci`·NUMA·BMC·feed | 정적 검사 통과 |
| `server-cpu-lineup-comparison` | CPU core는 많지만 GPU·NIC lane과 locality가 부족함 | `lscpu`·`lspci`·`numactl` | 정적 검사 통과 |
| `nvme-storage` | 10초 peak 뒤 8TB 지속 쓰기에서 throttle | NVMe SMART·error log·fio p99 | 정적 검사 통과 |
| `storage-comparison` | 빠른 local checkpoint가 node와 함께 사라짐 | mount·fio·IOR·restore drill | 정적 검사 통과 |
| `memory` | 용량은 맞지만 한 channel의 corrected error가 증가 | DMI·EDAC·MCE·NUMA | 정적 검사 통과 |
| `power-cooling` | 정상 합계는 충분하지만 feed 상실 뒤 rack trip | PDU/BMC power·temperature·failover | 정적 검사 통과 |
| `datacenter-site-readiness` | 장비가 elevator·floor-load 경계에서 반입 중단 | 도면 revision·Redfish·hold point | 정적 검사 통과 |
| `network` | link up인데 application path에서 packet loss | `ip`·`ethtool`·counter·MTU | 정적 검사 통과 |
| `gpu-interconnects` | 장치는 연결됐지만 traffic이 느린 우회 경로를 탐 | topology·P2P·bandwidth evidence | 정적 검사 통과 |
| `rdma-roce` | ping은 되지만 RDMA queue가 timeout | RDMA device·GID·PFC/ECN·counter | 정적 검사 통과 |
| `gpu-collective-network` | 한 느린 rank가 collective 전체를 멈춤 | NCCL debug·nccl-tests·fabric counter | 정적 검사 통과 |
| `modded-rtx4090-moe-serving` | memory 개조 뒤 용량은 늘었지만 MoE tail latency 악화 | power/ECC/topology·실제 serving trace | 정적 검사 통과 |
| `b300-switchless-network` | cable은 연결됐지만 주소·rail 불일치로 collective 실패 | port map·addressing·NCCL·operations | 정적 검사 통과 |

## 판정 경계

- `정적 검사 통과`는 TypeScript, 글 구조, 한국어, 수식, 근거 연결과 production build가 통과했다는 뜻이다.
- 실제 OEM BOM, Singapore facility의 single-line diagram, PDU 계측, 수질·유량과 FAT/SAT 원본을 검증했다는 뜻은 아니다.
- 실제 브라우저의 390px·1440px 시각 검사는 실행 환경이 local listen을 허용할 때 별도로 닫는다.
