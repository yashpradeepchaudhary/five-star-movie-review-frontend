import React from "react";

export default function Selector({ name, options, label, value, onChange }) {
  return (
    <select
      className="border-2 bg-white dark:bg-primary dark:border-dark-subtle border-light-subtle dark:focus:border-white focus:border-primary pr-10 p-1 outline-none transition rounded bg-transparent dark:text-dark-subtle text-light-subtle dark:focus:text-white focus:text-primary"
      id={name}
      name={name}
      value={value}
      onChange={onChange}
    >
      <option value="">{label}</option>
      {options.map(({ title, value }) => {
        return (
          <option key={title} value={value}>
            {title}
          </option>
        );
      })}
    </select>
  );
}
