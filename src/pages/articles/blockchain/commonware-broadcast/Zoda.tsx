import ZodaViz from './viz/ZodaViz';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function Zoda({ onCodeRef }: Props) {
  return (
    <section id="zoda" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">ZODA: Reed-Solomon 이레이저 코딩</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          <code>Scheme</code> trait — encode/check/decode 3단계 이레이저 코딩 추상화
          <br />
          <code>PhasedScheme</code> — Strong(직접 수신)/Weak(전달) 샤드 분리. 검증 비용 최적화
        </p>
        <p className="leading-7">
          <strong>ZODA</strong> — Reed-Solomon + Hadamard + Fiat-Shamir 기반
          <br />
          데이터 → n·S × c 행렬 → RS 인코딩 → Merkle 커밋 → 체크섬 Z = X · H
          <br />
          KZG 대비: 신뢰 설정 불필요 · <code>ValidatingScheme</code> — 샤드 1개만 검증해도 전체 유효성 보장
        </p>
        <p className="leading-7">
          <strong>Strong → Weak</strong> 변환: weaken()으로 checksum/root 제거 → 대역폭 절약
          <br />
          check(): Merkle inclusion 검증 + shard · H == encoded_checksum 비교
        </p>
      </div>
      <div className="not-prose mb-8">
        <ZodaViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">ZODA 상세 설계</h3>

        <div className="not-prose bg-muted/50 rounded-lg border p-4 my-4 space-y-4">
          <div>
            <p className="text-xs font-mono text-muted-foreground mb-2">목표 — Zero-trust Online Data Availability</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div className="bg-background rounded-md border px-3 py-2 text-center">
                <p className="text-xs font-semibold">N개 노드에 분배</p>
              </div>
              <div className="bg-background rounded-md border px-3 py-2 text-center">
                <p className="text-xs font-semibold">k개로 전체 복구</p>
              </div>
              <div className="bg-background rounded-md border px-3 py-2 text-center">
                <p className="text-xs font-semibold">가용성 검증 가능</p>
              </div>
              <div className="bg-background rounded-md border px-3 py-2 text-center">
                <p className="text-xs font-semibold">신뢰 설정 불필요</p>
              </div>
            </div>
          </div>

          <div>
            <p className="text-xs font-mono text-muted-foreground mb-2">설계 비교</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div className="bg-background rounded-md border p-3">
                <p className="font-semibold text-xs">KZG 다항식 커밋</p>
                <p className="text-[11px] text-muted-foreground mt-1">블록당 단일 커밋 · 작은 증명<br/>단점: 신뢰 설정 의식 필요<br/>사용: Ethereum 4844 blob</p>
              </div>
              <div className="bg-background rounded-md border p-3">
                <p className="font-semibold text-xs">Merkle tree + RS</p>
                <p className="text-[11px] text-muted-foreground mt-1">신뢰 설정 불필요<br/>단점: 커밋 크기가 블록 크기에 비례<br/>사용: Celestia, ZODA</p>
              </div>
              <div className="bg-background rounded-md border p-3">
                <p className="font-semibold text-xs">ZODA 혁신</p>
                <p className="text-[11px] text-muted-foreground mt-1">Hadamard 인코딩 체크섬 · Fiat-Shamir 챌린지 · 1-of-n 정직 홀더로 가용성 증명</p>
              </div>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">ZODA 알고리즘 6단계</h3>
        <div className="not-prose bg-muted/50 rounded-lg border p-4 my-4">
          <p className="text-xs font-mono text-muted-foreground mb-2">입력: 크기 m 바이트의 데이터 D</p>
          <div className="space-y-2">
            <div className="bg-background rounded-md border p-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs px-2 py-0.5 rounded font-semibold">Step 1</span>
                <span className="text-sm font-semibold">행렬 배열</span>
              </div>
              <p className="text-xs text-muted-foreground">D → X 행렬 (n·S) × c 형태. n·S = 행, c = 열</p>
            </div>
            <div className="bg-background rounded-md border p-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs px-2 py-0.5 rounded font-semibold">Step 2</span>
                <span className="text-sm font-semibold">Reed-Solomon 인코딩</span>
              </div>
              <p className="text-xs text-muted-foreground">각 열을 RS 인코딩 → 길이 S에서 n으로 확장. blowup factor: rate = S/n</p>
            </div>
            <div className="bg-background rounded-md border p-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-xs px-2 py-0.5 rounded font-semibold">Step 3</span>
                <span className="text-sm font-semibold">Merkle 커밋</span>
              </div>
              <p className="text-xs text-muted-foreground">각 행 <code>X[i,:]</code>에 대해 <code>merkle_tree.commit()</code> → 커밋 루트 생성</p>
            </div>
            <div className="bg-background rounded-md border p-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-xs px-2 py-0.5 rounded font-semibold">Step 4</span>
                <span className="text-sm font-semibold">체크섬 계산</span>
              </div>
              <p className="text-xs text-muted-foreground">Z = X · H (H: Hadamard 행렬) → "Hadamard-projected" 데이터</p>
            </div>
            <div className="bg-background rounded-md border p-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs px-2 py-0.5 rounded font-semibold">Step 5</span>
                <span className="text-sm font-semibold">Fiat-Shamir 챌린지</span>
              </div>
              <p className="text-xs text-muted-foreground">challenge = hash(X_roots, Z_root) → 랜덤 벡터 r 도출</p>
            </div>
            <div className="bg-background rounded-md border p-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs px-2 py-0.5 rounded font-semibold">Step 6</span>
                <span className="text-sm font-semibold">검증 벡터 계산</span>
              </div>
              <p className="text-xs text-muted-foreground">proof = X^T · r → 검증자에게 배포</p>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">검증 & Scheme Trait</h3>
        <div className="not-prose bg-muted/50 rounded-lg border p-4 my-4 space-y-4">
          <div>
            <p className="text-xs font-mono text-muted-foreground mb-2">검증 과정 — 검증자가 샤드 X[i,:] (한 행) 보유</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div className="bg-background rounded-md border p-3">
                <p className="font-semibold text-xs">1. Merkle inclusion</p>
                <p className="text-[11px] text-muted-foreground mt-1"><code>X[i,:]</code>가 커밋된 루트에 포함되는지 확인</p>
              </div>
              <div className="bg-background rounded-md border p-3">
                <p className="font-semibold text-xs">2. Hadamard 검사</p>
                <p className="text-[11px] text-muted-foreground mt-1"><code>X[i,:] · H == Z[i,:]</code> (인코딩된 체크섬과 비교)</p>
              </div>
              <div className="bg-background rounded-md border p-3">
                <p className="font-semibold text-xs">3. Fiat-Shamir</p>
                <p className="text-[11px] text-muted-foreground mt-1">랜덤 쿼리 · 모든 검사 통과 → X가 올바르게 형성될 높은 확률 · f+1 샤드로 복구 가능</p>
              </div>
            </div>
          </div>

          <div>
            <p className="text-xs font-mono text-muted-foreground mb-2">Scheme trait — <code>trait Scheme</code></p>
            <div className="bg-background rounded-md border p-3 text-sm">
              <p className="font-mono text-xs">
                연관 타입: <code>Input</code> · <code>Shard</code> · <code>Proof</code>
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                <code>encode(input) → Vec&lt;Shard&gt;</code> · <code>check(shard, proof) → bool</code> · <code>decode(shards) → Option&lt;Input&gt;</code>
              </p>
              <p className="text-xs text-muted-foreground mt-1">ZODA가 이 trait 구현 — KZG, Merkle-only 등으로 확장 가능</p>
            </div>
          </div>

          <div>
            <p className="text-xs font-mono text-muted-foreground mb-2">ValidatingScheme — 증명 가능 가용성</p>
            <div className="bg-background rounded-md border p-3 text-xs text-muted-foreground">
              <p>강한 보장: <code>check()</code> 통과한 샤드 → 정직 홀더로부터 데이터가 확실히 가용</p>
              <p className="mt-1">성공적으로 검증된 샤드 → 항상 복구 가능. "나쁜 홀더"가 데이터 보유를 거짓 주장 불가</p>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">PhasedScheme & RS 파라미터</h3>
        <div className="not-prose bg-muted/50 rounded-lg border p-4 my-4 space-y-4">
          <div>
            <p className="text-xs font-mono text-muted-foreground mb-2">PhasedScheme — Strong/Weak 샤드 분리</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="bg-background rounded-md border p-3">
                <p className="font-semibold text-sm">Strong 샤드</p>
                <p className="text-xs text-muted-foreground mt-1">전체 데이터 + 체크섬 + Merkle 루트 · 주 복제본에 전송 · 자체 검증 가능</p>
              </div>
              <div className="bg-background rounded-md border p-3">
                <p className="font-semibold text-sm">Weak 샤드</p>
                <p className="text-xs text-muted-foreground mt-1">원시 데이터만(체크섬 없음) · 보조 복제본에 전송 · Strong 대비 검증</p>
              </div>
            </div>
            <div className="bg-background rounded-md border p-3 mt-2 text-xs text-muted-foreground">
              <p><code>weaken(strong)</code>: checksum + merkle_root 제거 → 샤드당 ~32-64바이트 절약 · 복제본 많을수록 절감 효과 큼</p>
            </div>
          </div>

          <div>
            <p className="text-xs font-mono text-muted-foreground mb-2">Reed-Solomon 파라미터 예시</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <div className="bg-background rounded-md border px-3 py-2">
                <p className="text-xs font-semibold">블록 크기</p>
                <p className="text-[11px] text-muted-foreground">1 MB = 2^20 bytes</p>
              </div>
              <div className="bg-background rounded-md border px-3 py-2">
                <p className="text-xs font-semibold">청크 크기</p>
                <p className="text-[11px] text-muted-foreground">256 bytes</p>
              </div>
              <div className="bg-background rounded-md border px-3 py-2">
                <p className="text-xs font-semibold">n (인코딩 청크)</p>
                <p className="text-[11px] text-muted-foreground">1024개</p>
              </div>
              <div className="bg-background rounded-md border px-3 py-2">
                <p className="text-xs font-semibold">k (데이터 청크)</p>
                <p className="text-[11px] text-muted-foreground">256개</p>
              </div>
              <div className="bg-background rounded-md border px-3 py-2">
                <p className="text-xs font-semibold">Rate</p>
                <p className="text-[11px] text-muted-foreground">1/4 (25% 여분)</p>
              </div>
              <div className="bg-background rounded-md border px-3 py-2">
                <p className="text-xs font-semibold">복구</p>
                <p className="text-[11px] text-muted-foreground">256개면 전체 복구 (768개 손실 허용)</p>
              </div>
            </div>
          </div>

          <div>
            <p className="text-xs font-mono text-muted-foreground mb-2">보안 분석</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div className="bg-background rounded-md border p-3">
                <p className="font-semibold text-xs">건전성 (Soundness)</p>
                <p className="text-[11px] text-muted-foreground mt-1">ZODA 증명 통과 ⇒ 올바르게 인코딩. 잘못된 인코딩 통과 확률: 2^-lambda (FS 챌린지 엔트로피)</p>
              </div>
              <div className="bg-background rounded-md border p-3">
                <p className="font-semibold text-xs">가용성 (Availability)</p>
                <p className="text-[11px] text-muted-foreground mt-1">1+ 정직 검증자가 유효 샤드 보유 → 전체 복구 가능. all-but-one 부패 저항</p>
              </div>
              <div className="bg-background rounded-md border p-3">
                <p className="font-semibold text-xs">포스트-양자</p>
                <p className="text-[11px] text-muted-foreground mt-1">RS는 양자 안전 · Hadamard/FS + SHA-3 양자 안전 · DL/페어링 의존 없음</p>
              </div>
            </div>
          </div>

          <div>
            <p className="text-xs font-mono text-muted-foreground mb-2">응용 분야</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div className="bg-background rounded-md border px-3 py-2 text-center">
                <p className="text-xs font-semibold">롤업 DA</p>
              </div>
              <div className="bg-background rounded-md border px-3 py-2 text-center">
                <p className="text-xs font-semibold">스토리지 복제 증명</p>
              </div>
              <div className="bg-background rounded-md border px-3 py-2 text-center">
                <p className="text-xs font-semibold">BFT 합의 데이터 계층</p>
              </div>
              <div className="bg-background rounded-md border px-3 py-2 text-center">
                <p className="text-xs font-semibold">무결성 파일 공유</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
