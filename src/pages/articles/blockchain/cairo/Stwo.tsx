import CodePanel from '@/components/ui/code-panel';
import StwoProveViz from './viz/StwoProveViz';
import {
  PROVE_CODE, PROVE_ANNOTATIONS,
  VERIFY_CODE, VERIFY_ANNOTATIONS,
} from './StwoData';

export default function Stwo({ title }: { title?: string }) {
  return (
    <section id="stwo" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? 'S-two 증명 시스템 연동'}</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>S-two Cairo</strong>는 StarkWare의 차세대 영지식 증명 시스템으로,
          Circle STARKs 기반의 혁신적인 암호학 기술을 사용합니다.<br />
          Cairo 프로그램의 실행을 증명하고 검증하는 핵심 컴포넌트입니다.
        </p>
      </div>

      <StwoProveViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>증명 생성 파이프라인</h3>
        <CodePanel title="cairo-prove → adapter → prove" code={PROVE_CODE}
          annotations={PROVE_ANNOTATIONS} />

        <h3>검증 & 보안 설정</h3>
        <CodePanel title="PcsConfig & 온체인 검증기" code={VERIFY_CODE}
          annotations={VERIFY_ANNOTATIONS} />
      </div>
    </section>
  );
}
