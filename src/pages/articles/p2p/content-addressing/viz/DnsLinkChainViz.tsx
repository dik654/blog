import SceneShell from "./SceneShell";

/**
 * 본문 대응: #resolution "DNSLink는 다른 DNSLink나 IPNS path를 가리킬 수도 있습니다" 문단.
 * 이름을 한 번씩 풀 때마다 뒤의 path segment는 그대로 들고 가고, 마지막 immutable CID에 다시 붙인다.
 * docs.example → /ipns/k51… → /ipfs/C_root2 연쇄와 /guide/intro.md path는 설명용 가정.
 */
interface Row {
  step: string;
  from: string;
  to: string;
  who: string;
}

const PATH = "/guide/intro.md";

const CHAIN: readonly Row[] = [
  { step: "요청", from: "docs.example/guide/intro.md", to: `path ${PATH} 보관`, who: "gateway가 이름 docs.example과 path를 나눔" },
  { step: "1단계", from: "_dnslink.docs.example TXT", to: "/ipns/k51…", who: "authority: DNS zone 운영 권한" },
  { step: "2단계", from: "/ipns/k51… record", to: "/ipfs/C_root2", who: "authority: name의 key 서명 (seq 8)" },
  { step: "도달", from: "/ipfs/C_root2", to: `/ipfs/C_root2${PATH}`, who: "fetch 뒤 block마다 CID 검증" },
];

const LOOP: readonly Row[] = [
  { step: "요청", from: "docs.example/guide/intro.md", to: `path ${PATH} 보관`, who: "gateway가 이름 docs.example과 path를 나눔" },
  { step: "1단계", from: "_dnslink.docs.example TXT", to: "/ipns/a.example", who: "다른 DNSLink 이름 (가정)" },
  { step: "2단계", from: "_dnslink.a.example TXT", to: "/ipns/docs.example", who: "다시 처음 이름 (가정)" },
  { step: "한도", from: "docs.example → a.example → …", to: "더 따라가지 않음", who: "recursion limit에서 멈춤 · CID 없음" },
];

const SCENES = [
  { label: "이름과 path를 나눕니다", summary: `남은 path ${PATH}`, shown: 1, loop: false, note: "gateway는 요청을 바뀌는 이름 docs.example과 그 뒤의 path segment로 나눕니다. 이름을 푸는 동안 path는 손대지 않고 들고 갑니다(이름·path는 가정)." },
  { label: "DNSLink가 IPNS path를 가리킵니다", summary: "docs.example → /ipns/k51…", shown: 2, loop: false, note: "이 사례에서는 TXT record가 /ipfs/C_root2 대신 IPNS path를 가리킨다고 둡니다(가정). 아직 immutable CID가 아니므로 한 번 더 풉니다." },
  { label: "IPNS가 최신 CID를 고릅니다", summary: "/ipns/k51… → /ipfs/C_root2", shown: 3, loop: false, note: "앞 절의 순서대로 signature와 validity를 검증하고 seq 8 record를 고릅니다. 두 단계의 authority가 서로 다르므로 각각을 따로 판단해야 합니다." },
  { label: "CID 뒤에 path를 다시 붙입니다", summary: `/ipfs/C_root2${PATH}`, shown: 4, loop: false, note: "마지막 immutable CID를 얻으면 들고 온 path를 그대로 붙입니다. 그다음 provider discovery와 block fetch가 이어지고, 받은 block은 다시 CID로 검증합니다." },
  { label: "이름이 서로를 가리키면", summary: "recursion limit에서 멈춤", shown: 4, loop: true, note: "두 DNSLink가 서로를 가리키면 immutable CID에 끝내 닿지 않습니다. 그래서 gateway는 몇 단계까지 따라갈지 한도를 둡니다. 한도 값은 이 글에서 정하지 않습니다." },
] as const;

export default function DnsLinkChainViz() {
  return (
    <SceneShell
      eyebrow="DNSLink 재귀 해석"
      title="이름을 몇 번 풀어도 path는 마지막 CID 뒤에 그대로 붙습니다"
      description="한 줄이 이름 해석 한 번입니다. 왼쪽은 읽은 이름이나 record, 오른쪽은 그 결과입니다. 이름·path·연쇄 모양은 설명을 위한 가정입니다."
      ariaLabel="DNSLink가 IPNS를 거쳐 immutable CID에 닿고 path segment를 보존하는 과정과 순환 시 recursion limit"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const rows = scene.loop ? LOOP : CHAIN;
        return (
          <ol className="grid gap-1.5">
            {rows.map((row, index) => {
              const visible = index < scene.shown;
              const current = index === scene.shown - 1;
              const stop = scene.loop && index === rows.length - 1;
              return (
                <li
                  key={row.step}
                  className={`grid min-h-[3.25rem] grid-cols-[2.75rem_minmax(0,1fr)] items-center gap-2 rounded-lg border px-3 py-1.5 text-xs leading-5 sm:text-sm ${
                    !visible ? "border-dashed border-border/50" : stop ? "border-red-600" : current ? "border-primary" : "border-border"
                  }`}
                >
                  <span className={`font-semibold ${visible ? "" : "text-muted-foreground/50"}`}>{row.step}</span>
                  {visible ? (
                    <div className="min-w-0">
                      <p className="font-mono [overflow-wrap:anywhere]">
                        {row.from} <span className="text-muted-foreground">→</span>{" "}
                        <span className={stop ? "font-bold text-red-700 dark:text-red-400" : "font-bold"}>{row.to}</span>
                      </p>
                      <p className="text-muted-foreground">{row.who}</p>
                    </div>
                  ) : (
                    <span className="text-muted-foreground/50">아직 풀지 않음</span>
                  )}
                </li>
              );
            })}
          </ol>
        );
      }}
    />
  );
}
