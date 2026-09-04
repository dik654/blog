import { CodeViewButton } from "@/components/code";
import type { CodeRef } from "@/components/code/types";
import { codeRefs } from "./codeRefs";

const BACKENDS = [
  ["Local keystore", "암호화된 EIP-2335 file을 host에서 복호화", "filesystem·memory·password·backup"],
  ["Remote signer", "인증된 API로 signing request를 보내 secret을 분리", "authorization·network·timeout·remote history"],
  ["Derived wallet", "EIP-2334 path로 mnemonic에서 validator key를 파생", "seed custody·path·account discovery"],
] as const;

export default function KeyManagement({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="key-management" className="mb-16 scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">Keymanager는 key storage보다 signing authority를 제한하는 경계다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Keymanager의 공통 interface는 public-key discovery와 sign operation을 제공합니다. 그 제공이 caller가 보낸 임의 bytes에
          서명해도 된다는 허가까지는 아닙니다. Validator client는 chain identity, fork domain, duty type, validator key와
          signing root를 검토하고 backend는 허용된 key와 request policy를 다시 적용합니다. Key 보관 위치가 달라도 이 context는 사라지지 않습니다.
        </p>
      </div>

      <div className="not-prose my-6 grid min-w-0 gap-4 md:grid-cols-3">
        {BACKENDS.map(([title, action, boundary], index) => (
          <article key={title} className="min-w-0 rounded-lg border border-border p-4">
            <p className="font-mono text-[10px] font-bold text-primary">0{index + 1}</p>
            <h3 className="mt-2 text-sm font-bold">{title}</h3>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">{action}</p>
            <p className="mt-3 border-t border-border pt-3 text-xs leading-5"><strong>추가 경계</strong> · {boundary}</p>
          </article>
        ))}
      </div>

      <div className="not-prose my-5 flex flex-wrap gap-2">
        <CodeViewButton onClick={() => onCodeRef("run-client", codeRefs["run-client"])} />
        <span className="self-center text-xs text-muted-foreground">분석한 snapshot의 keymanager 초기화 확인</span>
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>EIP-2335 keystore는 암호화 format이지 signing policy가 아닙니다</h3>
        <p>
          Keystore JSON은 KDF, checksum, cipher, public key와 derivation path를 self-describing parameter로 기록합니다.
          복호화할 때는 file에 적힌 KDF로 derived key를 만들고 checksum을 먼저 확인한 뒤 cipher를 풉니다. 특정 scrypt 비용이나 cipher 조합을 모든
          file의 상수로 가정하지 않고 schema와 parameter를 읽어야 합니다. 복호화 성공은 그 key로 지금 이 duty에 서명할 authorization과 별개입니다.
        </p>

        <h3>Remote signer request의 최소 필드</h3>
        <p>
          Request에는 public key, signing root, duty/object type, fork information을 담습니다. 여기에 genesis validators
          root와 slot 또는 epoch, stable duty ID를 더해 mutually authenticated channel로 전송합니다. Signer receipt에는
          request digest, accepted/rejected policy, signature 또는 기존 signature reference를 남깁니다. 단순 HTTP 200과 유효
          BLS signature도 올바른 duty에 대한 authorization이 없으면 충분하지 않습니다.
        </p>

        <h3>운영 선택 기준</h3>
        <p>
          Local signer는 network dependency가 적지만 validator host 침해 범위가 커집니다. Remote signer는 key isolation과 중앙
          policy를 얻는 대신 tail latency와 correlated outage가 생깁니다. 같은 key를 active-active로 실행하지 않고 fencing token이나
          단일 writer lease, shared slashing history와 tested failover runbook을 둡니다. 평균 signer latency보다 slot
          deadline 초과율과 timeout 뒤 reconciliation 가능성을 함께 측정합니다.
        </p>
      </div>
    </section>
  );
}
