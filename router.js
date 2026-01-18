const mainContent = document.getElementById("main-content");
const sidePanelList = document.querySelector(".side-panel ul");
function animateContent() {
    const elements = mainContent.querySelectorAll(".content-box > *");

    elements.forEach((el, i) => {
        el.style.animationDelay = `${i * 0.12}s`;
        el.classList.add("fade-in");
    });
}


// -------- Build sidebar for current page --------
function buildSidebar() {
    sidePanelList.innerHTML = ""; // clear existing items

    const sections = mainContent.querySelectorAll("section[id]");
    sections.forEach(sec => {
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.href = `#${sec.id}`; // scroll target
        a.textContent = sec.querySelector("h2")?.textContent || sec.id;
        a.addEventListener("click", e => {
            e.preventDefault();
            sec.scrollIntoView({ behavior: "smooth" });
        });
        li.appendChild(a);
        sidePanelList.appendChild(li);
    });
}

// -------- Load a page from pages/ folder --------
function loadPage(page) {
    fetch(`pages/${page}.html`)
        .then(res => {
            if (!res.ok) throw new Error("Page not found");
            return res.text();
        })
        .then(html => {
            document.body.dataset.page = page;

            mainContent.innerHTML = html;

            buildSidebar(); // build sidebar for this page
            animateContent();

            window.scrollTo(0,0); // scroll to top

            // Update URL hash without breaking SPA
            history.pushState({ page }, "", `#${page}`);
        })
        .catch(err => {
            mainContent.innerHTML = "<p>Failed to load page.</p>";
            console.error(err);
        });
}


// -------- Handle back/forward navigation --------
window.addEventListener("popstate", e => {
    const page = e.state?.page || "home";
    loadPage(page);
});

// -------- Handle section scrolling if URL has #section --------
window.addEventListener("load", () => {
    const hash = location.hash.replace("#", "");
    if (hash && !['home','challenge2026', 'preparation', 'about', 'contact','links'].includes(hash)) {
        // Scroll to section if it exists
        const section = document.getElementById(hash);
        if (section) section.scrollIntoView();
    } else {
        // Load initial page
        const initialPage = hash || "home";
        loadPage(initialPage);
    }
});

document.addEventListener("click", e => {
    const link = e.target.closest("a[data-page]");
    if (!link) return;

    e.preventDefault();
    loadPage(link.dataset.page);
});


const navToggle = document.querySelector(".nav-toggle");
const topNav = document.querySelector(".top-nav");

navToggle.addEventListener("click", () => {
    const isOpen = topNav.classList.toggle("open");
    navToggle.textContent = isOpen ? "−" : "+";
});

topNav.addEventListener("click", e => { 
    if (e.target.tagName === "A") { 
        topNav.classList.remove("open"); 
        navToggle.textContent = "+";
    } 
});
