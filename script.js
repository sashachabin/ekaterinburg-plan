const PLAN_SIZE_MAXIMIZED = 14000;
const VIEWER_ZOOM_RATIO = 0.6;
const YM_COUNTER = 85861499;

const { title: INITIAL_PLAN_TITLE } = PLANS.find(x => x.default);
const { title: OLD_PLAN_TITLE } = PLANS.find(x => x.old);


/* Utils */

const query = selector => document.querySelector(selector);

const sendAnalytics = eventName => window.ym && ym(YM_COUNTER, 'reachGoal', eventName);

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


/* Loader */

const loader = query('[data-loader]');
const loaderText = query('[data-loader-text]');

const showLoader = () => loader.style.display = 'block';
const hideLoader = () => loader.style.display = 'none';
const showLoaderText = () => loaderText.style.display = 'block';
const hideLoaderText = () => loaderText.style.display = 'none';


/* Viewer */

const { innerHeight: windowHeight, innerWidth: windowWidth } = window;
const maxSideSize = Math.max(windowWidth, windowHeight);
const minZoomRatio = windowWidth > windowHeight ? 1 : 2;

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
  transition: false,
  zoomRatio: VIEWER_ZOOM_RATIO,
  maxZoomRatio: PLAN_SIZE_MAXIMIZED / maxSideSize,
  minZoomRatio,
  ready() {
    hideLoader();
    showLoaderText();
  },
  viewed() {
    planImage.style.display = 'none';
    const image = query('.viewer-canvas img');
    image.style.willChange = 'transform, opacity';
    viewer.imageData.naturalWidth = maxSideSize;
    viewer.imageData.naturalHeight = maxSideSize;
    viewer.zoomTo(2);
    // BUG Prevent viewer.reset() on window resize
    viewer.isShown = false;
    image.addEventListener('animationend', () => {
      image.style.willChange = 'none';
      image.style.opacity = 1;
      viewer.options.transition = true;
      hideLoaderText();
    });
  }
})


/* Zoom & Move */

const zoomInButton = query('[data-plan-zoom-in]');
zoomInButton.addEventListener('click', () => viewer.zoom(VIEWER_ZOOM_RATIO));

const zoomOutButton = query('[data-plan-zoom-out]');
zoomOutButton.addEventListener('click', () => viewer.zoom(-VIEWER_ZOOM_RATIO));

document.addEventListener('keyup', ({ shiftKey, key }) => {
  const { imageData: { ratio } } = viewer;

  switch (key) {
    case 'ArrowUp':
      shiftKey && viewer.move(0, 250 * ratio);
      break;

    case 'ArrowDown':
      shiftKey && viewer.move(0, -250 * ratio);
      break;

    case 'ArrowLeft':
      shiftKey && viewer.move(250 * ratio, 0);
      break;

    case 'ArrowRight':
      shiftKey && viewer.move(-250 * ratio, 0);
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
      viewer.zoomTo(minZoomRatio);
      viewer.moveTo(0, -windowHeight / 2);
      break;
  }
});


/* Legend */

const legend = query('[data-legend]');
const legendButton = query('[data-legend-button]');
const switcher = query('[data-switcher]');

const setLegend = title => {
  legendImage.src = getImagePath(title, 'legend');
};

legendButton.addEventListener('click', () => {
  legend.classList.toggle('legend_open');
  switcher.classList.toggle('map-switcher_right');
});


/* Plans */

const planToggleCurrent = query('[data-plan-toggle="current"]');
const planToggleNew = query('[data-plan-toggle="new"]');
const planNewSelect = query('[data-plan-new-select]');

const setPlan = title => {
  setLegend(title);

  const mapUrl = getImagePath(title, 'map');
  const image = query('.viewer-canvas img');

  setTimeout(() => {
    image.style.opacity = 0.2;
    image.src = mapUrl;
    showLoader();
  });

  image.onload = () => {
    image.style.opacity = 1;
    hideLoader();
  };

  sendAnalytics(title);
};

PLANS.filter(({ old }) => !old)
  .map(plan => {
    const option = document.createElement('option');
    option.text = plan.title;
    option.value = plan.title;
    return option;
  })
  .forEach(option => planNewSelect.appendChild(option));

planNewSelect.value = INITIAL_PLAN_TITLE;
planNewSelect.addEventListener('change', ({ target }) => {
  // Remove focus-visible on select after click
  planNewSelect.blur();
  setPlan(target.value)
});

planToggleNew.addEventListener('click', () => {
  planNewSelect.disabled = false;
  planToggleCurrent.classList.remove('map-toggle__button_active');
  planToggleNew.classList.add('map-toggle__button_active');
  setPlan(planNewSelect.value);
});

planToggleCurrent.addEventListener('click', () => {
  planNewSelect.disabled = true;
  planToggleNew.classList.remove('map-toggle__button_active');
  planToggleCurrent.classList.add('map-toggle__button_active');
  setPlan(OLD_PLAN_TITLE);
});
