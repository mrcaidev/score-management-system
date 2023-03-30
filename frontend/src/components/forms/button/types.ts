import { JSX } from "solid-js";

export type ButtonVariant = "primary" | "success" | "error" | "disabled";

export type ButtonProps = JSX.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  children?: JSX.Element;
};
