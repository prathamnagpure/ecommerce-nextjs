const style = {
  input:
    "border-2 border-gray-300 rounded-md px-1 w-full mb-2 focus:border-blue-900",
  label: "text-blue-900",
};

function Input({ type, placeholder, value, onChange, labelText }) {
  let input =
    type === "textarea" ? (
      <textarea
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={style.input}
      ></textarea>
    ) : (
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={style.input}
      ></input>
    );

  return (
    <>
      <label className={style.label}>{labelText}</label>
      {input}
    </>
  );
}

export default Input;
export { style };
