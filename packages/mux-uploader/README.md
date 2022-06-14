<p align="center">
  <h1 align="center">&lt;mux-uploader/&gt;</h1>
  <a href="https://npmcharts.com/compare/@mux-elements/mux-uploader?interval=30"><img src="https://img.shields.io/npm/dm/@mux-elements/mux-uploader.svg?sanitize=true" alt="Downloads"></a>
    <a href="https://www.npmjs.com/package/@mux-elements/mux-uploader"><img src="https://img.shields.io/npm/v/@mux-elements/mux-uploader.svg?sanitize=true" alt="Version"></a>
    <a href="https://www.npmjs.com/package/@mux-elements/mux-uploader"><img src="https://img.shields.io/npm/l/@mux-elements/mux-uploader.svg?sanitize=true" alt="License"></a>
</p>

# Introduction

`<mux-uploader></mux-uploader>` is web component for uploading files to Mux.

`mux-uploader-drop` is an optional supporting web component for drop-in drag and drop and overlay. You can always configure your own drag and drop with `mux-uploader`.

If you are looking for a direct upload interface and a progress bar, you're in the right place.

# Installation

If you're using `npm` or `yarn`, install that way:

## Package manager

```
yarn add @mux-elements/mux-uploader
```

or

```
npm i @mux-elements/mux-uploader
```

Then, import the library into your application with either `import` or `require`:

```js
import '@mux-elements/mux-uploader';
```

or

```js
require('@mux-elements/mux-uploader');
```

## CDN option

Alternatively, use the CDN hosted version of this package:

```html
<script src="https://unpkg.com/@mux-elements/mux-uploader@0.1.0-beta.0"></script>
```

If you are using ECMAScript modules, you can also load the `mux-uploader.mjs` file with `type=module`:

```html
<script type="module" src="https://unpkg.com/@mux-elements/mux-uploader@0.1.0-beta.0/dist/mux-uploader.mjs"></script>
```

## Usage

```html
<body>
  <p></p>

  <mux-player
    playback-id="DS00Spx1CV902MCtPj5WknGlR102V5HFkDe"
    metadata-video-title="Big Buck Bunny"
    metadata-viewer-user-id="user-id-1234"
    stream-type="on-demand"
    controls
  ></mux-player>
</body>
```

### Attributes

#### `mux-uploader`

| Attribute            | Type      | Description                                                                                                                                                                                                               | Default     |
| -------------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| `url`                | `string`  | The authenticated URL that your file will be uploaded to. Check out the [direct uploads docs](https://docs.mux.com/guides/video/upload-files-directly#1-create-an-authenticated-mux-url) for how to create one. Required. | `undefined` |
| `id`                 | `string`  | An ID that allows `mux-uploader-drop` to locate `mux-uploader`. Required.                                                                                                                                                 | N/A         |
| `type`               | `"bar"`   | Specifies the visual type of progress bar. A radial type is in-progress.                                                                                                                                                  | "bar"       |
| `upload-in-progress` | `boolean` | The thumbnail token for signing the `poster` URL.                                                                                                                                                                         | false       |
| `upload-error`       | `boolean` | The storyboard token for signing the storyboard URL.                                                                                                                                                                      | false       |
| `status`             | `boolean` | This is an arbitrary title for your video that will be passed in as metadata into Mux Data. Adding a title will give you useful context in your Mux Data dashboard. (optional, but encouraged)                            | false       |

#### `mux-uploader-drop`

| Attribute       | Type       | Description                                            | Default |
| --------------- | ---------- | ------------------------------------------------------ | ------- |
| `fullscreen`    | `boolean`  | Toggles fullscreen drag and drop (work-in-progress).   | false   |
| `overlay`       | `boolean`  | Toggles fullscreen overlay on dragover.                | false   |
| `disable-drop ` | `booleann` | Toggles off drag and drop which is enabled by default. | false   |

### Methods

| Method           | Description                 |
| ---------------- | --------------------------- |
| `handleUpload()` | Begins upload of the media. |

### Styling

`mus-uploader` can be styled with CSS variables.

#### Elements

- `<mux-uploader/>`

| Name                           | CSS Property       | Default Value | Description                                             | Notes                                                                                             |
| ------------------------------ | ------------------ | ------------- | ------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `--uploader-font-family`       | `font-family`      | `Arial`       | font family of the component                            | Applies to other elements as well: upload status and error status                                 |
| `--uploader-font-size`         | `font-size`        | `16px`        | font size for text within the component                 | Also applies to `<mux-uploader-drop>` i.e. overlay text                                           |
| `--uploader-background-color`  | `background-color` | `inherit`     | background color of area surrounding the upload         |                                                                                                   |
| `--button-background-color`    | `background`       | `#fff`        | background color of upload button                       |                                                                                                   |
| `--button-border-radius`       | `border-radius`    | `4px`         | border ardius of the upload button                      |                                                                                                   |
| `--button-hover-text`          | `color`            | `#fff`        | text color of upload button on button hover             |                                                                                                   |
| `--button-hover-background`    | `background`       | `#404040`     | background color of upload button on button hover       |                                                                                                   |
| `--button-active-text`         | `color`            | `#fff`        | color of upload button text when button is active       |                                                                                                   |
| `--button-active-background`   | `background`       | `#000000`     | background color of upload button when button is active | Applied via `:active` [pseudo selector](https://developer.mozilla.org/en-US/docs/Web/CSS/:active) |
| `--progress-bar-fill-color`    | `background`       | `#000000`     | background color for progress bar div                   |                                                                                                   |
| `--progress-radial-fill-color` | `stroke`           | `black`       | stroke color for circle SVG (wip)                       |                                                                                                   |

- `<mux-uploader-drop/>`

| Name                         | CSS Property       | Default Value               | Description                         | Notes                                                  |
| ---------------------------- | ------------------ | --------------------------- | ----------------------------------- | ------------------------------------------------------ |
| `--overlay-background-color` | `background-color` | `rgba(226, 253, 255, 0.95)` | background color of the overlay div | Visible only when component has `fullscreen` attribute |
