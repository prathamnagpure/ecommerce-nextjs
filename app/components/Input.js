import BasicLabel from "./BasicLabel";

function Input({ type, placeholder, value, onChange, labelText }) {
  let input =
    type === "textarea" ? (
      <textarea
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="border-2 border-gray-300 rounded-md px-1 w-full mb-2 focus:border-blue-900"
      ></textarea>
    ) : (
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="border-2 border-gray-300 rounded-md px-1 w-full mb-2 focus:border-blue-900"
      ></input>
    );

  return (
    <>
      <BasicLabel>{labelText}</BasicLabel>
      {input}
    </>
  );
}

export default Input;
