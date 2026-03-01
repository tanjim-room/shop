import React from 'react';
import AddProductForm from '../components/admin/AddProductForm';

const AddProduct = () => {
    return (
        <section className='space-y-4 text-slate-800'>
            <h2 className='text-2xl font-bold text-brand-ink'>Add Product</h2>
            <AddProductForm></AddProductForm>
        </section>
    );
};

export default AddProduct;