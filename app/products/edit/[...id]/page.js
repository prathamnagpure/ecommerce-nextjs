"use client";
import { usePathname } from "next/navigation";
import { useState } from "react";
import React, { useEffect } from "react";
import MainLayout from "@/app/components/MainLayout";
import axios from "axios";
import ProductForm from "@/app/components/ProductForm";

function EditProduct() {
  const [productInfo, setProductInfo] = useState(null);
  const pathname = usePathname();
  const id = pathname.substring(pathname.lastIndexOf("/") + 1);
  useEffect(() => {
    axios
      .get("/api/products?id=" + id)
      .then((response) => setProductInfo(response.data));
  }, [id]);
  return (
    <MainLayout>
      <h1 className="text-blue-900 mb-2 text-xl">Edit Product</h1>
      {productInfo ? <ProductForm {...productInfo} /> : null}
    </MainLayout>
  );
}

export default EditProduct;
