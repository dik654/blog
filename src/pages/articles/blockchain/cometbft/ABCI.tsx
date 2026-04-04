import { CitationBlock } from '../../../../components/ui/citation';
import ABCIMethodsViz from './viz/ABCIMethodsViz';
import ABCIBlockFlowViz from './viz/ABCIBlockFlowViz';
import {ABCI_METHODS_CODE} from './ABCIData';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

export default function ABCI({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="abci" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">ABCI (Application BlockChain Interface)</h2>
      <div className="not-prose mb-8"><ABCIMethodsViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          ABCI는 CometBFT와 애플리케이션 사이의 인터페이스입니다.
          <br />
          이더리움의 <strong>Engine API</strong>와 유사한 역할을 합니다.
          <br />
          Engine API가 CL과 EL 사이의 통신을 담당하듯, ABCI는 합의 엔진과 상태 머신(State Machine) 사이의 통신을 정의합니다.
        </p>
        <CitationBlock source="CometBFT Documentation" citeKey={3} type="paper" href="https://docs.cometbft.com/v0.38/spec/abci/">
          <p className="italic">"ABCI allows BFT replication of applications written in any programming language"</p>
          <p className="mt-2 text-xs">ABCI의 핵심 설계 철학: 합의 엔진과 애플리케이션을 분리하여 어떤 프로그래밍 언어로든 블록체인 애플리케이션을 구현할 수 있게 합니다.</p>
        </CitationBlock>
        <h3 className="text-xl font-semibold mt-6 mb-3">ABCI 2.0 주요 메서드</h3>
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('receive-routine', codeRefs['receive-routine'])} />
          <span className="text-[10px] text-muted-foreground self-center">receiveRoutine()</span>
          <CodeViewButton onClick={() => onCodeRef('handle-msg', codeRefs['handle-msg'])} />
          <span className="text-[10px] text-muted-foreground self-center">handleMsg()</span>
        </div>
        <p>
          // 블록 실행 흐름 (이더리움 Engine API와 비교)<br />
          ABCI 메서드 이더리움 Engine API 대응<br />
          PrepareProposal(txs) ≈ engine_forkchoiceUpdatedV3<br />
          → 애플리케이션이 블록 내용 결정 (payloadAttributes로 빌드 요청)<br />
          ProcessProposal(block) ≈ engine_newPayloadV3<br />
          → 제안된 블록 유효성 검증 (EL이 페이로드 검증)<br />
          FinalizeBlock(block) ≈ engine_forkchoiceUpdatedV3<br />
          → 블록 확정 & 상태 전이 실행 (headBlockHash 업데이트)<br />
          Commit() ≈ (EL의 state root 커밋)<br />
          → 상태를 디스크에 영구 저장<br />
          CheckTx(tx) ≈ eth_sendRawTransaction<br />
          → 멤풀 진입 전 트랜잭션 검증 (txpool 유효성 검사)
        </p>
        <CitationBlock source="cometbft/abci/types/types.go" citeKey={4} type="code" href="https://github.com/cometbft/cometbft/blob/main/abci/types/types.go">
          <pre className="text-xs overflow-x-auto"><code>{`type RequestFinalizeBlock struct {
    Txs                [][]byte
    DecidedLastCommit  CommitInfo
    Misbehavior        []Misbehavior
    Hash               []byte    // Block hash
    Height             int64
    Time               time.Time
    NextValidatorsHash []byte
    ProposerAddress    []byte
}`}</code></pre>
          <p className="mt-2 text-xs text-foreground/70">ABCI++ FinalizeBlock 요청 구조체. 기존 BeginBlock/DeliverTx/EndBlock을 통합하여 단일 호출로 블록 전체를 처리합니다.</p>
        </CitationBlock>
        <h3 className="text-xl font-semibold mt-6 mb-3">블록 실행 순서</h3>
      </div>
      <div className="not-prose mb-8"><ABCIBlockFlowViz /></div>
    </section>
  );
}
