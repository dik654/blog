import type { CodeRef } from "@/components/code/types";

export const officialCurveCodeRefs: Record<string, CodeRef> = {
  "ark-point-admission": {
    path: "ark-ec/short_weierstrass/mod.rs — deserialize_with_mode",
    lang: "rust",
    highlight: [1, 25],
    desc: "arkworks algebra commit 6a28df5. 압축 x와 표식에서 y를 복원하고 Validate::Yes일 때 point.check()를 호출합니다.",
    code: `let (x, y, flags) = match compress {
    Compress::Yes => {
        let (x, flags): (_, SWFlags) =
            CanonicalDeserializeWithFlags::deserialize_with_flags(reader)?;
        match flags {
            SWFlags::PointAtInfinity => (
                Affine::<Self>::identity().x,
                Affine::<Self>::identity().y,
                flags,
            ),
            _ => {
                let is_positive = flags.is_positive().unwrap();
                let (y, neg_y) = Affine::<Self>::get_ys_from_x_unchecked(x)
                    .ok_or(SerializationError::InvalidData)?;
                if is_positive { (x, y, flags) }
                else { (x, neg_y, flags) }
            },
        }
    },
    Compress::No => { /* x와 y를 모두 읽음 */ }
};
let point = Affine::new_unchecked(x, y);
if validate == Validate::Yes { point.check()?; }
Ok(point)`,
    annotations: [
      { lines: [1, 4], color: "sky", note: "압축 좌표와 표식을 먼저 분리합니다." },
      { lines: [11, 17], color: "amber", note: "x에서 두 y 후보를 복원하고 표식에 맞는 하나를 고릅니다." },
      { lines: [22, 24], color: "emerald", note: "unchecked 생성 뒤 Validate::Yes 경계에서 곡선·부분군 검사를 실행합니다." },
    ],
  },
  "ark-point-validity": {
    path: "ark-ec/short_weierstrass/affine.rs — Valid::check",
    lang: "rust",
    highlight: [1, 8],
    desc: "arkworks algebra commit 6a28df5. 곡선식과 올바른 부분군을 모두 통과해야 유효한 Affine point입니다.",
    code: `impl<P: SWCurveConfig> Valid for Affine<P> {
    fn check(&self) -> Result<(), SerializationError> {
        if self.is_on_curve()
            && self.is_in_correct_subgroup_assuming_on_curve()
        {
            Ok(())
        } else {
            Err(SerializationError::InvalidData)
        }
    }
}`,
    annotations: [
      { lines: [2, 5], color: "emerald", note: "방정식과 부분군은 서로 다른 두 승인 조건입니다." },
      { lines: [6, 8], color: "rose", note: "하나라도 실패하면 typed point 대신 InvalidData를 반환합니다." },
    ],
  },
  "ark-projective-double": {
    path: "ark-ec/short_weierstrass/group.rs — double_in_place",
    lang: "rust",
    highlight: [1, 22],
    desc: "arkworks algebra commit 6a28df5. Jacobian 좌표에서 역원 없이 double을 누적하는 일반 경로입니다.",
    code: `let xx = self.x.square();
let yy = self.y.square();
let mut yyyy = yy;
yyyy.square_in_place();
let mut zz = self.z;
zz.square_in_place();

let s = ((self.x + &yy).square() - &xx - &yyyy).double();
let mut m = xx;
m.double_in_place();
m += &xx;
m += &P::mul_by_a(zz.square());

self.x = m.square() - s.double();
self.z *= self.y;
self.z.double_in_place();
self.y = s - &self.x;
self.y *= &m;
self.y -= yyyy.double_in_place()
    .double_in_place()
    .double_in_place();`,
    annotations: [
      { lines: [1, 12], color: "sky", note: "X·Y·Z와 제곱값을 유지해 affine 기울기의 역원 계산을 피합니다." },
      { lines: [14, 22], color: "violet", note: "새 X·Z·Y를 같은 projective scale로 갱신합니다." },
    ],
  },
  "ark-bn254-config": {
    path: "ark-bn254/src/curves/mod.rs — BnConfig",
    lang: "rust",
    highlight: [1, 17],
    desc: "arkworks curves commit e2d16a2. BN254 pairing loop, twist와 G1/G2 config를 하나의 engine에 연결합니다.",
    code: `impl BnConfig for Config {
    const X: &'static [u64] = &[4965661367192848881];
    const X_IS_NEGATIVE: bool = false;
    const ATE_LOOP_COUNT: &'static [i8] = &[/* pinned digits */];

    const TWIST_MUL_BY_Q_X: Fq2 = Fq2::new(/* pinned constants */);
    const TWIST_MUL_BY_Q_Y: Fq2 = Fq2::new(/* pinned constants */);
    const TWIST_TYPE: TwistType = TwistType::D;

    type Fp = Fq;
    type Fp2Config = Fq2Config;
    type Fp6Config = Fq6Config;
    type Fp12Config = Fq12Config;
    type G1Config = g1::Config;
    type G2Config = g2::Config;
}

pub type Bn254 = Bn<Config>;`,
    annotations: [
      { lines: [1, 8], color: "amber", note: "Miller loop와 twist가 BN254 pairing profile에 고정됩니다." },
      { lines: [10, 15], color: "violet", note: "extension fields와 G1/G2가 같은 config에서 연결됩니다." },
      { lines: [17, 17], color: "emerald", note: "소비자는 이 config가 결합된 Bn254 타입을 사용합니다." },
    ],
  },
};
