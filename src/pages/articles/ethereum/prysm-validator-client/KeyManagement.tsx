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
        <div className="not-prose space-y-3 my-4">
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-foreground/70 mb-2">IKeymanager 인터페이스</p>
            <div className="grid grid-cols-1 gap-y-1 text-sm text-foreground/80">
              <span><code>FetchValidatingPublicKeys(ctx) ([][48]byte, error)</code></span>
              <span><code>Sign(ctx, req *SignRequest) (bls.Signature, error)</code></span>
              <span><code>SubscribeAccountChanges(chan [][48]byte) event.Subscription</code></span>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
              <p className="text-xs font-bold text-foreground/70 mb-2">1. Local Keymanager</p>
              <div className="space-y-1 text-sm text-foreground/80">
                <p>EIP-2335 keystore JSON</p>
                <p>AES-128-CTR + Scrypt KDF</p>
                <p>로컬 디스크에서 키 읽기</p>
              </div>
              <div className="mt-2 text-xs text-foreground/60">
                <code>LocalKeymanager</code> — <code>keysCache: sync.Map</code> (pubkey &rarr; secret_key)
              </div>
            </div>
            <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
              <p className="text-xs font-bold text-foreground/70 mb-2">2. Web3Signer Keymanager</p>
              <div className="space-y-1 text-sm text-foreground/80">
                <p>외부 서명 서비스에 delegate</p>
                <p>키가 validator 프로세스 외부</p>
                <p>엔터프라이즈/institutional 사용</p>
              </div>
              <div className="mt-2 text-xs text-foreground/60">
                <code>Web3SignerKeymanager</code> — <code>url: string</code>, <code>httpClient</code>
              </div>
            </div>
            <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
              <p className="text-xs font-bold text-foreground/70 mb-2">3. Derived Keymanager</p>
              <div className="space-y-1 text-sm text-foreground/80">
                <p>HD wallet (EIP-2334)</p>
                <p>1개 mnemonic &rarr; N개 validator key</p>
                <p>복구 용이성</p>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-foreground/70 mb-2">초기화 분기 (initKeymanager)</p>
            <div className="space-y-1 text-sm text-foreground/80">
              <p><code>Web3SignerURL != ""</code> &rarr; <code>NewWeb3SignerKeymanager(url)</code></p>
              <p><code>DerivedMode == true</code> &rarr; <code>NewDerivedKeymanager(mnemonic)</code></p>
              <p>기본 &rarr; <code>NewLocalKeymanager(walletDir)</code></p>
            </div>
          </div>
        </div>
        <p className="leading-7">
          Keymanager가 <strong>3가지 키 저장 방식 추상화</strong>.<br />
          Local(파일), Web3Signer(remote), Derived(HD wallet) 지원.<br />
          trait 기반 → validator 코드는 구현체 몰라도 동작.
        </p>

        {/* ── EIP-2335 Keystore ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">EIP-2335 Keystore — 표준 JSON 포맷</h3>
        <div className="not-prose space-y-3 my-4">
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-foreground/70 mb-2">EIP-2335 Keystore JSON 구조</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-sm text-foreground/80">
              <span><code>crypto.kdf</code> — Scrypt (dklen=32, n=262144, r=8, p=1)</span>
              <span><code>crypto.checksum</code> — SHA-256</span>
              <span><code>crypto.cipher</code> — AES-128-CTR (iv + encrypted secret key)</span>
              <span><code>path</code> — <code>m/12381/3600/0/0/0</code> (EIP-2334)</span>
              <span><code>pubkey</code> — validator 공개키</span>
              <span><code>version</code> — 4</span>
            </div>
          </div>
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-foreground/70 mb-2">복호화 흐름</p>
            <div className="space-y-1 text-sm text-foreground/80">
              <p>1. user password 입력</p>
              <p>2. <code>Scrypt(password, salt)</code> &rarr; derived key (32 bytes)</p>
              <p>3. 처음 16 bytes를 AES key로 사용</p>
              <p>4. <code>AES-128-CTR(cipher.message, iv)</code> &rarr; secret_key</p>
              <p>5. 검증: <code>sha256(derived_key[16:] || cipher.message) == checksum</code></p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
              <p className="text-xs font-bold text-foreground/70 mb-2">Scrypt 파라미터 (n=262144)</p>
              <div className="space-y-1 text-sm text-foreground/80">
                <p>메모리 hardness: ~256 MB</p>
                <p>CPU time: ~1-2초 on modern hardware</p>
                <p>brute-force 방어 (GPU/ASIC 저항)</p>
              </div>
            </div>
            <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
              <p className="text-xs font-bold text-foreground/70 mb-2">Prysm 처리 방식</p>
              <div className="space-y-1 text-sm text-foreground/80">
                <p>시작 시 password 프롬프트 (또는 <code>--wallet-password-file</code>)</p>
                <p>keystores decrypt &rarr; memory에만 유지</p>
                <p>디스크에는 암호화된 JSON만 보관</p>
              </div>
            </div>
          </div>
        </div>
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
