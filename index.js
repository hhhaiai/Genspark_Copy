// 统一的复制处理函数
async function handleCopy(text, button) {
  try {
    await navigator.clipboard.writeText(text);
    button.textContent = "Copied!";
    setTimeout(() => button.textContent = "Copy", 2000);
  } catch (err) {
    console.error("Failed to copy:", err);
    button.textContent = "Error!";
    setTimeout(() => button.textContent = "Copy", 2000);
  }
}

// 添加代码复制按钮
function addCodeCopyButtons() {
  const codeBlocks = document.querySelectorAll(
    'pre code.hljs[class*="language-"]:not([data-has-copy-code-button])'
  );

  codeBlocks.forEach((block) => {
    const container = document.createElement("div");
    container.className = "copy-code-button-container";

    const button = document.createElement("button");
    button.className = "copy-code-button";
    button.textContent = "Copy";

    button.addEventListener("click", async () => {
      const clone = block.cloneNode(true);
      clone.querySelectorAll('[class*="copy-"]').forEach(e => e.remove());
      await handleCopy(clone.innerText, button);
    });

    container.appendChild(button);
    block.parentNode.insertBefore(container, block);
    block.setAttribute("data-has-copy-code-button", "true");
  });
}

// 添加回复复制按钮
function addBubbleCopyButton() {
  const bubbles = document.querySelectorAll(
    '.bubble:not([data-has-bubble-copy-button])'
  );

  bubbles.forEach(bubble => {
    const content = bubble.querySelector('.desc .content');
    if (!content) return;

    const container = document.createElement('div');
    container.className = 'bubble-copy-button-container';

    const button = document.createElement('button');
    button.className = 'bubble-copy-button';
    button.textContent = "Copy";

    button.addEventListener("click", async () => {
      const clone = content.cloneNode(true);
      clone.querySelectorAll('[class*="copy-"]').forEach(e => e.remove());
      await handleCopy(clone.innerText, button);
    });

    container.appendChild(button);
    bubble.appendChild(container);
    bubble.setAttribute('data-has-bubble-copy-button', 'true');
  });
}

// 防抖函数
const debounce = (func, wait = 250) => {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
};

// 初始化函数
function initializeCopyButtons() {
  addCodeCopyButtons();
  addBubbleCopyButton();
}

// 初始化并设置观察者
const debouncedInit = debounce(initializeCopyButtons, 500);
debouncedInit();

const observer = new MutationObserver(debouncedInit);
observer.observe(document.body, {
  childList: true,
  subtree: true
});
