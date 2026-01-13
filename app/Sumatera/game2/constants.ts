import { Ingredient } from "./types";

export const INITIAL_INGREDIENTS: Ingredient[] = [
    { id: "santan", name: "Santan", order: 4, placed: false, color: "var(--foreground)", img: "/Sumatera/game2/santanrendang.jpg" },
    { id: "rempah", name: "Rempah", order: 1, placed: false, color: "var(--accent)", img: "/Sumatera/game2/rempahrendang.jpg" },
    { id: "cabai", name: "Cabai", order: 2, placed: false, color: "var(--foreground)", img: "/Sumatera/game2/cabairendang.jpg" },
    { id: "daging", name: "Daging", order: 3, placed: false, color: "var(--secondary)", img: "/Sumatera/game2/dagingrendang.jpg" },
];
