import { useEffect } from "react";
import { MarqadorBoard } from "./marqador-board";

/* ——— MARQador, the real tab ———
   What opens from the button in WhatsApp Web (/?app=marqador): the same board as the
   presentation, full window, with the controls of a working app. */

export function MarqadorApp() {
  useEffect(() => {
    document.title = "MARQador · MARQ";
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", "#fbf6f1");
  }, []);
  return <MarqadorBoard standalone />;
}
