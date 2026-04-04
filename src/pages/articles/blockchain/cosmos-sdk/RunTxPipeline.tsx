import RunTxViz from './viz/RunTxViz';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

export default function RunTxPipeline({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const open = (key: string) => onCodeRef(key, codeRefs[key]);
  return (
    <section id="runtx-pipeline" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">RunTx — AnteHandler → 메시지 실행 → PostHandler</h2>
      <div className="not-prose mb-8">
        <RunTxViz onOpenCode={open} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          deliverTx() → <code>RunTx()</code> — 개별 TX 실행의 전체 파이프라인<br />
          <strong>2중 CacheMultiStore 분기</strong>로 원자적 실행 보장
        </p>
        <div className="not-prose flex flex-wrap gap-2 my-4">
          <CodeViewButton onClick={() => open('runtx')} />
          <span className="text-[10px] text-muted-foreground self-center">RunTx()</span>
          <CodeViewButton onClick={() => open('runmsgs')} />
          <span className="text-[10px] text-muted-foreground self-center">runMsgs()</span>
        </div>
        <h3 className="text-xl font-semibold mt-6 mb-3">AnteHandler 체인</h3>
        <p>
          이더리움의 <code>validateTx()</code>에 대응 — 데코레이터 패턴 미들웨어<br />
          SetUpContext → ValidateBasic → DeductFee → SigVerify → IncrementSequence<br />
          💡 캐시 분기 후 실행 → 실패 시 자동 롤백. 성공 시에만 msCache.Write()
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">runMsgs — 메시지별 핸들러 디스패치</h3>
        <p>
          TX 내 Msg 배열을 순회 → <code>MsgServiceRouter.Handler(msg)</code>로 핸들러 조회<br />
          핸들러 = 모듈의 MsgServer 메서드 (예: bank.msgServer.Send)<br />
          하나라도 실패 → 전체 TX 롤백 (2중 캐시 분기 덕분)
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">PostHandler</h3>
        <p>
          실행 성공/실패 무관하게 항상 호출 — tip 정산, 이벤트 보강<br />
          💡 PostHandler도 실패 가능 → runMsgs 결과까지 함께 롤백
        </p>
      </div>
    </section>
  );
}
