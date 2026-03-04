import clsx from "clsx";
import { twMerge } from "tailwind-merge";

function SpinnerIcon() {
  return (
    <span className="inline-flex size-4 items-center justify-center">
      <span
        className="size-4 rounded-full border-2 spin"
        style={{
          borderColor: "color-mix(in srgb, currentColor 30%, transparent)",
          borderTopColor: "currentColor",
        }}
      />
    </span>
  );
}

export default function Button({
  as: Comp = "button",
  type = "button",
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  className,
  children,
  ...props
}) {
  const isDisabled = disabled || loading;
  const variantClass = {
    primary: "btn-primary",
    secondary: "btn-secondary",
    outline: "btn-outline",
    danger: "btn-danger",
    ghost: "btn-ghost",
  }[variant];
  const sizeClass = {
    sm: "btn-sm",
    md: "btn-md",
    lg: "btn-lg",
  }[size];

  return (
    <Comp
      type={Comp === "button" ? type : undefined}
      disabled={isDisabled}
      className={twMerge(clsx("btn", variantClass, sizeClass, className))}
      {...props}
    >
      {loading ? <SpinnerIcon /> : null}
      {children}
    </Comp>
  );
}
