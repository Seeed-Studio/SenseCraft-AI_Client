# SenseCraft AI web UI

This is **SenseCraft AI web UI** . It works in conjunction with [**SenseCraft-AI-Edge ↗**](https://github.com/Seeed-Studio/SenseCraft-AI-Edge.git). It provides the necessary API endpoints and handles the business logic for the frontend application.

## Getting Started

### Environment & Dependencies

- **Nodejs 16+**
- **Vite 3.x**
- **Typescript**
- **Vue3 + Pinia**
- **CSS framework : [Tailwindcss](https://tailwindcss.com/)**
- **UI Component Library**: [TDesign Web Vue UI](https://tdesign.tencent.com/vue/overview)

### Install Dependencies

```
pnpm install
```

### Development Mode

```
pnpm run dev
```

Open your browser and visit: [http://localhost:1430](http://localhost:1430)

### Building the App

```
pnpm run build 
```

By default, the build output will be placed at **dist**. You may deploy this dist folder to any of your preferred platforms.

### Preview App Locally
Once you've built the app, you may preview it locally by running `npm run preview` command.

```
$ pnpm run build
$ pnpm run preview
```

The `pnpm run preview` command will boot up a local static web server that serves the files from dist at http://localhost:4173. It's an easy way to check if the production build looks OK in your local environment.


The project follows a standard structure to organize its files and folders:

```
├── index.html
├── frame.html
├── src
│   ├── App.vue
│   ├── api
│   ├── assets
│   ├── components
│   ├── i18n
│   ├── layout
│   ├── main.ts
│   ├── router
│   ├── store
│   ├── types
│   ├── utils
│   ├── view
│   └── vite-env.d.ts
├── public
│   ├── icon_aimodel.svg
│   └── vite.svg
├── README.md
├── auto-imports.d.ts
├── components.d.ts
├── tailwind.config.js
├── tsconfig.json
├── tsconfig.node.json
├── package.json
├── pnpm-lock.yaml
├── postcss.config.js
└── vite.config.ts
```

The `public` directory contains the static assets and the main `index.html` file. The `src` directory is where the application's source code resides. It includes folders for assets, reusable components, views, store (Pinia store modules), and the main application entry point (`App.vue` and `main.js`).


## Demo Screenshots

Here are some screenshots showcasing the project's user interface:

- **Main page**

  ![Alt text](screenshots/index.png)

- **Full screen**

  ![Alt text](screenshots/fullscreen.png)

- **Streams list**

  ![Alt text](screenshots/stream-list.png)

- **Stream Config**

  ![Alt text](screenshots/config.png)

  | Argument         | Notes                                                                                  |
  | ---------------- | -------------------------------------------------------------------------------------- |
  | **Model**        | Model's Name, use which model for this stream.                                         |
  | **Video**        | Type Video Input Type [ VideoFile, IP-CAM, USB-CAM ].                                  |
  | **Video**        | Path Video Path, format decided by "Video Type", if wrong, default video will be used. |
  | **FPS**          | Frame per second.                                                                      |
  | **Quality**      | output stream quality.                                                                 |
  | **Max**          | Det maximum number of detections per image.                                            |
  | **Conf**         | object confidence threshold for detection.                                             |
  | **Track**        | Track=True, use Tracking .                                                             |
  | **Experimental** | and lower performance                                                                  |
  | **Half**         | use half precision (FP16). improve performance and lower precision                     |


- **Settings**

  ![Alt text](screenshots/settings.png)

- **About**

  ![Alt text](screenshots/about.png)

## License

This project is licensed under the [MIT License](LICENSE).
