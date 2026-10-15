# Why I Split My Git Repositories Between Self-Hosted Git and GitHub

## Introduction

Self-hosting Git repositories gives you control over your infrastructure, data, and development workflows. Platforms like Forgejo make this possible without depending entirely on third-party services.

However, GitHub offers something that can be difficult to replicate locally: publicly accessible infrastructure, hosted CI/CD runners, and integrations with external services.

Rather than forcing one platform to handle everything, there is a practical argument for splitting responsibilities between the two.

## The Problem With Keeping Everything Self-Hosted

Running Forgejo locally works well for source control, issue tracking, and private development.

The complications begin when external systems need access.

For example, suppose you want to:

- Clone repositories over SSH from anywhere.
- Automatically build Windows and Linux applications.
- Publish releases to external users.
- Integrate with services that expect GitHub repositories.
- Run CI/CD jobs without maintaining additional build infrastructure.

These requirements introduce infrastructure responsibilities beyond simply hosting Git.

Remote SSH access may require firewall rules, VPN access, or Cloudflare Tunnel configurations. CI/CD requires runners, dependencies, operating systems, and maintenance.

None of these problems are impossible to solve. However, each introduces additional complexity.

**The question becomes whether maintaining that complexity provides enough value.**

## Why GitHub Makes Sense for CI/CD

GitHub Actions provides hosted build infrastructure that removes much of the maintenance associated with self-hosted runners.

For example, building a game for multiple operating systems can involve separate environments.

| Requirement | Self-Hosted Forgejo | GitHub |
|---|---|---|
| Git repository hosting | Yes | Yes |
| Issue tracking | Yes | Yes |
| Linux CI/CD | Self-managed runners | Hosted runners available |
| Windows CI/CD | Requires compatible runner | Hosted runners available |
| Public releases | Yes, requires hosting/access | Built-in |
| Remote SSH access | Requires network configuration | Built-in |
| Infrastructure maintenance | Your responsibility | Mostly GitHub's responsibility |
| Offline local access | Possible | Requires local clones |

For independent developers, hosted runners can be particularly valuable.

You can build Windows executables without maintaining a dedicated Windows machine.

GitHub also provides established integrations for publishing releases, managing artifacts, and distributing software.

There are still usage limits, costs, and platform dependencies to consider, but the infrastructure burden is considerably smaller.

## Why Keep Forgejo?

<text weight="medium">Self-hosted Git still has significant advantages.</text>

### 1. Ownership and Control

Forgejo allows you to maintain repositories on infrastructure you control.

You decide how repositories are stored, backed up, accessed, and maintained.

### 2. Private Development

Internal scripts, infrastructure configurations, experimental projects, and personal automation do not necessarily need to exist on a public hosting platform.

Keeping them on Forgejo provides an independent environment for development.

### 3. Local Automation

A self-hosted runner can interact directly with your local infrastructure.

This is useful for:

- Deploying local containers.
- Managing Podman services.
- Updating internal applications.
- Running infrastructure maintenance.
- Executing jobs that require access to private network resources.

GitHub-hosted runners cannot automatically access your private network without additional connectivity.

### 4. Independence

Maintaining self-hosted repositories reduces dependence on a single provider.

Git itself is distributed, so repositories can be cloned, mirrored, and moved between platforms.

This portability is one of Git's greatest advantages.

## A Better Approach: Assign Each Platform a Purpose

Rather than duplicating every workflow, assign responsibilities according to what each platform does best.

| Forgejo | GitHub |
|---|---|
| Private infrastructure repositories | Public software projects |
| Local automation | Cross-platform application builds |
| Internal configuration management | Public releases |
| LAN-based deployments | External collaboration |
| Self-hosted experiments | Distribution and integrations |

This arrangement reduces unnecessary infrastructure work while preserving the benefits of self-hosting.

## What About Repository Mirroring?

Repository mirroring allows one platform to maintain a copy of another repository.

For example:

```text
Forgejo (Source of Truth)
         |
         | Git Mirror
         v
GitHub (CI/CD + Releases)
         |
         v
GitHub Actions
         |
         v
Windows / Linux Builds
```

This approach works well when Forgejo is the primary development environment.

However, it introduces additional considerations:

- Git commits and branches can be mirrored.
- Issues and pull requests are not automatically transferred through ordinary Git mirroring.
- GitHub Actions workflows must exist in the GitHub repository.
- Changes made directly on the mirror can create synchronization problems.
- Mirroring adds another process that must be maintained.

If GitHub already handles the majority of development and distribution activity, keeping Forgejo as the source of truth may introduce more complexity than value.

In that case, moving the primary repository to GitHub may be the simpler solution.

## My Preferred Architecture

For my development environment, the practical solution is to keep Forgejo for internal infrastructure and use GitHub as the primary platform for publicly distributed software.

```text
             DEVELOPMENT
                  |
          +-------+-------+
          |               |
          v               v
       Forgejo          GitHub
          |               |
     Private Repos     Public Repos
          |               |
     Local CI/CD       GitHub Actions
          |               |
     Podman / LAN      App Builds
                          |
                          v
                    Public Releases
```

This removes the need to expose my self-hosted Git server simply to clone public software projects remotely.

It also means I do not need to maintain Windows build infrastructure for applications distributed through GitHub.

Forgejo remains useful where local control and infrastructure access provide actual benefits.

## The Trade-Off

Splitting repositories between platforms is not automatically better for everyone.

It introduces two interfaces, two permission systems, and two locations to maintain.

There is also a distinction between splitting repositories by purpose and mirroring the same repository across platforms.

**Splitting repositories reduces unnecessary dependencies. Mirroring repositories can increase them.**

The key is to avoid maintaining duplicate infrastructure without a clear reason.

## Conclusion

Self-hosting should provide control and flexibility, not create unnecessary administrative work.

Forgejo is an excellent choice for private repositories, internal automation, and infrastructure management.

GitHub is often the more practical choice for public projects, cross-platform builds, and software distribution.

Using both platforms does not mean abandoning self-hosting. It means recognizing that different tools are better suited to different responsibilities.

**The goal is not to self-host everything. The goal is to self-host what actually benefits from being self-hosted.**
