# AI 인프라 구축 프로세스

> GPU 서버에서 LLM 추론 서비스(vLLM), 벡터DB(Qdrant), RAG 파이프라인을 구축하는 전체 프로세스.
> 특정 프로젝트명/서버 IP 제거. 범용 가이드.

---

## 1. 개발 환경 기본 세팅 (Ubuntu)

### 1.1 필수 패키지
```bash
sudo apt install vim openssh-server    # 에디터 + SSH
sudo apt install curl ca-certificates gnupg lsb-release
```

### 1.2 Docker 설치
```bash
# 기존 충돌 패키지 제거
sudo apt remove -y docker docker-engine docker.io containerd runc

# Docker GPG 키 + 저장소 등록
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg \
  | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
echo "deb [arch=$(dpkg --print-architecture) \
  signed-by=/etc/apt/keyrings/docker.gpg] \
  https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" \
  | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# 설치 + 확인
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io \
  docker-buildx-plugin docker-compose-plugin
sudo docker run hello-world

# sudo 없이 사용
sudo usermod -aG docker $USER
```

### 1.3 NVIDIA Container Toolkit (GPU Docker 연동)
```bash
# GPG 키 + 저장소
curl -fsSL https://nvidia.github.io/libnvidia-container/gpgkey \
  | sudo gpg --dearmor -o /usr/share/keyrings/nvidia-container-toolkit-keyring.gpg
curl -s -L https://nvidia.github.io/libnvidia-container/stable/deb/nvidia-container-toolkit.list \
  | sed 's#deb https://#deb [signed-by=/usr/share/keyrings/nvidia-container-toolkit-keyring.gpg] https://#g' \
  | sudo tee /etc/apt/sources.list.d/nvidia-container-toolkit.list

# 설치 + Docker 연동
sudo apt update && sudo apt install -y nvidia-container-toolkit
sudo nvidia-ctk runtime configure --runtime=docker
sudo systemctl restart docker

# GPU 패스스루 테스트
docker run --rm --gpus all nvidia/cuda:12.4.1-base-ubuntu22.04 nvidia-smi
```

### 1.4 Miniconda (Python 가상환경)
```bash
wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh
bash Miniconda3-latest-Linux-x86_64.sh    # 설치 경로 기본값, conda init yes
source ~/.bashrc
conda config --set auto_activate_base false    # 서버에서 base 자동 활성화 OFF 권장
```

---

## 2. vLLM — LLM 추론 서버

### 2.1 왜 vLLM인가
- PagedAttention으로 GPU 메모리 효율적 사용
- Tensor Parallel / Pipeline Parallel로 멀티 GPU 분산
- OpenAI 호환 API 제공 → 기존 코드 그대로 사용 가능
- 높은 동시 처리량 (continuous batching)

### 2.2 모델 다운로드
```bash
# HuggingFace Access Token 필요 (gated 모델용)
# huggingface.co → Settings → Access Tokens → Create
# Repositories Read 권한 체크

cd ~/ai/vllm
python3 -m venv venv && source venv/bin/activate
pip install huggingface_hub python-dotenv

cat > .env << 'EOF'
HF_TOKEN=hf_your_token_here
MODEL_CACHE_DIR=/home/user/ai/models
EOF
chmod 600 .env

python download_model.py <model-name>   # 예: google/gemma-2-27b-it
```

### 2.3 Docker Compose 배포 패턴

**패턴 A: 단일 모델 / 멀티 GPU (Tensor Parallel)**
```yaml
services:
  vllm:
    image: vllm/vllm-openai:latest
    container_name: llm-server
    ports: ["8000:8000"]
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: 4            # GPU 수
              capabilities: [gpu]
    volumes:
      - /path/to/model:/model
    environment:
      - TRANSFORMERS_OFFLINE=1    # 오프라인 모드 (사전 다운로드 필수)
    command: >
      --model /model
      --tensor-parallel-size 4    # GPU 수와 일치
      --max-model-len 8192        # 컨텍스트 길이
      --dtype bfloat16            # 추론 정밀도
      --gpu-memory-utilization 0.9
    shm_size: '16gb'              # GPU간 텐서 통신용
    restart: unless-stopped
```

**핵심 파라미터 가이드:**

| 파라미터 | 설명 | 결정 기준 |
|---|---|---|
| `--tensor-parallel-size` | 모델 분산 GPU 수 | 모델 크기 ÷ GPU VRAM |
| `--pipeline-parallel-size` | 파이프라인 병렬 | TP로 부족할 때 추가 |
| `--max-model-len` | 최대 컨텍스트 토큰 | VRAM 여유에 따라 조정 |
| `--dtype` | 추론 정밀도 | bfloat16 (기본), auto |
| `--gpu-memory-utilization` | VRAM 사용 비율 | 0.85~0.95 |
| `--max-num-seqs` | 동시 처리 요청 수 | 메모리 허용 범위 내 |
| `shm_size` | 공유 메모리 | 16gb 이상 권장 |

**GPU 수 별 모델 크기 가이드 (bfloat16):**
| GPU | VRAM | 적정 모델 크기 |
|---|---|---|
| RTX 3090 × 4 | 96GB | 27B~70B |
| RTX 4090 × 4 | 96GB | 27B~80B |
| MI300x × 4 | 768GB | 200B~400B |
| MI300x × 8 | 1536GB | 400B+ |

### 2.4 추론 테스트
```bash
curl http://localhost:8000/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "model-name",
    "messages": [{"role": "user", "content": "테스트 질문"}],
    "max_tokens": 100
  }'
```

---

## 3. Qdrant — 벡터 검색 엔진

### 3.1 왜 Qdrant인가
- Rust 기반 고성능 벡터 DB
- 하이브리드 검색 (벡터 + BM25 전문검색)
- 다양한 Distance Metric (Cosine, Dot, Euclid)
- 필터링 + 벡터 검색 결합 가능
- 스냅샷 기반 백업/복구

### 3.2 설치 (Docker Compose)
```yaml
services:
  qdrant:
    image: qdrant/qdrant:v1.9.3
    container_name: qdrant
    restart: always
    ports:
      - "6333:6333"    # REST API
      - "6334:6334"    # gRPC
    volumes:
      - ~/ai/qdrant/data:/qdrant/storage       # 핵심 데이터
      - ~/ai/qdrant/snapshots:/qdrant/snapshots # 스냅샷
    environment:
      - QDRANT__SERVICE__HTTP_PORT=6333
      - QDRANT__SERVICE__GRPC_PORT=6334
```

**백업 전략:** `/qdrant/data` 디렉토리만 백업하면 전체 데이터 보존 가능.

### 3.3 데이터 임베딩 체크리스트

임베딩 작업 전 **반드시 결정해야 할 항목들**:

**1) 입력 데이터 확인**
- 데이터 형식 (CSV / JSON / DB)
- 총 데이터 건수
- 임베딩 대상 텍스트 필드
- 고유 식별자(ID) 필드
- 텍스트 평균 길이 (토큰 수)

**2) 임베딩 모델 선정**
- 모델명 (예: BAAI/bge-m3, intfloat/multilingual-e5-large)
- 벡터 차원 확인 (예: 1024)
- max_length 확인 (예: 8192 토큰)
- 구동 환경 (GPU / CPU / API)

**3) 텍스트 처리**
- 청킹 필요 여부 → 방식/크기/오버랩 결정
- 전처리: 특수문자, HTML 태그, 줄바꿈 처리
- 형태소 분석 / 동의어 정규화 여부

**4) 컬렉션 설계**
- 컬렉션명
- Distance metric (Cosine이 가장 범용)
- payload 필드 목록 (메타데이터)
- 필터링용 인덱스 필드

**5) 업로드 설정**
- 배치 사이즈
- point_id 방식 (UUID / 순번)
- 중복 처리 (upsert / skip)
- 실패 시 재시도 방식

**6) 검증**
- 업로드 건수 일치 확인
- 샘플 검색 쿼리 테스트
- 메타데이터 필터 테스트
- 검색 결과 품질 확인

---

## 4. RAG 파이프라인 아키텍처

### 4.1 전체 흐름
```
문서 업로드 → 타입 감지 → 추출 엔진 라우팅 → 텍스트 추출
→ 청킹 → 임베딩 → 벡터DB 저장
→ (선택) 엔티티 추출 → 지식그래프(Neo4j)

질의 → 임베딩 → 벡터 검색 → Reranker 재정렬
→ 상위 문서 + 질의 → LLM 답변 생성
```

### 4.2 문서 처리 엔진 선택 (파일 타입별)

| 파일 타입 | 추천 엔진 | 설명 |
|---|---|---|
| PDF | 한컴 OpenDataLoader | Java 레이아웃 분석, 표/이미지/텍스트 → 마크다운 |
| HWP | kordoc (cfb 파서) | 한글 바이너리 포맷 네이티브 파싱 |
| HWPX | kordoc (XML 파서) | 한글 XML + OCR(VLM) 통합 |
| DOCX/XLSX/PPTX | MS MarkItDown | Office 직접 파싱, 모든 시트/슬라이드 추출 |
| DOC/PPT/XLS | LibreOffice → MarkItDown | 레거시: LibreOffice 변환 후 추출 |
| JPG/PNG/GIF | VLM (Qwen 등) | AI 이미지 분석 + OCR + 표/차트 변환 |

### 4.3 2노드 배치 설계 패턴

**EDGE 노드 (Gateway):**
- 역할: API Gateway, SSL 종단, 경량 GPU 추론, 로드밸런서
- 배치: 임베딩 서버, Reranker, TTS/ASR, RAG API
- 이유: 실시간 질의마다 호출되는 임베딩/리랭커를 Gateway와 같은 노드에 → 레이턴시 최소화

**CORE 노드 (DB + LLM):**
- 역할: 대규모 LLM 추론, 벡터DB, 지식그래프
- 배치: vLLM (대형 모델), Qdrant, Neo4j
- 이유: 397B급 LLM은 4-way 텐서 병렬 필요 → 대용량 VRAM GPU 집중. DB는 NVMe SSD 필요 → LLM과 같은 노드에서 내부 통신으로 레이턴시 최소화

**설계 판단 근거:**
| 결정 | 이유 |
|---|---|
| EDGE에 Gateway | 외부 트래픽 수신, CORE DB 직접 접근 차단 |
| EDGE에 임베딩/리랭커 | 매 질의 호출 → Gateway 근처 배치로 레이턴시 최소화 |
| CORE에 GPU 집중 | 대형 모델 텐서 병렬 필수 → 전용 노드 운영 |
| CORE에 DB | 대용량 NVMe SSD 필요 + LLM 내부 통신 최소화 |
| 서비스 이중 배치 | TTS/ASR/Reranker 양쪽 GPU에 → 가용성 + 부하분산 |

### 4.4 파일 크기별 처리 시간 특성

| 파일 타입 | 크기 | 처리시간 | 비고 |
|---|---|---|---|
| HWP (소형) | 30-200KB | 0.01-0.09초 | kordoc 매우 빠름 |
| HWP (대형) | 6-20MB | 9-43초 | 크기 비례 |
| PDF (소형) | 3-400KB | 0.85-2.7초 | 안정적 |
| PDF (대형/복잡) | 6-45MB | 11-765초 | **복잡도가 크기보다 영향 큼** |
| 이미지 (성공) | ~7MB | 5-19초 | VLM 처리 포함 |
| 이미지 (실패) | 28MB+ | 타임아웃 | 대용량 이미지 주의 |

> 핵심 인사이트: PDF 처리 시간은 파일 크기보다 **문서 복잡도** (테이블, 이미지, 레이아웃)에 더 의존함.

### 4.5 GraphRAG (선택)
- 문서에서 엔티티(인물, 기관, 정책 등) + 관계 자동 추출
- Neo4j 지식그래프에 저장
- 벡터 검색과 결합하여 문맥 이해 향상
- 관계 유형: REGULATES, MANAGES, APPLIES_TO, LOCATED_IN 등

---

## 5. 임베딩 모델 선택 가이드

| 모델 | 차원 | 다국어 | 특징 |
|---|---|---|---|
| BAAI/bge-m3 | 1024 | 한/영/중/일 | 가장 범용, RAG에 추천 |
| intfloat/multilingual-e5-large | 1024 | 다국어 | Microsoft, 균형잡힌 성능 |
| sentence-transformers/all-MiniLM-L6-v2 | 384 | 영어 | 경량, 빠른 속도 |
| jhgan/ko-sbert-sts | 768 | 한국어 특화 | 한국어 STS 최적화 |

bge-m3 + max_model_len 8192 + Qdrant 하이브리드 검색이 현재 가장 실용적인 조합.
