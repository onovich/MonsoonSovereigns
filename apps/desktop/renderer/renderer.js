const statusElement = globalThis.document.querySelector("#status");

function hasNodeGlobal(name) {
  return Object.prototype.hasOwnProperty.call(globalThis, name);
}

async function boot() {
  const forbiddenGlobals = ["require", "process", "Buffer"];
  const exposedNodeGlobals = forbiddenGlobals.filter((name) => hasNodeGlobal(name));

  if (exposedNodeGlobals.length > 0) {
    throw new Error(`Renderer Node globals exposed: ${exposedNodeGlobals.join(", ")}`);
  }

  const runtimeInfo = await globalThis.monsoonDesktop.getRuntimeInfo();
  if (statusElement !== null) {
    statusElement.textContent = `Secure desktop shell ready on ${runtimeInfo.platform}.`;
  }
}

boot().catch((error) => {
  if (statusElement !== null) {
    statusElement.textContent = "Desktop security boundary failed.";
  }

  console.error(error);
});
