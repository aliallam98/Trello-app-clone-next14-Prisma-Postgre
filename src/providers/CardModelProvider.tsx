"use client";

import CardModel from "@/components/models/card-model/CardModel";
import React, { useEffect, useState } from "react";

const CardModelProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }
  return (
    <>
      <CardModel />
    </>
  );
};

export default CardModelProvider;
