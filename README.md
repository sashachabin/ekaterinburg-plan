# ekaterinburg-plan

Карта генерального плана Екатеринбурга 2025 — [map.genplanekb.city](https://map.genplanekb.city).

Позволяет жителям города сравнить изменения в текущем и будущем генеральных планах Екатеринбурга.

![](https://i.ibb.co/93kswdv/2021-10-11-02-10-52.png)

## Технологии
- Ванильные HTML+JS+CSS
- Просмотр карт через [Viewer.js](https://github.com/fengyuanchen/viewerjs) 
- Деплой на [Vercel](https://vercel.com/)

### Установка

Требуется [Node.js](https://nodejs.org/en/), для установки выполнить

```
npm i
```

### Разработка

Dev-сервер с hot-reload

```
npm run dev
```


## Управление
- Изображения с легендами в папке `/images`
- Названия и ссылки на планы и легенды в JS-объекте `PLANS`:
  ```js
  const PLANS = [
    {
      title: "Общественный транспорт",
      map: "plan-public-transport.jpg",
      legend: "legend-new.jpg"
    }
    ...
  ];
  ```

## Авторы
- [Алексей Кофман](https://twitter.com/alex_kofman) — идейный вдохновитель, подгтовка карт
- [Александр Чабин](https://twitter.com/nibach) — фронт-энд разработчик
- [Никита Коновалов](https://twitter.com/n_konovalov) — дизайнер
