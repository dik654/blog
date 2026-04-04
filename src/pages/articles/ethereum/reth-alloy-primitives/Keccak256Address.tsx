import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import Keccak256Viz from './viz/Keccak256Viz';

export default function Keccak256Address({ onCodeRef }: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="keccak256-address" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Keccak256과 Address 생성</h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          이더리움 주소는 공개키에서 파생된다.<br />
          secp256k1 공개키(64바이트)를 Keccak256으로 해시하면 32바이트가 나오고,
          그 하위 20바이트가 Address가 된다.
        </p>
        <p className="leading-7">
          컨트랙트 배포 시 주소 생성 방법은 두 가지다.<br />
          <strong>CREATE</strong>는 sender 주소와 nonce를 RLP 인코딩한 후 Keccak256 해시의 하위 20바이트를 사용한다.<br />
          nonce가 변할 때마다 주소도 변하므로 배포 전 주소를 예측하기 어렵다.
        </p>
        <p className="leading-7">
          <strong>CREATE2</strong>는 <code>0xff + sender + salt + init_code_hash</code>를 해시한다.<br />
          salt와 배포 코드만 알면 주소를 미리 계산할 수 있다.<br />
          이를 counterfactual deployment라 부르며, 상태 채널이나 지갑 팩토리에서 활용된다.
        </p>
      </div>

      <div className="not-prose">
        <Keccak256Viz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
    </section>
  );
}
