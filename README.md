# ekaterinburg-plan

Генплан Екатеринбурга. Инструмент для сравнения версий 2025 и 2045

**[map.genplanekb.city](https://map.genplanekb.city)**

![image](https://user-images.githubusercontent.com/22644149/137645893-c2bd0229-08c2-4d2f-9a7a-32f6399776a7.png)

Подробная информация о плане и общественных слушаниях доступна на сайте [genplanekb.city](http://genplanekb.city/) и на [сайте администрации города](https://xn--90agdcm3aczs9j.xn--80acgfbsl1azdqr.xn--p1ai/discus/348).

## Возможности
- Просмотр планов города с zoom и draggable
- Переключение планов
- Легенда
- Управление с клавиатуры
  - `Shift + ↑/→/↓/←` — Перемещение по карте
  - `Ctr +/-` — Зум
  - `Esc` / `0` — Сброс зума
  - `Tab` — Переключение между элементами управления

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

### Настройки
- Изображения с легендами и планами в папке `/plans/`
- Названия и ссылки на планы и легенды в JS-объекте в файле `/plans/plans.js`:
  ```js
  [
    {
      name: 'Функциональные зоны',
      versions: ['2021-ratified', '2022-discussion'],
      default: true
    },
    ...
  ];
  ```
- Описанине версий генплана `/plans/versions.js`:
  ```js
  [
    {
      id: '2022-discussion',
      name: 'Обсуждение',
      caption: 'генплан до 2045',
      default: true
    }
    ...
  ];
  ```

## Технологии

- [Vite](https://vitejs.dev/)
- Просмотрщик [Viewer.js](https://github.com/fengyuanchen/viewerjs) 
- Деплой на [Vercel](https://vercel.com/)

<br />

> ### Рекомендации
> Данный проект сделан в рамках хакатона, срок жизни — 1 неделя, до окончания проведения общественных слушаний.
> Мы подготовили несколько советов, если вам потребуется реализовать подобный просмотрщик:
> #### Изображения
> - Используйте форматы изображений AVIF и WebP вместо PNG и JPG и теги `<picture>` и `<source>` для совместимости со старыми браузерами. Подробнее о сжатии, качестве, декодировании/кодировании в статье «[Using Modern Image Formats: AVIF And WebP](https://www.smashingmagazine.com/2021/09/modern-image-formats-avif-webp/)».
> - Чтобы не терять FPS при анимировании больших изображений (к примеру, >1.5 мб, 1500x1500) следует использовать более современный просмотрщик [PhotoSwipe](https://photoswipe.com/) вместо [Viewer.js](https://github.com/fengyuanchen/viewerjs). PhotoSwipe использует свойства `transform: scale(), translate()` вместо `width`, `height`, `margin`, `top` и других, которые вызывают дополнительные этапы рендеринга — `Layout` и `Paint`. Подробнее об этом в статьях «[How to create high-performance CSS animations](https://web.dev/animations-guide/)», «[Why are some animations slow?](https://web.dev/animations-overview/)» и в таблице [CSS Triggers](https://csstriggers.com/).
> #### Карты
> - Если вы работаете с картой, то разделите её на **тайлы** — маленькие кусочки. Например, на изображения 256x256 с помощью [mapslice (nodejs)](https://www.npmjs.com/package/mapslice).
> - Используйте готовые решения с кастомными картами-картинками от [Google Maps](https://developers.google.com/maps/documentation/javascript/examples/maptype-base), [Яндекс.Карты](https://yandex.ru/dev/maps/jsbox/2.1/custom_map) и бесплатные — [Leaflet](https://leafletjs.com/), [OpenLayers](https://openlayers.org/en/latest/examples/static-image.html), [polymaps](http://polymaps.org/), [kartograph](http://kartograph.org/), [PanoJS](http://www.dimin.net/software/panojs/).


## Авторы
- [Алексей Кофман](https://twitter.com/alex_kofman) — идейный вдохновитель, подготовка планов и легенд
- [Александр Чабин](https://twitter.com/nibach) — разработчик
- [Никита Коновалов](https://twitter.com/n_konovalov) — дизайнер и разработчик

