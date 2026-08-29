import type { CodegenConfig } from "@graphql-codegen/cli";

// Run via `pnpm codegen` — that script loads .env (this file runs in plain Node, so
// `astro:env` is unavailable here). Regenerate whenever the Hygraph schema changes.

const url = process.env.HYGRAPH_API_URL;
const token = process.env.HYGRAPH_TOKEN;

if (!url || !token) {
  throw new Error(
    "codegen: HYGRAPH_API_URL and HYGRAPH_TOKEN must be set. Run `pnpm codegen`, which loads .env.",
  );
}

const config: CodegenConfig = {
  schema: [{ [url]: { headers: { Authorization: `Bearer ${token}` } } }],
  // GraphQL operations live inline as gql`...` tagged templates in component mappers
  // (and page frontmatter for route-level queries).
  documents: ["src/components/**/mappers.ts", "src/pages/**/*.{astro,ts}"],
  generates: {
    // Only the operation result/variable types are needed — component RD types derive
    // from `[Name]Query`. `typescript-operations` alone is self-contained (emits its own
    // Scalars/Exact helpers + the enums the operations use), which sidesteps the
    // duplicate-identifier clash of pairing it with the `typescript` plugin.
    "src/gql/generated.ts": {
      plugins: ["typescript-operations"],
      config: {
        enumsAsTypes: true,
        useTypeImports: true,
        skipTypename: true,
        avoidOptionals: { field: true, inputValue: false },
        scalars: {
          Date: "string",
          DateTime: "string",
          Json: "unknown",
          Long: "number",
          Hex: "string",
          RGBAHue: "number",
          RGBATransparency: "number",
          RichTextAST: "unknown",
        },
      },
    },
  },
};

export default config;
