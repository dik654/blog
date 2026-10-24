# AI Context state 경로 · Batch 35

## 범위

이번 묶음은 저장된 정보가 한 번의 생성 입력이 되고, 실행 권한·출처·기억 수명·token 제약을 통과하는 경로를 다섯 글로 나눕니다.

1. `context-engineering` — 저장소 후보에서 이번 생성의 context를 고릅니다.
2. `context-instruction-boundaries` — instruction·외부 자료·runtime 권한을 분리합니다.
3. `context-provenance-freshness` — source·revision·유효 시점·접근 범위를 함께 확인합니다.
4. `agent-memory-lifecycle` — working state·장기 기억·artifact의 수명과 복원 계약을 나눕니다.
5. `context-window-optimization` — token 예산·근거 위치·prefix 계산 재사용을 따로 측정합니다.

## 추적 사례

직원 A의 휴가 정책 질문과 결제 migration의 재개 사례를 사용합니다. 각 글은 하나의 판단만 소유하며, 다음 글이 필요한 이유를 직속 부모 지도에 되돌려 놓습니다.

`후보 선택 → 권한 경계 → 출처·최신성 → 기억 수명 → 예산·활용`

## 작성 원칙

- 본문 설명보다 먼저 같은 사례의 상태 변화를 시각화합니다.
- 저장된 정보, 모델 입력, 외부 효과를 하나의 context로 뭉뚱그리지 않습니다.
- capacity, utilization, freshness, cache hit를 서로 다른 검사로 둡니다.
- 동작 장면은 사용자가 재생하거나 이동할 때만 바뀝니다.
- JavaScript가 꺼져도 모든 단계와 결론을 같은 순서로 읽을 수 있게 합니다.

## 검증

- [x] TypeScript 검사
- [x] 전체 production build
- [x] 문서·학습·수식·계산·읽기 순서·한국어·용어·topology·runtime strict audit
- [x] 390×844 모바일과 1440×1000 데스크톱
- [x] 키보드 좌우 이동과 명시적 재생
- [x] reduced-motion에서 자동 진행 없음
- [x] JavaScript 비활성 상태에서 모든 장면과 결론 노출
- [ ] 공개 경로 배포 후 같은 검증 반복
