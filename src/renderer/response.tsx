import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import { ResponsePage } from "./ResponsePage";

document.addEventListener("DOMContentLoaded", () => {
    createRoot(document.getElementById("response") as HTMLDivElement).render(
        <HashRouter>
            <ResponsePage />
        </HashRouter>,
    );
});
