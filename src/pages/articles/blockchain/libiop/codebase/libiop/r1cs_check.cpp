template<typename FieldT>
bool r1cs_constraint_system<FieldT>::is_satisfied(const r1cs_primary_input<FieldT> &primary_input,
                                                  const r1cs_auxiliary_input<FieldT> &auxiliary_input) const
{
    assert(primary_input.size() == num_inputs());
    assert(primary_input.size() + auxiliary_input.size() == num_variables());

    const r1cs_variable_assignment<FieldT> full_variable_assignment =
        variable_assignment_from_inputs(primary_input, auxiliary_input);
    return this->is_satisfied(full_variable_assignment);
}

template<typename FieldT>
bool r1cs_constraint_system<FieldT>::is_satisfied(const r1cs_variable_assignment<FieldT> &full_variable_assignment) const
{
    for (size_t c = 0; c < constraints_.size(); ++c)
    {
        const FieldT ares = constraints_[c].a_.evaluate(full_variable_assignment);
        const FieldT bres = constraints_[c].b_.evaluate(full_variable_assignment);
        const FieldT cres = constraints_[c].c_.evaluate(full_variable_assignment);

        if (!(ares*bres == cres))
        {
#ifdef DEBUG
            auto it = constraint_annotations_.find(c);
            printf("constraint %zu (%s) unsatisfied\n", c, (it == constraint_annotations_.end() ? "no annotation" : it->second.c_str()));
            printf("<a,(1,x)> = "); ares.print();
            printf("<b,(1,x)> = "); bres.print();
            printf("<c,(1,x)> = "); cres.print();
            printf("constraint was:\n");
            dump_r1cs_constraint(constraints_[c], full_variable_assignment, variable_annotations_);
#endif // DEBUG
            return false;
        }
    }

    return true;
}
