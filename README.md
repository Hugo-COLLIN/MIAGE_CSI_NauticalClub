## Prerequisites
- Node.js and NPM installed: 
  - https://nodejs.org/en/download/
  - https://radixweb.com/blog/installing-npm-and-nodejs-on-windows-and-mac

## Starting the project
1. Clone the repository
2. Run `npm install`
3. Create a `.env` file in the root of the project and add the following content:
```
DB_HOST=plg-broker.ad.univ-lorraine.fr
DB_PORT=5432
DB_NAME=NAME_OF_YOUR_DATABASE
DB_USER=YOUR_USERNAME
DB_PASSWORD=YOUR_PASSWORD
```
Replace `NAME_OF_YOUR_DATABASE`, `YOUR_USERNAME` and `YOUR_PASSWORD` with the appropriate values.

4. Run `npm run dev` to start the project
5. Open your browser and go to `http://localhost:4321`

## Astro Starter Kit: Basics

### 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
│   └── favicon.svg
├── src/
│   ├── layouts/
│   │   └── Layout.astro
│   └── pages/
│       └── index.astro
└── package.json
```

To learn more about the folder structure of an Astro project, refer to [our guide on project structure](https://docs.astro.build/en/basics/project-structure/).

### 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

### 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).
