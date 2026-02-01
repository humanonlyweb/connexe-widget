# Connexe Widgets

Web components for displaying content and developer recommendations from the Connexe network.

This repository contains the source code for the widgets used on [connexe.dev](https://connexe.dev). The main platform backend and website source code can be found at: [humanonlyweb/connexe.dev](https://github.com/humanonlyweb/connexe.dev)

> [!NOTE]
> In the future, these repositories may be consolidated into a single monorepo.

## Features

- `<connexe-article>`: Displays article recommendations based on a topic.
- `<connexe-dev>`: Displays developer recommendations based on skills.

## Development

This project uses [Bun](https://bun.sh) and [Vite](https://vitejs.dev).

### 1. Install dependencies

```bash
bun install
```

### 2. Run local development

```bash
bun run dev
```

### 3. Build for production

```bash
bun run build
```

The output will be in the `dist/` directory.

## Deployment

Deployment is automated via GitHub Actions when pushing to the `main` branch. The widgets are built and then uploaded to a Cloudflare R2 bucket (`connexe-assets`).

### Required Secrets

To enable automated deployment, add the following secret to your GitHub repository (**Settings > Secrets and variables > Actions**):

| Secret | Description |
| :--- | :--- |
| `CLOUDFLARE_API_TOKEN` | Your Cloudflare API token with R2 storage write access. |

## License

MIT
