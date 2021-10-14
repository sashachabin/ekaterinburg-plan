# ekaterinburg-plan

Карта генерального плана Екатеринбурга 2025 — [map.genplanekb.city](https://map.genplanekb.city).

Позволяет жителям города сравнить изменения в текущем и будущем генеральных планах Екатеринбурга.

![image](https://user-images.githubusercontent.com/22644149/137258319-c921331c-d058-46e9-9f19-39623db89fbd.png)


## Возможности
- Просмотр планов города с zoom и draggable
- Переключение планов
- Легенда
- Управление с клавиатуры
  - `Shift + ↑/→/↓/←` — Перемещение по карте
  - `Ctr +/-` — Зум
  - `Esc` / `0` — Сброс зума
  - `Tab` — Переключение между элементами управления

## Технологии
- Ванильные HTML+JS+CSS
- Просмотр карт через [Viewer.js](https://github.com/fengyuanchen/viewerjs) 
- Деплой на [Vercel](https://vercel.com/)

## Запуск

Выгрузить репозиторий и запустить `index.html`

### Управление
- Изображения с легендами и планами в папке `/images`
- Названия и ссылки на планы и легенды в JS-объекте в файле `data.js`:
  ```js
  const PLANS = [
    {
      title: 'Общественный транспорт',
      map: 'plan-public-transport.jpg',
      legend: 'legend-new.jpg'
    }
    ...
  ];
  ```

## Авторы
- [Алексей Кофман](https://twitter.com/alex_kofman) — идейный вдохновитель, подгтовка карт
- [Александр Чабин](https://twitter.com/nibach) — разработчик
- [Никита Коновалов](https://twitter.com/n_konovalov) — дизайнер и разработчик
