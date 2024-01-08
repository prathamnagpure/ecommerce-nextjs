"use client";
import MainLayout from "@/app/components/MainLayout";
import React from "react";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import axios from "axios";

function DeleteProduct() {
  const [productInfo, setProductInfo] = useState(null);
  const pathname = usePathname();
  const router = useRouter();
  const id = pathname.substring(pathname.lastIndexOf("/") + 1);
  useEffect(() => {
    axios
      .get("/api/products?id=" + id)
      .then((response) => setProductInfo(response.data));
  }, [id]);

  async function deleteProduct() {
    await axios.delete("/api/products?id=" + id);
    goBack();
  }

  function goBack() {
    router.push("/products");
  }

  return (
    <MainLayout>
      <h1 className="text-center text-blue-900 mb-2 text-xl">
        Do you really want to delete{" "}
        <strong>{productInfo && productInfo.title}</strong>?
      </h1>
      <div className="flex gap-2 justify-center">
        <button
          onClick={deleteProduct}
          className=" bg-red-600 text-white px-4 py-1 rounded-md"
        >
          Yes
        </button>
        <button
          className=" bg-gray-500 text-white px-4 py-1 rounded-md"
          onClick={goBack}
        >
          No
        </button>
      </div>
    </MainLayout>
  );
}

export default DeleteProduct;
