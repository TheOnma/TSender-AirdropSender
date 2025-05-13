"use client"

import { useState, useMemo, useEffect } from "react"
import { useChainId, useWriteContract, useAccount, useWaitForTransactionReceipt, useReadContracts } from "wagmi"
import { chainsToTSender, tsenderAbi, erc20Abi } from "@/constants"
import { readContract, waitForTransactionReceipt } from "@wagmi/core"
import { useConfig } from "wagmi"
import { CgSpinner } from "react-icons/cg"
import { calculateTotal } from "@/utils"

export default function AirdropForm() {
    const [tokenAddress, setTokenAddress] = useState("")
    const [recipients, setRecipients] = useState("")
    const [amounts, setAmounts] = useState("")
    const config = useConfig()
    const account = useAccount()
    const chainId = useChainId()
    const { data: tokenData } = useReadContracts({
        contracts: [
            {
                abi: erc20Abi,
                address: tokenAddress as `0x${string}`,
                functionName: "decimals",
            },
            {
                abi: erc20Abi,
                address: tokenAddress as `0x${string}`,
                functionName: "name",
            },
            {
                abi: erc20Abi,
                address: tokenAddress as `0x${string}`,
                functionName: "balanceOf",
                args: [account.address],
            },
        ],
    })
    const [hasEnoughTokens, setHasEnoughTokens] = useState(true)

    const { data: hash, isPending, error, writeContractAsync } = useWriteContract()
    const { isLoading: isConfirming, isSuccess: isConfirmed, isError } = useWaitForTransactionReceipt({
        confirmations: 1,
        hash,
    })

    const total: number = useMemo(() => calculateTotal(amounts), [amounts])

    async function handleSubmit() {
        const tSenderAddress = chainsToTSender[chainId]["tsender"]
        const approvedAmount = await getApprovedAmount(tSenderAddress)

        if (approvedAmount < total) {
            const approvalHash = await writeContractAsync({
                abi: erc20Abi,
                address: tokenAddress as `0x${string}`,
                functionName: "approve",
                args: [tSenderAddress as `0x${string}`, BigInt(total)],
            })
            const approvalReceipt = await waitForTransactionReceipt(config, {
                hash: approvalHash,
            })

            console.log("Approval confirmed:", approvalReceipt)

           await writeContractAsync({
            abi: tsenderAbi,
            address: tSenderAddress as `0x${string}`,
            functionName: "airdropERC20",
            args: [
                tokenAddress,
                recipients.split(/[,\n]+/).map(addr => addr.trim()).filter(addr => addr !== ''),
                amounts.split(/[,\n]+/).map(amt => amt.trim()).filter(amt => amt !== ''),
                BigInt(total),
            ],
        })} else {
              await writeContractAsync({
              abi: tsenderAbi,
              address: tSenderAddress as `0x${string}`,
              functionName: "airdropERC20",
              args: [
                tokenAddress,
                // Comma or new line separated
                recipients.split(/[,\n]+/).map(addr => addr.trim()).filter(addr => addr !== ''),
                amounts.split(/[,\n]+/).map(amt => amt.trim()).filter(amt => amt !== ''),
                BigInt(total),
              ],
          })
     }
 }

    async function getApprovedAmount(tSenderAddress: string | null): Promise<number> {
      const response = await readContract(config, {
            abi: erc20Abi,
            address: tokenAddress as `0x${string}`,
            functionName: "allowance",
            args: [account.address, tSenderAddress as `0x${string}`],
        })
        return response as number
    }

    function getButtonContent() {
        if (isPending)
            return (
                <div className="flex items-center justify-center gap-2 w-full">
                    <CgSpinner className="animate-spin" size={20} />
                    <span>Confirming in wallet...</span>
                </div>
            )
        if (isConfirming)
            return (
                <div className="flex items-center justify-center gap-2 w-full">
                    <CgSpinner className="animate-spin" size={20} />
                    <span>Waiting for transaction to be included...</span>
                </div>
            )
        if (error || isError) {
            console.log(error)
            return <span>Error, see console.</span>
        }
        if (isConfirmed) {
            return "Transaction confirmed."
        }
        return "Send Tokens"
    }

    useEffect(() => {
        const savedTokenAddress = localStorage.getItem("tokenAddress")
        const savedRecipients = localStorage.getItem("recipients")
        const savedAmounts = localStorage.getItem("amounts")

        if (savedTokenAddress) setTokenAddress(savedTokenAddress)
        if (savedRecipients) setRecipients(savedRecipients)
        if (savedAmounts) setAmounts(savedAmounts)
    }, [])

    useEffect(() => {
        localStorage.setItem("tokenAddress", tokenAddress)
    }, [tokenAddress])

    useEffect(() => {
        localStorage.setItem("recipients", recipients)
    }, [recipients])

    useEffect(() => {
        localStorage.setItem("amounts", amounts)
    }, [amounts])

    useEffect(() => {
        if (tokenAddress && total > 0 && tokenData?.[2]?.result as number !== undefined) {
            const userBalance = tokenData?.[2].result as number
            setHasEnoughTokens(userBalance >= total)
        } else {
            setHasEnoughTokens(true)
        }
    }, [tokenAddress, total, tokenData])

    return (
        <div className="max-w-2xl w-full mx-auto p-6 flex flex-col gap-6 bg-white rounded-xl border-2 border-blue-500 ring-4 ring-blue-500/25">
            <h2 className="text-xl font-semibold text-zinc-900">T-Sender</h2>

            <div className="space-y-6">
                <div>
                    <label className="block mb-2 text-sm font-medium text-zinc-900">Token Address</label>
                    <input
                        className="w-full p-2 border border-gray-300 rounded text-zinc-900"
                        placeholder="0x..."
                        value={tokenAddress}
                        onChange={e => setTokenAddress(e.target.value)}
                    />
                </div>
                <div>
                    <label className="block mb-2 text-sm font-medium text-zinc-900">Recipients (comma or newline separated)</label>
                    <textarea
                        className="w-full p-2 border border-gray-300 rounded text-zinc-900"
                        rows={4}
                        placeholder="0x123..., 0x456..."
                        value={recipients}
                        onChange={e => setRecipients(e.target.value)}
                    />
                </div>
                <div>
                    <label className="block mb-2 text-sm font-medium text-zinc-900">Amounts (wei; comma or newline separated)</label>
                    <textarea
                        className="w-full p-2 border border-gray-300 rounded text-zinc-900"
                        rows={4}
                        placeholder="100, 200, 300..."
                        value={amounts}
                        onChange={e => setAmounts(e.target.value)}
                    />
                </div>

                <div className="bg-white border border-zinc-300 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-zinc-900 mb-3">Transaction Details</h3>
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-zinc-600">Token Name:</span>
                            <span className="font-mono text-zinc-900">{tokenData?.[1]?.result as string}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-zinc-600">Amount (wei):</span>
                            <span className="font-mono text-zinc-900">{total}</span>
                        </div>
                    </div>
                </div>

                <button
                    onClick={handleSubmit}
                    className="w-full py-3 text-white bg-blue-600 hover:bg-blue-700 font-semibold rounded-lg"
                    disabled={!hasEnoughTokens || isPending || isConfirming}
                >
                    {getButtonContent()}
                </button>
            </div>
        </div>
    )
}
