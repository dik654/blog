import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox } from '@/components/viz/boxes';

const C = {
  cpu: '#6366f1',
  tzasc: '#10b981',
  tzpc: '#0ea5e9',
  otp: '#f59e0b',
  plat: '#8b5cf6',
};
const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.45 };

const STEPS = [
  { label: 'CPU — ARM Cortex-A v7A/v8A + TrustZone (Cortex-M55도 지원)' },
  { label: 'TZASC — 메모리 영역을 Secure/Non-secure로 지정' },
  { label: 'TZPC + OTP — 페리페럴 권한 + HUK(Hardware Unique Key)' },
  { label: '지원 플랫폼 — i.MX · RK · Snapdragon · RPi · HiKey · QEMU' },
];

const CPUS = ['A7', 'A9', 'A15', 'A53', 'A72', 'A76', 'M55'];
const PLATFORMS = [
  { n: 'NXP i.MX 6/7/8', s: '대표 임베디드' },
  { n: 'Rockchip RK3399', s: 'SBC·미니PC' },
  { n: 'Qualcomm Snapdragon', s: '모바일 일부' },
  { n: 'Raspberry Pi 3/4', s: '개발 boards' },
  { n: 'HiKey 960/970', s: '레퍼런스 board' },
  { n: 'QEMU v8 virtual', s: '테스트용' },
];

export default function HwRequirementsViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <text x={240} y={14} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
            OP-TEE 실행 필수 하드웨어
          </text>
          {step === 0 && (
            <g>
              <ModuleBox x={150} y={32} w={180} h={36} label="ARM Cortex-A / Cortex-M55" sub="TrustZone Security Extensions" color={C.cpu} />
              <text x={240} y={92} textAnchor="middle" fontSize={9.5} fontWeight={700} fill={C.cpu}>지원 코어 (TrustZone v7A/v8A)</text>
              {CPUS.map((c, i) => (
                <motion.g key={c} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.06 }}>
                  <rect x={40 + i * 60} y={106} width={50} height={28} rx={5}
                    fill={`${C.cpu}12`} stroke={`${C.cpu}55`} strokeWidth={0.8} />
                  <text x={65 + i * 60} y={124} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.cpu}>{c}</text>
                </motion.g>
              ))}
              <text x={240} y={158} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                거의 모든 현대 ARM Cortex-A는 TrustZone 내장
              </text>
            </g>
          )}
          {step === 1 && (
            <g>
              <text x={240} y={32} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.tzasc}>
                TZASC (TrustZone Address Space Controller)
              </text>
              <rect x={30} y={48} width={420} height={42} rx={6} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
              <motion.rect initial={{ width: 0 }} animate={{ width: 280 }} transition={{ duration: 0.6 }}
                x={30} y={48} height={42} rx={6} fill={`${C.cpu}18`} />
              <motion.rect initial={{ width: 0 }} animate={{ width: 80 }} transition={{ duration: 0.5, delay: 0.5 }}
                x={310} y={48} height={42} rx={6} fill={`${C.tzasc}30`} />
              <motion.rect initial={{ width: 0 }} animate={{ width: 60 }} transition={{ duration: 0.5, delay: 0.4 }}
                x={250} y={48} height={42} rx={6} fill={`${C.otp}25`} />
              <text x={150} y={74} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.cpu}>Normal DDR</text>
              <text x={280} y={74} textAnchor="middle" fontSize={8.5} fontWeight={700} fill={C.otp}>Shared</text>
              <text x={350} y={74} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.tzasc}>Secure DDR</text>
              <DataBox x={50} y={110} w={180} h={32} label="BIOS/Bootloader 초기화" sub="boot 시 region 정의" color={C.tzasc} />
              <DataBox x={250} y={110} w={180} h={32} label="런타임 immutable" sub="고정된 secure 영역" color={C.tzasc} />
              <text x={240} y={166} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                Normal world가 secure 영역 접근 시 bus fault 발생
              </text>
            </g>
          )}
          {step === 2 && (
            <g>
              <ModuleBox x={50} y={32} w={180} h={42} label="TZPC" sub="UART · I2C · SPI 권한" color={C.tzpc} />
              <ModuleBox x={250} y={32} w={180} h={42} label="OTP / eFuse" sub="HUK 256-bit (write-once)" color={C.otp} />
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                <rect x={50} y={90} width={180} height={68} rx={6} fill={`${C.tzpc}10`} stroke={`${C.tzpc}55`} strokeWidth={0.8} />
                <text x={140} y={108} textAnchor="middle" fontSize={9.5} fontWeight={700} fill={C.tzpc}>주변장치 접근 제어</text>
                <text x={60} y={126} fontSize={8.5} fill="var(--muted-foreground)">• Secure UART → TEE만 사용</text>
                <text x={60} y={140} fontSize={8.5} fill="var(--muted-foreground)">• Secure I2C → 보안 chip 통신</text>
                <text x={60} y={154} fontSize={8.5} fill="var(--muted-foreground)">• 일반 I/O는 Normal world 공유</text>
              </motion.g>
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                <rect x={250} y={90} width={180} height={68} rx={6} fill={`${C.otp}10`} stroke={`${C.otp}55`} strokeWidth={0.8} />
                <text x={340} y={108} textAnchor="middle" fontSize={9.5} fontWeight={700} fill={C.otp}>HUK 역할</text>
                <text x={260} y={126} fontSize={8.5} fill="var(--muted-foreground)">• 칩마다 고유 (제조시 burn)</text>
                <text x={260} y={140} fontSize={8.5} fill="var(--muted-foreground)">• Secure storage seal key 파생</text>
                <text x={260} y={154} fontSize={8.5} fill="var(--muted-foreground)">• Intel SGX Root Key와 유사</text>
              </motion.g>
            </g>
          )}
          {step === 3 && (
            <g>
              <text x={240} y={32} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.plat}>
                지원 플랫폼 (실제 OP-TEE 포팅 대상)
              </text>
              {PLATFORMS.map((p, i) => {
                const col = i % 2;
                const row = Math.floor(i / 2);
                return (
                  <motion.g key={p.n} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}>
                    <rect x={30 + col * 220} y={48 + row * 38} width={210} height={32} rx={5}
                      fill={`${C.plat}10`} stroke={`${C.plat}50`} strokeWidth={0.7} />
                    <text x={40 + col * 220} y={62 + row * 38} fontSize={9.5} fontWeight={700} fill={C.plat}>{p.n}</text>
                    <text x={40 + col * 220} y={74 + row * 38} fontSize={8} fill="var(--muted-foreground)">{p.s}</text>
                  </motion.g>
                );
              })}
            </g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
