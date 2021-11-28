import { useState } from "react";

export const useDisplay = () => {
  const [display, setDisplay] = useState('card');


  return [display, setDisplay];
};
