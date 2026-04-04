//! Traits and structs for implementing circuit components.

use std::{fmt, marker::PhantomData};

use ff::Field;

use crate::plonk::{Advice, Any, Assigned, Column, Error, Fixed, Instance, Selector, TableColumn};

mod value;
pub use value::Value;

pub mod floor_planner;
pub use floor_planner::single_pass::SimpleFloorPlanner;

pub mod layouter;

mod table_layouter;
pub use table_layouter::TableLayouter;

/// A chip implements a set of instructions that can be used by gadgets.
pub trait Chip<F: Field>: Sized {
    type Config: fmt::Debug + Clone;
    type Loaded: fmt::Debug + Clone;

    fn config(&self) -> &Self::Config;
    fn loaded(&self) -> &Self::Loaded;
}

/// A pointer to a cell within a circuit.
#[derive(Clone, Copy, Debug)]
pub struct Cell {
    region_index: RegionIndex,
    row_offset: usize,
    column: Column<Any>,
}

/// An assigned cell.
#[derive(Clone, Debug)]
pub struct AssignedCell<V, F: Field> {
    value: Value<V>,
    cell: Cell,
    _marker: PhantomData<F>,
}

impl<V, F: Field> AssignedCell<V, F> {
    pub fn value(&self) -> Value<&V> {
        self.value.as_ref()
    }

    pub fn cell(&self) -> Cell {
        self.cell
    }
}

/// A region of the circuit in which a Chip can assign cells.
#[derive(Debug)]
pub struct Region<'r, F: Field> {
    region: &'r mut dyn layouter::RegionLayouter<F>,
}

impl<'r, F: Field> Region<'r, F> {
    pub fn assign_advice<'v, V, VR, A, AR>(
        &'v mut self,
        annotation: A,
        column: Column<Advice>,
        offset: usize,
        mut to: V,
    ) -> Result<AssignedCell<VR, F>, Error>
    where
        V: FnMut() -> Value<VR> + 'v,
        for<'vr> Assigned<F>: From<&'vr VR>,
        A: Fn() -> AR,
        AR: Into<String>,
    {
        let mut value = Value::unknown();
        let cell = self.region.assign_advice(
            &|| annotation().into(), column, offset,
            &mut || { let v = to(); let value_f = v.to_field(); value = v; value_f },
        )?;
        Ok(AssignedCell { value, cell, _marker: PhantomData })
    }

    pub fn assign_fixed<'v, V, VR, A, AR>(
        &'v mut self,
        annotation: A,
        column: Column<Fixed>,
        offset: usize,
        mut to: V,
    ) -> Result<AssignedCell<VR, F>, Error>
    where
        V: FnMut() -> Value<VR> + 'v,
        for<'vr> Assigned<F>: From<&'vr VR>,
        A: Fn() -> AR,
        AR: Into<String>,
    {
        let mut value = Value::unknown();
        let cell = self.region.assign_fixed(
            &|| annotation().into(), column, offset,
            &mut || { let v = to(); let value_f = v.to_field(); value = v; value_f },
        )?;
        Ok(AssignedCell { value, cell, _marker: PhantomData })
    }

    pub fn constrain_equal(&mut self, left: Cell, right: Cell) -> Result<(), Error> {
        self.region.constrain_equal(left, right)
    }
}

/// A layout strategy within a circuit.
pub trait Layouter<F: Field> {
    type Root: Layouter<F>;

    fn assign_region<A, AR, N, NR>(&mut self, name: N, assignment: A) -> Result<AR, Error>
    where
        A: FnMut(Region<'_, F>) -> Result<AR, Error>,
        N: Fn() -> NR,
        NR: Into<String>;

    fn assign_table<A, N, NR>(&mut self, name: N, assignment: A) -> Result<(), Error>
    where
        A: FnMut(Table<'_, F>) -> Result<(), Error>,
        N: Fn() -> NR,
        NR: Into<String>;

    fn constrain_instance(
        &mut self, cell: Cell, column: Column<Instance>, row: usize,
    ) -> Result<(), Error>;

    fn get_root(&mut self) -> &mut Self::Root;
}
