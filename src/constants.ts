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
    language: 'plaintex',
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
  },

  {
    language: 'plaintex',
    scheme: 'untitled'
  }
];

export namespace Commands {
  export const BUILD = 'latex.Build';

  export const FORWARD_SEARCH = 'latex.ForwardSearch';

  export const UPDATE_LANGUAGE_SERVER = 'latex.UpdateLanguageServer';
}
