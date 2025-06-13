./scripts/watch_build.sh &

trap "trap - SIGTERM && kill -- -$$" SIGINT SIGTERM EXIT

wait