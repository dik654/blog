import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { DataBox, ModuleBox } from '@/components/viz/boxes';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C_META = '#6366f1';
const C_AES = '#10b981';
const C_PAY = '#f59e0b';

const FIELDS = [
  { name: 'key_request', size: 512, color: C_META },
  { name: 'plain_text_offset', size: 4, color: C_META },
  { name: 'reserved', size: 12, color: C_META },
  { name: 'payload_size', size: 4, color: C_AES },
  { name: 'reserved', size: 12, color: C_AES },
  { name: 'payload_tag (MAC)', size: 16, color: C_AES },
  { name: 'payload[plaintext]', size: 32, color: C_PAY },
  { name: 'payload[aad]', size: 0, color: C_PAY },
];

const STEPS = [
  {
    label: 'sgx_sealed_data_t — 4개 필드 + flexible payload',
    body: 'key_request (512B) + plain_text_offset (4B) + reserved (12B) + aes_data.\nflexible array로 가변 크기 데이터 저장.',
  },
  {
    label: 'aes_gcm_data_t — payload + tag',
    body: 'payload_size (4B) + reserved (12B) + payload_tag (16B MAC) + payload[].\nMAC이 payload와 분리 저장.',
  },
  {
    label: '예: 32B 마스터 키 sealing → 592 bytes',
    body: '512 + 4 + 12 + 4 + 12 + 16 + 32 = 592 bytes on disk.\nMetadata 오버헤드가 작은 페이로드에선 큼.',
  },
];

export default function SealedDataStructViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 240" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <ModuleBox x={130} y={14} w={220} h={32} label="sgx_sealed_data_t" color={C_META} />
              {FIELDS.slice(0, 4).map((f, i) => (
                <motion.g key={i} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}>
                  <DataBox x={40} y={56 + i * 36} w={250} h={28} label={f.name} color={f.color} outlined />
                  <text x={310} y={74 + i * 36} fontSize={9} fontWeight={600} fill={f.color}>{f.size}B</text>
                </motion.g>
              ))}
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <ModuleBox x={130} y={14} w={220} h={32} label="sgx_aes_gcm_data_t" color={C_AES} />
              {FIELDS.slice(3).map((f, i) => (
                <motion.g key={i} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}>
                  <DataBox x={40} y={56 + i * 32} w={250} h={26} label={f.name} color={f.color} outlined />
                  <text x={310} y={73 + i * 32} fontSize={9} fontWeight={600} fill={f.color}>
                    {f.size === 0 ? 'flex' : `${f.size}B`}
                  </text>
                </motion.g>
              ))}
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={20} textAnchor="middle" fontSize={10} fontWeight={700} fill={C_PAY}>
                예: 32B 마스터 키 sealing
              </text>
              <DataBox x={40} y={40} w={150} h={26} label="key_request" color={C_META} outlined />
              <text x={210} y={56} fontSize={9} fontWeight={600} fill={C_META}>512</text>
              <DataBox x={40} y={70} w={150} h={26} label="plain_text_offset" color={C_META} outlined />
              <text x={210} y={86} fontSize={9} fontWeight={600} fill={C_META}>4</text>
              <DataBox x={40} y={100} w={150} h={26} label="reserved x2" color={C_META} outlined />
              <text x={210} y={116} fontSize={9} fontWeight={600} fill={C_META}>24</text>
              <DataBox x={40} y={130} w={150} h={26} label="payload_size" color={C_AES} outlined />
              <text x={210} y={146} fontSize={9} fontWeight={600} fill={C_AES}>4</text>
              <DataBox x={40} y={160} w={150} h={26} label="MAC" color={C_AES} outlined />
              <text x={210} y={176} fontSize={9} fontWeight={600} fill={C_AES}>16</text>
              <DataBox x={40} y={190} w={150} h={26} label="payload (master key)" color={C_PAY} outlined />
              <text x={210} y={206} fontSize={9} fontWeight={600} fill={C_PAY}>32</text>
              <text x={350} y={120} textAnchor="middle" fontSize={14} fontWeight={700} fill={C_PAY}>= 592 B</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
