# D1-hw-gpu 감사 원장
확인일: 2026-10-09. 글 9편. 열어 본 URL 117개(성공 107 / 실패 10).

대상 글(route는 `gpu/` 아래에 등록됨): `gpu/ai-infrastructure-b300-128-blueprint`, `gpu/ai-cluster-software-compatibility`, `gpu/kubernetes-vs-slurm-gpu-scheduling`, `gpu/ai-cluster-storage-io`, `gpu/b300-rack-power-cooling`, `gpu/ai-infrastructure-commissioning-acceptance`, `gpu/nvidia-nca-aiio-study-guide`, `gpu/amd-gpu-execution-and-hip`, `gpu/hbm-stack-and-memory-requests`.

본문 위치: hw 7편은 `src/pages/articles/hw/ai-infrastructure-study/{data.ts,depthData.ts,ncaAiioData.ts,ncaAiioDepth.ts}`, gpu 2편은 각 `.tsx` 본문 + `gpu-execution-sources/{codeRefs.ts,provenance.json,codebase/}`. 카탈로그 `src/content/gpu/articlesHw.ts`·`src/content/gpu/index.ts`, 근거 `src/content/article-evidence.ts`, 학습 계약 `src/content/article-learning.ts`, 개념 정의 `src/content/knowledge-graph.ts`를 함께 읽었다. NCA-AIIO의 50문항/60분/$125/2년/38-40-22%는 지시대로 재검증하지 않았다(참고로 공식 페이지에서 동일하게 보였다).

## 적용 결과
적용일 2026-10-09. 본문 파일은 `data.ts`·`depthData.ts`·`ncaAiioData.ts`·`ncaAiioDepth.ts`(hw/ai-infrastructure-study)와 `gpu/amd-gpu-execution-and-hip.tsx`를 고쳤다. 공용 파일은 손대지 않고 아래 `## 공용 파일 수정 목록`에 올렸다.

| # | 처리 | 내용 |
|---|---|---|
| 1 | 적용 + 공용파일 목록으로 이관 | `data.ts` 커미셔닝 sources·`depthData.ts` 커미셔닝 sources의 href를 `https://www.kisa.or.kr/1050603`로, excerpt를 KISA 원문 정의 문장으로 교체하고 note/claim에 DNS 실패 사유 기록. `article-evidence.ts`·`article-learning.ts` 두 곳은 목록으로 이관 |
| 2 | 적용 | rack 실물 3 명령을 `/redfish/v1/Chassis/DGX/Sensors`·`.../GPU_SXM_<id>/EnvironmentMetrics`로 교체, body에 DMTF Power v1_7_0 deprecated(PowerSubsystem 대체) 설명, source location 수정, depth sources에 DMTF Power.json 추가 |
| 3 | 공용파일 목록으로 이관 | `article-evidence.ts` storage.html → nvidia-certified-storage.html, label 수정 |
| 4 | 적용 | rack 3절에 14.5/19kW가 25°C 공급 공기 기준 추정치라는 조건, 5절에 passive RDHx 비권장 원문, 9절에 operating 10–35°C·A2 최대 공급 30°C·권장 18–27°C·고도 조건 문단 추가, sources note 갱신 |
| 5 | 적용 | blueprint excerpt를 "This Enterprise RA is built on scalable units (SU) based on 4 compute nodes."로 교체 |
| 6 | 적용 | storage excerpt를 VFS 원문 PG_Dirty/PG_Writeback 문장으로 교체 |
| 7 | 적용 | SuperPOD claim을 실제 내용(64대 SU·power shelf)으로 축소, CDU·RDHx 표 출처를 DC Best Practices PDF claim으로 이동, 3절에 64-node SU 전력표(975/1450kVA, CDU+RDHx 51/117kVA) 문단 추가 |
| 8 | 적용 | mstflint href를 `web.archive.org/web/20250519105147/...` 사본으로, claim에 "원 주소 404, 사본 텍스트 추출 실패" 기록 |
| 9 | 적용 | cliolabs 출처 삭제(410 Gone, 사본 없음) |
| 10 | 공용파일 목록으로 이관 | SNIA 항목 note에 "자동 조회 불가(403), 내용 미재확인" 추가(직접 PDF 링크는 확인 못해 교체 보류) |
| 11 | 공용파일 목록으로 이관 | TAMU 항목 note에 접근 조건 기록 |
| 12 | 적용 + 공용파일 목록으로 이관 | depth TSMC claim에 403·Wayback 2026-09-11 사본 확인 문장 기록. evidence note는 목록으로 |
| 13 | 적용 + 공용파일 목록으로 이관 | depth 표 행에 "게시일 미재확인", source claim에 Cloudflare 403 기록. evidence note는 목록으로 |
| 14 | 적용 | `CACHETHROUGH` → `CACHE_THROUGH` 2곳 |
| 15 | 적용 | 호환성 표 행에 "DGX B300 2.3TB는 최소 DGX OS 7.3.1 필요" 기입(firmware 26.03.1은 원문 인용이 원장에 없어 넣지 않음) |
| 16 | 적용 | NCA 실물 1 location을 "dcgmi discovery -l 예시(dcgmi diag -r은 dcgmi diag 참조)"로 한정 |
| 17 | 적용 | NCA container 실물의 source를 install-guide로 바꾸고 location에 sample-workload 역할 병기 |
| 18 | 적용 | Ceph 실물 location 보강, depth sources에 Monitoring a Cluster(`ceph health detail` 확인)·ceph(8) man page(`ceph osd df {plain|tree}` 확인) 추가 — 적용 중 두 페이지를 직접 열어 확인 |
| 19 | 적용 | HIPIFY 문장을 원문 한계 문장 인용 + "inline PTX 명시 문장은 확인하지 못함"으로 바꾸고 문단 분리, citeKey 7 추가 |
| 20 | 적용 | rocWMMA 문장을 원문 인용 + "세대별 지원표 미확인"으로 바꾸고 문단 분리, citeKey 8 추가 |
| 21 | 적용 | blueprint 8절(data.ts)에 DGX B300 완제품은 BlueField-3 2장이라 16노드면 DPU 32개라는 문장 추가 |
| 22 | 적용 | rack 3절 "예상 평균" → "예상 시스템 전력", '평균'은 rack 표에만 붙는다는 설명 추가 |
| 23 | 적용 | NCA Study Guide note에 "Jan26 표기, 파일 2026-06-25 재저장" 기록 |
| 24 | 해당 없음(OK) | — |

집계: 적용 20건(#1·#12·#13은 공용 이관 병행), 공용 전용 이관 3건(#3·#10·#11), 보류 0건, OK 1건(#24). 공용 파일 수정 쌍 7개.

검증: `npm run audit:hw-cloud-teach` 통과(구조화 21편 + 레거시 15편, overview 전부 "(가정)" 시작). `npx eslint` 수정 파일 5개 통과. `check-article.sh gpu/<slug>` 7개 route 모두 learning contract·knowledge graph·naturalness·term 검사 통과, prose-readability strict 실패는 다른 글(claw-api-client 등) 플래그 때문이며 수정한 route는 플래그 없음(amd 글은 처음에 긴 문단 2건으로 걸려 문단을 나눠 해소).

## 요약
- 발견: WRONG 1 · OUTDATED 1 · MISLEADING 0 · CALC 0 · LINK 13 · MISSING 3 · UNVERIFIED 5
- 가장 중요한 발견
  1. `isms.kisa.or.kr`는 DNS 자체가 풀리지 않는다(`dig` 응답 없음, curl `Could not resolve host`). CSAP 인용 4곳(data.ts:646, depthData.ts:1316, article-evidence.ts:13690, article-learning.ts:156887)이 모두 죽은 호스트를 가리킨다. 후속 호스트 `isms-p.or.kr`에서도 같은 경로는 404. 정의 문장은 `https://www.kisa.or.kr/1050603`에서 확인됨.
  2. rack 글의 Redfish 관측 명령(depthData.ts:1143-1146)이 `/redfish/v1/Chassis/<id>/Power`·`/Thermal`을 쓰는데, DMTF Power 스키마는 v1_7_0에서 deprecated(`PowerSubsystem`로 대체)이고 인용한 DGX B300 Redfish 페이지는 `/redfish/v1/Chassis/DGX/Sensors`·`.../GPU_SXM_<id>/EnvironmentMetrics`만 보여 준다.
  3. 근거 링크 `hgx-ai-factory/latest/storage.html`(article-evidence.ts:13664)은 404. 실제 페이지는 `nvidia-certified-storage.html`(본문·depth가 쓰는 것과 동일).
  4. rack 글은 IMDA SS 697(26°C 이상)을 vendor envelope와 함께 판정하라고 쓰면서, 정작 인용한 NVIDIA PDF가 주는 B300 envelope 수치(inlet 10–35°C, ASHRAE A2 allowable up to 30°C for DGX B300, recommended 18–27°C)와 "Passive RDHx are not recommended"를 싣지 않았다(MISSING).
  5. `sources[].excerpt` 두 건이 원문 문장이 아니다: "4 nodes are the smallest NVIDIA HGX AI Factory building block"(data.ts:106; 원문 "built on scalable units (SU) based on 4 compute nodes")과 "Dirty and Writeback state are tracked in the address space"(data.ts:435; 원문 "This tree maintains information about the PG_Dirty and PG_Writeback status of each page").

수치·사양 주장은 전반적으로 정확했다. HGX B300 8 GPU·288GB·8 ConnectX-8·1 BlueField-3·2TB, DGX OS 7.6.0 표(580.178.04 / CUDA 13.0 U3 / NCCL 2.31.2 / DOCA OFED 3.2.3 / CX-8 40.47.3576 / toolkit 1.20.0, 2026-09-14), DC 14.5/19kW·AC 15/19.7kW·58/76kW·30/39.4kW·2145 CFM, 12.5Gb/s/GPU, GLM-5.3-Flash 320B/18B, 교육 모델 25,730,592/9,805,344/192, HIP warpSize 64(gfx9)/32(gfx10+), CDNA4 LDS 160KB(p.9)·CDNA3 64KB 32 banks(p.9)·288GB/8TB/s(p.3, p.11)·PID 2258402-C(10/1/2025), Synopsys HBM3 16×64-bit/32 PC·HBM4 32×64-bit/64 PC, CUDA cc 6.0+ 32-byte sector, dcgmi 226, NVSM 20분 등은 모두 1차 자료와 일치했다. 고정 스냅샷 두 파일은 upstream raw와 byte 단위로 동일했고 line 49/52/54–56 참조도 맞다. 모든 계산(128÷8, 128×288, 8GiB/s÷4MiB, Little, 2PB×0.8×0.8, 16×14.5/19, 유량 4.99/6.54/1.25/1.63kg/s, I≈110.8A, 16×4, 50×0.38/0.40/0.22, 768B/1.024TB/s, 64/768, 249개 원소, 2048/8=256GB/s… )은 검산 결과 맞다.

## 발견 (심각도 순)
| # | route | 위치(file:line) | 주장(원문 인용) | 판정 | 근거(URL + 인용문) | 제안 수정 |
|---|---|---|---|---|---|---|
| 1 | gpu/ai-infrastructure-commissioning-acceptance (+evidence, learning) | `data.ts:646`, `depthData.ts:1316`, `article-evidence.ts:13690`, `article-learning.ts:156887` | `href: "https://isms.kisa.or.kr/main/csap/notice/?boardId=bbs_0000000000000004&mode=list"` | LINK | `dig +short isms.kisa.or.kr` → 응답 없음; `curl -v https://isms.kisa.or.kr/` → "Could not resolve host: isms.kisa.or.kr"; Wayback `archive.org/wayback/available` → `archived_snapshots: {}`. 후속 호스트 `https://isms-p.or.kr/` 200이나 `/main/csap/notice/?boardId=...` 404. 제도 정의는 https://www.kisa.or.kr/1050603 : "클라우드컴퓨팅서비스 사업자가 제공하는 서비스에 대해 정보보호 기준의 준수여부를 평가․인증하는 제도", "이용자들이 안심하고 사용할 수 있도록 안전한 클라우드 환경 조성 지원" | 4곳의 href를 `https://www.kisa.or.kr/1050603`(KISA 공식) 또는 isms-p.or.kr의 현행 CSAP 경로로 교체. excerpt는 kisa.or.kr 원문으로 다시 붙일 것 |
| 2 | gpu/b300-rack-power-cooling | `depthData.ts:1139-1146` (실물 3 · 운영 telemetry) | `https://<bmc>/redfish/v1/Chassis/<chassis-id>/Power` / `.../Thermal` | OUTDATED | DMTF https://redfish.dmtf.org/schemas/v1/Power.json : "This schema has been deprecated in favor of the `PowerSubsystem` schema." (`versionDeprecated: v1_7_0`). 인용한 https://docs.nvidia.com/dgx/dgxb300-user-guide/redfish-api-supp.html 은 `/redfish/v1/Chassis/DGX/Sensors`, `/redfish/v1/Systems/HGX_Baseboard_0/Processors/GPU_SXM_<id>/EnvironmentMetrics`, `TelemetryService/MetricReportDefinitions/HGX_PlatformEnvironmentMetrics_0`를 보여 주고 `/Power`·`/Thermal`·`PowerSubsystem`은 없음 | 명령을 `/redfish/v1/Chassis/DGX/Sensors` 또는 `PowerSubsystem`/`ThermalSubsystem`(DSP2046 현행)로 바꾸고, "service root에서 링크를 찾아라"는 본문 문장과 맞춤 |
| 3 | gpu/ai-cluster-storage-io | `article-evidence.ts:13664` | `href: ".../hgx-ai-factory/latest/storage.html"`, label "Storage Architecture" | LINK | curl → `404`; Wayback 스냅샷 없음. 본문·depth가 쓰는 https://docs.nvidia.com/enterprise-reference-architectures/hgx-ai-factory/latest/nvidia-certified-storage.html 은 200이며 "As a guideline, the architecture allocates approximately 12.5 Gb/s per GPU, scaling linearly as the cluster grows—for example, a 16 GPU cluster would require around 200 Gb/s of aggregate storage bandwidth." | href를 `nvidia-certified-storage.html`로, label을 "NVIDIA-Certified Storage"로 수정 |
| 4 | gpu/b300-rack-power-cooling | `data.ts:505-506` (9절), `data.ts:489-490` (5절) | "이 기준을 이유로 장비 inlet 한계를 임의로 올리면 안 됩니다. server vendor 환경 범위와 facility risk assessment를 함께 만족해야 합니다." | MISSING | 인용 PDF https://docs.nvidia.com/dgx-pdf/data-center-best-practices-with-dgx-b300-v1.pdf : "Operating Temperature 10ºC to 35ºC (50ºF to 95ºF)"; "Supply Temperature Inlet10-35°C (50-95ºF) Delta T at 25°C SAT: 20.6°C"; ASHRAE 표 "Recommended All A 18–27 °C … Allowable up to 30 °C for DGX B300 Systems"; "Passive Rear Door Heat Exchangers are not recommended for DGX B300 Systems"; "** Estimated based on 25°C Supply Air Temperature". IMDA 원문: "gradual increase in the DC operating temperatures to 26°C and above, and to achieve a 2% to 5% cooling energy savings, with every 1°C increase" | 9절에 B300 envelope 숫자(10–35°C, A2 allowable 30°C, 14.5/19kW가 25°C SAT 기준 추정치라는 각주)를 넣어 26°C+ 판정을 실제 숫자로 닫고, 5절에 passive RDHx 비권장을 추가 |
| 5 | gpu/ai-infrastructure-b300-128-blueprint | `data.ts:106` | `excerpt: "4 nodes are the smallest NVIDIA HGX AI Factory building block"` | LINK | https://docs.nvidia.com/enterprise-reference-architectures/hgx-ai-factory/latest/network-logical-architecture.html 원문: "This Enterprise RA is built on scalable units (SU) based on 4 compute nodes." / "The 4-Node scalable unit provides the following connectivity building blocks:" — "smallest"라는 문장은 없음 | excerpt를 원문 문장으로 교체 |
| 6 | gpu/ai-cluster-storage-io | `data.ts:435` | `excerpt: "Dirty and Writeback state are tracked in the address space"` | LINK | https://docs.kernel.org/filesystems/vfs.html 원문: "Pages are normally kept in a radix tree index by ->index. This tree maintains information about the PG_Dirty and PG_Writeback status of each page, so that pages with either of these flags can be found quickly." 및 "Filesystems that wish to use this infrastructure should call mapping_set_error to record the error in the address_space when it occurs." | excerpt를 원문 문장으로 교체(요약이면 excerpt가 아니라 note에 둠) |
| 7 | gpu/b300-rack-power-cooling | `depthData.ts:1168` | `claim: "compute rack뿐 아니라 network·storage·CDU·RDHx auxiliary power를 facility total에 포함하는 기준을 확인했습니다."` (href = SuperPOD B300 RA) | LINK | 해당 표는 SuperPOD RA가 아니라 DC Best Practices PDF에 있음: "Power Demand for a typical 64 node high density SU — DGX B300 Racks 16 820Kva 1228Kva / Network Management & Storage Racks 8 104Kva 105Kva / CDUs 2 24Kva 70Kva / RDHx Units 24 27Kva 47Kva / Totals 975Kva 1450Kva". SuperPOD components 페이지(https://docs.nvidia.com/dgx-superpod/reference-architecture/scalable-infrastructure-b300/latest/dgx-superpod-components.html)는 "SUs of 64 DGX B300 systems each"와 power shelf만 언급, CDU·RDHx 언급 없음 | claim의 출처를 PDF로 옮기고, 가능하면 본문 3절에 64-node SU 보조 전력(975/1450 kVA 중 CDU·RDHx 51/117 kVA) 숫자를 인용 |
| 8 | gpu/ai-cluster-software-compatibility | `depthData.ts:353` | `href: ".../mstflint-package-firmware-burning-and-diagnostics-tools-documentation-v4-30-0.0.pdf"` | LINK | curl → `404`. Wayback 2025-05-19 스냅샷(`web.archive.org/web/20250519105147/...`) 존재(235쪽 PDF). `networking-docs.nvidia.com/mftswum/4300/...` 후보도 404 | 현행 MFT 문서 URL로 교체하거나 archive 링크 병기 |
| 9 | gpu/ai-cluster-software-compatibility | `depthData.ts:354` | `href: "https://blog.cliolabs.dev/blog/debugging-multi-node-gpu-training/"` | LINK | curl → `410 Gone`; Wayback 스냅샷 없음 | 삭제 또는 다른 사례로 교체 |
| 10 | gpu/ai-cluster-storage-io | `article-evidence.ts:13665` | `href: "https://www.snia.org/solid-state-sss"` | LINK | curl(UA 포함) → `403`; 대체 URL 2개도 403; Wayback 없음. preconditioning·steady-state 경계 주장은 미확인 | SNIA PTS 문서의 직접 PDF 링크로 교체 후 재확인 |
| 11 | gpu/kubernetes-vs-slurm-gpu-scheduling | `article-evidence.ts:13657` | `href: "https://hprc.tamu.edu/training/aces_slurm.html"` | LINK | curl → `403`(bot 차단 추정). Wayback 2026-02-07 사본 존재하나 "This site requires Javascript"만 담김. 제목 "Slurm scheduler on Composable Resources" 확인 | 브라우저 접근 가능하면 유지; 접근 조건을 note에 적기 |
| 12 | gpu/ai-infrastructure-b300-128-blueprint | `depthData.ts:188`, `article-evidence.ts:13643` | `href: ".../2025_tsmc_ar_e_ch5.pdf"` claim "CoWoS가 logic과 HBM을 통합하는 advanced packaging 단계" | LINK | 원 URL curl → `403`(text/html, bot 차단). Wayback 2026-09-11 사본으로 내용 확인: "CoWoS® advanced packaging service integrates multiple system-on-chip (SoC) chips and the high-bandwidth memory (HBM) stacks to enhance HPC products with superior compute power and memory bandwidth." 주장 자체는 맞음 | 접근 차단 가능성을 note에 적거나 archive 링크 병기 |
| 13 | gpu/ai-cluster-storage-io | `depthData.ts:1016`, `article-evidence.ts:13676`, `depthData.ts:650`("당근 · 2021-12-27") | 당근 Medium 글 | UNVERIFIED | curl → `403` "Attention Required! | Cloudflare"; Wayback 스냅샷 없음. 게시일·내용(change stream→S3, quota/buffer) 확인 불가 | 브라우저에서 날짜·문장 재확인 후 note에 확인일 기록 |
| 14 | gpu/ai-cluster-storage-io | `depthData.ts:646` | "Alluxio FUSE·locality cache·CACHETHROUGH" | WRONG(표기) | NAVER D2 원문(api/v1/contents/3863967): "CACHE_THROUGH: 원본 저장소로 저장한 이후 종료. 느리지만 안전한 데이터 보관" — 식별자는 `CACHE_THROUGH` | `CACHE_THROUGH`로 수정 |
| 15 | gpu/ai-cluster-software-compatibility | `depthData.ts:208` ("B300 최소 지원 release와 OEM support"), `depthData.ts:348` claim | 행 자체는 숫자를 비워 둠 | MISSING | https://docs.nvidia.com/dgx/dgx-os-7-user-guide/release_notes.html : "DGX B300 2.3 TB requires minimum DGX OS 7.3.1" (firmware 26.03.1 권장) — 원장이 "확인했다"고 쓴 값인데 표에 없음 | 원장 행에 "DGX OS ≥ 7.3.1 / FW 26.03.1" 기입 |
| 16 | gpu/nvidia-nca-aiio-study-guide | `ncaAiioDepth.ts:144` | `location: "dcgmi discovery와 diagnostics 사용 범위"` (href = DCGM getting-started) | LINK | https://docs.nvidia.com/datacenter/dcgm/latest/user-guide/getting-started.html 은 "$ dcgmi discovery -l"만 보여 주고 `dcgmi diag -r`는 없음(diag는 dcgmi-diag 페이지) | location을 "dcgmi discovery"로 줄이거나 dcgmi-diag 페이지를 추가 인용 |
| 17 | gpu/nvidia-nca-aiio-study-guide | `ncaAiioDepth.ts:193-209` | `sudo nvidia-ctk runtime configure --runtime=docker` / `systemctl restart docker` (href = sample-workload) | LINK | sample-workload 페이지에는 "sudo docker run --rm --runtime=nvidia --gpus all ubuntu nvidia-smi"만 있고 configure/restart 명령은 install-guide(https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/install-guide.html , toolkit 1.20.1)에 있음: "Configure the container runtime by using the nvidia-ctk command: sudo nvidia-ctk runtime configure --runtime=docker" | source에 install-guide를 함께 걸기 |
| 18 | gpu/ai-cluster-storage-io | `depthData.ts:939-940` | `ceph health detail`, `ceph osd df tree` (href = monitoring-osd-pg) | LINK | https://docs.ceph.com/en/latest/rados/operations/monitoring-osd-pg/ 에는 `ceph -s`, `ceph health`, `ceph pg stat`만 있고 `ceph health detail`·`ceph osd df tree`는 없음(명령 자체는 Ceph에 존재) | monitoring.html 또는 operations 페이지를 추가 인용 |
| 19 | gpu/amd-gpu-execution-and-hip | `amd-gpu-execution-and-hip.tsx:104` | "HIPIFY는 지원되는 CUDA API와 구문을 HIP으로 변환합니다. Inline PTX나 32 lane mask는 별도로 검사해야 합니다." | UNVERIFIED | HIPIFY 문서(https://rocm.docs.amd.com/projects/HIPIFY/en/latest/index.html)는 "HIPIFY does not automatically convert all CUDA code into HIP code seamlessly…"만 확인; inline PTX를 명시한 문장은 찾지 못함(supported-cuda-apis.html 404) | HIPIFY 문서의 unsupported 목록 페이지를 찾아 인용하거나 문장을 "지원 목록에 없는 구문" 수준으로 완화 |
| 20 | gpu/amd-gpu-execution-and-hip | `amd-gpu-execution-and-hip.tsx:106` | "rocWMMA는 두 계열을 지원할 수 있는 상위 라이브러리입니다." | UNVERIFIED(부분 확인) | https://rocm.docs.amd.com/projects/rocWMMA/en/latest/what-is-rocwmma.html : "The API is seamless across the supported CDNA and RDNA architectures." — 세대별 목록은 못 봄 | 지원 GPU 표 페이지를 인용 |
| 21 | gpu/ai-infrastructure-b300-128-blueprint | `depthData.ts:181` BOM 표 | "North/South DPU 미확정 — HGX 권장안과 DGX 완제품 구성이 다름" | OK(정보) | 실제로 다름: HGX components "One NVIDIA® BlueField®-3 DPU per server" vs DGX B300 user guide "2 x dual-port NVIDIA® BlueField®-3 DPUs … 2 x 400 Gb/s" | 본문 8절에 DGX 2장 구성을 한 줄 병기하면 더 명확 |
| 22 | gpu/b300-rack-power-cooling | `data.ts:481` | "DC busbar 시스템당 예상 평균 14.5kW와 피크 19kW" | OK(주의) | PDF 표는 "Estimated System Power 14.5 kW**" / "Estimated Peak System Power 19 kW**"로 '평균'이란 단어는 rack 표("58kW Average / 76kW Peak")에만 있음. DGX B300 user guide는 "Max 14.5 kW"로 적음 | "예상 시스템 전력(랙 표 기준 평균)"처럼 표현을 맞추면 혼동 감소 |
| 23 | gpu/nvidia-nca-aiio-study-guide | `ncaAiioData.ts:216` 등 | Study Guide "2026년 1월판" | OK(주의) | PDF 메타: CreationDate 2026-01-08, ModDate 2026-06-25, 본문 꼬리 "4694224. Jan26". 내용은 Jan26판이나 파일은 6월에 재저장됨 | note에 "파일 수정 2026-06-25, 내용 표기 Jan26" 기록 |
| 24 | gpu/ai-cluster-storage-io | `depthData.ts:1013`/`:646` | "NAVER D2 · 2022-05-27 … Alluxio 2.4.1의 6.4GB test" | OK | api/v1/contents/3863967: postPublishedAt 1653649080000(=2022-05-27 UTC), "6.4GB 파일을 읽어 보았다. 테스트는 Alluxio 2.4.1에서 short-circuit read 와 같은 성능 최적화 없이 진행되었다." — 단 JS 렌더 페이지라 WebFetch 불가, API로 확인 | — |

## 글별 검증 기록

### gpu/ai-infrastructure-b300-128-blueprint
- 추출한 고유 사실 주장 수: 22, 검증 20, 미검증 2(TSMC 원 URL 차단→archive로 확인, kiankyars/chips 강의 내용은 README 수준만)
- 연 자료:
  - https://docs.nvidia.com/enterprise-reference-architectures/hgx-ai-factory/latest/components.html — 200 — "Eight NVIDIA B300 GPUs on an HGX B300 baseboard with up to 2304 GB of GPU memory", "288GB HBM3e", "Eight NVIDIA® ConnectX-8 SuperNICs per NVIDIA HGX B300 baseboard. Up to 800 Gbps per adapter.", "One NVIDIA® BlueField®-3 DPU per server", "Minimum of 2TB system memory. Minimum of 500GB/s memory bandwidth."
  - https://docs.nvidia.com/enterprise-reference-architectures/hgx-ai-factory/latest/network-logical-architecture.html — 200 — "built on scalable units (SU) based on 4 compute nodes", "Dual-plane rail-optimized, non-blocking Spectrum fabric with 64-port switches", "Each GPU has individual 400Gb connection to each plane via 800Gb port broken out to 2x400Gb", 32/64/128-node 표, "minimum 12.5Gb bandwidth per GPU"(storage). excerpt 불일치 → 발견 #5
  - https://docs.nvidia.com/dgx/dgxb300-user-guide/introduction-to-dgxb300.html — 200 — "8 x NVIDIA B300 Blackwell Ultra GPUs", "8 x 288 GB = 2.3 TB total", "8 x NVIDIA® ConnectX®-8 cards", "2 x dual-port NVIDIA® BlueField®-3 DPUs", "8 x E1.S 3.84 TB NVMe", "2 x 1.92 TB M.2 NVMe", "10 RU", "14.5 kW" max, "12 x 3.2 kW" PSU
  - https://docs.nvidia.com/dgx-pdf/data-center-best-practices-with-dgx-b300-v1.pdf — 200(pdftotext) — "4 B300 Systems Per Rack … 2 B300 Systems Per Rack", "Four air-cooled DGX B300s per 48U MGX rack", "A DGX Scalable Unit (SU) consists of up to 72 (XDR) or 64 (Spectrum-X) DGX B300 systems"
  - https://docs.nvidia.com/dgx-superpod/reference-architecture/scalable-infrastructure-b300/latest/ — 200 — RA-11337-001 V01, 2025-05-29; components 페이지 "A modular architecture based on SUs of 64 DGX B300 systems each."
  - https://docs.nvidia.com/dgx-basepod/deployment-guides/dgx-basepod-b200/latest/b300/b300-nmc.html — 200 — Slurm/NCCL 검증 흐름 확인
  - https://huggingface.co/zai-org/GLM-5.3-Flash — 200 — "With 320B total parameters and just 18B active parameters", "hybrid architecture combining sparse and linear attention", "the first natively multimodal model in the GLM-5 series"
  - https://github.com/vukrosic/glm-5.3-flash-from-scratch — 200 — "25,730,592", "9,805,344", "192 tokens", "This is an educational implementation, not a reproduction"
  - https://investor.tsmc.com/static/annualReports/2025/english/pdf/2025_tsmc_ar_e_ch5.pdf — 403 → Wayback 2026-09-11 200 — "CoWoS® advanced packaging service integrates multiple system-on-chip (SoC) chips and the high-bandwidth memory (HBM) stacks"
  - https://github.com/kiankyars/chips — 200 — "A long-form, diagram-heavy course on how an AI accelerator moves from design to data center"
  - https://cloud.google.com/blog/products/networking/data-center-and-global-networks-built-for-ai-era — 200 — 2026-05-27, "decoupling our network into three distinct domains: a scale-up domain …, a dedicated east-west scale-out accelerator fabric, the Jupiter frontend network for north-south compute and storage access"
  - YouTube 5건 oEmbed 200: 제목·채널이 label과 일치(미눅스 2건, freeCodeCamp 2건, GTC 2020 s21992는 developer.nvidia.com 200)
- 빠진 내용: DGX 완제품은 BF-3가 2장(#21). 로컬 NVMe(DGX 8×3.84TB E1.S / HGX 권고 1–2TB per socket + 1TB boot)가 BOM 초안 표(depthData.ts:177-186)에 행으로 없음 — "확정 가능한 수량"에 속하는 항목이라 추가 권장(경미).
- OK로 확인한 주요 주장: 128÷8=16, 128×288=36,864GB, 16×8=128 adapters, 16×2TB=32TB(components), 4-node SU, 32/64/128 표, 64-node SU, rack당 4/2대, GLM 320B/18B, 교육모델 수치, CoWoS 역할.

### gpu/ai-cluster-software-compatibility
- 추출한 고유 사실 주장 수: 18, 검증 17, 미검증 1(mstflint 명령 의미 — archive PDF 텍스트 추출 실패)
- 연 자료:
  - https://docs.nvidia.com/dgx/dgx-os-7-user-guide/release_notes.html — 200 — DGX OS 7.6.0, 2026-09-14; Ubuntu 24.04.5; kernel 6.8.0-138-generic; driver 580.178.04; CUDA Toolkit 13.0 Update 3; NCCL 2.31.2; DOCA OFED 3.2.3-019000 LTS; Container Toolkit 1.20.0; ConnectX-8 FW 40.47.3576; "Carefully review release information and advisories for all relevant upgrades."(literal); "DGX B300 2.3 TB requires minimum DGX OS 7.3.1"
  - https://docs.nvidia.com/doca/sdk/doca-profiles/ — 302 → https://networking-docs.nvidia.com/doca/sdk/DOCA-Profiles 200 — DOCA 3.5.0; "For MLNX_OFED-like installation use doca-ofed (no additional DOCA functionality)"; "For RoCE functionality only, install doca-roce"; ConnectX에는 doca-networking 권장
  - https://docs.nvidia.com/dgx/dgx-os-7-user-guide/upgrading-the-os.html — 200 — "For a release upgrade from DGX OS 6, the Mellanox OFED (MOFED) drivers are replaced with the DOCA OFED drivers from DGX OS 7."; "Best practices support upgrading selected systems and verifying that your applications are working as expected before deploying on additional systems."
  - https://docs.nvidia.com/deeplearning/nccl/user-guide/docs/env.html — 200 — NCCL_DEBUG_FILE "filename.%h.%p where %h is replaced with the hostname and %p is replaced with the process PID"; "should generally not be set for production code"
  - https://docs.nvidia.com/deeplearning/nccl/user-guide/docs/index.html — 200
  - https://docs.nvidia.com/datacenter/cloud-native/gpu-operator/latest/platform-support.html — 200 — GPU Operator 26.7.x, OS/K8s/runtime/operand matrix
  - mstflint PDF — 404(발견 #8); cliolabs — 410(발견 #9); YouTube 3건 제목 일치
- 빠진 내용: 발견 #15(B300 최소 DGX OS 7.3.1). 또한 6절 OFED 정의는 "OpenFabrics Enterprise Distribution"이라 쓰는데 NVIDIA 문맥의 MLNX_OFED/DOCA-OFED는 OFA 배포판이 아니라 NVIDIA 배포판이라는 구분이 한 줄 필요(경미).
- OK로 확인한 주요 주장: 공개 표 전체, doca-ofed/roce/networking 경계, MOFED→DOCA-OFED 전환·선별 검증 권고, NCCL debug 변수와 production 경고, 15/16=93.75%.

### gpu/kubernetes-vs-slurm-gpu-scheduling
- 추출한 고유 사실 주장 수: 20, 검증 19, 미검증 1(TAMU 강의 내용)
- 연 자료:
  - https://slurm.schedmd.com/quickstart.html — 200 — "First, it allocates exclusive and/or non-exclusive access to resources (compute nodes) to users for some duration of time … Second, it provides a framework for starting, executing, and monitoring work … Finally, it arbitrates contention for resources by managing a queue of pending work."; "sbatch is used to submit a job script for later execution"; "srun is used to submit a job for execution or initiate job steps in real time"
  - https://kubernetes.io/docs/concepts/workloads/controllers/job/ — 200 — "A Job creates one or more Pods and will continue to retry execution of the Pods until a specified number of them successfully terminate."; gang scheduling은 JobSet/Kueue 통합 항목으로 언급
  - https://slurm.schedmd.com/gres.html — 200 — "If not all system-detected devices are specified by the slurm.conf configuration, then the relevant slurmd will be drained."; "If the system-detected GPU differs from its matching GPU configuration, then the GPU is omitted from the node with an error."; Type은 "exactly match or be a substring of the GPU name"
  - https://slurm.schedmd.com/job_state_codes.html — 200 — PENDING/RUNNING/FAILED/NODE_FAIL 정의; reason 목록은 job_reason_codes.html로 분리(본문 Resources/Priority는 그 페이지 소관)
  - https://slurm.schedmd.com/srun.html — 200 — `--gpu-bind=closest` 존재
  - https://slurm.schedmd.com/topology.html — 200(내용 미대조)
  - https://kubernetes.io/docs/concepts/scheduling-eviction/scheduling-framework/ — 200 — "Scheduling cycles are run serially, while binding cycles may run concurrently."
  - https://go.kubebuilder.io/reference/good-practices.html — 200 — "Avoid a design solution where the same controller reconciles more than one Kind."; "the controller's reconciliation loop needs to be idempotent"
  - https://kubernetes.io/docs/reference/using-api/api-concepts/ — 200 — resourceVersion "MUST be treated as opaque … SHOULD NOT assume … numeric, is globally ordered, or is monotonically increasing"; 409 Conflict
  - https://kubernetes.io/docs/concepts/overview/working-with-objects/finalizers/ — 200 — "marks the object for deletion by populating .metadata.deletionTimestamp … After these actions are complete, the controller removes the relevant finalizers"
  - https://pkg.go.dev/sigs.k8s.io/controller-runtime/pkg/predicate — 200 — "This predicate will skip update events that have no change in the object's metadata.generation field."; "For Deployment objects the Generation is also incremented on writes to the metadata.annotations field."
  - https://pkg.go.dev/sigs.k8s.io/controller-runtime/pkg/controller — 200 (v0.25.2) — "MaxConcurrentReconciles is the maximum number of concurrent reconciliations that can be run. Defaults to 1."; "The workqueue ensures that the same item is not processed by multiple workers at the same time."
  - https://pkg.go.dev/k8s.io/client-go/util/retry — 200 — "RetryOnConflict is used to make an update to a resource when you have to worry about conflicts caused by other code making unrelated updates"; DefaultRetry Steps 5/10ms/Factor 1.0/Jitter 0.1
  - https://coreweave.com/blog/achieve-ai-infrastructure-goodput-of-up-to-96-with-3-key-strategies — 200 — 2026-10-02, "goodput as high as 96%"
  - GPU Operator index 200; B300 deployment guide 200; TAMU 403(#11); YouTube 2건 제목 일치
- 빠진 내용: 실물 1 실패 출력 "configured gpu:b300:8, detected 7 → DRAIN"은 gres.html의 문장(미구성 장치 감지 시 drain)과 방향이 반대인 사례다(구성 > 감지). 이 경우는 slurmctld가 등록 시 "gres/gpu count reported lower than configured"로 drain하는 동작인데 인용 위치가 gres.html이라 독자가 확인할 수 없음 — slurm.conf/`sinfo -R` 설명으로 보강 권장(경미, 판정 보류).
- OK로 확인한 주요 주장: 16/8=2, 4/2=2, allocation/step/partition 정의, Job 정의, generation/observedGeneration, 409, finalizer 생애, MaxConcurrentReconciles 의미, RetryOnConflict 패턴.

### gpu/ai-cluster-storage-io
- 추출한 고유 사실 주장 수: 30, 검증 27, 미검증 3(당근 글, SNIA PTS, IOR 옵션 README)
- 연 자료:
  - https://docs.nvidia.com/enterprise-reference-architectures/hgx-ai-factory/latest/nvidia-certified-storage.html — 200 — "approximately 12.5 Gb/s per GPU, scaling linearly … a 16 GPU cluster would require around 200 Gb/s"
  - https://docs.nvidia.com/enterprise-reference-architectures/hgx-ai-factory/latest/appendix-node-configurations.html — 200 — "Minimum 2 TB NVMe drive per CPU socket", "Minimum of 2TB system memory"
  - https://docs.kernel.org/filesystems/vfs.html — 200 — excerpt 불일치(#6); "fsync … file_check_and_advance_wb_err" 확인
  - https://raw.githubusercontent.com/torvalds/linux/master/include/linux/fs.h — 200 — `struct address_space` 14개 필드가 본문 발췌와 순서까지 동일
  - https://docs.kernel.org/block/blk-mq.html — 200 — "software staging queues (represented by struct blk_mq_ctx)", "hardware queue (represented by struct blk_mq_hw_ctx)", "A request is one or more BIOs"
  - https://man7.org/linux/man-pages/man2/fsync.2.html — 200 — "Calling fsync() does not necessarily ensure that the entry in the directory containing the file has also reached disk. For that an explicit fsync() on a file descriptor for the directory is also needed."
  - https://www.cs.cmu.edu/~harchol/Perfclass/NotesFall25/chpt6prep.pdf — 200(pdftotext) — "15-857/47-774 Chpt 6: Little's Law & Other Operational Laws"
  - https://docs.ceph.com/en/umbrella/rados/operations/erasure-code/ — 200 — "M is equal to the number of OSDs that can be missing from the cluster without the cluster suffering data loss", "overhead factor … (k+m) / k"
  - https://docs.ceph.com/en/latest/rados/operations/monitoring-osd-pg/ — 200 — degraded/recovering/backfilling 정의; `ceph health detail`·`ceph osd df tree`는 없음(#18)
  - https://docs.pytorch.org/tutorials/recipes/distributed_async_checkpoint_recipe.html — 200 — 본문 코드 9줄이 recipe와 동일; "Asynchronous checkpointing works by first copying models into internal CPU-buffers … does raise CPU memory by a factor of checkpoint_size_per_rank X number_of_ranks"
  - https://fio.readthedocs.io/en/latest/fio_doc.html — 200 — direct "use non-buffered I/O. This is usually O_DIRECT", readonly, --output-format json
  - https://github.com/hpc/ior — 200(README 본문은 렌더에 안 잡혀 옵션 미대조)
  - https://help.elice.io/help/docs/cloud-overview — 200 — ECI "블록 스토리지(스냅샷·스케줄러 포함), 오브젝트 스토리지, 병렬 파일 시스템(PFS)"; 엘리스AI클라우드 "블록 스토리지, 데이터허브(S3 호환 오브젝트 스토리지)"
  - https://elice.io/ko/resources/blog/eci-b300-gpu-virtualization — 200 — "NVIDIA B300 도입기 : ECI에서 만나는 베어메탈급 성능", 2026-09-29; "GPU 드라이버, Fabric Manager, CUDA, NCCL, nccl-tests 버전을 동일하게 맞추고 같은 테스트 스크립트를 사용했습니다"; 스토리지 성능 언급 없음(본문 주장과 일치)
  - https://d2.naver.com/helloworld/3863967 — 200(API) — 2022-05-27, Alluxio 2.4.1, 6.4GB, CACHE_THROUGH(#14)
  - https://tech.kakao.com/posts/694 — 200(API) — "로그 유형별 Iceberg 테이블 적재 및 운영 전략", 2025.04.18; "target-file-size-byte 256 MB (하둡 파일 시스템 블록 사이즈와 동일)"; "커밋 주기는 … 10분"; 컴팩션·스냅샷 만료·고아 파일 제거
  - https://techblog.woowahan.com/2621/ — 200 — "Aurora 로컬 스토리지 성능 테스트", 2019-03-22, sysbench, "R5 > R4 > R3"
  - Medium 당근 — 403(#13); SNIA — 403(#10); storage.html — 404(#3); GDS 두 페이지·MLCommons·NVMe spec·VT ARC 200(내용 소프트)
- 빠진 내용: 없음(핵심 메커니즘·경계 모두 있음). 단 `직접 입출력` term boundary의 "정렬·filesystem 조건"은 open(2) O_DIRECT 절이 근거인데 인용은 fsync(2)만 — open(2) 추가 권장(경미).
- OK로 확인한 주요 주장: 2,048 IOPS·8.2 in-flight·약 210만 IOPS(4KiB), 1.6/1.28PB, 66.7GB/s·200GB/s, address_space 원문, fsync 디렉터리 경계, DCP async_save 코드·CPU staging, Ceph k/m·상태.

### gpu/b300-rack-power-cooling
- 추출한 고유 사실 주장 수: 24, 검증 23, 미검증 1(Lille 강의 내용)
- 연 자료:
  - DC Best Practices PDF — 200 — "Estimated System Power 14.5 kW** / 15 kW**", "Estimated Peak System Power 19 kW** / 19.7 kW**", "58kW Average / 76kW Peak", "30kW Average / 39.4kW Peak", "Four 1U 33kW DC Power Shelves per Rack", "Power Shelf Redundancy N+1 (4 B300 Systems requires at least 3 active Power Shelves)", "Circuit Provisioning 4 60amp Three Phase Circuits per utility source (400V minimum)", 회로표 "3Φ 400 240 63 80.0% 4 141 4 … * 0.99 power factor", "Article 210.20 (A) of the NEC (NFPA 70) … maximum usable circuit capacity is 80%", "Each DGX B300 system requires up to approximately 2145 CFM of supply air at sea level", "Passive Rear Door Heat Exchangers are not recommended", 64-node SU 전력표(CDU 24/70 kVA, RDHx 27/47 kVA)
  - https://www.imda.gov.sg/how-we-can-help/green-dc-roadmap/tropical-dc-standard — 200(raw HTML) — "Tropical DC standard (SS697:2023) provides a methodology and guidelines on how to safely raise DCs' operating temperatures in a tropical climate. It aims to help DCs develop a roadmap to support the gradual increase in the DC operating temperatures to 26°C and above, and to achieve a 2% to 5% cooling energy savings, with every 1°C increase" (excerpt 일치)
  - https://docs.nvidia.com/dgx/dgxb300-user-guide/redfish-api-supp.html — 200 — #2
  - https://docs.nvidia.com/dgx/dgxb300-user-guide/quickstart-basics.html — 200 — "must be installed by NVIDIA partner network personnel or NVIDIA field service engineers", "sudo nvsm stress-test --force … takes approximately 20 minutes"
  - https://redfish.dmtf.org/schemas/v1/Power.json — 200 — deprecated(#2)
  - DGX B300 user guide 200(10RU, 12×3.2kW, 49,476 BTU/h); SuperPOD RA 200(#7); YouTube/OCP/Lille 200 제목 일치
- 빠진 내용: #4. 추가로 3절의 14.5/19kW가 "** Estimated based on 25°C Supply Air Temperature" 조건부라는 각주가 본문에 없음(고온 운영 9절과 직접 연결되는 조건).
- OK로 확인한 주요 주장: 232/304kW, 240/315.2kW, 58/76, 30/39.4, 4/8 racks, 유량 4.99/6.54/1.25/1.63 kg/s(cp 4.186), 110.8A·125A×0.8=100A, 2145 CFM, 48U MGX·active RDHx·2대 전통 공랭, SS 697:2023 26°C 문장.

### gpu/ai-infrastructure-commissioning-acceptance
- 추출한 고유 사실 주장 수: 14, 검증 13, 미검증 1(KISA excerpt 문장 자체)
- 연 자료:
  - https://docs.nvidia.com/dgx-basepod/deployment-guides/dgx-basepod-b200/latest/b300/b300-nmc.html — 200 — "Login to SLOGIN-01 and run sinfo to verify that all the nodes are up and ready."(excerpt 일치); "Verify that the openibd and nvidia-fabricmanager services are enabled and running on all DGX nodes."; `srun … -N2 --exclusive --gpus-per-node=8 --mpi=pmix --container-name=nccl-test --container-image="docker://brightcomputing/nccl-test:25.02-py3-x86" all_reduce_perf_mpi -b 1G -e 16G -f 2 -g 8`
  - https://docs.nvidia.com/dgx/dgxb300-user-guide/quickstart-basics.html — 200 — "sudo nvsm show health", "approximately 20 minutes. sudo nvsm stress-test --force", "NVIDIA recommends running the pre-flight stress test before putting a system into a production environment or after servicing."
  - https://docs.nvidia.com/datacenter/dcgm/latest/reference/command-line-reference/dcgmi/dcgmi-diag.html — 200 — -r 1/2/3/4, "-j/--json Use JSON output", "226 (DCGM_ST_NVVS_ERROR—diagnostic ran but reported an error)"
  - https://docs.nvidia.com/datacenter/dcgm/latest/reference/diagnostics/index.html — 200 — "A Pass, Fail, or Skip status describes the outcome of that test invocation; the associated error code and message distinguish a diagnostic finding from a setup, execution, or availability problem."
  - https://docs.nvidia.com/datacenter/dcgm/latest/reference/multi-node-diagnostics/index.html — 200 — "A multi-node request has two independent outcomes: The command return value reports whether DCGM connected, orchestrated, and rendered the run successfully. The diagnostic result reports what the selected workload established. A completed command can report Fail while returning status zero."; "Every participating host must use the same supported GPU SKU."
  - KISA — DNS 실패(#1); https://www.kisa.or.kr/1050603 200으로 제도 정의 확인
- 빠진 내용: 없음(FAT/SAT/acceptance ledger 구조 적절). CSAP 절은 유효기간 5년·사후평가 연 1회 같은 현행 제도 수치가 없으나 글의 범위상 필수는 아님.
- OK로 확인한 주요 주장: 16×4=64, sinfo 문장, NCCL 명령 형태, NVSM 20분, dcgmi 226, Pass/Fail/Skip, orchestration vs diagnostic outcome.

### gpu/nvidia-nca-aiio-study-guide
- 추출한 고유 사실 주장 수(지시된 5개 제외): 16, 검증 16, 미검증 0
- 연 자료:
  - https://dam-cdn.nvd.orangelogic.com/AssetLink/x874j05hy3m3r2sor84kpvp70750m468.pdf — 200(pdftotext) — 제목 "NVIDIA-Certified Associate: AI Infrastructure and Operations Exam Study Guide"; "The NCA-AIIO certification is an entry-level credential that validates the foundational concepts of AI computing related to infrastructure and operations. This exam is designed for IT professionals new to AI operations and infrastructure"; "from technical pre-sales to data center operations"; 책임 6 "Contribute to the operations of an AI data center in collaboration with a professional administrator."; 2.10 "Explain the purpose and benefits of a DPU in a data center."; 3.4 "Identify the key considerations for virtualizing accelerated infrastructure."; 38%/40%/22%; 꼬리 "4694224. Jan26"; 메타 CreationDate 2026-01-08, ModDate 2026-06-25(#23)
  - https://www.nvidia.com/en-us/learn/certification/ai-infrastructure-operations-associate/ — 200 — "The typical time to complete this course is seven hours."(AI Infrastructure and Operations Fundamentals), 온라인 원격 감독, Essential 38/Infra 40/Ops 22
  - https://www.nvidia.com/en-us/learn/certification/ — 200 — NCA-AIIO, NCP-AII "deploy, configure, and validate advanced NVIDIA AI infrastructure", NCP-AIO "monitor, troubleshoot, and optimize", NCP-AIN, NCP-ARI 모두 별도 자격; Associate $125/1h, Professional $200–500/2h
  - https://www.nvidia.com/en-us/learn/certification/ai-infrastructure-professional/ — 200 — 120분, 70–75문항, $400; "system and server deployment, network topology configuration, firmware upgrades, GPU installation and validation, physical layer management"
  - https://www.nvidia.com/en-us/learn/certification/ai-operations-professional/ — 200 — 120분, 30 객관식 + 3 hands-on lab, $500; Slurm·Kubernetes·Base Command Manager
  - https://docs.nvidia.com/datacenter/dcgm/latest/user-guide/getting-started.html — 200 — "$ dcgmi discovery -l"만(#16)
  - https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/sample-workload.html — 200 — "sudo docker run --rm --runtime=nvidia --gpus all ubuntu nvidia-smi"; configure/restart는 install-guide(#17)
  - https://docs.nvidia.com/deeplearning/triton-inference-server/user-guide/docs/getting_started/quickstart.html — 200 — "The HTTP request returns status 200 if Triton is ready and non-200 if it is not ready."
  - https://docs.nvidia.com/base-command-manager/ — 200 — "NVIDIA Base Command Manager streamlines cluster provisioning, workload management, and infrastructure monitoring."
  - slurm overview 200, GPU Operator index 200, B300 deployment guide 200, freeCodeCamp 영상 제목 "NVIDIA-Certified Associate AI Infrastructure and Operations (NCA AIIO) Free Study Course | freeCodeCamp.org" 일치
- 빠진 내용: 9절은 NCP-AIO가 "실제 cluster 도구 숙련"을 요구한다고만 쓰는데 공식 페이지의 구체 형식(30 객관식 + 3 hands-on lab, 120분)이 역할 경계의 가장 강한 근거이므로 한 줄 추가 권장(경미).
- OK로 확인한 주요 주장: entry-level·"new to", 협력 수준 역할, 동사 describe/identify/explain/articulate 중심, DPU·virtualization 범위, 7시간 과정, NCP 계열 4종, Triton 200/non-200, BCM 역할, 19/20/11 합 50.

### gpu/amd-gpu-execution-and-hip
- 추출한 고유 사실 주장 수: 19, 검증 17, 미검증 2(#19, #20)
- 연 자료:
  - https://raw.githubusercontent.com/ROCm/HIP-Examples/cdf9d101.../vectorAdd/vectoradd_hip.cpp — 200 — 로컬 스냅샷과 `diff` 동일; 51–56행 `int x = hipBlockDim_x * hipBlockIdx_x + hipThreadIdx_x; … int i = y * width + x; if ( i < (width * height)) { a[i] = b[i] + c[i];` (github blob URL은 확인 시점 429 rate-limit)
  - https://raw.githubusercontent.com/NVIDIA/cuda-samples/3f1c509.../vectorAdd.cu — 200 — 동일; 49행 `int i = blockDim.x * blockIdx.x + threadIdx.x;`, 52행 `C[i] = A[i] + B[i] + 0.0f;`, 65행 `numElements = 50000`, 136행 `threadsPerBlock = 256`; tag v13.0 sha = 3f1c5096…(api.github.com)
  - https://rocm.docs.amd.com/projects/HIP/en/docs-7.0.0/how-to/hip_cpp_language_extensions.html — 200 — "NVIDIA devices return 32 for this variable; AMD devices return 64 for gfx9 and 32 for gfx10 and above."; "HIP doesn't support warpSize of 64 on gfx10 and above."; "warpSize should not be assumed to be a specific value in portable HIP applications"
  - https://rocm.docs.amd.com/projects/HIP/en/docs-7.0.0/understand/hardware_implementation.html — 200 — "The basic building block of a GPU is a compute unit (CU), also known as streaming multiprocessor (SM) on NVIDIA GPUs."; "On AMD GPUs the warp size is commonly 64 threads, except in RDNA architectures which can utilize a warp size of 32 or 64"; "The local data share is memory that is accessible to all threads within a block."
  - CDNA4 whitepaper PDF — 200(pdftotext, 21쪽) — p.9 "The LDS in the AMD CDNA 3 architecture and prior generations was a directly addressed structure with 32 banks, each containing 512 entries for 32-bits of data – a total of 64KB of data."; p.9 "The LDS in the AMD CDNA 4 architecture is 160KB"; p.3 "288GB HBM3E with 8TB/s of bandwidth"; p.11 "The HBM3E memory interfaces operate at 8 Gbps … 8TB/s of peak theoretical memory bandwidth … 36GB per stack for up to 288GB"; 4MB L2 per XCD, AMD Infinity Cache in IODs; p.21 "PID#2258402-C (10/1/2025)"
  - CDNA4 ISA PDF — 200 — "CDNA4 Instruction Set Architecture: Reference Guide", 7. Matrix Arithmetic Instructions / 7.1 MFMA
  - rocWMMA what-is — 200 — "The API is seamless across the supported CDNA and RDNA architectures."(#20); HIPIFY index 200(#19)
- 빠진 내용: 7절 "bank 수와 명령별 읽기 묶음은 target별로 확인"에 대해 백서 p.9가 주는 CDNA4 수치("doubles the read bandwidth to 256 bytes per clock", bank 수 증가)를 인용하지 않음(경미). "32비트 참여 mask" 논의에 HIP의 `__ballot`가 64-bit `unsigned long long`을 반환한다는 공식 근거(HIP warp cross-lane 문서)가 있으면 9절이 닫힘(경미).
- OK로 확인한 주요 주장: 37×4=148B, 64×1 블록에서 i=37, 원본 1024×1024·16×16·i<width*height, warpSize 규칙, LDS 160KB/64KB·32 banks, 288GB/8TB/s, 백서 개정일, MFMA/WMMA/rocWMMA 역할.

### gpu/hbm-stack-and-memory-requests
- 추출한 고유 사실 주장 수: 17, 검증 17, 미검증 0
- 연 자료:
  - https://www.synopsys.com/designware-ip/interface-ip/hbm/hbm3-phy.html — 200 — "16 independent 64-bit memory channels"(excerpt 일치); "Pseudo-channel operation supported to enable up to 32 32-bit pseudo-channels with 1024-bit PHY"; "data rates up to 9600 Mbps"
  - https://www.synopsys.com/designware-ip/interface-ip/hbm/hbm4-phy.html — 200 — "32 independent 64-bit memory channels"; "Pseudo-channel operation to enable up to 64 32-bit pseudo-channels with 2048-bit PHY"; "up to 12 Gbps per data pin"
  - https://www.synopsys.com/designware-ip/interface-ip/hbm/hbm3-controller.html — 200 — "Up to 32 pseudo channels", "16 to 64 banks per pseudo channel", "Autonomous per-bank/all-bank refresh"
  - https://docs.nvidia.com/cuda/cuda-c-best-practices-guide/index.html — 200 — "For devices of compute capability 6.0 or higher … coalesce into a number of transactions equal to the number of 32-byte transactions necessary to service all of the threads of the warp."; "the k-th thread accesses the k-th word in a 32-byte aligned array … four coalesced 32-byte transactions"
  - CDNA4 whitepaper — 288GB/8TB/s(위와 동일); cuda-samples 52행 동일
- 빠진 내용: 8절 가정 8Gb/s/pin 옆에 "MI355X의 HBM3E 인터페이스는 8 Gbps(백서 p.11)로 동작하며, PHY IP 상한은 HBM3 9.6/HBM4 12 Gbps"를 적으면 8.192TB/s(가정) vs 8TB/s(제품) 차이의 출처가 닫힌다(경미). 5절 refresh·누설 설명은 정성적이며 JEDEC HBM3의 refresh 모드(per-bank refresh 등)를 한 줄도 인용하지 않음 — 컨트롤러 페이지의 "per-bank/all-bank refresh" 문구로 보강 가능(경미).
- OK로 확인한 주요 주장: 16×64=1024, 32×32 PC, 1024×8/8=1,024GB/s, 8 stacks 8.192TB/s, 768B/1.024TB/s=0.75ns, 64/768=1/12, 4 sectors vs 32 sectors, 249개 원소, HBM4 2048-bit·64 PC·2.048TB/s, MI350 288GB/8TB/s.

## 열지 못한 자료
| URL | 상태 | 대체 확인 |
|---|---|---|
| https://isms.kisa.or.kr/main/csap/notice/?boardId=bbs_0000000000000004&mode=list | DNS 해석 실패(000), Wayback 없음 | https://www.kisa.or.kr/1050603 (200)에서 CSAP 정의·법적 근거 확인; isms-p.or.kr 루트 200·동일 경로 404 |
| https://docs.nvidia.com/enterprise-reference-architectures/hgx-ai-factory/latest/storage.html | 404, Wayback 없음 | nvidia-certified-storage.html (200) |
| https://docs.nvidia.com/networking/display/mstflint-package-firmware-burning-and-diagnostics-tools-documentation-v4-30-0.0.pdf | 404 | Wayback 2025-05-19 (200, 235쪽 PDF; 텍스트 추출 실패) |
| https://blog.cliolabs.dev/blog/debugging-multi-node-gpu-training/ | 410 Gone, Wayback 없음 | 없음 |
| https://www.snia.org/solid-state-sss | 403(bot 차단), Wayback 없음 | 없음 |
| https://hprc.tamu.edu/training/aces_slurm.html | 403(bot 차단) | Wayback 2026-02-07 (JS 전용 페이지, 제목만 확인) |
| https://investor.tsmc.com/static/annualReports/2025/english/pdf/2025_tsmc_ar_e_ch5.pdf | 403(bot 차단) | Wayback 2026-09-11 (200) — CoWoS 문장 확인 |
| https://medium.com/daangn/dynamodb-…-1733db06066 | 403 Cloudflare, Wayback 없음 | 없음(날짜 2021-12-27 미확인) |
| https://github.com/ROCm/HIP-Examples/blob/cdf9d101…/vectoradd_hip.cpp | 429 rate-limit(일시) | raw.githubusercontent.com 동일 커밋 200, 로컬 스냅샷과 diff 동일 |
| https://rocm.docs.amd.com/projects/HIPIFY/en/latest/supported-cuda-apis.html (보조 확인용) | 404 | HIPIFY index 200(inline PTX 문장은 미발견) |

## 공용 파일 수정 목록

### src/content/article-evidence.ts

#1 KISA
```
old: { kind: "공식 문서", label: "KISA 클라우드서비스 보안인증 공지", href: "https://isms.kisa.or.kr/main/csap/notice/?boardId=bbs_0000000000000004&mode=list", note: "CSAP 관련 최신 공지와 인증 범위는 KISA 원문에서 별도로 확인합니다." },
new: { kind: "공식 문서", label: "KISA 클라우드 보안인증제(CSAP) 소개", href: "https://www.kisa.or.kr/1050603", note: "CSAP를 “클라우드컴퓨팅서비스 사업자가 제공하는 서비스에 대해 정보보호 기준의 준수여부를 평가․인증하는 제도”로 정의합니다. 이전 isms.kisa.or.kr 공지 경로는 2026-10-09 DNS가 해석되지 않아 교체했습니다." },
```

#3 storage.html
```
old: { kind: "공식 문서", label: "NVIDIA HGX AI Factory · Storage Architecture", href: "https://docs.nvidia.com/enterprise-reference-architectures/hgx-ai-factory/latest/storage.html", note: "GPU당 처리량 기준과 공유·로컬 저장 경로의 역할을 확인합니다." },
new: { kind: "공식 문서", label: "NVIDIA HGX AI Factory · NVIDIA-Certified Storage", href: "https://docs.nvidia.com/enterprise-reference-architectures/hgx-ai-factory/latest/nvidia-certified-storage.html", note: "GPU당 약 12.5Gb/s storage bandwidth guideline과 certified storage 범위를 확인합니다. 이전 storage.html 주소는 2026-10-09 404였습니다." },
```

#10 SNIA (gpu/ai-cluster-storage-io 항목만. 7345행의 "Specification 2.0.2" 항목은 다른 글이라 건드리지 않음)
```
old: label: "SNIA SSS Performance Test Specification", href: "https://www.snia.org/solid-state-sss", note: "저장장치 성능 측정의 preconditioning·steady-state 경계를 확인합니다." },
new: label: "SNIA SSS Performance Test Specification", href: "https://www.snia.org/solid-state-sss", note: "저장장치 성능 측정의 preconditioning·steady-state 경계를 다루는 규격 안내입니다. 2026-10-09 자동 조회가 403으로 막히고 보관 사본도 없어 내용은 다시 대조하지 못했습니다." },
```

#11 TAMU
```
old: note: "SBATCH·single/multi-node·GPU 작업·사용량 확인·실패 진단을 실습하며 Slurm의 batch job 생애를 익힙니다." },
new: note: "SBATCH·single/multi-node·GPU 작업·사용량 확인·실패 진단을 실습하며 Slurm의 batch job 생애를 익힙니다. 2026-10-09 자동 조회 불가(403), 서지 2차 확인: web.archive.org 2026-02-07 사본에서 제목 “Slurm scheduler on Composable Resources”만 확인했고 본문은 JavaScript 전용이라 대조하지 못했습니다." },
```

#12 TSMC
```
old: note: "CoWoS가 logic과 HBM을 통합하는 packaging 단계임을 확인합니다." },
new: note: "CoWoS가 logic과 HBM을 통합하는 packaging 단계임을 확인합니다. 원 PDF는 2026-10-09 자동 조회가 403으로 막혀 web.archive.org 2026-09-11 사본에서 “CoWoS® advanced packaging service integrates multiple system-on-chip (SoC) chips and the high-bandwidth memory (HBM) stacks” 문장을 확인했습니다." },
```

#13 당근
```
old: note: "Online source의 부하를 격리하고 access pattern에서 object layout을 정하는 질문을 가져옵니다." },
new: note: "Online source의 부하를 격리하고 access pattern에서 object layout을 정하는 질문을 가져옵니다. 2026-10-09 Cloudflare 403으로 자동 조회가 막히고 보관 사본도 없어 게시일(2021-12-27)과 본문을 다시 대조하지 못했습니다." },
```

### src/content/article-learning.ts

#1 KISA
```
old: { title: "KISA 클라우드서비스 보안인증제 안내", href: "https://isms.kisa.or.kr/main/csap/notice/?boardId=bbs_0000000000000004&mode=list", problem:
new: { title: "KISA 클라우드 보안인증제(CSAP) 소개", href: "https://www.kisa.or.kr/1050603", problem:
```
같은 항목의 contribution도 바꾼다.
```
old: contribution: "현재 CSAP 안내서·공지와 인증 제도 자료의 공식 경로를 제공합니다.", assumptions: "제안 시점의 대상 service·등급·유효 증서와 최신 평가 기준을 다시 확인합니다."
new: contribution: "CSAP를 “클라우드컴퓨팅서비스 사업자가 제공하는 서비스에 대해 정보보호 기준의 준수여부를 평가․인증하는 제도”로 정의한 KISA 공식 안내를 제공합니다(이전 isms.kisa.or.kr 경로는 2026-10-09 DNS 해석 실패).", assumptions: "제안 시점의 대상 service·등급·유효 증서와 최신 평가 기준을 다시 확인합니다."
```

## 후속 작업
글별 검증 기록의 "빠진 내용" 중 번호 없는 경미 항목은 이번에 넣지 않았다.
- software-compatibility 6절: MLNX_OFED/DOCA-OFED가 OpenFabrics 배포판이 아니라 NVIDIA 배포판이라는 구분(원장에 1차 인용문 없음 — 확인 후 추가).
- kubernetes-vs-slurm 실물 1: "configured 8, detected 7 → DRAIN" 사례의 근거를 gres.html 대신 slurm.conf/`sinfo -R` 설명으로 보강(원장 판정 보류).
- storage-io: `직접 입출력` 경계에 open(2) O_DIRECT 절 인용 추가.
- blueprint BOM 표: 로컬 NVMe 행(DGX 8×3.84TB E1.S / HGX 권고).
- nca-aiio 9절: NCP-AIO 형식(120분, 30 객관식 + 3 hands-on lab, $500) 한 줄.
- amd-gpu: CDNA4 LDS read bandwidth 256 bytes/clock(백서 p.9), HIP `__ballot` 64-bit 반환 근거.
- hbm-stack: MI355X HBM3E 8 Gbps(백서 p.11) vs PHY 상한 9.6/12 Gbps, controller "per-bank/all-bank refresh" 문구.
- SNIA PTS 직접 PDF 링크 확보 후 #10 재확인. 당근 Medium 글 브라우저 재확인(#13).
