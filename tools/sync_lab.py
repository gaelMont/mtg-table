"""Copie le moteur du labo dans www/index.html et y branche le mode partie (game.js, game.css).
Usage : python3 tools/sync_lab.py CHEMIN_DU_LABO"""
import shutil, sys, pathlib
src = pathlib.Path(sys.argv[1]); www = pathlib.Path(__file__).resolve().parent.parent / 'www'
shutil.copy(src / 'rules.json', www / 'rules.json')
shutil.rmtree(www / 'db', ignore_errors=True); shutil.copytree(src / 'db', www / 'db')
html = (src / 'index.html').read_text(encoding='utf-8')
html = html.replace('<title>', '<link rel="stylesheet" href="game.css"><title>', 1)
# Le script du labo est un bloc { ... } : le mode partie doit être inséré DANS ce bloc pour
# partager ses variables (S, R, pick...) et remplacer ses fonctions (render, drawP, newTurn).
game = (www / 'game.js').read_text(encoding='utf-8')
end = html.rfind('</script>')
close = html.rfind('}', 0, end)
html = html[:close] + '\n// ===== MODE PARTIE (www/game.js)\n' + game + '\n' + html[close:]
html = html.replace('name="viewport" content="width=device-width,initial-scale=1"', 'name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"')
(www / 'index.html').write_text(html, encoding='utf-8')
print('ok', len(html))
