import { Button } from "../../../shared/ui/Button";
import { Input } from "../../../shared/ui/Input";
import { TourCard } from "../../../shared/ui/TourCard";

const TOURS = [
	{
		id: 1,
		title: "Мрачный Исландский Берег",
		price: "145 000",
		tags: ["Природа", "Холод"],
		image:
			"https://images.unsplash.com/photo-1504893524553-f8589d99d561?auto=format&fit=crop&q=80&w=800",
	},
	{
		id: 2,
		title: "Киберпанк Токио",
		price: "210 000",
		tags: ["Город", "Ночь"],
		image:
			"https://images.unsplash.com/photo-1540959733332-e9ab658d87c7?auto=format&fit=crop&q=80&w=800",
	},
	{
		id: 3,
		title: "Берлинский Техно-Тур",
		price: "98 000",
		tags: ["Вечеринки"],
		image:
			"https://images.unsplash.com/photo-1559734840-f9509ee5677f?auto=format&fit=crop&q=80&w=800",
	},
];

export default function LandingPage() {
	return (
		<div className='space-y-32 pb-32'>
			{/* HERO SECTION */}
			<section className='pt-20 px-6 max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center'>
				<div className='space-y-8'>
					<div className='inline-block border border-(--color-accent) px-4 py-1 rounded-full text-(--color-accent) font-bold text-sm uppercase'>
						Travel Agency 2026
					</div>
					<h1 className='text-7xl md:text-8xl leading-[0.85]'>
						Пора <br />
						<span className='text-(--color-accent)'>валить</span>{" "}
						<br />
						красиво.
					</h1>
					<p className='text-(--color-text-muted) text-xl max-w-md font-medium'>
						Мы находим места, где тебя не достанет уведомление из
						Telegram. Полный детокс в стиле дикого туризма.
					</p>
					<div className='flex gap-4'>
						<Button>Посмотреть всё</Button>
						<Button variant='outline'>О проекте</Button>
					</div>
				</div>
				<div className='relative'>
					<div className='absolute -inset-4 bg-(--color-accent) opacity-20 blur-3xl rounded-full' />
					<img
						src='https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&q=80&w=800'
						className='relative rounded-lg border-2 border-white/10 grayscale hover:grayscale-0 transition-all duration-700'
						alt='Hero'
					/>
				</div>
			</section>

			{/* КАТАЛОГ */}
			<section className='px-6 max-w-7xl mx-auto'>
				<div className='flex flex-col md:flex-row justify-between items-end mb-12 gap-6'>
					<h2 className='text-5xl leading-none'>
						Актуальные <br />
						направления
					</h2>
					<div className='flex gap-2 w-full md:w-auto'>
						<Input placeholder='Поиск приключения...' />
					</div>
				</div>

				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
					{TOURS.map((tour) => (
						<TourCard key={tour.id} {...tour} />
					))}
				</div>
			</section>

			{/* ФОРМА (в стиле дизайна) */}
			<section className='px-6 max-w-4xl mx-auto'>
				<div className='bg-(--color-accent) p-12 rounded-lg text-black text-center'>
					<h2 className='text-4xl mb-4'>Не нашел что искал?</h2>
					<p className='font-bold uppercase mb-8 opacity-70'>
						Оставь почту, мы подберем тур лично под твой вайб
					</p>
					<div className='flex flex-col md:flex-row gap-4'>
						<input
							type='text'
							placeholder='твоя@почта.рф'
							className='flex-1 bg-black/10 border-2 border-black/20 p-4 rounded-md placeholder:text-black/40 outline-none focus:border-black font-bold'
						/>
						<button className='bg-black text-white px-8 py-4 rounded-md font-black uppercase hover:invert transition-all'>
							Подписаться
						</button>
					</div>
				</div>
			</section>
		</div>
	);
}

