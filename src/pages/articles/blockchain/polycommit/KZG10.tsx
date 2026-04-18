import M from '@/components/ui/math';
import CodePanel from '@/components/ui/code-panel';
import KZG10FlowViz from './viz/KZG10FlowViz';
import {
  SETUP_CODE, SETUP_ANNOTATIONS,
  COMMIT_CODE, COMMIT_ANNOTATIONS,
} from './KZG10Data';

export default function KZG10({ title }: { title?: string }) {
  return (
    <section id="kzg10" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? 'KZG10 구현 상세'}</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>KZG10</strong>(Kate-Zaverucha-Goldberg, 2010)은 가장 기본적인 페어링 기반
          다항식 커밋먼트 스킴입니다. O(1) 크기의 증명과 O(1) 검증 시간이 핵심 장점이며,
          trusted setup이 필요합니다.
        </p>
      </div>

      <KZG10FlowViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>Trusted Setup (SRS 생성)</h3>
        <CodePanel title="setup() — powers of beta 계산" code={SETUP_CODE}
          annotations={SETUP_ANNOTATIONS} />

        <h3>커밋 & Hiding 메커니즘</h3>
        <CodePanel title="commit() — MSM + hiding" code={COMMIT_CODE}
          annotations={COMMIT_ANNOTATIONS} />

        <h3 className="text-xl font-semibold mt-6 mb-3">KZG10 수식</h3>

        {/* Setup */}
        <div className="not-prose rounded-lg border-l-4 border-l-amber-500 bg-card p-4 mb-4">
          <div className="text-sm font-semibold mb-2">Setup (Trusted)</div>
          <p className="text-sm text-muted-foreground mb-2">
            비밀 랜덤값 <M>{'\\tau'}</M> (toxic waste)를 선택한 뒤 SRS를 생성한다. <M>{'G, H'}</M>는 타원곡선 생성원.
          </p>
          <M display>{'\\text{SRS} = (\\underbrace{G,\\; \\tau G,\\; \\tau^2 G,\\; \\dots,\\; \\tau^d G}_{\\text{G₁ 원소 d+1개}},\\; \\underbrace{H,\\; \\tau H}_{\\text{G₂ 원소 2개}})'}</M>
          <p className="text-sm text-muted-foreground mt-2">
            <M>{'G'}</M>: 타원곡선 그룹 <M>{'\\mathbb{G}_1'}</M>의 생성원, <M>{'H'}</M>: <M>{'\\mathbb{G}_2'}</M>의 생성원, <M>{'\\tau'}</M>: 비밀 랜덤값 (toxic waste — 생성 후 반드시 삭제), <M>{'d'}</M>: 지원 가능한 최대 다항식 차수.
          </p>
        </div>

        {/* Commit */}
        <div className="not-prose rounded-lg border bg-card p-4 mb-4">
          <div className="text-sm font-semibold mb-2">Commit (MSM)</div>
          <M display>{'p(x) = \\underbrace{c_0}_{\\text{상수항}} + \\underbrace{c_1 x}_{\\text{1차항}} + \\underbrace{c_2 x^2}_{\\text{2차항}} + \\cdots + \\underbrace{c_d x^d}_{\\text{최고차항}}'}</M>
          <p className="text-sm text-muted-foreground mt-2">
            <M>{'c_i'}</M>: 다항식의 <M>i</M>번째 계수 (유한체 원소), <M>{'d'}</M>: 다항식 차수.
          </p>
          <M display>{'C = \\underbrace{p(\\tau) \\cdot G}_{\\text{커밋먼트 (EC 점)}} = \\underbrace{c_0 G + c_1(\\tau G) + \\cdots + c_d(\\tau^d G)}_{\\text{Multi-Scalar Multiplication (MSM)}}'}</M>
          <p className="text-sm text-muted-foreground mt-2">
            <M>{'C'}</M>: 커밋먼트 (타원곡선 점 1개), MSM: 각 계수 <M>{'c_i'}</M>와 SRS 원소 <M>{'\\tau^i G'}</M>의 스칼라 곱을 합산.
          </p>
        </div>

        {/* Open + Verify */}
        <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-semibold mb-2">Open (증명 생성)</div>
            <p className="text-sm text-muted-foreground mb-2">
              점 <M>z</M>에서 <M>{'p(z) = v'}</M> 주장. 몫 다항식을 계산:
            </p>
            <M display>{'q(x) = \\frac{\\overbrace{p(x) - v}^{\\text{평가값 차감}}}{\\underbrace{x - z}_{\\text{평가 지점}}}'}</M>
            <p className="text-sm text-muted-foreground mt-2">
              <M>{'q(x)'}</M>: 몫 다항식 — <M>{'p(z)=v'}</M>이면 <M>{'(x-z)'}</M>가 <M>{'p(x)-v'}</M>를 정확히 나눔. 증명: <M>{'\\pi = q(\\tau) \\cdot G'}</M> (EC 점 1개).
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-semibold mb-2">Verify (페어링 검증)</div>
            <M display>{'e(\\underbrace{C - vG}_{\\text{커밋 - 평가값}},\\; \\underbrace{H}_{\\text{G₂ 생성원}}) \\stackrel{?}{=} e(\\underbrace{\\pi}_{\\text{증명}},\\; \\underbrace{\\tau H - z H}_{\\text{(τ-z)·H}})'}</M>
            <p className="text-sm text-muted-foreground mt-2">
              <M>{'e'}</M>: 쌍선형 페어링 함수 (<M>{'\\mathbb{G}_1 \\times \\mathbb{G}_2 \\to \\mathbb{G}_T'}</M>). 양변이 같으면 <M>{'p(z)=v'}</M> 성립 — 상수 시간 <M>{'O(1)'}</M> 검증.
            </p>
          </div>
        </div>

        {/* 수학적 원리 */}
        <div className="not-prose rounded-lg border-l-4 border-l-blue-500 bg-card p-4 mb-4">
          <div className="text-sm font-semibold mb-2">수학적 원리</div>
          <p className="text-sm text-muted-foreground mb-2">
            <M>{'x = z'}</M>일 때 <M>{'p(x) - v = 0'}</M> &rarr; <M>{'(x - z)'}</M>가 <M>{'p(x) - v'}</M>를 나눔.
          </p>
          <M display>{'\\underbrace{p(x) - v}_{\\text{x=z일 때 0}} = \\underbrace{(x - z)}_{\\text{근 인수}} \\cdot \\underbrace{q(x)}_{\\text{몫 다항식}}'}</M>
          <p className="text-sm text-muted-foreground mt-2 mb-2">
            <M>{'x = \\tau'}</M> 대입 후 pairing으로 EC 점에서 검증:
          </p>
          <M display>{'\\underbrace{e(C - vG,\\; H)}_{\\text{좌변: 커밋 검증}} = \\underbrace{e(q(\\tau)G,\\; (\\tau - z)H)}_{\\text{τ 대입 전개}} = \\underbrace{e(\\pi,\\; \\tau H - zH)}_{\\text{우변: 증명 검증}}'}</M>
          <p className="text-sm text-muted-foreground mt-2">
            페어링의 쌍선형성 <M>{'e(aG, bH) = e(G,H)^{ab}'}</M>에 의해 좌변과 우변이 동일. <M>{'\\tau'}</M>를 모르는 검증자도 SRS의 <M>{'\\tau H'}</M>로 검증 가능.
          </p>
        </div>

        {/* 장단점 */}
        <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mb-2">장점</div>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>Constant proof size (48~96 bytes)</li>
              <li><M>{'O(1)'}</M> verification</li>
              <li>Batch verification 가능</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-semibold text-red-600 dark:text-red-400 mb-2">단점</div>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>Trusted setup 필수</li>
              <li>Pairing 필요 (BN254, BLS12-381)</li>
              <li>Post-quantum 안전하지 않음</li>
              <li>SRS 크기 = 다항식 차수에 비례</li>
            </ul>
          </div>
        </div>

        {/* 사용처 */}
        <div className="not-prose rounded-lg border bg-card p-4 mb-4">
          <div className="text-sm font-semibold mb-2">사용처</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-muted-foreground">
            <div className="rounded bg-muted/50 p-2 text-center">PLONK</div>
            <div className="rounded bg-muted/50 p-2 text-center">Sonic, Marlin</div>
            <div className="rounded bg-muted/50 p-2 text-center">EIP-4844 (blobs)</div>
            <div className="rounded bg-muted/50 p-2 text-center">Dfinity, Mina, Aztec</div>
          </div>
        </div>
      </div>
    </section>
  );
}
