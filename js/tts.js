import { Client } from "https://cdn.jsdelivr.net/npm/@gradio/client@1.5.0/dist/index.min.js";

const clientPt = await Client.connect("thiagohersan/mms-tts-por-gradio");
const clientEn = await Client.connect("thiagohersan/mms-tts-eng-gradio");

async function tts(lang, txt) {
  if (lang == "pt") {
    return clientPt.predict("/predict", { txt });
  } else {
    return clientEn.predict("/predict", { txt });
  }
}

Object.defineProperty(window, "tts", {
  get() {
    return tts;
  },
});

// use: tts("um dois tres").then(res => console.log(res.data[0].url));
