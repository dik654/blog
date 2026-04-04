export const manifestCode = `// vmm/src/app.rs
#[derive(Deserialize, Serialize, Clone, Debug)]
pub struct Manifest {
    pub id: String,           // VM 고유 ID (UUID)
    pub name: String,         // 사용자 지정 이름
    pub app_id: String,       // 애플리케이션 ID (compose 파일 해시)
    pub vcpu: u32,            // 가상 CPU 수
    pub memory: u32,          // 메모리 (MB)
    pub disk_size: u32,       // 디스크 (GB)
    pub image: String,        // OS 이미지 이름
    pub port_map: Vec<PortMapping>,
    pub kms_urls: Vec<String>,     // KMS 서버 목록
    pub gateway_urls: Vec<String>, // Gateway 서버 목록
    pub hugepages: bool,
    pub pin_numa: bool,
    pub gpus: Option<GpuConfig>,
}`;

export const manifestAnnotations = [
  { lines: [4, 6] as [number, number], color: 'sky' as const, note: 'VM 식별 정보' },
  { lines: [7, 10] as [number, number], color: 'emerald' as const, note: '리소스 설정' },
  { lines: [12, 13] as [number, number], color: 'amber' as const, note: '인프라 연결 정보' },
];

export const createVmCode = `// vmm/src/main_service.rs
async fn create_vm(request: VmConfiguration) -> Result<Id> {
    // 1. 입력 검증
    validate_label(&request.name)?;

    // 2. App ID 결정 (명시적 지정 or compose 파일 해시)
    let app_id = match &request.app_id {
        Some(id) => id.strip_prefix("0x").unwrap_or(id).to_lowercase(),
        None => app_id_of(&request.compose_file), // SHA-256(compose 내용)
    };

    // 3. 고유 VM ID 생성 (UUID v4)
    let vm_id = Uuid::new_v4().to_string();

    // 4. CID 할당 (vsock 통신용)
    let cid = self.app.state.lock().cid_pool.acquire()?;

    // 5. 작업 디렉토리 준비
    //    /var/lib/dstack/vms/{vm_id}/
    //    +-- manifest.json
    //    +-- shared/         (host <-> guest 공유 볼륨)
    //    +-- rootfs/         (overlay 마운트)
    prepare_workdir(&vm_id, &manifest)?;

    // 6. TDX TD 시작
    let vm = TdVm::new(&manifest)?;
    vm.start()?;

    Ok(Id { id: vm_id })
}`;

export const createVmAnnotations = [
  { lines: [6, 10] as [number, number], color: 'sky' as const, note: 'App ID 결정 (SHA-256)' },
  { lines: [15, 16] as [number, number], color: 'emerald' as const, note: 'CID 할당 (vsock)' },
  { lines: [24, 27] as [number, number], color: 'amber' as const, note: 'TDX TD 시작' },
];

export const portMapCode = `// 포트 매핑: host:port -> guest:port (TCP/UDP)
// 관리자가 허용한 포트만 사용 가능
let port_map = request.ports.iter().map(|p| {
    let from = p.host_port.try_into()?;  // u16
    let to = p.vm_port.try_into()?;
    if !pm_cfg.is_allowed(&p.protocol, from) {
        bail!("Port mapping is not allowed for {}:{}", p.protocol, from);
    }
    Ok(PortMapping { address, protocol, from, to })
}).collect::<Result<Vec<_>>>()?;`;

export const portMapAnnotations = [
  { lines: [3, 5] as [number, number], color: 'sky' as const, note: '포트 변환' },
  { lines: [6, 8] as [number, number], color: 'amber' as const, note: '허용 포트 검사' },
];

export const tdxQemuCode = `# QEMU TDX 실행 예시
qemu-system-x86_64 \\
  -object tdx-guest,id=tdx0,sept-ve-disable=off \\
  -machine q35,confidential-guest-support=tdx0 \\
  -cpu host,-kvm-steal-time,pmu=off \\
  -m {memory}M \\
  -smp {vcpu} \\
  -device vhost-vsock-pci,id=vhost-vsock0,guest-cid={cid} \\
  -drive file={rootfs},if=virtio,format=qcow2`;

export const tdxQemuAnnotations = [
  { lines: [3, 4] as [number, number], color: 'sky' as const, note: 'TDX 기밀 게스트 설정' },
  { lines: [8, 8] as [number, number], color: 'emerald' as const, note: 'vsock 통신 채널' },
];
