import { motion } from 'framer-motion';

const VMPL_LEVELS = [
  { level: 0, role: 'Firmware / vTOM', color: '#ef4444', desc: 'SVSM(Secure VM Service Module). 최고 권한. 다른 VMPL에 권한을 위임합니다.' },
  { level: 1, role: 'Paravisor (opt)', color: '#f59e0b', desc: '선택적 계층. 하이퍼바이저 기능을 안전하게 에뮬레이션합니다.' },
  { level: 2, role: 'Guest Kernel', color: '#3b82f6', desc: '게스트 OS 커널. VMGEXIT로 하이퍼바이저와 통신합니다.' },
  { level: 3, role: 'User-space', color: '#10b981', desc: '최저 권한. 일반 애플리케이션 실행 환경.' },
];

export default function VMPLPanel() {
  return (
    <>
      <p className="text-xs text-foreground/50 mb-4">게스트 VM 내부 권한 계층. 상위 VMPL만 하위에 권한을 위임할 수 있습니다.</p>
      <div className="flex flex-col gap-0">
        {VMPL_LEVELS.map((v, i) => (
          <div key={v.level}>
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className="rounded-xl border p-4"
              style={{
                borderColor: v.color + '40',
                background: v.color + '08',
                marginLeft: `${i * 20}px`,
                marginRight: `${i * 20}px`,
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                  style={{ background: v.color + '20', color: v.color, border: `1.5px solid ${v.color}40` }}
                >
                  {v.level}
                </div>
                <div>
                  <p className="text-sm font-semibold" style={{ color: v.color }}>VMPL {v.level}</p>
                  <p className="text-xs text-foreground/60">{v.role}</p>
                </div>
              </div>
              <p className="text-xs text-foreground/50 mt-2 ml-11 leading-relaxed">{v.desc}</p>
            </motion.div>
            {i < VMPL_LEVELS.length - 1 && (
              <div className="py-1 flex items-center" style={{ marginLeft: `${(i + 0.5) * 20 + 20}px` }}>
                <span className="text-xs text-foreground/25">↓ RMP vmpl_perms로 권한 위임</span>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="mt-5 p-3 rounded-lg border border-border text-xs text-foreground/60 leading-relaxed">
        <strong className="text-foreground/80">하이퍼바이저 격리:</strong> 하이퍼바이저는 RMP의 vmpl_perms를 직접 변경할 수 없습니다.
        RMP 검사(RMPCHECK)가 GPA 불일치를 탐지하면 #PF가 게스트로 전달되어
        Confused Deputy Attack을 원천 차단합니다.
      </div>
    </>
  );
}
