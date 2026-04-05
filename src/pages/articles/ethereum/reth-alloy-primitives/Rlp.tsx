import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CodeViewButton from '@/components/code/CodeViewButton';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import { RLP_RULES } from './RlpData';

export default function Rlp({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const open = (key: string) => onCodeRef(key, codeRefs[key]);
  const [step, setStep] = useState(0);

  return (
    <section id="rlp" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">alloy-rlp 인코딩/디코딩</h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          RLP(Recursive Length Prefix)는 이더리움의 유일한 직렬화 포맷이다.<br />
          트랜잭션, 블록 헤더, 상태 트라이 노드 모두 RLP로 인코딩된다.<br />
          <strong>결정적(deterministic)</strong> 직렬화가 핵심이다.<br />
          같은 데이터를 다르게 인코딩하면 해시가 달라지고, 블록 검증이 실패한다.
        </p>
        <p className="leading-7">
          RLP의 규칙은 단순하다.<br />
          첫 바이트가 데이터의 타입(문자열/리스트)과 길이를 결정한다.<br />
          재귀적 구조를 지원하므로 중첩된 리스트도 표현할 수 있다.
        </p>
        <p className="leading-7">
          Geth의 <code>rlp</code> 패키지는 <code>reflect</code>를 사용해 런타임에 필드를 순회한다.<br />
          alloy-rlp는 <code>#[derive(RlpEncodable)]</code> 매크로가 컴파일 타임에 각 필드의 <code>encode()</code> 호출 코드를 직접 생성한다.<br />
          런타임 분기가 없으므로 LLVM이 전체를 인라인할 수 있다.
        </p>

        {/* ── RLP 4가지 규칙 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">RLP 인코딩 4가지 규칙</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 규칙 1: 단일 바이트 [0x00, 0x7f] → 그 바이트 자체
encode(0x42) = [0x42]
encode(0x7f) = [0x7f]

// 규칙 2: 짧은 문자열 [0..55 bytes] → 0x80 + len, 데이터
encode("dog") = [0x83, 'd', 'o', 'g']
                 ↑ 0x80 + 3

// 규칙 3: 긴 문자열 [>55 bytes] → 0xb7 + len_of_len, len, 데이터
encode(1024-byte string) = [0xb9, 0x04, 0x00, ...data...]
                            ↑ 0xb7 + 2  ↑ 1024 (2바이트)

// 규칙 4: 리스트 → 0xc0 + total_len (payload)
encode(["cat", "dog"]) = [0xc8, 0x83, 'c', 'a', 't', 0x83, 'd', 'o', 'g']
                          ↑ 0xc0 + 8 (payload 길이)

// 첫 바이트 범위로 타입 판별:
// 0x00-0x7f: 단일 바이트 문자열
// 0x80-0xb7: 짧은 문자열 (len = byte - 0x80)
// 0xb8-0xbf: 긴 문자열 (len_of_len = byte - 0xb7)
// 0xc0-0xf7: 짧은 리스트 (len = byte - 0xc0)
// 0xf8-0xff: 긴 리스트 (len_of_len = byte - 0xf7)`}
        </pre>
        <p className="leading-7">
          RLP는 매우 단순한 규칙 4가지로 모든 구조체를 인코딩 — JSON보다 컴팩트, protobuf보다 단순.<br />
          디코더는 첫 바이트만 보고 타입과 길이를 판단 → 한 번의 분기로 파싱 시작 가능.<br />
          "재귀적(Recursive)"인 이유: 리스트 원소 각각이 다시 RLP 인코딩된 값 (문자열 또는 중첩 리스트).
        </p>

        {/* ── Encodable trait ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Encodable / Decodable trait</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// alloy-rlp의 핵심 trait
pub trait Encodable {
    /// 출력 버퍼에 RLP 인코딩 데이터 추가
    fn encode(&self, out: &mut dyn BufMut);

    /// 인코딩 결과의 총 바이트 길이 (pre-computed)
    fn length(&self) -> usize;
}

pub trait Decodable: Sized {
    /// 바이트 버퍼에서 디코딩 (버퍼 포인터 전진)
    fn decode(buf: &mut &[u8]) -> alloy_rlp::Result<Self>;
}

// length()가 별도 메서드인 이유:
// - 리스트 header를 인코딩하려면 payload 길이를 미리 알아야 함
// - encode() 전에 length() 호출 → header 작성 → encode() 호출

// 기본 타입에 대한 구현:
impl Encodable for u64 { ... }
impl Encodable for U256 { ... }
impl Encodable for Address { ... }
impl Encodable for B256 { ... }
impl Encodable for Bytes { ... }
impl Encodable for Vec<T: Encodable> { ... }
impl Encodable for Option<T: Encodable> { ... }`}
        </pre>
        <p className="leading-7">
          <code>length()</code> 메서드가 핵심 설계 — 리스트 인코딩 시 <strong>2-pass</strong> 필요.<br />
          1st pass: 모든 필드의 length 합산으로 payload 길이 계산.<br />
          2nd pass: header + payload 순으로 작성.
        </p>

        {/* ── derive 매크로 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">#[derive(RlpEncodable)] — 컴파일 타임 코드 생성</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 사용자 코드
#[derive(RlpEncodable, RlpDecodable)]
pub struct TxLegacy {
    pub nonce: u64,
    pub gas_price: u128,
    pub gas_limit: u64,
    pub to: TxKind,        // Option<Address>
    pub value: U256,
    pub input: Bytes,
}

// 매크로가 컴파일 타임에 생성하는 코드 (단순화):
impl Encodable for TxLegacy {
    fn encode(&self, out: &mut dyn BufMut) {
        // 1. 전체 payload 길이 계산
        let payload_len = self.nonce.length()
            + self.gas_price.length()
            + self.gas_limit.length()
            + self.to.length()
            + self.value.length()
            + self.input.length();

        // 2. 리스트 header 작성
        Header { list: true, payload_length: payload_len }.encode(out);

        // 3. 각 필드 순서대로 인코딩
        self.nonce.encode(out);
        self.gas_price.encode(out);
        self.gas_limit.encode(out);
        self.to.encode(out);
        self.value.encode(out);
        self.input.encode(out);
    }
    fn length(&self) -> usize { /* similar */ }
}

// LLVM 최적화 후:
// - 모든 encode() 호출이 inline됨
// - 분기 예측 실패 0
// - 리플렉션 기반보다 ~10배 빠름`}
        </pre>
        <p className="leading-7">
          Rust 프로시저 매크로는 <strong>AST 변환</strong>으로 코드 생성 — 컴파일 시 struct 필드 목록을 읽어서 encode() 함수를 작성.<br />
          생성된 코드는 "수동으로 쓴 것과 동일" — 런타임 타입 정보 조회 없음.<br />
          Go의 reflect는 매번 <code>reflect.Value</code>, <code>reflect.Type</code> 생성 + method dispatch.
        </p>

        {/* ── 결정성 검증 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">결정적 직렬화 — canonical encoding</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// RLP의 canonical 규칙:
// 1. 정수는 leading zeros 제거
encode(U256::from(15)) = [0x0f]             // ✓ canonical
encode(U256::from(15)) ≠ [0x80, 0x00, 0x0f] // ✗ non-canonical

// 2. 짧은 표현 우선
encode("a") = [0x61]          // ✓ 단일 바이트 < 0x80
encode("a") ≠ [0x81, 0x61]    // ✗ header는 0x80 이상에서만

// 3. length는 최소 바이트 수로
encode(0x100 바이트 문자열) = [0xb9, 0x01, 0x00, ...]  // ✓ 2바이트
encode(0x100 바이트 문자열) ≠ [0xba, 0x00, 0x01, 0x00, ...]  // ✗

// 왜 canonical이 중요한가:
// TX 해시 = keccak256(RLP(tx))
// 같은 TX를 두 가지 방법으로 인코딩하면 해시 2개 → 체인 무결성 붕괴
//
// 검증 로직:
// 1. TX 디코딩 → 원본 RLP 바이트 저장
// 2. 재인코딩 → canonical RLP 생성
// 3. 원본 == canonical → OK
// 4. 다름 → reject (non-canonical encoding 공격 차단)

// alloy-rlp가 제공하는 안전성:
// - encode()는 항상 canonical 형식
// - decode()는 non-canonical 입력을 거부`}
        </pre>
        <p className="leading-7">
          결정성이 없으면 <strong>같은 TX의 해시가 여러 개</strong> → 이중 지불, replay 공격 가능.<br />
          RLP의 canonical 규칙은 "한 데이터 = 한 인코딩"을 강제.<br />
          디코더도 non-canonical 입력을 거부해 악의적 인코딩 차단.
        </p>
      </div>

      <h3 className="text-lg font-semibold mb-3">RLP 인코딩 규칙</h3>
      <div className="space-y-2 mb-8">
        {RLP_RULES.map((s, i) => (
          <motion.div key={i} onClick={() => setStep(i)}
            className={`rounded-lg border p-4 cursor-pointer transition-colors ${i === step ? 'border-violet-500/50 bg-violet-500/5' : 'border-border'}`}
            animate={{ opacity: i === step ? 1 : 0.6 }}>
            <div className="flex items-center gap-3">
              <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${i === step ? 'bg-violet-500 text-white' : 'bg-muted text-muted-foreground'}`}>{i + 1}</span>
              <span className="font-semibold text-sm">{s.title}</span>
            </div>
            <AnimatePresence>
              {i === step && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                  <p className="text-sm text-foreground/70 mt-2 ml-10">{s.desc}</p>
                  {s.codeKey && (
                    <div className="ml-10 mt-2">
                      <CodeViewButton onClick={() => open(s.codeKey)} />
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>성능 차이의 핵심</strong> — Geth의 리플렉션 기반 인코더는 매 호출마다
          타입 메타데이터를 조회하고 분기한다.<br />
          alloy-rlp의 매크로 생성 코드는 필드 순서가 컴파일 타임에 고정되므로
          분기 예측 실패가 없고, 함수 호출 오버헤드도 인라인으로 제거된다.
        </p>
      </div>
    </section>
  );
}
