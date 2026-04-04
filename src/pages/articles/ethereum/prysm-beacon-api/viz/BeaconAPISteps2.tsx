import { motion } from 'framer-motion';
import { DataBox } from '@/components/viz/boxes';
import { C } from './BeaconAPIVizData';

const fade = (d: number) => ({ initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: d } });
const mono = { fontFamily: 'monospace', fontSize: 10, fill: 'var(--foreground)' } as const;
const comment = { fontFamily: 'monospace', fontSize: 10, fill: 'var(--muted-foreground)' } as const;

export function Step3() {
  return (<g>
    <motion.text x={10} y={18} {...mono} {...fade(0.1)}>
      Line 1: gwMux := gwruntime.NewServeMux(opts...)
    </motion.text>
    <motion.text x={10} y={34} {...mono} {...fade(0.2)}>
      Line 2: ethpb.RegisterBeaconChainHandlerFromEndpoint(ctx, gwMux, endpoint)
    </motion.text>
    <motion.text x={10} y={50} {...mono} {...fade(0.3)}>
      Line 3: httpServer.Handler = gwMux
    </motion.text>
    <motion.text x={10} y={66} {...comment} {...fade(0.4)}>
      Line 4: // REST → gRPC-gateway 자동 변환, HTTP 핸들러 등록
    </motion.text>
    <motion.g {...fade(0.5)}>
      <DataBox x={310} y={72} w={100} h={24} label="HTTP→gRPC" color={C.gateway} />
    </motion.g>
  </g>);
}

export function Step4() {
  return (<g>
    <motion.text x={10} y={18} {...mono} {...fade(0.1)}>
      Line 1: GET /eth/v2/beacon/blocks/{'{'}block_id{'}'}
    </motion.text>
    <motion.text x={10} y={34} {...mono} {...fade(0.2)}>
      Line 2: GET /eth/v1/beacon/states/{'{'}state_id{'}'}/validators
    </motion.text>
    <motion.text x={10} y={50} {...mono} {...fade(0.3)}>
      Line 3: GET /eth/v1/node/syncing
    </motion.text>
    <motion.text x={10} y={66} {...comment} {...fade(0.4)}>
      Line 4: // Beacon API 표준 스펙 — Eth2 공통 REST 엔드포인트
    </motion.text>
    <motion.g {...fade(0.5)}>
      <DataBox x={310} y={72} w={100} h={24} label="표준 호환" color={C.spec} />
    </motion.g>
  </g>);
}

export function Step5() {
  return (<g>
    <motion.text x={10} y={18} {...mono} {...fade(0.1)}>
      Line 1: duties, err := s.GetAttesterDuties(ctx, epoch)
    </motion.text>
    <motion.text x={10} y={34} {...mono} {...fade(0.2)}>
      Line 2: s.SubmitAttestation(ctx, att)
    </motion.text>
    <motion.text x={10} y={50} {...mono} {...fade(0.3)}>
      Line 3: block, err := s.GetBlockV2(ctx, reqBlockId)
    </motion.text>
    <motion.text x={10} y={66} {...comment} {...fade(0.4)}>
      Line 4: // 의무 조회, 투표 제출, 블록 제안 — 매 슬롯 호출
    </motion.text>
    <motion.g {...fade(0.5)}>
      <DataBox x={310} y={72} w={100} h={24} label="ValidatorAPI" color={C.validator} />
    </motion.g>
  </g>);
}
