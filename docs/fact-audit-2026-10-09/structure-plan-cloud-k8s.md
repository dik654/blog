# Cloud·온프레미스 Kubernetes 구조 개선 계획 (2026-10-09)

사용자 지적: "cloud쪽과 온프레미스 쿠버네티스 구성 등에서 읽는 순서가 섞여 있어 헷갈리고, 수식이나 어려운 표현이 필요 없는 구간에서 기존 글 방식을 따르느라 굳이 헷갈리게 쓴 부분이 있다."

## 확인한 실제 상태 (scripts/print-reading-order.mjs)

| 목록 | 현재 순서 | 문제 |
|---|---|---|
| cloud / 취업·이직 로드맵 | 로드맵 → **CKA 요청 경로** → **패킷 경로** | Kubernetes 심화 2편이 로드맵 소분류에 들어가 공통 기초(책임·권한·망…)보다 먼저 보임 |
| gpu / hw-infra | 전력·망·interconnect·RDMA·collective·4090·site·B300망·**NCA**·**blueprint**·**호환성**·**K8s vs Slurm**·**스토리지**·**랙전력**·**검수** | "전력, 냉각, 네트워크, 랙마운트"라는 한 목록에 AI 클러스터 구축 7편이 섞임. 자격 지도(NCA)가 설계(blueprint)보다 앞 |
| ai / onprem-k8s-inference-platform | 선수 글 안내 없음 | Kubernetes 기초(요청 경로·패킷 경로)·GPU 스케줄링 글과 이어지지 않음 |
| 링크 | `/cs/hw/...` 3곳 | `hw` 카테고리는 없음(`gpu/hw-*`). 404 |

불필요한 수식·표현:

| 위치 | 현재 | 조치 |
|---|---|---|
| cloud/kubernetes-request-path-and-cka `formulas` | `C_ready=N_ready·c, G=λ−C_ready` 로 3×35·2×35·90−70 을 LaTeX로 표기 | 수식 제거. 숫자 장부(NumericPath)와 문장으로 충분 |
| cloud/kubernetes-request-path-and-cka 2~5절 | API server·scheduler·kubelet을 "중앙 입구·배치 담당·node 실행 담당자"로 5절까지 숨김, bridge가 "~했습니다. 이제 ~봅니다" 메타 서술 | 2절에서 바로 이름을 붙이고 이후 실제 용어만 사용. bridge는 다음 절이 왜 필요한지로 교체 |
| cloud/kubernetes-network-packet-path 7절 | `M_workload = M_underlay − H_encapsulation` 으로 1500−50=1450 표기 | 수식 제거. 세 줄 표(plain 1500 / IP-in-IP 1480 / VXLAN 1450)로 교체 |
| cloud/kubernetes-network-packet-path 11절 "33편 현재화 지도" | 외부 블로그(hackjsp) 33편 재배치 서술이 본문 한 절 전체 | 독자용 본문이 아니라 출처 작업 기록. 접힌 "근거 보기"로 내리고 절 제목을 "현재 기준으로 바뀐 다섯 가지"로 바꿈 |
| ai/onprem-k8s-inference-platform 3절 | `(N−k)μ > λ` ExplainedFormula | 숫자 예(복제본 4개·하나당 초당 30건·피크 100건)로 문장화 |
| ai/onprem-k8s-inference-platform 전 절 | 매 절 끝 "…가 소유합니다. 이 절은 …만 다뤘습니다" 반복 6회, 1절이 본문 전에 다른 글 3편 안내 | 소유권 문구는 ContentBoundary(검증 범위 펼쳐 보기)가 이미 담당. 본문에는 꼭 필요한 한 줄 링크만 남김. 1절 앞머리에 "먼저 읽을 글" 한 줄 |
| gpu/kubernetes-vs-slurm-gpu-scheduling 3절 | `⌊16/8⌋=2, ⌈4/2⌉=2` ExplainedFormula | 수식 제거. 문장과 NumericPath로 충분 |
| ai/llm-serving-ops k8s-gpu-fleet | `L=λW` 의 annotation이 기계 생성 문구("완료 가능한 arrival rate이(가) 식의 결과에 기여하는 방식을 계산합니다") | Little 법칙은 실제로 쓰는 식이므로 유지하되 숫자 예(초당 20건 × 3초 체류 = 60건)로 주석을 다시 씀 |

같은 기계 생성 주석 문구가 저장소 전체 286개 파일·491곳에 있다(별도 트랙 C).

## 카드

- 독자: Kubernetes를 운영하거나 CKA를 준비하는 개발자. 컨테이너와 HTTP는 안다.
- 유형: 한 요청을 끝까지 추적하는 설명 글
- 약속: 읽고 나면 Pending·NotReady·timeout 중 어느 단어를 보더라도 "마지막으로 성공한 전환 다음"부터 조사할 수 있다.
- 범위 밖: 모든 CNI 구현의 세부, GPU 스케줄링(별도 글), 클라우드 관리형 서비스 차이

## 조치 순서

1. 구조: cloud에 `cloud-kubernetes` 소분류 신설(공통 기초 뒤). gpu `hw-infra`에서 `hw-ai-cluster`(AI 클러스터 구축·운영 7편) 분리. 읽기 경로·커리큘럼 갱신. `/cs/hw/` 링크 3곳 수정.
2. 본문: 위 표의 수식 제거·문장화, 이름 조기 도입, 메타 bridge 교체, 소유권 반복 제거.
3. 검증: 학습 계약 sectionId 유지 확인, `check-article.sh` 4편, topology fingerprint 갱신, CI 게이트 전체, 빌드, 읽기 순서 재출력.
