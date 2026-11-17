# LM Studio Quick Tutorial

## List Installed Models

```bash
lms ls
```

---

## Load a Model

```bash
lms load qwen/qwen3.6-35b-a3b
```

---

## Load a Model with Custom Context Length

```bash
lms load qwen/qwen3.6-35b-a3b -c 90000
```

---

## View Loaded Models

```bash
lms ps
```

Example:

```text
IDENTIFIER              MODEL                   STATUS    SIZE        CONTEXT
qwen/qwen3.6-35b-a3b    qwen/qwen3.6-35b-a3b    IDLE      22.07 GB    90000
```

---

## Unload a Model

```bash
lms unload qwen/qwen3.6-35b-a3b
```

---

## Unload All Models

```bash
lms unload --all
```

---

## Start the API Server

```bash
lms server start
```

---

## Check API Server Status

```bash
lms server status
```

---

## Watch API Requests

```bash
lms log stream
```

---

## Typical Workflow

```bash
# Load model with 90k context
lms load qwen/qwen3.6-35b-a3b -c 90000

# Verify model is loaded
lms ps

# Start API server
lms server start

# Watch requests from Hermes
lms log stream

# Unload model when finished
lms unload qwen/qwen3.6-35b-a3b
```
