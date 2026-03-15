import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const API_BASE_URL =
	process.env.API_BASE_URL || "https://api.aitravel.com/v1";

// ==================== MIDDLEWARE ====================

// CORS для локальной разработки
app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.header(
		"Access-Control-Allow-Methods",
		"GET, POST, PUT, DELETE, OPTIONS",
	);
	res.header(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept, Authorization",
	);

	if (req.method === "OPTIONS") {
		return res.sendStatus(200);
	}
	next();
});

// Парсинг JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Логгирование запросов
app.use((req, res, next) => {
	const timestamp = new Date().toISOString();
	console.log(`[${timestamp}] ${req.method} ${req.path}`);
	next();
});

// ==================== API PROXY ====================

// Прокси для всех /api/* запросов
app.use(
	"/api",
	createProxyMiddleware({
		target: API_BASE_URL,
		changeOrigin: true,
		pathRewrite: {
			"^/api": "",
		},
		onProxyReq: (proxyReq, req, res) => {
			// Пробрасываем заголовок авторизации если есть
			const authHeader = req.headers.authorization;
			if (authHeader) {
				proxyReq.setHeader("Authorization", authHeader);
			}
			proxyReq.setHeader("Content-Type", "application/json");
		},
		onProxyRes: (proxyRes, req, res) => {
			// Логгирование ответов от бэкенда
			console.log(`  → ${proxyRes.statusCode} ${req.path}`);
		},
		onError: (err, req, res) => {
			console.error("Proxy error:", err.message);
			res.status(502).json({
				error: "Bad Gateway",
				message: "Не удалось подключиться к серверу API",
			});
		},
	}),
);

// ==================== HEALTH CHECK ====================

app.get("/health", (req, res) => {
	res.json({
		status: "ok",
		timestamp: new Date().toISOString(),
		apiBaseUrl: API_BASE_URL,
	});
});

// ==================== MOCK ENDPOINTS (для разработки без бэкенда) ====================

// GET /api/events - список событий
app.get("/api/events", (req, res) => {
	const limit = parseInt(req.query.limit) || 10;
	const offset = parseInt(req.query.offset) || 0;
	const city = req.query.city;

	const mockEvents = [
		{
			id: "evt_001",
			title: "Тур по Сочи",
			description:
				"Забудьте о городском шуме. Вас ждёт чистейший воздух соснового бора...",
			city: "Сочи",
			country: "Россия",
			price: 24000,
			currency: "RUB",
			image_url:
				"https://images.unsplash.com/photo-1596395819057-d37f71ca8959?w=800",
		},
		{
			id: "evt_002",
			title: "Тур по Казани",
			description:
				"Третья столица России встречает вас древним Кремлём...",
			city: "Казань",
			country: "Россия",
			price: 18500,
			currency: "RUB",
			image_url:
				"https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800",
		},
		{
			id: "evt_003",
			title: "Тур по Байкалу",
			description:
				"Священное озеро планеты — самое глубокое и чистое на свете...",
			city: "Байкал",
			country: "Россия",
			price: 32000,
			currency: "RUB",
			image_url:
				"https://images.unsplash.com/photo-1551845041-63e8e76836ea?w=800",
		},
		{
			id: "evt_004",
			title: "Тур по Мальдивам",
			description:
				"Бирюзовые лагуны, белоснежный песок и бунгало над водой...",
			city: "Мале",
			country: "Мальдивы",
			price: 95000,
			currency: "RUB",
			image_url:
				"https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800",
		},
	];

	let filtered = city
		? mockEvents.filter((e) =>
				e.city.toLowerCase().includes(city.toLowerCase()),
			)
		: mockEvents;
	const total = filtered.length;
	const items = filtered.slice(offset, offset + limit);

	res.json({ items, total });
});

// GET /api/events/:id - детальная информация
app.get("/api/events/:id", (req, res) => {
	const mockEvent = {
		id: req.params.id,
		title: "Тур по Сочи",
		description:
			"Забудьте о городском шуме. Вас ждёт чистейший воздух соснового бора, широкая гладь водохранилища и те самые легендарные закаты...",
		city: "Сочи",
		country: "Россия",
		departure_time: "2026-08-11T08:00:00Z",
		arrival_time: "2026-08-11T11:30:00Z",
		transport_type: "самолет",
		hotel_name: "Four Seasons",
		hotel_stars: 5,
		hotel_address: "Курортный проспект, Сочи",
		hotel_check_in_time: "2026-08-11T14:00:00Z",
		hotel_check_out_time: "2026-08-17T12:00:00Z",
		return_departure_time: "2026-08-17T16:00:00Z",
		return_arrival_time: "2026-08-17T19:30:00Z",
		image_url:
			"https://images.unsplash.com/photo-1596395819057-d37f71ca8959?w=800",
		included_in_tour: {
			flight: true,
			transfer: true,
			meals: ["завтрак", "ужин"],
			guide_services: true,
			insurance: false,
		},
		events:
			"📅 День 1: Вылет в 08:00, прилёт в 11:30. Заселение в отель с 14:00.\n📅 День 2: Экскурсия по городу.\n📅 День 3: Морская прогулка.\n📅 День 4: Свободный день.\n📅 День 5: Выселение, вылет в 16:00.",
		price: 24000,
		currency: "RUB",
		rating: 4.8,
		reviews_count: 128,
	};

	res.json(mockEvent);
});

// POST /api/admin/tours - создание тура
app.post("/api/admin/tours", (req, res) => {
	const tourData = req.body;

	// Валидация обязательных полей
	const requiredFields = [
		"title",
		"city",
		"departure_time",
		"arrival_time",
		"hotel_check_in_time",
		"hotel_check_out_time",
		"return_departure_time",
		"return_arrival_time",
		"hotel_name",
		"transport_type",
		"price",
	];
	const missingFields = requiredFields.filter(
		(field) => !tourData[field],
	);

	if (missingFields.length > 0) {
		return res.status(400).json({
			error: "Validation Error",
			message: `Отсутствуют обязательные поля: ${missingFields.join(", ")}`,
		});
	}

	const newTour = {
		id: `evt_${Date.now().toString(36)}`,
		...tourData,
		created_at: new Date().toISOString(),
		status: "active",
	};

	console.log("✅ Создан новый тур:", newTour.id);
	res.status(201).json(newTour);
});

// PUT /api/admin/tours/:id - обновление тура
app.put("/api/admin/tours/:id", (req, res) => {
	const updateData = req.body;

	const updatedTour = {
		id: req.params.id,
		...updateData,
		updated_at: new Date().toISOString(),
	};

	console.log("✅ Обновлён тур:", updatedTour.id);
	res.json(updatedTour);
});

// DELETE /api/admin/tours/:id - удаление тура
app.delete("/api/admin/tours/:id", (req, res) => {
	console.log("✅ Удалён тур:", req.params.id);
	res.status(204).send();
});

// POST /api/admin/tours/:id/generate-description - генерация AI
app.post("/api/admin/tours/:id/generate-description", (req, res) => {
	const { language = "ru" } = req.body;

	const aiGeneratedDescription = `📅 День 1: Вылет в 08:00, прилёт в 11:30. Заселение в отель с 14:00.
📅 День 2: Экскурсия по городу и посещение главных достопримечательностей.
📅 День 3: Морская прогулка на яхте, обед на борту.
📅 День 4: Свободный день для отдыха и шопинга.
📅 День 5: Выселение из отеля, вылет в 16:00.`;

	console.log(
		"✅ Сгенерировано AI описание для тура:",
		req.params.id,
	);
	res.json({ events: aiGeneratedDescription });
});

// ==================== STATIC FILES (для продакшена) ====================

// Раздача статики из build папки Vite
const buildPath = path.join(__dirname, "dist");
app.use(express.static(buildPath));

// SPA fallback - все неизвестные маршруты отдают index.html
app.get("*", (req, res) => {
	res.sendFile(path.join(buildPath, "index.html"));
});

// ==================== SERVER START ====================

app.listen(PORT, () => {
	console.log(`
╔════════════════════════════════════════════════════════╗
║           AI Travel Agent API Proxy Server             ║
╠════════════════════════════════════════════════════════╣
║  Local:    http://localhost:${PORT}                    ║
║  API:      http://localhost:${PORT}/api                ║
║  Backend:  ${API_BASE_URL}                             ║
║  Static:   ${buildPath}                                ║
╚════════════════════════════════════════════════════════╝
  `);
});

