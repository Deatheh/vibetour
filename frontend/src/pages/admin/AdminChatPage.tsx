import { useState } from "react";
import { ArrowLeft, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../shared/ui/Button";

export const AdminChatPage = () => {
	const navigate = useNavigate();
	const [status, setStatus] = useState<
		"idle" | "loading" | "editing"
	>("idle");
	const [aiData, setAiData] = useState<any>(null);

	const handleGenerate = (e: React.FormEvent) => {
		e.preventDefault();
		setStatus("loading");

		// Эмуляция ответа сервера (нейронки)
		setTimeout(() => {
			setAiData({
				description:
					"Этот тур создан для тех, кто устал от офиса. Мы продумали каждую деталь, чтобы вы почувствовали вкус жизни.",
				itinerary: [
					{
						id: 1,
						time: "09:00",
						activity: "Завтрак с видом на океан",
					},
					{
						id: 2,
						time: "12:00",
						activity: "Полет на вертолете над рифами",
					},
					{
						id: 3,
						time: "18:00",
						activity: "Танцы на Мальдивах (главное событие)",
					},
				],
			});
			setStatus("editing");
		}, 1500);
	};

	return (
		<div className='min-h-screen bg-black text-white p-6'>
			<button
				onClick={() => navigate("/admin")}
				className='mb-8 flex items-center gap-2 text-gray-400 hover:text-white'
			>
				<ArrowLeft size={20} /> Назад в дашборд
			</button>

			<div className='max-w-3xl mx-auto'>
				<h1 className='text-5xl mb-8 leading-none'>
					Генератор <br />
					<span className='text-[var(--color-primary)]'>
						путешествий
					</span>
				</h1>

				{status === "idle" && (
					<form onSubmit={handleGenerate} className='space-y-4'>
						<textarea
							placeholder='Опиши тур: куда, когда и какой вайб? (например: Мальдивы в марте, больше танцев и морепродуктов)'
							className='w-full h-40 bg-zinc-900 border-none rounded-2xl p-6 text-xl focus:ring-2 ring-[var(--color-primary)] outline-none'
							required
						/>
						<Button className='w-full py-6 text-xl'>
							Создать план через ИИ
						</Button>
					</form>
				)}

				{status === "loading" && (
					<div className='text-center py-20 animate-pulse'>
						<Sparkles
							className='mx-auto mb-4 text-[var(--color-primary)]'
							size={48}
						/>
						<p className='text-2xl font-bold uppercase italic'>
							ИИ ищет лучшие билеты и отели...
						</p>
					</div>
				)}

				{status === "editing" && (
					<div className='space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500'>
						<div className='p-6 bg-zinc-900 rounded-2xl border-l-8 border-[var(--color-primary)]'>
							<h3 className='text-[var(--color-primary)] mb-2'>
								Анализ нейросети:
							</h3>
							<p className='text-lg italic text-gray-300'>
								{aiData.description}
							</p>
						</div>

						<div className='space-y-3'>
							<h3 className='text-xl mb-4'>
								Выберите события для включения в тур:
							</h3>
							{aiData.itinerary.map((item: any) => (
								<label
									key={item.id}
									className='flex items-center gap-4 p-4 bg-zinc-900 rounded-xl cursor-pointer hover:bg-zinc-800 transition-colors'
								>
									<input type='checkbox' defaultChecked />
									<span className='font-mono text-[var(--color-primary)]'>
										{item.time}
									</span>
									<span className='font-bold'>{item.activity}</span>
								</label>
							))}
						</div>

						<Button
							className='w-full py-6'
							onClick={() => {
								alert("REST-запрос отправлен! Тур опубликован.");
								navigate("/admin");
							}}
						>
							Одобрить и опубликовать
						</Button>
					</div>
				)}
			</div>
		</div>
	);
};

