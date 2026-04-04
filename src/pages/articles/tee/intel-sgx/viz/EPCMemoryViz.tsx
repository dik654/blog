import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  { label: 'EPC 페이지 유형: TCS / REG / VA', body: 'TCS = 스레드 실행 컨텍스트. REG = 코드/데이터/힙/스택. VA = 페이지 아웃 시 버전 관리. 모든 페이지는 CPU 암호화.' },
  { label: '힙 초기화: g_global_data → heap_init', body: 'init_enclave.cpp에서 g_global_data의 레이아웃 정보를 읽어 힙 메모리 초기화. EDMM 지원 여부에 따라 동적/정적 할당 결정.' },
  { label: 'EDMM: 런타임 EPC 페이지 추가/제거', body: 'Linux SGX 2.0+에서 지원. 이전: 엔클레이브 생성 시 모든 페이지 정적 할당. EDMM: 필요 시 런타임에 EPC 페이지 추가/제거 가능.' },
];

const PAGES = [
  { label: 'TCS', desc: '스레드 컨텍스트', color: '#6366f1', w: 100 },
  { label: 'REG', desc: '코드/데이터/힙', color: '#10b981', w: 140 },
  { label: 'VA', desc: '버전 관리', color: '#f59e0b', w: 100 },
];

export default function EPCMemoryViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 540 155" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* EPC boundary */}
          <rect x={20} y={8} width={500} height={90} rx={8} fill="none"
            stroke="#6366f120" strokeWidth={1.5} strokeDasharray="5,3" />
          <text x={35} y={24} fontSize={10} fill="#6366f1" fontWeight={600}>
            EPC (Enclave Page Cache) — CPU 암호화 메모리
          </text>

          {/* Page type boxes */}
          {(() => {
            let cx = 50;
            return PAGES.map((p, i) => {
              const x = cx;
              cx += p.w + 20;
              const active = step === 0;
              return (
                <motion.g key={p.label}
                  animate={{ opacity: active ? 1 : 0.35 }}>
                  <rect x={x} y={36} width={p.w} height={48} rx={5}
                    fill={`${p.color}12`} stroke={p.color} strokeWidth={active ? 1.5 : 0.6} />
                  <text x={x + p.w / 2} y={56} textAnchor="middle" fontSize={10}
                    fontWeight={600} fill={p.color}>{p.label}</text>
                  <text x={x + p.w / 2} y={72} textAnchor="middle" fontSize={10}
                    fill="var(--muted-foreground)">{p.desc}</text>
                </motion.g>
              );
            });
          })()}

          {/* heap_init on step 1 */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
              <rect x={380} y={36} width={120} height={48} rx={5}
                fill="#10b98112" stroke="#10b981" strokeWidth={1.5} />
              <text x={440} y={56} textAnchor="middle" fontSize={10}
                fontWeight={600} fill="#10b981">heap_init()</text>
              <text x={440} y={72} textAnchor="middle" fontSize={10}
                fill="var(--muted-foreground)">레이아웃 → 힙</text>
              <text x={270} y={120} textAnchor="middle" fontSize={10}
                fill="var(--muted-foreground)">
                g_global_data에서 heap_base, heap_size 읽어 초기화
              </text>
            </motion.g>
          )}

          {/* EDMM on step 2 */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
              <rect x={380} y={36} width={120} height={48} rx={5}
                fill="#f59e0b12" stroke="#f59e0b" strokeWidth={1.5} />
              <text x={440} y={56} textAnchor="middle" fontSize={10}
                fontWeight={600} fill="#f59e0b">EDMM</text>
              <text x={440} y={72} textAnchor="middle" fontSize={10}
                fill="var(--muted-foreground)">동적 추가/제거</text>
              <text x={270} y={120} textAnchor="middle" fontSize={10}
                fill="var(--muted-foreground)">SGX 2.0+: 런타임에 EPC 페이지 추가/제거 가능</text>
              <text x={270} y={138} textAnchor="middle" fontSize={10}
                fill="var(--muted-foreground)">이전: 엔클레이브 생성 시 모든 페이지 정적 할당</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
