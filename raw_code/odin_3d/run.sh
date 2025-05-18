rm -rf ./dist
mkdir dist
./build.sh
odin build src/main.odin -file -out:dist/main
install_name_tool -add_rpath /Users/kuba/Documents/source_code/Odin/vendor/raylib/macos/ dist/main
./dist/main