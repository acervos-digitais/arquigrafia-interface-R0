// import { pipeline } from "https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.2";
// const tts = await pipeline("text-to-speech", "Xenova/mms-tts-por");

class AudioPlayer {
  static audioCtx = new AudioContext();
  static createAudioBuffer(inObj) {
    const myArrayBuffer = AudioPlayer.audioCtx.createBuffer(
      1,
      inObj["audio"].length,
      inObj["sampling_rate"]
    );
  
    for (let c = 0; c < myArrayBuffer.numberOfChannels; c++) {
      const nowBuffering = myArrayBuffer.getChannelData(c);
      for (let i = 0; i < myArrayBuffer.length; i++) {
        nowBuffering[i] = inObj["audio"][i];
      }
    }
    return myArrayBuffer;
  };

  static playAudio(inObj) {
    const source = AudioPlayer.audioCtx.createBufferSource();
    source.connect(AudioPlayer.audioCtx.destination);
    source.buffer = AudioPlayer.createAudioBuffer(inObj);
    source.start();
  }
}

// Object.defineProperty(window, "tts", {
//   get() { return tts; },
// });

Object.defineProperty(window, "AudioPlayer", {
  get() { return AudioPlayer; },
});

// use: tts("um dois tres").then(res => AudioPlayer.playAudio(res));

import { Client } from "https://cdn.jsdelivr.net/npm/@gradio/client@1.5.0/dist/index.min.js";

const client = await Client.connect("thiagohersan/mms-tts-por-gradio");

async function tts(txt) {
  return client.predict("/predict", {txt});
}

Object.defineProperty(window, "tts", {
  get() { return tts; },
});

// use: tts("um dois tres").then(res => console.log(res.data[0].url));
