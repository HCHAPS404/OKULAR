.PHONY: bootstrap dev api web test lint eval build smoke

bootstrap:
	uv sync --project services/api --extra dev
	corepack enable
	pnpm install --no-frozen-lockfile

api:
	uv run --project services/api uvicorn okular.main:app --host 127.0.0.1 --port 8000 --reload

web:
	pnpm --dir apps/web dev

dev:
	@echo "Open two terminals: make api   AND   make web"

test:
	uv run --project services/api --extra dev pytest services/api/tests

lint:
	uv run --project services/api --extra dev ruff check services/api evals
	pnpm --dir apps/web lint
	pnpm --dir apps/web typecheck

eval:
	uv run --project services/api --extra dev python evals/run_evals.py

build:
	pnpm --dir apps/web build

smoke:
	curl --fail http://127.0.0.1:8000/healthz
	curl --fail http://127.0.0.1:8000/v1/capabilities
