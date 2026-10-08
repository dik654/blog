# 스토리지 심화 리서치 원장

기준일은 2026-10-08이다. 이 원장은 `gpu/ai-cluster-storage-io`를 “제품 종류 소개”에서
“한 번의 I/O와 한 번의 장애 복구를 끝까지 설명하는 글”로 보강하기 위한 내부 근거표다.

## 독자와 한 문장 약속

- 독자: GPU·Kubernetes 위쪽은 다뤘지만 파일시스템·장치·분산 저장의 완료 조건을 아직 한 흐름으로
  설명하기 어려운 인프라 엔지니어
- 글 유형: 개념 + 설계 + 검증
- 약속: 글을 읽고 나면 `4 MiB read/write 한 번`을 application에서 장치 또는 storage node까지
  추적하고, 처리량·동시성·내구성·복구 기준을 제안서와 면접 답변으로 바꿀 수 있다.
- 글 밖의 범위: 특정 벤더의 미공개 BOM·가격, 싱가포르 실제 프로젝트 구성, 전기 설비 상세 설계,
  특정 제품의 성능 보장

## 질문·답·결정

- 질문: 처리량 시험은 통과했는데 GPU가 기다리고 최신 checkpoint로 재시작하지 못한 이유는 무엇인가?
- 답: byte 전송 완료, 한 요청의 반환, durable publish, application restore는 서로 다른 완료 경계이므로
  같은 workload와 같은 시간축에서 각각 검증해야 한다.
- 결정: local cache·shared file·object의 역할을 정하고, 정상·degraded·rebuild·restore 시험을 통과한
  구성만 채택한다.

## 글 전체에서 따라갈 사건

아래 숫자는 실제 싱가포르 프로젝트 실측값이 아니라 설명용 가정이다.

1. B300 128개를 쓰는 16-node 학습 작업이 4MiB 단위로 dataset을 읽는다.
2. PoC에서는 client 16개가 합계 8GiB/s를 내야 한다.
3. 작업은 8TB checkpoint를 120초 안에 저장해야 한다.
4. 비동기 저장 중 node 하나가 사라지고, 최신 세대는 완료 표시가 있었지만 restore되지 않는다.
5. 독자는 이 실패를 application→OS·filesystem→transport·storage→restore 순서로 좁힌다.

## 주장과 근거

| ID | 본문에서 할 주장 | 근거 | 적용 경계 |
|---|---|---|---|
| S-01 | buffered write의 성공과 영구 저장 완료는 같은 시점이 아니다. | Linux kernel page cache·VFS 문서, `fsync(2)` | 원격·분산 파일시스템은 해당 제품의 `fsync`·close semantics를 추가 확인한다. |
| S-02 | `O_DIRECT`는 cache 영향을 줄이는 수단이지 그 자체로 durability 보장이 아니다. | Linux `open(2)` | 정렬 제약과 filesystem 지원 여부가 다르다. |
| S-03 | 처리량은 request size와 IOPS의 곱으로 시작하고, 필요한 in-flight 수는 Little's law로 점검할 수 있다. | CMU performance course notes | 포화 뒤 queue depth 증가는 latency를 키울 수 있으므로 장치 보장식으로 쓰지 않는다. |
| S-04 | Linux local block I/O에는 VFS/page cache, filesystem, `bio`·`request`, blk-mq software/hardware queue, driver/device completion이 있다. | Linux VFS·blk-mq 문서 | NFS·Lustre·CephFS·object client 경로는 network와 server 측이 더 붙는다. |
| S-05 | raw capacity와 실제 운영에 쓸 수 있는 capacity는 복제·EC·예약 공간·snapshot·metadata로 달라진다. | Ceph EC·CRUSH·recovery 문서 | 예제의 8+2와 20% reserve는 설명용 가정이다. |
| S-06 | 정상 상태 최고 처리량만으로는 storage acceptance를 끝낼 수 없다. | Ceph recovery/backfill, SNIA SSS PTS, MLPerf Storage | full·degraded·rebuild·restore 상태를 별도 결과로 남긴다. |
| S-07 | 비동기 체크포인트는 GPU 정지 시간을 줄이지만 CPU staging memory와 background persistence 완료를 별도로 관리해야 한다. | PyTorch DCP 문서·공식 tutorial | 현재 API의 experimental 표기를 유지하고 실제 framework version을 pin한다. |
| S-08 | AI storage는 dataset read, small-file metadata, checkpoint burst, restart read를 다른 workload로 재현해야 한다. | NVIDIA HGX storage guide, IOR/mdtest, MLPerf Storage | GPU당 지침은 sizing 출발점이지 application 보장값이 아니다. |

## 국내 운영 사례 원장

| 조직·시점 | 관찰한 문제와 선택 | 글에 가져올 교훈 | 일반화하지 않을 것 |
|---|---|---|---|
| Elice, 2024-06-11·2026-09-29 | 공개 문서상 ECI는 block·object·PFS를 구분해 제공하고, DataHub는 S3 호환 object storage다. B300 도입기에서는 GPU·NIC·NVMe의 물리 역할과 topology를 식별한 뒤 host/guest software 조합을 맞춰 같은 benchmark로 검증했다. | 고객 데이터의 lifecycle을 세 storage interface에 매핑하고, VM에 보이는 block/NVMe path와 물리 경로를 inventory·동일 조건 benchmark로 검증한다. | 공개되지 않은 PFS 제품·복제/EC·durability·실제 GB/s·BOM을 추정하지 않는다. NCCL 결과를 storage 성능으로 바꾸지 않는다. |
| NAVER D2, 2022-05-27 | Kubernetes AI platform에서 HDFS를 그대로 쓰기 어려워 Alluxio FUSE와 locality cache를 두고, 영속 쓰기는 `CACHETHROUGH`로 HDFS에 보장했다. metadata sync 주기는 NameNode 부하와 최신성의 trade-off였다. | cache hit 속도만 보지 말고 authoritative copy, cache invalidation, locality, metadata owner를 함께 묻는다. | Alluxio 2.4.1에서 6.4 GB 파일을 잰 수치를 현재 환경의 성능 약속으로 쓰지 않는다. |
| Kakao, 2025 게시물 | 신선도를 높이려고 commit/checkpoint 주기를 줄이자 작은 파일이 늘었다. 일 평균 30억 로그의 시험에서 약 6 MB 파일을 compaction 후 약 256 MB로 합쳤다. | freshness·파일 수·metadata·compaction cost·retention을 한 운영 고리로 본다. | 256 MB를 AI dataset의 보편적인 최적 파일 크기로 쓰지 않는다. DB 로그는 운영, 서버 로그는 시험이라는 범위를 유지한다. |
| 우아한형제들, 2019-03-22 | Aurora local storage의 SSD/EBS 이름만 보고 결론 내리지 않고 sort·group·temporary table과 sysbench로 R3/R4/R5를 비교했다. | media label보다 실제 workload, instance generation, engine version을 고정해 측정한다. | 오래된 Aurora 세대의 결과를 현재 instance 성능으로 인용하지 않는다. |
| 당근, 2021-12-27 | 온라인 DynamoDB 전체 scan/export 대신 변경 이벤트를 흘려 S3에 목적별 prefix로 저장했다. | source of truth와 분석 copy를 분리하고, access pattern이 object layout과 ingest path를 결정하게 한다. | 당시 DynamoDB·Kinesis quota와 권장 buffer를 현재 값으로 재사용하지 않는다. |

## 본문 순서

인접한 두 절은 “그 때문에”로 연결되어야 한다. 사건과 직접 연결되지 않은 회사 사례·version·원문은
해당 절의 근거 블록이나 마지막 근거 원장으로 보낸다.

1. S — 저장 완료 표시가 있었지만 복구하지 못한 사건과 글의 한 문장 답을 제시한다.
2. B — 아직 제품명을 쓰지 않고 요청을 받는 곳, 잠시 보관하는 곳, 옮기는 곳, 살아남게 하는 곳을 그린다.
3. 0 — 4MiB 요청으로 8GiB/s를 내려면 2,048 IOPS와 평균 약 8.2 in-flight가 필요함을 한 줄씩 계산한다.
4. 1 — 모든 데이터를 GPU 가까이에 두자는 첫 해법이 node loss와 공동 namespace에서 왜 막히는지 본다.
5. 2 — dataset 원본, 반복 read copy, 완료 checkpoint가 서로 다른 보존 조건을 갖는 이유를 같은 사건에서 푼다.
6. 3 — 독자가 이미 본 역할에 local NVMe cache·shared filesystem·object storage·page cache·direct I/O·tail latency라는 이름을 붙인다.
7. 4 — 같은 4MiB 요청과 checkpoint shard 하나를 application에서 완료 acknowledgement까지 실제 값으로 따라간다.
8. 5 — Linux VFS·`address_space`·`bio`·blk-mq와 `strace`·`iostat`으로 첫 대기 지점을 찾는다.
9. 6 — Elice의 공개 interface와 검증 방법, fio·IOR·mdtest·PyTorch DCP를 같은 사건의 PoC에 적용한다.
10. 7 — node loss→degraded→rebuild→다른 node 수 restore로 돌아와 채택 여부를 결정한다.

## 절마다 독자가 새로 아는 것

| 절 | 읽은 뒤 아는 것 |
|---|---|
| S | 높은 GB/s와 복구 가능한 완료가 같은 말이 아님을 안다. |
| B | 한 I/O가 네 책임 구간을 지난다는 그림을 그릴 수 있다. |
| 0 | 처리량을 request rate와 in-flight 수로 바꿀 수 있다. |
| 1 | 가장 가까운 저장소 하나만으로는 공유와 생존 조건을 함께 만족하지 못함을 안다. |
| 2 | data 종류별 source of truth와 완료 조건을 정할 수 있다. |
| 3 | 앞서 본 역할을 표준 storage 용어와 정확히 연결할 수 있다. |
| 4 | 한 read와 한 checkpoint shard가 어느 acknowledgement를 거치는지 말할 수 있다. |
| 5 | application wait와 kernel·device 지표를 같은 시각에 대조할 수 있다. |
| 6 | Elice 공개 사실과 확인할 미공개 값을 나누고 PoC를 설계할 수 있다. |
| 7 | 정상 성능이 아니라 restore 결과로 storage 채택을 닫을 수 있다. |

## 후속 학습 순서

1. MIT 6.1810의 file system·crash recovery 강의로 inode·log·commit의 최소 구현을 본다.
2. Linux VFS·page cache·blk-mq 문서와 `strace`, `iostat`, `nvme-cli`로 한 요청을 관찰한다.
3. CMU 15-746의 storage systems 주제표를 따라 SSD firmware, RAID, distributed file system,
   integrity·disaster recovery를 채운다.
4. fio → IOR/mdtest → MLPerf Storage 또는 실제 data loader/checkpoint replay 순서로 측정 범위를 넓힌다.
5. Ceph 또는 실제 채택 후보에서 failure domain, EC/replication, degraded mode, rebuild, scrub,
   restore drill을 실습한다.
