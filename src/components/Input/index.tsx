import "./styles.scss";
import { AiOutlineSearch, AiFillCloseCircle } from "react-icons/ai";
import { useState } from "react";
import { IInputProps } from "./types";

export const Input: React.FC<IInputProps> = ({ onSubmit }) => {
  const [value, setValue] = useState<string>("");

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(value);
    setValue("");
  };

  return (
    <form className="form-input" onSubmit={submitHandler}>
      <button type="submit" className="form-input__button">
        <AiOutlineSearch size="20px" />
      </button>
      <input
        className="form-input__input"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button
        type="reset"
        className="form-input__button"
        onClick={() => setValue("")}
      >
        <AiFillCloseCircle size="15px" />
      </button>
    </form>
  );
};
