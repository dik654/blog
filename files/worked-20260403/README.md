# worked-20260403 — 프로세스 참고자료

> 원본 회사 문서에서 **프로세스/절차/방법론**만 추출. 회사명·IP·개인정보 제거.

## 파일 구조

### ISMS 인증 프로세스 (`isms/`)
- [isms-process-overview.md](isms/isms-process-overview.md) — ISMS-P 전체 항목별 프로세스
  - 1.x 관리체계 수립 (정보보호정책, 위험평가, 자산분류)
  - 2.1~2.12 보호대책 (접근통제, 암호화, 백업, 사고대응 등)
  - 3.x 개인정보 처리
  - 인증심사 보완조치 프로세스

### AML/VASP 컴플라이언스 (`aml-vasp/`)
- [aml-vasp-compliance-process.md](aml-vasp/aml-vasp-compliance-process.md) — 가상자산사업자 AML 전체 프로세스
  - 고객확인(CDD/EDD), 위험기반 접근법(RBA)
  - 이상거래 탐지(FDS), 의심거래 보고(STR/SAR)
  - 내부통제 체계 (핫/콜드월렛, Multi-sig)
  - 가상자산 보관 지침 (80% 콜드월렛)
  - 불공정거래 방지, 금융사고 대응

### AI 인프라 구축 (`ai-infra/`)
- [ai-infra-setup-process.md](ai-infra/ai-infra-setup-process.md) — AI 서비스 인프라 구축 가이���
  - Ubuntu 개발환경 (Docker, NVIDIA Container Toolkit, Miniconda)
  - vLLM 배포 (Tensor Parallel, Docker Compose 패턴, GPU별 모델 가이드)
  - Qdrant 벡터DB (설치, 임베딩 체크리스트, 컬렉션 설계)
  - RAG 파이��라인 아키텍처 (문서 처리 엔진, 2노드 배치, GraphRAG)

- [infra-network-setup.md](ai-infra/infra-network-setup.md) — 인프라/네트워크 구성 가이드
  - Proxmox VE 초기 세팅 (No-Subscription, GPU Passthrough)
  - IOMMU/VFIO GPU 패스스루 전체 절차
  - 망분리 네트워크 설계 (3-Zone, DB 접근통제)
  - 2노드 아키텍처 (EDGE/CORE 배치 이유)
  - 스토리지/백업 전략

## 블로그 카테고리 매핑
- `src/content/isms-aml/` — ISMS/AML 카테고리 정의 추가됨
- `src/pages/articles/isms-aml/` — 아티클 작성 대상 디렉토리 (비어있음)
- AI 인프라 내용은 기존 `ai/` 또는 `gpu/` 카테고리 아티클로 작성 가능
