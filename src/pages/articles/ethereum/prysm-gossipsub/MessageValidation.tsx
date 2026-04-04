import type { CodeRef } from '@/components/code/types';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function MessageValidation({ onCodeRef }: Props) {
  return (
    <section id="message-validation" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">메시지 검증 파이프라인</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          가십으로 수신된 블록은 6단계 검증을 통과해야 한다.<br />
          검증 결과에 따라 전파·무시·거부를 결정한다.
        </p>
        <div className="not-prose flex flex-wrap gap-2 my-4">
          <CodeViewButton onClick={() => onCodeRef('validate-block-pubsub', codeRefs['validate-block-pubsub'])} />
          <span className="text-[10px] text-muted-foreground self-center">validateBeaconBlockPubSub()</span>
        </div>
        <h3 className="text-xl font-semibold mt-6 mb-3">검증 단계</h3>
        <ul>
          <li><strong>SSZ-Snappy 디코딩</strong> — 포맷 오류 시 Reject</li>
          <li><strong>슬롯 범위</strong> — 너무 오래된 블록은 Ignore</li>
          <li><strong>서명 검증</strong> — BLS 서명 무효 시 Reject</li>
          <li><strong>부모 존재</strong> — 부모 미확인 시 Ignore (나중에 재시도)</li>
          <li><strong>제안자 인덱스</strong> — 해당 슬롯 예상 제안자와 불일치 시 Reject</li>
          <li><strong>이중 제안</strong> — 같은 슬롯에 이미 제안 확인 시 Ignore</li>
        </ul>
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>💡 Reject vs Ignore 차이</strong> — Reject은 피어 점수를 감점하고 메시지를 버림<br />
          Ignore는 점수 영향 없이 전파만 중단<br />
          부모 미확인처럼 "나중에 유효할 수 있는" 경우 Ignore로 처리해 오판을 방지
        </p>
      </div>
    </section>
  );
}
