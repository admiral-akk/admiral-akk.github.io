rm -rf ./dist
mkdir dist
./scripts/build.sh 
odin build src/main.odin -file -out:dist/main -debug
install_name_tool -add_rpath /Users/kuba/Documents/source_code/Odin/vendor/raylib/macos/ dist/main
./dist/main