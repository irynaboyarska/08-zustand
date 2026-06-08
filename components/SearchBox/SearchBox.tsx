import type { ChangeEventHandler } from "react";
import css from "./SearchBox.module.css";

interface SearchBoxProps {
  inputValue: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
}

export const SearchBox = ({ inputValue, onChange }: SearchBoxProps) => {
  return (
    <input
      defaultValue={inputValue}
      onChange={onChange}
      className={css.input}
      type="text"
      placeholder="Search notes"
    />
  );
};
