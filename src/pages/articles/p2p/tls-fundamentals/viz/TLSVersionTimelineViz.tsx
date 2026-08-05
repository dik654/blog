import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { DataBox, AlertBox, ModuleBox } from '@/components/viz/boxes';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C = {
  dead: '#ef4444',
  legacy: '#f59e0b',
  modern: '#6366f1',
  ok: '#10b981',
  axis: '#94a3b8',
};

const STEPS = [
  {
    label: '버전 타임라인 — SSL 2.0 → TLS 1.3',
    body: '1995년 SSL 2.0 부터 2018년 TLS 1.3 까지 7개 버전.\n각 버전마다 알려진 공격(POODLE, BEAST 등)으로 폐기 또는 권고 중단.\nTLS 1.3 이전 모두 현재 deprecated 또는 not recommended.',
  },
  {
    label: 'TLS 1.3 핵심 개선 5가지',
    body: '1-RTT 핸드셰이크 / 0-RTT PSK 재연결 / 레거시 cipher 제거 / ECDHE 강제(FS) / ServerHello 이후 전 메시지 암호화.',
  },
  {
    label: '제거된 위험 요소들',
    body: 'RC4·3DES·SHA-1·CBC·Static RSA·Static DH·Export·Compression·Renegotiation 모두 제거.\n각각 명확한 공격 사례 보유 (POODLE, BEAST, Lucky13, CRIME ...).',
  },
  {
    label: '허용되는 모던 알고리즘',
    body: 'AEAD: AES-GCM, ChaCha20-Poly1305 / 키 교환: ECDHE 전용 / 서명: RSA-PSS, ECDSA, EdDSA.\n취약 조합 자체가 협상 불가능.',
  },
  {
    label: '브라우저 도입 — 2018~2020',
    body: 'Chrome 70 / Firefox 63 / Safari 12.1 / Edge 79 — 2018~2020 사이 일제히 지원.\n2024 기준 95%+ 글로벌 지원.',
  },
];

const VERSIONS = [
  { x: 30, label: 'SSL 2.0', year: '1995', state: 'dead', note: '취약' },
  { x: 95, label: 'SSL 3.0', year: '1996', state: 'dead', note: 'POODLE' },
  { x: 160, label: 'TLS 1.0', year: '1999', state: 'dead', note: 'BEAST' },
  { x: 225, label: 'TLS 1.1', year: '2006', state: 'dead', note: '폐기 2020' },
  { x: 290, label: 'TLS 1.2', year: '2008', state: 'legacy', note: '호환' },
  { x: 380, label: 'TLS 1.3', year: '2018', state: 'modern', note: 'RFC 8446' },
];

const REMOVED = [
  { label: 'RC4', sub: '스트림' },
  { label: '3DES', sub: '구식' },
  { label: 'SHA-1', sub: 'MAC' },
  { label: 'CBC', sub: 'Lucky13' },
  { label: 'Static RSA', sub: 'no FS' },
  { label: 'Static DH', sub: 'no FS' },
  { label: 'Export', sub: '40-bit' },
  { label: 'Compress', sub: 'CRIME' },
];

const ALLOWED = [
  { label: 'AES-GCM', sub: 'AEAD' },
  { label: 'ChaCha20', sub: 'AEAD' },
  { label: 'ECDHE', sub: 'FS' },
  { label: 'EdDSA', sub: 'sig' },
];

const FEATURES = [
  { label: '1-RTT', sub: '풀 핸드셰이크' },
  { label: '0-RTT', sub: 'PSK resume' },
  { label: 'No legacy', sub: 'cipher 제거' },
  { label: 'ECDHE 강제', sub: 'Forward Secrecy' },
  { label: 'Encrypted', sub: 'SH 이후 전부' },
];

const BROWSERS = [
  { label: 'Chrome 70', sub: '2018' },
  { label: 'Firefox 63', sub: '2018' },
  { label: 'Safari 12.1', sub: '2019' },
  { label: 'Edge 79', sub: '2020' },
];

export default function TLSVersionTimelineViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 520 280" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {/* timeline axis */}
              <line x1={20} y1={150} x2={500} y2={150} stroke={C.axis} strokeWidth={1} />
              {VERSIONS.map((v) => {
                const c = v.state === 'dead' ? C.dead : v.state === 'legacy' ? C.legacy : C.modern;
                return (
                  <g key={v.label}>
                    <line x1={v.x + 30} y1={150} x2={v.x + 30} y2={120} stroke={c} strokeWidth={1.2} />
                    <DataBox x={v.x} y={75} w={60} h={28} label={v.label} sub={v.year} color={c} outlined />
                    <text x={v.x + 30} y={170} textAnchor="middle" fontSize={8.5} fill={c} fontWeight={600}>
                      {v.note}
                    </text>
                    {v.state === 'dead' && (
                      <text x={v.x + 30} y={185} textAnchor="middle" fontSize={9} fill={C.dead} fontWeight={700}>
                        ✗
                      </text>
                    )}
                  </g>
                );
              })}
              <text x={260} y={210} textAnchor="middle" fontSize={10} fill={C.modern} fontWeight={700}>
                TLS 1.3 = 현재 표준 (2018, RFC 8446)
              </text>
              <text x={260} y={228} textAnchor="middle" fontSize={9} fill={C.axis}>
                이전 버전 모두 deprecated 또는 not recommended
              </text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={260} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.modern}>
                TLS 1.3 핵심 개선 5가지
              </text>
              {FEATURES.map((f, i) => (
                <g key={f.label}>
                  <ModuleBox
                    x={30 + (i % 3) * 160}
                    y={50 + Math.floor(i / 3) * 80}
                    w={140}
                    h={62}
                    label={f.label}
                    sub={f.sub}
                    color={C.modern}
                  />
                </g>
              ))}
              <text x={260} y={250} textAnchor="middle" fontSize={9.5} fill={C.ok} fontWeight={600}>
                → RTT 절반 + 보안 한 단계 상승
              </text>
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={260} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.dead}>
                제거된 알고리즘 (TLS 1.3)
              </text>
              {REMOVED.map((r, i) => (
                <g key={r.label}>
                  <AlertBox
                    x={20 + (i % 4) * 122}
                    y={45 + Math.floor(i / 4) * 70}
                    w={108}
                    h={54}
                    label={r.label}
                    sub={r.sub}
                    color={C.dead}
                  />
                  <text
                    x={20 + (i % 4) * 122 + 102}
                    y={58 + Math.floor(i / 4) * 70}
                    fontSize={11}
                    fontWeight={700}
                    fill={C.dead}
                    textAnchor="end"
                  >
                    ✗
                  </text>
                </g>
              ))}
              <text x={260} y={210} textAnchor="middle" fontSize={9.5} fill={C.dead} fontWeight={600}>
                알려진 공격: POODLE, BEAST, Lucky13, CRIME ...
              </text>
              <text x={260} y={228} textAnchor="middle" fontSize={9} fill={C.axis}>
                협상 단계에서 자체 차단 — 다운그레이드 불가
              </text>
            </motion.g>
          )}

          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={260} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.ok}>
                허용되는 모던 알고리즘
              </text>
              {ALLOWED.map((a, i) => (
                <g key={a.label}>
                  <ModuleBox
                    x={20 + i * 125}
                    y={55}
                    w={110}
                    h={62}
                    label={a.label}
                    sub={a.sub}
                    color={C.ok}
                  />
                  <text x={75 + i * 125} y={135} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.ok}>
                    ✓
                  </text>
                </g>
              ))}
              {/* downgrade arrow comparison */}
              <line x1={50} y1={170} x2={470} y2={170} stroke={C.axis} strokeDasharray="3 3" strokeWidth={0.6} />
              <text x={260} y={195} textAnchor="middle" fontSize={9.5} fill={C.modern} fontWeight={600}>
                AEAD: 암호화 + 인증 동시 / ECDHE: 매 세션 임시 키
              </text>
              <text x={260} y={213} textAnchor="middle" fontSize={9} fill={C.axis}>
                서명: RSA-PSS · ECDSA · EdDSA
              </text>
              <text x={260} y={235} textAnchor="middle" fontSize={9.5} fill={C.dead} fontWeight={600}>
                취약 조합 자체가 협상 불가
              </text>
            </motion.g>
          )}

          {step === 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={260} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.modern}>
                브라우저 도입 타임라인
              </text>
              {/* axis */}
              <line x1={40} y1={160} x2={480} y2={160} stroke={C.axis} strokeWidth={1} />
              {['2018', '2019', '2020'].map((y, i) => (
                <g key={y}>
                  <line x1={70 + i * 165} y1={160} x2={70 + i * 165} y2={165} stroke={C.axis} />
                  <text x={70 + i * 165} y={178} textAnchor="middle" fontSize={9} fill={C.axis}>
                    {y}
                  </text>
                </g>
              ))}
              {BROWSERS.map((b, i) => {
                const x = 35 + i * 120;
                return (
                  <g key={b.label}>
                    <DataBox x={x} y={60} w={100} h={32} label={b.label} sub={b.sub} color={C.modern} outlined />
                    <line x1={x + 50} y1={92} x2={x + 50} y2={158} stroke={C.modern} strokeDasharray="2 2" strokeWidth={0.7} />
                  </g>
                );
              })}
              {/* coverage bar */}
              <rect x={50} y={205} width={420} height={14} rx={3} fill={C.axis} opacity={0.15} />
              <motion.rect
                x={50}
                y={205}
                rx={3}
                height={14}
                initial={{ width: 0 }}
                animate={{ width: 420 * 0.95 }}
                transition={{ duration: 0.6 }}
                fill={C.ok}
              />
              <text x={260} y={240} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.ok}>
                2024: 95%+ 글로벌 지원
              </text>
              <text x={260} y={258} textAnchor="middle" fontSize={8.5} fill={C.axis}>
                서버는 1.2/1.3 이중 지원이 일반적
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
