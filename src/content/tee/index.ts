import type { Category } from '../types';
import { teeBaseArticles } from '../gpu/teeArticles';
import { teeArticles2 } from '../gpu/teeArticles2';
import { teeNewArticles } from './articlesTeeNew';

const tee: Category = {
  slug: 'tee',
  name: 'TEE',
  description: '신뢰 실행 환경 — Intel SGX/TDX, ARM TrustZone/CCA, AMD SEV, 기밀 컴퓨팅',
  subcategories: [
    {
      slug: 'tee-fundamentals', name: 'Fundamentals', description: 'TCB, 메모리 격리, 원격 증명, 사이드채널', icon: '🔒',
    },
    {
      slug: 'tee-intel', name: 'Intel', description: 'SGX Enclave, TDX 기밀 VM', icon: '🔵',
      children: [
        { slug: 'intel-sgx', name: 'Intel SGX', description: 'Enclave, 원격 증명, 메모리 보호', icon: '🛡️' },
        { slug: 'intel-tdx', name: 'Intel TDX', description: 'Trust Domain, VM 격리, DCAP', icon: '🏛️' },
      ],
    },
    {
      slug: 'tee-arm', name: 'ARM', description: 'TrustZone, CCA Realm', icon: '📱',
      children: [
        { slug: 'arm-trustzone', name: 'ARM TrustZone', description: '보안/비보안 월드 분리', icon: '📱' },
        { slug: 'arm-cca', name: 'ARM CCA', description: 'Realm 관리, 기밀 VM', icon: '🏰' },
      ],
    },
    { slug: 'amd-sev', name: 'AMD SEV', description: 'VM 수준 메모리 암호화와 격리', icon: '🔑' },
    { slug: 'tee-infra', name: 'Infrastructure', description: 'TEE 오케스트레이션, 배포 인프라', icon: '🏗️' },
    { slug: 'tee-net', name: 'TEE Networks', description: 'TEE 기반 탈중앙화 네트워크', icon: '🌐' },
  ],
  articles: [
    ...teeBaseArticles,
    ...teeArticles2,
    ...teeNewArticles,
  ],
};

export default tee;
