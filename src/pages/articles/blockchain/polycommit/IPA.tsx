import CodePanel from '@/components/ui/code-panel';
import {
  IPA_CODE, IPA_ANNOTATIONS,
  MARLIN_CODE, MARLIN_ANNOTATIONS,
} from './IPAData';

export default function IPA({ title }: { title?: string }) {
  return (
    <section id="ipa" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? 'IPA & Marlin PC'}</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>IPA PC</strong>는 신뢰할 수 있는 설정이 불필요한 이산로그 기반 스킴이며,
          <strong>Marlin PC</strong>는 KZG10에 차수 제한 강제와 은닉성을 추가한 확장입니다.<br />
          두 스킴은 각각 투명성과 기능성에서 KZG10을 보완합니다.
        </p>

        <h3>IPA PC (Inner Product Argument)</h3>
        <CodePanel title="투명 설정 & 재귀 halving" code={IPA_CODE}
          annotations={IPA_ANNOTATIONS} />

        <h3>Marlin PC (차수 제한 강제)</h3>
        <CodePanel title="shifted_commitment & 배치 검증" code={MARLIN_CODE}
          annotations={MARLIN_ANNOTATIONS} />
      </div>
    </section>
  );
}
