const LitElement = Object.getPrototypeOf(
  customElements.get("ha-panel-lovelace")
);
const html = LitElement.prototype.html;

class FireTVCardServices extends LitElement {
  static get properties() {
    return {
      hass: {},
      _config: {},
      _apps: {}
    };
  }

  //static async getConfigElement() {
  //  await import("./firetv-card-editor.js");
  //  return document.createElement("firetv-card-editor");
  //}

  static getStubConfig() {
    return {};
  }

  getCardSize() {
    return 7;
  }

  setConfig(config) {
    if (!config.entity) {
      console.log("Invalid configuration");
      return;
    }

    this._config = { theme: "default", ...config };
  }

  render() {
    if (!this._config || !this.hass) {
      return html``;
    }

    const stateObj = this.hass.states[this._config.entity];
    return html`
      ${this.renderStyle()}
      <ha-card .header="${this._config.name}">

          ${
            this._config.tv ||
            this._config.invisible ||
            this._config.power
              ? html`
                  <div class="row">
                    <ha-icon-button
                      .action="${"power"}"
                      @click="${this.handleActionClick}"
                      icon="mdi:power"
                      title="Power"
                    ></ha-icon-button>
                    <ha-icon-button
                      .action="${"invisible"}"
                      @click="${this.handleActionClick}"
                      icon=""
                      title=""
                    ></ha-icon-button>
                    <ha-icon-button
                      .action="${"power"}"
                      @click="${this.handleActionClick}"
                      icon="mdi:power"
                      title="Power"
                    ></ha-icon-button>
                  </div>
                `
              : ""
          }


          </div>

          <div class="row">
            <ha-icon-button
              .action="${"up"}"
              @click="${this.handleActionClick}"
              icon="mdi:chevron-up"
              title="Up"
            ></ha-icon-button>
          </div>

          <div class="row">
            <ha-icon-button
              .action="${"left"}"
              @click="${this.handleActionClick}"
              icon="mdi:chevron-left"
              title="Left"
            ></ha-icon-button>
            <ha-icon-button
              .action="${"select"}"
              @click="${this.handleActionClick}"
              icon="mdi:checkbox-blank-circle"
              title="Select"
            ></ha-icon-button>
            <ha-icon-button
              .action="${"right"}"
              @click="${this.handleActionClick}"
              icon="mdi:chevron-right"
              title="Right"
            ></ha-icon-button>
          </div>

          <div class="row">
            <ha-icon-button
              .action="${"down"}"
              @click="${this.handleActionClick}"
              icon="mdi:chevron-down"
              title="Down"
            ></ha-icon-button>
          </div>

          </div>
          <div class="row">
            <ha-icon-button
              .action="${"back"}"
              @click="${this.handleActionClick}"
              icon="mdi:arrow-left"
              title="Back"
            ></ha-icon-button>
            <ha-icon-button
              .action="${"home"}"
              @click="${this.handleActionClick}"
              icon="mdi:home"
              title="Home"
            ></ha-icon-button>
            <ha-icon-button
              .action="${"menu"}"
              @click="${this.handleActionClick}"
              icon="mdi:menu"
              title="Menu"
            ></ha-icon-button>

          </div>

          <div class="row">
            <ha-icon-button
              .action="${"reverse"}"
              @click="${this.handleActionClick}"
              icon="mdi:rewind"
              title="Rewind"
            ></ha-icon-button>
            <ha-icon-button
              .action="${"pauseplay"}"
              @click="${this.handleActionClick}"
              icon="mdi:play-pause"
              title="Play/Pause"
            ></ha-icon-button>
            <ha-icon-button
              .action="${"forward"}"
              @click="${this.handleActionClick}"
              icon="mdi:fast-forward"
              title="Fast-Forward"
            ></ha-icon-button>

          </div>

          ${
            this._config.tv ||
            this._config.volume_up ||
            this._config.volume_down ||
            this._config.volume_mute
              ? html`
                  <div class="row">
                    <ha-icon-button
                      .action="${"volume_mute"}"
                      @click="${this.handleActionClick}"
                      icon="mdi:volume-mute"
                      title="Volume Mute"
                    ></ha-icon-button>
                    <ha-icon-button
                      .action="${"volume_down"}"
                      @click="${this.handleActionClick}"
                      icon="mdi:volume-minus"
                      title="Volume Down"
                    ></ha-icon-button>
                    <ha-icon-button
                      .action="${"volume_up"}"
                      @click="${this.handleActionClick}"
                      icon="mdi:volume-plus"
                      title="Volume Up"
                    ></ha-icon-button>
                  </div>
                `
              : ""
          }
        </div>
      </ha-card>
    `;
  }

  updated(changedProps) {
    if (!this._config) {
      return;
    }

    const oldHass = changedProps.get("hass");
    if (!oldHass || oldHass.themes !== this.hass.themes) {
      this.applyThemesOnElement(this, this.hass.themes, this._config.theme);
    }
  }

  renderStyle() {
    return html`
      <style>
        .remote {
          padding: 16px 0px 16px 0px;
        }
        img,
        ha-icon-button {
          width: 64px;
          height: 64px;
          cursor: pointer;
          --mdc-icon-size: 100%;
        }
        .row {
          display: flex;
          padding: 8px 36px 8px 36px;
          justify-content: space-evenly;
        }
        .diagonal {
          background-color: var(--light-primary-color);
        }
      </style>
    `;
  }

  launchApp(e) {
    this.hass.callService("media_player", "select_source", {
      entity_id: this._config.entity,
      source: e.currentTarget.value
    });
  }

  handleActionClick(e) {
    const custom_services = [
      "back",
      "home",
      "menu",
      "up",
      "left",
      "select",
      "right",
      "down",
      "reverse",
      "pauseplay",
      "forward"
    ];

    if (
      custom_services.indexOf(e.currentTarget.action) >= 0 &&
      this._config[e.currentTarget.action]
    ) {
      const [domain, service] = this._config[
        e.currentTarget.action
      ].service.split(".", 2);
      this.hass.callService(
        domain,
        service,
        this._config[e.currentTarget.action].service_data
          ? this._config[e.currentTarget.action].service_data
          : null
      );
    } else {
      const [domain, service] = this._config[
          e.currentTarget.action
        ].service.split(".", 2);
        this.hass.callService(
          domain,
          service,
          this._config[e.currentTarget.action].service_data
            ? this._config[e.currentTarget.action].service_data
            : null
        );
    }
  }

  applyThemesOnElement(element, themes, localTheme) {
    if (!element._themes) {
      element._themes = {};
    }
    let themeName = themes.default_theme;
    if (localTheme === "default" || (localTheme && themes.themes[localTheme])) {
      themeName = localTheme;
    }
    const styles = Object.assign({}, element._themes);
    if (themeName !== "default") {
      var theme = themes.themes[themeName];
      Object.keys(theme).forEach(key => {
        var prefixedKey = "--" + key;
        element._themes[prefixedKey] = "";
        styles[prefixedKey] = theme[key];
      });
    }
    if (element.updateStyles) {
      element.updateStyles(styles);
    } else if (window.ShadyCSS) {
      // implement updateStyles() method of Polemer elements
      window.ShadyCSS.styleSubtree(
        /** @type {!HTMLElement} */ (element),
        styles
      );
    }

    const meta = document.querySelector("meta[name=theme-color]");
    if (meta) {
      if (!meta.hasAttribute("default-content")) {
        meta.setAttribute("default-content", meta.getAttribute("content"));
      }
      const themeColor =
        styles["--primary-color"] || meta.getAttribute("default-content");
      meta.setAttribute("content", themeColor);
    }
  }
}


customElements.define("firetv-card", FireTVCardServices);
