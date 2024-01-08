import React from "react";
import Input from "./Input";
import MainLayout from "./MainLayout";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

function ProductForm({
  _id,
  title: existingTitle,
  description: existingDescription,
  price: existingPrice,
  images,
}) {
  const [title, setTitle] = useState(existingTitle);
  const [description, setDescription] = useState(existingDescription);
  const [price, setPrice] = useState(existingPrice);
  const [shouldGoToProducts, setShouldGoToProducts] = useState(false);
  const router = useRouter();
  async function saveProduct(ev) {
    ev.preventDefault();
    const data = { title, description, price };
    if (_id) {
      await axios.put("/api/products", { _id, ...data });
    } else {
      await axios.post("/api/products", data);
    }
    setShouldGoToProducts(true);
  }

  async function uploadImages(ev) {
    const files = ev.target.files;
    if (files?.length > 0) {
      const data = new FormData();
      for (const file of files) {
        data.append("file", file);
      }
      const res = await axios.post("/api/upload/", data);
      console.log(res);
    }
  }

  if (shouldGoToProducts) {
    router.push("/products");
  }

  return (
    <>
      <form onSubmit={saveProduct}>
        <Input
          type="text"
          placeholder="product name"
          labelText="Product name"
          value={title}
          onChange={(ev) => setTitle(ev.target.value)}
        />
        <label>Photos</label>
        <div className="mb-2">
          <label className="w-24 h-24 items-center text-sm flex gap-1 text-gray-500 rounded-lg bg-gray-200 justify-center cursor-pointer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
              />
            </svg>
            Upload
            <input type="file" className=" hidden" onChange={uploadImages} />
          </label>
          {!images?.length && <div>No photos found</div>}
        </div>
        <Input
          type="textarea"
          placeholder="description"
          labelText="Description"
          value={description}
          onChange={(ev) => setDescription(ev.target.value)}
        />
        <Input
          type="number"
          placeholder="price"
          labelText="Price (in INR)"
          value={price}
          onChange={(ev) => setPrice(ev.target.value)}
        />
        <button className="bg-blue-900 text-white px-4 py-1 rounded-md">
          Save
        </button>
      </form>
    </>
  );
}

export default ProductForm;
