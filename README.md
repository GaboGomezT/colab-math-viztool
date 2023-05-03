# Colabborative Math Vizulation Tool

This is a collaborative whiteboard with integrated 3D tools that make it easier for math teachers to demonstrate
abstract vector operations and other mathematical topics.

We use the following technologies:

- Frontend: React, vanilla CSS
- Backend: NodeJS
- Realtime: Socket.io
- DB: Prisma, MongoDB, PostgreSQL

# Requirements

node >= 19.7.0

npm >= 9.5.0

# Setup Steps

1. `cd` into backend directory
2. create a `.env` file and paste values provided by developer
3. run the following commands

```sh
$ npm i
$ npx prisma generate
$ npm run dev
```

4. `cd` into the frontend directory
5. create a `.env` file and paste values provided by developer (this a separate file from step 2)
6. run the following commands

```sh
$ npm i
$ npm run dev
```

7. Install the Prettier VSCode extension (https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) and set it as the default formatter for javascript

8. Configure the following options in VSCode settings

- Prettier: Use Tabs
- Editor: Format On Save
