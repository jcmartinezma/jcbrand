// Style Dictionary v5 config.
// Light semantic colors share paths with the dark file (color.bg.primary, …).
// A parser nests that file under `theme-light` so the merge does not drop :root.
// The published CSS name is still the token's cssVar, not this internal path.
import { formatJcbrand, OUTPUTS } from './scripts/format-css.mjs';

const layers = ['core', 'semantic'];

function partials(ext) {
  return OUTPUTS.map((group) => ({
    destination: ext === 'css' ? `${group.layer}/${group.name}.css` : `${group.layer}/_${group.name}.scss`,
    format: 'jcbrand/css',
    filter: (token) => group.test(token.filePath),
    emitEmptyFiles: true,
    options: group.emptyNote ? { emptyNote: group.emptyNote } : {},
  }));
}

function forwardFile(destination, forwards) {
  return {
    destination,
    format: 'jcbrand/css',
    filter: () => false,
    emitEmptyFiles: true,
    options: { kind: 'forward', forwards },
  };
}

const platformOptions = {
  fileHeader: () => [
    'No edites este archivo a mano.',
    'Lo genera Style Dictionary (`npm run build:tokens`) desde tokens/.',
    'Cada nombre sale de $extensions["com.jcbrand"].cssVar.',
  ],
};

export default {
  source: ['tokens/core/*.json', 'tokens/semantic/*.json'],
  usesDtcg: true,
  expand: false,
  parsers: ['jcbrand/prepare'],
  hooks: {
    parsers: {
      'jcbrand/prepare': {
        pattern: /\.json$/,
        parser: ({ contents, filePath }) => {
          const json = JSON.parse(contents);
          delete json.$description;
          delete json.$extensions;
          if (String(filePath).replaceAll('\\', '/').endsWith('/semantic/color.light.json')) {
            return { 'theme-light': json };
          }
          return json;
        },
      },
    },
    transforms: {
      'name/jcbrand-path': {
        type: 'name',
        transform: (token) => token.path.join('-'),
      },
    },
    formats: {
      'jcbrand/css': formatJcbrand,
    },
  },
  platforms: {
    css: {
      expand: false,
      transforms: ['name/jcbrand-path'],
      buildPath: 'dist/css/',
      options: platformOptions,
      files: [
        ...partials('css'),
        {
          destination: 'tokens.css',
          format: 'jcbrand/css',
          options: { bundle: true },
        },
      ],
    },
    scss: {
      expand: false,
      transforms: ['name/jcbrand-path'],
      buildPath: 'dist/scss/',
      options: platformOptions,
      files: [
        ...partials('scss'),
        ...layers.map((layer) =>
          forwardFile(
            `${layer}/_index.scss`,
            OUTPUTS.filter((group) => group.layer === layer).map((group) => group.name),
          ),
        ),
        forwardFile('_index.scss', layers),
      ],
    },
  },
};
