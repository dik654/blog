import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { DataBox, ActionBox } from '@/components/viz/boxes';

const C = {
  reg: '#6366f1',
  attest: '#10b981',
  secret: '#0ea5e9',
  cluster: '#f59e0b',
  rotate: '#8b5cf6',
};
const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.45 };

const STEPS = [
  { label: 'POST /apps/register — owner가 정책 등록 (RA-TLS 필수)' },
  { label: 'POST /attest — guest agent가 quote + 키 요청' },
  { label: 'POST /apps/{id}/secrets — owner가 secret 업데이트' },
  { label: 'GET /clusters/{id}/members — cluster 멤버 조회' },
  { label: 'POST /apps/{id}/rotate — key rotation (epoch 시작)' },
];

interface Endpoint {
  method: string; path: string; color: string;
  body?: { line: string; c: string }[];
  notes: string[];
}

const ENDPOINTS: Endpoint[] = [
  {
    method: 'POST',
    path: '/api/v1/apps/register',
    color: C.reg,
    body: [
      { line: '{', c: C.reg },
      { line: '  "app_id": "...",', c: C.reg },
      { line: '  "policy": {', c: C.reg },
      { line: '    "allowed_mrtd": [...],', c: C.reg },
      { line: '    "allowed_rtmr": {...}', c: C.reg },
      { line: '  },', c: C.reg },
      { line: '  "owner_pubkey": "..."', c: C.reg },
      { line: '}', c: C.reg },
    ],
    notes: ['owner가 호출 (signed request)', 'KMS가 Policy 객체 저장', 'RA-TLS 인증서 필수'],
  },
  {
    method: 'POST',
    path: '/api/v1/attest',
    color: C.attest,
    body: [
      { line: '{', c: C.attest },
      { line: '  "quote": "<base64 TDX>",', c: C.attest },
      { line: '  "app_id": "...",', c: C.attest },
      { line: '  "requested_keys": [', c: C.attest },
      { line: '    "db_password",', c: C.attest },
      { line: '    "api_token"', c: C.attest },
      { line: '  ]', c: C.attest },
      { line: '}', c: C.attest },
    ],
    notes: ['guest agent가 호출', 'attestation 통과 시 keys 반환', '응답: encrypted with quote pubkey'],
  },
  {
    method: 'POST',
    path: '/api/v1/apps/{app_id}/secrets',
    color: C.secret,
    body: [
      { line: 'Headers:', c: C.secret },
      { line: '  Authorization: Signed-Request', c: C.secret },
      { line: 'Body:', c: C.secret },
      { line: '{', c: C.secret },
      { line: '  "name": "db_password",', c: C.secret },
      { line: '  "value": "<encrypted with', c: C.secret },
      { line: '            app_key>"', c: C.secret },
      { line: '}', c: C.secret },
    ],
    notes: ['owner가 호출', '값은 KMS가 보관', 'guest agent가 attest 시 받음'],
  },
  {
    method: 'GET',
    path: '/api/v1/clusters/{cluster_id}/members',
    color: C.cluster,
    notes: [
      'cluster 안 active TDX VM 목록',
      '각 멤버의 app_id, instance_id 반환',
      '서로 RPC할 때 cluster_key로 인증',
    ],
  },
  {
    method: 'POST',
    path: '/api/v1/apps/{app_id}/rotate',
    color: C.rotate,
    notes: [
      '새 epoch 시작 (epoch 카운터 +1)',
      '이전 key는 grace period 동안 유효 (보통 24h)',
      '키 유출 의심 시 owner가 강제 호출',
    ],
  },
];

export default function KmsApiViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const ep = ENDPOINTS[step];
        return (
          <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
            <text x={240} y={14} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
              dstack-kms HTTP API
            </text>
            <motion.g key={`hdr-${step}`} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={sp}>
              <rect x={30} y={28} width={420} height={28} rx={5} fill={`${ep.color}15`} stroke={`${ep.color}55`} strokeWidth={0.8} />
              <rect x={30} y={28} width={56} height={28} rx={5} fill={`${ep.color}40`} />
              <text x={58} y={45} textAnchor="middle" fontSize={9.5} fontWeight={700} fill={ep.color}>{ep.method}</text>
              <text x={94} y={45} fontSize={9.5} fontFamily="monospace" fontWeight={700} fill={ep.color}>{ep.path}</text>
            </motion.g>
            {ep.body && (
              <g>
                <text x={42} y={75} fontSize={8.5} fontWeight={600} fill="var(--muted-foreground)">Body</text>
                {ep.body.map((l, i) => (
                  <motion.g key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                    <rect x={30} y={82 + i * 16} width={240} height={14} rx={2} fill={`${l.c}08`} stroke={`${l.c}30`} strokeWidth={0.5} />
                    <text x={42} y={92 + i * 16} fontSize={8.5} fontFamily="monospace" fontWeight={600} fill={l.c}>{l.line}</text>
                  </motion.g>
                ))}
              </g>
            )}
            <g>
              <text x={285} y={75} fontSize={8.5} fontWeight={600} fill="var(--muted-foreground)">Notes</text>
              {ep.notes.map((n, i) => (
                <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 + i * 0.1 }}>
                  <rect x={285} y={82 + i * 30} width={170} height={26} rx={3} fill={`${ep.color}10`} stroke={`${ep.color}40`} strokeWidth={0.5} />
                  <text x={295} y={94 + i * 30} fontSize={8} fill={ep.color} fontWeight={600}>• {n}</text>
                </motion.g>
              ))}
            </g>
            {step === 1 && (
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
                <rect x={30} y={216} width={420} height={4} fill={C.attest} opacity={0.6} />
              </motion.g>
            )}
            {!ep.body && (
              <DataBox x={30} y={188} w={420} h={28} label="단순 read 또는 ACK 응답 — body 없음" color={ep.color} />
            )}
            <ActionBox x={30} y={195} w={420} h={20} label={`${step + 1} / ${ENDPOINTS.length}  endpoint`} color={ep.color} />
          </svg>
        );
      }}
    </StepViz>
  );
}
