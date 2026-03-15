interface TourProps {
	title: string;
	price: string;
	image: string;
	tags: string[];
}

export const TourCard = ({
	title,
	price,
	image,
	tags,
}: TourProps) => {
	return (
		<div className='group bg-(--color-card) rounded-lg overflow-hidden border border-white/5 hover:border-(--color-accent)/50 transition-all'>
			<div className='relative h-64 overflow-hidden'>
				<img
					src={image}
					alt={title}
					className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-500'
				/>
				<div className='absolute top-4 left-4 flex gap-2'>
					{tags.map((tag) => (
						<span
							key={tag}
							className='bg-black/60 backdrop-blur-md text-(--color-accent) text-xs font-bold px-3 py-1 rounded-full uppercase'
						>
							{tag}
						</span>
					))}
				</div>
			</div>
			<div className='p-6'>
				<h3 className='text-2xl mb-4 leading-none'>{title}</h3>
				<div className='flex justify-between items-end'>
					<div>
						<p className='text-(--color-text-muted) text-xs uppercase font-bold tracking-widest'>
							Цена за тур
						</p>
						<p className='text-3xl font-black text-(--color-accent)'>
							{price} ₽
						</p>
					</div>
					<button className='bg-white text-black p-3 rounded-xl hover:bg-(--color-accent) transition-colors'>
						<svg
							width='24'
							height='24'
							viewBox='0 0 24 24'
							fill='none'
							stroke='currentColor'
							strokeWidth='3'
						>
							<path d='M5 12h14M12 5l7 7-7 7' />
						</svg>
					</button>
				</div>
			</div>
		</div>
	);
};

