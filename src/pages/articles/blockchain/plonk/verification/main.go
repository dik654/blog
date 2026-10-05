package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"os"
	"runtime"

	"github.com/consensys/gnark-crypto/ecc"
	curve "github.com/consensys/gnark-crypto/ecc/bn254"
	"github.com/consensys/gnark-crypto/ecc/bn254/fr"
	"github.com/consensys/gnark-crypto/ecc/bn254/fr/fft"
	"github.com/consensys/gnark-crypto/ecc/bn254/fr/iop"
	"github.com/consensys/gnark-crypto/ecc/bn254/kzg"
	"github.com/consensys/gnark/backend"
	plonk "github.com/consensys/gnark/backend/plonk/bn254"
	cs "github.com/consensys/gnark/constraint/bn254"
	"github.com/consensys/gnark/frontend"
	"github.com/consensys/gnark/frontend/cs/scs"
	"github.com/consensys/gnark/logger"
	"github.com/consensys/gnark/test/unsafekzg"
)

type Circuit struct {
	X frontend.Variable `gnark:",public"`
	Y frontend.Variable `gnark:",public"`
	W frontend.Variable
}

func (c *Circuit) Define(api frontend.API) error {
	v := api.Mul(c.X, c.W)
	y := api.Add(v, c.X)
	api.AssertIsEqual(y, c.Y)
	return nil
}

// Deliberately different relation: V is not constrained to X*W.
type MissingCopyCircuit struct {
	X frontend.Variable `gnark:",public"`
	Y frontend.Variable `gnark:",public"`
	W frontend.Variable
	V frontend.Variable
}

func (c *MissingCopyCircuit) Define(api frontend.API) error {
	api.AssertIsEqual(api.Mul(c.X, c.W), 12)
	api.AssertIsEqual(api.Add(c.V, c.X), c.Y)
	return nil
}

func must(err error) {
	if err != nil {
		panic(err)
	}
}
func vector(v ...int64) fr.Vector {
	r := make(fr.Vector, len(v))
	for i, x := range v {
		r[i].SetInt64(x)
	}
	return r
}
func strings(v []fr.Element) []string {
	r := make([]string, len(v))
	for i := range v {
		r[i] = v[i].String()
	}
	return r
}
func errText(e error) string {
	if e == nil {
		return "accepted"
	}
	return e.Error()
}
func proofBytes(p *plonk.Proof) []byte {
	var b bytes.Buffer
	_, e := p.WriteTo(&b)
	must(e)
	return b.Bytes()
}
func clone(p *plonk.Proof) *plonk.Proof {
	q := new(plonk.Proof)
	_, e := q.ReadFrom(bytes.NewReader(proofBytes(p)))
	must(e)
	return q
}
func main() {
	logger.Disable()
	c, e := frontend.Compile(ecc.BN254.ScalarField(), scs.NewBuilder, &Circuit{})
	must(e)
	spr := c.(*cs.SparseR1CS)
	full, e := frontend.NewWitness(&Circuit{X: 3, Y: 15, W: 4}, ecc.BN254.ScalarField())
	must(e)
	solved, e := spr.Solve(full)
	must(e)
	s := solved.(*cs.SparseR1CSSolution)
	s0, s1, e := unsafekzg.NewSRS(c)
	must(e)
	pk, vk, e := plonk.Setup(spr, *s0.(*kzg.SRS), *s1.(*kzg.SRS))
	must(e)
	p, e := plonk.Prove(spr, pk, full)
	must(e)
	p2, e := plonk.Prove(spr, pk, full)
	must(e)
	pStat, e := plonk.Prove(spr, pk, full, backend.WithStatisticalZeroKnowledge())
	must(e)
	configDefault, e := backend.NewProverConfig()
	must(e)
	configStat, e := backend.NewProverConfig(backend.WithStatisticalZeroKnowledge())
	must(e)
	tr := plonk.NewTrace(spr, fft.NewDomain(vk.Size))
	out := map[string]any{"go": runtime.Version(), "constraints": spr.GetNbConstraints(), "public": spr.Public, "secret": spr.Secret, "internal": spr.NbInternalVariables, "domain_size": vk.Size, "permutation": tr.S, "L": strings(s.L), "R": strings(s.R), "O": strings(s.O), "proof_bytes": len(proofBytes(p)), "proof2_different": !bytes.Equal(proofBytes(p), proofBytes(p2)), "proof_claims": len(p.BatchedProof.ClaimedValues), "extra_commitments": len(p.Bsb22Commitments), "same": errText(plonk.Verify(p, vk, vector(3, 15))), "wrong_y": errText(plonk.Verify(p, vk, vector(3, 14))), "swapped": errText(plonk.Verify(p, vk, vector(15, 3))), "short": errText(plonk.Verify(p, vk, vector(3))), "long": errText(plonk.Verify(p, vk, vector(3, 15, 999)))}
	out["default_statistical_zk"] = configDefault.StatisticalZK
	out["explicit_statistical_zk"] = configStat.StatisticalZK
	out["statistical_proof"] = errText(plonk.Verify(pStat, vk, vector(3, 15)))
	out["statistical_proof_bytes"] = len(proofBytes(pStat))
	domain := fft.NewDomain(vk.Size)
	out["domain_generator"] = domain.Generator.String()
	out["coset_shift"] = vk.CosetShift.String()
	out["selectors"] = map[string]any{"ql": strings(tr.Ql.Coefficients()), "qr": strings(tr.Qr.Coefficients()), "qm": strings(tr.Qm.Coefficients()), "qo": strings(tr.Qo.Coefficients()), "qk_without_public": strings(tr.Qk.Coefficients())}
	form := iop.Form{Basis: iop.Lagrange, Layout: iop.Regular}
	entries := []*iop.Polynomial{}
	for _, col := range []fr.Vector{s.L, s.R, s.O} {
		a := append([]fr.Element(nil), col...)
		entries = append(entries, iop.NewPolynomial(&a, form))
	}
	beta := new(fr.Element).SetUint64(2)
	gamma := new(fr.Element).SetUint64(7)
	z, e := iop.BuildRatioCopyConstraint(entries, tr.S, *beta, *gamma, form, domain)
	must(e)
	out["fixed_beta2_gamma7_Z"] = strings(z.Coefficients())
	rows := []map[string]any{}
	it := spr.GetSparseR1CIterator()
	for a := it.Next(); a != nil; a = it.Next() {
		rows = append(rows, map[string]any{"xa": a.XA, "xb": a.XB, "xc": a.XC, "ql": spr.Coefficients[a.QL].String(), "qr": spr.Coefficients[a.QR].String(), "qm": spr.Coefficients[a.QM].String(), "qo": spr.Coefficients[a.QO].String(), "qc": spr.Coefficients[a.QC].String()})
	}
	out["constraint_rows"] = rows
	bad, e := frontend.NewWitness(&Circuit{X: 3, Y: 15, W: 5}, ecc.BN254.ScalarField())
	must(e)
	_, e = plonk.Prove(spr, pk, bad)
	out["bad_witness"] = errText(e)
	q := clone(p)
	q.BatchedProof.ClaimedValues = q.BatchedProof.ClaimedValues[:5]
	out["short_claims"] = errText(plonk.Verify(q, vk, vector(3, 15)))
	q = clone(p)
	q.Bsb22Commitments = append(q.Bsb22Commitments, curve.G1Affine{})
	out["extra_commitment"] = errText(plonk.Verify(q, vk, vector(3, 15)))
	q = clone(p)
	q.LRO[0].X.SetOne()
	q.LRO[0].Y.SetOne()
	out["off_curve"] = errText(plonk.Verify(q, vk, vector(3, 15)))
	q = clone(p)
	q.BatchedProof.ClaimedValues[1].Add(&q.BatchedProof.ClaimedValues[1], new(fr.Element).SetOne())
	out["changed_evaluation"] = errText(plonk.Verify(q, vk, vector(3, 15)))
	r := bytes.NewReader(append(proofBytes(p), byte(7)))
	q = new(plonk.Proof)
	_, e = q.ReadFrom(r)
	out["trailing_parse"] = errText(e)
	out["trailing_remaining"] = r.Len()
	out["roundtrip"] = errText(plonk.Verify(clone(p), vk, vector(3, 15)))
	wrongCircuit, e := frontend.Compile(ecc.BN254.ScalarField(), scs.NewBuilder, &MissingCopyCircuit{})
	must(e)
	wrongFull, e := frontend.NewWitness(&MissingCopyCircuit{X: 3, Y: 14, W: 4, V: 11}, ecc.BN254.ScalarField())
	must(e)
	wrongS0, wrongS1, e := unsafekzg.NewSRS(wrongCircuit)
	must(e)
	wrongPK, wrongVK, e := plonk.Setup(wrongCircuit.(*cs.SparseR1CS), *wrongS0.(*kzg.SRS), *wrongS1.(*kzg.SRS))
	must(e)
	wrongProof, e := plonk.Prove(wrongCircuit.(*cs.SparseR1CS), wrongPK, wrongFull, backend.WithStatisticalZeroKnowledge())
	must(e)
	out["missing_copy_separate_relation"] = errText(plonk.Verify(wrongProof, wrongVK, vector(3, 14)))
	out["missing_copy_original_key"] = errText(plonk.Verify(wrongProof, vk, vector(3, 14)))
	enc := json.NewEncoder(os.Stdout)
	enc.SetIndent("", "  ")
	must(enc.Encode(out))
	fmt.Fprintln(os.Stderr, "local CPU verification finished; unsafe local SRS, no ceremony or security audit")
}
