import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C = { c: '#6366f1', nat: '#6b7280', stun: '#10b981', r: '#f59e0b' };

const STEPS = [
  { label: 'Binding Request 전송', body: 'STUN_HEADER {\n  type: 0x0001,            // Binding Request\n  length: 0,               // 속성 없음\n  magic: 0x2112A442,       // STUN 매직 쿠키\n  txn_id: random(12B)\n}\nUDP src = 192.168.1.5:3000 → stun.example.com:3478' },
  { label: 'NAT 매핑 생성', body: 'NAT 테이블 추가:\n  Internal: 192.168.1.5:3000\n  External: 203.0.113.10:5678  // NAT 할당\n  Remote:   stun.example.com:3478\n\nPacket rewrite:\n  src: 192.168.1.5:3000 → 203.0.113.10:5678\n  dst: stun.example.com:3478 (변경 없음)' },
  { label: 'Binding Response', body: 'XOR-MAPPED-ADDRESS {\n  family: 0x01,           // IPv4\n  port: 5678 XOR 0x2112, // = 0x3744\n  addr: 203.0.113.10 XOR 0x2112A442\n}\n// XOR: NAT/방화벽이 주소를 변조하는 것 방지.\n// 클라이언트가 XOR 해제 → 원본 주소 복원.' },
  { label: '외부 주소 획득', body: 'port = 0x3744 XOR 0x2112 = 5678\naddr = XOR_addr XOR 0x2112A442 = 203.0.113.10\n\n나의 공인 주소: 203.0.113.10:5678\n→ SDP/ICE candidate로 피어에게 전달.\n// NAT 유형 판별: 두 번째 STUN 서버로 반복.' },
];

export default function STUNViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 490 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={20} y={18} fontSize={10} fontWeight={600} fill={C.c}>Binding Request</text>
              {['STUN {',
                '  type: 0x0001,  // Binding Request',
                '  magic: 0x2112A442,',
                '  txn_id: random(12B)',
                '}', '',
                'UDP 192.168.1.5:3000 → stun:3478'].map((t, i) => (
                <text key={i} x={20} y={38 + i * 16} fontSize={10} fontFamily="monospace"
                  fill={C.c}>{t}</text>
              ))}
            </motion.g>
          )}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={20} y={18} fontSize={10} fontWeight={600} fill={C.nat}>NAT 매핑</text>
              {['NAT table += {',
                '  int: 192.168.1.5:3000',
                '  ext: 203.0.113.10:5678',
                '  rem: stun:3478',
                '}', '',
                'src rewrite: .5:3000 → .10:5678'].map((t, i) => (
                <text key={i} x={20} y={38 + i * 16} fontSize={10} fontFamily="monospace"
                  fill={C.nat}>{t}</text>
              ))}
            </motion.g>
          )}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={20} y={18} fontSize={10} fontWeight={600} fill={C.stun}>Binding Response</text>
              {['XOR-MAPPED-ADDRESS {',
                '  family: 0x01,  // IPv4',
                '  port: 5678 XOR 0x2112',
                '  addr: 203.0.113.10 XOR 0x2112A442',
                '}', '',
                '// XOR: ALG 변조 방지 기법'].map((t, i) => (
                <text key={i} x={20} y={38 + i * 16} fontSize={10} fontFamily="monospace"
                  fill={C.stun}>{t}</text>
              ))}
            </motion.g>
          )}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={20} y={18} fontSize={10} fontWeight={600} fill={C.r}>주소 복원</text>
              {['port = 0x3744 XOR 0x2112 = 5678',
                'addr = XOR_val XOR 0x2112A442',
                '     = 203.0.113.10', '',
                '나의 공인: 203.0.113.10:5678',
                '→ ICE candidate로 피어에게 전달'].map((t, i) => (
                <text key={i} x={20} y={38 + i * 16} fontSize={10} fontFamily="monospace"
                  fill={C.r}>{t}</text>
              ))}
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
