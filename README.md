
# [Ω Breakchain Frontend](https://www.breakchain-protocol.money/)

This is the front-end repo for Breakchain that allows users be part of the future of finance.

We are moving at web3 speed and we are looking for talented contributors to boost this rocket. Take a look at our [CONTRIBUTING GUIDE](CONTRIBUTING.md) if you are considering joining a world class DAO.

## 🔧 Setting up Local Development

Required:

- [Node v14](https://nodejs.org/download/release/latest-v14.x/)
- [Yarn](https://classic.yarnpkg.com/en/docs/install/)
- [Git](https://git-scm.com/downloads)

```bash
$ git clone https://github.com/breakchain/breakchain-protocol-frontend.git
$ cd breakchain-protocol-frontend

# set up your environment variables
# read the comments in the .env files for what is required/optional
$ cp .env.example .env

# fill in your own values in .env, then =>
$ yarn
$ yarn start
```

The site is now running at `http://localhost:3000`!
Open the source code and start editing!

If you would like to run the frontend in a Docker image (e.g. to isolate dependencies and the nodejs version), run `yarn docker-start`.

## Rinkeby Testing

**Rinkeby faucet for sXCHAIN:**
[Lives here](https://rinkeby.etherscan.io/address/0x800B3d87b77361F0D1d903246cA1F51b5acb43c9#writeContract), to retrieve test sXCHAIN click `Connect to Web3` and use function #3: `dripsXCHAIN`. After connecting to web3, click `Write` to execute and 10 sXCHAIN will automatically be transferred to your connected wallet.

Note: The faucet is limited to one transfer per wallet every 6500 blocks (~1 day)

**Rinkeby faucet for WETH:**
[Wrap rinkeby eth on rinkeby uniswap](https://app.uniswap.org/#/swap)

**Rinkeby faucets for LUSD, FRAX & DAI can be taken from rinkeby etherscan:**

1. Go to `src/helpers/AllBonds.ts`
2. then copy the rinkeby `reserveAddress` for the applicable bond & navigate to that contract on rinkeby etherscan.
3. On Rinkeby etherscan use the `mint` function. You can use the number helper for 10^18 & then add four more zeros for 10,000 units of whichever reserve you are minting.

## Avax Fuji Testnet

1. [avax faucet](https://faucet.avax-test.network/)
2. [explorer](https://explorer.avax-test.network/)

## Architecture/Layout

The app is written in [React](https://reactjs.org/) using [Redux](https://redux.js.org/) as the state container.

The files/folder structure are a **WIP** and may contain some unused files. The project is rapidly evolving so please update this section if you see it is inaccurate!

```
./src/
├── App.jsx       // Main app page
├── abi/          // Contract ABIs from etherscan.io
├── actions/      // Redux actions
├── assets/       // Static assets (SVGs)
├── components/   // Reusable individual components
├── constants.js/ // Mainnet Addresses & common ABI
├── contracts/    // TODO: The contracts be here as submodules
├── helpers/      // Helper methods to use in the app
├── hooks/        // Shared reactHooks
├── themes/       // Style sheets for dark vs light theme
└── views/        // Individual Views
```

## Theme Support

Themes are available, but it can be difficult to access the theme's colors.

Material UI components, such as `Button`, can use the current theme's color scheme through the `color` property. For example:

```JSX
 <Button variant="contained" color="primary" className="cause-give-button">
  Give Yield
 </Button>
```

If you wish to use a theme's color scheme manually, follow these steps:

1. Import `useTheme`: `import { useTheme } from "@material-ui/core/styles";`
1. Instantiate the theme: `const theme = useTheme();`
1. Add a style property to the component, for example:

```JSX
 <Grid item className="cause-category" style={{ backgroundColor: theme.palette.background.default }}>
 {category}
 </Grid>
```

For the available theme properties, take a look at the themes in `src/themes`.

## Application translation

Breakchain uses [linguijs](https://github.com/lingui/js-lingui) to manage translation.


In order to mark text for translation you can use:

- The <Trans> component in jsx templates eg. `<Trans>Translate me!</Trans>`
- The t function in javascript code and jsx templates. `` t`Translate me` ``
  You can also add comments for the translators. eg.

```
t({
 id: "BOND",
 comment: "The action of bonding (verb)",
})
```


## 🚀 Deployment


### Continuous deployment


**Pull Requests**:
Each PR into master will get its own custom URL that is visible on the PR page. QA & validate changes on that URL before merging into the deploy branch.

### Feature Flags

- Give: by default it is enabled. It can be disabled by setting the `REACT_APP_GIVE_ENABLED` environment variable to "false".

## 👏🏽 Contributing Guidelines

First, take a look at our [CONTRIBUTING GUIDE](CONTRIBUTING.md) .


_**NOTE**_: For big changes associated with feature releases/milestones, they will be merged onto the `develop` branch for more thorough QA before a final merge to `master`

**Defenders of the code**:

