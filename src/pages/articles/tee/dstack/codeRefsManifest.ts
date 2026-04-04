import type { CodeRef } from '@/components/code/types';

const MANIFEST_FLOW = `// vmm/src/main_service.rs — VM 생성 전체 흐름
async fn create_vm(request: VmConfiguration) -> Result<Id> {
    // 1. Docker Compose → App ID (SHA-256)
    let app_id = sha256_hex(&request.compose_file);
    let vm_id = Uuid::new_v4().to_string();

    // 2. vsock CID 풀에서 할당
    let cid = self.state.lock().cid_pool.acquire()?;

    // 3. Manifest 생성
    let manifest = Manifest {
        id: vm_id.clone(), app_id, cid,
        vcpu: request.vcpu, memory: request.memory,
        kms_urls: request.kms_urls.clone(),
        ..Default::default()
    };

    // 4. 작업 디렉토리 준비
    //    /var/lib/dstack/vms/{vm_id}/
    prepare_workdir(&vm_id, &manifest)?;

    // 5. TDX TD 시작
    let vm = TdVm::new(&manifest)?;
    vm.start()?;  // QEMU 프로세스 fork

    Ok(Id { id: vm_id })
}`;

export const manifestCodeRefs: Record<string, CodeRef> = {
  'manifest-flow': {
    path: 'dstack/vmm/src/main_service.rs',
    code: MANIFEST_FLOW,
    highlight: [2, 27],
    lang: 'rust',
    annotations: [
      { lines: [3, 5], color: 'sky', note: 'Docker Compose → App ID 결정 (SHA-256 해시)' },
      { lines: [8, 8], color: 'emerald', note: 'vsock CID 동적 할당' },
      { lines: [19, 20], color: 'amber', note: '작업 디렉토리 준비 (qcow2, shared 볼륨)' },
      { lines: [23, 25], color: 'violet', note: 'QEMU 프로세스 fork로 TD 시작' },
    ],
    desc:
`VM 생성의 전체 흐름입니다. Docker Compose 파일의 SHA-256 해시가 App ID가 됩니다.

같은 Compose 파일로 생성된 VM은 항상 같은 App ID를 가지므로,
KMS에서 동일한 키를 받을 수 있습니다 (결정론적 키 유도).`,
  },
};
