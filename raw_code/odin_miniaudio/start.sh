#./scripts/watch_build.sh &

#trap "trap - SIGTERM && kill -- -$$" SIGINT SIGTERM EXIT

#wait

odin run src/main.odin -file -out:dist/main -debug