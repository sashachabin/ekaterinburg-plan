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

/* Viewer */

const image = new Image();
image.src = getImagePath(INITIAL_PLAN_TITLE, 'map');

const mapContainer = query('[data-map]');
mapContainer.appendChild(image);

const viewer = new Viewer(image, {
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
    image.style.display = 'none';
    viewer.zoomTo(minZoomRatio * 2);
  },
});

/* Zoom */

const zoomInButton = query('[data-controls-zoom-in]');
zoomInButton.addEventListener('click', () => viewer.zoom(VIEWER_ZOOM_RATIO));

const zoomOutButton = query('[data-controls-zoom-out]');
zoomOutButton.addEventListener('click', () => viewer.zoom(-VIEWER_ZOOM_RATIO));

document.addEventListener('keyup', ({ key }) => {
  const actions = {
    '0': () => viewer.zoomTo(VIEWER_ZOOM_INITIAL),
    '-': () => viewer.zoom(-VIEWER_ZOOM_RATIO),
    '=': () => viewer.zoom(+VIEWER_ZOOM_RATIO),
  };

  if (key in actions) actions[key]();
});

/* Legend */

const legend = query('[data-legend]');
const legendImage = query('[data-legend-image]');
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
