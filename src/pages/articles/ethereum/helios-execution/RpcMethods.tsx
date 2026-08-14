import type { CodeRef } from "@/components/code/types";

interface Props {
  title: string;
  onCodeRef: (key: string, ref: CodeRef) => void;
}

export default function RpcMethods({ title, onCodeRef: _onCodeRef }: Props) {
  return (
    <section id="rpc-methods" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">{title}</h2>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          RPC method를 “네 개는 Merkle proof, 하나는 신뢰”로만 나누면 실제 검증
          경로를 놓칩니다. Account·storage·code는 state root, receipt와 logs는
          receipts root, local call은 proof-backed pre-state를 사용합니다. 반면
          raw transaction broadcast는 아직 block에 들어가지 않은 미래 효과라
          inclusion proof가 존재하지 않습니다.
        </p>

        <h3 id="get-balance" className="scroll-mt-24">
          Balance·nonce·storage·code: account proof에서 시작합니다
        </h3>
        <p>
          <code>eth_getBalance</code>와 nonce는 H의 state root에 검증한 account
          leaf field를 반환합니다. <code>eth_getStorageAt</code>은 그 leaf의
          storageRoot 아래 slot proof를 한 번 더 검증합니다.{" "}
          <code>eth_getCode</code>는 account proof의 codeHash를 얻은 뒤 RPC가 준
          bytecode의 Keccak hash와 비교하므로, proof는 맞지만 code bytes만 바꾼
          공격도 거부합니다.
        </p>

        <h3 id="get-logs" className="scroll-mt-24">
          Logs: Bloom은 후보 필터이고 receipt root가 membership을 증명합니다
        </h3>
        <p>
          Bloom filter는 특정 address/topic이 “없음”을 빠르게 판단할 수 있지만
          false positive가 있으므로 log inclusion proof가 아닙니다. Helios
          0.11.1의 RPC provider는 반환된 log가 속한 block들의 전체 receipts를
          가져와 ordered receipts root를 header와 비교하고, 각 log의 RLP bytes가
          해당 transaction receipt에 실제로 있는지와 filter 조건까지 확인합니다.
          즉 Bloom만으로 검증한다는 레거시 설명은 현재 source와 다릅니다.
        </p>

        <h3 id="send-tx" className="scroll-mt-24">
          sendRawTransaction: broadcast acknowledgement와 chain inclusion을
          분리합니다
        </h3>
        <p>
          Signed bytes 자체의 transaction hash는 로컬에서 계산할 수 있지만,
          provider가 peer에 전파했는지, mempool이 받아들였는지, 어느 block에
          포함될지는 요청 시점에 증명할 수 없습니다. Helios 0.11.1은 이 method를
          execution provider에 전달해 받은 hash를 반환합니다. 따라서 status는
          “broadcast 요청/acknowledgement”이고, 이후 verified block의 receipts
          root에 연결된 receipt를 조회했을 때만 inclusion을 별도 확인합니다.
        </p>

        <h3>Cache·release gate는 method별 anchor를 보존합니다</h3>
        <p>
          Account result는 block hash, storage는 storage root, code는 code hash,
          receipt/log는 block hash·receipts root, call은 H·fork·request·override
          digest로 cache합니다. Wrong proof/root, missing code, receipt-order
          mutation, Bloom false positive, reorg, EVM cache miss replay,
          broadcast timeout-after-accept를 base/candidate에 주입해
          value·error·root·status parity를 먼저 확인한 뒤 latency와 RPC 수를
          비교합니다. 이 fault matrix와 rollback bundle은 0.11.1의 고정 구현
          사실이 아니라 운영 hardening 계약입니다.
        </p>
      </div>
    </section>
  );
}
