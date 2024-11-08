document.addEventListener("DOMContentLoaded", async () => {
    const checkTwitterButton = document.getElementById("check-twitter");
    const checkDexscreenerButton = document.getElementById("check-dexscreener");
    const openExtensionButton = document.getElementById("open-extension");
    const messageText = document.getElementById("message");

    async function updateButtonsVisibility() {
        try {
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            const isTwitter = tab.url && (tab.url.includes("twitter.com") || tab.url.includes("x.com"));
            const isDexscreener = tab.url && tab.url.includes("dexscreener.com");

            if (isTwitter || isDexscreener) {
                messageText.style.display = "none";
                checkTwitterButton.style.display = "none";
                checkDexscreenerButton.style.display = "none";
                openExtensionButton.style.display = "block";
            } else {
                messageText.textContent = "X-Alpha is live!! Head to your Twitter or Dexscreener to see Xalpha in action!";
                openExtensionButton.style.display = "none";
                checkTwitterButton.style.display = "block";
                checkDexscreenerButton.style.display = "block";
            }
        } catch (error) {
            console.error("Error updating buttons:", error);
        }
    }

    await updateButtonsVisibility();

    checkTwitterButton.addEventListener("click", () => {
        chrome.tabs.create({ url: "https://twitter.com" });
    });

    checkDexscreenerButton.addEventListener("click", () => {
        chrome.tabs.create({ url: "https://dexscreener.com" });
    });

    openExtensionButton.addEventListener("click", async () => {
        try {
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

            chrome.tabs.sendMessage(tab.id, { action: "toggleInsights" }, (response) => {
                if (chrome.runtime.lastError) {
                    console.error("Error sending message:", chrome.runtime.lastError);
                    return;
                }
                window.close();
            });
        } catch (error) {
            console.error("Error in open extension click handler:", error);
        }
    });
});