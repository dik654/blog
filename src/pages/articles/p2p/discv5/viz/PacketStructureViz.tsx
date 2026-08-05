import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, StatusBox } from '@/components/viz/boxes';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C = { iv: '#6366f1', hdr: '#10b981', auth: '#f59e0b', enc: '#a78bfa', flag: '#0ea5e9' };

const STEPS = [
  {
    label: '4-segment encrypted packet',
    body: 'IV(16) + Static Header(23, obfuscated) + Authdata(가변) + Encrypted Message.\n discv4의 [MAC|Sig|Type|Payload]와 완전히 다른 모양.',
  },
  {
    label: 'IV 16B — AES-GCM nonce',
    body: '랜덤 nonce, 매 패킷마다 새로 생성.\nstatic header의 obfuscation에도 사용 (XOR 마스킹).',
  },
  {
    label: 'Static Header 23B — protocol/version/flag/nonce',
    body: '"discv5"(6B) + version(2B) + flag(1B) + nonce(12B) + authdata-size(2B).\nflag로 ordinary/whoareyou/handshake 구분.',
  },
  {
    label: 'Flag로 패킷 타입 분기',
    body: 'flag=0: ordinary (세션 확립 후 일반 메시지).\nflag=1: WHOAREYOU (challenge).\nflag=2: handshake (세션 셋업).',
  },
  {
    label: 'Encrypted Message — AES-128-GCM',
    body: 'ciphertext = AES-GCM(key, iv, plaintext, static_header).\nstatic_header가 AAD → 헤더 변조도 감지.\n16B auth tag 부착.',
  },
];

export default function PacketStructureViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 230" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
                discv5 packet (encrypted, 4 segments)
              </text>
              <ModuleBox x={20} y={50} w={70} h={55} label="IV" sub="16 B" color={C.iv} />
              <ModuleBox x={100} y={50} w={130} h={55} label="Static Header" sub="23 B (obfuscated)" color={C.hdr} />
              <ModuleBox x={240} y={50} w={100} h={55} label="Authdata" sub="variable" color={C.auth} />
              <ModuleBox x={350} y={50} w={110} h={55} label="Encrypted Msg" sub="AES-GCM" color={C.enc} />
              <text x={240} y={140} textAnchor="middle" fontSize={9.5} fill="var(--muted-foreground)">
                discv4와 완전히 다른 레이아웃 — 세션 기반 암호화.
              </text>
              <text x={240} y={165} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                IV는 GCM nonce + obfuscation key 두 역할.
              </text>
              <text x={240} y={195} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                static header도 마스킹되어 wire에서 직접 readable 아님.
              </text>
            </motion.g>
          )}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.iv}>
                IV (16 bytes) — 두 가지 역할
              </text>
              <DataBox x={50} y={50} w={170} h={42} label="GCM nonce" sub="AES-GCM 입력" color={C.iv} outlined />
              <DataBox x={260} y={50} w={170} h={42} label="Obfuscation key" sub="static header 마스킹" color={C.iv} outlined />
              <ActionBox x={120} y={120} w={240} h={50} label="masking_iv = IV[0..16]" sub="dest_id XOR header → wire" color={C.iv} />
              <text x={240} y={195} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                매 패킷마다 새 IV — replay 방어 + 패킷 unlinkable.
              </text>
            </motion.g>
          )}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.hdr}>
                Static Header layout (23 B)
              </text>
              <DataBox x={20} y={45} w={75} h={32} label="protocol" sub='"discv5" 6B' color={C.hdr} outlined />
              <DataBox x={105} y={45} w={70} h={32} label="version" sub="0x0001 2B" color={C.hdr} outlined />
              <DataBox x={185} y={45} w={60} h={32} label="flag" sub="1 B" color={C.flag} outlined />
              <DataBox x={255} y={45} w={120} h={32} label="nonce" sub="12 B (msg counter)" color={C.hdr} outlined />
              <DataBox x={385} y={45} w={75} h={32} label="auth-size" sub="2 B" color={C.hdr} outlined />
              <text x={240} y={110} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                protocol+version → wire identification.
              </text>
              <text x={240} y={130} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                flag → 패킷 처리 분기.
              </text>
              <text x={240} y={150} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                nonce → message counter (replay 방어).
              </text>
              <text x={240} y={185} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                auth-size → variable authdata 길이 prefix.
              </text>
            </motion.g>
          )}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.flag}>
                3 packet types (by flag)
              </text>
              <ModuleBox x={20} y={45} w={140} h={55} label="flag = 0" sub="Ordinary message" color={C.flag} />
              <ModuleBox x={170} y={45} w={140} h={55} label="flag = 1" sub="WHOAREYOU" color={C.flag} />
              <ModuleBox x={320} y={45} w={140} h={55} label="flag = 2" sub="Handshake" color={C.flag} />
              <text x={90} y={130} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                세션 확립 후 일반 메시지
              </text>
              <text x={240} y={130} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                "누구냐?" 챌린지
              </text>
              <text x={390} y={130} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                서명 + ephemeral pubkey
              </text>
              <text x={240} y={185} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                authdata 형식이 flag에 따라 달라짐 — type-specific auth info.
              </text>
            </motion.g>
          )}
          {step === 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.enc}>
                AES-128-GCM encryption
              </text>
              <ActionBox x={20} y={45} w={140} h={50} label="key" sub="session key (16B)" color={C.enc} />
              <ActionBox x={170} y={45} w={140} h={50} label="iv" sub="nonce (12B)" color={C.enc} />
              <ActionBox x={320} y={45} w={140} h={50} label="aad" sub="static_header" color={C.enc} />
              <DataBox x={60} y={120} w={360} h={42} label="ciphertext = AES-GCM(key, iv, plaintext, aad)" color={C.enc} outlined />
              <StatusBox x={120} y={175} w={240} h={40} label="auth tag 16 B 부착" sub="헤더 변조 감지" color={C.enc} progress={1} />
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
