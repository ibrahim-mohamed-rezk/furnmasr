// Flat config: ESLint 9+ no longer reads .eslintrc, and eslint-config-next 16
// ships its shareable configs as flat-config arrays.
//
// Pinned to ESLint 9 on purpose: ESLint 10 removed the legacy rule-context API
// that eslint-plugin-react (bundled by eslint-config-next 16) still calls, so
// linting crashes outright on 10.
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";

const config = [
  {
    ignores: [".next/**", "node_modules/**", "next-env.d.ts"],
  },
  ...nextCoreWebVitals,
  {
    rules: {
      // Both rules are new in the React-Compiler-era eslint-plugin-react-hooks
      // and fire on patterns inherited from the original codebase — 19 of them
      // are the standard `useEffect(() => setIsClient(true), [])` SSR guard.
      // They are real cleanup targets, but rewriting them touches hydration
      // behaviour, so they are warnings until that is done deliberately.
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/purity": "warn",
    },
  },
];

export default config;
