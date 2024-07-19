const DAYSTRING = {
  en: "Sun Jan 08 2023 GMT-0300",
  pt: "Dom 08 Jan 2023 GMT-0300",
};

const MENUTEXT = {
  en: {
    time: "time",
    location: "location",
    objects: "objects",
    about: "about",
  },
  pt: {
    time: "horário",
    location: "camera",
    objects: "objetos",
    about: "sobre",
  },
};

const NOIMAGE = {
  en: "Camera Not Available",
  pt: "Camera Desativada",
};

const CAM2NAMES = {
  en: {
    "01-COBERTURA-PP-OESTE": "General View (West)",
    "02-COBERTURA-ENTRADA-PR": "General View of Presidency Entrance",
    "03-ENTRADA-PP-RAIO-X-TERREO": "Ground Floor (Presidency Entrance X-Ray)",
    "04-PALACIO-ALA-LESTE-TERREO": "Ground Floor (East)",
    "05-PALACIO-ALA-OESTE": "Ground Floor (West)",
    "06-PRIVATIVO-COMBOIO": "Private Convoy",
    "07-SALA-PG-3-PISO": "3rd Floor - President's Personal Office",
    "08-SUBSOLO-ADM": "Basement (Administrative)",
    "09-ELEVADOR-DE-SERVICO-TERREO": "Ground Floor - Service Elevator",
    "10-SALAO-NOBRE": "Ground Floor - Noble Hall",
    "11-SALAO-OESTE": "Ground Floor - West Hall",
    "12-2o-ANDAR-RAMPA": "2nd Floor - Ramp",
    "13-2o-ANDAR-ELEVADOR-LESTE": "2nd Floor - East Elevator",
    "14-2o-ANDAR-ELEVADOR-OESTE": "2nd Floor - East West Elevator",
    "15-MESANINO": "Mezzanine",
    "16-CAMERA-VIP-PR": "Ground Floor - President's Entrance",
    "17-3o-ANDAR-SALA-PR": "3rd Floor - President's Office",
    "18-3o-ANDAR-SALA-DE-AUDIENCIA": "3rd Floor - Audience Room",
    "19-3o-ANDAR-CORREDOR-ACESSO-LESTE": "3rd Floor - Access Corridor (East)",
    "20-ELEVADORES-ALA-OESTE": "4th Floor Elevators (West)",
    "21-2o-ANDAR-ESCADA-OESTE": "2nd Floor Stairs (West)",
    "22-3o-ANDAR-ESCADA-OESTE": "3rd Floor Stairs (West)",
    "23-ELEVADOR-MINISTROS": "3rd Floor - Ministers' Elevator",
    "24-4o-ANDAR-ELEVADOR-LESTE": "4th Floor - Elevator (East)",
    "25-4o-ANDAR-ESCADA-OESTE": "4th Floor - Stairs (West)",
    "26-4o-ANDAR-ELEVADOR-OESTE": "4th Floor - Elevator (West)",
    "27-4o-ANDAR-LADO-LESTE": "4th Floor (East)",
    "28-4o-ANDAR-LADO-OESTE": "4th Floor (West)",
    "29-ANEXO-I": "Annex I",
    "30-ANEXO-I-ENTRADA-PRINCIPAL-CATRACAS":
      "Annex I - Main Entrance Turnstiles",
    "31-ANEXO-I-CONCHA-ANEXO": "Annex I - Entrance (External)",
    "32-ANEXO-III-REFEITORIO-CREDEN": "Annex III Accredited Cafeteria",
    "33-ANEXO-III-REFEITORIO": "Annex III - Cafeteria",
  },
  pt: {
    "01-COBERTURA-PP-OESTE": "Vista Geral (Oeste)",
    "02-COBERTURA-ENTRADA-PR": "Vista Geral Entrada Presidência da República",
    "03-ENTRADA-PP-RAIO-X-TERREO": "Térreo (Raio-X)",
    "04-PALACIO-ALA-LESTE-TERREO": "Térreo (Leste)",
    "05-PALACIO-ALA-OESTE": "Térreo (Oeste)",
    "06-PRIVATIVO-COMBOIO": "Comboio Privativo",
    "07-SALA-PG-3-PISO": "3o andar - Gabinete Presidente da República",
    "08-SUBSOLO-ADM": "Subsolo (Administrativo)",
    "09-ELEVADOR-DE-SERVICO-TERREO": "Térreo - Elevador de Serviço",
    "10-SALAO-NOBRE": "Térreo - Salão Nobre",
    "11-SALAO-OESTE": "Térreo - Salão Oeste",
    "12-2o-ANDAR-RAMPA": "2º andar - Rampa",
    "13-2o-ANDAR-ELEVADOR-LESTE": "2º andar -  Elevador Leste",
    "14-2o-ANDAR-ELEVADOR-OESTE": "2º andar -  Elevador Leste Oeste ",
    "15-MESANINO": "Mezanino",
    "16-CAMERA-VIP-PR": "Térreo - Entrada Presidência da República",
    "17-3o-ANDAR-SALA-PR": "3º andar - Sala Presidente da República",
    "18-3o-ANDAR-SALA-DE-AUDIENCIA": "3º andar - Sala de Audiência",
    "19-3o-ANDAR-CORREDOR-ACESSO-LESTE": "3º andar - Corredor Acesso (Leste)",
    "20-ELEVADORES-ALA-OESTE": "4o andar Elevadores (Oeste)",
    "21-2o-ANDAR-ESCADA-OESTE": "2º andar Escada (Oeste)",
    "22-3o-ANDAR-ESCADA-OESTE": "3º andar Escada (Oeste)",
    "23-ELEVADOR-MINISTROS": "3º andar - Elevador do Ministros ",
    "24-4o-ANDAR-ELEVADOR-LESTE": "4° andar - Elevador (Leste) ",
    "25-4o-ANDAR-ESCADA-OESTE": "4° andar - Escada (Oeste)",
    "26-4o-ANDAR-ELEVADOR-OESTE": "4º andar - Elevador (Oeste) ",
    "27-4o-ANDAR-LADO-LESTE": "4º Andar (Leste)",
    "28-4o-ANDAR-LADO-OESTE": "4º Andar - (Oeste)",
    "29-ANEXO-I": "Anexo I",
    "30-ANEXO-I-ENTRADA-PRINCIPAL-CATRACAS":
      "Anexo I - Entrada Principal (Catracas)",
    "31-ANEXO-I-CONCHA-ANEXO": "Anexo I - Entrada (Externa)",
    "32-ANEXO-III-REFEITORIO-CREDEN": "Anexo III Refeitório Credenciamento",
    "33-ANEXO-III-REFEITORIO": "Anexo III - Refeitório",
  },
};

const OBJ2LABEL = {
  en: {
    "brazilian flag": "Flags",
    chair: "Chairs",
    "fire extinguisher": "Fire Extinguishers",
    painting: "Paintings",
    person: "People",
    sculpture: "Sculptures",
    "support column": "Support Columns",
    table: "Tables",
    vehicle: "Vehicles",
    window: "Windows",
  },
  pt: {
    "brazilian flag": "Bandeiras",
    chair: "Cadeiras",
    "fire extinguisher": "Extintores De Incêndio",
    painting: "Quadros",
    person: "Pessoas",
    sculpture: "Esculturas",
    "support column": "Colunas de Suporte",
    table: "Mesas",
    vehicle: "Veículos",
    window: "Janelas",
  },
};

const ABOUTTEXT = {
  en: `
  <p>Navigation interface for the more than 500 hours of videos from Palácio do Planalto on January 8, 2023. These images come from 33 surveillance cameras and were made available by the GSI by order of the Federal Supreme Court.</p>
  <p>When browsing by <a href="../time">TIME</a> you browse all the videos at a chosen time. This makes it possible to obtain an overview of the movement of the mob throughout the Palace on January 8, 2023.</p>
  <p>In <a href="../location">LOCATION</a> mode, you navigate through the different spaces recorded by the Palace cameras. This allows you to understand the dynamics of occupation during the invasion of the coup plotters throughout the day.</p>
  <p>In <a href="../objects">OBJECTS</a> mode, you browse architectural elements, such as windows and columns, and objects used by the mob that became icons for the event, like the national flag and fire extinguishers.</p>
  <p>Project developed within the research group <a href = "https://www.acervosdigitais.fau.usp.br/" target = "_blank">Acervos Digitais</a >. Code and scripts used are available on our <a href="https://github.com/acervos-digitais" target="_blank">GitHub</a>.</p>
  `,
  pt: `
  <p>Interface de acesso às 500 horas de vídeos do Palácio do Planalto no dia 8 de janeiro de 2023. Essas imagens são provenientes das 33 câmeras de vigilância do local e foram disponibilizadas pelo GSI por ordem do Supremo Tribunal Federal.</p>
  <p>No modo de navegação por <a href="../time">HORÁRIO</a> você navega em todos os vídeos a partir de um horário escolhido.Isso possibilita obter uma visão de conjunto da movimentação dos golpistas no Palácio ao longo do dia 8 de janeiro de 2023.</p>
  <p>No modo <a href="../location">CAMERA</a>, você navega pelos diferentes espaços registrados pelas câmeras do Palácio do Planalto.Isso permite compreender as dinâmicas de ocupação durante a invasão dos golpistas ao longo do dia.</p>
  <p>No modo <a href="../objects">OBJETOS</a>, você navega por elementos arquitetônicos, como janelas e colunas, e marcadores que se sobressaíram em nossas análises, como o uso da bandeira nacional e de extintores de incêndio, pelos golpistas.</p>
  <p>Projeto desenvolvido dentro do grupo de pesquisa <a href = "https://www.acervosdigitais.fau.usp.br/" target = "_blank">Acervos Digitais</a>. Códigos e scripts usado estão disponíveis no nosso <a href="https://github.com/acervos-digitais" target="_blank">GitHub</a> em formato aberto.</p>
  `,
};
