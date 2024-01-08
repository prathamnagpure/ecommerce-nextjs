"use client";
import MainLayout from "@/app/components/MainLayout";
import ProductForm from "@/app/components/ProductForm";

function NewProduct() {
  return (
    <MainLayout>
      <h1 className="text-blue-900 mb-2 text-xl">New Product</h1>
      <ProductForm />
    </MainLayout>
  );
}

export default NewProduct;
