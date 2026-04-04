import SyncDetailViz from './viz/SyncDetailViz';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function TipsetValidation({ onCodeRef }: Props) {
  return (
    <section id="tipset-validation" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Tipset 검증 — Syncer.Sync() 내부</h2>
      <p className="text-sm text-muted-foreground mb-4">
        sync.go의 Sync() 함수가 4단계 파이프라인을 순차 실행<br />
        각 step의 코드 보기 버튼으로 실제 소스 확인 가능
      </p>
      <div className="not-prose mb-8">
        <SyncDetailViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
    </section>
  );
}
