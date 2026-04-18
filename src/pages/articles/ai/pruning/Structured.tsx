import StructuredViz from './viz/StructuredViz';

export default function Structured() {
  return (
    <section id="structured" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Structured Pruning: 채널/헤드 제거</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Unstructured — 개별 가중치를 0으로 → 행렬은 여전히 같은 크기, 0이 많을 뿐<br />
          <strong>Structured Pruning</strong> — 필터·채널·헤드를 통째로 제거 → 텐서 shape 자체가 축소<br />
          핵심 차이: Dense 행렬곱이 유지되므로 기존 하드웨어에서 바로 속도 향상
        </p>
      </div>
      <div className="not-prose my-8">
        <StructuredViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">Channel Pruning (CNN)</h3>
        <p>
          CNN의 Conv layer — 입력 C_in 채널 × 출력 C_out 필터<br />
          Channel Pruning: C_out 필터 중 "중요하지 않은" 필터를 통째로 제거<br />
          중요도 기준: L1-norm(Σ|w|), Taylor expansion, 또는 BN의 γ 파라미터<br />
          Li et al. (2017): L1-norm이 가장 단순하면서도 경쟁력 있음
        </p>
        <p>
          결과: 출력 텐서의 채널 수가 줄어듦 → 다음 layer의 입력도 축소<br />
          ResNet-56 on CIFAR-10: 필터 30% 제거 → 정확도 0.3% 하락, 속도 1.4배 향상
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Head Pruning (Transformer)</h3>
        <p>
          Multi-Head Attention의 각 head — 서로 다른 관점의 attention 패턴 학습<br />
          하지만 모든 head가 필수적이지는 않음 — 일부는 redundant<br />
          Michel et al. (2019): 16개 head 중 절반 제거해도 BLEU 0.5 이내 하락
        </p>
        <p>
          Head 중요도 측정: 해당 head를 마스킹(출력을 0으로)했을 때 loss 변화량<br />
          변화가 작은 head = 제거해도 무방<br />
          Voita et al. (2019): 위치 head, 구문 head, 드문 토큰 head — 역할별로 중요도가 다름
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Structured vs Unstructured: 현실적 비교</h3>
        <p>
          Unstructured 90% 희소 → 이론 10배 연산 감소, 실측 1.2~1.5배 (GPU 비효율)<br />
          Structured 50% → 이론 2배 감소, 실측 1.8~2배 (Dense 유지, cuBLAS 호환)<br />
          배포 환경에서는 Structured가 압도적으로 유리
        </p>

        <div className="bg-green-50 dark:bg-green-950/30 border-l-4 border-green-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: Structured Pruning의 핵심</p>
          <p>
            <strong>CNN</strong>: 채널 프루닝 → 모바일 배포의 사실상 표준 (MobileNet, EfficientNet과 결합)<br />
            <strong>Transformer</strong>: 헤드 프루닝 → DistilBERT, TinyBERT 등에서 활용<br />
            <strong>공통</strong>: 프루닝 비율은 layer마다 다르게 설정 (sensitivity analysis 필수)<br />
            얕은 layer는 범용 특징 → 적게 프루닝, 깊은 layer는 태스크 특화 → 많이 프루닝
          </p>
        </div>
      </div>
    </section>
  );
}
