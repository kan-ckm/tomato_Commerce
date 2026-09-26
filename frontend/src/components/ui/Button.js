import { cva } from "class-variance-authority";
import { clsx } from "clsx";

const buttonVariants = cva("py-2 px-4 rounded-lg shadow-md transition-all duration-200", {
  variants: {
    variant: {
      default: "bg-blue-600 text-white hover:bg-blue-700",
      outline: "border-2 border-blue-600 text-blue-600 hover:bg-blue-100",
      danger: "bg-red-600 text-white hover:bg-red-700",
    },
    size: {
      small: "text-sm py-1 px-3",
      large: "text-lg py-3 px-6",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "small",
  },
});

export function Button({ className, variant, size, disabled, children, ...props }) {
  return (
    <button
      className={clsx(buttonVariants({ variant, size, disabled }), className)}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
