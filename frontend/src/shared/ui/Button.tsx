import { ButtonHTMLAttributes } from "react";
import { clsx } from "clsx";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: "primary" | "outline" | "ghost";
}

export const Button = ({
	variant = "primary",
	className,
	...props
}: ButtonProps) => {
	const variants = {
		primary:
			"bg-[var(--color-accent)] text-black hover:scale-105 active:scale-95",
		outline:
			"border-2 border-[var(--color-accent)] text-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-black",
		ghost:
			"text-[var(--color-text-muted)] hover:text-[var(--color-accent)]",
	};

	return (
		<button
			className={clsx(
				"px-8 py-4 rounded-md font-black uppercase transition-all duration-200",
				variants[variant],
				className,
			)}
			{...props}
		/>
	);
};

