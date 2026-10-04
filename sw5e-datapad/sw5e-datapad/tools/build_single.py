#!/usr/bin/env python3
"""Build single-file versions of the datapad.

dist/sw5e-datapad.html : complete standalone page (open it, host it, or keep it as a backup copy)
dist/artifact.html     : page fragment for publishing as a Claude artifact (the host supplies the document shell)
"""
import base64, os, re

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
DIST = os.path.join(ROOT, 'dist')
os.makedirs(DIST, exist_ok=True)

def read(p, mode='r'):
    with open(os.path.join(ROOT, p), mode, **({} if 'b' in mode else {'encoding': 'utf-8'})) as f:
        return f.read()

def b64(p):
    return base64.b64encode(read(p, 'rb')).decode()

css = read('styles.css')
css = css.replace('url("fonts/Aurebesh.otf") format("opentype")', 'url(data:font/otf;base64,%s) format("opentype")' % b64('fonts/Aurebesh.otf'))
css = css.replace('url("fonts/Aurebesh-Bold.otf") format("opentype")', 'url(data:font/otf;base64,%s) format("opentype")' % b64('fonts/Aurebesh-Bold.otf'))

def js(p):
    s = read(p)
    # U+FFFD exists in a few SW5e source strings; keep it exactly, but written as an escape so the file stays clean text
    return s.replace('</script', '<\\/script').replace('<!--', '<\\!--').replace('\ufffd', '\\ufffd')

scripts = ''.join('<script>%s</script>\n' % js(p) for p in ['data.js', 'lore.js', 'speciesimg.js', 'rules.js', 'app.js'])
body = read('index.html')
body = re.search(r'<body>(.*?)<script src="data.js">', body, re.S).group(1)

standalone = ('<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n'
              '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'
              '<meta name="theme-color" content="#040b12">\n<title>SW5e Datapad</title>\n<style>%s</style>\n</head>\n<body>%s%s</body>\n</html>\n') % (css, body, scripts)
with open(os.path.join(DIST, 'sw5e-datapad.html'), 'w', encoding='utf-8') as f:
    f.write(standalone)

# Artifact host pads :root with the safe-area insets itself, so drop our own to avoid double padding.
acss = css.replace('calc(env(safe-area-inset-top, 0px) + 10px)', '10px').replace('env(safe-area-inset-bottom, 0px)', '0px').replace('env(safe-area-inset-top, 0px)', '0px')
frag = '<title>SW5e Datapad</title>\n<style>%s</style>\n%s%s' % (acss, body, scripts)
with open(os.path.join(DIST, 'artifact.html'), 'w', encoding='utf-8') as f:
    f.write(frag)

for n in ('sw5e-datapad.html', 'artifact.html'):
    print(n, round(os.path.getsize(os.path.join(DIST, n)) / 1e6, 2), 'MB')
