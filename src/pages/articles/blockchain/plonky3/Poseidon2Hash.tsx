import Poseidon2RoundsViz from '../components/Poseidon2RoundsViz';
import CodePanel from '@/components/ui/code-panel';
import { POSEIDON2_CODE, POSEIDON2_ANNOTATIONS, SBOX_CODE, SBOX_ANNOTATIONS } from './Poseidon2HashData';

export default function Poseidon2Hash({ title }: { title?: string }) {
  return (
    <section id="poseidon2-hash" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? 'Poseidon2 해시 상세'}</h2>
      <div className="not-prose mb-8"><Poseidon2RoundsViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Plonky3는 <strong>Poseidon2</strong>를 Merkle 트리 압축 함수와
          Fiat-Shamir 챌린저에 사용합니다. BabyBear 위에서 WIDTH=16, D=7으로
          128비트 보안을 달성하며, 부분 라운드 최적화로 Poseidon1 대비
          약 30% 빠릅니다.
        </p>

        <h3>Poseidon2 구조</h3>
        <CodePanel title="퍼뮤테이션 구조 & 라운드 설정" code={POSEIDON2_CODE}
          annotations={POSEIDON2_ANNOTATIONS} />

        <h3>S-box 최적화</h3>
        <CodePanel title="x^7 S-box & 외부/내부 라운드 차이" code={SBOX_CODE}
          annotations={SBOX_ANNOTATIONS} />
      </div>
    </section>
  );
}
