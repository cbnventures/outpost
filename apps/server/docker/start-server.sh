#!/usr/bin/env bash

set -euo pipefail

docker_socket="${DOCKER_HOST:-unix:///var/run/docker.sock}"
docker_socket="${docker_socket#unix://}"
supplementary_groups="${PGID}"

if [[ -S "${docker_socket}" ]]; then
  socket_group="$(stat -c '%g' "${docker_socket}")"

  if [[ "${socket_group}" != "${PGID}" ]]; then
    supplementary_groups="${supplementary_groups},${socket_group}"
  fi
fi

exec /command/s6-applyuidgid \
  -u "${PUID}" \
  -g "${PGID}" \
  -G "${supplementary_groups}" \
  node build/index.js
