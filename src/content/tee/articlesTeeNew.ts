import type { Article } from '../types';

export const teeNewArticles: Article[] = [
  /* ── Fundamentals: 개념별 심층 아티클 ── */
  {
    slug: 'tee-tcb',
    title: 'TCB & 측정 부팅: 신뢰 경계의 설계',
    subcategory: 'tee-fundamentals',
    sections: [
      { id: 'overview', title: 'TCB란 무엇인가' },
      { id: 'tcb-compare', title: 'TCB 크기 비교: SGX vs TDX vs SEV' },
      { id: 'measured-boot', title: '측정 부팅 & 신뢰 체인' },
      { id: 'tpm-pcr', title: 'TPM & PCR 레지스터' },
      { id: 'code-measurement', title: '코드: EINIT · LAUNCH_MEASURE' },
    ],
    component: () => import('@/pages/articles/tee/tee-tcb'),
  },
  {
    slug: 'tee-memory',
    title: '메모리 격리 & 암호화: CPU 내부 메커니즘',
    subcategory: 'tee-fundamentals',
    sections: [
      { id: 'overview', title: '왜 메모리 암호화가 필요한가' },
      { id: 'sgx-epc', title: 'SGX EPC: Enclave Page Cache' },
      { id: 'sev-sme', title: 'SEV SME: 페이지별 AES 암호화' },
      { id: 'tdx-mktme', title: 'TDX MKTME: VM별 키 관리' },
      { id: 'code-memory', title: '코드: EADD · LAUNCH_UPDATE' },
    ],
    component: () => import('@/pages/articles/tee/tee-memory'),
  },
  {
    slug: 'tee-sealing',
    title: '데이터 봉인: Seal Key에서 AES-GCM까지',
    subcategory: 'tee-fundamentals',
    sections: [
      { id: 'overview', title: '봉인이 필요한 이유' },
      { id: 'key-derivation', title: 'Seal Key 파생 (EGETKEY)' },
      { id: 'policy', title: 'MRENCLAVE vs MRSIGNER 정책' },
      { id: 'aes-gcm', title: 'AES-GCM 봉인/개봉 흐름' },
      { id: 'code-sealing', title: '코드: sgx_seal_data 구현' },
    ],
    component: () => import('@/pages/articles/tee/tee-sealing'),
  },

  /* ── Fundamentals: 기존 유지 ── */
  {
    slug: 'tee-attestation', title: 'TEE 원격 증명: 로컬 → 원격 → DCAP', subcategory: 'tee-fundamentals',
    sections: [{ id: 'overview', title: '원격 증명 전체 흐름' }, { id: 'local', title: '로컬 증명 (EREPORT)' }, { id: 'remote', title: '원격 증명 (EPID/DCAP)' }, { id: 'ias-dcap', title: 'IAS vs DCAP 비교' }],
    component: () => import('@/pages/articles/tee/tee-attestation'),
  },
  {
    slug: 'tee-sidechannel', title: 'TEE 사이드채널: Spectre, Meltdown, Cache Timing', subcategory: 'tee-fundamentals',
    sections: [{ id: 'overview', title: '사이드채널 공격이란' }, { id: 'spectre', title: 'Spectre & Meltdown' }, { id: 'cache', title: 'Cache Timing 공격 (Prime+Probe)' }, { id: 'defense', title: '방어 기법 (Oblivious RAM, Constant Time)' }],
    component: () => import('@/pages/articles/tee/tee-sidechannel'),
  },

  /* ── Intel TDX ── */
  {
    slug: 'intel-tdx', title: 'Intel TDX: Trust Domain 기밀 VM', subcategory: 'intel-tdx',
    sections: [{ id: 'overview', title: 'TDX 아키텍처' }, { id: 'td-module', title: 'TD Module & SEAM' }, { id: 'memory', title: '메모리 암호화 (MKTME)' }, { id: 'attestation', title: 'TDX 원격 증명 & Quote' }],
    component: () => import('@/pages/articles/tee/intel-tdx'),
  },

  /* ── ARM CCA ── */
  {
    slug: 'arm-cca', title: 'ARM CCA: Realm 관리 & 기밀 VM', subcategory: 'arm-cca',
    sections: [{ id: 'overview', title: 'CCA 아키텍처' }, { id: 'realm', title: 'Realm 생성 & 관리' }, { id: 'rme', title: 'Realm Management Extension' }, { id: 'attestation', title: 'CCA 증명 토큰' }],
    component: () => import('@/pages/articles/tee/arm-cca'),
  },
];
