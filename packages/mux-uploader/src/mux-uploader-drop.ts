const template = document.createElement('template');

template.innerHTML = `
<style>
  .dropzone {
    height: var(--dropzone-height, inherit);
    width: var(--dropzone-width, inherit);
  }

  .overlay {
    height: var(--overlay-height, inherit);
    width: var(--overlay-width, inherit);
  }

  :host([fullScreen]) .dropzone {
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    height: 100%;
    width: 100%;
    z-index: 1;
  }

  :host([fullScreen]) .overlay {
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    height: 100%;
    width: 100%;
    z-index: -1;
  }
 
  :host([active][fullScreen]) .overlay {
    z-index: 10;
    background-color: rgba(226, 253, 255, 0.95);

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  h1 {
    display: none;
  }

  :host([active]) h1 {
    display: block;
  }
</style>

<div class="overlay" id="overlay">
<h1 id="overlay-text"></h1>
</div>
<div class="dropzone" id="dropzone">
</div>
`;

class MuxUploaderDrop extends HTMLElement {
  overlay: HTMLElement | null | undefined;
  overlayText: HTMLElement | null | undefined;

  constructor() {
    super();
    const shadowRoot = this.attachShadow({ mode: 'open' });
    shadowRoot.appendChild(template.content.cloneNode(true));

    this.overlay = shadowRoot.getElementById('overlay');
    this.overlayText = shadowRoot.getElementById('overlay-text');
  }

  connectedCallback() {
    this.setupDragEvents();

    //@ts-ignore
    this.shadowRoot.getElementById('overlay-text').innerHTML = this.getAttribute('text');
  }

  static get observedAttributes() {
    return ['text', 'mux-uploader'];
  }

  get muxUploader() {
    const uploaderId = this.getAttribute('mux-uploader');
    return uploaderId ? document.getElementById(uploaderId) : null;
  }

  // attributeChangedCallback(attrName, oldValue, newValue) {
  //   if (attrName === 'mux-uploader') {

  //   }
  // }

  setupDragEvents() {
    this.addEventListener('dragenter', (evt) => {
      evt.preventDefault();
      evt.stopPropagation();
      this.setAttribute('active', '');
    });

    this.addEventListener('dragleave', (evt) => {
      this.removeAttribute('active');
    });

    this.addEventListener('dragover', (evt) => {
      evt.preventDefault();
      evt.stopPropagation();
    });

    this.addEventListener('drop', (evt) => {
      evt.preventDefault();
      evt.stopPropagation();
      const { dataTransfer } = evt;
      //@ts-ignore
      const { files } = dataTransfer;
      const file = files[0];

      const uploaderController = this.muxUploader ?? this;

      uploaderController.dispatchEvent(
        new CustomEvent('mux-drop', {
          composed: true,
          bubbles: true,
          detail: file,
        })
      );

      this.removeAttribute('active');
    });
  }
}

export default MuxUploaderDrop;
