import React from "react";

function BasicButton({ variant, ...props }) {
  return (
    <button
      {...props}
      className={`px-4 py-1 text-white ${
        variant == "gray" ? "bg-gray-500" : "bg-blue-900 "
      } rounded-md w-fit ${props.className || ""}`}
    />
  );
}

export default BasicButton;
