import CodePanel from '@/components/ui/code-panel';
import TxLifecycleViz from './viz/TxLifecycleViz';
import TxFlowSequenceViz from './viz/TxFlowSequenceViz';
import {TX_FLOW_CODE, ANTE_CODE, ANTE_ANNOTATIONS, IBC_CODE} from './TransactionLifecycleData';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

export default function TransactionLifecycle({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="tx-lifecycle" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">트랜잭션 생명주기 & IBC</h2>
      <div className="not-prose mb-8"><TxLifecycleViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">TX 흐름 시퀀스</h3>
      </div>
      <div className="not-prose mb-8"><TxFlowSequenceViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="not-prose flex flex-wrap gap-2 my-4">
          <CodeViewButton onClick={() => onCodeRef('abci-initchain', codeRefs['abci-initchain'])} />
          <span className="text-[10px] text-muted-foreground self-center">InitChain</span>
          <CodeViewButton onClick={() => onCodeRef('abci-finalizeblock', codeRefs['abci-finalizeblock'])} />
          <span className="text-[10px] text-muted-foreground self-center">FinalizeBlock</span>
          <CodeViewButton onClick={() => onCodeRef('runmsgs', codeRefs['runmsgs'])} />
          <span className="text-[10px] text-muted-foreground self-center">runMsgs</span>
          <CodeViewButton onClick={() => onCodeRef('bank-send', codeRefs['bank-send'])} />
          <span className="text-[10px] text-muted-foreground self-center">Bank MsgServer</span>
        </div>
        <h3 className="text-xl font-semibold mt-6 mb-3">트랜잭션 처리 흐름</h3>
        <p>
          이더리움 TX 흐름 Cosmos TX 흐름<br />
          1. RLP 인코딩 & 서명 1. Protobuf 인코딩 & 서명<br />
          2. txpool 진입 2. CheckTx (ABCI) → 멤풀<br />
          3. 블록에 포함 3. PrepareProposal → 블록<br />
          4. EVM 실행 4. FinalizeBlock → 모듈 실행<br />
          - gas 차감 - gas 차감<br />
          - 상태 변경 - 상태 변경<br />
          - 이벤트 발생 - 이벤트 발생<br />
          5. 영수증(receipt) 생성 5. TxResult 반환<br />
          6. stateRoot 업데이트 6. app_hash 업데이트
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">AnteHandler (미들웨어)</h3>
        <p>
          이더리움의 트랜잭션 검증이 EVM 실행 전에 서명/nonce/gas를 확인하는 것과 같습니다.
          <br />
          Cosmos SDK의 <strong>AnteHandler</strong>는 메시지 실행 전에 사전 검증을 수행합니다.
          <br />
          체인 형태의 미들웨어(데코레이터 패턴)로 구성됩니다.
        </p>
        <CodePanel title="AnteHandler 데코레이터 체인" code={ANTE_CODE} annotations={ANTE_ANNOTATIONS} />

        <h3 className="text-xl font-semibold mt-6 mb-3">IBC (Inter-Blockchain Communication)</h3>
        <p>
          IBC(Inter-Blockchain Communication)는 이더리움 생태계의 <strong>브릿지</strong>와 비교됩니다.
          <br />
          프로토콜 레벨에서 표준화된 크로스체인 통신입니다.
          <br />
          이더리움 롤업이 L1에 증명을 제출하는 것과 유사하게, Light Client 증명으로 체인 간 상태를 검증합니다.
        </p>
        <p>
          IBC vs 이더리움 크로스체인:<br />
          이더리움 롤업 ↔ L1 IBC<br />
          롤업이 L1에 상태 루트 제출 체인 A가 체인 B의 Light Client 유지<br />
          L1이 fraud/validity proof 검증 Light Client가 헤더 & Merkle 증명 검증<br />
          메시지 전달 (L1 ↔ L2) 패킷 전달 (Chain A ↔ Chain B)<br />
          시퀀서가 L2→L1 메시지 포함 릴레이어가 패킷 중계<br />
          IBC 핸드셰이크:<br />
          Chain A Relayer Chain B<br />
          ConnOpenInit →→<br />
          ← ConnOpenTry<br />
          ← ConnOpenAck →<br />
          ← ConnOpenConfirm
        </p>
      </div>
    </section>
  );
}
