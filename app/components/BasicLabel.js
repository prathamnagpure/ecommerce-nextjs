import React from "react";

function BasicLabel(props) {
  return (
    <label {...props} className={"text-blue-900" + (props.className || "")} />
  );
}

export default BasicLabel;
