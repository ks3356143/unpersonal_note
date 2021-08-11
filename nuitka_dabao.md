# nuitka打包详解

- ```text
  nuitka --mingw64 --standalone --show-progress --show-memory --plugin-enable=qt-plugins --output-dir=out 自己的.py
  ```

## 1.pyqt打包

调试前的命令行(need为文件夹名称，可自行修改)：

```text
nuitka --standalone --mingw64 --show-memory --show-progress --nofollow-imports --plugin-enable=qt-plugins --include-qt-plugins=sensible,styles --follow-import-to=need --output-dir=o 你的.py
```

调试后一个包一个包的导入

调试后的命令行(need为文件夹名称，可自行修改)：

```text
nuitka --standalone --windows-disable-console --mingw64 --nofollow-imports --show-memory --show-progress --plugin-enable=qt-plugins --include-qt-plugins=sensible,styles --follow-import-to=你的UIpy文件 --output-dir=o 你的.py
```

## 2.报错提示

Nuitka:INFO: Running data composer tool for optimal constant value handling.
Nuitka:INFO: Running C level backend compilation via Scons.
Nuitka-Scons:INFO: Mismatch between Python binary ('C:\\Users\\chenjunyi\\AppData\\Local\\Programs\\Python\\Python38-32\\python.exe' -> 'pei-i386') and C compiler ('C:\\mingw64\\bin\\gcc.exe' -> 'pei-x86-64') arches, ignored!
Nuitka will use gcc from MinGW64 of winlibs to compile on Windows.

Is it OK to download and put it in 'C:\\Users\\chenjunyi\\AppData\\Local\\Nuitka\\Nuitka\\gcc\\x86\\10.2.0-11.0.0-8.0.0-r5'.

No installer needed, cached, one time question.

Proceed and download? [Yes]/No
y
Nuitka:INFO: Downloading 'https://github.com/brechtsanders/winlibs_mingw/releases/download/10.2.0-11.0.0-8.0.0-r5/winlibs-i686-posix-dwarf-gcc-10.2.0-llvm-11.0.0-mingw-w64-8.0.0-r5.zip'.

说的是python是32bits的，gcc是64bits的，所以需要匹配

## 3.