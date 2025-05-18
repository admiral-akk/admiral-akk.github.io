odin build game.odin -file -build-mode:shared -out:game.so -define:RAYLIB_SHARED=true
odin build main.odin -file 
install_name_tool -add_rpath /Users/kuba/Documents/source_code/Odin/vendor/raylib/macos/ main
./main