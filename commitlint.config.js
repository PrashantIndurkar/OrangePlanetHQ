// commitlint.config.js
export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "header-max-length": [1, "always", 150],
    "subject-case": [
      2,
      "never",
      ["sentence-case", "start-case", "pascal-case", "upper-case"],
    ],
  },
};
