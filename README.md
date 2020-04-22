# coc-texlab

> fork of [texlab-vscode](https://github.com/latex-lsp/texlab-vscode), provides editing support for LaTeX documents, powered by the [TexLab](https://github.com/latex-lsp/texlab) language server.

## Install

`:CocInstall coc-texlab`

## Requirements

- A [TeX distribution](https://www.latex-project.org/get/#tex-distributions). All distributions that are based on [TeX Live](https://www.tug.org/texlive/) or [MikTeX](https://miktex.org/) are supported.
- On Windows, you will need to install [Microsoft Visual C++ Redistributable for Visual Studio 2015](https://aka.ms/vs/16/release/vc_redist.x64.exe).

More info in [TexLab Docs](https://texlab.netlify.com/docs)

## Configuration

- `texlab.path`: custom path to `texlab` binary, defaults to `""`
- `latex.build.executable`: path to a LaTeX build tool, defaults to `latexmk`
- `latex.build.args`: additional arguments passed to build tool
- `latex.build.onSave`: build after saving a file, defaults to `false`
- `latex.forwardSearch.executable`: path to a PDF previewer that supports SyncTeX, defaults `null`
- `latex.forwardSearch.args`: additional arguments passed to the previewer, defaults `[]`
- `latex.lint.onSave`: lint after saving a file, defaults to `true`
- `latex.lint.onChange`: lint after changing a file, defaults to `false`

## Commands

- `latex.Build`: build current file
- `latex.BuildCancel`: cancel all running builds
- `latex.ForwardSearch`: performs a forward search from the current file
- `latex.UpdateLanguageServer`: upgrade TexLab Server to latest version

## License

MIT
