(function () {
  const data = window.SMARTMEC_GALLERY;
  if (!data || !data.projects) return;

  const state = {
    filter: "all",
    flat: [],
    index: 0
  };

  function $(sel, root) {
    return (root || document).querySelector(sel);
  }

  function stageFor(project, index) {
    if (!project.stages) return null;
    return project.stages.find((s) => index >= s.from && index <= s.to) || null;
  }

  function buildFlat() {
    state.flat = [];
    data.projects.forEach((project) => {
      project.images.forEach((file, i) => {
        const stage = stageFor(project, i);
        state.flat.push({
          src: `${project.folder}/${file}`,
          projectId: project.id,
          projectTitle: project.title,
          filter: project.filter,
          stage: stage ? stage.label : null,
          indexInProject: i + 1,
          totalInProject: project.images.length,
          caption: stage
            ? `${project.title} · ${stage.label} (${i + 1}/${project.images.length})`
            : `${project.title} · ${i + 1} of ${project.images.length}`
        });
      });
    });
  }

  function renderSpotlight() {
    const host = $("#gallerySpotlight");
    if (!host) return;
    const picks = data.projects.map((p) => ({
      project: p,
      file: p.images[p.images.length - 1] || p.images[0]
    }));
    host.innerHTML = picks
      .map(
        (p, i) => `
      <a class="spotlight-card" href="#project-${p.project.id}" data-spotlight="${i}">
        <img src="${p.project.folder}/${p.file}" alt="${p.project.title}" loading="lazy">
        <div class="spotlight-meta">
          <span>${p.project.eyebrow}</span>
          <strong>${p.project.title}</strong>
          <em>${p.project.images.length} photos</em>
        </div>
      </a>`
      )
      .join("");
  }

  function renderFilters() {
    const host = $("#galleryFilters");
    if (!host) return;
    const filters = [
      { id: "all", label: "All projects" },
      { id: "workshop", label: "Workshop" },
      { id: "paint", label: "Paint & finish" },
      { id: "body", label: "Body & facelift" }
    ];
    host.innerHTML = filters
      .map(
        (f) =>
          `<button type="button" class="filter-btn${f.id === state.filter ? " active" : ""}" data-filter="${f.id}">${f.label}</button>`
      )
      .join("");
    host.querySelectorAll(".filter-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.filter = btn.dataset.filter;
        host.querySelectorAll(".filter-btn").forEach((b) => b.classList.toggle("active", b === btn));
        applyFilter();
      });
    });
  }

  function renderProjects() {
    const host = $("#galleryProjects");
    if (!host) return;

    host.innerHTML = data.projects
      .map((project) => {
        const featured = project.images[project.images.length - 1];
        const open = project.images[0];
        let body = "";

        if (project.stages) {
          body = project.stages
            .map((stage) => {
              const slice = project.images.slice(stage.from, stage.to + 1);
              return `
              <div class="gallery-stage">
                <div class="gallery-stage-head">
                  <span>${stage.label}</span>
                  <small>${slice.length} frames</small>
                </div>
                <div class="gallery-mosaic">
                  ${slice
                    .map((file, localIdx) => {
                      const globalIdx = stage.from + localIdx;
                      const flatIndex = state.flat.findIndex(
                        (f) => f.projectId === project.id && f.indexInProject === globalIdx + 1
                      );
                      return `
                      <button type="button" class="gallery-tile" data-index="${flatIndex}" aria-label="${project.title} ${stage.label}">
                        <img src="${project.folder}/${file}" alt="" loading="lazy">
                      </button>`;
                    })
                    .join("")}
                </div>
              </div>`;
            })
            .join("");
        } else {
          body = `<div class="gallery-mosaic">
            ${project.images
              .map((file, i) => {
                const flatIndex = state.flat.findIndex(
                  (f) => f.projectId === project.id && f.indexInProject === i + 1
                );
                return `
                <button type="button" class="gallery-tile${i === 0 ? " gallery-tile--wide" : ""}" data-index="${flatIndex}" aria-label="${project.title} photo ${i + 1}">
                  <img src="${project.folder}/${file}" alt="" loading="lazy">
                </button>`;
              })
              .join("")}
          </div>`;
        }

        return `
        <article class="gallery-project" id="project-${project.id}" data-filter="${project.filter}">
          <header class="gallery-project-head">
            <div>
              <p class="eyebrow purple">${project.eyebrow}</p>
              <h2>${project.title}</h2>
              <p>${project.blurb}</p>
            </div>
            <div class="gallery-project-count">
              <b>${project.images.length}</b>
              <span>photos in sequence</span>
            </div>
          </header>
          <div class="gallery-feature-pair">
            <button type="button" class="gallery-feature" data-index="${state.flat.findIndex((f) => f.projectId === project.id && f.indexInProject === 1)}" aria-label="Open first photo">
              <img src="${project.folder}/${open}" alt="Start of ${project.title}" loading="lazy">
              <span>Start of sequence</span>
            </button>
            <button type="button" class="gallery-feature" data-index="${state.flat.findIndex((f) => f.projectId === project.id && f.indexInProject === project.images.length)}" aria-label="Open latest photo">
              <img src="${project.folder}/${featured}" alt="Latest from ${project.title}" loading="lazy">
              <span>Latest in sequence</span>
            </button>
          </div>
          ${body}
        </article>`;
      })
      .join("");

    host.querySelectorAll("[data-index]").forEach((el) => {
      el.addEventListener("click", () => openLightbox(Number(el.dataset.index)));
    });
  }

  function applyFilter() {
    document.querySelectorAll(".gallery-project").forEach((el) => {
      const show = state.filter === "all" || el.dataset.filter === state.filter;
      el.hidden = !show;
    });
    document.querySelectorAll(".spotlight-card").forEach((card, i) => {
      const project = data.projects[i];
      card.hidden = !(state.filter === "all" || project.filter === state.filter);
    });
  }

  function openLightbox(index) {
    if (index < 0 || index >= state.flat.length) return;
    state.index = index;
    const item = state.flat[index];
    const box = $("#lightbox");
    const img = $("#lightboxImg");
    const cap = $("#lightboxCaption");
    img.src = item.src;
    img.alt = item.caption;
    if (cap) cap.textContent = item.caption;
    box.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    $("#lightbox").classList.remove("open");
    document.body.style.overflow = "";
  }

  function stepLightbox(delta) {
    const visible = state.flat
      .map((item, i) => ({ item, i }))
      .filter(({ item }) => state.filter === "all" || item.filter === state.filter);
    if (!visible.length) return;
    let pos = visible.findIndex((v) => v.i === state.index);
    if (pos < 0) pos = 0;
    pos = (pos + delta + visible.length) % visible.length;
    openLightbox(visible[pos].i);
  }

  function initLightbox() {
    $("#lightboxClose").addEventListener("click", closeLightbox);
    $("#lightboxPrev").addEventListener("click", () => stepLightbox(-1));
    $("#lightboxNext").addEventListener("click", () => stepLightbox(1));
    $("#lightbox").addEventListener("click", (e) => {
      if (e.target.id === "lightbox") closeLightbox();
    });
    document.addEventListener("keydown", (e) => {
      if (!$("#lightbox").classList.contains("open")) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") stepLightbox(-1);
      if (e.key === "ArrowRight") stepLightbox(1);
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    if (!$("#galleryProjects")) return;
    buildFlat();
    renderSpotlight();
    renderFilters();
    renderProjects();
    applyFilter();
    initLightbox();
    const count = $("#galleryCount");
    if (count) count.textContent = `${state.flat.length} workshop photographs · ${data.projects.length} projects`;
  });
})();
