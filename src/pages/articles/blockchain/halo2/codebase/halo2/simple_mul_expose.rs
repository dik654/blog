fn mul(
    &self,
    mut layouter: impl Layouter<F>,
    a: Self::Num,
    b: Self::Num,
) -> Result<Self::Num, Error> {
    let config = self.config();

    layouter.assign_region(
        || "mul",
        |mut region: Region<'_, F>| {
            // We only want to use a single multiplication gate in this region,
            // so we enable it at region offset 0; this means it will constrain
            // cells at offsets 0 and 1.
            config.s_mul.enable(&mut region, 0)?;

            // The inputs we've been given could be located anywhere in the circuit,
            // but we can only rely on relative offsets inside this region. So we
            // assign new cells inside the region and constrain them to have the
            // same values as the inputs.
            a.0.copy_advice(|| "lhs", &mut region, config.advice[0], 0)?;
            b.0.copy_advice(|| "rhs", &mut region, config.advice[1], 0)?;

            // Now we can assign the multiplication result, which is to be assigned
            // into the output position.
            let value = a.0.value().copied() * b.0.value();

            // Finally, we do the assignment to the output, returning a
            // variable to be used in another part of the circuit.
            region
                .assign_advice(|| "lhs * rhs", config.advice[0], 1, || value)
                .map(Number)
        },
    )
}

fn expose_public(
    &self,
    mut layouter: impl Layouter<F>,
    num: Self::Num,
    row: usize,
) -> Result<(), Error> {
    let config = self.config();

    layouter.constrain_instance(num.0.cell(), config.instance, row)
}
