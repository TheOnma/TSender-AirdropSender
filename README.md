# T-Sender: ERC-20 Token Airdrop DApp 

T-Sender is a decentralized application (dApp) that allows users to easily airdrop ERC-20 tokens to multiple addresses in a single transaction. Built with **Next.js 14**, **Wagmi**, and **TypeScript**, it interacts with a smart contract (`TSender`) to batch-send tokens on supported EVM-compatible chains.

> ⚡ Ideal for token projects, community rewards, or mass incentives with a seamless UI and on-chain verification.

---

## 🚀 Features

- 🧠 **Auto-detect token details** (name, decimals, balance)
- 🪙 **Batch ERC-20 token transfers**
- ✅ **Approve + Airdrop in one click**
- 🔒 **Non-custodial**: user signs directly via wallet
- 🧾 **LocalStorage persistence** for token/recipient input
- 🔗 **Chain-aware**: detects the correct TSender contract per network

---

## 🛠️ Tech Stack

| Tool        | Purpose                        |
|-------------|--------------------------------|
| **Next.js** | Frontend framework             |
| **Wagmi**   | Wallet & contract interaction  |
| **TypeScript** | Type safety                   |
| **TailwindCSS** | UI Styling                   |
| **ViTest**  | Unit testing (config ready)    |

---

## 📦 Setup Instructions

```bash
git clone https://github.com/your-username/t-sender.git
cd t-sender
pnpm install
pnpm dev
```
## Usage
- Enter Token Address

  - Paste the ERC-20 token address you want to send.

- List Recipients

  - Add recipient addresses (comma or newline-separated).

- Specify Amounts

  - Match the number of recipients with the amounts (in wei).

- Click Send

  - The app checks allowance, requests approval (if needed), and sends all tokens in a single transaction.


