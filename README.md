# Challenge Rock Paper Scissors

Angular application to play Rock Paper Scissors.

## Prerequisites

- Node.js 20.19.0 or higher
- npm 11 or higher

## Local setup and run

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run start
```

3. Open the app in your browser:

```text
http://localhost:4200/
```

## Production URL

The app is deployed at:

```text
https://nadiamonzon.github.io/challenge-rock-paper-scissors/
```

## Available scripts

- Start local development:

```bash
npm run start
```

- Build for production:

```bash
npm run build
```

- Run unit tests (Vitest):

```bash
npm run test
```

- Run unit tests with coverage:

```bash
npm run test:cov
```

- Run static analysis:

```bash
npm run lint
```

- Format HTML files with Prettier:

```bash
npm run format
```

- Check formatting without changing files:

```bash
npm run format:check
```

- Deploy with Angular CLI (ng deploy):

```bash
npm run deploy
```

## Deployment notes

The deployment script runs ng deploy. This project includes the angular-cli-ghpages dependency, so the typical deployment target is GitHub Pages if the deploy configuration is defined in angular.json.

Before your first deployment, verify that:

- The deploy configuration exists in angular.json.
- The remote repository and GitHub permissions are correctly configured.

## References

- Angular CLI: https://angular.dev/tools/cli
- Vitest: https://vitest.dev/
- Prettier: https://prettier.io/
