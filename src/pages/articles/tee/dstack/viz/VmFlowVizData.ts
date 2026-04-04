export const STEPS = [
  {
    label: 'Docker Compose',
    color: '#6366f1',
    icon: '📄',
    desc: '사용자가 Docker Compose 파일 제출',
    detail: 'app_id = SHA-256(compose 내용)\n포트 매핑·리소스 설정 포함',
  },
  {
    label: 'Manifest 생성',
    color: '#8b5cf6',
    icon: '📋',
    desc: 'VMM이 VmConfiguration → Manifest 변환',
    detail: 'vm_id = UUID v4\ncid = vsock CID 할당\nkms_urls, gateway_urls 포함',
  },
  {
    label: '작업 디렉토리',
    color: '#3b82f6',
    icon: '📁',
    desc: '/var/lib/dstack/vms/{vm_id}/ 준비',
    detail: 'manifest.json 저장\nshared/ 볼륨 생성\nrootfs/ overlay 마운트',
  },
  {
    label: 'TDX TD 시작',
    color: '#10b981',
    icon: '🔒',
    desc: 'QEMU로 TDX Trust Domain 생성',
    detail: '-object tdx-guest,id=tdx0\n-machine q35,confidential-guest-support=tdx0\nvhost-vsock-pci (CID 통신)',
  },
  {
    label: '키 발급',
    color: '#f59e0b',
    icon: '🔑',
    desc: 'Guest Agent → KMS 키 요청',
    detail: 'TDX Quote 생성 및 KMS 검증\ndisk_crypt_key, env_crypt_key\nk256_key (앱 서명 키)',
  },
];
