import type { CodeRef } from "@/components/code/types";
import r1csCheck from "./codebase/libiop/r1cs_check.cpp?raw";
import oracleRegistration from "./codebase/libiop/oracle_registration.cpp?raw";
import oracleSubmission from "./codebase/libiop/oracle_submission.cpp?raw";
import bcsRound from "./codebase/libiop/bcs_round.cpp?raw";
import bcsHashchain from "./codebase/libiop/bcs_hashchain.cpp?raw";
import bcsVerify from "./codebase/libiop/bcs_verify.cpp?raw";
import auroraPipeline from "./codebase/libiop/aurora_pipeline.cpp?raw";
import bcsTest from "./codebase/libiop/bcs_test.cpp?raw";

export const codeRefs: Record<string, CodeRef> = {
  "r1cs-check": {
    path: "libiop/relations/r1cs.tcc:111–148",
    code: r1csCheck.trimEnd(),
    lang: "c",
    highlight: [14, 38],
    desc: "scipr-lab/libiop @ a2ed2ec · 각 R1CS row의 세 선형식을 평가하고 ares·bres=cres인지 직접 확인하는 원문",
    annotations: [
      {
        lines: [1, 11],
        color: "sky",
        note: "Public input과 private auxiliary input을 한 variable assignment로 합칩니다.",
      },
      {
        lines: [14, 22],
        color: "amber",
        note: "각 row에서 A·z, B·z, C·z에 해당하는 세 값을 계산합니다.",
      },
      {
        lines: [23, 38],
        color: "rose",
        note: "곱이 셋째 값과 다르면 즉시 false를 반환합니다.",
      },
    ],
  },
  "oracle-registration": {
    path: "libiop/protocols/encoded/r1cs_rs_iop/r1cs_rs_iop.tcc:297–327",
    code: oracleRegistration.trimEnd(),
    lang: "c",
    highlight: [1, 31],
    desc: "scipr-lab/libiop @ a2ed2ec · Aurora reduction이 witness와 Az·Bz·Cz oracle 및 degree bound를 등록하는 원문",
    annotations: [
      {
        lines: [3, 6],
        color: "sky",
        note: "주석이 첫 round의 핵심 oracle과 lincheck·rowcheck 역할을 직접 열거합니다.",
      },
      {
        lines: [13, 20],
        color: "amber",
        note: "Witness oracle과 세 행렬 결과 oracle은 서로 다른 degree bound로 등록됩니다.",
      },
      {
        lines: [22, 31],
        color: "emerald",
        note: "Public input이 섞인 z는 fw에서 파생되는 virtual oracle로 구성됩니다.",
      },
    ],
  },
  "oracle-submission": {
    path: "libiop/protocols/encoded/r1cs_rs_iop/r1cs_rs_iop.tcc:572–606",
    code: oracleSubmission.trimEnd(),
    lang: "c",
    highlight: [1, 35],
    desc: "scipr-lab/libiop @ a2ed2ec · z를 만들고 Az·Bz·Cz를 계산해 low-degree extension한 뒤 네 oracle을 제출하는 원문",
    annotations: [
      {
        lines: [1, 6],
        color: "sky",
        note: "원문 주석이 계산→LDE→mask→codeword domain 평가 순서를 명시합니다.",
      },
      {
        lines: [9, 22],
        color: "amber",
        note: "상수 1, public input, auxiliary input을 잇고 실제 Az·Bz·Cz를 계산합니다.",
      },
      {
        lines: [26, 35],
        color: "emerald",
        note: "확장된 네 표가 IOP oracle로 제출됩니다.",
      },
    ],
  },
  "bcs-round": {
    path: "libiop/bcs/bcs_prover.tcc:24–59",
    code: bcsRound.trimEnd(),
    lang: "c",
    highlight: [9, 27],
    desc: "scipr-lab/libiop @ a2ed2ec · round oracle들을 Merkle tree로 압축하고 root를 hashchain에 넣는 prover 원문",
    annotations: [
      {
        lines: [9, 26],
        color: "sky",
        note: "Round의 oracle contents를 모아 Merkle tree를 먼저 만듭니다.",
      },
      {
        lines: [27, 27],
        color: "amber",
        note: "그 다음 run_hashchain_for_round가 root와 메시지를 transcript state에 넣습니다.",
      },
      {
        lines: [31, 36],
        color: "violet",
        note: "마지막 round에는 query grinding 비용을 높이는 proof of work 변형도 적용합니다.",
      },
    ],
  },
  "bcs-hashchain": {
    path: "libiop/bcs/bcs_common.tcc:551–565",
    code: bcsHashchain.trimEnd(),
    lang: "c",
    highlight: [7, 15],
    desc: "scipr-lab/libiop @ a2ed2ec · root와 prover message를 흡수한 뒤 verifier randomness를 squeeze하는 정확한 순서",
    annotations: [
      {
        lines: [7, 10],
        color: "sky",
        note: "모든 round Merkle root가 먼저 hashchain에 들어갑니다.",
      },
      {
        lines: [12, 15],
        color: "emerald",
        note: "명시적 prover message까지 넣은 뒤에야 verifier random message를 만듭니다.",
      },
    ],
  },
  "bcs-verify": {
    path: "libiop/bcs/bcs_verifier.tcc:61–100",
    code: bcsVerify.trimEnd(),
    lang: "c",
    highlight: [1, 40],
    desc: "scipr-lab/libiop @ a2ed2ec · verifier가 같은 hashchain을 재생하고 Merkle multiproof와 proof of work를 검증하는 원문",
    annotations: [
      {
        lines: [1, 6],
        color: "sky",
        note: "Transcript의 root와 prover message로 같은 random state를 재생합니다.",
      },
      {
        lines: [8, 28],
        color: "emerald",
        note: "Query response를 leaf로 되살린 뒤 root에 대한 set-membership proof를 확인합니다.",
      },
      {
        lines: [34, 40],
        color: "rose",
        note: "마지막 proof of work까지 실패하면 transcript 전체를 invalid로 표시합니다.",
      },
    ],
  },
  "aurora-pipeline": {
    path: "libiop/snark/aurora_snark.tcc:120–179",
    code: auroraPipeline.trimEnd(),
    lang: "c",
    highlight: [9, 59],
    desc: "scipr-lab/libiop @ a2ed2ec · Aurora IOP를 BCS prover/verifier로 감싸고 두 검사의 AND를 최종 결과로 반환하는 원문",
    annotations: [
      {
        lines: [9, 26],
        color: "sky",
        note: "Prover는 interactions·queries를 등록하고 proof를 만든 뒤 BCS transcript를 반환합니다.",
      },
      {
        lines: [37, 48],
        color: "amber",
        note: "Verifier도 같은 protocol shape를 등록해 transcript 해석 순서를 재현합니다.",
      },
      {
        lines: [50, 59],
        color: "emerald",
        note: "Merkle·순서 유효성과 Aurora 관계 predicate 둘 다 true여야 accept합니다.",
      },
    ],
  },
  "bcs-test": {
    path: "libiop/tests/bcs/test_bcs_transformation.cpp:201–219",
    code: bcsTest.trimEnd(),
    lang: "c",
    highlight: [5, 19],
    desc: "scipr-lab/libiop @ a2ed2ec · 64-position oracle에서 0·1·2·3을 열고 proof byte 수와 ZK salt 증가를 확인하는 공식 test 원문",
    annotations: [
      {
        lines: [5, 10],
        color: "sky",
        note: "dim=6이므로 domain은 64칸이고 query는 앞의 네 위치입니다.",
      },
      {
        lines: [13, 15],
        color: "amber",
        note: "Non-ZK expected size는 5개 hash와 네 field value의 바이트 합입니다.",
      },
      {
        lines: [17, 19],
        color: "violet",
        note: "ZK 모드에서는 열린 각 leaf의 salt 비용을 추가합니다.",
      },
    ],
  },
};
