# Consulta de Documentos — A373 — BR163/MS

Site usado nos tablets para abrir os projetos vigentes da obra.

## Arquivos

- `index.html` — o site.
- `documentos.json` — a lista de documentos. **É o único arquivo atualizado no dia a dia.**
- `gerador.html` — página que monta o `documentos.json` a partir das listas mestras.
- `sw.js`, `manifest.json`, `icon-*.png`, `Aterpa.png` — funcionamento offline e ícone do aplicativo.

## Como atualizar a lista

1. Atualize as listas mestras (LD_ANO01, LD_ANO02...).
2. Rode o `gerar_estrutura.bat` (fica na pasta 11.Sala Tecnica). Ele cria o `estrutura.txt` na Área de Trabalho.
3. Abra o `gerador.html` deste site, arraste as listas mestras, o LD_DER-SP, o CADERNOS_E_LICENCAS e o estrutura.txt, e clique em **Gerar lista**.
4. Confira as pendências e baixe o `documentos.json`.
5. Aqui no GitHub: **Add file › Upload files**, envie o `documentos.json` e clique em **Commit changes**.

## Regra de abertura

O site só abre PDFs que estão fora das pastas OBSOLETO. Se a pasta tiver uma revisão mais nova do que a lista mestra, o site abre a mais nova e o gerador avisa. Se a pasta só tiver uma revisão mais antiga do que a lista, o documento aparece sem botão de abrir.
