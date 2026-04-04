import Math from '@/components/ui/math';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">HyperPLONK이란?</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>HyperPLONK</strong> — Binyi Chen, Benedikt Bunz, Dan Boneh, Zhenfei Zhang가 2022년에 제안한 증명 시스템
          <br />
          <a href="/blockchain/plonk" className="text-indigo-400 hover:underline">PLONK</a>의 핵심 구조를 유지하면서, 다항식 표현과 증명 전략을 근본적으로 교체한 설계
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">PLONK의 병목: FFT</h3>
        <p>
          PLONK은 <strong>단변수 다항식(univariate polynomial)</strong>으로 제약을 인코딩함
          <br />
          witness 다항식의 계수를 구하려면 <a href="/crypto/fft" className="text-indigo-400 hover:underline">FFT</a>가 필수 — 시간 복잡도 <Math>{'O(n \\log n)'}</Math>
          <br />
          FFT는 순차적 butterfly 연산이라 GPU/FPGA 병렬화에 비효율적
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">HyperPLONK의 해법</h3>
        <p>
          단변수 다항식 대신 <strong>다중선형 다항식(multilinear polynomial)</strong> 사용
          <br />
          FFT 대신 <strong>sumcheck 프로토콜</strong>로 제약 검증 — prover 복잡도 <Math>{'O(n)'}</Math>
          <br />
          commitment scheme도 KZG 대신 <strong>다중선형 PCS</strong>(Dory, Zeromorph 등)로 교체
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">핵심 구성 요소</h3>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg border p-4">
            <h4 className="font-medium text-sm mb-2">다중선형 확장 (MLE)</h4>
            <p className="text-sm">
              <Math>{'n'}</Math>개 변수, 각 변수 차수 최대 1
              <br />
              <Math>{'2^n'}</Math>개 평가값을 진리표처럼 인코딩
            </p>
          </div>
          <div className="rounded-lg border p-4">
            <h4 className="font-medium text-sm mb-2">Sumcheck 프로토콜</h4>
            <p className="text-sm">
              <Math>{'\\sum_{x \\in \\{0,1\\}^n} f(x) = T'}</Math> 검증
              <br />
              <Math>{'O(n)'}</Math> 라운드, 각 라운드 <Math>{'O(1)'}</Math> 통신
            </p>
          </div>
          <div className="rounded-lg border p-4">
            <h4 className="font-medium text-sm mb-2">다중선형 PCS</h4>
            <p className="text-sm">
              Dory — 투명 셋업, 로그 크기 증명
              <br />
              Zeromorph — KZG 기반 다중선형 commit
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
