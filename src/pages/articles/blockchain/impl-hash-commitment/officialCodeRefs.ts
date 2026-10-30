import type { CodeRef } from "@/components/code/types";

export const officialHashCodeRefs: Record<string, CodeRef> = {
  "ark-merkle-config": {
    path: "crypto-primitives/src/merkle_tree/mod.rs — Config",
    lang: "rust",
    highlight: [1, 31],
    desc: "arkworks crypto-primitives commit 7816710. Leaf hash와 두 inner digest를 합치는 hash를 서로 다른 연관 타입으로 분리합니다.",
    code: `pub trait Config {
    type Leaf: ?Sized + Send;
    type LeafDigest: Clone
        + Eq
        + Debug
        + Hash
        + Default
        + CanonicalSerialize
        + CanonicalDeserialize
        + Send
        + Sync;

    type LeafInnerDigestConverter: DigestConverter<
        Self::LeafDigest,
        <Self::TwoToOneHash as TwoToOneCRHScheme>::Input,
    >;

    type InnerDigest: Clone
        + Eq
        + Debug
        + Hash
        + Default
        + CanonicalSerialize
        + CanonicalDeserialize
        + Send
        + Sync
        + Absorb;

    type LeafHash: CRHScheme<Input = Self::Leaf, Output = Self::LeafDigest>;
    type TwoToOneHash: TwoToOneCRHScheme<Output = Self::InnerDigest>;
}`,
    annotations: [
      { lines: [1, 11], color: "sky", note: "Leaf의 입력 타입과 digest 타입을 먼저 고정합니다." },
      { lines: [13, 16], color: "amber", note: "Leaf digest와 inner hash 입력이 다르면 명시적인 변환기를 거칩니다." },
      { lines: [18, 27], color: "violet", note: "Inner digest는 다음 level의 입력으로 다시 흡수할 수 있어야 합니다." },
      { lines: [29, 30], color: "emerald", note: "Leaf hash와 two-to-one hash는 서로 다른 책임입니다." },
    ],
  },
  "ark-merkle-verify": {
    path: "crypto-primitives/src/merkle_tree/mod.rs — Path::verify",
    lang: "rust",
    highlight: [1, 34],
    desc: "arkworks crypto-primitives commit 7816710. Leaf를 hash하고 index의 낮은 bit부터 좌우를 정해 root까지 올라간 뒤 expected root와 비교합니다.",
    code: `pub fn verify<L: Borrow<P::Leaf>>(
    &self,
    leaf_hash_params: &LeafParam<P>,
    two_to_one_params: &TwoToOneParam<P>,
    root_hash: &P::InnerDigest,
    leaf: L,
) -> Result<bool, crate::Error> {
    let claimed_leaf_hash = P::LeafHash::evaluate(&leaf_hash_params, leaf)?;

    let (left_child, right_child) = select_left_right_child(
        self.leaf_index,
        &claimed_leaf_hash,
        &self.leaf_sibling_hash,
    )?;

    let left_child = P::LeafInnerDigestConverter::convert(left_child)?;
    let right_child = P::LeafInnerDigestConverter::convert(right_child)?;
    let mut curr_path_node = P::TwoToOneHash::evaluate(
        &two_to_one_params,
        left_child,
        right_child,
    )?;

    let mut index = self.leaf_index;
    index >>= 1;
    for level in (0..self.auth_path.len()).rev() {
        let (left, right) = select_left_right_child(
            index,
            &curr_path_node,
            &self.auth_path[level],
        )?;
        curr_path_node = P::TwoToOneHash::compress(&two_to_one_params, &left, &right)?;
        index >>= 1;
    }

    Ok(&curr_path_node == root_hash)
}`,
    annotations: [
      { lines: [8, 8], color: "sky", note: "Raw leaf를 Config가 정한 LeafHash로 바꿉니다." },
      { lines: [10, 14], color: "amber", note: "Leaf index의 현재 bit가 leaf와 sibling의 좌우를 정합니다." },
      { lines: [16, 22], color: "violet", note: "Leaf layer를 inner layer 타입으로 바꾼 뒤 첫 부모를 계산합니다." },
      { lines: [24, 32], color: "sky", note: "Index를 한 bit씩 이동하며 나머지 sibling으로 root까지 올라갑니다." },
      { lines: [34, 34], color: "emerald", note: "마지막 값이 expected root와 정확히 같을 때만 true입니다." },
    ],
  },
  "ark-merkle-order": {
    path: "crypto-primitives/src/merkle_tree/mod.rs — select_left_right_child",
    lang: "rust",
    highlight: [1, 14],
    desc: "arkworks crypto-primitives commit 7816710. Index의 최하위 bit가 0이면 current가 left, 1이면 sibling이 left가 됩니다.",
    code: `fn select_left_right_child<L: Clone>(
    index: usize,
    computed_hash: &L,
    sibling_hash: &L,
) -> Result<(L, L), crate::Error> {
    let is_left = index & 1 == 0;
    let mut left_child = computed_hash;
    let mut right_child = sibling_hash;
    if !is_left {
        core::mem::swap(&mut left_child, &mut right_child);
    }
    Ok((left_child.clone(), right_child.clone()))
}`,
    annotations: [
      { lines: [6, 8], color: "sky", note: "짝수 index는 current를 left에 두는 기본 경로입니다." },
      { lines: [9, 11], color: "amber", note: "홀수 index에서는 두 child를 바꿔 sibling을 left에 둡니다." },
      { lines: [12, 12], color: "emerald", note: "호출자는 이 순서 그대로 two-to-one hash를 계산합니다." },
    ],
  },
  "ark-poseidon-permute": {
    path: "crypto-primitives/src/sponge/poseidon/mod.rs — permute",
    lang: "rust",
    highlight: [1, 25],
    desc: "arkworks crypto-primitives commit 7816710. Poseidon permutation은 full rounds, partial rounds, full rounds 순서로 ARK·S-box·MDS를 적용합니다.",
    code: `fn permute(&mut self) {
    let full_rounds_over_2 = self.parameters.full_rounds / 2;
    let mut state = self.state.clone();

    for i in 0..full_rounds_over_2 {
        self.apply_ark(&mut state, i);
        self.apply_s_box(&mut state, true);
        self.apply_mds(&mut state);
    }

    for i in full_rounds_over_2
        ..(full_rounds_over_2 + self.parameters.partial_rounds)
    {
        self.apply_ark(&mut state, i);
        self.apply_s_box(&mut state, false);
        self.apply_mds(&mut state);
    }

    for i in (full_rounds_over_2 + self.parameters.partial_rounds)
        ..(self.parameters.partial_rounds + self.parameters.full_rounds)
    {
        self.apply_ark(&mut state, i);
        self.apply_s_box(&mut state, true);
        self.apply_mds(&mut state);
    }
    self.state = state;
}`,
    annotations: [
      { lines: [1, 3], color: "sky", note: "Round 수와 state는 고정된 PoseidonConfig에서 옵니다." },
      { lines: [5, 9], color: "emerald", note: "앞쪽 full rounds는 모든 state element에 S-box를 적용합니다." },
      { lines: [11, 17], color: "amber", note: "Partial rounds는 첫 state element에만 S-box를 적용합니다." },
      { lines: [19, 25], color: "violet", note: "뒤쪽 full rounds를 마치고 새 state를 저장합니다." },
    ],
  },
};
