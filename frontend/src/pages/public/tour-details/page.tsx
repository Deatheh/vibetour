import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Clock, ShieldCheck } from "lucide-react";
import { MOCK_TOURS } from "../../../shared/mock/tours";
import { Button } from "../../../shared/ui/Button";

export default function TourDetailsPage() {
	const { id } = useParams();
	const navigate = useNavigate();

	// Ищем тур в наших моках
	const tour = MOCK_TOURS.find((t) => t.id === id);

	if (!tour) {
		return (
			<div className='h-screen flex flex-col items-center justify-center bg-black text-white'>
				<h1 className='text-9xl font-black italic'>404</h1>
				<p className='text-2xl uppercase font-bold mb-8 text-[var(--color-primary)]'>
					Тур потерялся в пространстве
				</p>
				<Button onClick={() => navigate("/")}>
					Вернуться на главную
				</Button>
			</div>
		);
	}

	return (
		<div className='bg-white min-h-screen pb-20'>
			{/* Кнопка назад и Header */}
			<header className='fixed top-0 left-0 right-0 z-50 p-6 mix-blend-difference pointer-events-none'>
				<button
					onClick={() => navigate(-1)}
					className='pointer-events-auto bg-white text-black p-3 rounded-full hover:scale-110 transition-transform shadow-xl'
				>
					<ArrowLeft size={24} />
				</button>
			</header>

			{/* HERO IMAGE */}
			<section className='relative h-[70vh] w-full overflow-hidden bg-black'>
				<img
					src={tour.image}
					alt={tour.title}
					className='w-full h-full object-cover opacity-80'
				/>
				<div className='absolute inset-0 bg-gradient-to-t from-black/80 to-transparent' />
				<div className='absolute bottom-0 left-0 p-8 md:p-16 w-full'>
					<div className='max-w-7xl mx-auto'>
						<h1 className='text-6xl md:text-9xl text-white font-black uppercase italic leading-[0.8] tracking-tighter'>
							{tour.title}
						</h1>
					</div>
				</div>
			</section>

			{/* CONTENT */}
			<main className='max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-16 mt-12'>
				{/* Левая колонка: Описание и Программа */}
				<div className='lg:col-span-2 space-y-12'>
					<section>
						<h2 className='text-4xl mb-6 italic underline decoration-[var(--color-primary)] decoration-4 underline-offset-8'>
							О чем этот трип?
						</h2>
						<p className='text-xl md:text-2xl text-gray-700 leading-relaxed font-medium'>
							{tour.shortDescription}
							<br />
							<br />
							Представь: ты просыпаешься, и тебе не нужно проверять
							почту. Тебе не нужно думать, куда идти и сколько это
							стоит. Мы уже всё продумали. Этот маршрут — не просто
							поездка, это вызов твоей повседневности. Никаких
							"туристических мест" из путеводителей — только то, что
							реально стоит твоего времени.
						</p>
					</section>

					{/* Пример программы (которую сгенерировал админ через ИИ) */}
					<section className='bg-[var(--color-gray)] p-8 md:p-12 rounded-[var(--radius-md)]'>
						<h3 className='text-3xl mb-8 uppercase font-black'>
							Тайминг безумия
						</h3>
						<div className='space-y-6'>
							{[
								{
									time: "10:00",
									text: "Сбор банды и первый эспрессо",
								},
								{
									time: "13:00",
									text: "Заброшенный маяк и съемки контента",
								},
								{
									time: "19:00",
									text: "Танцы, ради которых мы здесь собрались",
								},
								{
									time: "00:00",
									text: "Секретная локация (только для своих)",
								},
							].map((item, idx) => (
								<div
									key={idx}
									className='flex gap-6 items-start border-l-2 border-black pl-6 relative'
								>
									<div className='absolute -left-[9px] top-0 w-4 h-4 bg-[var(--color-primary)] rounded-full' />
									<span className='font-mono text-[var(--color-primary)] font-bold text-xl'>
										{item.time}
									</span>
									<span className='text-xl font-bold uppercase'>
										{item.text}
									</span>
								</div>
							))}
						</div>
					</section>
				</div>

				{/* Правая колонка: Плашка бронирования */}
				<aside className='relative'>
					<div className='sticky top-24 border-[6px] border-black p-8 rounded-2xl bg-white shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]'>
						<div className='mb-8'>
							<span className='text-gray-400 uppercase font-black text-sm tracking-widest'>
								Цена за одного
							</span>
							<div className='text-5xl font-black mt-2'>
								{tour.price} ₽
							</div>
						</div>

						<div className='space-y-4 mb-8'>
							<div className='flex items-center gap-3 text-lg font-bold'>
								<Clock className='text-[var(--color-primary)]' /> 7
								дней отрыва
							</div>
							<div className='flex items-center gap-3 text-lg font-bold'>
								<MapPin className='text-[var(--color-primary)]' /> 12
								локаций
							</div>
							<div className='flex items-center gap-3 text-lg font-bold'>
								<ShieldCheck className='text-[var(--color-primary)]' />{" "}
								Всё включено
							</div>
						</div>

						<Button className='w-full py-6 text-2xl mb-4 shadow-lg active:shadow-none translate-y-[-4px] active:translate-y-0 transition-all'>
							ХОЧУ С ВАМИ
						</Button>
						<p className='text-center text-xs text-gray-400 uppercase font-bold tracking-tighter'>
							Мест осталось: всего 4
						</p>
					</div>
				</aside>
			</main>
		</div>
	);
}

