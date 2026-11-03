import { CodeViewButton } from "@/components/code";
import type { CodeRef } from "@/components/code/types";
import { codeRefs } from "./codeRefs";

const BACKENDS = [
  {
    title: "Local keystore",
    action: "복호화한 secret key를 process memory의 cache에서 찾아 RA에 직접 서명합니다.",
    boundary: "Wallet file·password·memory·host 접근 권한",
  },
  {
    title: "Derived wallet",
    action: "Mnemonic과 derivation path에서 만든 key set을 같은 Sign interface로 사용합니다.",
    boundary: "Seed custody·derivation path·backup 복구",
  },
  {
    title: "Web3Signer",
    action: "Prysm request를 structured JSON으로 바꿔 remote signer에 보내 signature를 받습니다.",
    boundary: "Signer policy·인증·network·timeout·공용 history",
  },
] as const;

export default function KeyManagement({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="key-management" className="mb-16 scroll-mt-20">
      <h2 className="mb-5 break-keep text-2xl font-bold">
        Keymanager는 data를 고르지 않고, 받은 signing root에 서명합니다
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          V37의 attestation data가 정해지면 Prysm은 target epoch의 attester
          domain을 얻고, data와 domain을 hash해 RA를 만듭니다. Sign request에는
          V37의 public key, RA, domain, 원래 attestation data와 slot 100이 함께
          들어갑니다. 이 문맥은 remote signer가 object type을 구분하고 자체
          정책을 적용할 때도 필요합니다.
        </p>
        <p>
          다만 <strong>공통 keymanager interface가 보장하는 것은 public-key 조회와
          Sign 호출입니다.</strong> Local 구현의 <code>Sign</code>은 public key가
          cache에 있는지 확인한 뒤 <code>req.SigningRoot</code>에 곧바로
          서명합니다. 그것만으로 duty가 맞는지, RA가 double vote인지 다시
          판정하지 않습니다. 그 책임은 caller와 slashing-protection 경로에
          남아 있습니다.
        </p>
      </div>

      <div className="not-prose my-6 grid min-w-0 gap-4 md:grid-cols-3">
        {BACKENDS.map((backend, index) => (
          <article key={backend.title} className="min-w-0 border border-border p-4">
            <p className="font-mono text-[10px] font-bold text-primary">
              0{index + 1}
            </p>
            <h3 className="mt-2 text-sm font-bold">{backend.title}</h3>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              {backend.action}
            </p>
            <p className="mt-3 border-t border-border pt-3 text-xs leading-5">
              <strong>주요 경계</strong> · {backend.boundary}
            </p>
          </article>
        ))}
      </div>

      <div className="not-prose my-5 flex flex-wrap gap-2">
        <CodeViewButton
          onClick={() =>
            onCodeRef("keymanager-contract", codeRefs["keymanager-contract"])
          }
        />
        <CodeViewButton
          onClick={() => onCodeRef("local-sign", codeRefs["local-sign"])}
        />
        <CodeViewButton
          onClick={() => onCodeRef("remote-sign", codeRefs["remote-sign"])}
        />
        <span className="self-center text-xs text-muted-foreground">
          공통 계약과 local·remote 서명 구현 원문
        </span>
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Remote signer를 쓰면 무엇이 좋아지고 무엇이 새로 생길까요?</h3>
        <p>
          Secret key가 validator host 밖에 있으므로 host 침해와 key custody를
          분리할 수 있습니다. Prysm의 Web3Signer adapter는 SignRequest를 object
          type에 맞는 JSON으로 변환하고 genesis validators root를 포함해 remote
          endpoint에 보냅니다. Remote signer는 이 구조를 보고 block과
          attestation을 구별할 수 있습니다.
        </p>
        <p>
          하지만 adapter가 호출됐다는 사실만으로 remote signer의 slashing
          protection이 켜져 있다고 말할 수는 없습니다. 인증 실패, network tail
          latency, 응답을 잃은 뒤 실제 서명 여부를 모르는 timeout도 새로 생깁니다.
          같은 key를 여러 Prysm client가 공유한다면 signer 쪽의 공용 history나
          확실한 single-writer fencing이 필요합니다.
        </p>

        <h3>Timeout 뒤 root를 바꾸어 재시도하면 왜 위험할까요?</h3>
        <p>
          RA 요청의 응답만 잃었더라도 remote signer에는 σA가 남아 있을 수
          있습니다. 이때 같은 duty에 대해 다른 head로 만든 RB를 보내면 두
          signature가 존재할 수 있습니다. 재시도는 stable request digest로 같은
          root의 기존 결과를 조회하거나, signer가 같은 root 재요청을 idempotent하게
          처리할 때만 안전합니다. “응답을 못 받았다”는 “서명하지 않았다”는 증거가
          아닙니다.
        </p>
        <aside className="not-prose mt-5 border-l-2 border-amber-500/60 bg-amber-500/5 p-4 text-sm leading-6">
          <strong>여기까지 확정된 것:</strong> V37·slot 100·attester domain·RA에
          묶인 σA가 생겼습니다. 이 signature가 local history와 충돌하지 않는지와
          network로 제출됐는지는 아직 확정되지 않았습니다.
        </aside>
      </div>
    </section>
  );
}
