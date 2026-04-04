import ValidationDetailViz from './viz/ValidationDetailViz';
import type { CodeRef } from '@/components/code/types';

interface Props {
  onCodeRef?: (key: string, ref: CodeRef) => void;
}

export default function BlockValidation({ onCodeRef }: Props) {
  return (
    <section id="validation" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">블록 검증 파이프라인</h2>
      <p className="text-sm text-muted-foreground mb-6 max-w-2xl">
        ValidateBlock() — 수신 블록을 30초(1에폭) 내에 검증<br />
        동기 전처리 후 6개 goroutine 병렬 실행
      </p>
      <div className="not-prose mb-8">
        <ValidationDetailViz onOpenCode={onCodeRef} />
      </div>
    </section>
  );
}
