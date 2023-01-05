import Viewer from "viewerjs";
import { query, queryAll } from './utils/query-dom.js';
import { plans, versions } from "./plans";
import sendAnalytics from './utils/send-analytics.js';

import 'viewerjs/dist/viewer.css';

const PLAN_SIZE_MAXIMIZED = 14000;
const VIEWER_ZOOM_RATIO = 0.6;
const VIEWER_LOADING_TIMEOUT = 5000;

let currentPlanVersion = versions.find(x => x.default).id;
let currentPlanName = plans.find(x => x.default).name;

/* Initial images */
let [planImage, legendImage] = ['map', 'legend']
  .map((key) => {
    const img = new Image();
    img.src = getImagePath(currentPlanVersion, currentPlanName, key);
    return img;
  });

query('[data-plan]').appendChild(planImage);
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
    planImage = query('.viewer-canvas img');
    planImage.style.willChange = 'transform, opacity';
    viewer.imageData.naturalWidth = maxSideSize;
    viewer.imageData.naturalHeight = maxSideSize;
    viewer.zoomTo(2);

    // BUG Prevent viewerjs reset on window resize
    viewer.isShown = false;

    const showViewerImage = () => {
      planImage.style.willChange = 'none';
      planImage.style.opacity = 1;
      viewer.options.transition = true;
      hideLoaderText();
    }

    // Run if 'animationend' image event doesn't fired
    const loadingTimeout = setTimeout(() => {
      showViewerImage()
    }, VIEWER_LOADING_TIMEOUT);

    planImage.addEventListener('animationend', () => {
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


/* Switcher */
const planSwitcher = query('[data-plan-switcher]');
const planVersionToggle = createPlanVersionToggle(versions);
const planNameSelect = createPlanNameSelect(plans);

planSwitcher.appendChild(planVersionToggle);
planSwitcher.appendChild(planNameSelect);
setAvailabilityPlanNames(currentPlanVersion);
setAvailabilityPlanVersions(currentPlanName);


/* Legend */
const legend = query('[data-legend]');
const legendButton = query('[data-legend-button]');

legendButton.addEventListener('click', () => {
  legend.classList.toggle('legend_open');
  planSwitcher.classList.toggle('plan-switcher_right');
});


/* Plans */
function setPlan(version, name) {
  currentPlanVersion = version;
  currentPlanName = name;

  setAvailabilityPlanNames(version);
  setAvailabilityPlanVersions(name);

  legendImage.src = getImagePath(version, name, 'legend');

  setTimeout(() => {
    planImage.style.opacity = 0.2;
    planImage.src = getImagePath(version, name, 'map');
    showLoader();
  });

  planImage.onload = () => {
    planImage.style.opacity = 1;
    hideLoader();
  };

  sendAnalytics(`${version}/${name}`);
};

function createPlanNameSelect(plans) {
  const planNameSelect = document.createElement('select');
  planNameSelect.classList.add('plan-name-select');

  for (let { name } of plans) {
    const option = document.createElement('option');
    option.text = name;
    option.value = name;
    option.dataset.planName = name;
    planNameSelect.appendChild(option);
  }

  planNameSelect.value = currentPlanName;
  planNameSelect.addEventListener('change', ({ target }) => {
    const planName = target.value;
    // Remove focus-visible on select after click
    planNameSelect.blur();
    setPlan(currentPlanVersion, planName);
  });
  return planNameSelect;
}

function createPlanVersionToggle(versions) {
  const planVersionToggleActiveClassName = 'plan-version-toggle__button_active';
  const planVersionToggle = document.createElement('div');
  planVersionToggle.classList.add('plan-version-toggle');

  for (const { id: planVersion, name, caption, default: isDefault } of versions) {
    const button = document.createElement('button');
    button.classList.add('plan-version-toggle__button');
    button.dataset.planVersion = planVersion;

    if (isDefault) {
      button.classList.add(planVersionToggleActiveClassName);
    }

    button.innerHTML = `${name} <div class="plan-version-toggle__button-caption">${caption}</div>`;

    button.addEventListener('click', () => {
      for (let button of queryAll(`.${planVersionToggleActiveClassName}`)) {
        button.classList.remove(planVersionToggleActiveClassName);
      }
      button.classList.add(planVersionToggleActiveClassName);
      setPlan(planVersion, currentPlanName);
    });

    planVersionToggle.appendChild(button);
  }

  return planVersionToggle;
}

function setAvailabilityPlanNames(version) {
  const disabledNames = plans.filter((plan) => (
    !plan.versions.includes(version)
  ));

  for (let option of queryAll('[data-plan-name]')) {
    option.disabled = false;
  }

  for (let { name } of disabledNames) {
    const disabledOption = query(`[data-plan-name="${name}"]`);
    if (disabledOption) {
      disabledOption.disabled = true;
    }
  }
}

function setAvailabilityPlanVersions(name) {
  const allVersions = versions.map(({ id }) => id);
  const disabledVersions = plans.find(plan => plan.name === name).versions;
  const disabledVersion = allVersions.find(x => {
    return !disabledVersions.includes(x);
  });

  for (let versionButton of queryAll('[data-plan-version]')) {
    versionButton.disabled = false;
  }

  const versionButton = query(`[data-plan-version="${disabledVersion}"]`);
  if (versionButton) {
    versionButton.disabled = true;
  }
}

function getImagePath(version, name, type) {
  return new URL(`./plans/${version}/${name}.${type}.png`, import.meta.url).href;
}
