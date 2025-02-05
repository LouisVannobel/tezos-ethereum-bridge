# **Ethereum-Tezos Bridge** 🌉🔗

Ce projet implémente un **pont inter-chaînes** entre **Ethereum** et **Tezos**, permettant le transfert de tokens ERC-20 d'une blockchain à l'autre.  

## 📜 **Description**
Le projet repose sur :
- Un **contrat ERC-20 (BridgeCoin)** sur **Ethereum**.
- Un **contrat de dépôt (BridgeVault)** pour verrouiller les tokens Ethereum avant leur mint sur Tezos.
- Un **contrat FA2** sur **Tezos** pour gérer les tokens après leur transfert.
- Un **Relayer** qui surveille les événements de dépôt et de burn pour coordonner les transactions entre les deux blockchains.

## 📂 **Architecture**
```
📦 ethereum/               # DApp Ethereum
 ┣ 📜 contracts/           # Smart Contracts Solidity
 ┃ ┣ 📜 ERC20.sol          # Implémentation du token ERC-20
 ┃ ┗ 📜 BridgeVault.sol    # Contrat de dépôt des tokens ERC-20
 ┣ 📜 migrations/          # Scripts de déploiement Truffle
 ┃ ┣ 📜 1_deploy_token.js  # Déploiement du token ERC-20
 ┃ ┗ 📜 2_deploy.js        # Déploiement du BridgeVault
 ┗ 📜 truffle-config.js    # Configuration de Truffle et des réseaux

📦 tezos/                  # Smart Contracts Tezos
 ┗ 📜 fa2.arl              # Implémentation du token FA2 en Archetype

📦 relay/                  # Relayer entre Ethereum et Tezos
 ┗ 📜 index.js             # Script de relai entre les blockchains

📜 .env                    # Variables d'environnement (privées)
📜 Makefile                # Automatisation des tâches
📜 README.md               # Documentation du projet
```

## 🚀 **Installation & Configuration**
### **1️⃣ Prérequis**
- Node.js & npm
- Truffle (`npm install -g truffle`)
- Completium CLI (`npm install -g completium-cli`)
- Un portefeuille Ethereum avec des fonds de test
- Un compte Tezos avec des XTZ de test

### **2️⃣ Installation**
Clonez le dépôt et installez les dépendances :
```sh
git clone https://github.com/votre-utilisateur/ethereum-tezos-bridge.git
cd ethereum-tezos-bridge
make all
```

### **3️⃣ Configuration**
Créer un fichier **`.env`** à la racine avec :
```ini
# Ethereum
ETH_RPC_URL="https://sepolia.infura.io/v3/VOTRE_INFURA_ID"
ETH_PRIVATE_KEY="VOTRE_CLE_PRIVEE"
ERC20_ADDRESS="ADRESSE_DU_CONTRAT_ERC20"

# Tezos
TEZOS_RPC_URL="https://ghostnet.smartpy.io"
TEZOS_PRIVATE_KEY="VOTRE_CLE_PRIVEE_TEZOS"
TEZOS_FA2_ADDRESS="ADRESSE_DU_CONTRAT_FA2"

# Relayer
RELAYER_ADDRESS="ADRESSE_DU_VAULT_ETHEREUM"
```

### **4️⃣ Déploiement**
#### **➡ Déployer sur Ethereum**
```sh
cd ethereum
truffle migrate --network sepolia
```

#### **➡ Déployer sur Tezos**
```sh
cd tezos
completium deploy fa2.arl
```

### **5️⃣ Lancer le relayer**
```sh
cd relay
node index.js
```
Le relayer écoute les **dépôts sur Ethereum** et **burns sur Tezos** pour transférer les tokens de manière bidirectionnelle.

## 🛠 **Fonctionnalités**
✔ **Dépôt Ethereum** → Mint Tezos  
✔ **Burn Tezos** → Retrait Ethereum  
✔ **Automatisation avec un relayer**  
✔ **Utilisation des standards ERC-20 & FA2**  
✔ **Déploiement sur testnet Sepolia & Testnet Tezos**  

## 🛡 **Sécurité & Améliorations Futures**
- 🔐 Vérification des preuves pour éviter la double utilisation des tokens.  
- ⚡ Optimisation du gas sur Ethereum.  
- 📜 Ajout de tests unitaires et de scripts d'intégration.  
