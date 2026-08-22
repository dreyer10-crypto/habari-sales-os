import re, sys, zipfile, shutil, os
ORDER = {'top':0,'start':1,'left':1,'bottom':2,'end':3,'right':3,'insideH':4,'insideV':5,'between':4,'bar':5,'tl2br':6,'tr2bl':7}
def fix_block(m):
    tag, inner = m.group(1), m.group(2)
    parts = re.findall(r'<w:(top|start|left|bottom|end|right|insideH|insideV|between|bar|tl2br|tr2bl)\b[^>]*/>', inner)
    els   = re.findall(r'(<w:(?:top|start|left|bottom|end|right|insideH|insideV|between|bar|tl2br|tr2bl)\b[^>]*/>)', inner)
    if not els: return m.group(0)
    rest = re.sub(r'<w:(?:top|start|left|bottom|end|right|insideH|insideV|between|bar|tl2br|tr2bl)\b[^>]*/>', '', inner)
    pairs = sorted(zip(parts, els), key=lambda pe: ORDER[pe[0]])
    return '<w:%s>%s%s</w:%s>' % (tag, ''.join(e for _,e in pairs), rest, tag)

src, dst = sys.argv[1], sys.argv[2]
tmp = dst + '.work'
if os.path.exists(tmp): shutil.rmtree(tmp)
os.makedirs(tmp)
with zipfile.ZipFile(src) as z: z.extractall(tmp)
p = os.path.join(tmp,'word','document.xml')
s = open(p, encoding='utf-8').read()
s2 = re.sub(r'<w:(pBdr|tcBorders|tblBorders|tcMar|tblCellMar)>(.*?)</w:\1>', fix_block, s, flags=re.S)
open(p,'w',encoding='utf-8').write(s2)
if os.path.exists(dst): os.remove(dst)
zf = zipfile.ZipFile(dst,'w',zipfile.ZIP_DEFLATED)
for root,_,files in os.walk(tmp):
    for f in files:
        full=os.path.join(root,f)
        zf.write(full, os.path.relpath(full,tmp))
zf.close(); shutil.rmtree(tmp)
print('reordered ->', dst)
