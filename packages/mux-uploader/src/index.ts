import * as UpChunk from '@mux/upchunk';
import MuxUploaderDropElement from './mux-uploader-drop';

const styles = `
:host {
  font-family: var(--uploader-font-family, Arial);
  font-size: var(--uploader-font-size, 16px);
  background-color: var(--uploader-background-color, inherit);
}

p {
  color: black;
}

input[type="file"] {
  display: none;
}

button {
  cursor: pointer;
  line-height: 16px;
  background: var(--button-background-color, #fff);
  border: 1px solid #000000;
  color: #000000;
  padding: 16px 24px;
  border-radius: var(--button-border-radius, 4px);
  -webkit-transition: all 0.2s ease;
  transition: all 0.2s ease;
  font-family: inherit;
  font-size: inherit;
}

button:hover {
  color: var(--button-hover-text, #fff);
  background: var(--button-hover-background, #404040);
}

button:active {
  color: var(--button-active-text, #fff);
  background: var(--button-active-background, #000000);
}

.bar-type {
  background: #e6e6e6;
  border-radius: 100px;
  position: relative;
  height: 4px;
  width: 100%;
}

.radial-type, .bar-type, .upload-status, .retry-message, .text-container {
  display: none;
}

::slotted(p) {
  display: none;
}

.upload-instruction {
  display: none;
}

.retry-message {
  color: #e22c3e;
  text-decoration-line: underline;
  cursor: pointer;
}

.text-container {
  flex-wrap: nowrap;
  justify-content: space-between;
  padding-bottom: 16px;
}

:host([draggable]) .upload-instruction{
  display: block;
}

:host([type="radial"][upload-in-progress]) .radial-type {
  display: block;
}

:host([type="bar"][upload-in-progress]) .bar-type {
  display: block;
}

:host([upload-in-progress]) .upload-status {
  display: block;
}

:host([upload-in-progress]) ::slotted(p) {
  display: block;
}

:host([type="bar"][upload-error]) .progress-bar {
  background: #e22c3e;
}

:host([type="bar"][upload-error]) .status-message {
  color: #e22c3e;
}

:host([type="radial"][upload-error]) .status-message {
  color: #e22c3e;
}

:host([upload-error]) .upload-status {
  display: none;
}

:host([upload-error]) .retry-message {
  display: inline-block;
}

:host([upload-error]) .text-container {
  display: flex;
}

:host([upload-error]) ::slotted(p) {
  display: none;
}

.upload-status {
  font-size: 42px;
  margin-bottom: 16px;
}

.progress-bar {
  box-shadow: 0 10px 40px -10px #fff;
  border-radius: 100px;
  background: var(--progress-bar-fill-color, #000000);
  height: 4px;
  width: 0%;
}

:host([upload-in-progress]) button {
  display: none;
}

:host([upload-in-progress]) ::slotted(button) {
  display: none;
}

:host([upload-in-progress]) .upload-instruction {
  display: none;
}

circle {
  stroke: var(--progress-radial-fill-color, black);
  stroke-width: 6;  /* Thickness of the circle */
  fill: transparent; /* Make inside of the circle see-through */

  /* Animation */ 
  transition: 0.35s;
  transform: rotate(-90deg);
  transform-origin: 50% 50%;
  -webkit-transform-origin: 50% 50%;
  -moz-transform-origin: 50% 50%;
}
`;

const template = document.createElement('template');

template.innerHTML = `
<style>
  ${styles}
</style>

<p class="upload-instruction" id="upload-instruction">Drop file to upload</p>

<div class=text-container>
  <span class="status-message" id="status-message"></span>
  <span class="retry-message" id="retry-message">Try again</span>
</div>

<input type="file" />
<slot name="custom-button"><button type="button">Upload video</button></slot>
<slot name="custom-progress"><p class="upload-status" id="upload-status"></p></slot>

<div class="bar-type">
  <div class="progress-bar" id="progress-bar"></div>
</div>
<div class="radial-type">
  <svg
    width="120"
    height="120">
    <!-- To prevent overflow of the SVG wrapper, radius must be  (svgWidth / 2) - (circleStrokeWidth * 2)
      or use overflow: visible on the svg.-->
    <circle
      r="52"
      cx="60"
      cy="60"
    />
  <svg>
</div>

<slot name="dropzone">
  <mux-uploader-drop></mux-uploader-drop>
</slot>
`;

const TYPES = {
  BAR: 'bar',
  RADIAL: 'radial',
};

class MuxUploaderElement extends HTMLElement {
  hiddenFileInput: HTMLInputElement | null | undefined;
  filePickerButton: HTMLButtonElement | null | undefined;
  svgCircle: SVGCircleElement | null | undefined;
  progressBar: HTMLElement | null | undefined;
  uploadPercentage: HTMLElement | null | undefined;
  statusMessage: HTMLElement | null | undefined;
  retryMessage: HTMLElement | null | undefined;
  _dropHandler: Function;

  constructor() {
    super();

    const shadow = this.attachShadow({ mode: 'open' });
    const uploaderHtml = template.content.cloneNode(true);
    shadow.appendChild(uploaderHtml);

    this.hiddenFileInput = this.shadowRoot?.querySelector('input[type="file"]');
    this.filePickerButton = this.shadowRoot?.querySelector('button');
    this.svgCircle = this.shadowRoot?.querySelector('circle');
    this.progressBar = this.shadowRoot?.getElementById('progress-bar');
    this.uploadPercentage = this.shadowRoot?.getElementById('upload-status');
    this.statusMessage = this.shadowRoot?.getElementById('status-message');
    this.retryMessage = this.shadowRoot?.getElementById('retry-message');

    this._dropHandler = this.handleUpload.bind(this);
  }

  connectedCallback() {
    this.setDefaultType();
    this.setupFilePickerButton();
    this.setupRetry();
    this.setupDropHandler();

    this.setAttribute('role', 'progressbar');
    this.setAttribute('aria-label', 'progress bar');
    this.setAttribute('aria-live', 'polite');
  }

  disconnectedCallback() {
    //@ts-ignore
    this.removeEventListener('mux-drop', this._dropHandler, false);
  }

  get radius() {
    return Number(this.svgCircle?.getAttribute('r'));
  }

  get circumference() {
    return this.radius * 2 * Math.PI;
  }

  setDefaultType() {
    const currentType = this.getAttribute('type');

    if (!currentType) {
      this.setAttribute('type', TYPES.BAR);
    }

    if (currentType === TYPES.RADIAL) {
      if (this.svgCircle) {
        // strokeDasharray is the size of dashes used to draw the circle with the size of gaps in between.
        // If the dash number is the same as the gap number, no gap is visible: a full circle.
        // strokeDashoffset defines where along our circle the dashes (in our case, a dash as long as the
        // circumference of our circle) begins. The larger the offset, the farther into the circle you're
        // starting the "dash". In the beginning, offset is the same as the circumference. Meaning, the visible
        // dash starts at the end so we don't see the full circle. Instead we see a gap the size of the circle.
        // When the percentage is 100%, offset is 0 meaning the dash starts at the beginning so we can see the circle. (TD).

        this.svgCircle.style.strokeDasharray = `${this.circumference} ${this.circumference}`;
        this.svgCircle.style.strokeDashoffset = `${this.circumference}`;
      }
    }
  }

  setupRetry() {
    this.retryMessage?.addEventListener('click', () => {
      this.removeAttribute('upload-error');
      this.removeAttribute('upload-in-progress');
      if (this.statusMessage) this.statusMessage.innerHTML = '';
      if (this.uploadPercentage) this.uploadPercentage.innerHTML = '';
    });
  }

  setupDropHandler() {
    //@ts-ignore
    this.addEventListener('mux-drop', this._dropHandler);
  }

  setupFilePickerButton() {
    this.shadowRoot?.querySelector('slot[name=custom-button]')?.addEventListener('slotchange', () => {
      this.filePickerButton = this.shadowRoot?.querySelector('slot[name=custom-button]');
    });

    this.filePickerButton?.addEventListener('click', () => {
      // TO-DO: Allows user to reattempt uploading the same file after an error.
      // Note: Apparently Chrome and Firefox do not allow changing an indexed property on FileList...(TD).
      // Source: https://stackoverflow.com/a/46689013

      this.hiddenFileInput?.click();
    });

    this.hiddenFileInput?.addEventListener('change', (evt) => {
      const file = this.hiddenFileInput?.files && this.hiddenFileInput?.files[0];

      if (file) {
        this.dispatchEvent(
          new CustomEvent('mux-drop', {
            composed: true,
            bubbles: true,
            detail: file,
          })
        );
      }
    });
  }

  setProgress(percent: number) {
    if (this.uploadPercentage) this.uploadPercentage.innerHTML = `${Math.floor(percent)}%`;
    this.setAttribute('aria-valuenow', `${Math.floor(percent)}`);
    this.setAttribute('aria-valuetext', `${Math.floor(percent)} percent`);

    switch (this.getAttribute('type')) {
      case TYPES.BAR: {
        if (this.progressBar) this.progressBar.style.width = `${percent}%`;
      }
      case TYPES.RADIAL: {
        if (this.svgCircle) {
          // The closer the upload percentage gets to 100%, the closer offset gets to 0.
          // The closer offset gets to 0, the more we can see the circumference of our circle. (TD).
          const offset = this.circumference - (percent / 100) * this.circumference;

          this.svgCircle.style.strokeDashoffset = offset.toString();
        }
      }
    }
  }

  handleUpload(evt: CustomEvent) {
    const url = this.getAttribute('url');

    if (!url) {
      if (this.statusMessage) this.statusMessage.innerHTML = 'No url attribute specified -- cannot handleUpload';
      throw Error('No url attribute specified -- cannot handleUpload');
    } else {
      if (this.statusMessage) this.statusMessage.innerHTML = '';
    }

    if (this.statusMessage) {
      this.removeAttribute('upload-error');
      this.statusMessage.innerHTML = '';
    }

    this.setAttribute('upload-in-progress', '');

    const upload = UpChunk.createUpload({
      endpoint: url,
      file: evt.detail,
    });

    upload.on('error', (err) => {
      this.setAttribute('upload-error', '');

      if (this.statusMessage && this.uploadPercentage) {
        this.statusMessage.innerHTML = 'An error has occurred';
      }
      throw Error(err.detail.message);
    });

    upload.on('progress', (progress) => {
      this.setProgress(progress.detail);
    });

    upload.on('success', () => {
      console.log('Upload complete!');
    });
  }
}

type MuxUploaderElementType = typeof MuxUploaderElement;
declare global {
  var MuxUploaderElement: MuxUploaderElementType;
}

/** @TODO Refactor once using `globalThis` polyfills */
if (!globalThis.customElements.get('mux-uploader')) {
  globalThis.customElements.define('mux-uploader', MuxUploaderElement);
  /** @TODO consider externalizing this (breaks standard modularity) */
  globalThis.MuxUploaderElement = MuxUploaderElement;
}

if (!globalThis.customElements.get('mux-uploader-drop')) {
  globalThis.customElements.define('mux-uploader-drop', MuxUploaderDropElement);
  //@ts-ignore
  globalThis.MuxUploaderDropElement = MuxUploaderDropElement;
}

export default MuxUploaderElement;
