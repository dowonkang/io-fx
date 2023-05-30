(function () {
  const template = document.createElement("template");
  template.innerHTML = `<style>
    :host {
      display: block;
    }

    .io-fx-target {
      transition-property: opacity, transform;
      transition-duration: var(--io-fx-opacity-duration, var(--io-fx-duration, 0.5s)),
        var(--io-fx-transform-duration, var(--io-fx-duration, 0.5s));
      transition-delay: var(--io-fx-opacity-delay, var(--io-fx-delay, 0s)),
        var(--io-fx-transform-delay, var(--io-fx-delay, 0s));
      transition-timing-function: var(--io-fx-opacity-easing, var(--io-fx-easing, linear)),
        var(--io-fx-transform-easing, var(--io-fx-easing, ease-in-out));

      opacity: var(--io-fx-opacity-from);
      transform: var(
        --io-fx-transform-from,
        var(
          --io-fx-translate-from,
          translate3d(
            var(--io-fx-translate-x-from, 0),
            var(--io-fx-translate-y-from, 0),
            var(--io-fx-translate-z-from, 0)
          )
        )
        scale(
          var(--io-fx-scale-x-from, var(--io-fx-scale-from, 1)),
          var(--io-fx-scale-y-from, var(--io-fx-scale-from, 1))
        )
        rotate(var(--io-fx-rotate-from, 0))
        skew(
          var(--io-fx-skew-x-from, var(--io-fx-skew-from, 0)),
          var(--io-fx-skew-y-from, var(--io-fx-skew-from, 0))
        )
      );
    }

    :host([active]) .io-fx-target {
      opacity: var(--io-fx-opacity-to);
      transform: var(
        --io-fx-transform-to,
        var(
          --io-fx-translate-to,
          translate3d(
            var(--io-fx-translate-x-to, 0),
            var(--io-fx-translate-y-to, 0),
            var(--io-fx-translate-z-to, 0)
          )
        )
        scale(
          var(--io-fx-scale-x-to, var(--io-fx-scale-to, 1)),
          var(--io-fx-scale-y-to, var(--io-fx-scale-to, 1))
        )
        rotate(var(--io-fx-rotate-to, 0))
        skew(
          var(--io-fx-skew-x-to, var(--io-fx-skew-to, 0)),
          var(--io-fx-skew-y-to, var(--io-fx-skew-to, 0))
        )
      );
    }

    :host([filter]) .io-fx-target {
      transition-property: opacity, transform, filter;
      transition-duration: var(--io-fx-opacity-duration, var(--io-fx-duration, 0.5s)),
        var(--io-fx-transform-duration, var(--io-fx-duration, 0.5s)),
        var(--io-fx-filter-duration, var(--io-fx-duration, 0.5s));
      transition-delay: var(--io-fx-opacity-delay, var(--io-fx-delay, 0s)),
        var(--io-fx-transform-delay, var(--io-fx-delay, 0s)),
        var(--io-fx-filter-delay, var(--io-fx-delay, 0s));
      transition-timing-function: var(--io-fx-opacity-easing, var(--io-fx-easing, linear)),
        var(--io-fx-transform-easing, var(--io-fx-easing, ease-in-out)),
        var(--io-fx-filter-easing, var(--io-fx-easing, ease-in-out));
      filter: var(--io-fx-filter-from);
    }

    :host([filter][active]) .io-fx-target {
      filter: var(--io-fx-filter-to);
    }

    :host([name^="fade-"]) {
      --io-fx-opacity-from: 0;
      --io-fx-opacity-to: 1;
    }

    :host([name="fade-out"]) {
      --io-fx-opacity-from: 1;
      --io-fx-opacity-to: 0;
    }

    :host([name$="-up"]) {
      --io-fx-translate-y-from: 100px;
    }

    :host([name$="-down"]) {
      --io-fx-translate-y-from: -100px;
    }

    :host([name$="-left"]) {
      --io-fx-translate-x-from: 100%;
    }

    :host([name$="-up-left"]) {
      --io-fx-translate-y-from: 100px;
    }

    :host([name$="-down-left"]) {
      --io-fx-translate-y-from: -100px;
    }

    :host([name$="-right"]) {
      --io-fx-translate-x-from: -100%;
    }

    :host([name$="-up-right"]) {
      --io-fx-translate-y-from: 100px;
    }

    :host([name$="-down-right"]) {
      --io-fx-translate-y-from: -100px;
    }

    :host([name^="zoom-in"]) {
      --io-fx-scale-from: 0.8;
      --io-fx-scale-to: 1;
    }

    :host([name^="zoom-out"]) {
      --io-fx-scale-from: 1.2;
      --io-fx-scale-to: 1;
    }

    :host([filter="blur-in"]) {
      --io-fx-filter-from: blur(10px);
      --io-fx-filter-to: blur(0);
    }

    :host([filter="blur-out"]) {
      --io-fx-filter-from: blur(0);
      --io-fx-filter-to: blur(10px);
    }
  </style>
  <div class="io-fx-target"><slot></slot></div>`;

  class IoFxElement extends HTMLElement {
    constructor() {
      super();

      /** @type {IntersectionObserver | null} */
      this.observer = null;

      const shadowRoot = this.attachShadow({ mode: "open" });
      shadowRoot.appendChild(template.content.cloneNode(true));
    }

    get name() {
      return this.getAttribute("name");
    }

    get active() {
      return this.hasAttribute("active");
    }

    set active(flag) {
      if (flag) {
        this.setAttribute("active", "");
      } else {
        this.removeAttribute("active");
      }
    }

    get once() {
      return this.hasAttribute("once");
    }

    get root() {
      if (this.observer) {
        return this.observer.root;
      }

      const attrValue = this.getAttribute("root");
      return attrValue ? document.querySelector(attrValue) : null;
    }

    get rootMargin() {
      if (this.observer) {
        return this.observer.rootMargin;
      }

      const attrValue = this.getAttribute("root-margin");
      return attrValue || "0px 0px 0px 0px";
    }

    get thresholds() {
      if (this.observer) {
        return this.observer.thresholds;
      }

      const attrValue = this.getAttribute("thresholds");
      /** @type {number | number[]} */
      let thresholds = 0.75;

      if (attrValue) {
        try {
          const parsed = JSON.parse(attrValue);

          if (typeof parsed === "number" || Array.isArray(parsed)) {
            thresholds = parsed;
          } else {
            throw new Error("Invalid threshold value");
          }
        } catch (e) {}
      }

      return Array.isArray(thresholds) ? thresholds : [thresholds];
    }

    get options() {
      if (this.observer) {
        const { root, rootMargin, thresholds: threshold } = this.observer;
        return { root, rootMargin, threshold };
      }

      const { root, rootMargin, thresholds: threshold } = this;

      return {
        root,
        rootMargin,
        threshold,
      };
    }

    connectedCallback() {
      [
        "duration",
        "opacity-duration",
        "transform-duration",
        "delay",
        "opacity-delay",
        "transform-delay",
        "easing",
        "opacity-easing",
        "transform-easing",
      ].forEach((attr) => {
        const attrValue = this.getAttribute(attr);

        if (attrValue) {
          this.style.setProperty(`--io-fx-${attr}`, attrValue);
        }
      });

      if (!this.observer) {
        const { options } = this;
        const observerKey = JSON.stringify(options);

        if (!IoFxElement.observers.has(observerKey)) {
          const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
              const target = entry.target;

              if (entry.isIntersecting) {
                target.active = true;

                if (target.once) {
                  observer.unobserve(target);
                }
              } else {
                target.active = false;
              }
            });
          }, options);

          IoFxElement.observers.set(observerKey, observer);
        }

        this.observer = IoFxElement.observers.get(observerKey);
      }

      this.observer.observe(this);
    }

    disconnectedCallback() {
      this.observer.unobserve(this);
    }
  }

  /** @type {Map<string, IntersectionObserver>} */
  IoFxElement.observers = new Map();

  if (!window.IoFxElement) {
    window.IoFxElement = IoFxElement;
  }

  if (!window.customElements.get("io-fx")) {
    customElements.define("io-fx", IoFxElement);
  }
})();
