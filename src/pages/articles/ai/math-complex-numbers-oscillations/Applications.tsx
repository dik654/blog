import { Link } from "react-router-dom";

export default function Applications() {
  return (
    <section id="applications" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">이제 Fourier 식에서 회전 속도·크기·phase를 따로 읽을 수 있다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          DFT의 <code>e^{'{-i2πkn/N}'}</code>는 <code>k</code>번째 속도로 회전하는 단위원 좌표입니다. Signal sample을 이 회전과 곱해 한 주기 동안 더하면 같은 회전 패턴은 일정한 방향으로 누적되고, 다른 패턴은 원 둘레에 퍼져 상쇄됩니다. 결과로 얻은 complex coefficient의 magnitude는 해당 성분의 크기를, phase는 시작 위치를 나타냅니다.
        </p>
        <p>
          다음 <Link to="/ai/fft">DFT·FFT 글</Link>에서는 이 basis와 signal의 내적을 N개 frequency에 대해 계산합니다. 먼저 sampling rate와 frame length가 실제 Hz 좌표를 어떻게 정하는지 확인한 뒤, roots of unity의 대칭을 재사용해 O(N²) direct DFT를 O(N log N) 계산으로 바꾸는 Cooley–Tukey factorization으로 이어집니다.
        </p>
      </div>
    </section>
  );
}
