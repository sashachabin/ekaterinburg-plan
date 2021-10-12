const VIEWER_ZOOM_RATIO = 0.6;
const VIEWER_ZOOM_INITIAL = 0;

const INITIAL_PLAN_TITLE = PLANS.find(x => x.default)['title'];
const OLD_PLAN_TITLE = PLANS.find(x => x.old)['title'];

/* Utils */

const query = selector => document.querySelector(selector);

const getImagePath = (planTitle, key) => {
  const image = PLANS.find(({ title }) => title === planTitle)[key];
  return `./images/${image}`;
};

/* Initial images */

const [planImage, legendImage] = ['map', 'legend']
  .map(key => [key, new Image()])
  .map(([key, img]) => {
    img.src = getImagePath(INITIAL_PLAN_TITLE, key);
    return img;
  });

query('[data-map]').appendChild(planImage);
query('[data-legend-menu]').appendChild(legendImage);

/* Viewer */

const viewer = new Viewer(planImage, {
  title: false,
  navbar: false,
  backdrop: false,
  toolbar: false,
  fullscreen: false,
  button: false,
  inline: true,
  keyboard: false,
  zIndexInline: 1,
  rotatable: false,
  scalable: false,
  toggleOnDblclick: false,
  slideOnTouch: false,
  tooltip: false,
  isShown: false,
  transition: true,
  zoomRatio: VIEWER_ZOOM_RATIO,
  maxZoomRatio: 4.5,
  minZoomRatio: 0.21,
  viewed() {
    const { innerHeight: windowHeight, innerWidth: windowWidth } = window;
    const minZoomRatio =
      windowHeight > windowWidth
        ? windowHeight / viewer.imageData.naturalHeight
        : windowWidth / viewer.imageData.naturalWidth;

    viewer.isShown = false;
    planImage.style.display = 'none';
    viewer.zoomTo(minZoomRatio * 2);
  },
});

/* Zoom */

const zoomInButton = query('[data-controls-zoom-in]');
zoomInButton.addEventListener('click', () => viewer.zoom(VIEWER_ZOOM_RATIO));

const zoomOutButton = query('[data-controls-zoom-out]');
zoomOutButton.addEventListener('click', () => viewer.zoom(-VIEWER_ZOOM_RATIO));

document.addEventListener('keyup', ({ shiftKey, key }) => {
  switch (key) {
    case 'ArrowUp':
      shiftKey && viewer.move(0, 250 * viewer.imageData.ratio);
      break;
    case 'ArrowDown':
      shiftKey && viewer.move(0, -250 * viewer.imageData.ratio);
      break;
    case 'ArrowLeft':
      shiftKey && viewer.move(250 * viewer.imageData.ratio, 0);
      break;
    case 'ArrowRight':
      shiftKey && viewer.move(-250 * viewer.imageData.ratio, 0);
      break;
    case '+':
    case '=':
      viewer.zoom(+VIEWER_ZOOM_RATIO);
      break;
    case '-':
      viewer.zoom(-VIEWER_ZOOM_RATIO);
      break;
    case 'Escape':
    case '0':
      viewer.zoomTo(VIEWER_ZOOM_INITIAL);
      break;
  }
});

/* Legend */

const legend = query('[data-legend]');
const legendToggleButton = query('[data-legend-button]');

const setLegend = title => {
  legendImage.src = getImagePath(title, 'legend');
};

legendToggleButton.addEventListener('click', () =>
  legend.classList.toggle('legend_open')
);

/* Plans */

const planToggleCurrent = query('[data-controls-toggle="current"]');
const planToggleNew = query('[data-controls-toggle="new"]');
const newPlanSelect = query('[data-controls-switcher]');

const setPlan = title => {
  setLegend(title);

  const mapUrl = getImagePath(title, 'map');
  const image = query('.viewer-canvas img');
  image.style.opacity = 0.99;

  setTimeout(() => {
    image.src = mapUrl;
    image.style.opacity = 0.2;
  }, 0);

  image.onload = () => {
    image.style.opacity = 1;
  };
};

PLANS.filter(({ old }) => !old)
  .map(plan => {
    const option = document.createElement('option');
    option.text = plan.title;
    option.value = plan.title;
    return option;
  })
  .forEach(option => newPlanSelect.appendChild(option));

newPlanSelect.value = INITIAL_PLAN_TITLE;
newPlanSelect.addEventListener('change', ({ target }) => setPlan(target.value));

planToggleNew.addEventListener('click', () => {
  newPlanSelect.disabled = false;
  planToggleCurrent.classList.remove('map-switcher__button_active');
  planToggleNew.classList.add('map-switcher__button_active');
  setPlan(newPlanSelect.value);
});

planToggleCurrent.addEventListener('click', () => {
  newPlanSelect.disabled = true;
  planToggleNew.classList.remove('map-switcher__button_active');
  planToggleCurrent.classList.add('map-switcher__button_active');
  setPlan(OLD_PLAN_TITLE);
});
