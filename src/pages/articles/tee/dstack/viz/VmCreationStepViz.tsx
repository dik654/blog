import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  { label: 'Manifest 파싱 — compose YAML → SHA-256(compose) = App ID 결정' },
  { label: 'create_vm — App ID → VM ID(UUID) → CID 할당 → TdVm::new()' },
  { label: '포트 매핑 — PortMapping { host: u16, vm: u16, proto: TCP|UDP } 검증' },
  { label: 'QEMU TDX 파라미터 — -object tdx-guest, -machine q35,confidential-guest-support' },
];
const mono = { fontFamily: 'monospace' };
const f = (d: number) => ({ initial: { opacity: 0, x: -10 }, animate: { opacity: 1, x: 0 }, transition: { delay: d } });

export default function VmCreationStepViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 520 180" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (<g>
            <text x={260} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="#6366f1">Manifest → App ID 결정</text>
            {[
              { line: 'let compose = fs::read("docker-compose.yaml")?;', c: '#6366f1', y: 42 },
              { line: 'let app_id = sha256(&compose);  // 32 bytes', c: '#6366f1', y: 64 },
              { line: 'let manifest = Manifest {', c: '#10b981', y: 90 },
              { line: '  id: Uuid::new_v4(), app_id, vcpu: 4,', c: '#10b981', y: 110 },
              { line: '  memory: 8192, kms_urls, gateway_urls,', c: '#10b981', y: 130 },
              { line: '};', c: '#10b981', y: 150 },
            ].map((l, i) => (
              <motion.g key={i} {...f(i * 0.08)}>
                <rect x={40} y={l.y - 13} width={440} height={20} rx={3} fill={`${l.c}10`} stroke={`${l.c}40`} strokeWidth={0.8} />
                <text x={55} y={l.y} fontSize={10} fill={l.c} fontWeight={600} {...mono}>{l.line}</text>
              </motion.g>
            ))}
          </g>)}
          {step === 1 && (<g>
            <text x={260} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="#6366f1">create_vm 실행 흐름</text>
            {[
              { line: 'let vm_id  = Uuid::new_v4();', c: '#6366f1', y: 42 },
              { line: 'let cid    = allocate_cid();  // vsock 통신용', c: '#6366f1', y: 64 },
              { line: 'let work   = format!("/var/lib/dstack/vms/{vm_id}");', c: '#10b981', y: 86 },
              { line: 'fs::create_dir_all(&work)?;', c: '#10b981', y: 108 },
              { line: 'let td = TdVm::new(manifest, cid, work)?;', c: '#f59e0b', y: 130 },
              { line: 'td.start()?;  // QEMU TDX 프로세스 시작', c: '#f59e0b', y: 152 },
            ].map((l, i) => (
              <motion.g key={i} {...f(i * 0.08)}>
                <rect x={40} y={l.y - 13} width={440} height={20} rx={3} fill={`${l.c}10`} stroke={`${l.c}40`} strokeWidth={0.8} />
                <text x={55} y={l.y} fontSize={10} fill={l.c} fontWeight={600} {...mono}>{l.line}</text>
              </motion.g>
            ))}
          </g>)}
          {step === 2 && (<g>
            <text x={260} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="#f59e0b">포트 매핑 검증</text>
            {[
              { line: 'for mapping in &manifest.port_map {', c: '#6366f1', y: 42 },
              { line: '  let host = mapping.host.parse::<u16>()?;', c: '#6366f1', y: 64 },
              { line: '  let vm   = mapping.vm.parse::<u16>()?;', c: '#6366f1', y: 86 },
              { line: '  if !ALLOWED_PORTS.contains(&host) {', c: '#ef4444', y: 108 },
              { line: '    bail!("port {} not allowed", host);', c: '#ef4444', y: 130 },
              { line: '  }', c: '#ef4444', y: 150 },
            ].map((l, i) => (
              <motion.g key={i} {...f(i * 0.08)}>
                <rect x={40} y={l.y - 13} width={440} height={20} rx={3} fill={`${l.c}10`} stroke={`${l.c}40`} strokeWidth={0.8} />
                <text x={55} y={l.y} fontSize={10} fill={l.c} fontWeight={600} {...mono}>{l.line}</text>
              </motion.g>
            ))}
          </g>)}
          {step === 3 && (<g>
            <text x={260} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="#10b981">QEMU TDX 실행 파라미터</text>
            {[
              { line: '-object tdx-guest,id=tdx0', c: '#6366f1', y: 42 },
              { line: '-machine q35,confidential-guest-support=tdx0', c: '#6366f1', y: 64 },
              { line: '-cpu host,pmu=off', c: '#10b981', y: 86 },
              { line: '-device vhost-vsock-pci,guest-cid={cid}', c: '#10b981', y: 108 },
              { line: '-drive file=rootfs.qcow2,if=virtio', c: '#f59e0b', y: 130 },
              { line: '-m {memory}M -smp {vcpu}', c: '#f59e0b', y: 152 },
            ].map((l, i) => (
              <motion.g key={i} {...f(i * 0.08)}>
                <rect x={40} y={l.y - 13} width={440} height={20} rx={3} fill={`${l.c}10`} stroke={`${l.c}40`} strokeWidth={0.8} />
                <text x={55} y={l.y} fontSize={10} fill={l.c} fontWeight={600} {...mono}>{l.line}</text>
              </motion.g>
            ))}
          </g>)}
        </svg>
      )}
    </StepViz>
  );
}
