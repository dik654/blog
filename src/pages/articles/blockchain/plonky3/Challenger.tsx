import CodePanel from '@/components/ui/code-panel';
import { DUPLEX_CODE, DUPLEX_ANNOTATIONS, USAGE_CODE, USAGE_ANNOTATIONS } from './ChallengerData';

export default function Challenger({ title }: { title?: string }) {
  return (
    <section id="challenger" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? 'Fiat-Shamir 챌린저'}</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>DuplexChallenger</strong>는 Poseidon2 스펀지 기반 Fiat-Shamir 변환을
          구현합니다. 증명자와 검증자가 동일한 순서로 데이터를 흡수(observe)하고
          챌린지를 샘플(sample)하여 비대화형 증명을 가능하게 합니다.
        </p>

        <h3>DuplexChallenger 구조</h3>
        <CodePanel title="스펀지 구조 & 흡수/듀플렉싱" code={DUPLEX_CODE}
          annotations={DUPLEX_ANNOTATIONS} />

        <h3>STARK 증명에서의 사용</h3>
        <CodePanel title="observe → sample 시퀀스" code={USAGE_CODE}
          annotations={USAGE_ANNOTATIONS} />
      </div>
    </section>
  );
}
