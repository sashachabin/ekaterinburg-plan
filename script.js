const VIEWER_ZOOM_INITIAL = 0.25;
const VIEWER_ZOOM_RATIO = 0.6;

const mapContainer = document.querySelector('[data-map]')
const zoomInButton = document.querySelector('[data-controls-zoom-in]');
const zoomOutButton = document.querySelector('[data-controls-zoom-out]');
const planToggleCurrent = document.querySelector('[data-controls-toggle="current"]');
const planToggleNew = document.querySelector('[data-controls-toggle="new"]');
const newPlanSelect = document.querySelector('[data-controls-switcher]');
const legend = document.querySelector('[data-legend]');
const legendToggleButton = document.querySelector('[data-legend-button]');

const image = new Image();
image.src = getImagePath(PLANS.find(plan => plan.title === "Фукнциональные зоны").map);
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
  rotatable: false,
  scalable: false,
  toggleOnDblclick: false,
  slideOnTouch: false,
  tooltip: false,
  transition: true,
  zoomRatio: VIEWER_ZOOM_RATIO,
  maxZoomRatio: 4.5,
  minZoomRatio: .2
});

viewer.show();

image.addEventListener('viewed', () => {
  viewer.zoomTo(VIEWER_ZOOM_INITIAL);
  setTimeout(() => image.style.display = 'none', 100);
})

zoomInButton.addEventListener('click', () => {
  viewer.zoom(VIEWER_ZOOM_RATIO);
});

zoomOutButton.addEventListener('click', () => {
  viewer.zoom(-VIEWER_ZOOM_RATIO);
});

document.addEventListener('keyup', ({ key }) => {
  switch (key) {
    case "-":
      viewer.zoom(-VIEWER_ZOOM_RATIO);
      break;

    case "=":
      viewer.zoom(VIEWER_ZOOM_RATIO);
      break;

    case "0":
      viewer.zoomTo(VIEWER_ZOOM_INITIAL);
      break;
    default: ;
  }
});

legendToggleButton.addEventListener('click', () => {
  const isMenuOpen = legend.classList.contains('legend_open');
  const indent = window.innerWidth * 0.1;

  if (isMenuOpen) {
    legend.classList.remove('legend_open');
  } else {
    legend.classList.add('legend_open');
  }
});

planToggleCurrent.addEventListener('click', () => {
  newPlanSelect.disabled = true;
  planToggleNew.classList.remove('map-switcher__button_active');
  planToggleCurrent.classList.add('map-switcher__button_active');
  setPlan("Старый генплан");
  setLegend("Старый генплан");
})

planToggleNew.addEventListener('click', () => {
  newPlanSelect.disabled = false;
  planToggleCurrent.classList.remove('map-switcher__button_active');
  planToggleNew.classList.add('map-switcher__button_active');
  setPlan(newPlanSelect.value);
  setLegend(newPlanSelect.value);
})

PLANS.filter(plan => !plan.old).map(plan => {
  const option = document.createElement('option');
  option.text = plan.title;
  option.value = plan.title;
  newPlanSelect.appendChild(option)
});

newPlanSelect.addEventListener('change', (e) => {
  setPlan(e.target.value);
  setLegend(e.target.value);
})

function setPlan(title) {
  const image = document.querySelector('.viewer-canvas img');
  const mapUrl = getImagePath(PLANS.find(plan => title === plan.title).map);
  image.style.opacity = .99;

  setTimeout(() => {
    image.src = mapUrl;
    image.style.opacity = .2;
  }, 0);

  image.onload = () => {
    image.style.opacity = 1;
  }
}

function setLegend(title) {
  const legendUrl = getImagePath(PLANS.find(plan => title === plan.title).legend);
  document.querySelector('[data-legend-image]').src = legendUrl;
}

function getImagePath(image) {
  return `./images/${image}`;
}
