import Viewer from "viewerjs";
import { query, queryAll } from './utils/query-dom.js';
import { plans, versions } from "./plans";
import sendAnalytics from './utils/send-analytics.js';

import 'viewerjs/dist/viewer.css';

const PLAN_SIZE_MAXIMIZED = 14000;
const VIEWER_ZOOM_RATIO = 0.6;
const VIEWER_LOADING_TIMEOUT = 5000;
const DEFAULT_PLAN_NAME = plans.find(x => x.default).name;
const DEFAULT_PLAN_VERSION = versions.find(x => x.default).id;


const getImagePath = (version, name, type) => {
  return `/plans/${version}/${name}.${type}.png`;
};

/* Initial images */

const [planImage, legendImage] = ['map', 'legend']
  .map(key => [key, new Image()])
  .map(([key, img]) => {
    img.src = getImagePath(DEFAULT_PLAN_VERSION, DEFAULT_PLAN_NAME, key);
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

switcher.appendChild(createVersionToggleControl(versions));
switcher.appendChild(createPlanSelectControl(plans));

legendButton.addEventListener('click', () => {
  legend.classList.toggle('legend_open');
  switcher.classList.toggle('map-switcher_right');
});


/* Plans */
let planVersion = DEFAULT_PLAN_VERSION;
let planName = DEFAULT_PLAN_NAME;

function setPlan(version, name) {
  planVersion = version;
  planName = name;
  
  const vesionButtons = queryAll('[data-version]');
  vesionButtons.forEach(x => x.disabled = false);
  const allVersions = versions.map(({ id }) => id);
  const disabledVersions = plans.find(x => x.name === name).versions;
  const disabledVersion = allVersions.find(x => {
    return !disabledVersions.includes(x)
  });
  const versionButton = query(`[data-version="${disabledVersion}"]`);
  if (versionButton) {
    versionButton.disabled = true;
  }


  const disabledNames = plans.filter(({ versions }) => {
    return !versions.includes(planVersion);
  });
  const options = queryAll('option');
  options.forEach(x => x.disabled = false);
  disabledNames.forEach(({ name }) => {
    const disabledOption = query(`[value="${name}"`);
    if (disabledOption) {
      disabledOption.disabled = true;
    }
  })
  
  const mapUrl = getImagePath(version, name, 'map');
  const legendUrl = getImagePath(version, name, 'legend');
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

  sendAnalytics(name);
};

function createPlanSelectControl(plans) {
  const planSelect = document.createElement('select');
  planSelect.classList.add('map-select');

  plans.map(plan => {
    const option = document.createElement('option');
    option.text = plan.name;
    option.value = plan.name;
    return option;
  }).forEach(option => planSelect.appendChild(option));

  planSelect.value = DEFAULT_PLAN_NAME;
  planSelect.addEventListener('change', ({ target }) => {
    // Remove focus-visible on select after click
    planSelect.blur();
    setPlan(planVersion, target.value);
  });
  return planSelect;
}

function createVersionToggleControl(versions) {
  const versionToggleControl = document.createElement('div');
  versionToggleControl.classList.add('map-toggle');
  
  for (const { id, name, caption, default: isDefault } of versions) {
    const button = document.createElement('button');
    button.classList.add('map-toggle__button');
    button.dataset.version = id;

    if (isDefault) {
      button.classList.add('map-toggle__button_active');
    }

    button.innerHTML = `${name} <div class="map-toggle__button-caption">${caption}</div>`;

    button.addEventListener('click', () => {
      queryAll('.map-toggle__button_active').forEach(
        button => button.classList.remove('map-toggle__button_active')
      );
      button.classList.add('map-toggle__button_active');
      setPlan(id, planName);
    });

    versionToggleControl.appendChild(button);
  }

  return versionToggleControl;
}

