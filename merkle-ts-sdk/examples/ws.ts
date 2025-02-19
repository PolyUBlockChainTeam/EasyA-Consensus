import { MerkleClient } from "@/client";
import { MerkleClientConfig } from "@/client/config";

// 初始化 Merkle 客户端
// 这里使用测试网配置，也可以使用 MerkleClientConfig.mainnet() 连接主网
const merkle = new MerkleClient(await MerkleClientConfig.testnet());

// 连接 WebSocket API
const session = await merkle.connectWsApi();

console.log("WebSocket API 连接成功");

// 订阅 BTC/USD 的价格推送
// 可以订阅其他交易对，如 "ETH_USD"、"SOL_USD" 等
const priceFeed = session.subscribePriceFeed("BTC_USD");

console.log("已订阅价格推送");

// 通过异步迭代器接收实时价格更新
// price 对象包含最新的价格信息，如：
// - markPrice: 标记价格
// - indexPrice: 指数价格
// - timestamp: 时间戳
for await (const price of priceFeed) {
  console.log(price);
}
