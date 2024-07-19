const OBJS_URL = "./js/objects.json";

const INFO_URL = "https://www.arquigrafia.org.br/photos/IDID";
const IMAGES_URL = "https://www.arquigrafia.org.br/arquigrafia-images/IDID_view.jpg";

function lang() {
  let mlang = localStorage.getItem("arquilang");
  if (!mlang) {
    localStorage.setItem("arquilang", "en");
    return "en";
  } else {
    return mlang;
  }
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

  titleEl.innerHTML = DAYSTRING[lang()];

  navLinkEls.forEach((a) => {
    const aRef = a.getAttribute("href");
    const aSlug = a.getAttribute("data-slug");

    if (mUrl.slice(-5) == aRef.slice(-5)) {
      a.removeAttribute("href");
      a.classList.add("disabled");
    }
    a.innerHTML = MENUTEXT[lang()][aSlug];
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

  aboutOverlayEl.addEventListener("click", () => {
    aboutOverlayEl.classList.remove("visible");
    document.body.removeEventListener("wheel", prevDef);
  });

  overlayAboutEl.addEventListener("click", stopProp);

  aboutLinkEl.addEventListener("click", () => {
    aboutOverlayEl.classList.add("visible");
    overlayAboutEl.innerHTML = ABOUTTEXT[lang()];
    document.body.addEventListener("wheel", prevDef, { passive: false });
  });
}

document.addEventListener("DOMContentLoaded", async (_) => {
  populateNavMenu();
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
    const imgEl = document.getElementById("detail-image");
    const captionEl = document.getElementById("detail-caption");
    const linkEl = document.getElementById("detail-link");

    const imageId = ev.currentTarget.getAttribute("data-image-id");

    const imgSrc = IMAGES_URL.replace("IDID", imageId);
    const linkHref = INFO_URL.replace("IDID", imageId);

    linkEl.innerHTML = INFOSTRING[lang()];
    imgEl.setAttribute("src", imgSrc);
    linkEl.setAttribute("href", linkHref);

    captionEl.innerHTML = objectData["images"][imageId]["caption"][lang()];

    // TODO: draw boxes
    const selObj = selInputEl.getAttribute("data-selected-object");
    const selObjBox = objectData["images"][imageId]["boxes"][selObj];
    console.log(selObj, selObjBox);

    detailOverlayEl.classList.add("visible");
    document.body.addEventListener("wheel", prevDef, { passive: false });
  };

  function loadImages(images, startIdx, numImages = 10) {
    const lastIdx = Math.min(startIdx + numImages, images.length);
    for (let i = startIdx; i < lastIdx; i++) {
      const mImgEl = createImageElement(images[i], i == lastIdx - 2);
      imagesEl.appendChild(mImgEl);

      mImgEl.style.maxHeight = `${(mImgEl.offsetWidth * 9) / 16}px`;

      mImgEl.addEventListener("click", loadOverlay);
    }
    return lastIdx;
  }

  function updateImagesByObject(cObject) {
    imagesEl.innerHTML = "";
    cImages = objectData["objects"][cObject].slice();
    cImageIdx = loadImages(cImages, 0);
  }

  Object.keys(objectData["objects"]).forEach((o) => {
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
      updateImagesByObject(selObj);
    });
    selInputEl.appendChild(optButEl);
  });
});
