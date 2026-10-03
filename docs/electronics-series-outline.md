# 전자 4분야 편목과 읽기 순서 (설계안)

작성: 2026-10-03 · 상태: **설계안, 미착수**. 실제 집필은 `electronics-series` 브랜치(별도 worktree)가 맡는다.
이 문서는 그 레인이 소비할 범위 설계이며, 여기서는 글 파일을 만들지 않는다.

적용 규약은 기존 정본 그대로다 — `blog-rewrite-contract.md`(특히 **1.3 설명 순서 사다리**와 1.3.1의
분야별 실물 치환), `viz-design-standard.md`, `AGENTS.md`의 Definition of Done.

## 0. 조사 결과: 중복은 없고, 경계는 다섯 군데다

저장소 공개 글 713편과 knowledge graph의 concept 3,480개를 조사했다. 네 분야의 핵심 용어는
**등록된 concept가 하나도 없다.**

| 조회한 용어 | knowledge-graph 등록 |
|---|---|
| MOSFET · 트랜지스터 · 다이오드 · pn 접합 · 반도체 | 0건 |
| 커패시터 · 임피던스 · 연산 증폭기 | 0건 |
| 리소그래피 · 포토리소 · doping | 0건 |
| 임베디드 · 인터럽트 · RTOS · I2C · UART | 0건 |

즉 네 분야는 전부 신설이고, 기존 글과 겹치는 것은 아래 **다섯 경계뿐**이다. 각 경계에서 누가
무엇을 소유하는지를 먼저 정하고 쓴다. 정하지 않으면 `audit:graph`의 "concept는 한 글만 소유" 불변식에서
막힌다.

| 경계 | 기존 글이 소유 | 새 글이 소유 |
|---|---|---|
| 메모리 | `gpu/hw-memory` — DDR4/DDR5 세대, ECC, RDIMM, 채널 선택 | 반도체 — DRAM 셀 하나의 전하 저장과 파괴적 읽기, 리프레시가 필요한 이유 |
| 전력·열 | `gpu/hw-power-cooling` — 랙 입력 전력에서 열 제거까지 | 전자공학 — 전압을 만들어 내는 회로(스위칭 레귤레이터)와 그 손실 |
| 배선 | `gpu/gpu-interconnects` — PCIe·NVLink 토폴로지와 대역폭 | 전자공학 — 선이 언제 전송선이 되는가(반사·종단·상승 시간) |
| 하드웨어 신뢰 | `tee/hw-security`·`tee/tee-tcb` — TCB 경계와 측정 부팅 | 임베디드 — 부팅 체인에서 펌웨어가 실제로 하는 일과 갱신 |
| 연산 배열 | `gpu/gemmini-pe-mac-dataflow` — PE 한 칸의 데이터플로우 | 반도체 — 그 PE가 실리콘 면적·전력으로 환산되는 자리 |

`DMA`는 그래프에 48회 나오지만 전부 GPU·AI 문맥(TMA, copy engine)이다. 임베디드의 주변장치 DMA는
같은 이름의 다른 개념이므로, 임베디드 글에서 첫 등장 때 이 구분을 명시한다.

## 1. 대분류와 카테고리

네 분야를 **새 대분류 하나**에 넣는다. `cs`에 붙이면 AI 374편 옆에서 묻히고, 서로를 선수로 쓰는
사슬이 보이지 않는다.

- 대분류 slug: `electronics` (`DOMAIN_META`와 `CATEGORY_DOMAIN`에 등록)
- 카테고리 slug는 대분류 slug와 달라야 한다(`/electronics/electronics/...` 방지)

| 카테고리 | 이름 | 편수 | 소분류 |
|---|---|---|---|
| `circuits` | 회로가 지키는 것 | 6 | `conservation`(보존) · `dynamics`(시간과 주파수) · `amplify`(증폭과 되먹임) |
| `devices` | 소자가 하는 일 | 5 | `junction`(접합) · `switch`(스위치) |
| `fabrication` | 실리콘에 새기는 일 | 5 | `pattern`(패턴) · `yield-and-package`(수율과 포장) |
| `embedded` | 작은 컴퓨터를 다루는 일 | 6 | `mcu-core`(코어와 시간) · `peripherals`(바깥과의 연결) · `firmware`(펌웨어) |

카테고리 사이 순서는 `domain-reading-paths.ts`에, 카테고리 안 순서는 `category-reading-paths.ts`에
등록한다. **둘 다 등록해야 한다** — 경제 2단계에서 이걸 빠뜨려 새 글이 `그 밖의 분야`로 밀리고
전체 순서에서 선수 역전이 났다(2026-10-03에 수정).

## 2. 읽기 순서 — 22편

선수 사슬은 `회로 → 소자 → 제조 → 임베디드`다. 소자를 이해하려면 회로의 전압·전류가 필요하고,
제조를 이해하려면 소자가 무엇인지 알아야 하며, 임베디드는 앞의 셋이 만든 칩을 쓴다.

### 01 · circuits — 회로가 지키는 것 (6편)

1. `lumped-circuit-and-conservation` — 전하와 에너지가 보존된다는 것만으로 마디와 고리의 두 법칙이 나온다. **(이미 작성·커밋됨)**
2. `resistance-and-power-dissipation` — 같은 전류가 다른 열을 내는 이유, 그리고 직렬·병렬이 왜 그렇게 합쳐지는지
3. `storage-elements-and-transients` — 축전기와 코일은 상태를 가진다. 지수적으로 붙는 시간 상수의 출처
4. `steady-state-and-impedance` — 흔들리는 입력에서는 시간 미분이 곱셈이 된다. 임피던스가 복소수인 이유
5. `frequency-shaping-and-bode` — 어떤 주파수를 남기고 어떤 것을 버리는지, 그리고 그 경계가 왜 완만한지
6. `feedback-gain-and-stability` — 되먹임이 이득을 깎는 대신 사 오는 것, 그리고 위상이 돌면 발진하는 자리

### 02 · devices — 소자가 하는 일 (5편)

7. `carriers-and-doping` — 순수한 결정은 왜 거의 절연체이고, 불순물 하나가 무엇을 바꾸는지
8. `pn-junction-and-rectification` — 접합이 한쪽으로만 흐르게 만드는 구조와 그 지수적 특성
9. `mos-capacitor-and-inversion` — 전극에 전압을 걸면 반대 종류의 전하가 표면에 모인다
10. `mosfet-regions-and-transfer` — 문턱 아래·선형·포화 세 구간과, 디지털이 쓰는 것은 그중 둘뿐이라는 점
11. `switching-energy-and-leakage` — 한 번 뒤집는 데 드는 에너지와, 꺼도 새는 전류

### 03 · fabrication — 실리콘에 새기는 일 (5편)

12. `wafer-and-planar-process` — 왜 평면 위에 층을 쌓는 방식이 이겼는지
13. `lithography-and-resolution` — 빛의 파장이 정하는 한계와 그 한계를 미루는 방법들
14. `doping-and-thermal-budget` — 넣는 것과 퍼지는 것, 그리고 온도가 예산인 이유
15. `interconnect-and-rc-delay` — 소자가 빨라져도 선이 느려지는 교차점
16. `yield-defect-and-packaging` — 면적이 수율을 먹는 셈, 그래서 칩을 쪼개 다시 붙이는 쪽으로 간 이유

### 04 · embedded — 작은 컴퓨터를 다루는 일 (6편)

17. `mcu-memory-map-and-registers` — 주소 하나에 쓰면 핀이 움직인다는 것의 의미
18. `interrupts-and-latency-budget` — 언제 올지 모르는 일을 다루는 구조와, 최악의 지연을 세는 법
19. `timers-and-sampling` — 시간을 세는 것과 바깥을 숫자로 바꾸는 것
20. `serial-buses-and-tradeoffs` — 선 수·속도·거리·중재를 맞바꾼 세 가지 방식
21. `scheduling-and-real-time` — 마감이 있는 일을 섞을 때 지킬 수 있는지 미리 판정하는 조건
22. `firmware-update-and-recovery` — 고칠 수 없는 자리에 놓인 코드를 고치는 방법과 벽돌이 되지 않는 구조

## 3. 1차 자료 후보 — 반드시 열어 읽고 확인할 것

아래는 **후보**이며 열람 가능 여부를 확인하지 않았다. 각 글은 1.3.1대로 원문의 식·표·문장을
실제로 열어 대조하고, 구하지 못하면 `보충 읽기`로만 두고 본문이 거기 기대지 않게 한다.

| 글 | 1차 자료 후보 | 비고 |
|---|---|---|
| 8 `pn-junction` | Shockley, *The Theory of p-n Junctions in Semiconductors*, BSTJ 28(3), 1949 | BSTJ는 공개 아카이브가 있는 편 |
| 10 `mosfet-regions` | Sah, *Characteristics of the Metal-Oxide-Semiconductor Transistors*, IEEE TED 11(7), 1964 | 유료일 가능성 |
| 11 `switching-energy` | Dennard et al., *Design of Ion-Implanted MOSFET's with Very Small Physical Dimensions*, JSSC 9(5), 1974 | 스케일링 법칙의 원문 |
| 13 `lithography` | Rayleigh, *On the Theory of Optical Images*, Phil. Mag. 42, 1896 | 1896년이라 공개 |
| 16 `yield-defect` | Moore, *Cramming more components onto integrated circuits*, Electronics 38(8), 1965 | 공개본 다수. **원문이 실제로 말한 것은 비용 최소 지점의 이동**이며 "2년마다 2배"가 아니다 — 이 정정이 글의 축 |
| 21 `scheduling` | Liu·Layland, *Scheduling Algorithms for Multiprogramming in a Hard-Real-Time Environment*, JACM 20(1), 1973 | RMS 이용률 한계의 원문 |
| 1~6 회로 | 원 논문보다 **공식 규격·데이터시트**가 1차 자료에 가깝다 | 1.3.1의 "실물"을 데이터시트 표로 치환 |
| 20 `serial-buses` | NXP I²C-bus specification(UM10204), ISO 11898(CAN) | 공식 규격 문서 |

## 4. 이 설계가 지켜야 할 것

- 22편 전부가 1.3 층위 사다리를 따른다. 특히 **수치가 이름보다 먼저** — `MOSFET`·`임피던스` 같은
  이름은 그 일을 하는 작은 수치 사례를 보인 뒤에만 쓴다. 글의 앞 1/5에 부품 이름을 두지 않는다.
- 층위 5·6의 실물은 **원 논문의 식·표**이거나 **공식 데이터시트·규격의 표**다. 교과서 재서술은 실물이 아니다.
- 각 글은 기초 6문제·심화 4문제를 본문보다 **먼저** 만든다(`audit:learning`이 개수를 강제한다).
- 선수 사슬이 수학·물리로 내려가는 지점(복소수, 지수함수, 전자기)은 그래프에 `prerequisite`로
  등록하고, 정본이 없으면 미완료 작업으로 남긴다. 링크만 던지지 않는다.
- 2장의 다섯 경계에 해당하는 글을 쓸 때는 기존 글의 anchor로 연결하고 정의를 복제하지 않는다.
