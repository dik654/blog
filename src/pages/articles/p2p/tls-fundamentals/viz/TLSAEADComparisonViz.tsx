import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { DataBox, ModuleBox, ActionBox } from '@/components/viz/boxes';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C = {
  aes: '#6366f1',
  cha: '#10b981',
  ccm: '#f59e0b',
  ok: '#10b981',
  warn: '#ef4444',
  axis: '#94a3b8',
  meta: '#8b5cf6',
};

const STEPS = [
  {
    label: 'TLS 1.3 AEAD 스위트 5종',
    body: 'AES-128-GCM (기본) / AES-256-GCM (고보안) / ChaCha20-Poly1305 (모바일) / AES-128-CCM (IoT) / AES-128-CCM-8 (IoT 짧은 태그).\n키 크기·태그 크기·하드웨어 가속 여부로 선택 분기.',
  },
  {
    label: 'AES-GCM vs ChaCha20-Poly1305',
    body: 'AES-GCM: AES-NI (Intel) / ARMv8 가속 시 압도적으로 빠름.\nChaCha20-Poly1305: 가속 없을 때 빠름 + 사이드채널 저항.\n→ 모바일·임베디드는 ChaCha20, 서버/데스크톱은 AES-GCM.',
  },
  {
    label: 'AEAD 3대 속성',
    body: 'Confidentiality: plaintext 노출 불가.\nIntegrity: 변조 즉시 감지.\nAuthenticity: 발신자 검증.\n단일 연산 = MAC-then-Encrypt 류 조합 오류 원천 차단.',
  },
  {
    label: 'AEAD.Encrypt 입력/출력',
    body: 'inputs: key / nonce(12B) / plaintext(content+content_type+padding) / AAD(record_header).\noutputs: ciphertext + 16B auth_tag.\n태그가 무결성 + 인증 동시 보장.',
  },
  {
    label: 'Padding — 트래픽 분석 방어',
    body: '고정 블록 / 랜덤 / 최대 패딩 3가지 전략.\n원래 메시지 크기를 외부에서 추정 불가.\nTrade-off: 대역폭 vs 프라이버시.',
  },
];

const SUITES = [
  { name: 'AES_128_GCM_SHA256', key: 128, tag: 16, use: '기본', c: '#6366f1' },
  { name: 'AES_256_GCM_SHA384', key: 256, tag: 16, use: '고보안', c: '#3b82f6' },
  { name: 'CHACHA20_POLY1305', key: 256, tag: 16, use: '모바일', c: '#10b981' },
  { name: 'AES_128_CCM_SHA256', key: 128, tag: 16, use: 'IoT', c: '#f59e0b' },
  { name: 'AES_128_CCM_8_SHA256', key: 128, tag: 8, use: 'IoT 단축', c: '#f97316' },
];

export default function TLSAEADComparisonViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 520 280" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={260} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.aes}>
                TLS 1.3 AEAD Cipher Suites
              </text>
              {/* table header */}
              <text x={30} y={45} fontSize={9} fontWeight={700} fill={C.axis}>
                suite
              </text>
              <text x={290} y={45} fontSize={9} fontWeight={700} fill={C.axis} textAnchor="middle">
                key
              </text>
              <text x={360} y={45} fontSize={9} fontWeight={700} fill={C.axis} textAnchor="middle">
                tag
              </text>
              <text x={440} y={45} fontSize={9} fontWeight={700} fill={C.axis} textAnchor="middle">
                use case
              </text>
              <line x1={20} y1={50} x2={500} y2={50} stroke={C.axis} strokeWidth={0.5} opacity={0.5} />

              {SUITES.map((s, i) => {
                const y = 60 + i * 38;
                return (
                  <g key={s.name}>
                    <rect x={20} y={y} width={480} height={32} rx={4} fill={`${s.c}08`} stroke={s.c} strokeWidth={0.6} />
                    <text x={30} y={y + 20} fontSize={9.5} fontFamily="monospace" fontWeight={600} fill={s.c}>
                      TLS_{s.name}
                    </text>
                    {/* key bar */}
                    <rect
                      x={250}
                      y={y + 10}
                      width={(s.key / 256) * 60}
                      height={12}
                      rx={2}
                      fill={s.c}
                      opacity={0.6}
                    />
                    <text x={290} y={y + 20} fontSize={8.5} textAnchor="middle" fill={s.c} fontWeight={600}>
                      {s.key}b
                    </text>
                    {/* tag */}
                    <rect
                      x={335}
                      y={y + 10}
                      width={(s.tag / 16) * 30}
                      height={12}
                      rx={2}
                      fill={s.c}
                      opacity={0.6}
                    />
                    <text x={360} y={y + 20} fontSize={8.5} textAnchor="middle" fill={s.c} fontWeight={600}>
                      {s.tag}B
                    </text>
                    <text x={440} y={y + 20} fontSize={9} textAnchor="middle" fill={s.c} fontWeight={600}>
                      {s.use}
                    </text>
                  </g>
                );
              })}
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={260} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.meta}>
                AES-GCM vs ChaCha20-Poly1305
              </text>
              {/* AES side */}
              <ModuleBox x={30} y={40} w={210} h={56} label="AES-GCM" sub="AES-CTR + GHASH" color={C.aes} />
              <DataBox x={30} y={108} w={210} h={28} label="HW: AES-NI / ARMv8" color={C.aes} outlined />
              <DataBox x={30} y={142} w={210} h={28} label="병렬 처리 가능" color={C.aes} outlined />
              {/* speed bar */}
              <text x={30} y={195} fontSize={9} fill={C.axis} fontWeight={600}>
                서버(HW 가속):
              </text>
              <rect x={30} y={200} width={210} height={10} rx={2} fill={C.axis} opacity={0.15} />
              <motion.rect
                x={30}
                y={200}
                height={10}
                rx={2}
                initial={{ width: 0 }}
                animate={{ width: 210 }}
                transition={{ duration: 0.5 }}
                fill={C.aes}
              />
              <text x={30} y={232} fontSize={9} fill={C.axis} fontWeight={600}>
                모바일(HW 없음):
              </text>
              <rect x={30} y={237} width={210} height={10} rx={2} fill={C.axis} opacity={0.15} />
              <motion.rect
                x={30}
                y={237}
                height={10}
                rx={2}
                initial={{ width: 0 }}
                animate={{ width: 90 }}
                transition={{ duration: 0.5 }}
                fill={C.aes}
              />

              {/* ChaCha side */}
              <ModuleBox x={280} y={40} w={210} h={56} label="ChaCha20-Poly1305" sub="stream + Poly1305" color={C.cha} />
              <DataBox x={280} y={108} w={210} h={28} label="SW 빠름 (no HW 필요)" color={C.cha} outlined />
              <DataBox x={280} y={142} w={210} h={28} label="사이드채널 저항" color={C.cha} outlined />
              <text x={280} y={195} fontSize={9} fill={C.axis} fontWeight={600}>
                서버(HW 가속):
              </text>
              <rect x={280} y={200} width={210} height={10} rx={2} fill={C.axis} opacity={0.15} />
              <motion.rect
                x={280}
                y={200}
                height={10}
                rx={2}
                initial={{ width: 0 }}
                animate={{ width: 130 }}
                transition={{ duration: 0.5 }}
                fill={C.cha}
              />
              <text x={280} y={232} fontSize={9} fill={C.axis} fontWeight={600}>
                모바일(HW 없음):
              </text>
              <rect x={280} y={237} width={210} height={10} rx={2} fill={C.axis} opacity={0.15} />
              <motion.rect
                x={280}
                y={237}
                height={10}
                rx={2}
                initial={{ width: 0 }}
                animate={{ width: 200 }}
                transition={{ duration: 0.5 }}
                fill={C.cha}
              />
              <text x={260} y={268} textAnchor="middle" fontSize={9} fill={C.axis}>
                서버=AES-GCM, 모바일/임베디드=ChaCha20 가 일반적 선택
              </text>
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={260} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.ok}>
                AEAD = 3대 속성을 한 연산으로
              </text>
              {[
                { label: 'Confidentiality', sub: 'plaintext 숨김', c: C.aes },
                { label: 'Integrity', sub: '변조 감지', c: C.cha },
                { label: 'Authenticity', sub: '발신자 인증', c: C.meta },
              ].map((p, i) => (
                <g key={p.label}>
                  <ModuleBox x={30 + i * 165} y={50} w={150} h={68} label={p.label} sub={p.sub} color={p.c} />
                  <text x={105 + i * 165} y={138} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.ok}>
                    ✓
                  </text>
                </g>
              ))}

              {/* unified op */}
              <ActionBox x={130} y={170} w={260} h={42} label="AEAD.Encrypt(...)" sub="단일 연산으로 3가지 동시" color={C.ok} />

              {/* legacy contrast */}
              <text x={260} y={235} textAnchor="middle" fontSize={9.5} fill={C.warn} fontWeight={600}>
                vs MAC-then-Encrypt (TLS 1.2 CBC) — 조합 오류로 Lucky13 등 공격
              </text>
              <text x={260} y={255} textAnchor="middle" fontSize={9} fill={C.axis}>
                TLS 1.3 은 AEAD 만 허용 → 구현 차이 자체가 사라짐
              </text>
            </motion.g>
          )}

          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={260} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.aes}>
                AEAD.Encrypt — 입력 4 / 출력 2
              </text>
              {/* inputs */}
              <DataBox x={20} y={50} w={130} h={32} label="key" sub="traffic_key" color={C.aes} outlined />
              <DataBox x={20} y={90} w={130} h={32} label="nonce" sub="iv ⊕ counter" color={C.meta} outlined />
              <DataBox x={20} y={130} w={130} h={32} label="plaintext" sub="data + ct + pad" color={C.cha} outlined />
              <DataBox x={20} y={170} w={130} h={32} label="AAD" sub="record_header (5B)" color={C.ccm} outlined />

              {/* arrows */}
              {[66, 106, 146, 186].map((y, i) => (
                <motion.line
                  key={i}
                  x1={150}
                  y1={y}
                  x2={210}
                  y2={130}
                  stroke={C.axis}
                  strokeWidth={0.8}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.08 }}
                />
              ))}

              {/* AEAD module */}
              <ModuleBox x={210} y={100} w={130} h={68} label="AEAD" sub="Encrypt" color={C.ok} />

              {/* outputs */}
              <motion.line x1={340} y1={120} x2={385} y2={108} stroke={C.ok} strokeWidth={1.2} markerEnd="url(#ara)" />
              <motion.line x1={340} y1={150} x2={385} y2={172} stroke={C.ok} strokeWidth={1.2} markerEnd="url(#ara)" />
              <defs>
                <marker id="ara" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                  <path d="M0,0 L6,3 L0,6 Z" fill={C.ok} />
                </marker>
              </defs>

              <DataBox x={385} y={90} w={120} h={36} label="ciphertext" sub="원문 길이 동일" color={C.ok} outlined />
              <DataBox x={385} y={155} w={120} h={36} label="auth_tag" sub="16 bytes" color={C.warn} outlined />

              <text x={260} y={235} textAnchor="middle" fontSize={9.5} fill={C.warn} fontWeight={600}>
                tag 16B 가 변조 감지 + 인증의 핵심
              </text>
              <text x={260} y={253} textAnchor="middle" fontSize={9} fill={C.axis}>
                Decrypt 시 tag 불일치 → 즉시 alert + 연결 종료
              </text>
            </motion.g>
          )}

          {step === 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={260} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.meta}>
                Padding 전략 비교
              </text>
              {/* original */}
              <text x={30} y={50} fontSize={9} fontWeight={600} fill={C.axis}>
                원본:
              </text>
              <rect x={75} y={40} width={120} height={18} rx={2} fill={C.cha} opacity={0.5} />
              <text x={135} y={53} textAnchor="middle" fontSize={8.5} fill="#000" fontWeight={600}>
                data
              </text>

              {/* strategy 1: fixed block */}
              <text x={30} y={90} fontSize={9} fontWeight={600} fill={C.aes}>
                고정 블록:
              </text>
              <rect x={75} y={80} width={120} height={18} rx={2} fill={C.cha} opacity={0.5} />
              <rect x={195} y={80} width={45} height={18} rx={2} fill={C.aes} opacity={0.4} />
              <text x={217} y={93} textAnchor="middle" fontSize={8} fill={C.aes}>
                pad
              </text>
              <text x={260} y={93} fontSize={8.5} fill={C.axis}>
                → 16B 단위 정렬, 약한 은닉
              </text>

              {/* strategy 2: random */}
              <text x={30} y={130} fontSize={9} fontWeight={600} fill={C.cha}>
                랜덤 패딩:
              </text>
              <rect x={75} y={120} width={120} height={18} rx={2} fill={C.cha} opacity={0.5} />
              <motion.rect
                x={195}
                y={120}
                height={18}
                rx={2}
                fill={C.cha}
                opacity={0.4}
                initial={{ width: 30 }}
                animate={{ width: 95 }}
                transition={{ duration: 1.5, repeat: Infinity, repeatType: 'reverse' }}
              />
              <text x={217} y={133} textAnchor="middle" fontSize={8} fill={C.cha}>
                pad
              </text>
              <text x={310} y={133} fontSize={8.5} fill={C.axis}>
                → 크기 변동, 균형
              </text>

              {/* strategy 3: max padding */}
              <text x={30} y={170} fontSize={9} fontWeight={600} fill={C.warn}>
                최대 패딩:
              </text>
              <rect x={75} y={160} width={120} height={18} rx={2} fill={C.cha} opacity={0.5} />
              <rect x={195} y={160} width={235} height={18} rx={2} fill={C.warn} opacity={0.4} />
              <text x={312} y={173} textAnchor="middle" fontSize={8} fill={C.warn}>
                pad ⋯
              </text>
              <text x={260} y={195} fontSize={8.5} fill={C.axis}>
                → 모든 record 동일 크기, 강한 은닉
              </text>

              <text x={260} y={235} textAnchor="middle" fontSize={9.5} fill={C.meta} fontWeight={600}>
                Trade-off: 대역폭 ↔ 트래픽 분석 저항
              </text>
              <text x={260} y={253} textAnchor="middle" fontSize={9} fill={C.axis}>
                패딩은 ciphertext 안에 포함 → 외부에서 데이터/패딩 구분 불가
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
