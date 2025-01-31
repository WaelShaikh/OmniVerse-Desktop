import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import { SettingsPage } from "./SettingsPage";

document.addEventListener("DOMContentLoaded", () => {
    createRoot(document.getElementById("settings") as HTMLDivElement).render(
        <HashRouter>
            <SettingsPage />
        </HashRouter>,
    );
});
