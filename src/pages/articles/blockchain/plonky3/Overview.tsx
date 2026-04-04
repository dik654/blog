import Plonky3CrateMapViz from '../components/Plonky3CrateMapViz';
import CrateArchViz from './viz/CrateArchViz';
import CodePanel from '@/components/ui/code-panel';
import { CRATE_MAP_CODE, BABYBEAR_CODE, CONFIG_CODE } from './OverviewData';
import { crateMapAnnotations, babyBearAnnotations, configAnnotations } from './OverviewAnnotations';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function Overview({ title, onCodeRef }: { title?: string; onCodeRef?: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? '개요 & 크레이트 구조'}</h2>
      <div className="not-prose mb-8"><CrateArchViz /></div>
      <div className="not-prose mb-8"><Plonky3CrateMapViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>Plonky3</strong>는 Polygon Labs가 개발한 모듈형 STARK 프레임워크로,
          SP1·Valida 등 여러 zkVM의 증명 백엔드로 사용됩니다.<br />
          필드·해시·커밋·FRI 등 각 컴포넌트가 독립 크레이트로 분리되어
          유연하게 조합할 수 있습니다.
        </p>
        {onCodeRef && (
          <div className="not-prose flex flex-wrap gap-2 my-4">
            <CodeViewButton onClick={() => onCodeRef('p3-babybear', codeRefs['p3-babybear'])} />
            <span className="text-[10px] text-muted-foreground self-center">baby_bear.rs</span>
            <CodeViewButton onClick={() => onCodeRef('p3-stark-config', codeRefs['p3-stark-config'])} />
            <span className="text-[10px] text-muted-foreground self-center">config.rs</span>
          </div>
        )}
        <CodePanel title="크레이트 맵" code={CRATE_MAP_CODE} annotations={crateMapAnnotations} />
        <CodePanel title="BabyBear 필드 (baby-bear/src/baby_bear.rs)" code={BABYBEAR_CODE} annotations={babyBearAnnotations} />
        <CodePanel title="StarkGenericConfig (uni-stark/src/config.rs)" code={CONFIG_CODE} annotations={configAnnotations} />
      </div>
    </section>
  );
}
