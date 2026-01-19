import { CardItem } from "./types";

export const GAME_DURATION = 60; // seconds

export const THEME_COLORS = {
  primary: "#543310", // Dark Brown
  secondary: "#AF8F6F", // Tan/Light Brown
  accent: "#D97706", // Gold
  background: "#F8F4E1", // Cream
  success: "#10B981", // Keep standard green for success or use accent-spirit if fitting, but green is better for UI feedback
  error: "#9F1239", // Accent Spirit (Dark Red)
  text: "#543310",
};

export const LANGUAGE_DATA: CardItem[] = [
  {
    id: "l1-q",
    content: "Siri'",
    type: "QUESTION",
    pairId: "l1",
    info: "Siri' itu kehormatan diri. Kalo ilang, malunya minta ampun di budaya Bugis-Makassar!",
  },
  {
    id: "l1-a",
    content: "Harga Diri",
    type: "ANSWER",
    pairId: "l1",
    info: "Siri' itu kehormatan diri. Kalo ilang, malunya minta ampun di budaya Bugis-Makassar!",
  },
  {
    id: "l2-q",
    content: "Tabe'",
    type: "QUESTION",
    pairId: "l2",
    info: "Tabe' artinya permisi, biar sopan kayak orang Sulawesi asli!",
  },
  {
    id: "l2-a",
    content: "Permisi",
    type: "ANSWER",
    pairId: "l2",
    info: "Tabe' artinya permisi, biar sopan kayak orang Sulawesi asli!",
  },
  {
    id: "l3-q",
    content: "Marendeng",
    type: "QUESTION",
    pairId: "l3",
    info: "Marendeng itu artinya aman dan sejahtera. Semoga kita semua selalu marendeng ya!",
  },
  {
    id: "l3-a",
    content: "Aman/Sentosa",
    type: "ANSWER",
    pairId: "l3",
    info: "Marendeng itu artinya aman dan sejahtera. Semoga kita semua selalu marendeng ya!",
  },
  {
    id: "l4-q",
    content: "Ewako",
    type: "QUESTION",
    pairId: "l4",
    info: "Ewako! Teriakkan ini kalau butuh semangat membara. Artinya Berani atau Lawan!",
  },
  {
    id: "l4-a",
    content: "Berani/Lawan",
    type: "ANSWER",
    pairId: "l4",
    info: "Ewako! Teriakkan ini kalau butuh semangat membara. Artinya Berani atau Lawan!",
  },
  {
    id: "l5-q",
    content: "Iye'",
    type: "QUESTION",
    pairId: "l5",
    info: "Kalo ditanya atau setuju, jawab 'Iye'' ya. Lebih halus dan sopan lho!",
  },
  {
    id: "l5-a",
    content: "Ya (Sopan)",
    type: "ANSWER",
    pairId: "l5",
    info: "Kalo ditanya atau setuju, jawab 'Iye'' ya. Lebih halus dan sopan lho!",
  },
  {
    id: "l6-q",
    content: "Pesse",
    type: "QUESTION",
    pairId: "l6",
    info: "Pesse itu rasa senasib sepenanggungan. Sakitmu, sakitku juga. Solidaritas abis!",
  },
  {
    id: "l6-a",
    content: "Empati/Solidaritas",
    type: "ANSWER",
    pairId: "l6",
    info: "Pesse itu rasa senasib sepenanggungan. Sakitmu, sakitku juga. Solidaritas abis!",
  },
];

export const SYMBOL_DATA: CardItem[] = [
  {
    id: "s1-q",
    content: "Tongkonan",
    type: "QUESTION",
    pairId: "s1",
    info: "Rumah adat Toraja yang atapnya melengkung keren kayak perahu. Namanya Tongkonan!",
  },
  {
    id: "s1-a",
    content: "Rumah Adat Toraja",
    image: "/assets/Sulawesi/game1/GambarBoardGame/Rumah-adat-toraja.png",
    type: "ANSWER",
    pairId: "s1",
    info: "Rumah adat Toraja yang atapnya melengkung keren kayak perahu. Namanya Tongkonan!",
  },
  {
    id: "s2-q",
    content: "Phinisi",
    type: "QUESTION",
    pairId: "s2",
    info: "Kapal legendaris penjelajah samudera dari Bugis-Makassar. Phinisi emang tiada duanya!",
  },
  {
    id: "s2-a",
    content: "Kapal Layar Bugis",
    image: "/assets/Sulawesi/game1/GambarBoardGame/Kapal-phinisi.png",
    type: "ANSWER",
    pairId: "s2",
    info: "Kapal legendaris penjelajah samudera dari Bugis-Makassar. Phinisi emang tiada duanya!",
  },
  {
    id: "s3-q",
    content: "Badik",
    type: "QUESTION",
    pairId: "s3",
    info: "Badik, senjata kecil tapi mematikan! Lambang keberanian pria Sulawesi.",
  },
  {
    id: "s3-a",
    content: "Senjata Tradisional",
    image: "/assets/Sulawesi/game1/GambarBoardGame/Badik.png",
    type: "ANSWER",
    pairId: "s3",
    info: "Badik, senjata kecil tapi mematikan! Lambang keberanian pria Sulawesi.",
  },
  {
    id: "s4-q",
    content: "Baju Bodo",
    type: "QUESTION",
    pairId: "s4",
    info: "Salah satu baju tertua di dunia lho! Baju Bodo cantik dan penuh warna.",
  },
  {
    id: "s4-a",
    content: "Pakaian Adat Wanita",
    image: "/assets/Sulawesi/game1/GambarBoardGame/Baju-bodo.png",
    type: "ANSWER",
    pairId: "s4",
    info: "Salah satu baju tertua di dunia lho! Baju Bodo cantik dan penuh warna.",
  },
  {
    id: "s5-q",
    content: "Songkok Recca",
    type: "QUESTION",
    pairId: "s5",
    info: "Peci anyaman serat lontar emas yang mewah. Khas banget buat bangsawan Bugis!",
  },
  {
    id: "s5-a",
    content: "Peci Khas Bugis",
    image: "/assets/Sulawesi/game1/GambarBoardGame/Songkok-recca.png",
    type: "ANSWER",
    pairId: "s5",
    info: "Peci anyaman serat lontar emas yang mewah. Khas banget buat bangsawan Bugis!",
  },
  {
    id: "s6-q",
    content: "Kapurung",
    type: "QUESTION",
    pairId: "s6",
    info: "Makanan sagu khas Luwu yang seger banget. Wajib coba Kapurung!",
  },
  {
    id: "s6-a",
    content: "Makanan Sagu Luwu",
    image: "/assets/Sulawesi/game1/GambarBoardGame/Kapurung.png",
    type: "ANSWER",
    pairId: "s6",
    info: "Makanan sagu khas Luwu yang seger banget. Wajib coba Kapurung!",
  },
];
