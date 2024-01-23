import React from "react";

function BodyTd(props) {
  return (
    <td
      {...props}
      className={"border border-blue-200 p-1" + (props.className || "")}
    />
  );
}

export default BodyTd;
