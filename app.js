document.addEventListener("DOMContentLoaded", () => {
    const motionOk = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (motionOk) startBackground(document.getElementById("bg-motion"));
    const processStage = document.querySelector(".process-stage");
    const processWide = window.matchMedia("(min-width: 761px)");
    const processScrollOn = motionOk && processWide.matches && processStage;
    if (processScrollOn) setupProcessScroll(processStage, processWide);
    if (motionOk) {
        const groups = [
            ".section-intro",
            ".reason-list li",
            ".lang-grid article",
            ".offer-stack li",
            ".service",
            ".about-copy",
            ".about-side",
            ".roles article",
            ".work-card",
            ".sample-card",
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

function startBackground(canvas) {
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const plate = new Image();
    let ready = false;
    plate.src = "assets/bg-still.jpg";
    plate.onload = () => { ready = true; };
    const specks = Array.from({ length: 150 }, () => ({
        x: Math.random(),
        y: Math.random(),
        r: Math.random() * 1.7 + 0.35,
        vx: Math.random() * 0.00105 + 0.00018,
        vy: (Math.random() - 0.5) * 0.00022,
        a: Math.random() * 0.5 + 0.16,
        tint: Math.random() > 0.72 ? "186, 214, 255" : "206, 176, 255"
    }));
    const clouds = [
        { x: 0.06, y: 0.9, rx: 0.3, ry: 0.16, v: 0.00011, hue: "128, 64, 255", a: 0.11 },
        { x: 0.92, y: 0.06, rx: 0.26, ry: 0.14, v: -0.00009, hue: "72, 108, 255", a: 0.09 },
        { x: 0.58, y: 1.02, rx: 0.34, ry: 0.14, v: 0.00007, hue: "168, 80, 255", a: 0.08 }
    ];
    const streaks = Array.from({ length: 3 }, () => ({
        x: Math.random(),
        y: 0.58 + Math.random() * 0.34,
        w: 0.12 + Math.random() * 0.1,
        v: 0.0014 + Math.random() * 0.0011,
        a: 0.1 + Math.random() * 0.1
    }));
    const resize = () => {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = Math.floor(window.innerWidth * dpr);
        canvas.height = Math.floor(window.innerHeight * dpr);
        canvas.style.width = `${window.innerWidth}px`;
        canvas.style.height = `${window.innerHeight}px`;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);
    let frame = 0;
    let alive = true;
    const draw = () => {
        if (!alive) return;
        frame += 1;
        const w = window.innerWidth;
        const h = window.innerHeight;
        ctx.clearRect(0, 0, w, h);
        ctx.fillStyle = "#07060d";
        ctx.fillRect(0, 0, w, h);
        if (ready) {
            const drift = (Math.sin(frame / 680) + 1) / 2;
            const scale = 1.22;
            const dw = w * scale;
            const dh = h * scale;
            const yShift = Math.sin(frame / 520) * 28;
            ctx.globalAlpha = 0.92;
            ctx.drawImage(plate, -drift * (dw - w), yShift - (dh - h) * 0.4, dw, dh);
            ctx.globalAlpha = 1;
        }
        clouds.forEach((cloud, index) => {
            cloud.x += cloud.v;
            if (cloud.x > 1.35) cloud.x = -0.35;
            if (cloud.x < -0.35) cloud.x = 1.35;
            const y = cloud.y + Math.sin(frame / 380 + index) * 0.03;
            const grd = ctx.createRadialGradient(cloud.x * w, y * h, 0, cloud.x * w, y * h, cloud.rx * w);
            grd.addColorStop(0, `rgba(${cloud.hue}, ${cloud.a})`);
            grd.addColorStop(1, `rgba(${cloud.hue}, 0)`);
            ctx.fillStyle = grd;
            ctx.beginPath();
            ctx.ellipse(cloud.x * w, y * h, cloud.rx * w, cloud.ry * h, 0, 0, Math.PI * 2);
            ctx.fill();
        });
        streaks.forEach((streak) => {
            streak.x += streak.v;
            if (streak.x > 1.2) streak.x = -streak.w;
            const grd = ctx.createLinearGradient(streak.x * w, 0, (streak.x + streak.w) * w, 0);
            grd.addColorStop(0, "rgba(210, 180, 255, 0)");
            grd.addColorStop(0.5, `rgba(226, 206, 255, ${streak.a})`);
            grd.addColorStop(1, "rgba(210, 180, 255, 0)");
            ctx.fillStyle = grd;
            ctx.fillRect(streak.x * w, streak.y * h, streak.w * w, 1.4);
        });
        specks.forEach((dot) => {
            dot.x += dot.vx;
            dot.y += dot.vy;
            if (dot.x > 1.04) dot.x = -0.04;
            if (dot.y < -0.04) dot.y = 1.04;
            if (dot.y > 1.04) dot.y = -0.04;
            ctx.beginPath();
            ctx.fillStyle = `rgba(${dot.tint}, ${dot.a})`;
            ctx.arc(dot.x * w, dot.y * h, dot.r, 0, Math.PI * 2);
            ctx.fill();
        });
        requestAnimationFrame(draw);
    };
    document.addEventListener("visibilitychange", () => {
        const hidden = document.hidden;
        if (hidden) alive = false;
        if (!hidden && !alive) {
            alive = true;
            draw();
        }
    });
    draw();
}

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
