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
    image: "/assets/Sulawesi/game2/Rumah-adat-toraja.png",
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
    image: "/assets/Sulawesi/game2/Kapal-phinisi.png",
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
    image: "/assets/Sulawesi/game2/Badik.png",
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
    image: "/assets/Sulawesi/game2/Baju-bodo.png",
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
    image: "/assets/Sulawesi/game2/Songkok-recca.png",
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
    image: "/assets/Sulawesi/game2/Kapurung.png",
    type: "ANSWER",
    pairId: "s6",
    info: "Makanan sagu khas Luwu yang seger banget. Wajib coba Kapurung!",
  },
];
