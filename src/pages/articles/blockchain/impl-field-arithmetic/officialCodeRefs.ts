import type { CodeRef } from "@/components/code/types";

export const officialCodeRefs: Record<string, CodeRef> = {
  "ark-fp-type": {
    path: "ark-ff/fields/models/fp/mod.rs — Fp와 FpConfig",
    lang: "rust",
    highlight: [1, 18],
    desc: "arkworks algebra commit 6a28df5. Field parameter trait와 내부 Montgomery 표현을 분리합니다.",
    code: `pub trait FpConfig<const N: usize> {
    const MODULUS: BigInt<N>;

    fn from_bigint(other: BigInt<N>) -> Option<Fp<Self, N>>;
    fn into_bigint(other: Fp<Self, N>) -> BigInt<N>;
}

/// Prime-field element. The BigInt is stored in Montgomery form.
pub struct Fp<P: FpConfig<N>, const N: usize>(
    pub BigInt<N>,
    pub PhantomData<P>,
);

pub type Fp256<P> = Fp<P, 4>;`,
    annotations: [
      {
        lines: [1, 6],
        color: "sky",
        note: "MODULUS와 canonical integer ↔ field element 변환은 같은 configuration이 소유합니다.",
      },
      {
        lines: [8, 12],
        color: "emerald",
        note: "내부 BigInt는 공개 정수가 아니라 Montgomery form입니다.",
      },
      {
        lines: [14, 14],
        color: "amber",
        note: "Fp256은 64-bit limb 네 개를 사용합니다.",
      },
    ],
  },
  "ark-montgomery-constants": {
    path: "ark-ff/fields/models/fp/montgomery_backend.rs — constants",
    lang: "rust",
    highlight: [1, 16],
    desc: "arkworks algebra commit 6a28df5. Modulus에서 R·R²·INV를 같은 backend 상수로 계산합니다.",
    code: `pub trait MontConfig<const N: usize> {
    const MODULUS: BigInt<N>;

    /// R = 2^(64N) mod MODULUS
    const R: BigInt<N> = Self::MODULUS.montgomery_r();

    /// R2 = R^2 mod MODULUS
    const R2: BigInt<N> = Self::MODULUS.montgomery_r2();

    /// INV = -MODULUS^(-1) mod 2^64
    const INV: u64 = inv::<Self, N>();
}`,
    annotations: [
      {
        lines: [1, 2],
        color: "sky",
        note: "N과 MODULUS가 field의 limb 폭과 나머지 기준을 함께 정합니다.",
      },
      {
        lines: [4, 11],
        color: "violet",
        note: "R·R²·INV는 다른 modulus나 limb 수와 섞어 쓸 수 없는 한 묶음입니다.",
      },
    ],
  },
  "ark-field-admission": {
    path: "ark-ff/fields/models/fp — deserialize와 from_bigint",
    lang: "rust",
    highlight: [1, 19],
    desc: "arkworks algebra commit 6a28df5. Bytes를 canonical integer로 읽고 modulus 이상이면 InvalidData로 끝냅니다.",
    code: `let self_integer = masked_bytes.to_bigint();
Self::from_bigint(self_integer)
    .map(|value| (value, flags))
    .ok_or(SerializationError::InvalidData)

fn from_bigint(r: BigInt<N>) -> Option<Fp<MontBackend<Self, N>, N>> {
    let mut r = Fp::new_unchecked(r);
    if r.is_zero() {
        Some(r)
    } else if r.is_geq_modulus() {
        None
    } else {
        r *= &Fp::new_unchecked(Self::R2);
        Some(r)
    }
}`,
    annotations: [
      {
        lines: [1, 4],
        color: "sky",
        note: "Deserialize는 실패를 숨기지 않고 InvalidData로 바꿉니다.",
      },
      {
        lines: [6, 15],
        color: "emerald",
        note: "MODULUS 이상은 None이고, 승인된 canonical 정수만 R²를 거쳐 내부 domain으로 들어갑니다.",
      },
    ],
  },
  "ark-field-multiply": {
    path: "ark-ff/fields/models/fp/montgomery_backend.rs — CIOS inner loop",
    lang: "rust",
    highlight: [1, 18],
    desc: "arkworks algebra commit 6a28df5. 낮은 word에서 k를 만들고 modulus의 배수를 누적해 word를 소거합니다.",
    code: `for i in 0..N {
    let mut carry1 = 0u64;
    r[0] = mac(r[0], a[0], b[i], &mut carry1);

    let k = r[0].wrapping_mul(Self::INV);
    let mut carry2 = 0u64;
    mac_discard(r[0], k, Self::MODULUS[0], &mut carry2);

    for j in 1..N {
        r[j] = mac_with_carry(r[j], a[j], b[i], &mut carry1);
        r[j - 1] = mac_with_carry(
            r[j], k, Self::MODULUS[j], &mut carry2,
        );
    }
    r[N - 1] = carry1 + carry2;
}
a.subtract_modulus();`,
    annotations: [
      {
        lines: [1, 7],
        color: "amber",
        note: "각 i에서 곱의 다음 word와 소거 계수 k를 만듭니다.",
      },
      {
        lines: [9, 16],
        color: "violet",
        note: "두 carry chain을 전파하면서 낮은 word를 버릴 수 있는 상태로 만듭니다.",
      },
      {
        lines: [18, 18],
        color: "emerald",
        note: "마지막 조건부 subtraction이 내부 값을 [0,p)로 정규화합니다.",
      },
    ],
  },
  "ark-field-output": {
    path: "ark-ff/fields/models/fp/mod.rs — canonical serialize",
    lang: "rust",
    highlight: [1, 11],
    desc: "arkworks algebra commit 6a28df5. 내부 limbs가 아니라 into_bigint로 복원한 canonical integer를 기록합니다.",
    code: `let mut bytes = SerBuffer::zeroed();
bytes.copy_from_u64_slice(&self.into_bigint().0);
bytes[output_byte_size - 1] |= flags.u8_bitmask();
bytes.write_up_to(writer, output_byte_size)?;

fn serialize_with_mode<W: Write>(
    &self,
    writer: W,
    _compress: Compress,
) -> Result<(), SerializationError> {
    self.serialize_with_flags(writer, EmptyFlags)
}`,
    annotations: [
      {
        lines: [1, 4],
        color: "emerald",
        note: "into_bigint가 Montgomery 배율을 제거한 뒤 little-endian bytes를 씁니다.",
      },
      {
        lines: [6, 11],
        color: "sky",
        note: "Prime field에는 compressed 여부와 관계없이 같은 canonical 값 경로를 사용합니다.",
      },
    ],
  },
};
