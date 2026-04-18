import type { CodeRef } from '@/components/code/types';
import KeyDerivationViz from './viz/KeyDerivationViz';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function KeyDerivation({ onCodeRef: _onCodeRef }: Props) {
  return (
    <section id="key-derivation" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">BIP-44 키 파생 & 로컬 서명</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          니모닉(12/24단어) → PBKDF2(2048라운드) → 64바이트 시드.
          <br />
          키 스트레칭으로 브루트포스 공격을 억제한다.
        </p>
        <p className="leading-7">
          시드를 HMAC-SHA512에 넣으면 <strong>마스터 키</strong>와 <strong>체인 코드</strong>가 나온다.
          <br />
          BIP-44 경로 <code>m/44'/60'/0'/0/0</code>으로 이더리움 자식 키를 파생한다.
        </p>
        <p className="leading-7">
          모든 키 파생과 서명이 로컬에서 수행된다.
          <br />
          비밀키가 RPC 서버에 전송되지 않는다. 프라이버시의 기본 전제다.
        </p>
      </div>
      <div className="not-prose"><KeyDerivationViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">

        <h3 className="text-xl font-semibold mt-6 mb-3">BIP-44 Derivation Path</h3>
        <div className="not-prose space-y-3 mb-4">
          <div className="bg-muted rounded-lg p-4">
            <p className="text-sm font-semibold mb-2">경로 구조: <code>m / purpose' / coin_type' / account' / change / address_index</code></p>
            <div className="grid grid-cols-5 gap-1 text-center text-xs mt-3">
              <div className="bg-background rounded px-2 py-2">
                <p className="font-medium">44'</p>
                <p className="text-muted-foreground">purpose</p>
                <p className="text-[10px] text-muted-foreground">BIP-44</p>
              </div>
              <div className="bg-background rounded px-2 py-2">
                <p className="font-medium">60'</p>
                <p className="text-muted-foreground">coin_type</p>
                <p className="text-[10px] text-muted-foreground">Ethereum</p>
              </div>
              <div className="bg-background rounded px-2 py-2">
                <p className="font-medium">0'</p>
                <p className="text-muted-foreground">account</p>
                <p className="text-[10px] text-muted-foreground">기본 계정</p>
              </div>
              <div className="bg-background rounded px-2 py-2">
                <p className="font-medium">0</p>
                <p className="text-muted-foreground">change</p>
                <p className="text-[10px] text-muted-foreground">external</p>
              </div>
              <div className="bg-background rounded px-2 py-2">
                <p className="font-medium">0</p>
                <p className="text-muted-foreground">index</p>
                <p className="text-[10px] text-muted-foreground">첫 주소</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2"><code>'</code> = hardened derivation (부모 공개키로 자식 비밀키 역추적 불가)</p>
          </div>

          <div className="bg-muted rounded-lg p-4">
            <p className="text-sm font-semibold mb-2">Coin Types (SLIP-0044)</p>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="bg-background px-2 py-1 rounded"><code>0'</code> Bitcoin</span>
              <span className="bg-background px-2 py-1 rounded"><code>60'</code> Ethereum</span>
              <span className="bg-background px-2 py-1 rounded"><code>714'</code> BNB Chain</span>
              <span className="bg-background px-2 py-1 rounded"><code>501'</code> Solana</span>
            </div>
          </div>

          <div className="bg-muted rounded-lg p-4">
            <p className="text-sm font-semibold mb-2">Derivation 과정</p>
            <ol className="text-sm text-muted-foreground space-y-2">
              <li><strong>1) Mnemonic → Seed (BIP-39)</strong>: <code>PBKDF2(password: mnemonic, salt: "mnemonic" + passphrase, iterations: 2048, output: 64B)</code></li>
              <li><strong>2) Seed → Master Key (BIP-32)</strong>: <code>HMAC-SHA512(key: "Bitcoin seed", data: seed)</code> → master_priv + master_chain</li>
              <li><strong>3) Path 따라 child key 파생</strong>: Hardened — <code>HMAC(chain, 0x00||priv||index+0x80000000)</code>, Normal — <code>HMAC(chain, pubkey||index)</code></li>
              <li><strong>4) Final</strong>: <code>m/44'/60'/0'/0/0</code> → Ethereum address 0</li>
            </ol>
          </div>

          <div className="flex flex-wrap gap-2 text-xs">
            <span className="bg-green-100 dark:bg-green-950/40 text-green-700 dark:text-green-400 px-2 py-1 rounded">Deterministic (같은 mnemonic → 같은 key)</span>
            <span className="bg-green-100 dark:bg-green-950/40 text-green-700 dark:text-green-400 px-2 py-1 rounded">Hierarchical (account 구조)</span>
            <span className="bg-green-100 dark:bg-green-950/40 text-green-700 dark:text-green-400 px-2 py-1 rounded">Multi-chain 호환</span>
            <span className="bg-green-100 dark:bg-green-950/40 text-green-700 dark:text-green-400 px-2 py-1 rounded">표준화 (모든 wallet 호환)</span>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">Local Signing의 중요성</h3>
        <div className="not-prose space-y-3 mb-4">
          <div className="bg-muted rounded-lg p-4">
            <p className="text-sm font-semibold mb-2">서명 흐름</p>
            <p className="text-sm text-muted-foreground">비밀키는 절대 서버로 전송하지 않음</p>
            <ol className="text-sm text-muted-foreground space-y-1 mt-2">
              <li>1) User가 UI에서 TX 준비</li>
              <li>2) Client가 TX 구성 (unsigned)</li>
              <li>3) Private key로 local에서 서명</li>
              <li>4) Signed TX만 RPC로 전송</li>
            </ol>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-muted rounded-lg p-4 border-l-4 border-green-400">
              <p className="text-sm font-semibold mb-2">Client (trusted)</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>Private key 보관</li>
                <li>Signing logic 실행</li>
                <li>Nonce 관리</li>
              </ul>
            </div>
            <div className="bg-muted rounded-lg p-4 border-l-4 border-red-400">
              <p className="text-sm font-semibold mb-2">Server (untrusted)</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>signed_tx만 수신</li>
                <li>Broadcast / Mempool relay</li>
                <li>Query responses</li>
              </ul>
            </div>
          </div>

          <div className="bg-muted rounded-lg p-4">
            <p className="text-sm font-semibold mb-2">Key Storage Options</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              <div className="bg-background rounded px-3 py-2">
                <p className="font-medium">Browser localStorage</p>
                <p className="text-muted-foreground">취약 (비암호화)</p>
              </div>
              <div className="bg-background rounded px-3 py-2">
                <p className="font-medium">Encrypted localStorage</p>
                <p className="text-muted-foreground">password 기반 암호화</p>
              </div>
              <div className="bg-background rounded px-3 py-2">
                <p className="font-medium">Hardware wallet</p>
                <p className="text-muted-foreground">Ledger, Trezor</p>
              </div>
              <div className="bg-background rounded px-3 py-2">
                <p className="font-medium">MPC custody</p>
                <p className="text-muted-foreground">threshold signing</p>
              </div>
              <div className="bg-background rounded px-3 py-2">
                <p className="font-medium">Smart account</p>
                <p className="text-muted-foreground">social recovery</p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 text-xs">
            <span className="bg-green-100 dark:bg-green-950/40 text-green-700 dark:text-green-400 px-2 py-1 rounded">Hardware wallet for high-value</span>
            <span className="bg-green-100 dark:bg-green-950/40 text-green-700 dark:text-green-400 px-2 py-1 rounded">Encrypted storage + strong password</span>
            <span className="bg-green-100 dark:bg-green-950/40 text-green-700 dark:text-green-400 px-2 py-1 rounded">Seed backup (offline)</span>
            <span className="bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-400 px-2 py-1 rounded">절대 seed를 온라인 전송하지 말 것</span>
          </div>
        </div>

      </div>
    </section>
  );
}
