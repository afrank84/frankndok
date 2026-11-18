# Find Open Ports on Linux with Docker and Podman

Start with the host's TCP listeners and UDP sockets, then compare them with the ports Docker and Podman publish. To see whether clients are actually using a port, check connections or service logs.

## 1. List ports on the Linux host

Run this on the Linux machine that runs the containers. If your Docker context or Podman connection points to another machine or VM, run the host checks there.

```bash
sudo ss -lntup
```

This shows listening TCP sockets and unconnected UDP sockets with numeric addresses and ports. Running with `sudo` helps show the owning process and PID. Read the **Local Address:Port** column.

| Local address | What it means |
| --- | --- |
| `127.0.0.1:8080` or `[::1]:8080` | Bound to loopback |
| `0.0.0.0:8080` | Bound to all IPv4 interfaces |
| `[::]:8080` | Bound to all IPv6 interfaces. IPv4 handling depends on the socket configuration. |
| `192.168.1.100:8080` | Bound to that specific IPv4 address |

To check one port, substitute its number and select the protocol you care about. TCP and UDP can use the same port number independently.

```bash
sudo ss -lntp 'sport = :8080'
sudo ss -lnup 'sport = :5353'
```

## 2. Map published ports to containers

List running containers and their port mappings in each engine you use.

```bash
docker ps --format 'table {{.Names}}\t{{.Ports}}'
podman ps --format 'table {{.Names}}\t{{.Ports}}'
podman port --all
```

Run rootless Podman commands as each user who runs containers, and use `sudo podman ps` and `sudo podman port --all` for rootful Podman. For Docker, use the context that manages your containers. Check `docker context ls` if you use both rootless and system Docker daemons.

For example, this mapping means the container `web` publishes its TCP port 80 on the host's IPv4 port 8080.

```text
NAMES   PORTS
web     0.0.0.0:8080->80/tcp
```

A bare entry such as `80/tcp` lists an exposed container port. A published mapping includes a host address and port before the arrow. Query one container for its published mappings with the appropriate engine.

```bash
docker port web
podman port web
```

Add `-a` to either engine's `ps` command to review stopped containers too. Their recorded mappings can help explain a future startup conflict. Use the running-container list to check current publications.

## 3. Investigate ports that only appear in one list

- **A published port appears only in Docker or Podman.** The engine may forward traffic with firewall rules, so `ss` may have no host socket to display. The mapping identifies the destination container. Check that the service is listening inside it.
- **A container process appears in `ss` without a published mapping.** A container using host networking shares the host's network namespace and opens sockets directly. Check the container's networking mode with `docker inspect web` or `podman inspect web`.
- **Several Podman containers share a mapping.** Containers in a pod usually share one network namespace. Use `podman ps --pod` to see which containers belong to the pod, then check the listening service inside that namespace.

If the image includes `ss`, list sockets inside the container. Use the command for your engine.

```bash
docker exec web ss -lntu
podman exec web ss -lntu
```

Compare the result with the **container** port in the mapping. For a typical bridge-networked container, the application should listen on the container interface or a wildcard address so forwarded traffic can reach it. Minimal images may omit `ss`. In that case, check the application's startup logs and bind configuration.

## 4. Check reachability and actual use

From another machine on your LAN, try the service at the host's LAN IP and published port. For an HTTP service, use its health endpoint or another known read-only path.

```bash
curl --connect-timeout 3 -I http://192.168.1.100:8080/
```

An HTTP response shows the request reached an HTTP service. Use the application's client for other protocols, including UDP. Test from where your clients run, since firewalls and routing can affect reachability. To check IPv6, use the host's IPv6 address in brackets in the URL.

To see current established TCP connections to a host socket on port 8080, run this on the server.

```bash
sudo ss -ntp state established 'sport = :8080'
```

If the engine forwards traffic directly into a container's network namespace, run the check inside that container with its internal port instead. For a longer view, check the application or reverse proxy access logs over a period that covers normal usage. Short TCP connections can finish between snapshots, and UDP has no TCP-style connection state.
