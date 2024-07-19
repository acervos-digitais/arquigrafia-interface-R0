const OBJS_URL = "https://raw.githubusercontent.com/acervos-digitais/oito-um-utils/main/metadata/objects-1152/objects.json";

const VIDEOS_URL = "//digitais.acervos.me/videos/0801-500";
const IMAGES_URL = "//media.acervos.me/images/0801-500";

function lang() {
  let mlang = localStorage.getItem("0801lang");
  if (!mlang) {
    localStorage.setItem("0801lang", "en");
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

let loadOverlay;

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
        localStorage.setItem("0801lang", l);
        location.reload();
      });
    }
    langMenuEl.appendChild(langEl);
  });
}

function setupVideoOverlay() {
  const vidOverlayEl = document.getElementById("video-overlay");
  const overlayVideoEl = document.getElementById("overlay-video");
  const overlayVideoSrcEl = document.getElementById("overlay-video-source");

  vidOverlayEl.addEventListener("click", () => {
    vidOverlayEl.classList.remove("visible");
    document.body.removeEventListener("wheel", prevDef);

    overlayVideoEl.pause();
    overlayVideoSrcEl.setAttribute("src", "");
    overlayVideoEl.load();
  });

  overlayVideoEl.addEventListener("click", stopProp);

  loadOverlay = (ev) => {
    const vidSrc = ev.currentTarget.getAttribute("data-video-src");
    const vidPos = ev.currentTarget.getAttribute("data-video-seek");

    overlayVideoSrcEl.setAttribute("src", vidSrc);
    overlayVideoEl.currentTime = vidPos;

    if (vidPos >= 0) {
      overlayVideoEl.load();
      vidOverlayEl.classList.add("visible");
      document.body.addEventListener("wheel", prevDef, { passive: false });
    }
  };
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
  setupVideoOverlay();
  setupAboutOverlay();
  populateLangMenu();
});
function createImageElement(frameData, obs) {
  const imgWrapperEl = document.createElement("div");
  const imgEl = document.createElement("img");
  const imgTextEl = document.createElement("p");

  imgWrapperEl.classList.add("image-wrapper");
  imgEl.classList.add("image-image");
  imgTextEl.classList.add("no-image-text");

  imgWrapperEl.setAttribute("data-video-src", `${VIDEOS_URL}/${frameData.file}`);
  imgWrapperEl.setAttribute("data-video-seek", frameData.time);

  imgWrapperEl.innerHTML = "Loading...";
  imgWrapperEl.style.width = `${100 / NUM_COLS}%`;

  const cname = frameData.file.replace(/\/.+$/, "");
  const fname = `${Math.floor(frameData.timestamp)}.jpg`;
  const imgSrc = `${IMAGES_URL}/${cname}/${fname}`;

  imgTextEl.innerHTML = NOIMAGE[lang()];

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
let cFrames = [];
let cFrameIdx = 0;

document.addEventListener("DOMContentLoaded", async (_) => {
  const frameData = await fetchData(OBJS_URL);

  const selInputEl = document.getElementById("selection-container");
  const imagesEl = document.getElementById("images-container");

  frameOnscreen = (entries, _) => {
    entries.forEach((entry) => {
      const eEl = entry.target;
      if (entry.isIntersecting) {
        mObserver.unobserve(eEl);
        cFrameIdx = loadFrames(cFrames, cFrameIdx);
      }
    });
  };

  mObserver = new IntersectionObserver(frameOnscreen, {
    threshold: 0.01,
  });

  function loadFrames(frames, startIdx, numFrames = 10) {
    const lastIdx = Math.min(startIdx + numFrames, frames.length);
    for (let i = startIdx; i < lastIdx; i++) {
      const mImgEl = createImageElement(frames[i], i == lastIdx - 2);
      imagesEl.appendChild(mImgEl);

      mImgEl.style.maxHeight = `${(mImgEl.offsetWidth * 9) / 16}px`;

      mImgEl.addEventListener("click", loadOverlay);
    }
    return lastIdx;
  }

  function updateVideosByObject(cObject) {
    imagesEl.innerHTML = "";
    cFrames = frameData.objects[cObject].map((fi) => {
      const mF = { ...frameData.frames[fi] };
      mF.file = frameData.files[mF.file];
      return mF;
    });

    cFrameIdx = loadFrames(cFrames, 0);
  }

  Object.keys(frameData.objects).forEach((o) => {
    const optButEl = document.createElement("button");
    optButEl.classList.add("object-option-button");
    optButEl.setAttribute("data-option", o);
    optButEl.innerHTML = OBJ2LABEL[lang()][o];

    optButEl.addEventListener("click", (ev) => {
      selInputEl.childNodes.forEach((e) => e.classList.remove("selected"));

      const el = ev.target;
      el.classList.add("selected");
      const selObj = el.getAttribute("data-option");
      updateVideosByObject(selObj);
    });
    selInputEl.appendChild(optButEl);
  });
});
