import OverviewViz from './viz/OverviewViz';
import M from '@/components/ui/math';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

export default function Overview({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const open = (key: string) => onCodeRef(key, codeRefs[key]);
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">R1CS → QAP 변환</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          모든 계산을 "곱셈 하나"의 형태로 분해 — R1CS (Rank-1 Constraint System)
          <br />
          A·s * B·s = C·s — 덧셈은 선형결합으로 흡수, 제약 불필요
          <br />
          곱셈 하나가 제약 하나. 복잡한 프로그램도 곱셈 단위로 쪼개면 R1CS로 표현 가능
        </p>
        <p className="leading-7">
          R1CS 행렬의 각 열을 Lagrange 보간하면 다항식 aⱼ(x), bⱼ(x), cⱼ(x) 생성 — QAP
          <br />
          m개의 등식 검사를 하나의 다항식 항등식 a(x)·b(x) - c(x) = h(x)·t(x)로 압축
          <br />
          Schwartz-Zippel: 랜덤 점 τ에서 성립하면 전체 다항식이 같을 확률 압도적
        </p>
      </div>
      <div className="not-prose mb-8">
        <OverviewViz onOpenCode={open} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h4>구현 인사이트</h4>
        <p className="leading-7">
          도메인을 단순 {'{1, 2, ..., m}'}으로 선택 — 교육용으로 O(n^2) Lagrange 보간 사용
          <br />
          프로덕션 구현은 roots of unity를 도메인으로 써서 FFT 기반 O(n log n) 보간 가능
          <br />
          열이 전부 0인 변수는 보간 생략 — 희소 행렬 최적화로 불필요한 연산 절약
        </p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Groth16 R1CS → QAP 수학</h3>

        {/* 입력 정의 */}
        <div className="bg-muted/50 rounded-lg p-4 mb-4">
          <h4 className="font-semibold mb-2">입력: R1CS 인스턴스</h4>
          <div className="grid grid-cols-1 gap-1 text-sm">
            <p><M>{'A, B, C'}</M>: <M>{'m \\times n'}</M> 행렬 (over <M>{'\\mathbb{F}_p'}</M>), witness 벡터 <M>{'\\mathbf{s}'}</M> (길이 <M>{'n'}</M>)</p>
            <p>제약 <M>{'i'}</M>: <M display>{'(A_i \\cdot \\mathbf{s}) \\times (B_i \\cdot \\mathbf{s}) = C_i \\cdot \\mathbf{s}'}</M></p>
            <p className="text-muted-foreground">목표 — <M>{'m'}</M>개의 제약을 하나의 다항식 항등식으로 압축</p>
          </div>
        </div>

        {/* Step 1: 평가 도메인 */}
        <div className="bg-muted/50 rounded-lg p-4 mb-4">
          <h4 className="font-semibold mb-2">Step 1. 평가 도메인 <M>{'H'}</M> 선택</h4>
          <p className="text-sm mb-2"><M>{'H = \\{h_1, h_2, \\ldots, h_m\\}'}</M> — <M>{'\\mathbb{F}_p'}</M> 위의 서로 다른 <M>{'m'}</M>개 점</p>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-background rounded p-3">
              <p className="font-medium mb-1">교육용</p>
              <p><M>{'H = \\{1, 2, \\ldots, m\\}'}</M></p>
              <p className="text-muted-foreground">단순, <M>{'O(m^2)'}</M> Lagrange</p>
            </div>
            <div className="bg-background rounded p-3">
              <p className="font-medium mb-1">프로덕션</p>
              <p><M>{'H = \\{\\omega^0, \\ldots, \\omega^{m-1}\\}'}</M></p>
              <p className="text-muted-foreground">Unity roots, <M>{'O(m \\log m)'}</M> NTT/FFT</p>
            </div>
          </div>
        </div>

        {/* Step 2: 열 보간 */}
        <div className="bg-muted/50 rounded-lg p-4 mb-4">
          <h4 className="font-semibold mb-2">Step 2. 열별 Lagrange 보간</h4>
          <div className="text-sm space-y-1">
            <p>열 <M>{'j'}</M> (<M>{'j = 1 \\ldots n'}</M>)에 대해:</p>
            <p className="ml-4"><M>{'A_j(x)'}</M>: 점 <M>{'\\{(h_i, A[i][j])\\}_i'}</M> 를 지나는 보간 다항식</p>
            <p className="ml-4"><M>{'B_j(x)'}</M>, <M>{'C_j(x)'}</M>: 동일 방식</p>
            <p className="text-muted-foreground">각 다항식의 차수 = <M>{'m-1'}</M>, 변수 <M>{'j'}</M>가 모든 제약에 걸쳐 기여하는 정도를 나타냄</p>
          </div>
        </div>

        {/* Step 3: 가중 합 */}
        <div className="bg-muted/50 rounded-lg p-4 mb-4">
          <h4 className="font-semibold mb-2">Step 3. Witness 가중 합</h4>
          <M display>{'A(x) = \\sum_{j=1}^{n} s_j \\cdot A_j(x), \\quad B(x) = \\sum_{j=1}^{n} s_j \\cdot B_j(x), \\quad C(x) = \\sum_{j=1}^{n} s_j \\cdot C_j(x)'}</M>
          <p className="text-sm text-muted-foreground mt-2">도메인 점 <M>{'h_i'}</M>에서: <M>{'A(h_i) = A_i \\cdot \\mathbf{s}'}</M>, <M>{'B(h_i) = B_i \\cdot \\mathbf{s}'}</M>, <M>{'C(h_i) = C_i \\cdot \\mathbf{s}'}</M></p>
        </div>

        {/* Step 4: 동치 */}
        <div className="bg-muted/50 rounded-lg p-4 mb-4">
          <h4 className="font-semibold mb-2">Step 4. 다항식 동치</h4>
          <div className="text-sm space-y-2">
            <p>R1CS 만족 ⟺ <M>{'A(h_i) \\cdot B(h_i) = C(h_i)'}</M> (모든 <M>{'i = 1 \\ldots m'}</M>)</p>
            <p>⟺ <M>{'p(x) := A(x) \\cdot B(x) - C(x)'}</M> 가 모든 <M>{'h_i'}</M>에서 0</p>
            <p>⟺ 소멸 다항식 <M>{'t(x) = \\prod_i (x - h_i)'}</M> 가 <M>{'p(x)'}</M> 를 나눔</p>
            <M display>{'p(x) = A(x) \\cdot B(x) - C(x) = t(x) \\cdot h(x)'}</M>
          </div>
        </div>

        {/* Step 5: Schwartz-Zippel */}
        <div className="bg-muted/50 rounded-lg p-4 mb-4">
          <h4 className="font-semibold mb-2">Step 5. Schwartz-Zippel 검사</h4>
          <div className="grid grid-cols-2 gap-3 text-sm mb-2">
            <div className="bg-background rounded p-2">
              <p><M>{'\\deg(A), \\deg(B), \\deg(C) \\leq m{-}1'}</M></p>
              <p><M>{'\\deg(p) \\leq 2(m{-}1)'}</M></p>
            </div>
            <div className="bg-background rounded p-2">
              <p><M>{'\\deg(t) = m'}</M></p>
              <p><M>{'\\deg(h) \\leq m{-}2'}</M></p>
            </div>
          </div>
          <p className="text-sm">랜덤 <M>{'\\tau \\in \\mathbb{F}_p'}</M>에서: <M>{'A(\\tau) \\cdot B(\\tau) - C(\\tau) = t(\\tau) \\cdot h(\\tau)'}</M></p>
          <p className="text-sm text-muted-foreground">거짓 증명 통과 확률 ≤ <M>{'2m / |\\mathbb{F}_p|'}</M> — <M>{'|\\mathbb{F}_p| \\approx 2^{254}'}</M>, <M>{'m \\approx 10^6'}</M> 일 때 ≈ <M>{'2^{-228}'}</M> (무시할 수준)</p>
        </div>

        {/* Step 6: 커밋 */}
        <div className="bg-muted/50 rounded-lg p-4 mb-4">
          <h4 className="font-semibold mb-2">Step 6. 다항식 커밋 (Groth16)</h4>
          <div className="text-sm space-y-1">
            <p>Trusted setup이 <M>{'[g^{\\tau^k}]_1'}</M>, <M>{'[g^{\\tau^k}]_2'}</M> 제공 (<M>{'k = 0 \\ldots 2m'}</M>)</p>
            <p><M>{'A(x) = \\sum_k a_k x^k'}</M> 일 때 커밋: <M>{'[A(\\tau)]_1 = \\sum_k a_k \\cdot [g^{\\tau^k}]_1'}</M></p>
            <p className="text-muted-foreground">KZG 스타일 커밋 — pairing-friendly curve에서 동작</p>
          </div>
        </div>

        {/* 프로덕션 최적화 */}
        <div className="bg-muted/50 rounded-lg p-4 mb-4">
          <h4 className="font-semibold mb-2">프로덕션 최적화</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div className="bg-background rounded p-3">
              <p className="font-medium">Unity roots 도메인</p>
              <p><M>{'t(x) = x^m - 1'}</M>, <M>{'\\tau'}</M> 평가 = <M>{'\\tau^m - 1'}</M> — <M>{'O(\\log m)'}</M></p>
            </div>
            <div className="bg-background rounded p-3">
              <p className="font-medium">희소 열 보간 생략</p>
              <p>열 전체가 0이면 <M>{'A_j(x) = 0'}</M> — 보간 스킵</p>
            </div>
            <div className="bg-background rounded p-3">
              <p className="font-medium">Batch MSM</p>
              <p>Pippenger 알고리즘, <M>{'O(n / \\log n)'}</M> 스칼라 곱</p>
            </div>
            <div className="bg-background rounded p-3">
              <p className="font-medium">병렬 FFT / GPU</p>
              <p>멀티스레드 butterfly, CUDA 가속</p>
            </div>
            <div className="bg-background rounded p-3 sm:col-span-2">
              <p className="font-medium">메모리 효율 QAP</p>
              <p>열을 스트리밍 처리 — <M>{'10^7'}</M>+ 제약 회로에 필수</p>
            </div>
          </div>
        </div>

        {/* 실전 회로 크기 */}
        <div className="bg-muted/50 rounded-lg p-4">
          <h4 className="font-semibold mb-2">실전 회로 크기</h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
            <div className="bg-background rounded p-2 text-center">
              <p className="font-medium">Small</p>
              <p>Zcash Sapling</p>
              <p className="text-muted-foreground">~30K</p>
            </div>
            <div className="bg-background rounded p-2 text-center">
              <p className="font-medium">Medium</p>
              <p>DEX privacy</p>
              <p className="text-muted-foreground">~100K</p>
            </div>
            <div className="bg-background rounded p-2 text-center">
              <p className="font-medium">Large</p>
              <p>zkEVM batch</p>
              <p className="text-muted-foreground">~50M</p>
            </div>
            <div className="bg-background rounded p-2 text-center">
              <p className="font-medium">Very Large</p>
              <p>zkRollup</p>
              <p className="text-muted-foreground">100M+</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-2">Prover 시간: FFT 기반 <M>{'O(n \\log n)'}</M></p>
        </div>
      </div>
    </section>
  );
}
