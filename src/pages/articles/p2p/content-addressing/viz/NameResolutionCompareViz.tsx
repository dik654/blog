import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, ActionBox, DataBox, AlertBox } from '@/components/viz/boxes';

const IPNS = '#6366f1';
const DNS = '#0ea5e9';
const ENS = '#a855f7';
const IROH = '#10b981';
const GW = '#f59e0b';
const WARN = '#ef4444';

const STEPS = [
  { label: 'Why mutable pointer?', body: 'CID는 불변. "최신 버전"을 가리키려면 별도의 mutable pointer 시스템이 필요.' },
  { label: 'IPNS — DHT 기반', body: '/ipns/<PeerID> → /ipfs/<CID>. 서명된 레코드를 DHT에 발행, 구독자가 조회.' },
  { label: 'IPNS 게시 흐름', body: 'ipfs name publish → 로컬 서명 → DHT 저장 → 구독자 조회. 단점: DHT 느림, 갱신 지연.' },
  { label: 'DNSLink — 기존 DNS', body: '_dnslink.example.com TXT "dnslink=/ipfs/bafyXXX". 빠르고 TLS 친화적, 단 DNS 신뢰 필요.' },
  { label: 'ENS — blockchain', body: 'vitalik.eth → IPFS hash. ENS contract에 저장, 권한 검증 명확.' },
  { label: 'iroh — Pkarr', body: 'NodeID(Ed25519) 기반. Pkarr (DNS over DHT)에 서명된 레코드 발행.' },
  { label: '게이트웨이 — HTTP 접근', body: 'ipfs.io / dweb.link / Cloudflare. 브라우저 호환성과 중앙화의 trade-off.' },
  { label: '비교 표 + 미래', body: 'IPIP-366 IPNS-on-Pubsub · trustless gateway · 브라우저 native (Brave) — 갱신 속도와 탈중앙화 동시 추구.' },
];

const COMPARE = [
  { sys: 'IPNS', mut: '✓', dec: '✓', speed: '느림', note: 'DHT' },
  { sys: 'DNSLink', mut: '✓', dec: '✗', speed: '빠름', note: 'DNS cache' },
  { sys: 'ENS', mut: '✓', dec: '✓', speed: '중간', note: 'on-chain' },
  { sys: 'iroh Pkarr', mut: '✓', dec: '✓', speed: '중간', note: 'DNS over DHT' },
];

export default function NameResolutionCompareViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 240" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <DataBox x={140} y={50} w={200} h={36} label="CID = bafyOLD" color="#94a3b8" outlined />
              <text x={240} y={108} textAnchor="middle" fontSize={20} fill="var(--muted-foreground)">↓</text>
              <text x={240} y={128} textAnchor="middle" fontSize={10} fill={WARN}>
                불변 — 새 버전을 가리키려면 다른 CID 필요
              </text>
              <DataBox x={140} y={150} w={200} h={36} label="CID = bafyNEW (다른 주소)" color={WARN} outlined />
              <text x={240} y={216} textAnchor="middle" fontSize={10} fontWeight={600} fill={IPNS}>
                → mutable pointer 시스템 필요
              </text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill={IPNS}>
                IPNS — DHT mutable pointer
              </text>
              <ModuleBox x={70} y={50} w={120} h={42}
                label="/ipns/PeerID" sub="공개키 = 식별자" color={IPNS} />
              <text x={240} y={75} textAnchor="middle" fontSize={14} fill={IPNS}>→</text>
              <ModuleBox x={290} y={50} w={120} h={42}
                label="/ipfs/CID" sub="현재 가리키는 내용" color={IROH} />
              <ActionBox x={70} y={120} w={340} h={28}
                label="Record" sub="{ Value, Sequence, Validity, Signature, PubKey }" color={IPNS} />
              <text x={240} y={188} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                서명된 레코드 → DHT 저장 → 구독자 조회
              </text>
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill={IPNS}>
                IPNS 게시 흐름
              </text>
              {[
                { label: 'ipfs name publish <CID>', sub: 'CLI 호출' },
                { label: '레코드 생성 + 서명', sub: 'private key' },
                { label: 'DHT 저장 (PeerID → Record)', sub: 'put 요청' },
                { label: '구독자 DHT 조회', sub: 'lookup' },
              ].map((s, i) => (
                <motion.g key={s.label}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}>
                  <ActionBox x={50} y={42 + i * 36} w={380} h={28}
                    label={s.label} sub={s.sub} color={IPNS} />
                </motion.g>
              ))}
              <AlertBox x={50} y={195} w={380} h={26}
                label="단점: DHT 느림 (수 초) · 오프라인 시 접근 불가" sub="" color={WARN} />
            </motion.g>
          )}

          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill={DNS}>
                DNSLink — 기존 DNS infrastructure
              </text>
              <ModuleBox x={50} y={50} w={380} h={36}
                label="_dnslink.example.com" sub={'TXT "dnslink=/ipfs/bafyXXX"'} color={DNS} />
              <DataBox x={70} y={108} w={170} h={28} label="✓ DNS cache 빠름" color={DNS} outlined />
              <DataBox x={70} y={144} w={170} h={28} label="✓ TLS cert 연동" color={DNS} outlined />
              <DataBox x={250} y={108} w={170} h={28} label="✓ 브라우저 친화" color={DNS} outlined />
              <DataBox x={250} y={144} w={170} h={28} label="✗ DNS 서버 신뢰" color={WARN} outlined />
              <text x={240} y={210} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                도메인 소유권 필요 — 약간의 중앙화
              </text>
            </motion.g>
          )}

          {step === 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill={ENS}>
                ENS — Ethereum Name Service
              </text>
              <ModuleBox x={70} y={50} w={120} h={42}
                label="vitalik.eth" sub="ENS name" color={ENS} />
              <text x={240} y={75} textAnchor="middle" fontSize={14} fill={ENS}>→</text>
              <ModuleBox x={290} y={50} w={120} h={42}
                label="IPFS hash" sub="contenthash" color={IROH} />
              <ActionBox x={70} y={120} w={340} h={28}
                label="ENS Contract" sub="on-chain 저장 + 권한 검증" color={ENS} />
              <text x={240} y={188} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                다른 레코드도 보유 (ETH 주소, text records 등)
              </text>
            </motion.g>
          )}

          {step === 5 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill={IROH}>
                iroh — NodeID + Pkarr
              </text>
              <ModuleBox x={70} y={50} w={120} h={42}
                label="NodeID" sub="Ed25519 pubkey" color={IROH} />
              <text x={240} y={75} textAnchor="middle" fontSize={14} fill={IROH}>→</text>
              <ModuleBox x={290} y={50} w={120} h={42}
                label="Pkarr DHT" sub="DNS over DHT" color={IROH} />
              <ActionBox x={70} y={120} w={340} h={28}
                label="서명된 레코드" sub="Relay URL 전파 + Direct dial" color={IROH} />
              <text x={240} y={188} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                CID 대신 BLAKE3 해시 — 별도 IPNS 없음
              </text>
            </motion.g>
          )}

          {step === 6 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill={GW}>
                Web Gateway — HTTP로 IPFS 접근
              </text>
              {[
                { label: 'ipfs.io', sub: 'https://ipfs.io/ipfs/<CID>' },
                { label: 'dweb.link', sub: 'https://<CID>.ipfs.dweb.link (subdomain)' },
                { label: 'Cloudflare / Pinata / Fleek', sub: '상용 게이트웨이' },
              ].map((g, i) => (
                <motion.g key={g.label}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}>
                  <ActionBox x={50} y={42 + i * 44} w={380} h={36}
                    label={g.label} sub={g.sub} color={GW} />
                </motion.g>
              ))}
              <AlertBox x={50} y={195} w={380} h={26}
                label="브라우저 호환 ↔ 중앙화 trade-off" sub="" color={WARN} />
            </motion.g>
          )}

          {step === 7 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
                이름 해석 시스템 비교
              </text>
              <text x={70} y={48} fontSize={9} fontWeight={700} fill="var(--muted-foreground)">시스템</text>
              <text x={170} y={48} fontSize={9} fontWeight={700} fill="var(--muted-foreground)">변경</text>
              <text x={230} y={48} fontSize={9} fontWeight={700} fill="var(--muted-foreground)">탈중앙</text>
              <text x={310} y={48} fontSize={9} fontWeight={700} fill="var(--muted-foreground)">속도</text>
              <text x={390} y={48} fontSize={9} fontWeight={700} fill="var(--muted-foreground)">기반</text>
              <line x1={60} y1={54} x2={460} y2={54} stroke="var(--border)" strokeWidth={0.5} />
              {COMPARE.map((r, i) => (
                <motion.g key={r.sys}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}>
                  <text x={70} y={76 + i * 28} fontSize={9} fontWeight={600} fill={IPNS}>{r.sys}</text>
                  <text x={170} y={76 + i * 28} fontSize={9} fill="var(--foreground)">{r.mut}</text>
                  <text x={230} y={76 + i * 28} fontSize={9} fill="var(--foreground)">{r.dec}</text>
                  <text x={310} y={76 + i * 28} fontSize={9} fill="var(--foreground)">{r.speed}</text>
                  <text x={390} y={76 + i * 28} fontSize={9} fill="var(--muted-foreground)">{r.note}</text>
                </motion.g>
              ))}
              <text x={240} y={208} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                미래: IPIP-366 IPNS-on-Pubsub · trustless gateway · 브라우저 native
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
