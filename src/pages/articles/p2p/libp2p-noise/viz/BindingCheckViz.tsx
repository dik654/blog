import SceneShell from "./SceneShell";

/**
 * 본문 대응: #keypair-signing — Bob의 두 key와 binding signature, Alice 쪽의 두 검사.
 * Noise 검사: Verify_pk_id(prefix || s_noise, σ) → 실패면 connection 종료.
 * 상위 dial 검사: PeerId(pk_id) = target Bob → 다르면 요청한 connection으로 release하지 않음.
 * 한 byte 변경과 다른 peer 사례는 FinishVerify의 release gate가 요구하는 세 변형입니다.
 */
type Verdict = "ok" | "fail" | "idle" | "skip";

interface Scene {
  label: string;
  summary: string;
  note: string;
  sender: string;
  staticKey: string;
  sig: string;
  idKey: string;
  noise: Verdict;
  observed: string;
  target: Verdict;
  tamper: "static" | "sig" | null;
}

const SCENES: readonly Scene[] = [
  { label: "Bob이 서명", summary: "σ = Sign(sk_id, prefix ‖ s_noise)", sender: "Bob", staticKey: "s_noise(Bob)", sig: "σ(Bob)", idKey: "pk_id(Bob)", noise: "idle", observed: "—", target: "idle", tamper: null, note: "Bob에게는 key가 둘 있습니다. Noise static key는 이번 채널의 DH에 쓰이고, libp2p identity key는 PeerId를 맡습니다. Bob은 spec이 정한 prefix 뒤에 Noise static public key bytes를 붙여 identity private key로 서명하고, identity public key와 signature를 handshake payload에 싣습니다." },
  { label: "Alice가 검증", summary: "v = 참 · PeerId(pk_id) = Bob", sender: "Bob", staticKey: "s_noise(Bob)", sig: "σ(Bob)", idKey: "pk_id(Bob)", noise: "ok", observed: "Bob", target: "ok", tamper: null, note: "Alice는 handshake에서 관측한 static key로 같은 입력을 만들고 payload의 identity public key로 signature를 검사합니다. 통과하면 그 key에서 PeerId를 계산해 secure I/O와 함께 반환하고, 상위 dial owner가 그 값을 요청한 Bob과 대조합니다." },
  { label: "static key 한 byte 변경", summary: "Verify 실패 → 연결 종료", sender: "Bob · 값 변조(가정)", staticKey: "s_noise′ (1 byte 다름)", sig: "σ(Bob)", idKey: "pk_id(Bob)", noise: "fail", observed: "—", target: "skip", tamper: "static", note: "관측한 static key가 한 byte라도 다르면 서명 입력이 달라져 Bob의 signature가 맞지 않습니다. Noise가 여기서 connection을 끝내므로 PeerId는 만들어지지 않습니다." },
  { label: "signature 한 byte 변경", summary: "Verify 실패 → 연결 종료", sender: "Bob · 값 변조(가정)", staticKey: "s_noise(Bob)", sig: "σ′ (1 byte 다름)", idKey: "pk_id(Bob)", noise: "fail", observed: "—", target: "skip", tamper: "sig", note: "signature가 바뀌어도 같은 이유로 검증에 실패합니다. 두 경우 모두 실패를 낸 owner는 Noise입니다." },
  { label: "다른 peer의 정상 binding", summary: "Verify 통과 · PeerId ≠ Bob", sender: "다른 peer", staticKey: "s_noise(다른 peer)", sig: "σ(다른 peer)", idKey: "pk_id(다른 peer)", noise: "ok", observed: "다른 peer", target: "fail", tamper: null, note: "(가정) Bob의 주소에서 다른 peer가 응답했습니다. 자기 key들로 만든 binding이라 Noise 검증은 통과하고 observed PeerId도 정상적으로 나옵니다. 막는 것은 상위 dial owner입니다. 관측 PeerId가 target Bob과 다르니 요청한 connection으로 release하지 않습니다." },
];

function Chip({ label, value, warn }: { label: string; value: string; warn?: boolean }) {
  return (
    <div className={`rounded-md border px-2 py-1.5 text-xs ${warn ? "border-[#b91c1c] bg-[#b91c1c]/10" : "border-border"}`}>
      <span className="block text-[11px] text-muted-foreground">{label}</span>
      <span className={`block break-words font-mono font-semibold ${warn ? "text-[#b91c1c] dark:text-[#fca5a5]" : ""}`}>{value}</span>
    </div>
  );
}

function Gate({ title, owner, verdict, okText, failText }: { title: string; owner: string; verdict: Verdict; okText: string; failText: string }) {
  const tone =
    verdict === "ok"
      ? "border-[#16a34a] text-[#15803d] dark:text-[#86efac]"
      : verdict === "fail"
        ? "border-[#b91c1c] bg-[#b91c1c]/10 text-[#b91c1c] dark:text-[#fca5a5]"
        : "border-dashed border-border text-muted-foreground";
  return (
    <div className={`rounded-lg border px-3 py-2 ${tone}`}>
      <span className="block text-[11px] text-muted-foreground">{owner}</span>
      <span className="block text-xs font-semibold text-foreground sm:text-sm">{title}</span>
      <span className="mt-1 block text-xs font-bold">{verdict === "ok" ? okText : verdict === "fail" ? failText : verdict === "skip" ? "도달 안 함 · 연결이 이미 끝남" : "아직 검사 전"}</span>
    </div>
  );
}

export default function BindingCheckViz() {
  return (
    <SceneShell
      eyebrow="identity binding"
      title="signature 검증과 target 비교는 서로 다른 실패를 막습니다"
      description="왼쪽은 Alice가 handshake에서 받은 값, 오른쪽은 두 검사입니다. sk_id·pk_id는 libp2p identity keypair, s_noise는 Noise static public key, σ는 binding signature입니다. Alice가 Bob의 주소로 dial한 사례입니다."
      ariaLabel="Noise static key와 PeerId binding을 검사하는 두 단계와 실패 사례"
      scenes={SCENES}
      render={(active) => {
        const s = SCENES[active];
        const released = s.noise === "ok" && s.target === "ok";
        return (
          <div className="grid min-w-0 gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <div className="min-w-0 space-y-1.5">
              <p className="text-xs font-bold text-muted-foreground">Alice가 받은 값 · 응답자 {s.sender}</p>
              <Chip label="관측한 Noise static key" value={s.staticKey} warn={s.tamper === "static"} />
              <Chip label="payload · identity public key" value={s.idKey} />
              <Chip label="payload · signature" value={s.sig} warn={s.tamper === "sig"} />
            </div>
            <div className="min-w-0 space-y-1.5">
              <Gate title="Verify(pk_id, prefix ‖ s_noise, σ)" owner="① Noise" verdict={s.noise} okText="통과 → PeerId 유도" failText="실패 → connection 종료" />
              <div className="rounded-md bg-muted/40 px-3 py-1.5 text-xs">
                observed PeerId: <span className="font-mono font-bold">{s.observed}</span>
              </div>
              <Gate title="observed PeerId = target Bob ?" owner="② 상위 dial owner" verdict={s.target} okText="같음" failText="다름 → release 안 함" />
              <p className={`text-xs font-bold ${released ? "text-[#15803d] dark:text-[#86efac]" : "text-muted-foreground"}`}>
                {released ? "결과: Bob의 secure channel로 release" : s.noise === "idle" ? "결과: 아직 없음" : s.noise === "fail" ? "결과: connection 종료" : "결과: Bob의 connection으로 쓰지 않음"}
              </p>
            </div>
          </div>
        );
      }}
    />
  );
}
