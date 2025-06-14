rm -rf ./dist
mkdir dist
odin build src/main.odin -file -out:dist/main -debug
./dist/main