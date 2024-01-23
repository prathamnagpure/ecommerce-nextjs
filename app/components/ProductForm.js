import React, { useEffect } from "react";
import Input from "./Input";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Spinner from "./Spinner";
import { ReactSortable, Sortable } from "react-sortablejs";
import BasicLabel from "./BasicLabel";
import BasicButton from "./BasicButton";

function ProductForm({
  _id,
  title: existingTitle,
  description: existingDescription,
  price: existingPrice,
  images: existingImages,
  category: existingCategory,
  properties: existingProperties,
}) {
  const [title, setTitle] = useState(existingTitle);
  const [description, setDescription] = useState(existingDescription);
  const [price, setPrice] = useState(existingPrice);
  const [images, setImages] = useState(existingImages || []);
  const [shouldGoToProducts, setShouldGoToProducts] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [category, setCategory] = useState(existingCategory);
  const [categories, setCategories] = useState([]);
  const [imagesData, setImagesData] = useState([]);
  const [productProperties, setProductProperties] = useState(
    existingProperties || {}
  );
  const router = useRouter();
  useEffect(() => {
    axios.get("/api/categories").then((result) => setCategories(result.data));
    const newImagesData = [];
    for (const image of images) {
      axios.get("/api/upload?id=" + image).then((result) => {
        newImagesData.push(result.data);
      });
    }
    setImagesData(newImagesData);
  }, [images]);

  async function saveProduct(ev) {
    ev.preventDefault();
    const data = {
      title,
      description,
      price,
      images,
      category: category || undefined,
      properties: productProperties,
    };
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
      setIsUploading(true);
      const data = new FormData();
      for (const file of files) {
        data.append("file", file);
      }
      const res = await axios.post("/api/upload/", data);
      setImages((oldImages) => [...oldImages, ...res.data]);
      setIsUploading(false);
    }
  }

  if (shouldGoToProducts) {
    router.push("/products");
  }

  function updateImagesOrder(list) {
    setImages(list);
  }

  function setProductProp(productName, value) {
    setProductProperties((prev) => {
      const newProductProps = { ...prev };
      newProductProps[productName] = value;
      return newProductProps;
    });
    return productProperties;
  }

  const properties = [];
  if (categories.length > 0 && category) {
    let selectedCategoryInfo = categories.find(({ _id }) => _id === category);
    properties.push(...selectedCategoryInfo.properties);
    while (selectedCategoryInfo?.parent?._id) {
      const parent = categories.find(
        ({ _id }) => _id === selectedCategoryInfo?.parent?._id
      );
      properties.push(...parent.properties);
      selectedCategoryInfo = parent;
    }
  }

  console.log(imagesData.length);

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
        <BasicLabel>Category</BasicLabel>
        <select
          value={category}
          onChange={(ev) => setCategory(ev.target.value)}
        >
          <option value={""}>Uncategorized</option>
          {categories.length > 0 &&
            categories.map((category) => (
              <option value={category._id} key={category._id}>
                {category.name}
              </option>
            ))}
        </select>
        {properties.length > 0 &&
          properties.map((property) => {
            return (
              <div key={property._id}>
                <div>{property.name}</div>
                <select
                  value={productProperties[property.name]}
                  onChange={(ev) =>
                    setProductProp(property.name, ev.target.value)
                  }
                >
                  {property.values.split(",").map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </div>
            );
          })}
        <BasicLabel>Photos</BasicLabel>
        <div className="mb-2 flex flex-wrap gap-1">
          <ReactSortable
            className="flex flex-wrap gap-1"
            list={images}
            setList={updateImagesOrder}
          >
            {imagesData?.length &&
              imagesData.map((imageData, i) => (
                <img
                  src={`data:image/${
                    imageData.contentType
                  };base64,${imageData.img.data.toString("base64")}`}
                  key={"image " + i}
                  className="h-24"
                  alt="product"
                />
              ))}
          </ReactSortable>
          {isUploading && (
            <div className="h-24 flex items-center">
              <Spinner />
            </div>
          )}
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
        <BasicButton>Save</BasicButton>
      </form>
    </>
  );
}

export default ProductForm;
