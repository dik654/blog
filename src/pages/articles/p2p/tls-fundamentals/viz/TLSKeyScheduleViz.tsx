import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C = { early: '#f59e0b', hs: '#6366f1', master: '#10b981', up: '#8b5cf6' };

const STEPS = [
  { label: 'Early Secret (PSK 기반)', body: 'PSK = 이전 세션 티켓 (없으면 0x00..00)\nearly_secret = HKDF-Extract(salt=0, IKM=PSK)\n\nclient_early_key = HKDF-Expand(\n  early_secret, "c e traffic", CH_hash\n)\n// 0-RTT 데이터 암호화에 사용.' },
  { label: 'Handshake Secret (ECDHE)', body: 'shared = x25519(eph_priv, peer_pub)\nderived = HKDF-Expand(early_secret, "derived", "")\nhs_secret = HKDF-Extract(salt=derived, IKM=shared)\n\nclient_hs_key = HKDF-Expand(hs_secret, "c hs traffic", H)\nserver_hs_key = HKDF-Expand(hs_secret, "s hs traffic", H)\n// 핸드셰이크 트래픽 암호화.' },
  { label: 'Master Secret (애플리케이션)', body: 'derived2 = HKDF-Expand(hs_secret, "derived", "")\nmaster = HKDF-Extract(salt=derived2, IKM=0x00..00)\n\nclient_app_key = HKDF-Expand(master, "c ap traffic", H)\nserver_app_key = HKDF-Expand(master, "s ap traffic", H)\n// 애플리케이션 데이터 암호화.' },
  { label: 'Key Update (갱신)', body: 'new_key = HKDF-Expand(current_key, "traffic upd", "")\n\n// KeyUpdate 메시지 전송 후 즉시 전환.\n// 주기적 갱신으로 Forward Secrecy 강화.\n// 이전 키 노출 시 이후 데이터만 보호.' },
];

export default function TLSKeyScheduleViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 490 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={20} y={18} fontSize={10} fontWeight={600} fill={C.early}>Early Secret</text>
              {['PSK = session_ticket (or 0x00..00)',
                'early = HKDF-Extract(0, PSK)',
                'c_early = Expand(early, "c e traffic", CH)',
                '', '// 0-RTT 데이터 암호화 키',
                '// PSK 없으면 0-RTT 불가'].map((t, i) => (
                <text key={i} x={20} y={38 + i * 16} fontSize={10} fontFamily="monospace"
                  fill={C.early}>{t}</text>
              ))}
            </motion.g>
          )}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={20} y={18} fontSize={10} fontWeight={600} fill={C.hs}>Handshake Secret</text>
              {['shared = x25519(eph_priv, peer_pub)',
                'derived = Expand(early, "derived", "")',
                'hs = Extract(derived, shared)', '',
                'c_hs = Expand(hs, "c hs traffic", H)',
                's_hs = Expand(hs, "s hs traffic", H)'].map((t, i) => (
                <text key={i} x={20} y={38 + i * 16} fontSize={10} fontFamily="monospace"
                  fill={C.hs}>{t}</text>
              ))}
            </motion.g>
          )}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={20} y={18} fontSize={10} fontWeight={600} fill={C.master}>Master Secret</text>
              {['derived2 = Expand(hs, "derived", "")',
                'master = Extract(derived2, 0x00..00)', '',
                'c_app = Expand(master, "c ap traffic", H)',
                's_app = Expand(master, "s ap traffic", H)',
                '// 애플리케이션 데이터 AEAD 키'].map((t, i) => (
                <text key={i} x={20} y={38 + i * 16} fontSize={10} fontFamily="monospace"
                  fill={C.master}>{t}</text>
              ))}
            </motion.g>
          )}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={20} y={18} fontSize={10} fontWeight={600} fill={C.up}>Key Update</text>
              {['new = Expand(current, "traffic upd", "")',
                'send KeyUpdate message',
                'switch to new key immediately', '',
                '// Forward Secrecy: 이전 키 삭제',
                '// 노출 시 이후 데이터만 보호'].map((t, i) => (
                <text key={i} x={20} y={38 + i * 16} fontSize={10} fontFamily="monospace"
                  fill={C.up}>{t}</text>
              ))}
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
