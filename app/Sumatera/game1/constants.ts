import { Piece } from "./types";
export const PIECES_DATA: Piece[] = [
    {
        id: "tiang",
        name: "Tiang Utama",
        img: "/Sumatera/game1/gadang3.png",
        targetX: 0,
        targetY: 180,
        width: 360,
        height: 120,
        isSnapped: false,
    },
    {
        id: "dinding",
        name: "Dinding Ukiran",
        img: "/Sumatera/game1/gadang1.png",
        targetX: 0,
        targetY: 60,
        width: 320,
        height: 180,
        isSnapped: false,
    },
    {
        id: "atap",
        name: "Atap Gonjong",
        img: "/Sumatera/game1/gadang2.png",
        targetX: 0,
        targetY: -100,
        width: 450,
        height: 250,
        isSnapped: false,
    },
];
