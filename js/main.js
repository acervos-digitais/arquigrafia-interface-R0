const OBJS_URL = "https://raw.githubusercontent.com/acervos-digitais/arquigrafia-data/main/json/objects.json";

const IMAGES_URL = "https://www.arquigrafia.org.br/arquigrafia-images/IDID_view.jpg";

const CATEGORY = (window.location.hash == "#/art") ? "art" :
  (window.location.hash == "#/materials") ? "materials" :
    (window.location.hash == "#/nature") ? "nature" :
      "architecture";

const CATEGORIES = {
  architecture: [
    "awning", "balcony", "door", "pillar",
    "railing", "stairs", "tower", "window",
    "ramp",
  ],
  materials: ["concrete", "glass", "masonry", "wood", "wrought"],
  nature: ["animal", "cloud", "greenery", "person", "sky", "water"],
  art: ["chair", "painting", "sculpture", "sign", "table", "vehicle"],
};

// Quantidade de imagens na tela
const NUM_IMAGES = 30;
const [NUM_COLS, NUM_ROWS] = getGridDims(NUM_IMAGES);

// Variaveis globais para lista atual de imagens
let cImages = [];
let cImageIdx = 0;

// Observable para carregar novos itens quando necessário
const imageOnscreen = (entries, _) => {
  entries.forEach((entry) => {
    const eEl = entry.target;
    if (entry.isIntersecting) {
      mObserver.unobserve(eEl);
      cImageIdx = loadImages(cImages, cImageIdx);
    }
  });
};

const mObserver = new IntersectionObserver(imageOnscreen, {
  threshold: 0.01,
});

// Carregar json com info sobre imagens e objetos
const objectDataP = fetchData(OBJS_URL);
let objectData = null;

// Menu de links (sobre, acervos)
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

// Menu de categorias (arquitetura, arte+design)
function populateCategoryMenu() {
  const catMenuEl = document.getElementById("category-menu");
  const catTitleEl = document.getElementById("category-title");

  catTitleEl.innerHTML = `${MENU_STRING[lang()].category}: `;

  ["architecture", "materials", "art", "nature"].forEach(c => {
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

// Menu de objetos para versão desktop
function populateObjectButtons() {
  const objectLabels = CATEGORIES[CATEGORY].filter(l => l == "HR" || Object.keys(objectData["objects"]).includes(l));
  const selInputEl = document.getElementById("selection-container");

  objectLabels.forEach((o) => {
    if (o == "HR") {
      const optBreakEl = document.createElement("hr");
      selInputEl.appendChild(optBreakEl);
    } else {
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
    }
  });
}

// Menu de objetos para versão mobile
async function populateObjectDropDown() {
  const objectLabels = CATEGORIES[CATEGORY].filter(l => l == "HR" || Object.keys(objectData["objects"]).includes(l));
  const selInputEl = document.getElementById("selection-container");

  const dropDownEl = document.getElementById("object-drop-down");
  document.getElementById("default-drop-down").innerHTML = DROP_DOWN_STRINGS[lang()]["objects"];

  const ddOpt = document.createElement("option");
  ddOpt.classList.add("object-dd-option");
  ddOpt.setAttribute("disabled", true);
  ddOpt.value = "";
  ddOpt.innerHTML = "---" + DROP_DOWN_STRINGS[lang()]["objects"];
  dropDownEl.appendChild(ddOpt);

  objectLabels.forEach((o) => {
    const ddOpt = document.createElement("option");
    ddOpt.classList.add("object-dd-option");
    ddOpt.value = o;

    if (o == "HR") {
      ddOpt.setAttribute("disabled", true);
      ddOpt.innerHTML = "---" + DROP_DOWN_STRINGS[lang()]["materials"];
    } else {
      ddOpt.innerHTML = OBJ2LABEL[lang()][o];
    }
    dropDownEl.appendChild(ddOpt);
  });

  dropDownEl.addEventListener("change", (ev) => {
    const el = ev.target;
    const selObj = el.options[el.selectedIndex].value;
    selInputEl.setAttribute("data-selected-object", selObj);
    updateImagesByObject();
  });
}

// Menu de linguas
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

function setupColorPicker() {
  const colorPickerEl = document.getElementById("color-selection");
  const colorLabelEl = document.getElementById("color-label");
  colorLabelEl.innerHTML = COLOR_LABEL_STRING[lang()];
  colorPickerEl.addEventListener("change", updateImagesByObject);
}

// Criar um div de imagem para a lista de imagens
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

  imgTextEl.innerHTML = imageId;

  imgWrapperEl.innerHTML = "";
  imgWrapperEl.appendChild(imgTextEl);
  imgWrapperEl.appendChild(imgEl);
  imgEl.src = imgSrc;

  if (obs) {
    mObserver.observe(imgWrapperEl);
  }

  return imgWrapperEl;
}

// Carregar as proximas 10 imagens da lista
function loadImages(images, startIdx = 0, numImages = 10) {
  const imagesEl = document.getElementById("images-container");
  const lastIdx = Math.min(startIdx + numImages, images.length);

  if (startIdx == 0) {
    imagesEl.innerHTML = "";
  }

  for (let i = startIdx; i < lastIdx; i++) {
    const mImgEl = createImageElement(images[i], i == lastIdx - 2);
    imagesEl.appendChild(mImgEl);

    mImgEl.style.maxHeight = `${(mImgEl.offsetWidth * 9) / 16}px`;

    mImgEl.addEventListener("click", loadImageDetailOverlay(objectData));
  }
  return lastIdx;
}

// Recriar a variavel cImages com imagens do objeto selecionado
function updateImagesByObject() {
  const selInputEl = document.getElementById("selection-container");
  const colorPickerEl = document.getElementById("color-selection");

  const cObject = selInputEl.getAttribute("data-selected-object") || "";
  if (cObject == "") return;

  const selRgb = hexToRgb(colorPickerEl.value);
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

// Criar os menus e divs vazios pros overlays
document.addEventListener("DOMContentLoaded", async (_) => {
  objectData = await objectDataP;
  populateNavMenu();
  populateCategoryMenu();
  populateLangMenu();
  populateObjectButtons();
  populateObjectDropDown();
  setupColorPicker();
  setupImageDetailOverlay();
  setupAboutOverlay();
});
