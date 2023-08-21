# ekaterinburg-plan

Генплан Екатеринбурга. Приложение для просмотра изменений на картах 2025 и 2045.

**[map.genplanekb.city](https://map.genplanekb.city)**

<img src="https://github.com/a-chabin/ekaterinburg-plan/assets/22644149/9ec049eb-e0c9-4fce-86bc-bd023634e19a" alt="" width="65%">


## О проекте
Просмотрщик помогает работникам местных СМИ и городским активистам просматривать изменения в генплане, не скачивая десятки `.pdf` файлов [с сайта администрации Екатеринбурга](https://xn--90agdcm3aczs9j.xn--80acgfbsl1azdqr.xn--p1ai/discus/514). Более подробная информация об изменениях и проводимых общественных слушаниях размещена на сайте общественной организации [«Мирные жители»](https://peacefulpeople.ru/genplan)‎‎.

### Возможности
- Просмотр изображений с помощью [Viewer.js](https://github.com/fengyuanchen/viewerjs)
- Управление с клавиатуры
  - `Shift + ↑/→/↓/←` — Перемещение по карте
  - `Ctr +/-` — Зум
  - `Esc` / `0` — Сброс зума
  - `Tab` — Переключение между элементами управления


## Настройки

### Изображения
Планы и легенды находятся в подпапках [`/plans`](https://github.com/a-chabin/ekaterinburg-plan/tree/main/plans):
```
plans/
│
└───2023-ratified/
│   ├── ОМЗ Велоинфраструктура.map.png
│   ├── ОМЗ Велоинфраструктура.legend.png
│   │   ...
└───2021-raitified/
│   ├── ОМЗ Велоинфраструктура.map.png
│   ├── ОМЗ Велоинфраструктура.legend.png
│   │   ...
```

### Версии плана
Список версий генплана задается в [`/plans/versions.js`](https://github.com/a-chabin/ekaterinburg-plan/blob/main/plans/versions.js):
```js
[
  {
    id: '2023-ratified',
    name: 'Утверждённый',
    caption: 'генплан до 2045',
    default: true
  },
  {
    id: '2021-ratified',
    name: 'Старый',
    caption: 'генплан до 2025'
  }
  ...
];
```

### Список планов
Список планов и указание доступных версий для них задается в [`/plans/plans.js`](https://github.com/a-chabin/ekaterinburg-plan/blob/main/plans/plans.js):
```js
[
  {
    name: 'Функциональные зоны',
    versions: ['2023-ratified', '2022-discussion', '2021-ratified'],
    default: true
  },
  {
    name: 'Велоинфраструктура',
    versions: ['2022-discussion']
  },
  ...
];
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
Код просмотрщика может быть использован в любых целях для любых проектов в рамках лицензии MIT.
