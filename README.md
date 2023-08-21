# ekaterinburg-plan

Генплан Екатеринбурга. Приложение для просмотра изменений на картах 2025 и 2045.

**[map.genplanekb.city](https://map.genplanekb.city)**

<img src="https://github.com/a-chabin/ekaterinburg-plan/assets/22644149/9ec049eb-e0c9-4fce-86bc-bd023634e19a" alt="" width="65%">


## О проекте
Просмотрщик помогает работникам местных СМИ и городским активистам просматривать изменения в генплане, не выкачивая десятки `.pdf` файлов [с сайта администрации Екатеринбурга](https://xn--90agdcm3aczs9j.xn--80acgfbsl1azdqr.xn--p1ai/discus/514). Более подробная информация об изменениях и проводимых общественных слушаниях размещена на сайте общественной организации [«Мирные жители»](https://peacefulpeople.ru/genplan).

### Возможности
- Просмотр изображений с помощью [Viewer.js](https://github.com/fengyuanchen/viewerjs)
- Управление с клавиатуры
  - `Shift + ↑/→/↓/←` — Перемещение по карте
  - `Ctr +/-` — zoom
  - `Esc` / `0` — Сброс zoom
  - `Tab`, `Shift + Tab` — Переключение между элементами управления


## Настройки

### Файлы планов
Планы и легенды находятся в подпапках с названием версий внутри [`/plans`](https://github.com/a-chabin/ekaterinburg-plan/tree/main/plans):
```sh
plans/
│
└───2023-ratified/                          # Версия плана
│   ├── ОМЗ Велоинфраструктура.map.png      # План
│   ├── ОМЗ Велоинфраструктура.legend.png   # Легенда
│   │   ...
└───2021-raitified/
│   ├── ОМЗ Велоинфраструктура.map.png
│   ├── ОМЗ Велоинфраструктура.legend.png
│   │   ...
```

### Версии плана
Список версий генплана задается в [`/plans/versions.json`](https://github.com/a-chabin/ekaterinburg-plan/blob/main/plans/versions.json):
```json5
[
  {
    "id": "2023-ratified",
    "name": "Утверждённый",
    "caption": "генплан до 2045",
  },
  {
    "id": "2021-ratified",
    "name": "Старый",
    "caption": "генплан до 2025"
  },
  // ...
]
```

### Список планов
Список планов с указанием доступных для них версий задается в [`/plans/plans.json`](https://github.com/a-chabin/ekaterinburg-plan/blob/main/plans/plans.json)
```json5
[
  {
    "name": "Функциональные зоны",
    "versions": ["2023-ratified", "2022-discussion", "2021-ratified"]
  },
  {
    "name": "Велоинфраструктура",
    "versions": ["2022-discussion"]
  },
  // ...
]
```

## Разработка
1. Установить [Node.js](https://nodejs.org/en/download/)

2. Установить зависимости
```
npm i
```

3. Запустить
```
npm start
```

## Авторы
- [Алексей Кофман](https://twitter.com/alex_kofman) — автор идеи, подготовка планов
- [Никита Коновалов](https://twitter.com/n_konovalov) — дизайн
- [Александр Чабин](https://twitter.com/nibach) — разработка

---
Код просмотрщика может быть использован в любых целях для любых проектов с указанием авторства (лицензия MIT).
