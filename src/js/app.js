const THEME_KEY = "theme";
const LANG_KEY = "lang";
const DEFAULT_LANG = "tr";

const html = document.documentElement;
const themeToggleButton = document.querySelector("[data-theme-toggle]");
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");

const SUPPORTED_LANGS = ["tr", "en"];

const fragmentModal = document.querySelector("[data-fragment-modal]");
const fragmentContent = fragmentModal?.querySelector("[data-fragment-content]");

function openFragmentModal() {
    if (!fragmentModal) {
        return;
    }
    fragmentModal.hidden = false;
    fragmentModal.dataset.visible = "true";
    document.body.style.overflow = "hidden";
}

function closeFragmentModal() {
    if (!fragmentModal) {
        return;
    }
    fragmentModal.dataset.visible = "false";
    fragmentModal.hidden = true;
    document.body.style.overflow = "";
    if (fragmentContent) {
        fragmentContent.innerHTML = "";
    }
}

function setFragmentContent(htmlText) {
    if (!fragmentContent) {
        return;
    }
    fragmentContent.innerHTML = htmlText;
}

async function handleFragmentClick(button) {
    if (!button) {
        return;
    }
    const url = button.dataset.fragmentUrl;
    if (!url) {
        return;
    }

    setFragmentContent("<p>Loading fragment...</p>");
    openFragmentModal();

    try {
        const response = await fetch(url, { credentials: "same-origin" });
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        const htmlText = await response.text();
        setFragmentContent(htmlText);
    } catch (error) {
        setFragmentContent("<p>Fragment load failed.</p>");
    }
}

document.addEventListener("click", (event) => {
    const themeToggle = event.target.closest("[data-theme-toggle]");
    if (themeToggle) {
        const nextTheme = html.classList.contains("dark") ? "light" : "dark";
        setTheme(nextTheme);
        return;
    }

    const langToggle = event.target.closest("[data-lang-toggle]");
    if (langToggle) {
        const current = html.getAttribute("lang") || DEFAULT_LANG;
        const next = current === "tr" ? "en" : "tr";
        setLang(next, { redirect: true });
        return;
    }

    const fragmentButton = event.target.closest("[data-fragment-button]");
    if (fragmentButton) {
        event.preventDefault();
        handleFragmentClick(fragmentButton);
        return;
    }

    const fragmentClose = event.target.closest("[data-fragment-close]");
    if (fragmentClose) {
        event.preventDefault();
        closeFragmentModal();
        return;
    }

    if (fragmentModal && event.target === fragmentModal) {
        closeFragmentModal();
        return;
    }

    const shareTrigger = event.target.closest("[data-share-network]");
    if (shareTrigger) {
        event.preventDefault();
        handleShareClick(shareTrigger);
        return;
    }

    const copyTrigger = event.target.closest("[data-copy-link]");
    if (copyTrigger) {
        event.preventDefault();
        handleCopyLink(copyTrigger);
        return;
    }
});

function applyTheme(theme) {
    const isDark = theme === "dark";
    html.classList.toggle("dark", isDark);
    if (themeToggleButton) {
        themeToggleButton.setAttribute("aria-pressed", String(isDark));
    }
}

function resolveTheme() {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === "light" || stored === "dark") {
        return stored;
    }
    return prefersDark.matches ? "dark" : "light";
}

function setTheme(theme) {
    localStorage.setItem(THEME_KEY, theme);
    applyTheme(theme);
}

function getLangDatasetKey(lang) {
    if (!lang) {
        return "";
    }
    return `lang${lang.charAt(0).toUpperCase()}${lang.slice(1)}`;
}

function normalizeLangUrl(url) {
    if (!url) {
        return "";
    }
    const trimmed = url.trim();
    if (!trimmed) {
        return "";
    }

    const siteBase = (html.dataset.siteBase || "").replace(/\/+$/, "");
    if (siteBase && trimmed.startsWith(siteBase)) {
        const relative = trimmed.slice(siteBase.length) || "/";
        return relative.startsWith("/") ? relative : `/${relative}`;
    }

    return trimmed;
}

function redirectToLangPage(lang) {
    const datasetKey = getLangDatasetKey(lang);
    if (!datasetKey) {
        return;
    }
    const rawTarget = html.dataset[datasetKey];
    const normalizedTarget = normalizeLangUrl(rawTarget);
    if (!normalizedTarget) {
        return;
    }
    const finalUrl = new URL(normalizedTarget, window.location.origin).href;
    if (finalUrl !== window.location.href) {
        window.location.assign(finalUrl);
    }
}

function setLang(lang, options = {}) {
    const shouldRedirect = Boolean(options.redirect);
    const safeLang = SUPPORTED_LANGS.includes(lang) ? lang : DEFAULT_LANG;
    localStorage.setItem(LANG_KEY, safeLang);
    html.setAttribute("lang", safeLang);

    if (shouldRedirect) {
        redirectToLangPage(safeLang);
    }
}

function handleShareClick(element) {
    const network = element.dataset.shareNetwork;
    if (!network) {
        return;
    }

    const shareTitle = element.dataset.shareTitle || document.title;
    const shareUrl = element.dataset.shareUrl || window.location.href;
    const encodedTitle = encodeURIComponent(shareTitle);
    const encodedUrl = encodeURIComponent(shareUrl);
    let targetUrl = "";

    switch (network) {
        case "whatsapp":
            targetUrl = `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`;
            break;
        case "x":
            targetUrl = `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`;
            break;
        case "linkedin":
            targetUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
            break;
        case "facebook":
            targetUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
            break;
        default:
            break;
    }

    if (targetUrl) {
        window.open(targetUrl, "_blank", "noopener,noreferrer");
    }
}

function copyTextToClipboard(text) {
    if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
        return navigator.clipboard.writeText(text);
    }

    return new Promise((resolve, reject) => {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.setAttribute("readonly", "");
        textarea.style.position = "absolute";
        textarea.style.left = "-9999px";
        document.body.appendChild(textarea);
        textarea.select();

        try {
            document.execCommand("copy");
            resolve();
        } catch (error) {
            reject(error);
        } finally {
            document.body.removeChild(textarea);
        }
    });
}

function handleCopyLink(button) {
    const targetUrl = button.dataset.copyUrl || window.location.href;
    const defaultLabel = button.dataset.copyLabel || button.textContent || "";
    const successLabel = button.dataset.copySuccess || defaultLabel;

    copyTextToClipboard(targetUrl)
        .then(() => {
            button.dataset.copyState = "copied";
            button.textContent = successLabel;
            setTimeout(() => {
                button.dataset.copyState = "";
                button.textContent = defaultLabel;
            }, 2000);
        })
        .catch(() => {
            button.dataset.copyState = "";
        });
}

function getRandomInRange(min, max) {
    const parsedMin = Math.ceil(min);
    const parsedMax = Math.floor(max);
    return Math.floor(Math.random() * (parsedMax - parsedMin + 1)) + parsedMin;
}

function initStarToast() {
    const toast = document.querySelector("[data-star-toast]");
    if (!toast) {
        return;
    }

    const dismissButton = toast.querySelector("[data-star-toast-dismiss]");
    const ctaButton = toast.querySelector("[data-star-toast-cta]");
    let hideTimer = null;
    let showTimer = null;
    let isVisible = false;

    const scheduleNext = () => {
        if (showTimer) {
            clearTimeout(showTimer);
        }
        const delay = getRandomInRange(20000, 40000);
        showTimer = setTimeout(showToast, delay);
    };

    const hideToast = () => {
        if (!isVisible) {
            return;
        }
        if (hideTimer) {
            clearTimeout(hideTimer);
            hideTimer = null;
        }
        toast.dataset.visible = "false";
        isVisible = false;
        setTimeout(() => {
            toast.hidden = true;
            scheduleNext();
        }, 500);
    };

    const showToast = () => {
        if (isVisible) {
            return;
        }
        toast.hidden = false;
        requestAnimationFrame(() => {
            toast.dataset.visible = "true";
        });
        isVisible = true;
        if (hideTimer) {
            clearTimeout(hideTimer);
        }
        const visibleDuration = getRandomInRange(3000, 5000);
        hideTimer = setTimeout(hideToast, visibleDuration);
    };

    dismissButton?.addEventListener("click", (event) => {
        event.preventDefault();
        hideToast();
    });

    ctaButton?.addEventListener("click", () => {
        hideToast();
    });

    const initialDelay = getRandomInRange(4000, 9000);
    showTimer = setTimeout(showToast, initialDelay);
}

window.addEventListener("load", initStarToast);

(function init() {
    applyTheme(resolveTheme());
    if (!localStorage.getItem(LANG_KEY)) {
        const currentLang = html.getAttribute("lang") || DEFAULT_LANG;
        localStorage.setItem(LANG_KEY, currentLang);
    }

    const handleSchemeChange = (event) => {
        if (!localStorage.getItem(THEME_KEY)) {
            applyTheme(event.matches ? "dark" : "light");
        }
    };

    if (typeof prefersDark.addEventListener === "function") {
        prefersDark.addEventListener("change", handleSchemeChange);
    } else if (typeof prefersDark.addListener === "function") {
        prefersDark.addListener(handleSchemeChange);
    }
})();
