const TOUR_IMAGE =
	"https://www.figma.com/api/mcp/asset/667f7b1c-2ac0-42ba-929d-3bb4e2444d87";

const allTours = [
	{
		id: 1,
		name: "Тур по Сочи",
		price: "24 000 ₽",
		city: "Сочи",
		days: "7 дней",
		category: "recent",
		desc: "Забудьте о городском шуме. Вас ждёт чистейший воздух соснового бора, широкая гладь водохранилища и те самые легендарные закаты...",
	},
	{
		id: 2,
		name: "Тур по Казани",
		price: "18 500 ₽",
		city: "Казань",
		days: "5 дней",
		category: "recent",
		desc: "Третья столица России встречает вас древним Кремлём, потрясающей мечетью Кул Шариф и неповторимой татарской кухней...",
	},
	{
		id: 3,
		name: "Тур по Байкалу",
		price: "32 000 ₽",
		city: "Байкал",
		days: "8 дней",
		category: "recent",
		desc: "Священное озеро планеты — самое глубокое и чистое на свете. Нерпы, кедровый лес и рассветы, от которых перехватывает дыхание...",
	},
	{
		id: 4,
		name: "Тур по Алтаю",
		price: "27 000 ₽",
		city: "Горно-Алтайск",
		days: "6 дней",
		category: "recent",
		desc: "Горы, реки, водопады и бескрайние степи. Алтай — место силы, куда хочется возвращаться снова и снова...",
	},
	{
		id: 5,
		name: "Тур по Москве",
		price: "12 000 ₽",
		city: "Москва",
		days: "3 дня",
		category: "russia",
		desc: "Центр притяжения миллионов — Красная площадь, ВДНХ, Арбат и бесчисленные музеи. Столица никогда не спит...",
	},
	{
		id: 6,
		name: "Тур по Питеру",
		price: "14 000 ₽",
		city: "Санкт-Петербург",
		days: "4 дня",
		category: "russia",
		desc: "Белые ночи, разводные мосты, Эрмитаж. Культурная столица России хранит тысячи историй...",
	},
	{
		id: 7,
		name: "Тур по Камчатке",
		price: "55 000 ₽",
		city: "Петропавловск",
		days: "10 дней",
		category: "russia",
		desc: "Вулканы, гейзеры и медведи. Камчатка — один из самых нетронутых уголков Земли...",
	},
	{
		id: 8,
		name: "Тур по Карелии",
		price: "21 000 ₽",
		city: "Петрозаводск",
		days: "5 дней",
		category: "russia",
		desc: "Острова Ладожского озера, Кижи, Валаам. Природа Карелии — живописная и суровая одновременно...",
	},
	{
		id: 9,
		name: "Тур по Стамбулу",
		price: "45 000 ₽",
		city: "Стамбул",
		days: "7 дней",
		category: "abroad",
		desc: "Два материка, один город. Айя-София, Босфор, базары и великолепная турецкая кухня не дадут заскучать...",
	},
	{
		id: 10,
		name: "Тур по Дубаю",
		price: "68 000 ₽",
		city: "Дубай",
		days: "6 дней",
		category: "abroad",
		desc: "Небоскрёбы в пустыне, золотые пляжи и шопинг мирового уровня. Дубай — город, где мечты становятся реальностью...",
	},
	{
		id: 11,
		name: "Тур по Мальдивам",
		price: "95 000 ₽",
		city: "Мале",
		days: "9 дней",
		category: "abroad",
		desc: "Бирюзовые лагуны, белоснежный песок и бунгало над водой. Мальдивы — рай на Земле для двоих...",
	},
];

let toDeleteId = null;
let currentRole = "admin"; // 'admin' | 'client'

// ─── USER SWITCHER ────────────────────────────────────────
function toggleUserSwitcher(e) {
	e.stopPropagation();
	document.getElementById("user-switcher").classList.toggle("open");
}

document.addEventListener("click", () => {
	document.getElementById("user-switcher").classList.remove("open");
});

function switchUser(role) {
	currentRole = role;
	document.getElementById("user-switcher").classList.remove("open");
	applyRole();
	renderAll();
	// If client tries to stay on new-tour tab, send them back
	if (
		role === "client" &&
		document.getElementById("tab-new-tour").style.display !== "none"
	) {
		showTab("tours", document.querySelector(".nav-tab:first-child"));
	}
	showToast(
		role === "admin" ? "👩‍💼 Режим администратора" : "👤 Режим клиента",
	);
}

function applyRole() {
	const isAdmin = currentRole === "admin";

	// Topbar profile
	document.getElementById("topbar-username").textContent = isAdmin
		? "Юля Администраторша"
		: "Клиент";
	document.getElementById("topbar-role-badge").textContent = isAdmin
		? "Администратор"
		: "Клиент";
	document.getElementById("topbar-role-badge").className =
		"role-badge " + (isAdmin ? "admin" : "client");
	document.getElementById("topbar-avatar").textContent = isAdmin
		? "ЮА"
		: "КЛ";
	document.getElementById("topbar-avatar").className =
		"avatar " + (isAdmin ? "admin-avatar" : "client-avatar");

	// Active user in dropdown
	document
		.getElementById("opt-admin")
		.classList.toggle("active", isAdmin);
	document
		.getElementById("opt-client")
		.classList.toggle("active", !isAdmin);

	// Show/hide "+ Новый тур" nav tab
	document.getElementById("tab-new-tour-btn").style.display = isAdmin
		? ""
		: "none";

	// Show/hide add-btns inside tour rows
	document
		.querySelectorAll(".add-btn")
		.forEach((b) => (b.style.display = isAdmin ? "" : "none"));
}

function bookTour(name) {
	showToast("✅ Тур «" + name + "» добавлен в избранное");
}

// ─── TOUR DETAIL MODAL ───────────────────────────────────
function openTourModal(id) {
	const t = allTours.find((t) => t.id === id);
	if (!t) return;

	const months = [
		"января",
		"февраля",
		"марта",
		"апреля",
		"мая",
		"июня",
		"июля",
		"августа",
		"сентября",
		"октября",
		"ноября",
		"декабря",
	];

	// Cover image
	const coverImg = document.getElementById("tmd-cover");
	const coverPlaceholder = document.getElementById(
		"tmd-cover-placeholder",
	);
	if (t.coverUrl) {
		coverImg.src = t.coverUrl;
		coverImg.style.display = "block";
		coverPlaceholder.style.display = "none";
	} else {
		coverImg.src = TOUR_IMAGE;
		coverImg.style.display = "block";
		coverPlaceholder.style.display = "none";
		coverImg.onerror = () => {
			coverImg.style.display = "none";
			coverPlaceholder.style.display = "flex";
			coverPlaceholder.textContent = t.city;
		};
	}

	// Title
	document.getElementById("tmd-title").textContent = t.name;

	// Tags
	const tagsEl = document.getElementById("tmd-tags");
	tagsEl.innerHTML = `
    <span class="tour-modal-tag price">${t.price}</span>
    <span class="tour-modal-tag">${t.city}</span>
    <span class="tour-modal-tag">${t.days}</span>
    ${t.country ? `<span class="tour-modal-tag">${t.country}</span>` : ""}
  `;

	// Description
	document.getElementById("tmd-desc").textContent = t.desc;

	// Details rows
	const details = [];
	if (t.dateStart && t.dateEnd) {
		const s = new Date(t.dateStart + "T00:00:00");
		const e = new Date(t.dateEnd + "T00:00:00");
		const diff = Math.round((e - s) / 86400000);
		details.push({
			icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>`,
			label: "Даты",
			value: `${s.getDate()} ${months[s.getMonth()]} — ${e.getDate()} ${months[e.getMonth()]}`,
		});
		if (diff > 0)
			details.push({
				icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>`,
				label: "Продолжительность",
				value: diff + " " + pluralDays(diff),
			});
	}
	if (t.hotel)
		details.push({
			icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
			label: "Отель",
			value: t.hotel,
		});
	if (t.transport)
		details.push({
			icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/></svg>`,
			label: "Транспорт",
			value: t.transport,
		});
	details.push({
		icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>`,
		label: "Город",
		value: t.city + (t.country ? ", " + t.country : ""),
	});

	document.getElementById("tmd-details").innerHTML = details
		.map(
			(d) => `
    <div class="tour-modal-detail-row">
      <span class="tour-modal-detail-label">${d.icon}${d.label}</span>
      <span class="tour-modal-detail-value">${d.value}</span>
    </div>
  `,
		)
		.join("");

	// Book button
	document.getElementById("tmd-book-btn").onclick = () => {
		showToast("✅ Тур «" + t.name + "» забронирован!");
		closeTourModal();
	};

	// Scroll modal to top and open
	document.getElementById("tourDetailContent").scrollTop = 0;
	document.getElementById("tourDetailModal").classList.add("open");
	document.body.style.overflow = "hidden";
}

function closeTourModal(e) {
	// Close on backdrop click or explicit call
	if (e && e.target !== document.getElementById("tourDetailModal"))
		return;
	document.getElementById("tourDetailModal").classList.remove("open");
	document.body.style.overflow = "";
}

// Close tour modal on Escape key
document.addEventListener("keydown", (e) => {
	if (e.key === "Escape") {
		document
			.getElementById("tourDetailModal")
			.classList.remove("open");
		document.body.style.overflow = "";
	}
});

// ─── RENDER CARDS ────────────────────────────────────────
function renderCards(tours, containerId) {
	const row = document.getElementById(containerId);
	Array.from(row.querySelectorAll(".tour-card")).forEach((c) =>
		c.remove(),
	);
	const isAdmin = currentRole === "admin";
	tours.forEach((t) => {
		const card = document.createElement("div");
		card.className = "tour-card";
		card.dataset.id = t.id;
		card.innerHTML = `
      <img class="tour-card-img" src="${t.coverUrl || TOUR_IMAGE}" alt="${t.name}" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
      <div class="tour-card-img-placeholder" style="display:none">${t.city}</div>
      <div class="tour-card-title-row">
        <span class="tour-card-title">${t.name}</span>
        <span class="price-badge">${t.price}</span>
      </div>
      <div class="tour-card-meta">
        <div class="tags">
          <span class="tag">${t.city}</span>
          <span class="tag">${t.days}</span>
        </div>
        ${
					isAdmin
						? `<button class="edit-btn" title="Редактировать" onclick="event.stopPropagation();editTour(${t.id})">
               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                 <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                 <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
               </svg>
             </button>`
						: `<button class="book-btn" onclick="event.stopPropagation();bookTour('${t.name}')">Забронировать</button>`
				}
      </div>
      <p class="tour-card-desc">${t.desc}</p>
    `;
		if (isAdmin) {
			card.addEventListener("contextmenu", (e) => {
				e.preventDefault();
				openDeleteModal(t.id, t.name);
			});
		} else {
			card.addEventListener("click", () => openTourModal(t.id));
		}
		row.appendChild(card);
	});
}

function renderAll() {
	renderCards(
		allTours.filter((t) => t.category === "recent"),
		"row-recent",
	);
	renderCards(
		allTours.filter((t) => t.category === "russia"),
		"row-russia",
	);
	renderCards(
		allTours.filter((t) => t.category === "abroad"),
		"row-abroad",
	);
}
renderAll();
applyRole();

// ─── TABS ────────────────────────────────────────────────
function showTab(name, el) {
	document
		.querySelectorAll('[id^="tab-"]')
		.forEach((t) => (t.style.display = "none"));
	document
		.querySelectorAll(".nav-tab")
		.forEach((t) => t.classList.remove("active"));
	document.getElementById("tab-" + name).style.display = "block";
	el.classList.add("active");
	// Reset edit mode when going back to tours list
	if (name === "tours") {
		editingId = null;
		document.getElementById("tab-new-tour-btn").textContent =
			"+ Новый тур";
	}
}

let editingId = null; // null = create mode, number = edit mode

function switchToNewTour() {
	if (currentRole !== "admin") return;
	editingId = null;
	document.getElementById("tab-new-tour-btn").textContent =
		"+ Новый тур";
	document
		.querySelectorAll('[id^="tab-"]')
		.forEach((t) => (t.style.display = "none"));
	document
		.querySelectorAll(".nav-tab")
		.forEach((t) => t.classList.remove("active"));
	document.getElementById("tab-new-tour").style.display = "block";
	document.getElementById("tab-new-tour-btn").classList.add("active");
	resetForm();
}

function resetForm() {
	[
		"inp-name",
		"inp-start",
		"inp-end",
		"inp-country",
		"inp-city",
		"inp-hotel",
		"inp-price",
	].forEach((fid) => {
		const el = document.getElementById(fid);
		if (el) {
			el.value = "";
			el.classList.remove("valid", "invalid");
		}
	});
	[
		"err-name",
		"err-start",
		"err-end",
		"err-country",
		"err-city",
		"err-price",
	].forEach((fid) => {
		const el = document.getElementById(fid);
		if (el) el.classList.remove("show");
	});
	document
		.querySelectorAll("#events-list .checkbox-item")
		.forEach((item) => {
			item.classList.remove("checked");
			const d = item.querySelector(".event-date");
			if (d) d.value = "";
		});
	renderProgramme();
	removeImage(
		null,
		"cover-upload",
		"cover-preview",
		"cover-file-input",
	);
	removeImage(
		null,
		"cover-upload-3",
		"cover-preview-3",
		"cover-file-input-3",
	);
	document.getElementById("step2-num").style.background = "#e8e8e8";
	document.getElementById("step2-num").style.color = "#888";
	document.getElementById("step3-num").style.background = "#e8e8e8";
	document.getElementById("step3-num").style.color = "#888";
	document.getElementById("btn-publish").textContent = "Опубликовать";
	updatePreview();
}

// ─── SEARCH ──────────────────────────────────────────────
function filterTours(q) {
	q = q.toLowerCase();
	document.querySelectorAll(".tour-card").forEach((card) => {
		const name = card
			.querySelector(".tour-card-title")
			.textContent.toLowerCase();
		card.style.display = name.includes(q) ? "" : "none";
	});
}

// ─── EDIT ────────────────────────────────────────────────
function editTour(id) {
	if (currentRole !== "admin") return;
	const t = allTours.find((t) => t.id === id);
	if (!t) return;

	editingId = id;

	// Switch to form tab and update label
	document
		.querySelectorAll('[id^="tab-"]')
		.forEach((t) => (t.style.display = "none"));
	document
		.querySelectorAll(".nav-tab")
		.forEach((t) => t.classList.remove("active"));
	document.getElementById("tab-new-tour").style.display = "block";
	document.getElementById("tab-new-tour-btn").classList.add("active");
	document.getElementById("tab-new-tour-btn").textContent =
		"✏️ Редактирование";

	// Fill fields
	document.getElementById("inp-name").value = t.name;
	document.getElementById("inp-city").value = t.city;
	document.getElementById("inp-country").value = t.country || "";
	document.getElementById("inp-price").value = t.price
		.replace(/[^\d]/g, "")
		.trim();
	document.getElementById("inp-hotel").value = t.hotel || "";
	if (t.dateStart)
		document.getElementById("inp-start").value = t.dateStart;
	if (t.dateEnd) document.getElementById("inp-end").value = t.dateEnd;
	if (t.transport) {
		const sel = document.getElementById("inp-transport");
		[...sel.options].forEach((o, i) => {
			if (o.text === t.transport) sel.selectedIndex = i;
		});
	}

	// If tour has a cover, show it in the upload zone
	if (t.coverUrl) {
		const zone = document.getElementById("cover-upload");
		const img = document.getElementById("cover-preview");
		img.src = t.coverUrl;
		zone.classList.add("has-image");
	} else {
		removeImage(
			null,
			"cover-upload",
			"cover-preview",
			"cover-file-input",
		);
	}

	// Clear validation state
	[
		"inp-name",
		"inp-start",
		"inp-end",
		"inp-country",
		"inp-city",
		"inp-price",
	].forEach((fid) => {
		const el = document.getElementById(fid);
		el.classList.remove("invalid", "valid");
		const err = document.getElementById(
			"err-" + fid.replace("inp-", ""),
		);
		if (err) err.classList.remove("show");
	});

	// Change publish button label
	document.getElementById("btn-publish").textContent =
		"Сохранить изменения";

	// Steps: mark step 1 as active
	document.getElementById("step2-num").style.background = "#e8e8e8";
	document.getElementById("step2-num").style.color = "#888";
	document.getElementById("step3-num").style.background = "#e8e8e8";
	document.getElementById("step3-num").style.color = "#888";

	updatePreview();
	showToast("Редактирование: " + t.name);
}

// ─── DELETE ──────────────────────────────────────────────
function openDeleteModal(id, name) {
	toDeleteId = id;
	document.getElementById("modal-tour-name").textContent =
		`Удалить тур «${name}»? Это нельзя отменить.`;
	document.getElementById("deleteModal").classList.add("open");
}
function closeModal() {
	document.getElementById("deleteModal").classList.remove("open");
}
function deleteTour() {
	const i = allTours.findIndex((t) => t.id === toDeleteId);
	if (i !== -1) {
		const name = allTours[i].name;
		allTours.splice(i, 1);
		renderAll();
		showToast("Тур «" + name + "» удалён");
	}
	closeModal();
}

// ─── VALIDATION ──────────────────────────────────────────
const validationRules = {
	name: {
		required: true,
		minLength: 3,
		msg: "Введите название (мин. 3 символа)",
	},
	start: { required: true, msg: "Укажите дату начала" },
	end: {
		required: true,
		msg: "Укажите дату окончания (после начала)",
		custom: () => {
			const s = document.getElementById("inp-start").value;
			const e = document.getElementById("inp-end").value;
			return !s || !e || new Date(e) >= new Date(s);
		},
	},
	country: { required: true, msg: "Укажите страну" },
	city: { required: true, msg: "Укажите город" },
	price: {
		required: true,
		msg: "Введите корректную цену (> 0)",
		custom: () => {
			const v = document.getElementById("inp-price").value;
			return v && Number(v) > 0;
		},
	},
};

function validateField(input, key) {
	const rule = validationRules[key];
	if (!rule) return true;
	const errEl = document.getElementById("err-" + key);
	let valid = true;
	let msg = rule.msg;

	if (rule.required && !input.value.trim()) valid = false;
	else if (
		rule.minLength &&
		input.value.trim().length < rule.minLength
	)
		valid = false;
	else if (rule.custom && !rule.custom()) valid = false;

	input.classList.toggle("invalid", !valid);
	input.classList.toggle("valid", valid && input.value.trim() !== "");
	if (errEl) {
		errEl.textContent = msg;
		errEl.classList.toggle(
			"show",
			(!valid && input.value.trim() !== "") ||
				(!valid && input === document.activeElement),
		);
	}
	return valid;
}

function validateStep1() {
	const fields = [
		{ el: document.getElementById("inp-name"), key: "name" },
		{ el: document.getElementById("inp-start"), key: "start" },
		{ el: document.getElementById("inp-end"), key: "end" },
		{ el: document.getElementById("inp-country"), key: "country" },
		{ el: document.getElementById("inp-city"), key: "city" },
		{ el: document.getElementById("inp-price"), key: "price" },
	];
	// trigger validation on all required fields
	let allValid = true;
	fields.forEach((f) => {
		const ok = validateField(f.el, f.key);
		if (!ok) {
			f.el.classList.add("invalid");
			const errEl = document.getElementById("err-" + f.key);
			if (errEl) errEl.classList.add("show");
			allValid = false;
		}
	});
	return allValid;
}

// ─── STEP LOGIC ──────────────────────────────────────────
function confirmStep1() {
	if (!validateStep1()) {
		showToast("⚠️ Заполните обязательные поля");
		return;
	}
	document.getElementById("step2-num").style.background =
		"var(--green-accent)";
	document.getElementById("step2-num").style.color = "#222";
	showToast("Шаг 1 подтверждён ✓");
	updatePreview();
}

function confirmStep2() {
	const checked = document.querySelectorAll(
		"#events-list .checkbox-item.checked",
	);
	if (checked.length === 0) {
		showToast("⚠️ Выберите хотя бы одно событие");
		return;
	}
	document.getElementById("step3-num").style.background =
		"var(--green-accent)";
	document.getElementById("step3-num").style.color = "#222";
	showToast("События выбраны ✓");
	renderProgramme();
}

function renderProgramme() {
	const checked = document.querySelectorAll(
		"#events-list .checkbox-item.checked",
	);
	if (checked.length === 0) {
		document.getElementById("prev-programme").innerHTML =
			'<div style="font-size:13px;color:var(--text-secondary);font-style:italic;padding:8px 0">События появятся после выбора на Шаге 2</div>';
		return;
	}

	const months = [
		"января",
		"февраля",
		"марта",
		"апреля",
		"мая",
		"июня",
		"июля",
		"августа",
		"сентября",
		"октября",
		"ноября",
		"декабря",
	];

	// Group events by date
	const byDate = {};
	const noDates = [];
	checked.forEach((item) => {
		const name = item.dataset.name;
		const dateVal = item.querySelector(".event-date")?.value;
		if (dateVal) {
			if (!byDate[dateVal]) byDate[dateVal] = [];
			byDate[dateVal].push(name);
		} else {
			noDates.push(name);
		}
	});

	// Sort dates
	const sortedDates = Object.keys(byDate).sort();

	let html = "";
	let dayNum = 1;

	sortedDates.forEach((dateStr) => {
		const d = new Date(dateStr + "T00:00:00");
		const label = `${d.getDate()} ${months[d.getMonth()]}`;
		html += `
      <div class="preview-day-header" style="${dayNum > 1 ? "margin-top:12px" : ""}">
        <span>День ${dayNum}</span>
        <span class="preview-day-date">${label}</span>
      </div>`;
		byDate[dateStr].forEach((name) => {
			html += `<div class="preview-event">${name}</div>`;
		});
		dayNum++;
	});

	// Events without a date go at the end under "Без даты"
	if (noDates.length > 0) {
		html += `
      <div class="preview-day-header" style="${dayNum > 1 ? "margin-top:12px" : ""}">
        <span>День ${dayNum}</span>
        <span class="preview-day-date" style="color:#aaa">Дата не указана</span>
      </div>`;
		noDates.forEach((name) => {
			html += `<div class="preview-event">${name}</div>`;
		});
	}

	document.getElementById("prev-programme").innerHTML = html;
}

function toggleCheck(el) {
	el.classList.toggle("checked");
	// Re-render programme live whenever a checkbox changes
	renderProgramme();
}

function publishTour() {
	if (!validateStep1()) {
		showToast("⚠️ Вернитесь к Шагу 1 и заполните обязательные поля");
		return;
	}
	const name = document.getElementById("inp-name").value;
	const city = document.getElementById("inp-city").value;
	const country = document.getElementById("inp-country").value;
	const hotel = document.getElementById("inp-hotel").value;
	const price = document.getElementById("inp-price").value;
	const dateStart = document.getElementById("inp-start").value;
	const dateEnd = document.getElementById("inp-end").value;
	const transport = document.getElementById("inp-transport").value;
	const priceFmt = Number(price).toLocaleString("ru") + " ₽";
	const coverPreview = document.getElementById("cover-preview");
	const newCoverUrl = coverPreview?.src?.startsWith("data:")
		? coverPreview.src
		: null;

	if (editingId !== null) {
		// ── SAVE EXISTING TOUR ──
		const t = allTours.find((t) => t.id === editingId);
		if (t) {
			t.name = name;
			t.city = city;
			t.country = country;
			t.hotel = hotel;
			t.price = priceFmt;
			t.dateStart = dateStart;
			t.dateEnd = dateEnd;
			t.transport = transport;
			if (newCoverUrl) t.coverUrl = newCoverUrl;
			// Recalculate days from dates
			if (dateStart && dateEnd) {
				const diff = Math.round(
					(new Date(dateEnd) - new Date(dateStart)) / 86400000,
				);
				t.days = diff > 0 ? diff + " " + pluralDays(diff) : t.days;
			}
			renderAll();
			showToast("Тур «" + name + "» обновлён ✓");
		}
		editingId = null;
		document.getElementById("tab-new-tour-btn").textContent =
			"+ Новый тур";
	} else {
		// ── CREATE NEW TOUR ──
		let days = "7 дней";
		if (dateStart && dateEnd) {
			const diff = Math.round(
				(new Date(dateEnd) - new Date(dateStart)) / 86400000,
			);
			if (diff > 0) days = diff + " " + pluralDays(diff);
		}
		allTours.unshift({
			id: Date.now(),
			name,
			price: priceFmt,
			city,
			country,
			hotel,
			dateStart,
			dateEnd,
			transport,
			days,
			category: "recent",
			desc: "Новый тур добавлен администратором.",
			coverUrl: newCoverUrl,
		});
		renderAll();
		showToast("Тур «" + name + "» опубликован!");
	}

	// Reset form and go back to tours
	resetForm();
	showTab("tours", document.querySelector(".nav-tab:first-child"));
}

function pluralDays(n) {
	if (n % 10 === 1 && n % 100 !== 11) return "день";
	if ([2, 3, 4].includes(n % 10) && ![12, 13, 14].includes(n % 100))
		return "дня";
	return "дней";
}
function handleDragOver(e, zoneId) {
	e.preventDefault();
	document.getElementById(zoneId).classList.add("drag-over");
}
function handleDragLeave(zoneId) {
	document.getElementById(zoneId).classList.remove("drag-over");
}
function handleDrop(e, zoneId, previewId) {
	e.preventDefault();
	const zone = document.getElementById(zoneId);
	zone.classList.remove("drag-over");
	const file = e.dataTransfer.files[0];
	if (file && file.type.startsWith("image/"))
		loadImageToZone(file, zone, previewId);
	else showToast("⚠️ Пожалуйста, загрузите изображение");
}
function handleFileSelect(e, zoneId, previewId) {
	const file = e.target.files[0];
	if (file)
		loadImageToZone(file, document.getElementById(zoneId), previewId);
}
function loadImageToZone(file, zone, previewId) {
	const reader = new FileReader();
	reader.onload = (ev) => {
		const img = document.getElementById(previewId);
		img.src = ev.target.result;
		zone.classList.add("has-image");
		showToast("Фото загружено ✓");
	};
	reader.readAsDataURL(file);
}
function removeImage(e, zoneId, previewId, inputId) {
	if (e) e.stopPropagation();
	const zone = document.getElementById(zoneId);
	const img = document.getElementById(previewId);
	const inp = document.getElementById(inputId);
	if (zone) zone.classList.remove("has-image");
	if (img) img.src = "";
	if (inp) inp.value = "";
}

// ─── PREVIEW ─────────────────────────────────────────────
function updatePreview() {
	const name =
		document.getElementById("inp-name").value || "Тур по Сочи";
	const hotel =
		document.getElementById("inp-hotel").value || "Four Seasons";
	const price = document.getElementById("inp-price").value;
	const priceFmt = price
		? Number(price).toLocaleString("ru") + " ₽"
		: "24 000 ₽";
	const start = document.getElementById("inp-start").value;
	const end = document.getElementById("inp-end").value;

	document.getElementById("prev-name").textContent = name;
	document.getElementById("prev-hotel").textContent = hotel;
	document.getElementById("prev-price").textContent = priceFmt;

	if (start && end) {
		const s = new Date(start + "T00:00:00");
		const e = new Date(end + "T00:00:00");
		const months = [
			"января",
			"февраля",
			"марта",
			"апреля",
			"мая",
			"июня",
			"июля",
			"августа",
			"сентября",
			"октября",
			"ноября",
			"декабря",
		];
		document.getElementById("prev-dates").textContent =
			`${s.getDate()} — ${e.getDate()} ${months[s.getMonth()]}`;
	}
}

// ─── TOAST ───────────────────────────────────────────────
let toastTimer;
function showToast(msg) {
	const t = document.getElementById("toast");
	document.getElementById("toast-text").textContent = msg;
	t.classList.add("show");
	clearTimeout(toastTimer);
	toastTimer = setTimeout(() => t.classList.remove("show"), 2800);
}

// Wire event-date inputs to live re-render programme
document.addEventListener("DOMContentLoaded", () => {
	document.querySelectorAll(".event-date").forEach((input) => {
		input.addEventListener("change", renderProgramme);
	});
});

