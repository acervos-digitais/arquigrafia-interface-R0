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
