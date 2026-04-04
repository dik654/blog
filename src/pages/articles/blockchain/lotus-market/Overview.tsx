import ContextViz from './viz/ContextViz';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function Overview({ onCodeRef }: Props) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">딜 흐름 개요</h2>
      <p className="text-sm text-muted-foreground mb-4">
        스토리지 딜(온체인 관리)과 리트리벌(오프체인 마이크로페이먼트) 두 축<br />
        Boost가 기존 내장 마켓을 대체하는 독립 마켓 데몬
      </p>
      <div className="not-prose mb-8">
        <ContextViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
    </section>
  );
}
