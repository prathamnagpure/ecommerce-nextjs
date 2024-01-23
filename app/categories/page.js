"use client";
import React, { useEffect } from "react";
import MainLayout from "../components/MainLayout";
import Input from "../components/Input";
import { useState } from "react";
import axios from "axios";
import SweetAlert2 from "react-sweetalert2";
import BasicButton from "../components/BasicButton";
import BasicTable from "../components/BasicTable";
import HeadTd from "../components/HeadTd";
import BodyTd from "../components/BodyTd";
import BasicLabel from "../components/BasicLabel";

function Categories() {
  const [name, setName] = useState("");
  const [categories, setCategories] = useState([]);
  const [parentCategory, setParentCategory] = useState("");
  const [editedCategory, setEditedCategory] = useState(null);
  const [sweetAlertProps, setSweetAlertProps] = useState({});
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  async function saveCategory(ev) {
    ev.preventDefault();
    const data = { name, parent: parentCategory || undefined, properties };
    if (editedCategory) {
      await axios.put("/api/categories", { ...data, _id: editedCategory._id });
      setEditedCategory(null);
    } else {
      await axios.post("/api/categories", data);
    }
    setName("");
    setParentCategory("");
    setProperties([]);
    fetchCategories();
  }

  function fetchCategories() {
    axios.get("/api/categories").then((res) => setCategories(res.data));
  }

  function editCategory(category) {
    setEditedCategory(category);
    setName(category.name);
    setParentCategory(category?.parent?._id || "");
    setProperties(category.properties);
  }

  function deleteCategory(category) {
    setSweetAlertProps({
      show: true,
      title: "Delete?",
      text: `Do you want to delete ${category.name}`,
      showCancelButton: true,
      cancelButtonText: "Cancel",
      confirmButtonText: "Yes, Delete!",
      confirmButtonColor: "#d55",
      reverseButtons: true,
      onConfirm: (result) => {
        axios.delete("/api/categories?id=" + category._id);
        fetchCategories();
      },
    });
  }

  function addProperty() {
    setProperties((oldProperties) => {
      return [...oldProperties, { name: "", values: "" }];
    });
  }

  function handlePropertyNameChanged(index, name) {
    setProperties((oldProperties) => {
      const newProperties = [...oldProperties];
      newProperties[index].name = name;
      return newProperties;
    });
  }

  function handlePropertyValuesChanged(index, values) {
    setProperties((oldProperties) => {
      const newProperties = [...oldProperties];
      newProperties[index].values = values;
      return newProperties;
    });
  }

  function removeProperty(indexToRemove) {
    setProperties((oldProperties) =>
      [...oldProperties].filter((_, index) => index != indexToRemove)
    );
  }

  const categoryOptions =
    categories.length &&
    categories.map((category) => (
      <option value={category._id} key={category._id}>
        {category.name}
      </option>
    ));

  const categoryRows =
    categories &&
    categories.map((category) => (
      <tr key={category._id}>
        <BodyTd>{category.name}</BodyTd>
        <BodyTd>{category?.parent?.name}</BodyTd>
        <BodyTd>
          <BasicButton
            type="button"
            onClick={() => editCategory(category)}
            className=" mr-1"
          >
            edit
          </BasicButton>
          <BasicButton type="button" onClick={() => deleteCategory(category)}>
            delete
          </BasicButton>
        </BodyTd>
      </tr>
    ));

  const categoriesTable = !!editedCategory || (
    <div>
      <BasicTable>
        <thead>
          <tr>
            <HeadTd>Category name</HeadTd>
            <HeadTd>Parent category</HeadTd>
            <HeadTd></HeadTd>
          </tr>
        </thead>
        <tbody>{categoryRows}</tbody>
      </BasicTable>
    </div>
  );

  const addedProperties =
    properties.length > 0 &&
    properties.map((property, index) => (
      <div key={property} className="flex gap=1">
        <input
          type="text"
          value={property.name}
          onChange={(ev) => handlePropertyNameChanged(index, ev.target.value)}
          placeholder="property name (example: color)"
        />
        <input
          type="text"
          onChange={(ev) => handlePropertyValuesChanged(index, ev.target.value)}
          value={property.values}
          placeholder="values, comma separated"
        />
        <BasicButton type="button" onClick={() => removeProperty(index)}>
          Remove
        </BasicButton>
      </div>
    ));

  const cancelButton = !!editedCategory && (
    <BasicButton
      type="button"
      onClick={() => {
        setEditedCategory(null);
        setName("");
        setParentCategory("");
        setProperties([]);
      }}
    >
      Cancel
    </BasicButton>
  );

  const categoryNameLabel = editedCategory
    ? `Edit category ${editedCategory.name}`
    : "New category name";

  return (
    <MainLayout>
      <h1 className="text-blue-900 mb-2 text-xl">Categories</h1>
      <div>
        <div>
          <form onSubmit={saveCategory}>
            <div>
              <Input
                type="text"
                labelText={categoryNameLabel}
                placeholder={"Category name"}
                onChange={(ev) => setName(ev.target.value)}
                value={name}
              />
              <select
                value={parentCategory}
                onChange={(ev) => setParentCategory(ev.target.value)}
              >
                <option value={""}>No parent category</option>
                {categoryOptions}
              </select>
            </div>
            <div>
              <div className="flex flex-col">
                <BasicLabel>Properties</BasicLabel>
                <BasicButton
                  type="button"
                  variant={"gray"}
                  onClick={addProperty}
                >
                  Add new property
                </BasicButton>
              </div>
              {addedProperties}
            </div>
            <BasicButton className="mt-2" type="submit">
              Save
            </BasicButton>
          </form>
        </div>
        {categoriesTable}
      </div>
      <div>{cancelButton}</div>
      <SweetAlert2
        {...sweetAlertProps}
        didClose={() => {
          setSweetAlertProps({ show: false });
        }}
      />
    </MainLayout>
  );
}

export default Categories;
