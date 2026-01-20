// src/scripts/flip.js
export class CoinFlipApp {
  constructor() {
    this.elements = {
      coin: document.getElementById("coin"),
      flipBtn: document.getElementById("flipBtn"),
      resetBtn: document.getElementById("resetBtn"),
      resultLabel: document.getElementById("resultLabel"),
      timelineList: document.getElementById("timelineList"),
      statHeads: document.getElementById("statHeads"),
      statTails: document.getElementById("statTails"),
      statTotal: document.getElementById("statTotal"),
    };
    this.state = {
      heads: 0,
      tails: 0,
      history: [],
      isFlipping: false,
    };
    this.bindEvents();
  }

  bindEvents() {
    this.elements.flipBtn.addEventListener("click", () => this.flip());
    this.elements.coin.addEventListener("click", () => this.flip());
    this.elements.resetBtn.addEventListener("click", () => this.reset());
  }

  getSecureRandom() {
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    return array[0] / (0xffffffff + 1);
  }

  flip() {
    if (this.state.isFlipping) return;
    this.state.isFlipping = true;
    this.elements.flipBtn.disabled = true;
    this.elements.resultLabel.classList.remove("visible");

    const isHeads = this.getSecureRandom() < 0.5;
    const result = isHeads ? "heads" : "tails";

    this.elements.coin.style.animation = "none";
    void this.elements.coin.offsetHeight;

    const animation = isHeads ? "spin-heads" : "spin-tails";
    this.elements.coin.style.animation = `${animation} 2s cubic-bezier(0.4, 2, 0.5, 1) forwards`;
    this.elements.coin.classList.add("is-flipping");

    setTimeout(() => this.handleFlipComplete(result), 2000);
  }

  handleFlipComplete(result) {
    this.state[result]++;
    const flipEntry = {
      id: this.state.heads + this.state.tails,
      result: result,
      time: new Date().toLocaleTimeString("en-US", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
    };

    this.state.history.unshift(flipEntry);

    this.elements.coin.classList.remove("is-flipping");
    this.elements.flipBtn.disabled = false;

    this.elements.resultLabel.textContent =
      result === "heads" ? "HEADS!" : "TAILS!";
    this.elements.resultLabel.className = `result-text visible text-${result}`;

    this.updateStats();
    this.renderTimeline();
    this.state.isFlipping = false;
  }

  updateStats() {
    this.elements.statHeads.textContent = this.state.heads;
    this.elements.statTails.textContent = this.state.tails;
    this.elements.statTotal.textContent = this.state.heads + this.state.tails;
  }

  renderTimeline() {
    if (this.state.history.length === 0) {
      this.elements.timelineList.innerHTML =
        '<div class="empty-state">No flips yet.</div>';
      return;
    }

    const html = this.state.history
      .map(
        (item) => `
      <div class="timeline-item ${item.result}">
        <div class="timeline-marker"></div>
        <div class="timeline-content">
          <div class="timeline-left">
            <span class="t-count">#${item.id}</span>
            <span class="t-result">${item.result.toUpperCase()}</span>
          </div>
          <span class="t-time">${item.time}</span>
        </div>
      </div>
    `,
      )
      .join("");
    this.elements.timelineList.innerHTML = html;
  }

  reset() {
    if (this.state.isFlipping) return;
    this.state = {
      heads: 0,
      tails: 0,
      history: [],
      isFlipping: false,
    };
    this.elements.coin.style.animation = "none";
    this.elements.resultLabel.classList.remove("visible");

    this.updateStats();
    this.renderTimeline();
  }
}
