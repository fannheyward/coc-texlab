# coc-texlab

> fork of [texlab-vscode](https://github.com/latex-lsp/texlab-vscode), provides editing support for LaTeX documents, powered by the [TexLab](https://github.com/latex-lsp/texlab) language server.

## Install

`:CocInstall coc-texlab`

## Requirements

- A [TeX distribution](https://www.latex-project.org/get/#tex-distributions). All distributions that are based on [TeX Live](https://www.tug.org/texlive/) or [MikTeX](https://miktex.org/) are supported.
- On Windows, you will need to install [Microsoft Visual C++ Redistributable for Visual Studio 2015](https://aka.ms/vs/16/release/vc_redist.x64.exe).

More info in [TexLab Wiki](https://github.com/latex-lsp/texlab/wiki)

## Configuration

The full reference of the server options lives in [TexLab / Configuration](https://github.com/latex-lsp/texlab/wiki/Configuration).

### General

- `texlab.path`: custom path to `texlab` binary, defaults `""`
- `texlab.trace.server`: trace the communication between client and language server (`off`, `messages`, `verbose`), defaults `"off"`
- `texlab.rootDirectory`: path to the root directory, defaults `null`

### Build

- `texlab.build.executable`: path to a LaTeX build tool, defaults `"latexmk"`
- `texlab.build.args`: additional arguments passed to the build tool, `%f` is replaced by the TeX file, defaults `["-pdf", "-interaction=nonstopmode", "-synctex=1", "%f"]`
- `texlab.build.onSave`: build after saving a file, defaults `false`
- `texlab.build.forwardSearchAfter`: execute forward search after building, defaults `false`
- `texlab.build.useFileList`: use the `.fls` files produced by the TeX engine for project detection, defaults `false`
- `texlab.build.auxDirectory`: directory containing the `.aux` files, when not using `latexmk`, defaults `"."`
- `texlab.build.logDirectory`: directory containing the build log files, when not using `latexmk`, defaults `"."`
- `texlab.build.pdfDirectory`: directory containing the output files, when not using `latexmk`, defaults `"."`
- `texlab.build.filename`: override the file name of the build artifact, used by forward search, defaults `null`
- `texlab.auxDirectory`: (deprecated) directory containing the build artifacts, defaults `"."`

### Forward search

- `texlab.forwardSearch.executable`: path to a PDF previewer that supports SyncTeX, defaults `null`
- `texlab.forwardSearch.args`: additional arguments passed to the previewer, `%f`, `%p`, `%l` are replaced by the server, defaults `[]`

### Linting & diagnostics

- `texlab.chktex.onOpenAndSave`: lint using chktex after opening and saving a file, defaults `false`
- `texlab.chktex.onEdit`: lint using chktex after changing a file, defaults `false`
- `texlab.chktex.additionalArgs`: additional command line arguments passed to chktex, defaults `[]`
- `texlab.diagnosticsDelay`: delay in milliseconds before reporting diagnostics, defaults `300`
- `texlab.diagnostics.allowedPatterns`: only report diagnostics matching at least one of these regular expressions, defaults `[]`
- `texlab.diagnostics.ignoredPatterns`: never report diagnostics matching any of these regular expressions, defaults `[]`

### Symbols

- `texlab.symbols.allowedPatterns`: only send document symbols matching at least one of these regular expressions, defaults `[]`
- `texlab.symbols.ignoredPatterns`: never send document symbols matching any of these regular expressions, defaults `[]`
- `texlab.symbols.customEnvironments`: extend the environments reported as document symbols, each entry is `{ name, displayName?, label? }`, defaults `[]`

### Formatting

- `texlab.formatterLineLength`: maximum amount of characters per line when formatting BibTeX files (`0` = disable), defaults `80`
- `texlab.bibtexFormatter`: BibTeX formatter to use (`texlab`, `latexindent`, `none`), defaults `"texlab"`
- `texlab.latexFormatter`: LaTeX formatter to use (`latexindent`, `tex-fmt`, `none`), defaults `"latexindent"`
- `texlab.latexindent.local`: configures the `--local` flag of latexindent, defaults `null`
- `texlab.latexindent.modifyLineBreaks`: configures the `--modifylinebreaks` flag of latexindent, defaults `false`
- `texlab.latexindent.replacement`: additional replacement flag passed to latexindent (`-r`, `-rv`, `-rr`), defaults `null`

### Completion, hover & inlay hints

- `texlab.completion.matcher`: algorithm used to filter completion items (`fuzzy`, `fuzzy-ignore-case`, `prefix`, `prefix-ignore-case`), defaults `"fuzzy-ignore-case"`
- `texlab.hover.symbols`: how symbol-like commands are displayed on hover (`none`, `glyph`, `image`), defaults `"image"`
- `texlab.inlayHints.labelDefinitions`: return inlay hints for `\label`-like commands, defaults `true`
- `texlab.inlayHints.labelReferences`: return inlay hints for `\ref`-like commands, defaults `true`
- `texlab.inlayHints.maxLength`: truncate the text of inlay hints to the specified length, defaults `null`

### Experimental

Commands and environments are written **without** a leading `\`.

- `texlab.experimental.followPackageLinks`: resolve dependencies of custom packages into the dependency graph, defaults `false`
- `texlab.experimental.mathEnvironments`: extend the math environments, defaults `[]`
- `texlab.experimental.enumEnvironments`: extend the enumeration environments, defaults `[]`
- `texlab.experimental.verbatimEnvironments`: extend the verbatim environments, defaults `[]`
- `texlab.experimental.citationCommands`: extend the citation commands, defaults `[]`
- `texlab.experimental.labelDefinitionCommands`: extend the `\label`-like commands, defaults `[]`
- `texlab.experimental.labelReferenceCommands`: extend the `\ref`-like commands, defaults `[]`
- `texlab.experimental.labelReferenceRangeCommands`: extend the `\crefrange`-like commands, defaults `[]`
- `texlab.experimental.glossaryReferenceCommands`: extend the `\gls`-like commands, defaults `[]`
- `texlab.experimental.labelDefinitionPrefixes`: associate a label definition command with a prefix, e. g. `[["thm", "thm:"]]`, defaults `[]`
- `texlab.experimental.labelReferencePrefixes`: associate a label reference command with a prefix, e. g. `[["thmref", "thm:"]]`, defaults `[]`

## Commands

- `latex.Build`: build current file
- `latex.ForwardSearch`: performs a forward search from the current file
- `latex.UpdateLanguageServer`: upgrade TexLab Server to latest version

## License

MIT
