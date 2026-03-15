import { PropsWithChildren } from "react";

export default function Price({ children }: PropsWithChildren) {
	return <span className='price'>{children}</span>;
}

