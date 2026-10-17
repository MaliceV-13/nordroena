/**
 * Norðrœna — spaced review stub (missed written items)
 */
(function (global) {
  function renderQueue(container) {
    const P = global.NORDRONA.progress;
    const queue = P.getReviewQueue();
    if (!queue.length) {
      container.innerHTML =
        '<p class="muted">No missed items yet. Incorrect written answers appear here for later review.</p>';
      return;
    }
    container.innerHTML = queue
      .map(
        (q) => `
      <article class="review-card" data-id="${q.id}">
        <p class="review-prompt">${q.prompt}</p>
        <details>
          <summary>Reveal answer</summary>
          <p><strong>${escapeHtml(String(q.answer))}</strong></p>
          <p class="muted">${q.explanation || ""}</p>
        </details>
        <button type="button" class="btn ghost review-dismiss" data-id="${q.id}">Mark reviewed</button>
      </article>`
      )
      .join("");

    container.querySelectorAll(".review-dismiss").forEach((btn) => {
      btn.addEventListener("click", () => {
        P.removeFromReview(btn.getAttribute("data-id"));
        renderQueue(container);
      });
    });
  }

  function escapeHtml(s) {
    return s
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  global.NORDRONA = global.NORDRONA || {};
  global.NORDRONA.review = { renderQueue };
})(window);
