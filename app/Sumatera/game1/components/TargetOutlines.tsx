"use client"
import React from "react";
import { Piece } from "../types";

interface TargetOutlinesProps {
  pieces: Piece[];
  showHint: string | null;
}

const TargetOutlines: React.FC<TargetOutlinesProps> = ({ pieces, showHint }) => {
  // Hide outlines for cleaner look
  return null;
};

export default TargetOutlines;
