        // 4. Tally results
        let sum_result_columns_iter = sum_result_columns.iter().map(|col| Column::Scalar(col));
        let columns = group_by_result_columns
            .clone()
            .into_iter()
            .chain(sum_result_columns_iter.clone())
            .chain(iter::once(Column::BigInt(count_column)));
        let res = Table::<'a, S>::try_from_iter(
            self.get_column_result_fields()
                .into_iter()
                .map(|field| field.name())
                .zip(columns.clone()),
        )
        .expect("Failed to create table from column references");
        // 5. Prove group by

        let sum_out_fold = alloc.alloc_slice_fill_default(m);
        slice_ops::slice_cast_mut(count_column, sum_out_fold);
        fold_columns(sum_out_fold, beta, beta, &sum_result_columns);

        builder.produce_sumcheck_subpolynomial(
            SumcheckSubpolynomialType::ZeroSum,
            vec![
                (
                    S::one(),
                    vec![
                        Box::new(g_in_star as &[_]),
                        Box::new(selection),
                        Box::new(sum_in_fold as &[_]),
                    ],
                ),
                (
                    -S::one(),
                    vec![Box::new(g_out_star as &[_]), Box::new(sum_out_fold as &[_])],
                ),
            ],
        );
