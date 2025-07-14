# Running Postgres with Docker

This document provides the command to run a local Postgres database using Docker for development purposes.

## Prerequisites

*   [Docker](https://docs.docker.com/engine/install/) must be installed on your system.

## Command

To start the Postgres container, run the following command in your terminal:

```bash
docker run -d \
  --name nazca-postgres \
  -e POSTGRES_PASSWORD=mysecretpassword \
  -p 5432:5432 \
  -v ~/postgres-local-data:/var/lib/postgresql/data \
  --restart unless-stopped \
  docker.io/postgres:16
```

### Command Breakdown

*   `docker run -d`: Runs the container in detached mode (in the background).
*   `--name nazca-postgres`: Assigns a name to the container for easy reference.
*   `-e POSTGRES_PASSWORD=mysecretpassword`: Sets the password for the default `postgres` user. **Note:** You should change `mysecretpassword` to a more secure password in a real application.
*   `-p 5432:5432`: Maps port `5432` on your local machine to port `5432` in the container.
*   `-v ~/postgres-local-data:/var/lib/postgresql/data`: Mounts the `~/postgres-local-data` directory on your host machine to the `/var/lib/postgresql/data` directory in the container. This ensures that your data is persisted even if the container is removed.
*   `--restart unless-stopped`: Configures the container to restart automatically unless it is manually stopped.
*   `postgres:16`: Specifies the official Postgres image and version to use.

## Connecting to the Database

You can connect to the database using any standard Postgres client with the following credentials:

*   **Host**: `localhost`
*   **Port**: `5432`
*   **Database**: `postgres`
*   **User**: `postgres`
*   **Password**: `mysecretpassword` (or the password you set)

```