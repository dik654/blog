import CodePanel from '@/components/ui/code-panel';
import { FRI_CODE, FRI_ANNOTATIONS } from './FRIData';

export default function FRI({ title }: { title?: string }) {
  return (
    <section id="fri" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? 'Linear Codes (Ligero/Brakedown)'}</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>Linear Codes</strong> 기반 PCS는 오류 정정 부호와 해시 함수만을 사용하여
          양자 컴퓨터에 대한 강한 저항성을 제공합니다.<br />
          대수적 구조에 의존하지 않으므로 투명한 설정이 가능합니다.
        </p>

        <h3>Linear Codes PCS 구현</h3>
        <CodePanel title="RS 인코딩 + Merkle Tree" code={FRI_CODE}
          annotations={FRI_ANNOTATIONS} />
      </div>
    </section>
  );
}
