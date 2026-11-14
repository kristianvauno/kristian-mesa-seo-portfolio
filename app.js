document.addEventListener("DOMContentLoaded", () => {
    const motionOk = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const processStage = document.querySelector(".process-stage");
    const processWide = window.matchMedia("(min-width: 761px)");
    const processScrollOn = motionOk && processWide.matches && processStage;
    if (processScrollOn) setupProcessScroll(processStage, processWide);
    if (motionOk) {
        const groups = [
            ".section-intro",
            ".reason-list li",
            ".service",
            ".about-copy",
            ".about-side",
            ".roles article",
            ".work-card",
            ".faq-layout > div",
            ".faq",
            ".contact > div",
            ".form"
        ];
        if (!processScrollOn) groups.push(".process-grid li");
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

    const cursor = document.getElementById("cursor");
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    if (cursor && finePointer && motionOk) {
        document.body.classList.add("has-cursor");
        const dot = cursor.querySelector(".cursor-dot");
        const ring = cursor.querySelector(".cursor-ring");
        let x = 0;
        let y = 0;
        let ringX = 0;
        let ringY = 0;
        window.addEventListener("pointermove", (event) => {
            x = event.clientX;
            y = event.clientY;
            dot.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
            cursor.classList.add("is-on");
            const field = event.target.closest("input, textarea");
            const hot = event.target.closest("a, button");
            cursor.classList.toggle("is-text", Boolean(field));
            cursor.classList.toggle("is-hover", Boolean(hot) && !field);
        });
        document.documentElement.addEventListener("pointerleave", () => cursor.classList.remove("is-on"));
        const follow = () => {
            ringX += (x - ringX) * 0.16;
            ringY += (y - ringY) * 0.16;
            ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
            requestAnimationFrame(follow);
        };
        follow();
    }
});

function setupProcessScroll(stage, wide) {
    const cards = [...stage.querySelectorAll(".process-grid li")];
    const tracks = [
        { from: 0, to: 0.2, y: 50 },
        { from: 0.2, to: 0.4, y: 100 },
        { from: 0.4, to: 0.6, y: 150 },
        { from: 0.6, to: 0.8, y: 200 }
    ];
    let target = 0;
    let shown = 0;
    let running = false;

    const rawProgress = () => {
        const rect = stage.getBoundingClientRect();
        const view = window.innerHeight;
        const start = view;
        const end = view - rect.height;
        const span = start - end;
        if (span <= 0) return 1;
        return Math.min(1, Math.max(0, (start - rect.top) / span));
    };

    const paint = (progress) => {
        cards.forEach((card, index) => {
            const track = tracks[index];
            const t = Math.min(1, Math.max(0, (progress - track.from) / (track.to - track.from)));
            card.style.opacity = String(t);
            card.style.transform = `translateY(${track.y * (1 - t)}%) rotateY(${-180 * (1 - t)}deg)`;
        });
    };

    const tick = () => {
        if (!wide.matches) {
            running = false;
            return;
        }
        target = rawProgress();
        shown += (target - shown) * 0.1;
        if (Math.abs(target - shown) < 0.001) shown = target;
        paint(shown);
        if (shown !== target) requestAnimationFrame(tick);
        else running = false;
    };

    const kick = () => {
        if (!wide.matches) {
            stage.classList.remove("is-scroll");
            cards.forEach((card) => {
                card.style.opacity = "";
                card.style.transform = "";
            });
            running = false;
            return;
        }
        stage.classList.add("is-scroll");
        cards.forEach((card) => {
            card.classList.remove("reveal", "is-in");
            card.style.transitionDelay = "";
        });
        if (!running) {
            running = true;
            requestAnimationFrame(tick);
        }
    };

    window.addEventListener("scroll", kick, { passive: true });
    window.addEventListener("resize", kick);
    wide.addEventListener("change", kick);
    kick();
}
