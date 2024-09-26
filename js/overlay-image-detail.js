const INFO_URL = "https://www.arquigrafia.org.br/photos/IDID";
const AUDIO_URL = "https://digitais.acervos.me/mp3s/arquigrafia/captions/LANGLANG/IDID.mp3";

function setupImageDetailOverlay() {
  const detailOverlayEl = document.getElementById("detail-overlay");
  const detailContentEl = document.getElementById("detail-content");
  const detailCaptionNoteEl = document.getElementById("detail-caption-note");
  const audioEl = document.getElementById("caption-audio");
  const audioPlayEl = document.getElementById("caption-play-button");

  document.body.addEventListener("keydown", (ev) => {
    if (ev.key === "Escape" && detailOverlayEl.classList.contains("visible")) {
      detailOverlayEl.classList.remove("visible");
      document.body.removeEventListener("wheel", prevDef);
      audioEl.pause();
      audioEl.src = "";
    }
  });

  detailOverlayEl.addEventListener("click", () => {
    detailOverlayEl.classList.remove("visible");
    document.body.removeEventListener("wheel", prevDef);
    audioEl.pause();
    audioEl.src = "";
  });

  detailContentEl.addEventListener("click", stopProp);

  detailCaptionNoteEl.innerHTML = CAPTION_NOTE_STRING[lang()];

  audioPlayEl.addEventListener("click", () => {
    audioEl.play();
  });

  audioEl.addEventListener("canplay", () => {
    audioPlayEl.style.display = "initial";
  });
}

function loadImageDetailOverlay(objectData) {
  return (ev) => {
    const selInputEl = document.getElementById("selection-container");
    const detailOverlayEl = document.getElementById("detail-overlay");
    const detailContentEl = document.getElementById("detail-content");
    const imgEl = document.getElementById("detail-image");
    const canvasEl = document.getElementById("detail-canvas");
    const captionEl = document.getElementById("detail-caption");
    const detailColorsEl = document.getElementById("dominant-color-wrapper");
    const linkEl = document.getElementById("detail-link");

    const audioEl = document.getElementById("caption-audio");
    const audioPlayEl = document.getElementById("caption-play-button");

    const canvasCtx = canvasEl.getContext("2d");

    const imageId = ev.currentTarget.getAttribute("data-image-id");
    const evImgEl = ev.currentTarget.querySelector("img");
    const imgColors = objectData["images"][imageId]["dominant_color"]["palette"];
    const imgBinaries = objectData["images"][imageId]["binaries"] || {};

    const imgSrc = evImgEl.src;
    const linkHref = INFO_URL.replace("IDID", imageId);

    detailContentEl.style.opacity = 0;

    linkEl.innerHTML = INFO_STRING[lang()];
    imgEl.setAttribute("src", imgSrc);
    imgEl.removeAttribute("width");
    imgEl.removeAttribute("height");
    linkEl.setAttribute("href", linkHref);

    detailColorsEl.innerHTML = "";
    imgColors.forEach((c) => {
      const cEl = document.createElement("div");
      cEl.classList.add("dominant-color");
      cEl.style.backgroundColor = `rgb(${c.join(",")})`;
      detailColorsEl.appendChild(cEl);
    });

    const binText = [];
    for (const [key, value] of Object.entries(imgBinaries)) {
      binText.push(`${BINARY_STRING[lang()][key]}: ${value}`);
    }

    captionEl.innerHTML = objectData["images"][imageId]["captions"][lang()]["gpt"];
    // captionEl.innerHTML += `<br>${binText.join(", ")}`;

    audioPlayEl.style.display = "none";
    audioEl.src = AUDIO_URL.replace("IDID", imageId).replace("LANGLANG", lang());

    canvasCtx.clearRect(0, 0, canvasEl.width, canvasEl.height);

    function drawBox() {
      const selObj = selInputEl.getAttribute("data-selected-object");
      const objBox = objectData["images"][imageId]["boxes"][selObj];

      const overlayW = detailOverlayEl.offsetWidth;
      const overlayH = detailOverlayEl.offsetHeight;
      const imgW = imgEl.width;
      const imgH = imgEl.height;

      const imgMargin = 0.75;
      const factorW = (imgMargin * overlayW) / imgW;
      const factorH = (imgMargin * overlayH) / imgH;

      if (imgW > imgMargin * overlayW || imgH > imgMargin * overlayH) {
        const scaleFactor = Math.min(factorW, factorH);
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
}
