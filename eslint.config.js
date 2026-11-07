export default [
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        browser: true,
        window: true,
        document: true,
        fetch: true,
        console: true,
        localStorage: true,
        sessionStorage: true,
        JSON: true,
        Promise: true,
        Array: true,
        Object: true,
        String: true,
        Number: true,
        Math: true,
        Date: true,
        setTimeout: true,
        clearTimeout: true,
        setInterval: true,
        clearInterval: true,
        addEventListener: true,
        removeEventListener: true,
        querySelector: true,
        querySelectorAll: true,
        getElementById: true,
        alert: true,
        confirm: true
      }
    },
    rules: {
      "no-unused-vars": "warn",
      "no-undef": "warn",
      "eqeqeq": "warn",
      "no-trailing-spaces": "warn",
      "semi": ["warn", "always"]
    }
  }
]
