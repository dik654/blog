import { motion } from 'framer-motion';
import { DataBox } from '@/components/viz/boxes';
import { C } from './IntegrationVizData';

export function StepLayers() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">EC + F3 — 완전 분리된 레이어</text>
    <text x={20} y={44} fontSize={10} fill={C.ec}>Line 1: ec := ExpectedConsensus{'{'}vrfKey, sortition{'}'}  // 블록 생산</text>
    <motion.text x={20} y={62} fontSize={10} fill={C.f3}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
      Line 2: f3 := NewF3(ctx, ec, gpbft)  // 확정 레이어만 추가
    </motion.text>
    <motion.text x={20} y={80} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      Line 3: // EC 로직 변경 없음 — F3 비활성화해도 EC 정상 동작
    </motion.text>
  </g>);
}

export function StepMainLoop() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill={C.f3}>F3.Run() — goroutine 메인 루프</text>
    <text x={20} y={44} fontSize={10} fill={C.f3}>Line 1: select {'{'} case notif := {'<'}-f3.ecNotify:  // 새 tipset 수신</text>
    <motion.text x={20} y={62} fontSize={10} fill={C.f3}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
      Line 2:   instance := gpbft.Begin(notif.tipset)  // 인스턴스 생성
    </motion.text>
    <motion.text x={20} y={80} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      Line 3: {'}'}  // 별도 goroutine — F3 장애가 EC에 영향 없음
    </motion.text>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      <DataBox x={340} y={68} w={110} h={22} label="Notification" sub="새 tipset" color={C.ec} />
    </motion.g>
  </g>);
}

export function StepCert() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill={C.cert}>인증서 발행 → 체인 확정</text>
    <text x={20} y={44} fontSize={10} fill={C.f3}>Line 1: cert := instance.RunToCompletion(ctx)  // 5단계 완료</text>
    <motion.text x={20} y={62} fontSize={10} fill={C.cert}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
      Line 2: certStore.Put(cert)  // Certificate 영구 저장
    </motion.text>
    <motion.text x={20} y={80} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      Line 3: // 이후 체인 reorg 불가 — 확정성 보장
    </motion.text>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      <DataBox x={340} y={68} w={110} h={22} label="Certificate" sub="reorg 불가" color={C.cert} />
    </motion.g>
  </g>);
}
