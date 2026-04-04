import type { Article } from '../types';
import { teeArticles2 } from './teeArticles2';

export const teeBaseArticles: Article[] = [
  {
    slug: 'hw-security',
    title: '하드웨어 보안 기초: TCB, 메모리 암호화, 원격 증명',
    subcategory: 'tee-fundamentals',
    sections: [
      { id: 'overview', title: 'TCB & 위협 모델' },
      { id: 'memory-encryption', title: '메모리 암호화' },
      { id: 'remote-attestation', title: '원격 증명' },
      { id: 'secure-boot', title: '측정 부팅 & 신뢰 체인' },
    ],
    component: () => import('@/pages/articles/tee/hw-security'),
  },
  {
    slug: 'intel-sgx',
    title: 'Intel SGX: linux-sgx SDK 구현 분석',
    subcategory: 'intel-sgx',
    sections: [
      { id: 'overview', title: '개요 & 아키텍처' },
      { id: 'ecall-ocall', title: 'ECALL / OCALL 경계' },
      { id: 'sealing', title: '데이터 봉인 (EGETKEY + AES-GCM)' },
      { id: 'attestation', title: '원격 증명 (EREPORT → Quote)' },
    ],
    component: () => import('@/pages/articles/tee/intel-sgx'),
  },
  {
    slug: 'op-tee',
    title: 'ARM OP-TEE: TrustZone TEE OS 구현 분석',
    subcategory: 'arm-trustzone',
    sections: [
      { id: 'overview', title: '개요 & TrustZone 두 세계' },
      { id: 'world-switch', title: 'SMC & 세계 전환 (sm.c)' },
      { id: 'ta-session', title: 'TA 세션 관리 (tee_ta_manager.c)' },
      { id: 'keys', title: 'HUK & 키 파생 (huk_subkey.c)' },
      { id: 'memory-management', title: '메모리 관리 & 페이지 테이블 격리' },
      { id: 'crypto-operations', title: '암호화 연산 & 보안 키 저장' },
    ],
    component: () => import('@/pages/articles/tee/op-tee'),
  },
  {
    slug: 'amd-sev',
    title: 'AMD SEV: 기밀 VM 보호 메커니즘',
    subcategory: 'amd-sev',
    sections: [
      { id: 'overview', title: '개요 & 위협 모델' },
      { id: 'evolution', title: 'SEV → SEV-ES → SEV-SNP 진화' },
      { id: 'sev-basics', title: 'SEV 기본 메커니즘 (AES-128)' },
      { id: 'sme-architecture', title: 'SME 아키텍처' },
      { id: 'asp', title: 'AMD Secure Processor' },
      { id: 'guest-management', title: '게스트 VM 관리 (ASID, 키)' },
      { id: 'migration', title: 'SEV 라이브 마이그레이션' },
      { id: 'kernel-support', title: '리눅스 커널 SEV 지원' },
      { id: 'snp', title: 'SEV-SNP 내부 구조' },
      { id: 'attestation', title: '원격 증명 (Remote Attestation)' },
    ],
    component: () => import('@/pages/articles/tee/amd-sev'),
  },
];

/** Combined TEE articles */
export const teeArticles: Article[] = [...teeBaseArticles, ...teeArticles2];
