const PLAN_SIZE_MAXIMIZED = 14000;
const VIEWER_ZOOM_RATIO = 0.6;
const YM_COUNTER = 85861499;

const { title: INITIAL_PLAN_TITLE} = PLANS.find(x => x.default);
const { title: OLD_PLAN_TITLE} = PLANS.find(x => x.old);

const { innerHeight: windowHeight, innerWidth: windowWidth } = window;
const maxSideSize = Math.max(windowWidth, windowHeight);

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

const showLoader = () => {
  loader.style.opacity = 1;
}

const minZoomRatio = windowWidth > windowHeight ? 1 : 2;

/* Viewer */

let viewer = null;

setTimeout(() => {
  viewer = new Viewer(planImage, {
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
    minZoomRatio: 1,
    viewed() {
      viewer.imageData.naturalWidth = maxSideSize;
      viewer.imageData.naturalHeight = maxSideSize;
  
      // BUG Prevent viewer.reset() on window resize
      viewer.isShown = false;
      viewer.zoomTo(2);
      planImage.style.display = 'none';
      viewer.options.transition = true;
      hideLoader();
    },
  });
})


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
      viewer.zoomTo(minZoomRatio);
      viewer.moveTo(0, -windowHeight / 2);
      break;
  }
});

/* Legend */

const legend = query('[data-legend]');
const legendToggleButton = query('[data-legend-button]');
const switcher = query('[data-switcher]');

const setLegend = title => {
  legendImage.src = getImagePath(title, 'legend');
};

legendToggleButton.addEventListener('click', () => {
  legend.classList.toggle('legend_open');
  switcher.classList.toggle('map-switcher_right');
});

/* Plans */

const planToggleCurrent = query('[data-controls-toggle="current"]');
const planToggleNew = query('[data-controls-toggle="new"]');
const newPlanSelect = query('[data-controls-switcher]');

const setPlan = title => {
  setLegend(title);

  const mapUrl = getImagePath(title, 'map');
  const image = query('.viewer-canvas img');

  setTimeout(() => {
    image.style.opacity = 0.2;
    image.src = mapUrl;
    showLoader();
  }, 0);

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
  .forEach(option => newPlanSelect.appendChild(option));

newPlanSelect.value = INITIAL_PLAN_TITLE;
newPlanSelect.addEventListener('change', ({ target }) => {
  // Remove focus-visible on select after click
  newPlanSelect.blur();
  setPlan(target.value)
});

planToggleNew.addEventListener('click', () => {
  newPlanSelect.disabled = false;
  planToggleCurrent.classList.remove('map-toggle__button_active');
  planToggleNew.classList.add('map-toggle__button_active');
  setPlan(newPlanSelect.value);
});

planToggleCurrent.addEventListener('click', () => {
  newPlanSelect.disabled = true;
  planToggleNew.classList.remove('map-toggle__button_active');
  planToggleCurrent.classList.add('map-toggle__button_active');
  setPlan(OLD_PLAN_TITLE);
});
