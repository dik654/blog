export const E2E_CODE = `전체 파이프라인 (End-to-End):
  ① 회로 작성: 게이트 + 와이어 정의
  ② 컴파일: 선택자/순열 다항식 생성
  ③ SRS + 키생성: pk, vk 산출
  ④ 증명 생성: 5-Round 프로토콜
  ⑤ 검증: 페어링 2회 O(1)`;

export const PROVE_FLOW_CODE = `증명 생성 흐름:
  witness 대입 → Lagrange 보간 → 블라인딩
  → KZG commit (Round 1-3)
  → 평가 + 오프닝 (Round 4-5)

  복잡도:
    시간: O(n log n) — FFT/IFFT 지배적
    공간: O(n) — 다항식 계수 저장`;

export const VERIFY_FLOW_CODE = `검증 흐름:
  π + public_inputs → Fiat-Shamir 재생
  → 선형화 재구성 → 배치 KZG check

  복잡도:
    시간: O(1) — 페어링 2회 + G1 스칼라곱 수회
    공간: O(1) — 상수 개수의 점/스칼라`;

export const BENCHMARK_CODE = `성능 벤치마크 (대략적):
  회로 크기    증명 시간     검증 시간    증명 크기
  2¹⁰         ~50 ms       ~5 ms       768 B
  2¹⁶         ~800 ms      ~5 ms       768 B
  2²⁰         ~12 s        ~5 ms       768 B

  → 증명 크기와 검증 시간은 회로 크기에 무관!`;
