import ContextViz from './viz/ContextViz';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function Overview({ onCodeRef }: Props) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">마이닝 전체 흐름</h2>
      <p className="text-sm text-muted-foreground mb-4">
        Lotus-Miner의 두 축 — 섹터 봉인(데이터 저장+증명)과 블록 생성(VRF 추첨)<br />
        go-statemachine으로 수천 섹터를 독립 병렬 관리
      </p>
      <div className="not-prose mb-8">
        <ContextViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
    </section>
  );
}
