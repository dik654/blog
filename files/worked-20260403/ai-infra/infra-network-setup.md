# 인프라 및 네트워크 구성 프로세스

> Proxmox VE 기반 GPU 패스스루, 서버 구성, 망분리 네트워크 설계 방법론.
> 특정 IP/서버명 제거. 범용 프로세스 가이드.

---

## 1. Proxmox VE 초기 세팅

### 1.1 왜 Proxmox인가
- 오픈소스 가상화 플랫폼 (KVM + LXC)
- 무료 No-Subscription 저장소 제공
- GPU Passthrough 지원 (IOMMU)
- 웹 UI로 VM 관리

### 1.2 설치 후 필수 세팅 (순서 중요)

**STEP 1 — Enterprise 저장소 제거 (먼저!)**
```bash
# 이걸 안 하면 apt 401 Unauthorized 에러 발생
rm /etc/apt/sources.list.d/pve-enterprise.sources
rm /etc/apt/sources.list.d/ceph.sources
```

**STEP 2 — No-Subscription 저장소 등록**
```bash
cat << 'EOF' > /etc/apt/sources.list.d/pve-no-subscription.sources
Types: deb
URIs: http://download.proxmox.com/debian/pve
Suites: trixie
Components: pve-no-subscription
Enabled: yes
EOF

cat << 'EOF' > /etc/apt/sources.list.d/ceph-no-subscription.sources
Types: deb
URIs: http://download.proxmox.com/debian/ceph-squid
Suites: trixie
Components: no-subscription
Enabled: yes
EOF
```

**STEP 3 — 시스템 업데이트**
```bash
apt update && apt full-upgrade -y
# 정상: "Hit: http://download.proxmox.com/debian/pve trixie InRelease"
# 비정상: enterprise.proxmox.com 이 나오면 STEP 1 재확인
```

**STEP 4 — (선택) 구독 팝업 제거**
```bash
sed -i.bak "s/data.status !== 'Active'/false/" \
  /usr/share/javascript/proxmox-widget-toolkit/proxmoxlib.js
systemctl restart pveproxy.service
```

---

## 2. GPU Passthrough 설정

### 2.1 왜 GPU Passthrough가 필요한가
- VM 안에서 GPU를 네이티브 성능으로 사용
- ML/AI 워크로드는 GPU 가상화 오버헤드 허용 불가
- Proxmox 호스트 → GPU를 안 쓰고 → VM에 직접 넘기는 구조

### 2.2 IOMMU 활성화
```bash
# AMD EPYC 서버 기준
nano /etc/default/grub
# 수정: GRUB_CMDLINE_LINUX_DEFAULT="quiet amd_iommu=on iommu=pt"
# Intel 서버는: intel_iommu=on iommu=pt

update-grub
reboot
```

### 2.3 GPU 드라이버 비활성화 (호스트에서)
```bash
# nouveau + nvidia 커널 모듈 블랙리스트
cat > /etc/modprobe.d/blacklist-nvidia.conf << 'EOF'
blacklist nouveau
blacklist nvidia
blacklist nvidia_uvm
blacklist nvidia_drm
blacklist nvidia_modeset
EOF

update-initramfs -u && reboot
```

### 2.4 VFIO 커널 모듈 활성화
```bash
# VFIO: GPU를 호스트가 아닌 VM에 넘기는 역할
echo -e "vfio\nvfio_pci\nvfio_iommu_type1\nvfio_virqfd" >> /etc/modules
```

### 2.5 GPU Device ID 확인 및 바인딩
```bash
# GPU Device ID 확인
lspci -nn | grep -i nvidia
# 출력 예: a4:00.0 VGA [10de:2204]   ← VGA ID
#          a4:00.1 Audio [10de:1aef]  ← Audio ID
# 같은 모델 GPU는 ID 동일 → 1번만 등록하면 전체 적용

# VFIO에 GPU 바인딩
cat > /etc/modprobe.d/vfio.conf << 'EOF'
options vfio-pci ids=10de:2204,10de:1aef disable_vga=1
EOF
# 의미: GPU를 호스트가 쓰지 말고 VM에 넘길 준비

update-initramfs -u && reboot
```

### 2.6 확인
```bash
lspci -k | grep -A 3 -i nvidia
# 정상: "Kernel driver in use: vfio-pci"
# → GPU가 VM에 넘겨질 준비 완료
```

### 2.7 VM에 GPU 할당 (Proxmox UI)
```
Proxmox UI → VM → Hardware → Add → PCI Device
→ 원하는 GPU 선택
→ ✔ All Functions  ✔ PCI-Express  ✔ Primary GPU (필요 시)
```

GPU가 4장이면 각각 다른 PCI 주소로 표시됨:
- a4:00.0/a4:00.1 (GPU0+Audio0)
- a5:00.0/a5:00.1 (GPU1+Audio1)
- ...

---

## 3. 네트워크 구성 설계

### 3.1 망분리 원칙 (ISMS 요구사항)

**왜 망분리인가:**
- ISMS 2.6 접근통제: 업무망/서비스망/관리망 분리
- DB 직접 접근 차단 → 접근제어 소프트웨어 경유
- 외부 트래픽은 Gateway에서만 수신

**일반적 3-Zone 구성:**

| Zone | 역할 | 접근 허용 |
|---|---|---|
| DMZ (외부 접점) | 웹서버, API Gateway, SSL 종단 | 인터넷 → DMZ만 |
| 서비스망 | 앱서버, API 서버 | DMZ → 서비스망 |
| 내부망 | DB, 관리 콘솔, 월렛 | 서비스망 → 내부망 (제한적) |

### 3.2 DB 접근통제 네트워크 설계

```
개발자 PC (개발망 IP 대역)
  └─→ 접근제어 소프트웨어 (PETRA 등) ─→ 개발 DB
  
서비스 서버 (서비스 IP 대역)
  └─→ 접근제어 소프트웨어 ─→ 서비스 DB (readWrite)
  
관리자 PC (특정 IP)
  └─→ 접근제어 UI ─→ 전체 DB (승인 기반)
```

**접근제어 계층:**
1. 세션 접근 제어: 누가 접속하는지
2. 쿼리 접근 제어: 무슨 쿼리를 실행하는지
3. IP 기반 제한: 어디서 접속하는지

### 3.3 AI 인프라 2노드 네트워크

```
인터넷
  │
  ▼
[EDGE 노드] ── API Gateway, SSL, 임베딩, 리랭커
  │
  │  내부 네트워크 (사설 IP)
  │
  ▼
[CORE 노드] ── LLM 추론, 벡터DB, 그래프DB
```

**설계 이유:**
- 외부에서 CORE 노드 직접 접근 불가 → 보안
- EDGE에서 트래픽 필터링/로드밸런싱 후 CORE로 전달
- 내부 통신은 사설 네트워크 → 레이턴시 최소, 보안 강화

### 3.4 Failover 체계
- SSH 헬스체크: 1초 간격 핑
- 노드 장애 감지 시 트래픽 자동 전환
- 서비스 이중 배치 (TTS/ASR/Reranker 양쪽 노드)

---

## 4. 스토리지 구성

### 4.1 디스크 배치 전략

**EDGE 노드:**
- SSD: OS + 앱 + 캐시 (1.8TB)
- HDD: 로그 장기 보관 + 대용량 파일 (8TB)

**CORE 노드:**
- SSD: OS + 부팅 (300GB)
- NVMe: 벡터DB + 지식그래프 + 모델 캐시 (16TB)
  - NVMe 선택 이유: 벡터 검색 I/O 성능이 SSD 대비 3-5배

### 4.2 백업 전략
- DB: 매일 자동 → 클라우드 스토리지
- 시스템 설정: 분기별 수동 → 물리 금고 (외장 HDD)
- 벡터DB: Qdrant 스냅샷 → 별도 스토리지
- 모델 가중치: 재다운로드 가능하므로 별도 백업 불필요

---

## 5. 서버 하드웨어 스펙별 용도 가이드

### 5.1 GPU 서버 구성 패턴

| 구성 | 적합한 용도 |
|---|---|
| RTX 3090 × 4 (96GB) | 27B 모델 추론, 임베딩, 소규모 RAG |
| RTX 4090 × 4 (96GB) | 27-80B MoE 모델, 중규모 서비스 |
| RTX 5090 × 2 (64GB) | 경량 추론 + 임베딩 + 리랭커 (Gateway용) |
| MI300x × 8 (1.5TB) | 400B+ 초대형 모델, 프로덕션 LLM |

### 5.2 Seagate Exos 84베이 (대용량 스토리지)
- 용도: 대량 문서/로그 장기 보관
- RAID 구성으로 데이터 안전성 확보
- NAS/SAN으로 여러 서버에서 접근
