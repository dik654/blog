/// `select sum(c) as sum_c, count(*) as __count__ from sxt.t where b = 99`
#[test]
fn we_can_prove_aggregation_without_group_by() {
    let data = owned_table([
        bigint("a", [1, 2, 2, 1, 2]),
        bigint("b", [99, 99, 99, 99, 0]),
        bigint("c", [101, 102, 103, 104, 105]),
    ]);
    let t = TableRef::new("sxt", "t");
    let mut accessor = OwnedTableTestAccessor::<InnerProductProof>::new_empty_with_setup(());
    accessor.add_table(t.clone(), data, 0);
    let expr = aggregate(
        vec![],
        vec![sum_expr(column(&t, "c", &accessor), "sum_c")],
        "__count__",
        table_exec(
            t.clone(),
            vec![
                ColumnField::new("a".into(), ColumnType::BigInt),
                ColumnField::new("b".into(), ColumnType::BigInt),
                ColumnField::new("c".into(), ColumnType::BigInt),
            ],
        ),
        equal(column(&t, "b", &accessor), const_int128(99)),
    );
    let res = VerifiableQueryResult::new(&expr, &accessor, &(), &[]).unwrap();
    exercise_verification(&res, &expr, &accessor, &t);
    let res = res.verify(&expr, &accessor, &(), &[]).unwrap().table;
    let expected = owned_table([
        bigint("sum_c", [101 + 104 + 102 + 103]),
        bigint("__count__", [4]),
    ]);
    assert_eq!(res, expected);
}
