import NATTypesViz from './viz/NATTypesViz';

export default function Overview() {
  const types = [
    { name: 'Full Cone', desc: '외부 어디서든 매핑 주소로 접근 가능', difficulty: '쉬움', c: '#10b981' },
    { name: 'Restricted Cone', desc: '내부가 먼저 보낸 IP만 접근 가능', difficulty: '보통', c: '#f59e0b' },
    { name: 'Port Restricted', desc: '내부가 보낸 IP+포트만 접근 가능', difficulty: '어려움', c: '#ef4444' },
    { name: 'Symmetric', desc: '목적지마다 다른 매핑. 가장 까다로움', difficulty: '매우 어려움', c: '#8b5cf6' },
  ];

  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">개요: NAT 유형</h2>
      <div className="not-prose mb-8"><NATTypesViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          NAT(Network Address Translation)는 사설 IP를 공인 IP로 변환하는 네트워크 장치입니다.<br />
          P2P 통신에서 가장 큰 장벽입니다.<br />
          두 피어가 모두 NAT 뒤에 있으면 직접 연결이 불가능합니다.
        </p>
        <h3>NAT 유형별 특성</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 not-prose my-6">
        {types.map(t => (
          <div key={t.name} className="rounded-xl border p-4"
            style={{ borderColor: t.c + '40', background: t.c + '08' }}>
            <p className="font-mono font-bold text-sm" style={{ color: t.c }}>{t.name}</p>
            <p className="text-sm mt-1 text-foreground/80">{t.desc}</p>
            <p className="text-xs mt-1 text-foreground/50">홀 펀칭 난이도: {t.difficulty}</p>
          </div>
        ))}
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          iroh에서는 STUN + DERP 릴레이로 NAT를 통과합니다.<br />
          libp2p에서는 AutoNAT + Circuit Relay v2 + DCUtR 조합을 사용합니다.
        </p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">NAT 분류와 통과 가능성</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// NAT Binding Types (RFC 3489, 5780)
//
// ┌──────────────────┬──────────────┬──────────────┐
// │      타입        │   매핑 동작  │ 홀펀칭 가능  │
// ├──────────────────┼──────────────┼──────────────┤
// │ Full Cone        │ 1:1 매핑     │ 가능 (쉬움)  │
// │ Restricted Cone  │ Source IP 필터│ 가능         │
// │ Port Restricted  │ IP+Port 필터 │ 가능 (까다)  │
// │ Symmetric        │ 목적지별 매핑│ 거의 불가    │
// └──────────────────┴──────────────┴──────────────┘
//
// Mapping Behavior:
//   "동일 source port → 외부 매핑 동일?"
//
//   Endpoint-Independent: 같은 매핑 (Cone)
//   Address-Dependent: 목적지 IP별 다름
//   Address-Port-Dependent: 목적지 IP+Port별 다름
//
// Filtering Behavior:
//   "누가 보낸 패킷을 받을까?"
//
//   Endpoint-Independent: 모든 source 허용
//   Address-Dependent: 먼저 보낸 IP만
//   Address-Port-Dependent: 먼저 보낸 IP+Port만

// 현실의 NAT:
//   Home router: 주로 Full Cone 또는 Restricted
//   Mobile carrier: Symmetric NAT 흔함
//   Corporate: Symmetric + strict firewall
//   Cloud VPC: 정책 따라 다양

// P2P 성공률 (경험적):
//   Same network: 99%
//   Both Full Cone: 95%
//   Full + Restricted: 90%
//   Both Restricted: 80%
//   Symmetric + Restricted: 50%
//   Both Symmetric: 5-10%
//   → 전체 P2P 성공률: ~70-80%
//   → TURN/DERP fallback 필수

// CGN (Carrier-Grade NAT):
//   IPv4 고갈로 ISP 레벨 NAT
//   이중 NAT 상황
//   홀 펀칭 더 어려움
//   → IPv6 전환 권장`}
        </pre>
      </div>
    </section>
  );
}
