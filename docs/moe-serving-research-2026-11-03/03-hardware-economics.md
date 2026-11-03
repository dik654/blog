# 03. ~1T MoE 자체 호스팅 하드웨어 경제성 (2026-11-03)

대상: Kimi K2.5(약 1T 파라미터, 활성 32B, INT4 약 600GB)와 DeepSeek V3/R1(671B, 활성 37B)을 에이전트 플랫폼에서 직접 서빙할 때의 하드웨어 구성, 법적·기술적 제약, 3년 TCO, API 대비 손익분기.

산출물
- 계산 스크립트: `tco_model.py` (stdlib만 사용, 상단에 입력값, `python3 tco_model.py`로 실행)
- 실행 결과: `raw/tco_model_output_2026-11-03.txt`
- API 가격 원자료: `raw/openrouter_models_20261102T1647Z.json`, `raw/or_endpoints_*.json` (OpenRouter 공개 API, 2026-11-02 16:47 UTC 수집)

표기 규칙
- **[SRC]** 원문을 직접 열어 확인한 값. URL과 확인일을 붙였다.
- **[SNAP]** 가격 스냅샷. 하드웨어 가격은 날마다 오르고 있어 스크립트 기본값 자리를 채우는 용도로만 쓴다. 결정에는 당일 견적을 넣는다.
- **[EST]** 분석자 추정. 민감도 표로 범위를 같이 보인다.

> 범위 변경(작업 도중 사용자 지시): GPU·서버·NIC·스위치 가격 수집은 중단했다. 이미 확보한 값만 날짜를 붙인 스냅샷으로 남겼고, 분석은 "얼마 이하로 사야 API를 이기는가"를 구하는 역산 구조로 바꿨다. 네트워크 장비(ConnectX-7/8, BlueField-3, SN5600, Arista, Quantum-2, 광모듈) 가격은 조사하지 않았다.

---

## 0. 결론 요약

1. **판단은 하드웨어 가격보다 가동률과 실처리량에 달려 있다.** 8× RTX PRO 6000 서버 한 대(900 tok/s 가정)가 가장 싼 Kimi K2.5 API(SiliconFlow, OpenRouter 경유)를 이기려면, 서버 총액을 $151k(카드당 $13,250 가정)로 잡아도 **가동률 39% 이상**이 필요하다. 카드 값을 eBay 2026년 10월 최저 평균 $22,945로 넣으면 총액 약 $229k가 되고, 필요 가동률은 **약 57%**로 오른다. 여기서 가동률은 "벤치마크 동시성 100에서 낸 처리량으로 돌아가는 시간 비율"이다.
2. **API 기준선이 싸고, 더 싸지고 있다.** 에이전트형 부하(출력 1토큰당 입력 30토큰, 캐시 적중 90%)로 환산하면 출력 1M당 실비용은 K2.5 $7.1–9.4, DeepSeek V3.2 $4.67, DeepSeek V4-Pro 공식 비피크 $4.55다. 이 중 가장 싼 쪽과 맞서려면 8× PRO 6000 서버 가동률이 약 70%를 넘어야 한다. 그리고 **Moonshot은 K2 계열을 2026-10-31부터 신규 사용자에게 막았고 2026년 12월 말까지 전부 종료할 예정**이다. K2.5를 계속 쓰려면 제3자 호스팅이나 자체 호스팅밖에 남지 않는다.
3. **RTX 4090(개조 48GB 포함)은 상용 서빙 후보에서 빼는 것이 맞다.** 근거는 세 가지다. ① GeForce 드라이버 라이선스 2.8조 "not licensed for datacenter deployment"와 2.7조 "commercial hosting services" 금지 ② NVIDIA 직원이 4090 P2P 미지원을 확인했고, GPUDirect RDMA 문서는 지원 대상을 Tesla·Quadro로만 적고 있음 ③ 경제성도 나쁘다. 카드당 $4,000을 가정해도 손익분기 가동률이 56%이고, 가동률 50%에서 버틸 수 있는 카드값 상한은 약 $3,000이다. 전력도 PRO 6000 대비 같은 처리량에 약 3배를 쓴다.
4. **RTX PRO 6000은 NVLink가 없다(Lenovo 사양 "No").** NVIDIA 제품 문서 어디에도 PRO 6000의 GPUDirect RDMA나 P2P 지원이 명시돼 있지 않다. 다만 NVIDIA 자체 RTX PRO Server 설계는 ConnectX-8 SuperNIC 안의 PCIe Gen6 스위치로 GPU 2장당 NIC 1개를 붙이고, AI Factory 레퍼런스는 노드당 BlueField-3 SuperNIC 4개를 쓴다. RDMA 경로를 전제로 한 설계라는 정황은 강하지만 문서상 확인된 사실은 아니다. **구매 전에 실기에서 `nvidia-smi topo -m`, NCCL all-reduce, `ib_write_bw --use_cuda`로 확인할 항목**이다. 1노드 TP8로 끝나는 Kimi K2.5 INT4는 노드 간 RDMA가 없어도 돌아간다. DeepSeek FP8(16장 필요)은 2노드에 걸쳐야 해서 RDMA 여부가 바로 성능에 걸린다.
5. **에이전트 부하에서는 전기요금보다 비캐시 프리필이 단가를 좌우한다.** 전기를 150원에서 250원/kWh로 바꿔도 PRO 6000 단가는 $6.02에서 $6.70으로 약 10%만 움직인다. 반면 캐시 적중이 90%에서 70%로 떨어지면 같은 서버가 감당할 수 있는 capex 상한이 $199k에서 $163k로 줄어든다. 디코드 처리량을 900에서 1,500 tok/s로 올리면 상한이 $294k로 뛴다. **900 tok/s라는 커뮤니티 수치를 자체 부하로 재측정하는 것이 가격 협상보다 먼저다.**

---

## A. 가격 스냅샷 (참고만. 스크립트에서는 입력 파라미터)

| 품목 | 값 | 출처 / 확인일 | 비고 |
|---|---|---|---|
| RTX PRO 6000 Blackwell (NVIDIA 공시가 인상) | $13,250 | Tom's Hardware, https://www.tomshardware.com/pc-components/gpus/nvidia-raises-rtx-pro-6000-blackwell-gpu-pricing-to-usd13-250-55-percent-increase-over-msrp-in-a-years-time (2026-11-03 확인. 본문은 잘려 제목만 확인. 검색 요약상 2026년 6월 기사) | [SNAP] 출시가 대비 +55%라는 제목 |
| PRO 6000 Server Edition, eBay 최저 3건 평균 | 2026-10: $22,945 (일별 $21,666–23,332). 2026-07: $13,794 | https://gpupoet.com/gpu/learn/price/october-2026/nvidia-rtx-pro-6000-blackwell-server (2026-11-03) | [SNAP] 3개월 새 약 +66% |
| PRO 6000 Workstation Edition, eBay 동일 기준 | 2026-10: $17,278 (일별 $16,325–18,636), 3개월 전 대비 +26.5% | https://gpupoet.com/gpu/learn/price/october-2026/nvidia-rtx-pro-6000-blackwell-workstation (2026-11-03) | [SNAP] |
| PRO 6000 Max-Q | 미조사 | — | 범위 변경으로 생략 |
| RTX 4090 24GB, eBay 동일 기준 | 2026-10: $3,196 (일별 $2,997–3,489) | https://gpupoet.com/gpu/learn/price/october-2026/nvidia-geforce-rtx-4090 (2026-11-03) | [SNAP] 신품·중고 구분 없음 |
| 4090 개조 48GB | eBay 낙찰 $4,500 (2026-06-05). 중국 판매가 약 $2,900–3,400 | 검색 요약에서만 확인(eBay item 147341830033, tweaktown 104127). 원문은 열지 않음 | [SNAP] 2차 출처 |
| HGX H200 8-GPU 신품 노드 | 약 $340k (2026-10). HGX B200 $360–470k | AMCompute, 검색 요약에서만 확인(https://www.amcompute.com/gpu-server-values/h200) | [SNAP] 2차 출처, 원문 미확인 |
| 한국(다나와·컴퓨존) 가격 | 미조사 | — | 범위 변경으로 생략 |

## B. 서버 구성과 PCIe 토폴로지 (가격 무관 사실)

### B-1. RTX PRO 6000 Blackwell Server Edition 카드

- 최대 보드 전력 600W. 밀도를 높이려면 450W로 제한할 수 있고, 2026-07-28에 450W 슬롯 제한 SKU가 추가됐다. 96GB GDDR7, 512-bit, 1,597GB/s. FP4 4 PFLOPS, FP8 2 PFLOPS(피크). MIG 최대 4개(24GB씩). **NVLink 지원: No.** vGPU(vPC/vApps/vWS) 지원. [SRC] Lenovo Press LP2263, https://lenovopress.lenovo.com/lp2263-thinksystem-nvidia-rtx-pro-6000-blackwell-server-edition-pcie-gen5-gpu (2026-11-03). 이 페이지에는 GPUDirect RDMA·P2P 언급이 없다.

### B-2. NVIDIA RTX PRO Server(MGX) 레퍼런스: ConnectX-8 내장 PCIe 스위치

- ConnectX-8 SuperNIC은 PCIe Gen6 스위치 48레인과 800Gb/s 네트워킹을 한 장치에 넣었고, 별도 PCIe 스위치가 필요 없다고 설명한다("eliminates the need for discrete PCIe switches"). 기존 설계는 PCIe 스위치 2–4개가 필요했다. GPU:NIC 2:1, GPU당 네트워크 최대 400Gb/s, GPU당 GPU↔NIC 50GB/s, 같은 스위치 아래 GPU 간 전송은 Gen6에서 Gen5 대비 2배, NCCL all-to-all 최대 2배(조건 미공개 벤더 주장). GPUDirect RDMA는 언급하지 않는다. [SRC] NVIDIA Developer Blog, 2025-05-18, https://developer.nvidia.com/blog/nvidia-connectx-8-supernics-advance-ai-platform-architecture-with-pcie-gen6-connectivity (2026-11-03)
  - 2:1 비율로 보면 GPU 8장에 ConnectX-8 4개다. 이는 계산으로 얻은 값이다. Exxact·Gigabyte 자료(검색 요약)도 "4개의 ConnectX-8 + 48레인 PCIe 6.0 스위치를 단 8-GPU 백플레인"이라고 적고 있다.
- **NVIDIA RTX PRO AI Factory 엔터프라이즈 레퍼런스 아키텍처(노드당)**: RTX PRO 6000 Server Edition 8장(768GB), 2소켓, 소켓당 물리 코어 48개 이상 권장, 시스템 메모리는 GPU당 128GB 이상(1TB 이상). 컴퓨트 패브릭은 BlueField-3 B3140H SuperNIC 4개(각 1×400G), 관리·스토리지용 BlueField-3 B3220 DPU 1개(2×200G). 스위치는 SN5610(컴퓨트 코어 2대), SN2201(OOB). 16노드와 32노드 사이징 표가 있다. 노드 전력은 이 페이지에 없다. [SRC] https://docs.nvidia.com/enterprise-reference-architectures/rtx-pro-ai-factory/latest/appendix.html (2026-11-03)
  - 이 RA는 ConnectX-8 스위치 보드 대신 BF-3 SuperNIC 4개를 쓴다. 두 설계 모두 GPU 2장당 400G NIC 1개라는 비율은 같다.
- iThome 보도(검색 요약)에 따르면 일부 벤더는 ConnectX-8이 아닌 다른 회사의 PCIe 스위치 보드로 RTX PRO 서버를 출하했다. **견적을 받을 때 스위치 보드 품목을 따로 확인해야 한다.**

### B-3. 구체 모델

| 모델 | CPU | GPU / 슬롯 | CPU-GPU 연결 | NIC | 전원 | 출처 |
|---|---|---|---|---|---|---|
| Supermicro **SYS-522GA-NRT** (5U) | 2× Xeon 6900(P-core, 최대 500W, LGA-7529) | DW GPU 최대 8장 또는 SW 10장. PCIe 5.0 x16 FHFL 13슬롯(기본). PRO 6000/4500 Server Ed. 지원 | **PCIe 5.0 x16 스위치, dual-root**. NVLink 브리지 선택(PRO 6000에는 해당 없음) | 온보드 10GbE 2(X710-AT2) + 2(I350), AIOM 슬롯 | **2700W ×6 (4+2) Titanium** | [SRC] https://www.supermicro.com/en/products/system/gpu/5u/sys-522ga-nrt (2026-11-03). PCIe 스위치 칩 모델(Broadcom PEX890xx 여부)은 페이지에 없음 |
| Supermicro **SYS-422GL-NR** (4U, MGX) | 2× Xeon 6900 | 8× PCIe 5.0 x16 DW(GPU) + 4× PCIe 5.0 x16 HHHL(NIC) + CPU 직결 x16 1개(NIC/DPU) | dual-root | 1GbE BMC만 온보드 | 3200W ×4 (3+1) Titanium | 검색 요약(Supermicro 페이지). 원문 미확인 |
| Supermicro **SYS-422GL-FNR2** (4U, MGX) | 2× Xeon 6900 | 8× **PCIe 6.0** x16 DW + 2× PCIe 5.0 x16 FHHL | **NVIDIA ConnectX-8 PCIe 스위치 보드** | CX8 내장 | — | 검색 요약. 원문 미확인. RTX PRO Server(CX8) 레퍼런스에 해당하는 Supermicro 모델로 보임 |
| Supermicro **AS-5126GS-TNRT** (5U) | 2× EPYC 9555(64C) 예시 구성 | PRO 6000 8장 | 페이지에 미기재 | 예시 구성 ConnectX-6 Dx 2×100GbE | 2700W ×6 | [SRC] https://www.server-parts.eu/post/supermicro-as-5126gs-tnrt-8-gpu-rtx-pro-6000-blackwell-server (2026-11-03, 리셀러 페이지) |
| Gigabyte **XL44-SX2-AAS1** (4U 공랭) / **XLS4-SX2-LAS1** (6U 수랭) | 2× Xeon 6 | PRO 6000 Server Ed. 8장 | ConnectX-8 SuperNIC 스위치 보드, PCIe Gen6 | 8× QSFP 400Gb/s(GPU 네트워킹) + BlueField-3 1개 | — | 검색 요약. **gigabyte.com은 403으로 열리지 않음** |
| Supermicro AS-4125GS-TNRT | 2× EPYC 9004/9005 | 4U, 8 DW GPU | (미확인) | — | — | 검색 요약. PRO 6000 8장 구성은 보통 5U AS-5126GS로 안내됨 |

ASUS, Dell, Lenovo(SR680a/SR650a V4), HPE의 RTX PRO 서버는 범위 변경 뒤 조사하지 않았다.

**구성 판단(추정)**: Kimi K2.5 INT4를 한 노드 TP8로 돌리는 경우, GPU 간 all-reduce가 PCIe 스위치 안에서 끝나는 single-switch(또는 CX8 보드) 구성이 dual-root(소켓 사이 UPI 경유)보다 유리하다. 이 경우 GPUDirect RDMA 문서가 말하는 "PCIe switch only = 최적" 토폴로지가 노드 안 GPU 간 P2P에도 똑같이 적용된다.

## C. GPUDirect RDMA / P2P

| 항목 | 사실 | 출처 |
|---|---|---|
| GPUDirect RDMA 공식 지원 범위 | "GPUDirect RDMA is available on both Tesla and Quadro GPUs." GeForce는 언급 없음. 두 장치가 같은 PCIe root complex 아래 있어야 하고, PCIe 스위치만 거치는 경로가 최적이며, CPU 간(QPI/UPI) 경로는 "may perform very poorly or not work reliably". IOMMU는 끄거나 passthrough로 둔다 | [SRC] https://docs.nvidia.com/cuda/gpudirect-rdma/index.html (2026-11-03) |
| RTX PRO 6000 Blackwell의 RDMA | **NVIDIA 공식 확인 없음.** 개발자 포럼에 "문서상 불분명"하다는 질문(2025-09-15, 2025-10-06)이 있으나 직원 답변은 없다. RTX PRO는 Quadro 계보라 위 문구에 들어간다고 해석할 수는 있다(해석). 클라우드 사업자 Latitude.sh는 PRO 6000 인스턴스에 GPUDirect RDMA를 광고한다(마케팅) | https://forums.developer.nvidia.com/t/gpudirect-rdma-on-nvidia-rtx-pro-6000-blackwell-max-q/345031 (2026-11-03) |
| RTX PRO 6000의 P2P | 포럼에 "should be fine"(사용자, 2025-07-13) 정도만 있고 직원 답변은 없다. Server Edition이 PCIe ATS를 광고하지 않아 ESXi의 P2P 경로가 막힌다는 보고가 있다(2026-03-02, 직원 답변 없음). | https://forums.developer.nvidia.com/t/can-2-blackwell-workstation-cards-6000-pro-peer-to-peer-in-linux/338905 , https://forums.developer.nvidia.com/t/rtx-pro-6000-blackwell-does-not-advertise-pcie-ats-blocking-esxis-p2p-path/362222 (2026-11-03) |
| RTX 4090의 P2P | NVIDIA 포럼 스레드 "Standard nVidia CUDA tests fail with dual RTX 4090 Linux box"에서 모더레이터가 엔지니어링 답변으로 "Peer to Peer is not supported on 4090"을 전했다. Tom's Hardware도 "Nvidia confirms GeForce cards lack P2P support"로 보도했다 | 검색 요약. https://forums.developer.nvidia.com/t/standard-nvidia-cuda-tests-fail-with-dual-rtx-4090-linux-box/233202/16 , https://www.tomshardware.com/news/nvidia-confirms-geforce-cards-lack-p2p-support (원문은 열지 않음) |
| tinygrad P2P 드라이버 | tinygrad/open-gpu-kernel-modules, 브랜치 `565.57.01-p2p`, 설명 "NVIDIA Linux open GPU with P2P support". 호환 표에 RTX 4090(2684), 4090 D(2685)가 있다. README 자체에는 P2P 설명이 없다. 같은 버전의 user-space 드라이버와 짝을 맞춰야 한다. 포크(aikitoria) README에 따르면 Resizable BAR(대형 BAR1), IOMMU passthrough, ACS 비활성화가 필요하다 | [SRC] https://github.com/tinygrad/open-gpu-kernel-modules (2026-11-03). 포크는 검색 요약 |
| 4090의 GPUDirect RDMA | 공식 문서의 지원 대상(Tesla/Quadro)에 들어 있지 않다. tinygrad 패치는 GPU 간 P2P용이고 NIC↔GPU RDMA를 보장하지 않는다(해석) | 위 문서 |

**운영 함의**: 4090 클러스터에서 한 복제본이 16장(2노드)에 걸치면 노드 간 PP 트래픽이 호스트 메모리를 거친다(RDMA 없음). 노드 안에서도 TP가 비공식 패치 드라이버에 묶인다. 드라이버를 올릴 때마다 패치 브랜치를 다시 맞춰야 하는 운영 부담이 생긴다.

## D. GeForce 드라이버 라이선스

[SRC] NVIDIA "License For Customer Use of NVIDIA GeForce Software", **v. February 25, 2025**, https://www.nvidia.com/en-us/drivers/geforce-license/ (2026-11-03 확인). 도구 제약으로 125자 이내 인용만 가능해서 핵심 문구만 옮긴다.

- 정의: "the NVIDIA driver, and any additional software and materials provided (the “SOFTWARE”)"
- **2.7조**: "you may not sell, rent, sublicense, distribute or transfer the SOFTWARE" 그리고 SOFTWARE로 **commercial hosting services**를 제공하는 것을 금지한다.
- **2.8조**: GeForce/Titan SOFTWARE는 "is licensed for use only on GeForce or Titan hardware products you own" 이며 "**is not licensed for datacenter deployment**."
- 2017년판에 있던 "except that blockchain processing in a datacenter is permitted" 예외 문구는 이번 확인에서 나타나지 않았다(2018년 보도: DatacenterDynamics, Phoronix).
- **개조 48GB 4090에의 적용**: 라이선스에는 하드웨어 개조 조항이 없다. 대신 2.1조가 사용 대상을 NVIDIA가 설계·판매한 GPU로 한정한다. 개조 카드도 GPU는 GeForce AD102이고 GeForce 드라이버로 구동되므로 2.7·2.8조가 그대로 적용된다고 봐야 한다(해석). 개조품이라 이 조항을 피할 근거는 없고, 2.1조 범위 논쟁이라는 리스크가 하나 더 붙는다. "datacenter deployment"의 정의는 없다(Phoronix 2017 지적). 그래도 유료 LLM 플랫폼을 Kubernetes 클러스터에서 외부 고객에게 제공하는 것은 2.7조 "commercial hosting services"에 직접 걸린다. **법무 검토 전에는 상용 서빙에 쓰지 않는 것이 맞다.** 사내 R&D나 개발용은 별도로 판단한다.
- 참고: 시험 장비로 4090(49,140MiB, 개조 48GB)을 쓴다.

## E. 대안 기준선: API와 임대

### E-1. API 단가 (USD / 1M 토큰) [SRC]

OpenRouter 공개 API `/api/v1/models/<id>/endpoints`, **2026-11-02 16:47 UTC** 수집(원자료 `raw/`). 제공사별 정가이며 캐시 읽기 단가 포함.

| 모델 | 제공사(양자화) | 입력 | 캐시 입력 | 출력 |
|---|---|---|---|---|
| Kimi K2.5 | AtlasCloud (int4) | 0.49 | 0.20 | 2.50 |
| | SiliconFlow (int4) | 0.50 | 0.15 | 2.50 |
| | Novita | 0.57 | 0.095 | 2.85 |
| | Venice | 0.532 | 0.209 | 3.325 |
| | Amazon Bedrock | 0.60 | (미표기) | 3.00 |
| Kimi K2.6 | Moonshot AI | 0.95 | 0.16 | 4.00 |
| | 최저 Baidu (fp4) / Chutes (int4) | 0.39 | 0.066 / 0.039 | 1.64 / 1.80 |
| Kimi K3 (1M ctx) | Moonshot AI | 3.00 | 0.30 | 15.00 |
| DeepSeek V3.2 | DeepInfra (fp4) / AtlasCloud (fp8) | 0.26 | 0.13 | 0.38 |
| | GMICloud (fp8) | 0.209 | 0.022 | 0.31 |
| DeepSeek V3.1 | DeepInfra (fp4) | 0.25 | 0.13 | 0.95 |
| DeepSeek R1-0528 | DeepInfra (fp4) / SiliconFlow (fp8) | 0.50 | 0.35 / – | 2.15 / 2.18 |

DeepSeek 공식 [SRC] https://api-docs.deepseek.com/quick_start/pricing (2026-11-03): 공식 API에는 **V3/R1이 더 이상 없고** V4 계열만 있다.
- deepseek-v4-pro(V4-Pro-0813): 캐시 적중 $0.044 / 미적중 $1.32 / 출력 $3.96 (피크). 비피크는 절반($0.022/$0.66/$1.98).
- deepseek-flash(V4.1-Flash-1017): $0.006/$0.30/$1.20 (피크), 비피크 절반.
- 피크 시간: 평일 01–04, 06–10 UTC(중국 공휴일 제외). 그 밖의 시간은 모두 비피크다.

Moonshot 공식 [SRC] https://platform.kimi.ai/docs/pricing/chat (2026-11-03): 가격표 셀이 비어 있어 단가는 확인하지 못했다. 확인한 사항은 다음과 같다.
- **K2 계열은 2026-10-31부터 신규 사용자 접근 불가, 2026년 12월 말까지 전부 종료 예정.**
- 컨텍스트 캐싱이 자동 적용된다(기본 TTL 5분). K3는 캐시 쓰기를 TTL별로 따로 과금한다.
- K3·K3.1-pro의 Batch API는 정가의 60%다.

### E-2. 클라우드 GPU 임대 (USD / GPU·시간) [SRC]

| 사업자 | PRO 6000 | H200 | B200 | 4090 | 출처 |
|---|---|---|---|---|---|
| RunPod (Community / Secure, on-demand) | 1.69 / 2.49 | 3.59 / 5.29 | 5.98 / 7.99 | 0.34 / 0.89 | https://www.runpod.io/pricing (2026-11-03) |
| Lambda (8x on-demand) | – | – | 6.69 | – | https://lambda.ai/pricing (2026-11-03). H100 SXM $3.99. 1-Click Cluster B200 $8.87–9.86 |

Vast.ai, CoreWeave, 국내 클라우드는 범위 변경 뒤 조사하지 않았다. 참고로 RunPod Secure 기준 8× PRO 6000을 연중 상시 빌리면 2.49×8×8760 = **연 $174.5k**다. 같은 처리량이면 임대는 자체 호스팅(capex $151k + opex $16.8k/년)보다 3년 기준 훨씬 비싸다. 임대는 처리량 검증용 단기 PoC에만 쓰는 것이 맞다(계산).

## F. 한국 운영비

| 항목 | 값 | 출처 |
|---|---|---|
| 산업용(을) 평균 단가 | **182.7원/kWh** (2024-10-24 인상, +16.9원·+10.2%). 산업용(갑) 173.3원 | 서울신문·뉴시스 2024-10-23/24 (검색 요약), https://m.seoul.co.kr/news/2024/10/24/20241024010001 |
| 연료비조정단가 | +5원/kWh(상한), 2026년 3분기 유지. 2022년 3분기 이후 계속 같음 | [SRC] Korea Times 2026-06-22, https://www.koreatimes.co.kr/economy/20260622/kepco-to-keep-electricity-rates-frozen-for-q3 |
| 2026-04-16 산업용(을) 계시별 개편 | 평일 11–12시·13–15시를 최대부하에서 중간부하로, 18–21시를 중간부하에서 최대부하로 변경. 봄·가을 주말·공휴일 낮 50% 할인. 여름 최대부하 −16.9원, 경부하 +5.1원 | [SRC] 해줌 블로그 https://blog.haezoom.com/insight_re100_23/ , 아시아경제 https://www.asiae.co.kr/en/article/2026041507351225754 (2026-11-03). **개편 후 단가표는 이미지라 숫자를 읽지 못함** |
| KEPCO 사이버지점 요금표 | 페이지에 2023-05-16 시행표만 보인다. 예: 산업용(을) 고압A 선택II 기본 8,320원/kW, 경부하 87.3–94.3원, 중간 109.8–140.4원, 최대 140.5–222.3원. 2023-11·2024-10 인상분이 반영되지 않은 오래된 표다 | https://cyber.kepco.co.kr/ckepco/front/jsp/CY/E/E/CYEEHP00203.jsp (2026-11-03) |
| 모델 입력값 | **200원/kWh** [EST] = 182.7 + 연료비 5 + 기후환경·전력기금 등 약 12. 24시간 평탄 부하라서 경부하 비중이 높다. 민감도 150–250 |
| 코로케이션 | 국내 공개 단가는 찾지 못했다. 미국 참고치 kW당 월 $150–300(cyfuture), 250–500kW 계약 약 $196/kW·월(encoradvisors 2025 하반기). 둘 다 검색 요약 | 자체 시설이면 0으로 두고 코로 시나리오만 파라미터로 둔다 |
| PUE | 1.4 [EST] (소규모 공랭 기준 1.2–1.6) | — |

## G. TCO 모델 결과

입력(전부 `tco_model.py` 상단): 3년, 1,400원/$ [EST], 200원/kWh, PUE 1.4, 유지보수 연 5%(인건비 제외), 에이전트 부하 = **출력 1 : 입력 30, 캐시 적중 90%**. 기준 API는 Kimi K2.5 SiliconFlow($0.50/$0.15/$2.50) = **출력 1M당 $8.05**.

처리량 모델: 1M 출력에 걸리는 시간 = 1e6/디코드 tok/s + (비캐시 입력 토큰)/프리필 tok/s. 둘을 직렬로 더해서 보수적으로 잡았고, 캐시된 프리픽스는 비용 0으로 봤다.

| 구성 | GPU | capex(자리표시자) | IT kW | 연 opex | 실효 출력 tok/s | 처리량 가정 |
|---|---|---|---|---|---|---|
| i) 8× PRO 6000, 1서버 | 8 | $151k (카드 $13,250 [SNAP] + 본체 $40k + 망 $5k [EST]) | 5.3 | $16.8k | 673 | 디코드 900 (커뮤니티 보고, 사용자 입력) / 프리필 8,000 [EST] |
| ii) 16× PRO 6000, 2서버(복제본 2) | 16 | $307k | 10.9 | $34.4k | 1,346 | ×2 [EST] |
| iii-a) 32× 4090-48G, 4서버(복제본 2) | 32 | $212k (카드 $4,000 [SNAP]) | 16.5 | $39.6k | 769 | 16장 1복제본 = PRO 6000 복제본의 0.6배 [EST, 0.3–0.9] |
| iii-b) 48× 4090-48G, 6서버(복제본 3) | 48 | $318k | 24.8 | $59.3k | 1,153 | 동일 |
| iv) HGX 8×H200 | 8 | $350k ($340k [SNAP] + 망) | 8.2 | $31.8k | 2,772 | 디코드 3,500 / 프리필 40,000 [EST] (근거 약함, 2,000–6,000으로 변동) |

### G-1. 출력 1M당 자체 호스팅 단가(USD)와 손익분기 가동률 (기준 API $8.05)

| 구성 | 10% | 20% | 30% | 50% | 70% | 90% | 손익분기 |
|---|---|---|---|---|---|---|---|
| i) 8× PRO 6000 | 31.64 | 15.82 | 10.55 | 6.33 | 4.52 | 3.52 | **39%** |
| ii) 16× PRO 6000 | 32.21 | 16.11 | 10.74 | 6.44 | 4.60 | 3.58 | 40% |
| iii-a) 32× 4090-48G | 45.48 | 22.74 | 15.16 | 9.10 | 6.50 | 5.05 | 56% |
| iii-b) 48× 4090-48G | 45.45 | 22.73 | 15.15 | 9.09 | 6.49 | 5.05 | 56% |
| iv) 8× H200 | 16.98 | 8.49 | 5.66 | 3.40 | 2.43 | 1.89 | 21% |

### G-2. 역산: API와 같아지는 최대 capex

시스템 총액(USD):

| 구성 | 10% | 20% | 30% | 50% | 70% | 90% |
|---|---|---|---|---|---|---|
| i) 8× PRO 6000 | 20k | 65k | 110k | **199k** | 288k | 377k |
| ii) 16× PRO 6000 | 39k | 129k | 218k | 396k | 574k | 752k |
| iii-a) 32× 4090-48G | <0 | 26k | 77k | 179k | 281k | 383k |
| iii-b) 48× 4090-48G | <0 | 40k | 116k | 269k | 421k | 574k |
| iv) 8× H200 | 146k | 330k | 513k | 881k | 1.25M | 1.62M |

GPU 1장당 최대 가격(본체·망 자리표시자를 뺀 값):

| 구성 | 20% | 30% | 50% | 70% | 90% |
|---|---|---|---|---|---|
| PRO 6000 (본체 $40k 기준) | $2.5k | $8.1k | **$19.2k** | $30.4k | $41.5k |
| 4090-48G (본체 $15k/서버 기준) | <0 | <0 | **$3.0k** | $6.1k | $9.3k |

읽는 법: "가동률 50%에서 PRO 6000 카드가 장당 $19.2k 이하이면 자체 호스팅이 K2.5 최저가 API를 이긴다." eBay 10월 Server Edition 시세 $22.9k를 넣으면 약 57%, NVIDIA 공시가 $13.25k를 넣으면 39%가 필요하다. H200은 처리량 가정이 맞을 때만 의미가 있다. 디코드 3,500 tok/s는 근거가 약한 추정이라 실측 전에는 비교에 쓰지 않는다.

### G-3. 민감도 (구성 i, 가동률 50%에서 최대 시스템 capex)

| 디코드 tok/s | 입력10·적중80% | 입력30·적중90% | 입력30·적중70% | 입력100·적중95% |
|---|---|---|---|---|
| 400 | 46k | 91k | 91k | 229k |
| 600 | 77k | 138k | 125k | 321k |
| **900** | 118k | **199k** | 163k | 432k |
| 1,500 | 187k | 294k | 209k | 589k |
| 2,500 | 273k | 403k | 250k | 748k |

입력 비중이 커질수록 API 쪽 입력 과금이 쌓여서 자체 호스팅이 유리해진다. 다만 그건 프리필 8,000 tok/s 가정이 맞을 때 이야기다. 프리필 실측이 함께 필요하다.

전기·PUE 민감도(구성 i, 50%): 150원이면 $6.02–6.20, 250원이면 $6.39–6.70. 단가의 약 10% 범위라 결정 변수가 아니다.

다른 API와 비교(입력 30·적중 90%): DeepSeek V4-Pro 공식 비피크 $4.55, V3.2 DeepInfra $4.67. 구성 i가 이 수준을 이기려면 가동률이 약 70% 이상이어야 한다(G-1의 70% 칸 $4.52).

### G-4. 모델당 GPU 수 (가격을 바꿔 넣을 때 쓰는 비율)

조건: 가중치 ≤ 총 VRAM의 85%(KV 여유 15% [EST]), 2의 거듭제곱 장수. 괄호는 총 VRAM / KV 여유 GB.

| 모델(가중치 [EST]) | PRO 6000 96GB | 4090 48GB 개조 | 4090 24GB | H200 141GB | B200 180GB |
|---|---|---|---|---|---|
| Kimi K2.5 INT4 (~600GB) | **8** (768/168) | **16** (768/168) | **32** (768/168) | 8 (1128/528) | 4 (720/120) |
| DeepSeek V3/R1 FP8 (~690GB) | 16 | 32 | 64 | 8 | 8 |
| DeepSeek V3/R1 4-bit (~380GB) | 8 | 16 | 32 | 4 | 4 |

환산 규칙: VRAM 기준으로 PRO 6000 1장 = 4090-48G 2장 = 4090-24G 4장. 연산과 통신 성능까지 같다는 뜻은 아니다. 4090은 FP4가 없고(Ada, FP8까지), 메모리 대역폭은 1,008GB/s로 PRO 6000의 1,597GB/s보다 낮고, 공식 P2P가 없으며, 16장이 2노드에 걸친다. 4090-24GB로 K2.5를 돌리면 1복제본에 32장, 서버 4대가 필요하다. 사실상 비현실적이다.

## H. 결정에 중요한 발견 5가지

1. **가동률이 핵심 변수다.** 8× PRO 6000 한 대는 가동률 39–57%(카드값 $13k–23k)가 손익분기다. 에이전트 플랫폼 초기 트래픽으로 동시성 100을 하루 절반 이상 채울 수 있는지부터 확인해야 한다. 그게 안 되면 API나 임대가 낫다.
2. **K2.5 API 공급이 바뀌는 중이다.** Moonshot은 K2 계열을 2026년 말에 종료한다. OpenRouter에는 아직 K2.5 제3자 제공사 5곳이 있다($0.49–0.60 / 캐시 $0.095–0.20 / $2.50–3.00). 모델 고정(재현성, 사내 데이터)이 필요하면 자체 호스팅의 전략적 가치가 커진다. 단순 단가만 보면 V4-Pro 비피크나 V3.2가 더 싸다.
3. **4090 경로는 법적·기술적·경제적으로 모두 열위다.** EULA 2.7·2.8조, 공식 P2P·RDMA 없음, 손익분기 56%, 전력 3배.
4. **PRO 6000 다노드(16장 이상) 구성은 RDMA 실검증이 먼저다.** NVIDIA 문서에 PRO 6000 GPUDirect RDMA 명시가 없다. CX8 스위치 보드(예: SYS-422GL-FNR2, Gigabyte XL44)인지, PEX 스위치 dual-root(SYS-522GA-NRT)인지에 따라 노드 내외 통신 경로가 달라진다. K2.5 INT4는 1노드로 충분하므로, 첫 구매를 1노드로 시작하면 이 리스크를 미룰 수 있다.
5. **900 tok/s 한 숫자에 결론이 걸려 있다.** 디코드 900→1,500 tok/s면 허용 capex가 +48%, 캐시 적중 90%→70%면 −18%다. 구매 전에 RunPod PRO 6000 8장(약 $20/시간)으로 실제 에이전트 트레이스를 재생해 디코드·프리필·캐시 적중을 측정하면, 수십 달러로 이 표의 불확실성 대부분을 걷어낼 수 있다.

## I. 열지 못했거나 확인하지 못한 페이지

- gigabyte.com 제품 페이지(XL44-SX2-AAS1 등): HTTP 403. 검색 요약만 사용
- esaitech.com PRO 6000 페이지: HTTP 429
- Tom's Hardware $13,250 기사: 본문이 잘려 제목만 확인
- platform.kimi.ai 가격표: 셀이 비어 있어 K2.5·K3 공식 단가 미확인(OpenRouter의 Moonshot 엔드포인트 값으로 대체)
- KEPCO 사이버지점: 2023-05-16 표까지만 노출. 2026-04-16 개편 단가표는 해줌 블로그 이미지로만 존재
- 국내 코로케이션 단가: 공개 자료 없음
- NVIDIA RTX PRO 6000 공식 데이터시트, Supermicro SYS-422GL-FNR2·AS-4125GS 원문, 4090 P2P 포럼 원문, AMCompute 원문: 열지 않음(검색 요약만 사용)
- 범위 변경으로 생략: 다나와·컴퓨존, Max-Q 가격, ConnectX-7/8·BlueField-3·SN5600·Arista·Quantum-2·광모듈 가격, Vast.ai·CoreWeave·국내 클라우드 임대가, ASUS·Dell·Lenovo·HPE 서버
