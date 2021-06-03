# coc-texlab

> fork of [texlab-vscode](https://github.com/latex-lsp/texlab-vscode), provides editing support for LaTeX documents, powered by the [TexLab](https://github.com/latex-lsp/texlab) language server.

## Install

`:CocInstall coc-texlab`

## Requirements

- A [TeX distribution](https://www.latex-project.org/get/#tex-distributions). All distributions that are based on [TeX Live](https://www.tug.org/texlive/) or [MikTeX](https://miktex.org/) are supported.
- On Windows, you will need to install [Microsoft Visual C++ Redistributable for Visual Studio 2015](https://aka.ms/vs/16/release/vc_redist.x64.exe).

More info in [TexLab Docs](https://texlab.netlify.com/docs)

## Configuration

- `texlab.path`: custom path to `texlab` binary, defaults `""`
- `texlab.rootDirectory`: Path to the root directory, defaults `null`
- `texlab.build.executable`: path to a LaTeX build tool, defaults `latexmk`
- `texlab.build.args`: additional arguments passed to build tool
- `texlab.build.onSave`: build after saving a file, defaults `false`
- `texlab.build.isContinuous`: Set this property to true if the build arguments imply a continuous build (like latexmk -pvc), defaults `false`
- `texlab.build.forwardSearchAfter`: Execute forward search after building, defaults `false`
- `texlab.auxDirectory`: directory containing the build artifacts, defaults `"."`
- `texlab.forwardSearch.executable`: path to a PDF previewer that supports SyncTeX, defaults `null`
- `texlab.forwardSearch.args`: additional arguments passed to the previewer, defaults `[]`
- `texlab.chktex.onOpenAndSave`: lint using chktex after opening and saving a file, defaults `false`
- `texlab.chktex.onEdit`: lint using chktex after changing a file, defaults `false`
- `texlab.bibtexFormatter`: BibTeX formatter to use, defaults `texlab`
- `texlab.formatterLineLength`: maximum amount of characters per line, defaults `80`
- `texlab.latexFormatter`: LaTeX formatter to use, defaults `latexindent`
- `texlab.latexindent.local`: Configures the `--local` flag of latexindent, defaults `null`
- `texlab.latexindent.modifyLineBreaks`: Configures the `--modifylinebreaks` flag of latexindent, defaults `false`

## Commands

- `latex.Build`: build current file
- `latex.ForwardSearch`: performs a forward search from the current file
- `latex.UpdateLanguageServer`: upgrade TexLab Server to latest version

## License

MIT
