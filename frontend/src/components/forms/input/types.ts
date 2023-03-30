import { JSX } from "solid-js";

export type InputProps = JSX.InputHTMLAttributes<HTMLInputElement> & {
  id: string;
  label: string;
};
