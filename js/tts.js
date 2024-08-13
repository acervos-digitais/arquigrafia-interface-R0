import { Client } from "https://cdn.jsdelivr.net/npm/@gradio/client@1.5.0/dist/index.min.js";

const client = await Client.connect("thiagohersan/mms-tts-por-gradio");

async function tts(txt) {
  return client.predict("/predict", { txt });
}

Object.defineProperty(window, "tts", {
  get() {
    return tts;
  },
});

// use: tts("um dois tres").then(res => console.log(res.data[0].url));
