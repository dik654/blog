import type { CodeRef } from '@/components/code/types';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function KeyManagement({ onCodeRef }: Props) {
  return (
    <section id="key-management" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">키 관리 (Keymanager)</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('run-client', codeRefs['run-client'])} />
          <span className="text-[10px] text-muted-foreground self-center">RunClient() — 키매니저 초기화</span>
        </div>

        {/* ── Keymanager 구조 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Keymanager 인터페이스 — 3가지 구현체</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Keymanager: validator key 관리 추상화
type IKeymanager interface {
    FetchValidatingPublicKeys(ctx context.Context) ([][48]byte, error)
    Sign(ctx context.Context, req *SignRequest) (bls.Signature, error)
    SubscribeAccountChanges(chan [][48]byte) event.Subscription
}

// 3가지 주요 구현체:

// 1. Local Keymanager (keystore 파일)
//    - EIP-2335 keystore JSON
//    - AES-128-CTR encryption + Scrypt KDF
//    - 로컬 디스크에서 키 읽기
//    - 가장 일반적
type LocalKeymanager struct {
    wallet *Wallet
    accountsStore *AccountsStore
    keysCache sync.Map  // pubkey → secret_key
}

// 2. Web3Signer Keymanager (remote signing)
//    - 외부 서명 서비스에 delegate
//    - 키가 validator 프로세스 외부에 존재
//    - 엔터프라이즈/institutional 사용 사례
type Web3SignerKeymanager struct {
    url string  // https://web3signer.company.com
    httpClient *http.Client
}

// 3. Derived Keymanager (EIP-2334)
//    - HD wallet 스타일 (mnemonic에서 파생)
//    - 1개 mnemonic → N개 validator key
//    - 복구 용이성

// 초기화 (CLI 기반):
func (v *ValidatorService) initKeymanager() (IKeymanager, error) {
    if v.config.Web3SignerURL != "" {
        return NewWeb3SignerKeymanager(v.config.Web3SignerURL)
    }
    if v.config.DerivedMode {
        return NewDerivedKeymanager(v.config.Mnemonic)
    }
    return NewLocalKeymanager(v.config.WalletDir)
}`}
        </pre>
        <p className="leading-7">
          Keymanager가 <strong>3가지 키 저장 방식 추상화</strong>.<br />
          Local(파일), Web3Signer(remote), Derived(HD wallet) 지원.<br />
          trait 기반 → validator 코드는 구현체 몰라도 동작.
        </p>

        {/* ── EIP-2335 Keystore ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">EIP-2335 Keystore — 표준 JSON 포맷</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// EIP-2335 Keystore JSON 구조
{
    "crypto": {
        "kdf": {
            "function": "scrypt",
            "params": {
                "dklen": 32,
                "n": 262144,
                "r": 8,
                "p": 1,
                "salt": "..."
            }
        },
        "checksum": {
            "function": "sha256",
            "params": {},
            "message": "..."
        },
        "cipher": {
            "function": "aes-128-ctr",
            "params": {
                "iv": "..."
            },
            "message": "..."  // encrypted secret key
        }
    },
    "description": "",
    "pubkey": "...",
    "path": "m/12381/3600/0/0/0",  // EIP-2334 path
    "uuid": "...",
    "version": 4
}

// 복호화 흐름:
// 1. user password 입력
// 2. Scrypt(password, salt) → derived key (32 bytes)
// 3. 처음 16 bytes를 AES key로 사용
// 4. AES-128-CTR(cipher.message, iv) → secret_key
// 5. 검증: sha256(derived_key[16:] || cipher.message) == checksum

// Scrypt 파라미터 (n=262144):
// - 메모리 hardness: ~256 MB
// - CPU time: ~1-2초 on modern hardware
// - brute-force 방어 (GPU/ASIC 저항)

// Prysm의 처리:
// 1. 시작 시 password 프롬프트 (또는 --wallet-password-file)
// 2. keystores decrypt → memory에만 유지
// 3. 디스크에는 암호화된 JSON만`}
        </pre>
        <p className="leading-7">
          <strong>EIP-2335</strong>가 validator key 저장 표준.<br />
          Scrypt + AES-128-CTR로 password 기반 암호화.<br />
          클라이언트 간 이식 가능 (Prysm ↔ Lighthouse 등).
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 Keymanager 추상화</strong> — 로컬 파일, Web3Signer, 파생 키(EIP-2334) 등 다양한 방식 지원.<br />
          EIP-2335 키스토어: AES-128-CTR + Scrypt로 암호화된 JSON 파일.<br />
          --web3signer-url로 외부 서명 서비스 사용 시 키가 바이너리에 존재하지 않음.
        </p>
      </div>
    </section>
  );
}
