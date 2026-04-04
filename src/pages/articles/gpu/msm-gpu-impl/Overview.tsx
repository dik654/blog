import CodePanel from '@/components/ui/code-panel';

const msmFormula = `// MSM (Multi-Scalar Multiplication)
// 입력: n개의 (스칼라, 타원곡선 점) 쌍
// 출력: Q = s[0]*P[0] + s[1]*P[1] + ... + s[n-1]*P[n-1]
//
// 나이브 방법: O(n * 254) 점 덧셈 — 너무 느림
// Pippenger:  O(n / log n)  — 버킷 방식으로 공유 계수를 묶음

// Pippenger 버킷 방식 요약:
// 1) 254-bit 스칼라를 c-bit 윈도우로 분할 → ceil(254/c)개 윈도우
// 2) 각 윈도우에서 2^c개 버킷에 점을 분류·누적
// 3) 버킷을 삼각 합산하여 윈도우별 결과 생성
// 4) 윈도우 결과를 2^(j*c) 가중치로 최종 조합`;

const paramCode = `// 핵심 파라미터
//
// n = 2^20 ~ 2^26  (점의 개수, 보통 백만~수천만)
// c = log2(n)      (윈도우 비트 수, 보통 16~20)
// 2^c              (윈도우당 버킷 수)
// ceil(254/c)      (윈도우 수, 보통 13~16)
//
// 예시: n = 2^22 (약 4백만 점)
//   c = 22 → 버킷 2^22 = 4M, 윈도우 12개
//   c = 16 → 버킷 2^16 = 64K, 윈도우 16개  ← 메모리 효율적
//
// GPU에서 c가 클수록 버킷이 많아 메모리 부담 증가.
// c가 작으면 윈도우가 많아 반복 횟수 증가.
// 최적 c는 GPU VRAM과 n에 따라 튜닝한다.`;

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Pippenger를 GPU에 매핑하기</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>MSM</strong>은 수백만 개의 스칼라-점 쌍에 대해 <code>Q = sum(s_i * P_i)</code>를 계산하는 연산이다.<br />
          ZK 증명 시스템에서 증명 생성 시간의 60~80%를 차지한다.
        </p>
        <p>
          Pippenger의 버킷 방식은 스칼라를 c-bit 윈도우로 쪼갠 뒤,
          같은 윈도우 값을 가진 점들을 하나의 버킷에 모아 한 번에 더한다.<br />
          버킷 누적 단계에서 각 버킷은 완전히 독립적이므로 GPU의 대규모 병렬성과 정확히 맞아떨어진다.
        </p>
        <CodePanel title="MSM 정의와 Pippenger 요약" code={msmFormula} annotations={[
          { lines: [3, 5], color: 'sky', note: 'MSM 정의' },
          { lines: [10, 13], color: 'emerald', note: 'Pippenger 4단계' },
        ]} />

        <h3 className="text-xl font-semibold mt-8 mb-3">핵심 파라미터</h3>
        <p>
          윈도우 크기 c가 GPU 구현의 성능을 좌우한다.
          c가 크면 버킷 수가 기하급수적으로 늘어 GPU 메모리를 압박하고,
          c가 작으면 윈도우 수가 늘어 반복 연산이 증가한다.<br />
          실전에서는 c = 16 전후가 메모리와 연산의 균형점이다.
        </p>
        <CodePanel title="파라미터 선택과 트레이드오프" code={paramCode} annotations={[
          { lines: [3, 6], color: 'sky', note: '핵심 파라미터' },
          { lines: [8, 11], color: 'amber', note: '구체적 예시' },
          { lines: [13, 15], color: 'violet', note: '트레이드오프' },
        ]} />
      </div>
    </section>
  );
}
