SHELL := /bin/bash

ETHEREUM_DIR := ethereum
TEZOS_DIR := tezos
RELAY_DIR := relay

TRUFFLE := truffle
COMPLETIUM := completium-cli
NPM := npm
NODE := node
PYTHON := python3

.PHONY: all ethereum tezos relay install-deps clean

all: install-deps ethereum tezos relay
	@echo "Projet configuré pour Ethereum, Tezos et le Relayer."

install-deps:
	@echo "Installation des dépendances globales..."
	@$(NPM) install -g $(TRUFFLE) ethers $(COMPLETIUM)
	@echo "Dépendances globales installées."

ethereum:
	@echo "Configuration du projet Ethereum..."
	@mkdir -p $(ETHEREUM_DIR)
	@cd $(ETHEREUM_DIR) && $(TRUFFLE) init
	@$(NPM) install @openzeppelin/contracts dotenv @truffle/hdwallet-provider
	@echo "Projet Ethereum initialisé."

tezos:
	@echo "Configuration du projet Tezos..."
	@mkdir -p $(TEZOS_DIR)
	@cd $(TEZOS_DIR) && $(NPM) exec -- completium-init
	@$(NPM) install @taquito/taquito @taquito/signer
	@echo "Projet Tezos initialisé."

relay:
	@echo "Configuration du relayer Ethereum <-> Tezos..."
	@mkdir -p $(RELAY_DIR)
	@cd $(RELAY_DIR) && $(NPM) install ethers @taquito/taquito @taquito/signer dotenv
	@echo "Relayer configuré."

clean:
	@echo "Suppression des dossiers Ethereum, Tezos et Relay..."
	@rm -rf $(ETHEREUM_DIR) $(TEZOS_DIR) $(RELAY_DIR)
	@echo "Nettoyage terminé."
