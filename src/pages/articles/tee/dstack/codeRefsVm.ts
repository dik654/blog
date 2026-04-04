import type { CodeRef } from '@/components/code/types';

const TD_CREATE = `// vmm/src/td_vm.rs
pub struct TdVm {
    id: String,
    manifest: Manifest,
    process: Option<Child>,   // QEMU 프로세스
    cid: u32,                 // vsock CID
}

impl TdVm {
    pub fn new(manifest: &Manifest) -> Result<Self> {
        // 1. OS 이미지 → overlay qcow2 생성
        let rootfs = create_overlay(&manifest.image)?;

        // 2. QEMU 커맨드 구성
        let mut cmd = Command::new("qemu-system-x86_64");
        cmd.args(&[
            "-object", "tdx-guest,id=tdx0,sept-ve-disable=off",
            "-machine", "q35,confidential-guest-support=tdx0",
            "-cpu", "host,-kvm-steal-time,pmu=off",
        ]);

        // 3. 리소스 설정
        cmd.args(&["-m", &format!("{}M", manifest.memory)]);
        cmd.args(&["-smp", &manifest.vcpu.to_string()]);

        // 4. vsock 디바이스 (host ↔ guest 통신)
        cmd.args(&["-device", &format!(
            "vhost-vsock-pci,guest-cid={}", manifest.cid
        )]);

        Ok(Self { id: manifest.id.clone(), manifest: manifest.clone(),
                  process: None, cid: manifest.cid })
    }
}`;

export const vmCodeRefs: Record<string, CodeRef> = {
  'td-create': {
    path: 'dstack/vmm/src/td_vm.rs',
    code: TD_CREATE,
    highlight: [2, 34],
    lang: 'rust',
    annotations: [
      { lines: [2, 8], color: 'sky', note: 'TdVm 구조체 — QEMU 프로세스 + vsock CID' },
      { lines: [13, 14], color: 'emerald', note: 'overlay qcow2 생성 — 원본 이미지 보존' },
      { lines: [18, 22], color: 'amber', note: 'TDX 전용 QEMU 파라미터 — SEAM 모듈 활성화' },
      { lines: [28, 31], color: 'violet', note: 'vsock — 하이퍼바이저 우회 host↔guest 통신' },
    ],
    desc:
`TdVm은 하나의 TDX Trust Domain을 캡슐화하는 구조체입니다.

일반 KVM VM과 달리 tdx-guest 오브젝트와 confidential-guest-support 옵션이 필요합니다.
vsock을 통해 호스트(VMM)와 게스트(Guest Agent)가 네트워크 없이 통신합니다.
CID는 VM별 고유 식별자로, 풀에서 동적으로 할당됩니다.`,
  },
};
