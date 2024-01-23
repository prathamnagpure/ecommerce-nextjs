import React from "react";

function HeadTd(props) {
  return (
    <td
      {...props}
      className={
        "bg-blue-100 border border-blue-200 p-1" + (props.className || "")
      }
    />
  );
}

export default HeadTd;
