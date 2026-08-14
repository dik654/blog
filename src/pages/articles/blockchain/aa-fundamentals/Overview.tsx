import ContentBoundary from "@/components/articles/content-boundary";
import { Link } from "react-router-dom";
import AAModelViz from "./viz/AAModelViz";

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Account Abstraction은 계정을 없애는 기술이 아니라 검증 규칙을 코드로 옮기는 기술입니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          전통적인 EOA(Externally Owned Account)는 protocol이 정한 secp256k1 서명과 nonce 규칙으로 transaction을 시작합니다.
          구현이 단순한 대신, 잃어버린 키를 다른 정책으로 복구하거나 특정 앱에만 하루 0.1 ETH를 허용하는 session key를 계정 자체가 판단할 수 없습니다.
          Account Abstraction(AA)은 이 <strong>validation policy</strong>를 smart-account code가 실행하게 하여 signer·복구·batch·fee payer를 프로그래밍할 수 있게 합니다.
        </p>
        <p>
          이 글은 “Alice가 USDC approve와 swap을 한 번에 실행하되, 30분짜리 session key는 Router 한 곳에 100 USDC까지만 쓰고,
          ETH가 없는 첫 사용자의 gas는 dApp paymaster가 내준다”는 사례를 끝까지 추적합니다. 요청을 만드는 주체, 검증하는 주체, gas를 먼저 내는 주체와 실제 side effect owner를 나누면
          ERC-4337, EIP-7702, native AA라는 이름이 어디서 갈라지는지 자연스럽게 보입니다.
        </p>
        <p>
          Transaction·nonce·receipt의 바닥은 <Link to="/blockchain/evm-fundamentals">EVM 기초</Link>에서 확장합니다. 이 글만 읽어도 흐름을 따라갈 수 있도록,
          nonce는 같은 권한 요청의 replay를 막는 순서표이고 receipt는 chain에 포함된 실행 결과라는 직관을 먼저 사용합니다.
        </p>
      </div>
      <ContentBoundary article="aa-fundamentals" />
      <AAModelViz />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>먼저 네 가지 책임을 분리합니다</h3>
        <ul>
          <li><strong>Authorization:</strong> 누가 어느 chain·account·nonce·call을 승인했는지 확인합니다.</li>
          <li><strong>Admission:</strong> 지금 포함 가능한 요청인지 simulation하고, 값싼 spam이 mempool 자원을 고갈시키지 않게 제한합니다.</li>
          <li><strong>Gas payment:</strong> account와 paymaster 가운데 누가 최대 비용을 먼저 부담하고 남은 금액을 정산할지 정합니다.</li>
          <li><strong>Execution:</strong> validation을 통과한 call을 실행하고 effect·gas·failure를 event와 receipt로 남깁니다.</li>
        </ul>
        <p>
          “스마트 지갑이라서 안전하다”는 결론은 나오지 않습니다. 계정 코드가 복잡해질수록 signature domain, upgrade authority, session capability, paymaster budget과 recovery governance를 따로 시험해야 합니다.
          AA는 안전 정책을 <em>가능하게</em> 할 뿐, 올바른 정책을 자동으로 만들어 주지 않습니다.
        </p>
      </div>
    </section>
  );
}
