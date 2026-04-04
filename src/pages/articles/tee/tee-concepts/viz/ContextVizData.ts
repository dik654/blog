export const C = { cpu: '#6366f1', err: '#ef4444', ok: '#10b981', key: '#f59e0b', mem: '#8b5cf6' };

export const STEPS = [
  {
    label: 'DRAM 물리 접근: 호스트가 /dev/mem으로 읽기 가능',
    body: 'mmap(/dev/mem, phys_addr) → 커널이 페이지 테이블로 물리 메모리 직접 매핑, 게스트 데이터 노출',
  },
  {
    label: 'OS/하이퍼바이저 공격: EPT 조작으로 메모리 리매핑',
    body: 'EPT(Extended Page Table) 엔트리 변경 → 게스트 GPA를 다른 HPA로 매핑, 데이터 가로채기',
  },
  {
    label: 'TEE 격리: CPU가 메모리 접근 시 ASID/KeyID 검사',
    body: '메모리 컨트롤러가 페이지별 KeyID 확인 → 불일치 시 암호화된 쓰레기 데이터 반환',
  },
  {
    label: 'TCB 크기: SGX(Enclave) vs TDX(VM) 비교',
    body: 'SGX: SECS 단위 격리(수 MB TCB), TDX: TDCS 단위 격리(수 GB TCB) — 각각 장단점 존재',
  },
  {
    label: 'Sealing: EGETKEY로 CPU 고유 봉인 키 유도',
    body: 'EGETKEY(SEAL_KEY, key_policy) → CPU 퓨즈 키 + MRENCLAVE/MRSIGNER로 파생, 재부팅 후 동일 키',
  },
];
