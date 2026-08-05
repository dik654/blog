import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, AlertBox } from '@/components/viz/boxes';

const STEPS = [
  { label: '3가지 게이트웨이: Path / Subdomain / DNSLink' },
  { label: 'URL 패턴 5종' },
  { label: 'Response 처리: UnixFS → HTML / Raw / JSON' },
  { label: 'HTTP 헤더: ETag, Cache-Control, X-Ipfs-*' },
  { label: 'Trustless Gateway: 검증 가능 응답 (raw/car)' },
  { label: '공용 vs 자체 호스팅, 구성 옵션' },
];

const GWS = [
  { label: 'Path Gateway', sub: 'ipfs.io/ipfs/<CID>, legacy', color: '#94a3b8', risk: 'XSS risk' },
  { label: 'Subdomain Gateway', sub: '<CID>.ipfs.dweb.link', color: '#10b981', risk: 'Origin isolation' },
  { label: 'DNSLink Gateway', sub: 'example.com → /ipfs/CID', color: '#3b82f6', risk: 'Custom domain' },
];

const PATTERNS = [
  '/ipfs/{cid}',
  '/ipfs/{cid}/{path}',
  '/ipns/{name}',
  '/ipns/{name}/{path}',
  '/api/v0/*',
];

const RESP = [
  { label: 'UnixFS file', sub: 'HTTP body stream', color: '#10b981' },
  { label: 'UnixFS dir', sub: 'HTML listing / index.html', color: '#3b82f6' },
  { label: 'Raw block', sub: 'binary', color: '#94a3b8' },
  { label: 'Dag-json/cbor', sub: 'JSON / CBOR', color: '#f59e0b' },
];

const HEADERS = [
  { label: 'ETag', sub: 'immutable hash', color: '#6366f1' },
  { label: 'Cache-Control', sub: 'max-age=29030400', color: '#3b82f6' },
  { label: 'X-Ipfs-Path', sub: '원본 경로', color: '#10b981' },
  { label: 'Content-Type', sub: '자동 감지', color: '#f59e0b' },
  { label: 'Accept-Ranges', sub: 'bytes (streaming)', color: '#ec4899' },
];

const TRUSTLESS = [
  { label: 'vnd.ipld.raw', sub: 'raw block', color: '#10b981' },
  { label: 'vnd.ipld.car', sub: 'CAR file', color: '#3b82f6' },
  { label: 'Client verify', sub: '해시 재계산', color: '#6366f1' },
  { label: 'No gateway trust', sub: '필요 없음', color: '#f59e0b' },
];

const HOSTING = [
  { label: 'ipfs.io / dweb.link', sub: '공용 게이트웨이', color: '#3b82f6' },
  { label: 'cloudflare-ipfs', sub: '공용 (CDN)', color: '#f59e0b' },
  { label: 'pinata / fleek', sub: '상용 서비스', color: '#ec4899' },
  { label: '127.0.0.1:8080', sub: '자체 Kubo daemon', color: '#10b981' },
];

export default function GatewayTypeViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && GWS.map((g, i) => (
            <motion.g key={g.label} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}>
              <ModuleBox x={30} y={20 + i * 60} w={310} h={50} label={g.label} sub={g.sub} color={g.color} />
              <DataBox x={350} y={25 + i * 60} w={110} h={40} label={g.risk}
                color={g.color === '#94a3b8' ? '#ef4444' : '#10b981'} outlined />
            </motion.g>
          ))}

          {step === 1 && PATTERNS.map((p, i) => (
            <motion.g key={p} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}>
              <ActionBox x={50} y={15 + i * 36} w={380} h={30} label={p} color="#6366f1" />
            </motion.g>
          ))}

          {step === 2 && RESP.map((r, i) => (
            <motion.g key={r.label} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}>
              <DataBox x={30 + (i % 2) * 220} y={40 + Math.floor(i / 2) * 80}
                w={200} h={60} label={r.label} sub={r.sub} color={r.color} outlined />
            </motion.g>
          ))}

          {step === 3 && HEADERS.map((h, i) => (
            <motion.g key={h.label} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.07 }}>
              <DataBox x={20 + (i % 3) * 150} y={30 + Math.floor(i / 3) * 90}
                w={140} h={70} label={h.label} sub={h.sub} color={h.color} outlined />
            </motion.g>
          ))}

          {step === 4 && (
            <>
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <AlertBox x={140} y={15} w={200} h={40} label="Trustless Gateway" sub="draft spec, 검증 가능" color="#f59e0b" />
              </motion.g>
              {TRUSTLESS.map((t, i) => (
                <motion.g key={t.label} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.08 }}>
                  <DataBox x={30 + (i % 2) * 220} y={70 + Math.floor(i / 2) * 65}
                    w={200} h={55} label={t.label} sub={t.sub} color={t.color} outlined />
                </motion.g>
              ))}
            </>
          )}

          {step === 5 && HOSTING.map((h, i) => (
            <motion.g key={h.label} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}>
              <ModuleBox x={30 + (i % 2) * 220} y={40 + Math.floor(i / 2) * 80}
                w={200} h={60} label={h.label} sub={h.sub} color={h.color} />
            </motion.g>
          ))}
        </svg>
      )}
    </StepViz>
  );
}
