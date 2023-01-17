export function yieldAsync() {
  const channel = new MessageChannel();
  const p = new Promise((res) => { channel.port1.onmessage = res });
  channel.port2.postMessage('');
  return p;
}