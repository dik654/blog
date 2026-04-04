import { CitationBlock } from '../../../../components/ui/citation';
import CodePanel from '@/components/ui/code-panel';

export default function SpeculativeDecoding() {
  return (
    <>
      <h3 className="text-xl font-semibold mt-6 mb-3">Speculative Decoding</h3>
      <CodePanel title="추측 디코딩 원리" code={`Speculative Decoding (추측 디코딩):

일반 디코딩:
  [토큰1] → [토큰2] → [토큰3] → ...
  매번 대형 모델 실행 (느림)

추측 디코딩:
  1. Draft 모델(소형)이 K개 토큰 빠르게 생성
     draft: [토큰1, 토큰2, 토큰3, 토큰4, 토큰5]
  2. Target 모델(대형)이 한 번에 검증
     verify: [✓, ✓, ✓, ✗, -]
     → 3개 수락, 4번째부터 재생성

vLLM 지원 방식:
  EAGLE 1/3:   Feature-level draft (최대 2.5x 가속)
  MTP:         Multi-Token Prediction 헤드 활용
  별도 Draft:  Llama-70B + Llama-7B 조합
  n-gram:      입력 패턴 기반 추측 (모델 불필요)`} annotations={[
        { lines: [3, 5], color: 'rose', note: '기존 방식 — 순차 실행' },
        { lines: [7, 12], color: 'emerald', note: 'Draft + Verify로 병렬 가속' },
        { lines: [14, 18], color: 'sky', note: 'vLLM 지원 방식 목록' },
      ]} />

      <CitationBlock source="Li et al., ICML 2024 — EAGLE" citeKey={8} type="paper"
        href="https://arxiv.org/abs/2401.15077">
        <p className="italic">
          "EAGLE (Extrapolation Algorithm for Greater Language-model Efficiency) proposes drafting
          at the feature level rather than the token level... EAGLE achieves a speedup ratio of
          2.13x-3.06x across various tasks, significantly outperforming existing methods."
        </p>
        <p className="mt-2 text-xs">
          EAGLE — 토큰 수준이 아닌 feature 수준에서 draft하여 수락률 향상.
          vLLM에서 EAGLE 1/3 두 버전 모두 지원
        </p>
      </CitationBlock>
    </>
  );
}
