import { InputHTMLAttributes } from "react";

export const Input = (
	props: InputHTMLAttributes<HTMLInputElement>,
) => {
	return (
		<input
			className='w-full bg-(--color-card) border-2 border-transparent focus:border-(--color-accent) p-4 rounded-md text-white outline-none transition-all placeholder:text-zinc-600'
			{...props}
		/>
	);
};

