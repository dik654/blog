# freeCodeCamp AI infrastructure gap ledger

확인일: 2026-10-08

## 독자와 한 문장 답

- 독자: GPU workload·Kubernetes 상위 계층 경험을 물리 AI 인프라 제안·구축까지 확장하려는 엔지니어
- 질문: 네 강의를 더 보면 기존 P0 글에서 정확히 무엇을 보강해야 하는가?
- 답: 새 용어를 나열하는 대신 workload가 chip·runtime·scheduler·운영 도구를 통과하는 한 경로에서 소유자와 실패 경계를 채운다.
- 판단: 영상은 빈칸 발견과 복습에 쓰고, 본문의 현재 사실과 명령은 NVIDIA·Kubernetes·SchedMD·공식 model card에서 확인한다.

## 영상별 canonical mapping

| 강의 | 전체 흐름 | 기존 정본 | 확인된 빈칸 | 이번 보강 | 제외 범위 |
| --- | --- | --- | --- | --- | --- |
| [Inside the AI Hardware Engine — Full Semiconductor Supply Chain Course](https://www.youtube.com/watch?v=FGT7LZbZe-g) | Blackwell Ultra 한 장이 transistor·foundry·HBM·advanced package·network를 거쳐 data center가 되는 경로 | 반도체 6편, HBM, interconnect, B300 128 GPU 설계, 전력·냉각 | 개별 부품 지식이 BOM의 납기·대체·검수 위험으로 이어지는 설명 | B300 설계 글에 supply-chain risk register와 공식 사양 대조 절차 추가 | 회사별 시장점유율·주가·미확정 roadmap을 현재 사실로 재사용하지 않음 |
| [Build & Train a GLM-5.3-Flash Model From Scratch with Python](https://www.youtube.com/watch?v=-gfgQfw2g_E) | 작은 모델의 구조·pretraining·실행 보상 RL·confirmation·실패 분석 | MoE, linear attention, hyper-connections, model VRAM, B300 설계 | 교육용 축소 모델과 실제 배포 모델을 인프라 입력으로 혼동할 위험 | total/active/context/runtime memory를 분리하는 workload intake ledger 추가 | 25.7M 교육 모델의 VRAM·성능을 320B 공개 모델이나 B300 sizing으로 환산하지 않음 |
| [Kubernetes Operator Best Practices — Kubebuilder Deep Dive](https://www.youtube.com/watch?v=hAsz5GAbBQE) | update conflict·predicate·finalizer·concurrent reconcile을 포함한 controller 생애 | Kubernetes와 Slurm 선택, GPU Operator | GPU Operator를 component installer로만 설명하고 controller 실패 경계가 없음 | desired/observed state, generation/resourceVersion, RetryOnConflict, finalizer, concurrency 실물 추가 | 일반 Kubebuilder 전체 tutorial이나 별도 CRD 제작 과정은 다루지 않음 |
| [NVIDIA-Certified Associate AI Infrastructure and Operations Free Study Course](https://www.youtube.com/watch?v=0WjfKQdfeMU) | GPU·CUDA·container·Triton·Slurm·BCM·GPU Operator·DCGM을 Associate 범위로 훑음 | NCA-AIIO 학습 가이드와 여섯 P0 글 | 도구 이름이 실제 책임과 실행 evidence로 충분히 연결되지 않음 | 여섯 역할 지도, Container Toolkit/Triton/DCGM lab ladder, P0 연결 강화 | 영상의 표현을 시험 정답으로 간주하거나 NCA 합격을 구축 경력으로 표현하지 않음 |

## 적용 근거

### AI hardware

- 강의 source repository의 curriculum은 이 과정이 production specification이 아니라 2025–26 Blackwell Ultra를 설계에서 데이터센터까지 따라가는 narrative outline이라고 밝힌다.
- DGX B300의 실제 8 GPU, 288GB/GPU, 14.5kW, network·storage 구성은 NVIDIA DGX B300 User Guide에서 확인한다.
- HBM과 logic의 advanced packaging 연결은 TSMC 3DFabric·CoWoS 공식 자료에서 확인한다.

### GLM-5.3-Flash

- 교육 repository는 25,730,592 total, 약 9,805,344 active parameter/token, 12 layers, 192-token context를 사용하며 production 재현이 아님을 명시한다.
- 공개 model card의 실제 GLM-5.3-Flash는 320B total, 18B active이고 hybrid sparse/linear attention을 사용한다.
- 따라서 둘의 차이는 모델 공부의 좋은 사례지만, 교육 모델의 peak VRAM과 synthetic benchmark를 cluster sizing evidence로 쓰지 않는다.

### Operator

- Kubernetes API의 `resourceVersion`은 객체가 마지막으로 바뀐 버전을 식별하며 stale update conflict를 찾는 데 쓰인다.
- controller-runtime의 `GenerationChangedPredicate`는 spec이 변하지 않은 status-only update를 건너뛸 수 있지만 API 종류별 generation semantics를 확인해야 한다.
- client-go의 `RetryOnConflict`는 매 시도마다 최신 객체를 다시 읽고 conflict update를 재시도한다.
- finalizer가 남은 객체는 `deletionTimestamp`가 생긴 뒤 즉시 사라지지 않으며 외부 자원 정리를 마친 controller가 key를 제거해야 한다.
- `MaxConcurrentReconciles`를 올리면 다른 key를 병렬 처리할 수 있지만 외부 API rate, shared state와 idempotency가 함께 검토돼야 한다.

### NCA-AIIO

- 시험 정보와 영역 비중은 NVIDIA 공식 certification page와 Study Guide를 정본으로 둔다.
- NVIDIA Container Toolkit은 host GPU를 container runtime에 주입하는 경계를 맡고, sample `docker run ... nvidia-smi`로 그 경계까지만 확인한다.
- Triton의 readiness 200은 server와 model이 준비됐다는 신호이지 GPU health·성능·SLO 전체 합격은 아니다.
- Slurm은 resource allocation·job execution·queue arbitration을, Base Command Manager는 cluster provisioning·management·monitoring을, GPU Operator는 Kubernetes GPU software lifecycle을, DCGM은 GPU telemetry·diagnostics를 맡는다.

## 이번 변경의 합격 조건

- B300 글이 교육용 model과 production model의 숫자를 같은 인프라 근거로 섞지 않는다.
- B300 BOM에 공급·대체·검수 위험이 요구사항 ID로 연결된다.
- Kubernetes 글에서 status update loop, conflict, finalizer와 worker concurrency를 실제 source/API semantics로 설명한다.
- NCA 글에서 최소한 container runtime, inference readiness, scheduler/cluster manager, operator, telemetry의 책임을 구분하고 정상·실패 판독을 남긴다.
- 390px와 1440px에서 표·코드·수식이 본문 폭을 깨지 않으며 direct route와 reload가 같은 문서를 연다.
