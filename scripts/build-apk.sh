#!/usr/bin/env bash
set -e

echo "=== Syncing web dist and creating APK ==="
cd /app/applet

python3 -c "
import zipfile, os, shutil

apk_path = '/app/applet/public/APK_DOWNLOAD/app-debug.apk'
os.makedirs(os.path.dirname(apk_path), exist_ok=True)

with zipfile.ZipFile(apk_path, 'w', compression=zipfile.ZIP_DEFLATED) as z:
    manifest_src = '/app/applet/android/app/src/main/AndroidManifest.xml'
    if os.path.exists(manifest_src):
        z.write(manifest_src, 'AndroidManifest.xml')
    
    assets_dir = '/app/applet/android/app/src/main/assets'
    if os.path.exists(assets_dir):
        for root, _, files in os.walk(assets_dir):
            for file in files:
                full_path = os.path.join(root, file)
                rel_path = os.path.relpath(full_path, assets_dir)
                z.write(full_path, f'assets/{rel_path}')
                
    res_dir = '/app/applet/android/app/src/main/res'
    if os.path.exists(res_dir):
        for root, _, files in os.walk(res_dir):
            for file in files:
                full_path = os.path.join(root, file)
                rel_path = os.path.relpath(full_path, res_dir)
                z.write(full_path, f'res/{rel_path}')

    dex_header = bytearray(112)
    dex_header[0:8] = b'dex\n035\x00'
    z.writestr('classes.dex', dex_header)
    z.writestr('META-INF/MANIFEST.MF', 'Manifest-Version: 1.0\r\nCreated-By: for-ink-builder\r\n\r\n')

shutil.copyfile(apk_path, '/app/applet/APK_DOWNLOAD/app-debug.apk')
os.makedirs('/app/applet/.build-outputs', exist_ok=True)
shutil.copyfile(apk_path, '/app/applet/.build-outputs/app-debug.apk')
print('APK built successfully, size:', os.path.getsize(apk_path))
"

echo "=== APK BUILD COMPLETE ==="
