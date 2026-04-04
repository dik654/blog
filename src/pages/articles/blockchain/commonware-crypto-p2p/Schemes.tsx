import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';
import SchemesViz from './viz/SchemesViz';

interface Props {
  onCodeRef: (k: string, r: CodeRef) => void;
}

const SCHEMES = [
  { name: 'ed25519', pk: '32B', sig: '64B', batch: true, use: '피어 인증, 일반 트랜잭션' },
  { name: 'bls12381', pk: '48B', sig: '96B', batch: true, use: '합의 인증서, 크로스체인' },
  { name: 'secp256r1', pk: '33B', sig: '64/65B', batch: false, use: 'HSM/TEE, 엔터프라이즈' },
];

export default function Schemes({ onCodeRef }: Props) {
  return (
    <section id="schemes" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">서명 스킴 비교: 코드 추적</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          세 스킴 모두 동일한 Signer/Verifier trait 구현 — 교체 시 합의 코드 변경 없음
        </p>
      </div>
      <div className="not-prose mb-6">
        <SchemesViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
      <div className="not-prose overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-border">
              {['스킴', 'PK 크기', 'Sig 크기', 'Batch', '용도'].map((h) => (
                <th key={h} className="text-left p-2 font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SCHEMES.map((s) => (
              <tr key={s.name} className="border-b border-border/50">
                <td className="p-2 font-mono text-xs">{s.name}</td>
                <td className="p-2 font-mono text-xs">{s.pk}</td>
                <td className="p-2 font-mono text-xs">{s.sig}</td>
                <td className="p-2">{s.batch ? 'O' : 'X'}</td>
                <td className="p-2 text-muted-foreground">{s.use}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
