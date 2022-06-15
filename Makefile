.DEFAULT_GOAL := help

help:
	@cat $(MAKEFILE_LIST) | grep -e "^[a-zA-Z_\-]*: *.*## *" | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

fill-hours: ## Fill hours with user and password auth in background
	@echo "🚀 Starting to fill hours"
	@npm run start
	@echo "✅ Your hours have been updated!"

fill-hours-headed: ## Fill hours with user and password auth showing the process
	@echo "🚀 Starting to fill hours"
	@npm run start:headed
	@echo "✅ Your hours have been updated!"

fill-google: ## Fill hours with google auth in background
	@echo "🚀 Starting to fill hours with Google authentication"
	@npm run start:google
	@echo "✅ Your hours have been updated!"

fill-google-headed: ## Fill hours with google auth showing the process
	@echo "🚀 Starting to fill hours with Google authentication"
	@npm run start:google:headed
	@echo "✅ Your hours have been updated!"

fill-previous-month: ## Fill previous month's hours with user and password auth in background
	@echo "🚀 Starting to fill hours"
	@npm run previous-month
	@echo "✅ Your hours have been updated!"

fill-previous-month-headed: ## Fill previous month's hours with user and password auth showing the process
	@echo "🚀 Starting to fill hours"
	@npm run previous-month:headed
	@echo "✅ Your hours have been updated!"
