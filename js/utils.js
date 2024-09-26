// Qual lingua (pt/en) foi selecionada
function lang() {
  let mlang = localStorage.getItem("arquilang");
  if (!mlang) {
    localStorage.setItem("arquilang", "en");
    return "en";
  } else {
    return mlang;
  }
}

// Conversão do formato hex (0x0123AB) para lista RGB ([12, 123, 222])
function hexToRgb(hex) {
  return [
    ("0x" + hex[1] + hex[2]) | 0,
    ("0x" + hex[3] + hex[4]) | 0,
    ("0x" + hex[5] + hex[6]) | 0,
  ];
}

// Distancia entre dua cores, usando um fator para afastar cores cinzas/pretas/brancas
function rgbDist(c0, c1) {
  const c0Range = Math.max(...c0) - Math.min(...c0);
  const c1Range = Math.max(...c1) - Math.min(...c1);
  greyFactor = c0Range < c1Range && c0Range < 20 ? 255 - c0Range / 1 : 0;
  return c0.reduce((s, _, i) => s + Math.abs(c0[i] - c1[i]), greyFactor);
}

// Calcular tamanho das colunas do grid, baseado no numero
//   aproximado de objetos que devem aparecer ao mesmo tempo na tela
function getGridDims(numObjects, w = 16, h = 9) {
  const videoArea = (window.innerWidth * window.innerHeight) / numObjects;
  const dimFactor = (videoArea / (w * h)) ** 0.5;
  const numCols = Math.round(window.innerWidth / (w * dimFactor));
  const numRows = Math.ceil(numObjects / numCols);
  return [numCols, numRows];
}

// Baixa arquivo json e devolve objeto
async function fetchData(mUrl) {
  const response = await fetch(mUrl);
  return await response.json();
}
