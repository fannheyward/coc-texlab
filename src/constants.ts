export const Selectors = [
  {
    language: 'tex',
    scheme: 'file'
  },

  {
    language: 'latex',
    scheme: 'file'
  },

  {
    language: 'bibtex',
    scheme: 'file'
  },

  {
    language: 'tex',
    scheme: 'untitled'
  },

  {
    language: 'latex',
    scheme: 'untitled'
  },

  {
    language: 'bibtex',
    scheme: 'untitled'
  }
];

export namespace Commands {
  export const BUILD = 'latex.Build';

  export const BUILD_CANCEL = 'latex.BuildCancel';

  export const BUILD_TOGGLE = 'latex.BuildToggle';

  export const FORWARD_SEARCH = 'latex.ForwardSearch';

  export const UPDATE_LANGUAGE_SERVER = 'latex.UpdateLanguageServer';
}
