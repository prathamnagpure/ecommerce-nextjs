import React from "react";

function BasicTable(props) {
  return (
    <table {...props} className={"m-2 w-full " + (props.className || "")} />
  );
}

export default BasicTable;
