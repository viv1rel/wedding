# Свадебный сайт-приглашение — Алексей и Карина

Одностраничный лендинг с приглашением на свадьбу **14 августа 2026 года**.

## Стек

- HTML5 + Tailwind CSS (локальная сборка `assets/css/tailwind.min.css`, без CDN)
- Чистый JavaScript (без зависимостей)
- Self-hosted шрифты Cormorant Garamond + Inter (`.woff2`)
- Деплой на GitHub Pages (кастомный домен через `CNAME`)

## Структура проекта

```
wedding/
├── index.html               # Разметка страницы
├── 404.html                 # Страница 404 для GitHub Pages
├── CNAME                    # Кастомный домен для GitHub Pages
├── favicon.png
├── robots.txt
├── README.md
├── .gitignore
└── assets/
    ├── css/
    │   ├── tailwind.min.css  # Минифицированный Tailwind
    │   └── styles.css        # Все кастомные стили
    ├── js/
    │   ├── envelope.js       # Welcome: обложка + intro-видео
    │   ├── countdown.js      # Обратный отсчёт
    │   ├── reveal.js         # Reveal-on-scroll + lazy iframe
    │   ├── music.js          # Плавающая кнопка музыки
    │   └── rsvp.js           # RSVP через Google Apps Script
    ├── fonts/                # Self-hosted .woff2 + fonts.css
    ├── audio/
    │   └── music.mp3         # Фоновая музыка
    ├── video/
    │   ├── intro-video.mp4   # Анимация открытия конверта
    │   └── hero-bg.mp4       # Фон-видео для hero
    └── images/
        ├── envelope-cover.webp  # Welcome-обложка
        └── venue.webp           # Фото зала
```

## Локальный запуск

```bash
python3 -m http.server 8000
# http://localhost:8000
```

Открывать через `file://` не рекомендуется: ломаются автоплей и относительные пути.

## RSVP — Google Apps Script

Форма отправляет ответы в Google-таблицу через **Apps Script Web App**.
URL прокси хранится прямо в `assets/js/rsvp.js` (константа `GOOGLE_PROXY_URL`) — он публичный, секрета не содержит.

Сам Apps Script (на стороне Google) должен:
1. Принимать `doPost(e)` и читать `JSON.parse(e.postData.contents)`.
2. Возвращать `ContentService.createTextOutput(JSON.stringify({status:'success'})).setMimeType(ContentService.MimeType.JSON)` (на ошибке — `{status:'error', error: '...'}`). Клиент в `rsvp.js` проверяет именно поле `status`.
3. Быть опубликованным как Web App с доступом «Anyone».

Запрос с клиента идёт `Content-Type: text/plain` — это намеренно: так не вызывается CORS-preflight,
а Apps Script всё равно читает тело из `e.postData.contents`.

## Деплой

Сайт хостится на **GitHub Pages** из ветки `main` (корень репозитория).
Любой push в `main` автоматически публикует новую версию.

```bash
git add .
git commit -m "Описание изменений"
git push origin main
```

Через ~1 минуту изменения появятся на сайте. CSP и прочие security-заголовки заданы
через `<meta http-equiv>` в `index.html` — GitHub Pages не позволяет настраивать
HTTP-заголовки напрямую.

После любых изменений в ассетах **бампайте `?v=N`** в `index.html`,
чтобы браузеры скачали свежие файлы.

## Где что менять

| Что | Где |
|---|---|
| Имена, дата, тексты, расписание, дресс-код, контакты | `index.html` |
| Дата/время отсчёта | `assets/js/countdown.js`, константа `target` |
| URL Google-прокси для RSVP | `assets/js/rsvp.js`, константа `GOOGLE_PROXY_URL` |
| Палитра и шрифты | `assets/css/styles.css` + `assets/css/tailwind.min.css` |
| Музыка | `assets/audio/music.mp3` |
| Видео фон / intro | `assets/video/*.mp4` |
| Адрес и карта | `index.html` (ссылка на Яндекс.Карты) |
