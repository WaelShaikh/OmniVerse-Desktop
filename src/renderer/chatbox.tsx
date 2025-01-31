import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import { ChatboxPage } from "./ChatboxPage";

document.addEventListener("DOMContentLoaded", () => {
    createRoot(document.getElementById("chatbox") as HTMLDivElement).render(
        <HashRouter>
            <ChatboxPage />
        </HashRouter>,
    );
});
