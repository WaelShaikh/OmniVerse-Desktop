import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import { StartupPage } from "./StartupPage";

document.addEventListener("DOMContentLoaded", () => {
    createRoot(document.getElementById("startup") as HTMLDivElement).render(
        <HashRouter>
            <StartupPage />
        </HashRouter>,
    );
});
