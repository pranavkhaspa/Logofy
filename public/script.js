import { app } from "./firebase-config.js";
import {
    getAuth,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// Firebase Auth Setup
const auth = getAuth();
onAuthStateChanged(auth, (user) => {
    if (!user) window.location.href = "login.html";
    else document.getElementById("userEmail").innerText = user.email;
});

document.getElementById("logoutBtn").addEventListener("click", async () => {
    await signOut(auth);
    window.location.href = "login.html";
});

// -------------------- NOTION-LIKE PAGE MANAGEMENT --------------------
let pages = {};  // Stores all pages
let currentPage = null;

// Create a new page
function createPage() {
    let pageId = "page" + (Object.keys(pages).length + 1);
    pages[pageId] = ""; // Store content
    
    let pageList = document.getElementById("pageList");
    let pageDiv = document.createElement("div");
    pageDiv.className = "page-item";
    pageDiv.textContent = "Page " + Object.keys(pages).length;
    pageDiv.ondblclick = () => renamePage(pageDiv, pageId);
    pageDiv.onclick = () => switchPage(pageId);
    pageList.appendChild(pageDiv);
    
    switchPage(pageId);
}

document.getElementById("newPageBtn").addEventListener("click", createPage);

// Rename Page
function renamePage(pageElement, pageId) {
    pageElement.setAttribute("contenteditable", "true");
    pageElement.focus();
    pageElement.onblur = () => {
        pageElement.removeAttribute("contenteditable");
        if (!pageElement.textContent.trim()) {
            pageElement.textContent = pageId;
        }
    };
    pageElement.onkeypress = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            pageElement.blur();
        }
    };
}

// Switch Page
function switchPage(pageId) {
    if (currentPage) {
        pages[currentPage] = document.getElementById("editor").innerHTML;
    }
    currentPage = pageId;
    document.getElementById("editor").innerHTML = pages[pageId];
    document.getElementById("editor").focus();
}

// Process YouTube Embedding
function processContent() {
    let editor = document.getElementById("editor");
    let selection = window.getSelection();
    let range = selection.rangeCount > 0 ? selection.getRangeAt(0) : null;

    let content = editor.innerHTML;
    let regex = /(https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/playlist\?list=)([a-zA-Z0-9_-]+))([&?][^"'\s]*)?/g;

    content = content.replace(regex, (match, url, id, queryParams) => {
        if (url.includes("playlist?list=")) {
            return `<iframe src="https://www.youtube.com/embed/videoseries?list=${id}" allowfullscreen></iframe><br>`;
        } else {
            return `<iframe src="https://www.youtube.com/embed/${id}" allowfullscreen></iframe><br>`;
        }
    });

    editor.innerHTML = content;

    if (range) {
        let newRange = document.createRange();
        let newSelection = window.getSelection();
        let lastNode = editor.lastChild;
        if (lastNode) {
            newRange.setStartAfter(lastNode);
        } else {
            newRange.setStart(editor, 0);
        }
        newRange.collapse(true);
        newSelection.removeAllRanges();
        newSelection.addRange(newRange);
    }
}

// Handle Enter Key & Heading Formatting
editor.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();

        let selection = window.getSelection();
        let range = selection.getRangeAt(0);
        let node = range.startContainer;

        // Convert `# Heading` to <h1>
        if (node.nodeType === Node.TEXT_NODE) {
            let text = node.textContent.trim();
            if (text.startsWith("#")) {
                let h1 = document.createElement("h1");
                h1.textContent = text.substring(1).trim();
                node.parentNode.replaceChild(h1, node);
                moveCursorAfter(h1);
                return;
            }
        }

        // Insert a new paragraph at cursor position
        document.execCommand("insertParagraph"); // Native insert without extra spacing
    }
});


// Move Cursor After Inserted Element
function moveCursorAfter(element) {
    let range = document.createRange();
    let selection = window.getSelection();
    range.setStartAfter(element);
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);
}

// Debounce Processing YouTube Links
function debounce(func, delay) {
    let timeout;
    return function () {
        clearTimeout(timeout);
        timeout = setTimeout(func, delay);
    };
}
const debouncedProcessContent = debounce(processContent, 500);
document.getElementById("editor").addEventListener("input", debouncedProcessContent);
function adjustHeight() {
    editor.style.height = "auto"; // Reset to recalculate height
    editor.style.height = editor.scrollHeight + "vh"; // Set new height
}

editor.addEventListener("input", adjustHeight);
