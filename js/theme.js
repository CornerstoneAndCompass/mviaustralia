/* Shared behaviour for Missionary Ventures office sites.
   Office facts (phone, email, written answers) come from window.SITE,
   set by js/au-site.js or the sister office's equivalent. */
(function () {
    var site = window.SITE || {};
    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    var navToggle = document.getElementById("navToggle");
    var navMenu = document.getElementById("navMenu");

    function closeMenu() {
        if (!navToggle || !navMenu) return;
        navToggle.setAttribute("aria-expanded", "false");
        navMenu.classList.remove("open");
    }

    if (navToggle && navMenu) {
        navToggle.addEventListener("click", function () {
            var open = navToggle.getAttribute("aria-expanded") === "true";
            navToggle.setAttribute("aria-expanded", open ? "false" : "true");
            navMenu.classList.toggle("open", !open);
        });
    }

    document.querySelectorAll(".nav-subtoggle").forEach(function (button) {
        button.addEventListener("click", function () {
            if (window.matchMedia("(min-width: 1041px)").matches) return;
            var parent = button.closest(".nav-dropdown");
            if (!parent) return;
            var open = parent.classList.toggle("open");
            button.setAttribute("aria-expanded", open ? "true" : "false");
        });
    });

    document.querySelectorAll(".nav-menu a").forEach(function (link) {
        link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            closeMenu();
            var panel = document.getElementById("questionsPanel");
            var toggle = document.getElementById("questionsToggle");
            if (panel && !panel.hidden) {
                panel.hidden = true;
                if (toggle) toggle.setAttribute("aria-expanded", "false");
            }
        }
    });

    var toTop = document.getElementById("toTop");
    if (toTop) {
        var onScroll = function () {
            toTop.hidden = window.scrollY < 700;
        };
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        toTop.addEventListener("click", function () {
            window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
        });
    }

    document.querySelectorAll("[data-amounts]").forEach(function (group) {
        var root = group.closest("form") || document;
        var input = root.querySelector("[data-amount-input]");
        group.querySelectorAll(".amount").forEach(function (button) {
            button.addEventListener("click", function () {
                group.querySelectorAll(".amount").forEach(function (other) {
                    other.setAttribute("aria-pressed", "false");
                });
                button.setAttribute("aria-pressed", "true");
                if (input) input.value = button.getAttribute("data-amount") || "";
            });
        });
    });

    document.querySelectorAll("form.contact-form").forEach(function (form) {
        form.addEventListener("submit", function (event) {
            event.preventDefault();
            var note = form.querySelector(".form-note");
            if (!note) {
                note = document.createElement("p");
                note.className = "form-note";
                note.setAttribute("role", "status");
                form.appendChild(note);
            }
            var email = site.email || "";
            var phone = site.phoneDisplay || "";
            if (email) {
                note.textContent = "This page cannot send the note through. Email " + email + (phone ? " or call " + phone : "") + " and the office will reply.";
            } else {
                note.textContent = "This page cannot send the note through. Please use the email address in the footer.";
            }
        });
    });

    var questionsToggle = document.getElementById("questionsToggle");
    var questionsPanel = document.getElementById("questionsPanel");
    var questionsClose = document.getElementById("questionsClose");
    var questionsForm = document.getElementById("questionsForm");
    var questionsInput = document.getElementById("questionsInput");
    var questionsLog = document.getElementById("questionsLog");
    var questionsSuggestions = document.getElementById("questionsSuggestions");

    function escapeHtml(value) {
        return String(value).replace(/[&<>"']/g, function (character) {
            return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character];
        });
    }

    function answerFor(message) {
        var entries = site.answers || [];
        var lower = message.toLowerCase();
        var best = null;
        var bestScore = 0;
        entries.forEach(function (entry) {
            var score = 0;
            (entry.keywords || []).forEach(function (keyword) {
                if (lower.indexOf(keyword) !== -1) score += keyword.length;
            });
            if (score > bestScore) {
                bestScore = score;
                best = entry.answer;
            }
        });
        if (best) return best;
        var greetings = ["hello", "hi", "hey", "good morning", "good afternoon"];
        if (greetings.some(function (word) { return lower.indexOf(word) !== -1; })) {
            return site.greeting || "Ask about the work, team trips, giving, or the office.";
        }
        if (lower.indexOf("thank") !== -1) return site.thanks || "Glad to help.";
        return site.fallback || "Try one of the topics below, or use the email address in the footer.";
    }

    function addLine(text, kind) {
        if (!questionsLog) return;
        var block = document.createElement("div");
        block.className = kind === "ask" ? "q-ask" : "q-answer";
        var safe = escapeHtml(text).split("\n").map(function (line) {
            return line.trim();
        }).filter(Boolean);
        block.innerHTML = safe.map(function (line) {
            return "<p>" + line.replace(/^\d+\.\s/, "").replace(/^- /, "") + "</p>";
        }).join("");
        questionsLog.appendChild(block);
        questionsLog.scrollTop = questionsLog.scrollHeight;
    }

    function ask(message) {
        var trimmed = message.trim();
        if (!trimmed) return;
        addLine(trimmed, "ask");
        addLine(answerFor(trimmed), "answer");
        if (questionsSuggestions) questionsSuggestions.hidden = true;
    }

    if (questionsToggle && questionsPanel) {
        questionsToggle.addEventListener("click", function () {
            var open = questionsPanel.hidden;
            questionsPanel.hidden = !open;
            questionsToggle.setAttribute("aria-expanded", open ? "true" : "false");
            if (open && questionsInput) questionsInput.focus();
        });
    }
    if (questionsClose && questionsPanel && questionsToggle) {
        questionsClose.addEventListener("click", function () {
            questionsPanel.hidden = true;
            questionsToggle.setAttribute("aria-expanded", "false");
            questionsToggle.focus();
        });
    }
    if (questionsForm && questionsInput) {
        questionsForm.addEventListener("submit", function (event) {
            event.preventDefault();
            ask(questionsInput.value);
            questionsInput.value = "";
        });
    }
    document.querySelectorAll(".questions-suggestions button").forEach(function (button) {
        button.addEventListener("click", function () {
            ask(button.getAttribute("data-ask") || button.textContent || "");
        });
    });
})();
