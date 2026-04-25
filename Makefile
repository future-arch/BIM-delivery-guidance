# BIM 交付指南 · 写作工作台
# 使用 MkDocs Material 渲染本地文档站点。
#
# 用法:
#   make            # 显示可用命令
#   make serve      # 启动开发服务器（前台，Ctrl+C 停止）
#   make serve-bg   # 启动开发服务器（后台）
#   make stop       # 停止后台服务器
#   make build      # 构建静态站点到 outputs/site/
#   make install    # 安装/更新依赖
#   make clean      # 清除构建产物

VENV    := $(HOME)/devs-local/venvs/bim-guidance
PY      := $(VENV)/bin/python
PIP     := $(VENV)/bin/pip
MKDOCS  := $(VENV)/bin/mkdocs
HOST    := 127.0.0.1
PORT    := 8765
ADDR    := $(HOST):$(PORT)
LOG     := /tmp/bim-guidance-mkdocs.log
PIDFILE := /tmp/bim-guidance-mkdocs.pid

# 修复 mkdocs 1.6.1 + click 新版兼容 bug：
# CLI 默认会把 livereload 解析成 False，必须显式 --livereload 才能启用文件监听。
SERVE_FLAGS := --livereload -a $(ADDR)

.PHONY: help serve serve-bg stop status build clean install reinstall

help:
	@echo "BIM 交付指南 · 写作工作台"
	@echo ""
	@echo "  make serve      启动开发服务器（前台，Ctrl+C 停止）"
	@echo "  make serve-bg   启动开发服务器（后台，日志写入 $(LOG)）"
	@echo "  make stop       停止后台服务器"
	@echo "  make status     查看服务器状态"
	@echo "  make build      构建静态站点到 outputs/site/"
	@echo "  make install    安装/更新依赖"
	@echo "  make clean      清除构建产物"
	@echo ""
	@echo "  地址: http://$(ADDR)/"

serve:
	@echo ">>> 启动开发服务器: http://$(ADDR)/"
	@echo ">>> Ctrl+C 停止"
	$(MKDOCS) serve $(SERVE_FLAGS)

serve-bg: stop
	@echo ">>> 启动后台服务器: http://$(ADDR)/"
	@nohup $(MKDOCS) serve $(SERVE_FLAGS) > $(LOG) 2>&1 & echo $$! > $(PIDFILE)
	@sleep 2
	@if curl -sf -o /dev/null http://$(ADDR)/; then \
		echo ">>> 已启动 (PID $$(cat $(PIDFILE)))"; \
		echo ">>> 日志: tail -f $(LOG)"; \
	else \
		echo ">>> 启动失败，查看日志: cat $(LOG)"; exit 1; \
	fi

stop:
	@PID=$$(lsof -ti :$(PORT) 2>/dev/null); \
	if [ -n "$$PID" ]; then \
		kill $$PID 2>/dev/null; \
		sleep 1; \
		echo ">>> 已停止 (PID $$PID)"; \
	else \
		echo ">>> 未运行"; \
	fi
	@rm -f $(PIDFILE)

status:
	@PID=$$(lsof -ti :$(PORT) 2>/dev/null); \
	if [ -n "$$PID" ]; then \
		echo ">>> 运行中 (PID $$PID, 端口 $(PORT))"; \
		ps -p $$PID -o pid,etime,command | tail -1; \
	else \
		echo ">>> 未运行"; \
	fi

build:
	@echo ">>> 构建静态站点 -> outputs/site/"
	$(MKDOCS) build --strict

clean:
	@rm -rf outputs/site
	@echo ">>> 已清除 outputs/site/"

install:
	@if [ ! -x "$(PY)" ]; then \
		echo ">>> 创建虚拟环境: $(VENV)"; \
		mkdir -p $(HOME)/devs-local/venvs; \
		python3.13 -m venv $(VENV); \
		$(PIP) install --upgrade pip --quiet; \
	fi
	$(PIP) install --upgrade \
		'mkdocs-material' \
		'mkdocs-git-revision-date-localized-plugin' \
		'watchdog<5.0'
	@echo ">>> 依赖已就绪"

reinstall:
	rm -rf $(VENV)
	$(MAKE) install
