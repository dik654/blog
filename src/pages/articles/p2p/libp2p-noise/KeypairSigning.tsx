import ExplainedFormula from "@/components/ui/explained-formula";

export default function KeypairSigning() {
  return (
    <section id="keypair-signing" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Identity binding은 “이 Noise key를 이 PeerId가 승인했다”를 증명합니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          각 peer는 새 Noise static keypair를 만들고 static public key 앞에 spec이 정한
          prefix를 붙인 bytes를 장기 libp2p identity private key로 서명합니다. Handshake
          payload에는 identity public key와 signature가 실립니다. Receiver는 signature를
          검증한 다음 그 public key로 PeerId를 유도하고, dial할 때 예상한 PeerId와 같은지
          비교합니다.
        </p>
      </div>
      <ExplainedFormula
        question="Noise static public key와 remote PeerId가 같은 주체의 것임을 어떻게 검사할까요?"
        idea={<>Signature input에 domain-separation prefix와 정확한 Noise static public key bytes를 넣습니다. Receiver는 payload identity key로 signature를 확인하고 그 key에서 PeerId를 다시 계산합니다.</>}
        formula={String.raw`\begin{aligned}m &= \texttt{prefix}\,\|\,s_{noise}\\
\sigma &= \operatorname{Sign}_{sk_{id}}(m)\\
v &= \operatorname{Verify}_{pk_{id}}(m,\sigma)\\
p &= \operatorname{PeerId}(pk_{id})\\
\operatorname{accept} &\iff v\land(p=p_{expected})\end{aligned}`}
        annotatedFormula={String.raw`\begin{aligned}m &= \underbrace{\texttt{prefix}\,\|\,s_{noise}}_{\text{Noise static public key 계산}}\\
\sigma &= \underbrace{\operatorname{Sign}_{sk_{id}}(m)}_{\text{identity signature 계산}}\\
v &= \underbrace{\operatorname{Verify}_{pk_{id}}(m,\sigma)}_{\text{identity signature 계산}}\\
p &= \operatorname{PeerId}(pk_{id})\\
\operatorname{accept} &\iff v\land(p=p_{expected})\end{aligned}`}
        operations={[
          { expression: String.raw`\texttt{prefix}\,\|\,s_{noise}`, annotation: ["Noise static public key이(가) 식의 결과에","기여하는 방식을 계산합니다.","Signature input에 domain-separation","prefix와 정확한 Noise static public"] },
          { expression: String.raw`\operatorname{Sign}_{sk_{id}}(m)`, annotation: ["identity signature이(가) 식의 결과에 기여하는","방식을 계산합니다.","Signature input에 domain-separation","prefix와 정확한 Noise static public"] },
          { expression: String.raw`\operatorname{Verify}_{pk_{id}}(m,\sigma)`, annotation: ["identity signature이(가) 식의 결과에 기여하는","방식을 계산합니다.","Signature input에 domain-separation","prefix와 정확한 Noise static public"] },
        ]}
        terms={[
          { symbol: "s_{noise}", name: "Noise static public key", description: "이번 secure channel의 장기 DH key입니다." },
          { symbol: "sk_{id}, pk_{id}", name: "libp2p identity keypair", description: "PeerId의 장기 identity와 signature를 담당합니다." },
          { symbol: "\\sigma", name: "identity signature", description: "Identity private key가 정확한 binding message를 승인했다는 증거입니다." },
          { symbol: "v", name: "signature verification result", description: "같은 message와 identity public key로 signature가 유효한지 나타내는 boolean입니다." },
          { symbol: "p_{expected}", name: "expected PeerId", description: "Dial address나 상위 policy가 기대한 remote identity입니다." },
        ]}
        assumptions={[
          "Signature algorithm과 PeerId derivation을 정확히 구현하고 public-key encoding ambiguity가 없어야 합니다.",
          "Noise payload가 handshake encryption과 hash state에 포함되고, verification 실패 시 connection을 즉시 종료해야 합니다.",
          "PeerId 일치는 node key 소유를 말할 뿐 그 peer의 application 권한이나 신뢰도를 자동 보장하지 않습니다.",
        ]}
        interpretation="Signature만 맞고 expected PeerId가 다르면 유효한 다른 peer에 연결된 것이므로 실패입니다. 반대로 PeerId 문자열만 맞춰 보고 signature를 생략하면 공격자가 자신의 Noise key를 피해자의 identity처럼 제시할 수 있습니다."
      />
    </section>
  );
}
