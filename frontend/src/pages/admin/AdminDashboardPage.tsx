import { Trash2, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../shared/ui/Button";

export const AdminDashboardPage = () => {
	const navigate = useNavigate();
	// Моковые данные
	const tours = [
		{ id: 1, title: "Танцы на Мальдивах", price: "250 000" },
		{ id: 2, title: "Ледники Исландии", price: "180 000" },
	];

	return (
		<div className='p-8'>
			<div className='flex justify-between items-center mb-12'>
				<h1 className='text-6xl italic'>
					Admin <span className='text-gray-300'>Panel</span>
				</h1>
				<Button
					onClick={() => navigate("/admin/create")}
					className='flex items-center gap-2'
				>
					<Plus size={20} /> Новый тур
				</Button>
			</div>

			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
				{tours.map((tour) => (
					<div
						key={tour.id}
						className='group relative bg-white border-4 border-black p-6 rounded-2xl'
					>
						<h3 className='text-2xl mb-2'>{tour.title}</h3>
						<p className='text-3xl font-black mb-6'>{tour.price} ₽</p>

						<div className='flex gap-2'>
							<Button
								variant='outline'
								className='flex-1'
								onClick={() => navigate(`/tours/${tour.id}`)}
							>
								Просмотр
							</Button>
							<button className='p-3 bg-gray-100 rounded-xl hover:bg-red-100 hover:text-red-600 transition-colors'>
								<Trash2 size={24} />
							</button>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

