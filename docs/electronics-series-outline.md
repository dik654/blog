# 전자 분야 22편 읽기 지도

작성·검수: 2026-10-03 · 상태: **22편 작성 완료**. 실제 글 목록과 링크의 정본은 `src/content/{circuits,semiconductors,devices,embedded}/articles.ts`이며, 이 문서는 설계 결과와 읽기 순서를 설명한다.

## 읽는 순서

`electronics` 대분류에 네 카테고리를 둔다. 회로에서 전압·전류의 계산을 시작하고, 반도체 재료와 제조 조건을 본 뒤 소자의 동작, 칩 위 프로그램의 시간·복구로 이어진다. 반도체 카테고리의 제조 다섯 편은 소자 물리를 읽기 전에도 독립적으로 읽을 수 있는 생산 관점이다.

| 카테고리 | 편수 | 실제 소분류 | 읽기 입구 |
|---|---:|---|---|
| `circuits` | 6 | `circuit-foundations` · `circuit-dynamics` | 12 V 저항망의 갈림길과 전력 검산 |
| `semiconductors` | 6 | `semiconductor-physics` · `semiconductor-fabrication` | 전자·정공 수에서 웨이퍼·배선·수율까지 |
| `devices` | 4 | `junction-devices` · `field-effect-devices` | 접합과 산화막 표면의 전하 |
| `embedded` | 6 | `embedded-hardware` · `embedded-software` | RP2040 GPIO5에서 펌웨어 복구까지 |

### 회로 6편

1. `lumped-circuit-and-conservation` — 마디·고리의 보존 법칙
2. `resistance-and-power-dissipation` — 저항망의 전류·발열·정격
3. `storage-elements-and-transients` — RC·RL의 저장과 시간 상수
4. `steady-state-and-impedance` — 정현파와 복소 임피던스
5. `frequency-shaping-and-bode` — 주파수 응답과 Bode 그림
6. `feedback-gain-and-stability` — 되먹임 이득과 위상 여유

### 반도체 6편

7. `bands-and-doping` — 에너지띠와 도핑. 최초 설계의 `carriers-and-doping`을 소자 카테고리에서 이 자리로 옮겼다.
8. `wafer-and-planar-process` — 웨이퍼 평면 공정
9. `lithography-and-resolution` — 노광 해상도와 층 정렬
10. `doping-and-thermal-budget` — 확산과 누적 열 예산
11. `interconnect-and-rc-delay` — 금속 배선의 RC 지연
12. `yield-defect-and-packaging` — 결함 면적·수율·조립 시험

### 소자 4편

13. `pn-junction-and-rectification` — 접합 장벽과 정류
14. `mos-capacitor-and-inversion` — 산화막 표면의 축적·공핍·반전
15. `mosfet-regions-and-transfer` — MOSFET의 동작 영역
16. `switching-energy-and-leakage` — CMOS 전환 에너지와 누설

### 임베디드 6편

17. `mcu-memory-map-and-registers` — 주소·마스크·GPIO 레지스터
18. `interrupts-and-latency-budget` — 인터럽트 경로와 최악 지연
19. `timers-and-sampling` — 타이머·ADC와 샘플링 오류
20. `serial-buses-and-tradeoffs` — I²C·SPI·UART 거래 시간
21. `scheduling-and-real-time` — 여러 작업의 마감과 자원 대기
22. `firmware-update-and-recovery` — 두 앱 슬롯·시험 부팅·되돌리기

## 편집과 검증 기준

- 각 글은 하나의 수치 사례를 본문·그림·수식·연습문제에 재사용하고, 낯선 부품 이름보다 그 부품이 해결하는 문제를 먼저 보여 준다. 끝에는 답의 위치가 적힌 예측 질문을 둔다. 이 기준은 `docs/blog-rewrite-contract.md` 1.3의 이해 중심 설명 순서를 따른다.
- 원논문·공식 데이터시트·규격·공식 강의 자료에서 실제 확인한 범위와 교육용 가정 수치를 분리한다. 접근하지 못한 원전을 읽은 것처럼 쓰지 않는다. 자료별 확인 사항은 각 글의 `CitationBlock`과 `article-evidence.ts`에 남긴다.
- 모든 글은 기초 6·심화 4문제, 개념 그래프, 소유권, topology 결정을 등록했다. 물리 개념에는 관측량·단위·전제·측정 예·성립 경계가 있다.
- `docs/rewrite-status.md`의 전자 분야 기록에 글별 사례·자료·감사·빌드·1440px/390px 브라우저 결과를 남겼다. 대분류·카테고리 읽기 순서는 `domain-reading-paths.ts`와 `category-reading-paths.ts`가 소유한다.
