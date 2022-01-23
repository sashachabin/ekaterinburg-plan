const PLAN_SIZE_MAXIMIZED = 14000;
const VIEWER_ZOOM_RATIO = 0.6;
const VIEWER_LOADING_TIMEOUT = 5000;
const YM_COUNTER = 85861499;

const { title: DEFAULT_PLAN_TITLE } = PLANS.find(x => x.default);
const { title: OLD_PLAN_TITLE } = PLANS.find(x => x.old);


/* Utils */

const query = selector => document.querySelector(selector);
const queryAll = selector => document.querySelectorAll(selector);

const sendAnalytics = eventName => window.ym && ym(YM_COUNTER, 'reachGoal', eventName);

const getImagePath = (planTitle, key) => {
  const image = PLANS.find(({ title }) => title === planTitle)[key];
  return `./images/${image}`;
};


/* Initial images */

const [planImage, legendImage] = ['map', 'legend']
  .map(key => [key, new Image()])
  .map(([key, img]) => {
    img.src = getImagePath(DEFAULT_PLAN_TITLE, key);
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

    // BUG Prevent viewerjs reset on window resize
    viewer.isShown = false;

    const showViewerImage = () => {
      image.style.willChange = 'none';
      image.style.opacity = 1;
      viewer.options.transition = true;
      hideLoaderText();
    }

    // Run if 'animationend' image event doesn't fired
    const loadingTimeout = setTimeout(() => {
      showViewerImage()
    }, VIEWER_LOADING_TIMEOUT);

    image.addEventListener('animationend', () => {
      showViewerImage();
      clearTimeout(loadingTimeout);
    });
  }
})


/* Zoom & Move */

const getScreenCenter = () => {
  return {
    pageY: window.innerWidth / 2,
    pageX: window.innerHeight / 2
  }
}

const zoomIn = () => {
  viewer.zoom(+VIEWER_ZOOM_RATIO, false, getScreenCenter());
}

const zoomOut = () => {
  viewer.zoom(-VIEWER_ZOOM_RATIO, false, getScreenCenter());
}

const zoomInButton = query('[data-plan-zoom-in]');
zoomInButton.addEventListener('click', zoomIn);

const zoomOutButton = query('[data-plan-zoom-out]');
zoomOutButton.addEventListener('click', zoomOut);

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
      zoomIn();
      break;

    case '-':
      zoomOut();
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

legendButton.addEventListener('click', () => {
  legend.classList.toggle('legend_open');
  switcher.classList.toggle('map-switcher_right');
});


/* Plans */

const planSwitchers = queryAll('[data-plan-switcher]');
const planSelect = query('[data-plan-select]');

const setPlan = title => {
  const mapUrl = getImagePath(title, 'map');
  const legendUrl = getImagePath(title, 'legend');
  const planImage = query('.viewer-canvas img');

  legendImage.src = legendUrl;

  setTimeout(() => {
    planImage.style.opacity = 0.2;
    planImage.src = mapUrl;
    showLoader();
  });

  planImage.onload = () => {
    planImage.style.opacity = 1;
    hideLoader();
  };

  sendAnalytics(title);
};

PLANS.filter(({ pinned }) => !pinned)
  .map(plan => {
    const option = document.createElement('option');
    option.text = plan.title;
    option.value = plan.title;
    return option;
  })
  .forEach(option => planSelect.appendChild(option));

planSelect.value = DEFAULT_PLAN_TITLE;
planSelect.addEventListener('change', ({ target }) => {
  // Remove focus-visible on select after click
  planSelect.blur();
  setPlan(target.value);
});

planSwitchers.forEach(button => {
  const unactiveSwitchers = () => planSwitchers.forEach(
    button => button.classList.remove('map-toggle__button_active')
  );

  button.addEventListener('click', () => {
    const planTitle = button.dataset.planSwitcher;
    const isPlanOld = planTitle === OLD_PLAN_TITLE;

    unactiveSwitchers();
    button.classList.add('map-toggle__button_active');


    planSelect.disabled = isPlanOld;
    planSelect.value = DEFAULT_PLAN_TITLE;
    
    setPlan(planTitle);
  });
});
