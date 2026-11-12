document.addEventListener("DOMContentLoaded", () => {
    const motionOk = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (motionOk) {
        const groups = [
            ".section-intro",
            ".reason-list li",
            ".service",
            ".process-grid li",
            ".about-copy",
            ".about-side",
            ".roles article",
            ".work-card",
            ".faq-layout > div",
            ".faq",
            ".contact > div",
            ".form"
        ];
        groups.forEach((selector) => {
            document.querySelectorAll(selector).forEach((el, index) => {
                el.classList.add("reveal");
                el.style.transitionDelay = `${Math.min(index, 6) * 70}ms`;
            });
        });
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add("is-in");
                observer.unobserve(entry.target);
            });
        }, { threshold: 0.18, rootMargin: "0px 0px -8% 0px" });
        document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    }

    const stat = document.querySelector(".hero-stat strong");
    if (motionOk && stat && stat.dataset.count) {
        const target = Number(stat.dataset.count);
        const started = performance.now();
        const duration = 1200;
        const tick = (now) => {
            const progress = Math.min(1, (now - started) / duration);
            const eased = 1 - Math.pow(1 - progress, 3);
            stat.textContent = Math.round(target * eased) + "+";
            if (progress < 1) requestAnimationFrame(tick);
        };
        stat.textContent = "0+";
        setTimeout(() => requestAnimationFrame(tick), 500);
    }

    const nav = document.getElementById("nav");
    const toggle = document.getElementById("nav-toggle");
    const links = document.getElementById("nav-links");

    toggle.addEventListener("click", () => {
        const open = links.classList.toggle("is-open");
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    links.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => links.classList.remove("is-open"));
    });
    window.addEventListener("scroll", () => {
        nav.classList.toggle("is-stuck", window.scrollY > 8);
    });

    document.getElementById("service-list").addEventListener("click", (event) => {
        const button = event.target.closest(".service-head");
        if (!button) return;
        const item = button.parentElement;
        const wasOpen = item.classList.contains("is-open");
        document.querySelectorAll(".service").forEach((service) => service.classList.remove("is-open"));
        if (!wasOpen) item.classList.add("is-open");
    });

    document.querySelectorAll(".faq button").forEach((button) => {
        button.addEventListener("click", () => {
            const item = button.parentElement;
            const wasOpen = item.classList.contains("is-open");
            document.querySelectorAll(".faq").forEach((faq) => faq.classList.remove("is-open"));
            if (!wasOpen) item.classList.add("is-open");
        });
    });

    const subject = document.getElementById("subject");
    document.getElementById("topic-chips").addEventListener("click", (event) => {
        const chip = event.target.closest("[data-topic]");
        if (!chip) return;
        subject.value = chip.dataset.topic;
        document.querySelectorAll("#topic-chips button").forEach((button) => button.classList.remove("is-on"));
        chip.classList.add("is-on");
    });

    const lightbox = document.getElementById("lightbox");
    const lightboxImage = lightbox.querySelector("img");
    document.querySelectorAll(".work-card").forEach((card) => {
        card.addEventListener("click", () => {
            lightboxImage.src = card.dataset.full;
            lightboxImage.alt = card.querySelector("img").alt;
            lightbox.showModal();
        });
    });
    lightbox.querySelector(".lightbox-close").addEventListener("click", () => lightbox.close());
    lightbox.addEventListener("click", (event) => {
        if (event.target === lightbox) lightbox.close();
    });
});
