const OBJS_URL = "https://raw.githubusercontent.com/acervos-digitais/arquigrafia-utils/main/metadata/objects.json";

const INFO_URL = "https://www.arquigrafia.org.br/photos/IDID";
const IMAGES_URL = "https://www.arquigrafia.org.br/arquigrafia-images/IDID_view.jpg";

const CATEGORY = (window.location.hash == "#/art") ? "art" : (window.location.hash == "#/materials") ? "materials" : "architecture";

const CATEGORIES = {
  architecture: [
    "building door", "greenery", "inclined walkway",
    "railing", "stairs", "tower", "window", "vertical pillar",
  ],
  materials: [
    "concrete wall", "masonry", "wrought", "mirror", "wood fence",
  ],
  art: ["chair", "painting", "sculpture", "table"]
};

function lang() {
  let mlang = localStorage.getItem("arquilang");
  if (!mlang) {
    localStorage.setItem("arquilang", "en");
    return "en";
  } else {
    return mlang;
  }
}

function hexToRgb(hex) {
  return ['0x' + hex[1] + hex[2] | 0, '0x' + hex[3] + hex[4] | 0, '0x' + hex[5] + hex[6] | 0];
}

function rgbDist(c0, c1) {
  const c0Range = Math.max(...c0) - Math.min(...c0);
  const c1Range = Math.max(...c1) - Math.min(...c1);
  greyFactor = (c0Range < c1Range && c0Range < 20) ? 255 - (c0Range / 1) : 0;
  return c0.reduce((s, _, i) => s + Math.abs(c0[i] - c1[i]), greyFactor);
}

function getGridDims(numVideos) {
  const videoArea = (window.innerWidth * window.innerHeight) / numVideos;
  const dimFactor = (videoArea / (16 * 9)) ** 0.5;
  const numCols = Math.round(window.innerWidth / (16 * dimFactor));
  const numRows = Math.ceil(numVideos / numCols);
  return [numCols, numRows];
}
const NUM_VIDS = 33;
const [NUM_COLS, NUM_ROWS] = getGridDims(NUM_VIDS);

async function fetchData(mUrl) {
  const response = await fetch(mUrl);
  return await response.json();
}

const prevDef = (ev) => ev.preventDefault();
const stopProp = (ev) => ev.stopPropagation();

function populateNavMenu() {
  const mUrl = location.href;
  const titleEl = document.getElementById("navigation-title");
  const navMenuEl = document.getElementById("navigation-menu");
  const navLinkEls = navMenuEl.querySelectorAll("[data-slug]");

  titleEl.innerHTML = MAIN_TITLE_STRING[lang()];

  navLinkEls.forEach((a) => {
    const aRef = a.getAttribute("href");
    const aSlug = a.getAttribute("data-slug");

    if (mUrl.slice(-5) == aRef.slice(-5)) {
      a.removeAttribute("href");
      a.classList.add("disabled");
    }
    a.innerHTML = MENU_STRING[lang()][aSlug];
  });
}

function populateCategoryMenu() {
  const catMenuEl = document.getElementById("category-menu");
  const catTitleEl = document.getElementById("category-title");

  catTitleEl.innerHTML = `${MENU_STRING[lang()].category}: `;

  ["architecture", "materials", "art"].forEach(c => {
    const catEl = document.createElement("a");
    catEl.classList.add("category-item");

    catEl.innerHTML = MENU_STRING[lang()][c];
    catEl.setAttribute("href", `./#/${c}`);

    if (CATEGORY.includes(c)) {
      catEl.classList.add("selected");
    }
    catEl.addEventListener("click", _ => setTimeout(()=>location.reload(), 4));
    catMenuEl.appendChild(catEl);
  });
}

function populateLangMenu() {
  const langMenuEl = document.getElementById("lang-menu");

  ["en", "pt"].forEach(l => {
    const langEl = document.createElement("div");
    langEl.classList.add("lang-option");
    langEl.innerHTML = l;
    if (l == lang()) {
      langEl.classList.add("selected");
    } else {
      langEl.addEventListener("click", () => {
        localStorage.setItem("arquilang", l);
        location.reload();
      });
    }
    langMenuEl.appendChild(langEl);
  });
}

function setupDetailOverlay() {
  const detailOverlayEl = document.getElementById("detail-overlay");
  const detailContentEl = document.getElementById("detail-content");

  document.body.addEventListener("keydown", (ev) => {
    if (ev.key === "Escape" && detailOverlayEl.classList.contains("visible")) {
      detailOverlayEl.classList.remove("visible");
      document.body.removeEventListener("wheel", prevDef);
    }
  });

  detailOverlayEl.addEventListener("click", () => {
    detailOverlayEl.classList.remove("visible");
    document.body.removeEventListener("wheel", prevDef);
  });

  detailContentEl.addEventListener("click", stopProp);
}

function setupAboutOverlay() {
  const aboutOverlayEl = document.getElementById("about-overlay");
  const overlayAboutEl = document.getElementById("overlay-about");
  const aboutLinkEl = document.getElementById("about-link");

  document.body.addEventListener("keydown", (ev) => {
    if (ev.key === "Escape" && aboutOverlayEl.classList.contains("visible")) {
      aboutOverlayEl.classList.remove("visible");
      document.body.removeEventListener("wheel", prevDef);
    }
  });

  aboutOverlayEl.addEventListener("click", () => {
    aboutOverlayEl.classList.remove("visible");
    document.body.removeEventListener("wheel", prevDef);
  });

  overlayAboutEl.addEventListener("click", stopProp);

  aboutLinkEl.addEventListener("click", () => {
    aboutOverlayEl.classList.add("visible");
    overlayAboutEl.innerHTML = ABOUT_STRING[lang()];
    document.body.addEventListener("wheel", prevDef, { passive: false });
  });
}

document.addEventListener("DOMContentLoaded", async (_) => {
  populateNavMenu();
  populateCategoryMenu();
  setupDetailOverlay();
  setupAboutOverlay();
  populateLangMenu();
});

function createImageElement(imageId, obs) {
  const imgWrapperEl = document.createElement("div");
  const imgEl = document.createElement("img");
  const imgTextEl = document.createElement("p");

  imgWrapperEl.classList.add("image-wrapper");
  imgEl.classList.add("image-image");
  imgTextEl.classList.add("no-image-text");

  imgWrapperEl.setAttribute("data-image-id", imageId);

  imgWrapperEl.innerHTML = "Loading...";
  imgWrapperEl.style.width = `${100 / NUM_COLS}%`;

  const imgSrc = IMAGES_URL.replace("IDID", imageId);

  imgWrapperEl.innerHTML = "";
  imgWrapperEl.appendChild(imgEl);
  imgWrapperEl.appendChild(imgTextEl);
  imgEl.src = imgSrc;

  if (obs) {
    mObserver.observe(imgWrapperEl);
  }

  return imgWrapperEl;
}

let mObserver = null;
let cImages = [];
let cImageIdx = 0;

document.addEventListener("DOMContentLoaded", async (_) => {
  const objectData = await fetchData(OBJS_URL);

  const selInputEl = document.getElementById("selection-container");
  const imagesEl = document.getElementById("images-container");
  const colorPicker = document.getElementById("selection-color");

  const imageOnscreen = (entries, _) => {
    entries.forEach((entry) => {
      const eEl = entry.target;
      if (entry.isIntersecting) {
        mObserver.unobserve(eEl);
        cImageIdx = loadImages(cImages, cImageIdx);
      }
    });
  };

  mObserver = new IntersectionObserver(imageOnscreen, {
    threshold: 0.01,
  });

  function loadOverlay(ev) {
    const selInputEl = document.getElementById("selection-container");
    const detailOverlayEl = document.getElementById("detail-overlay");
    const detailContentEl = document.getElementById("detail-content");
    const imgEl = document.getElementById("detail-image");
    const canvasEl = document.getElementById("detail-canvas");
    const captionEl = document.getElementById("detail-caption");
    const detailColorsEl = document.getElementById("dominant-color-wrapper");
    const linkEl = document.getElementById("detail-link");

    const canvasCtx = canvasEl.getContext("2d");

    const imageId = ev.currentTarget.getAttribute("data-image-id");
    const imgColors = objectData["images"][imageId]["dominant_color"]["palette"];
    const imgBinaries = objectData["images"][imageId]["binaries"] || {};

    const imgSrc = IMAGES_URL.replace("IDID", imageId);
    const linkHref = INFO_URL.replace("IDID", imageId);

    detailContentEl.style.opacity = 0;

    linkEl.innerHTML = INFO_STRING[lang()];
    imgEl.setAttribute("src", imgSrc);
    imgEl.removeAttribute("width");
    imgEl.removeAttribute("height");
    linkEl.setAttribute("href", linkHref);

    detailColorsEl.innerHTML = "";
    imgColors.forEach(c => {
      const cEl = document.createElement("div");
      cEl.classList.add("dominant-color");
      cEl.style.backgroundColor = `rgb(${c.join(",")})`;
      detailColorsEl.appendChild(cEl);
    });

    const binText = [];
    for (const [key, value] of Object.entries(imgBinaries)) {
      binText.push(`${BINARY_STRING[lang()][key]}: ${value}`);
    }

    captionEl.innerHTML = objectData["images"][imageId]["caption"][lang()];
    captionEl.innerHTML += `<br>${binText.join(", ")}`;

    canvasCtx.clearRect(0, 0, canvasEl.width, canvasEl.height);

    function drawBox() {
      const selObj = selInputEl.getAttribute("data-selected-object");
      const objBox = objectData["images"][imageId]["boxes"][selObj];

      const overlayW = detailOverlayEl.offsetWidth;
      const overlayH = detailOverlayEl.offsetHeight;
      const imgW = imgEl.width;
      const imgH = imgEl.height;

      const imgMargin = 0.75;

      if (imgW > imgMargin * overlayW || imgH > imgMargin * overlayH) {
        const scaleFactor = Math.min(imgMargin * overlayW / imgW, imgMargin * overlayH / imgH);
        imgEl.width = scaleFactor * imgW;
        imgEl.height = scaleFactor * imgH;
      }

      canvasEl.width = imgEl.width;
      canvasEl.height = imgEl.height;

      const boxX = objBox[0] * imgEl.width;
      const boxY = objBox[1] * imgEl.height;
      const boxW = (objBox[2] - objBox[0]) * imgEl.width;
      const boxH = (objBox[3] - objBox[1]) * imgEl.height;

      canvasCtx.strokeStyle = "#0f0";
      canvasCtx.lineWidth = 4;
      canvasCtx.strokeRect(boxX, boxY, boxW, boxH);

      detailContentEl.style.opacity = 1;
    }

    detailOverlayEl.classList.add("visible");
    document.body.addEventListener("wheel", prevDef, { passive: false });

    // TODO: fix this
    setTimeout(drawBox, 200);
  };

  function loadImages(images, startIdx = 0, numImages = 10) {
    if (startIdx == 0) {
      imagesEl.innerHTML = "";
    }

    const lastIdx = Math.min(startIdx + numImages, images.length);
    for (let i = startIdx; i < lastIdx; i++) {
      const mImgEl = createImageElement(images[i], i == lastIdx - 2);
      imagesEl.appendChild(mImgEl);

      mImgEl.style.maxHeight = `${(mImgEl.offsetWidth * 9) / 16}px`;

      mImgEl.addEventListener("click", loadOverlay);
    }
    return lastIdx;
  }

  function updateImagesByObject() {
    const cObject = selInputEl.getAttribute("data-selected-object") || "";
    if (cObject == "") return;

    const selRgb = hexToRgb(colorPicker.value);
    const byRgbDist = (a, b) => {
      const aMin = Math.min(...a.colors.map(c => rgbDist(c, selRgb)));
      const bMin = Math.min(...b.colors.map(c => rgbDist(c, selRgb)));
      return aMin - bMin;
    };

    cImages = objectData["objects"][cObject].map(v => {
      return {
        colors: objectData["images"][v]["dominant_color"]["palette"],
        id: v
      }
    }).toSorted(byRgbDist).map(o => o.id);

    cImageIdx = loadImages(cImages, 0);
  }

  colorPicker.addEventListener("change", updateImagesByObject);

  Object.keys(objectData["objects"]).filter(l => CATEGORIES[CATEGORY].includes(l)).forEach((o) => {
    const optButEl = document.createElement("button");
    optButEl.classList.add("object-option-button");
    optButEl.setAttribute("data-option", o);
    optButEl.innerHTML = OBJ2LABEL[lang()][o];

    optButEl.addEventListener("click", (ev) => {
      selInputEl.childNodes.forEach((e) => e.classList.remove("selected"));

      const el = ev.target;
      el.classList.add("selected");
      const selObj = el.getAttribute("data-option");
      selInputEl.setAttribute("data-selected-object", selObj);
      updateImagesByObject();
    });
    selInputEl.appendChild(optButEl);
  });
});
