"""Generate ActionGuard's vector-derived native artwork. Requires Pillow."""
from pathlib import Path
import json
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
BLUE = '#0C75B8'
PALE = '#F2F7FB'
NAVY = '#12324A'
SHIELD = 'M512 176 L788 280 V492 C788 666 682 796 512 868 C342 796 236 666 236 492 V280 Z'
ARROW = 'M512 344 L654 630 L512 558 L370 630 Z'
SVG = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024"><path fill="white" d="{SHIELD}"/><path fill="{BLUE}" d="{ARROW}"/></svg>'

def curve(a, b, c, d):
    return [tuple((1-t)**3*a[i]+3*(1-t)**2*t*b[i]+3*(1-t)*t*t*c[i]+t**3*d[i] for i in (0,1)) for t in (n/100 for n in range(101))]

def mark(size, background=True, scale=1):
    # Supersampling preserves the curves at small launcher sizes.
    n = size*3
    image = Image.new('RGBA', (n,n), BLUE if background else (0,0,0,0))
    draw = ImageDraw.Draw(image)
    def points(rows):
        return [((x-512)*n/1024*scale+n/2,(y-512)*n/1024*scale+n/2) for x,y in rows]
    shield = [(512,176),(788,280),(788,492)]
    shield += curve((788,492),(788,666),(682,796),(512,868))
    shield += curve((512,868),(342,796),(236,666),(236,492))
    shield += [(236,280)]
    draw.polygon(points(shield), fill='white')
    draw.polygon(points([(512,344),(654,630),(512,558),(370,630)]), fill=BLUE)
    return image.resize((size,size), Image.Resampling.LANCZOS)

def save(image, path, opaque=False):
    path.parent.mkdir(parents=True,exist_ok=True)
    (image.convert('RGB') if opaque else image).save(path)

brand = ROOT/'public/brand'
brand.mkdir(parents=True,exist_ok=True)
(brand/'actionguard-mark.svg').write_text(SVG)
(ROOT/'public/favicon.svg').write_text(SVG.replace('<path fill="white"', f'<rect width="1024" height="1024" rx="216" fill="{BLUE}"/><path fill="white"',1))
icon = mark(1024)
save(icon,brand/'app-icon.png',True)
save(icon,ROOT/'ios/App/App/Assets.xcassets/AppIcon.appiconset/AppIcon-512@2x.png',True)

# Launch artwork is separate: the OS applies the home-screen icon mask itself.
assets=ROOT/'ios/App/App/Assets.xcassets'
launch=assets/'LaunchMark.imageset'
launch.mkdir(parents=True,exist_ok=True)
rounded=icon.copy()
mask=Image.new('L',(1024,1024));ImageDraw.Draw(mask).rounded_rectangle((0,0,1023,1023),radius=220,fill=255)
rounded.putalpha(mask)
for density in (1,2,3):
    save(rounded.resize((120*density,120*density),Image.Resampling.LANCZOS),launch/f'mark-{density}x.png')
(launch/'Contents.json').write_text(json.dumps({'images':[{'idiom':'universal','filename':f'mark-{d}x.png','scale':f'{d}x'} for d in (1,2,3)],'info':{'author':'xcode','version':1}},indent=2))

res=ROOT/'android/app/src/main/res'
for density,size in [('mdpi',48),('hdpi',72),('xhdpi',96),('xxhdpi',144),('xxxhdpi',192)]:
    folder=res/f'mipmap-{density}'
    save(mark(size),folder/'ic_launcher.png',True)
    circle=mark(size);m=Image.new('L',(size,size));ImageDraw.Draw(m).ellipse((0,0,size-1,size-1),fill=255);circle.putalpha(m)
    save(circle,folder/'ic_launcher_round.png')
    # Adaptive icon's central 66/108 safe region contains the full shield.
    save(mark(round(size*108/48),False,.72),folder/'ic_launcher_foreground.png')
(res/'values/ic_launcher_background.xml').write_text(f'<?xml version="1.0" encoding="utf-8"?><resources><color name="ic_launcher_background">{BLUE}</color></resources>')
vector=f'''<vector xmlns:android="http://schemas.android.com/apk/res/android" android:width="108dp" android:height="108dp" android:viewportWidth="1024" android:viewportHeight="1024"><group android:scaleX="0.72" android:scaleY="0.72" android:pivotX="512" android:pivotY="512"><path android:fillColor="#FFFFFF" android:pathData="{SHIELD}"/><path android:fillColor="{BLUE}" android:pathData="{ARROW}"/></group></vector>'''
(res/'drawable-v24/ic_launcher_foreground.xml').write_text(vector)
# Android 12+ uses the native system splash icon. Older versions use a centered bitmap.
for path in res.glob('drawable*/splash.png'):
    with Image.open(path) as old: w,h=old.size
    splash=Image.new('RGB',(w,h),PALE)
    dim=max(48,round(min(w,h)*.23));logo=rounded.resize((dim,dim),Image.Resampling.LANCZOS)
    splash.paste(logo,((w-dim)//2,(h-dim)//2),logo)
    save(splash,path,True)

# Flatten mark and title together so launch assets cannot render a label alone.
font_path='/System/Library/Fonts/SFNS.ttf'
art=Image.new('RGB',(720,900),PALE)
logo=rounded.resize((360,360),Image.Resampling.LANCZOS)
art.paste(logo,(180,180),logo)
ad=ImageDraw.Draw(art)
ad.text((360,612),'ActionGuard',anchor='mt',font=ImageFont.truetype(font_path,75),fill=NAVY)
artset=assets/'LaunchArtwork.imageset'
artset.mkdir(parents=True,exist_ok=True)
for density in (1,2,3):
    save(art.resize((240*density,300*density),Image.Resampling.LANCZOS),artset/f'launch-{density}x.png',True)
(artset/'Contents.json').write_text(json.dumps({'images':[{'idiom':'universal','filename':f'launch-{d}x.png','scale':f'{d}x'} for d in (1,2,3)],'info':{'author':'xcode','version':1}},indent=2))

# Standalone visual review sheet at actual phone aspect ratio.
font='/System/Library/Fonts/SFNS.ttf'
preview=Image.new('RGB',(1080,1150),'#E7EDF4');d=ImageDraw.Draw(preview)
d.text((56,48),'ActionGuard',font=ImageFont.truetype(font,38),fill=NAVY)
d.text((56,104),'APP ICON + LAUNCH SCREEN',font=ImageFont.truetype(font,17),fill='#5B7081')
large=rounded.resize((240,240),Image.Resampling.LANCZOS);preview.paste(large,(80,240),large)
d.text((90,508),'ActionGuard',font=ImageFont.truetype(font,30),fill=NAVY)
for x,size in [(84,60),(178,44),(262,30)]:
    small=rounded.resize((size,size),Image.Resampling.LANCZOS);preview.paste(small,(x,640),small)
phone=Image.new('RGB',(402,874),PALE);pd=ImageDraw.Draw(phone)
logo=rounded.resize((120,120),Image.Resampling.LANCZOS);phone.paste(logo,(141,337),logo)
pd.text((201,485),'ActionGuard',anchor='mt',font=ImageFont.truetype(font,25),fill=NAVY)
preview.paste(phone,(570,190))
save(preview,brand/'app-brand-preview.png',True)
print('Generated iOS, Android, web icon and brand preview assets.')
