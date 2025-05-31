const OBJS_URL = "https://raw.githubusercontent.com/acervos-digitais/arquigrafia-data/main/json/objects.json";

const IMAGES_URL = "https://digitais.acervos.at.eu.org/imgs/arquigrafia/128/IDID.jpg";
// "https://www.arquigrafia.org.br/arquigrafia-images/IDID_view.jpg";

function randomRange(A, B) {
  const min = Math.min(A, B);
  const max = Math.max(A, B);
  return Math.random() * (max - min) + min;
}

function byXY(A, B) {
  const Ax = A.grid_xy[0];
  const Ay = A.grid_xy[1];
  const Bx = B.grid_xy[0];
  const By = B.grid_xy[1];

  if (Math.abs(Ay - By) < 0.000001) {
    return Ax - Bx;
  } else {
    return Ay - By;
  }
}

// Carregar json com info sobre imagens e objetos
const objectDataP = fetchData(OBJS_URL);
let objectData = null;

let embeddings;
// Criar divs para as imagens
document.addEventListener("DOMContentLoaded", async (_) => {
  objectData = await objectDataP;

  // filtra o objeto para ficar somente com os valores de "embeddings"
  embeddings = [];
  for (const [key, value] of Object.entries(objectData.images)) {
    const { cluster_distances, ...rest } = value.embeddings;
    embeddings.push({ key, ...rest });
  }

  embeddings.sort(byXY);

  // calcula o número de fileiras e colunas para organizar as imagens
  const numImages = embeddings.length;
  const screenWidth = document.body.clientWidth;
  const screenHeight = document.body.clientHeight;
  const screenRatio = screenWidth / screenHeight;

  // const fullNumRows = Math.floor(((numImages / screenRatio) ** 0.5));
  // const fullNumCols = Math.floor((screenRatio * fullNumRows));

  const fullNumRows = 120; // 120 - 123
  const fullNumCols = fullNumRows;

  const numRows = Math.floor(fullNumRows / 1);
  const numCols = Math.floor(fullNumCols / 1);

  const imgWidth = (100 / numCols);
  const imgHeight = (100 / numRows);

  const imgs = [];
  const imgsContainerEl = document.getElementById("images-container");

  for (let rIdx = 0; rIdx < numRows; rIdx++) {
    const imgRow = [];
    for (let cIdx = 0; cIdx < numCols; cIdx++) {
      const imgEmb = embeddings[rIdx * fullNumCols + cIdx];


      const img = document.createElement("div");
      img.classList.add("emb-img");

      img.style.width = `${imgWidth}%`;
      img.style.height = `${imgHeight}%`;
      img.style.backgroundImage = `url('${IMAGES_URL.replace("IDID", imgEmb.key)}')`;
      img.setAttribute("tsne-x", imgEmb.tsne_xy[0]);
      img.setAttribute("tsne-y", imgEmb.tsne_xy[1]);
      

      imgRow.push(img);
      imgsContainerEl.appendChild(img);
    }
    imgs.push(imgRow);
  }

  for (const emb of embeddings) {
    const xIdx = Math.floor(emb.grid_xy[0] * fullNumCols);
    const yIdx = Math.floor(emb.grid_xy[1] * fullNumRows);

    if (xIdx < numCols && yIdx < numRows) {
      const img = imgs[yIdx][xIdx];
      img.setAttribute("tsne-x", emb.tsne_xy[0]);
      img.setAttribute("tsne-y", emb.tsne_xy[1]);
      // img.style.backgroundImage = `url('${IMAGES_URL.replace("IDID", emb.key)}')`;
    }
  }
});
