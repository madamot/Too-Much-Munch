import { useState } from "react";

export const useDisplay = () => {
  const [display, setDisplay] = useState('list');


  return [display, setDisplay];
};
