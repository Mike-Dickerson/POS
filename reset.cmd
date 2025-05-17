docker compose down %1
docker compose build --no-cache %1
docker compose up %1 -d
