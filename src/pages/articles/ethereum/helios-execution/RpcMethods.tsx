import { CodeViewButton } from "@/components/code";
import type { CodeRef } from "@/components/code/types";
import { codeRefs } from "./codeRefs";
import RpcTrustMap from "./viz/RpcTrustMap";

interface Props {
  onCodeRef: (key: string, ref: CodeRef) => void;
}

export default function RpcMethods({ onCodeRef }: Props) {
  return (
    <section id="rpc-methods" className="mb-16 scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">RPC method마다 검증 근거가 다릅니다</h2>

      <RpcTrustMap />

      <div
        id="get-balance"
        className="prose prose-neutral max-w-none scroll-mt-24 dark:prose-invert"
      >
        <h3>상태 조회는 state root에서 시작합니다</h3>
        <p>
          <code>eth_getBalance</code>와 nonce는 block <code>H</code>의 state root에
          검증한 account field를 반환합니다. <code>eth_getStorageAt</code>은 그
          account가 묶은 storage root 아래에서 slot proof를 한 번 더 확인합니다.
        </p>
        <p>
          <code>eth_getCode</code>는 account proof의 code hash와 원격 bytecode의
          Keccak hash를 비교합니다. 이 내부 검증은 앞의 state proof 글이
          소유하며, 여기서는 그 결과를 ProofDB가 EVM read로 바꾸는 지점만
          사용합니다.
        </p>
      </div>

      <div
        id="gas-estimation"
        className="prose prose-neutral mt-10 max-w-none scroll-mt-24 dark:prose-invert"
      >
        <h3>Gas estimate는 같은 local run의 gas_used입니다</h3>
        <p>
          Helios 0.11.1의 Ethereum path는 <code>eth_call</code>과 같은
          <code>transact</code> 경로를 쓰고 transaction validation 일부를 끈 뒤
          <code>result.gas_used()</code>를 반환합니다. 기존 글에 있던 고정 10%
          마진은 이 release의 코드에 없습니다.
        </p>
        <p>
          Estimate가 성공해도 이후 head의 nonce·storage·base fee가 바뀌거나 실제
          transaction gas limit이 부족하면 제출 결과는 달라질 수 있습니다.
        </p>
      </div>

      <div className="not-prose mt-5">
        <CodeViewButton
          label="call과 estimateGas의 반환 분기 보기"
          onClick={() => onCodeRef("hl-call-estimate", codeRefs["hl-call-estimate"])}
        />
      </div>

      <div
        id="get-logs"
        className="prose prose-neutral mt-10 max-w-none scroll-mt-24 dark:prose-invert"
      >
        <h3>Log는 Bloom이 아니라 receipt bytes와 receipts root로 확인합니다</h3>
        <p>
          Header의 logs Bloom은 address나 topic이 없을 가능성을 빠르게 거르는
          색인입니다. False positive가 가능하므로 그 자체로 log membership
          proof가 되지 않습니다.
        </p>
        <p>
          Helios 0.11.1의 일반 RPC provider는 반환된 log가 가리키는 block들의
          receipt 전체를 가져옵니다. 그런 다음 ordered receipts root를 header와
          비교하고, transaction receipt 안에 같은 RLP log bytes가 실제로 있는지
          확인합니다.
        </p>
        <p>
          별도 Verifiable API provider는 receipt마다 MPT proof를 받을 수도
          있습니다. 두 경로 모두 최종 anchor는 검증된 block header의 receipts
          root입니다. State root는 account·storage를, receipts root는 execution
          결과와 log를 묶으므로 서로 대신할 수 없습니다.
        </p>
      </div>

      <div className="not-prose mt-5 flex flex-wrap gap-3">
        <CodeViewButton
          label="Receipt root와 log membership 확인 보기"
          onClick={() => onCodeRef("hl-log-verification", codeRefs["hl-log-verification"])}
        />
        <CodeViewButton
          label="Ordered receipts root 계산 보기"
          onClick={() => onCodeRef("hl-receipts-root", codeRefs["hl-receipts-root"])}
        />
      </div>

      <div
        id="send-tx"
        className="prose prose-neutral mt-10 max-w-none scroll-mt-24 dark:prose-invert"
      >
        <h3>Transaction 제출 시점에는 inclusion proof가 없습니다</h3>
        <p>
          Signed bytes의 transaction hash는 로컬에서 계산할 수 있습니다. 그러나
          provider가 peer에 전파했는지, 어느 mempool이 받아들였는지, block에
          포함될지는 제출 순간에 아직 결정되지 않았습니다. Helios 0.11.1은
          <code>sendRawTransaction</code>을 execution provider에 전달하고 provider가
          돌려준 hash를 반환합니다.
        </p>
        <p>
          그러므로 이때의 상태는 “broadcast 요청에 응답을 받음”입니다. 나중에
          검증된 block의 receipts root에서 해당 transaction receipt를 찾으면
          inclusion을 별도로 확인할 수 있습니다. Inclusion도 consensus finality와
          같지 않습니다. 원격 응답 하나를 전파·포함·finalized 세 단계로 확대하면
          안 됩니다.
        </p>
      </div>

      <div className="not-prose mt-5">
        <CodeViewButton
          label="Broadcast 위임과 receipt 조회 경계 보기"
          onClick={() => onCodeRef("hl-broadcast", codeRefs["hl-broadcast"])}
        />
      </div>

      <div
        id="self-check"
        className="prose prose-neutral mt-10 max-w-none scroll-mt-24 dark:prose-invert"
      >
        <h3>이 글을 읽고 답할 수 있어야 하는 질문</h3>
        <ol>
          <li>왜 ProofDB는 network 요청을 Database trait 안에서 바로 기다리지 않나요?</li>
          <li>Access-list prefetch가 틀려도 state 신뢰가 무너지지 않는 이유는 무엇인가요?</li>
          <li>Replay 사이에 block tag를 다시 latest로 해석하면 어떤 snapshot이 섞이나요?</li>
          <li>StateMissing, invalid proof, contract revert는 각각 어느 단계의 실패인가요?</li>
          <li>Gas estimate, receipt inclusion, consensus finality는 왜 서로 다른 주장인가요?</li>
        </ol>
      </div>
    </section>
  );
}
