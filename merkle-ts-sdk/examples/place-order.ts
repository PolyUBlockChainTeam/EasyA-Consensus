import { MerkleClient } from "@/client";
import { MerkleClientConfig } from "@/client/config";
import { sleep } from "@/utils";
import {
  Account,
  Aptos,
  Ed25519PrivateKey,
  type InputEntryFunctionData,
  PrivateKey,
  PrivateKeyVariants,
} from "@aptos-labs/ts-sdk";

// 初始化 Merkle 和 Aptos 客户端
// 这里使用测试网配置，也可以使用 MerkleClientConfig.mainnet() 连接主网
const merkle = new MerkleClient(await MerkleClientConfig.testnet());
const aptos = new Aptos(merkle.config.aptosConfig);

// 初始化账户
// 注意：这里需要替换成你自己的私钥
const PRIVATE_KEY = "your-private-key";

// 从私钥创建 Aptos 账户对象
const account = Account.fromPrivateKey({
  privateKey: new Ed25519PrivateKey(
    PrivateKey.formatPrivateKey(PRIVATE_KEY, PrivateKeyVariants.Ed25519),
  ),
});

// 从测试网水龙头获取测试用 USDC
// 注意：这个功能只在测试网可用
const faucetPayload = merkle.payloads.testnetFaucetUSDC({
  amount: 10_000_000n, // 请求 10 USDC (USDC 有 6 位小数)
});
const faucetTx = await sendTransaction(faucetPayload);
console.log(`成功从测试网水龙头获取 USDC (交易哈希: ${faucetTx.hash})`);

// 查询账户 USDC 余额
const usdcBalance = await merkle.getUsdcBalance({
  accountAddress: account.accountAddress,
});

console.log(`USDC 余额: ${Number(usdcBalance) / 1e6} USDC`);

// 下单开仓
// 这里创建一个做多 BTC/USD 的市价单
const openPayload = merkle.payloads.placeMarketOrder({
  pair: "BTC_USD",                // 交易对
  userAddress: account.accountAddress,
  sizeDelta: 300_000_000n,       // 仓位大小：300 USDC
  collateralDelta: 5_000_000n,   // 保证金：5 USDC
  isLong: true,                   // true 表示做多，false 表示做空
  isIncrease: true,               // true 表示开仓，false 表示平仓
});

const openTx = await sendTransaction(openPayload);

console.log(`开仓订单提交成功 (交易哈希: ${openTx.hash})`);

// 等待 2 秒，确保订单已经执行
await sleep(2_000);

// 获取当前所有持仓，并找到 BTC/USD 的仓位
const positions = await merkle.getPositions({
  address: account.accountAddress.toString(),
});

console.log("当前持仓", positions);

const position = positions.find((position) =>
  position.pairType.endsWith("BTC_USD"),
);
if (!position) {
  throw new Error("未找到 BTC/USD 仓位");
}

// 平仓 - 关闭 BTC/USD 仓位
const closePayload = merkle.payloads.placeMarketOrder({
  pair: "BTC_USD",
  userAddress: account.accountAddress,
  sizeDelta: position.size,         // 平掉全部仓位
  collateralDelta: position.collateral, // 取回全部保证金
  isLong: position.isLong,          // 与开仓方向相同
  isIncrease: false,                // false 表示平仓
});

const closeTx = await sendTransaction(closePayload);

console.log(`平仓订单提交成功 (交易哈希: ${closeTx.hash})`);

// 工具函数：发送交易并等待确认
async function sendTransaction(payload: InputEntryFunctionData) {
  // 构建交易
  const transaction = await aptos.transaction.build.simple({
    sender: account.accountAddress,
    data: payload,
  });
  // 签名并提交交易
  const { hash } = await aptos.signAndSubmitTransaction({
    signer: account,
    transaction,
  });
  // 等待交易确认
  return await aptos.waitForTransaction({ transactionHash: hash });
}
