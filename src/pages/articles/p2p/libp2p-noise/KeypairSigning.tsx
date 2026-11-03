import ExplainedFormula from "@/components/ui/explained-formula";

export default function KeypairSigning() {
  return (
    <section id="keypair-signing" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Identity binding은 “이 Noise key를 이 PeerId가 승인했다”를 증명합니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          각 peer는 새 Noise static keypair를 만들고 static public key 앞에 spec이 정한 prefix를 붙인 bytes를 장기 libp2p
          identity private key로 서명합니다. Handshake payload에는 identity public key와 signature가 실립니다.
        </p>
        <p>
          Receiver는 signature를 검증한 다음 그 public key로 PeerId를 유도합니다.
          Noise upgrade는 이 관측 PeerId를 secure I/O와 함께 반환합니다. 마지막 target
          비교는 상위 dial owner가 주소에서 기대한 Bob과 대조합니다.
        </p>
      </div>
      <ExplainedFormula
        question="Noise static public key와 remote PeerId가 같은 주체의 것임을 어떻게 검사할까요?"
        idea={<>Signature input에 domain-separation prefix와 정확한 Noise static public key bytes를 넣습니다. Receiver는 payload identity key로 signature를 확인하고 그 key에서 PeerId를 다시 계산합니다.</>}
        formula={String.raw`\begin{aligned}m &= \texttt{prefix}\,\|\,s_{noise}\\
\sigma &= \operatorname{Sign}_{sk_{id}}(m)\\
v &= \operatorname{Verify}_{pk_{id}}(m,\sigma)\\
p_{observed} &= \operatorname{PeerId}(pk_{id})\\
\operatorname{noise\_accept} &\iff v\\
\operatorname{target\_accept} &\iff p_{observed}=p_{target}\end{aligned}`}
        annotatedFormula={String.raw`\begin{aligned}m &= \underbrace{\texttt{prefix}}_{\text{domain 분리}}\,\|\,\underbrace{s_{noise}}_{\text{이번 채널의 static key}}\\
\sigma &= \underbrace{\operatorname{Sign}_{sk_{id}}(m)}_{\text{장기 identity가 승인}}\\
v &= \underbrace{\operatorname{Verify}_{pk_{id}}(m,\sigma)}_{\text{payload의 key로 검사}}\\
p_{observed} &= \underbrace{\operatorname{PeerId}(pk_{id})}_{\text{같은 key에서 유도}}\\
\operatorname{noise\_accept} &\iff \underbrace{v}_{\text{Noise가 검증}}\\
\operatorname{target\_accept} &\iff \underbrace{p_{observed}=p_{target}}_{\text{상위 dial이 비교}}\end{aligned}`}
        operations={[
          { expression: String.raw`\texttt{prefix}\,\|\,s_{noise}`, annotation: ["spec이 정한 prefix 뒤에 Noise static", "public key bytes를 그대로 붙인 서명 입력", "다른 용도 서명과 혼동 방지"] },
          { expression: String.raw`\operatorname{Sign}_{sk_{id}}(m)`, annotation: ["장기 libp2p identity 개인키로 서명", "'이 Noise key를 이 identity가 승인'"] },
          { expression: String.raw`\operatorname{Verify}_{pk_{id}}(m,\sigma)`, annotation: ["payload에 실린 identity 공개키로 검증", "실패하면 connection 즉시 종료"] },
          { expression: String.raw`\operatorname{noise\_accept}\iff v`, annotation: ["Noise finish는 static-key signature를 검증하고", "실제 identity key에서 PeerId를 유도해 반환"] },
          { expression: String.raw`p_{observed}=p_{target}`, annotation: ["상위 dial owner가 요청한 Bob과", "관측한 PeerId를 비교", "다르면 connection을 release하지 않음"] },
        ]}
        terms={[
          { symbol: "s_{noise}", name: "Noise static public key", description: "이번 secure channel의 장기 DH key입니다." },
          { symbol: "sk_{id}, pk_{id}", name: "libp2p identity keypair", description: "PeerId의 장기 identity와 signature를 담당합니다." },
          { symbol: String.raw`\sigma`, name: "identity signature", description: "Identity private key가 정확한 binding message를 승인했다는 증거입니다." },
          { symbol: "v", name: "signature verification result", description: "같은 message와 identity public key로 signature가 유효한지 나타내는 boolean입니다." },
          { symbol: "p_{observed}", name: "observed PeerId", description: "검증된 identity public key에서 Noise가 유도해 반환한 실제 remote identity입니다." },
          { symbol: "p_{target}", name: "target PeerId", description: "Dial address나 상위 policy가 기대한 Bob의 identity입니다." },
        ]}
        assumptions={[
          "Signature algorithm과 PeerId derivation을 정확히 구현하고 public-key encoding ambiguity가 없어야 합니다.",
          "Noise payload가 handshake encryption과 hash state에 포함되고, verification 실패 시 connection을 즉시 종료해야 합니다.",
          "PeerId 일치는 node key 소유를 말할 뿐 그 peer의 application 권한이나 신뢰도를 자동 보장하지 않습니다.",
        ]}
        interpretation="Noise는 signature를 확인해 observed PeerId를 반환하고, 상위 dial owner는 그 값이 target Bob인지 검사합니다. 두 검사를 모두 통과해야 요청한 peer의 secure channel로 release할 수 있습니다."
      />
    </section>
  );
}
