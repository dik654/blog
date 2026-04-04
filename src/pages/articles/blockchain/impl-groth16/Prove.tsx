import ProveViz from './viz/ProveViz';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

export default function Prove({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const open = (key: string) => onCodeRef(key, codeRefs[key]);
  return (
    <section id="prove" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">증명 생성 (Prover)</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          h(x) = (a(x)·b(x) - c(x)) / t(x) — QAP 만족 확인이 증명의 첫 단계
          <br />
          나머지가 0이 아니면 witness가 잘못된 것 — Option::None 즉시 반환
          <br />
          블라인딩 팩터 r, s를 매번 새로 생성 — 같은 witness여도 다른 증명
        </p>
        <p className="leading-7">
          A = [α]₁ + Σwⱼ[aⱼ(τ)]₁ + r[δ]₁ — 지식계수 + QAP + 블라인딩
          <br />
          B = [β]₂ + Σwⱼ[bⱼ(τ)]₂ + s[δ]₂ — G2 위에서 동일 구조
          <br />
          C = private기여 + h기여 + sA + rB' - rsδ — 세 항의 결합
        </p>
      </div>
      <div className="not-prose mb-8">
        <ProveViz onOpenCode={open} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h4>구현 인사이트</h4>
        <p className="leading-7">
          witness[j]=0인 변수는 MSM에서 건너뜀 — 스칼라 곱 비용이 가장 크므로 0 체크가 효과적
          <br />
          C의 블라인딩 sA+rB'-rsδ: 전개하면 교차항 rsδ가 소거되어 검증 방정식이 정확히 성립
          <br />
          B를 G1(B')과 G2(B) 두 곳에서 계산 — C에 r·B'이 필요해서 G1 버전도 유지
        </p>
      </div>
    </section>
  );
}
