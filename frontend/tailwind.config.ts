/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			colors: {
				primary: {
					DEFAULT: "var(--color-primary)",
					hover: "var(--color-primary-hover)",
					light: "var(--color-primary-light)",
				},
				secondary: {
					DEFAULT: "var(--color-secondary)",
					light: "var(--color-secondary-light)",
					dark: "var(--color-secondary-dark)",
				},
				background: {
					DEFAULT: "var(--color-background)",
					white: "var(--color-background-white)",
					gray: "var(--color-background-gray)",
				},
				text: {
					primary: "var(--color-text-primary)",
					secondary: "var(--color-text-secondary)",
					light: "var(--color-text-light)",
				},
				success: "var(--color-success)",
				error: "var(--color-error)",
				warning: "var(--color-warning)",
				info: "var(--color-info)",
			},
			spacing: {
				xs: "var(--spacing-xs)",
				sm: "var(--spacing-sm)",
				md: "var(--spacing-md)",
				lg: "var(--spacing-lg)",
				xl: "var(--spacing-xl)",
				"2xl": "var(--spacing-2xl)",
			},
			borderRadius: {
				sm: "var(--radius-sm)",
				md: "var(--radius-md)",
				lg: "var(--radius-lg)",
				xl: "var(--radius-xl)",
				full: "var(--radius-full)",
			},
			boxShadow: {
				sm: "var(--shadow-sm)",
				md: "var(--shadow-md)",
				lg: "var(--shadow-lg)",
			},
			transitionDuration: {
				fast: "var(--transition-fast)",
				normal: "var(--transition-normal)",
				slow: "var(--transition-slow)",
			},
		},
	},
	plugins: [],
};
