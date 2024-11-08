const styles = `
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    #crypto-insights-container {
        position: fixed;
        top: 0;
        right: 0;
        width: 400px;
        height: 500px;
        background-color: #1b1b1d;
        border-radius: 20px;
        box-shadow: 0 0 10px rgba(255, 255, 255, 0.616);
        z-index: 9999;
        overflow: hidden;
        color: white;
        font-family: Arial, sans-serif;
        margin: 20px;
        display: flex;
        flex-direction: column;
    }

    .top-layer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: #1c1f24;
        padding: 10px 20px;
        flex-shrink: 0;
    }

    .logo {
        font-size: 24px;
        color: #2fa4ff;
    }

    .logo img {
        width: 88px;
        height: 28px;
    }

    .search-bar input {
        padding: 5px;
        border-radius: 5px;
        border: none;
        width: 100px;
        height: 20px;
        margin-right: 40px;
        margin-bottom: 8px;
        background-color: #999;
    }

    #close-insights {
        background-color: transparent;
        border: none;
        color: white;
        font-size: 25px;
        cursor: pointer;
    }

    .options {
        display: flex;
        justify-content: space-evenly;  // Changed from center to space-evenly
        background-color: #242629;
        padding: 10px 0;
        flex-shrink: 0;
    }

    .options div {
        margin: 0 10px;  // Reduced margin to accommodate three options
        cursor: pointer;
        color: white;
    }

    .options .active {
        color: #2fa4ff;
    }

    .options div:hover {
        color: #2fa4ff;
    }

    .content {
        flex-grow: 1;
        overflow: hidden;
    }

    #insights-list {
        list-style: none;
        padding: 0;
        height: 100%;
        overflow-y: auto;
        scrollbar-width: thin;
        scrollbar-color: #2fa4ff #1b1b1d;
    }

    #insights-list::-webkit-scrollbar {
        width: 8px;
    }

    #insights-list::-webkit-scrollbar-track {
        background: #1b1b1d;
    }

    #insights-list::-webkit-scrollbar-thumb {
        background-color: #2fa4ff;
        border-radius: 4px;
    }

    #insights-list li {
        padding: 10px 0;
        border-bottom: 1px solid #38444D;
    }

    .user-info {
        background-color: #2d2f33;
        padding: 20px;
        margin: 20px;
        border-radius: 10px;
        display: flex;
        flex-direction: column;
        align-items: center;
        position: relative;
    }

    .user-info img {
        width: 70px;
        height: 70px;
        border-radius: 50%;
        position: absolute;
        top: -18px;
        left: 50%;
        transform: translateX(-50%);
        border: 4px solid #2d2f33;
    }

    .user-info .text-section {
        text-align: center;
        margin-top: 45px;
        width: 100%;
    }

    .user-info .username {
        font-size: 18px;
        color: #888;
        margin-top: 8px;
    }

    .user-info .name {
        font-size: 24px;
        font-weight: bold;
        color: white;
    }

    .user-info .stats {
        font-size: 14px;
        color: #999;
        margin: 15px 0;
    }

    .user-info .followers {
        font-size: 18px;
        color: #999;
    }

    .user-info .followers .numbers1 {
        color: white;
        font-weight: bold;
    }

    .token-info {
        display: flex;
        align-items: center;
        padding: 15px;
        background-color: #2d2f33;
        margin: 10px 20px;
        border-radius: 10px;
        transition: transform 0.2s;
    }

    .token-info:hover {
        transform: translateX(5px);
        background-color: #363a3f;
    }

    .token-name {
        font-weight: bold;
        color: white;
        flex-grow: 1;
    }

    .token-mentions {
        color: #999;
        margin-left: auto;
        font-family: 'Courier New', monospace;
    }

    .token-icon {
        width: 24px;
        height: 24px;
        margin-right: 15px;
        border-radius: 50%;
        object-fit: cover;
    }

    .section-header {
        padding: 10px 20px;
        color: #2fa4ff;
        font-weight: bold;
        border-bottom: 1px solid #38444D;
        margin-top: 10px;
    }
`;

function injectCryptoInsights() {
    if (!document.getElementById('crypto-insights-container')) {
        const styleElement = document.createElement('style');
        styleElement.textContent = styles;
        document.head.appendChild(styleElement);

        const container = document.createElement('div');
        container.id = 'crypto-insights-container';
        container.innerHTML = `
            <div class="top-layer">
                <div class="logo">
                    <img src="${chrome.runtime.getURL('xalpha.png')}" alt="X Alpha Logo">
                </div>
                <div class="search-bar">
                    <input type="text" placeholder="Search">
                </div>
                <button id="close-insights">&times;</button>
            </div>
            <br>
            <div class="options">
                <div class="option" data-tab="trending">Trending</div>
                <div class="option" data-tab="market-cap">Top by Market Cap</div>
                <div class="option active" data-tab="user-insights">User Insights</div>
            </div>
            <div class="content" id="content">
                <div id="insights-list"></div>
            </div>
        `;
        document.body.appendChild(container);

        document.getElementById('close-insights').addEventListener('click', () => {
            container.remove();
        });

        const tabs = document.querySelectorAll('.option');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                fetchInsights(tab.dataset.tab);
            });
        });

        fetchInsights('user-insights'); // Load user insights by default
    }
}

async function fetchInsights(type) {
    try {
        const insightsList = document.getElementById("insights-list");
        insightsList.innerHTML = '';

        if (type === 'trending') {
            const response = await fetch("https://api.coingecko.com/api/v3/search/trending");
            const data = await response.json();

            // Add trending section header
            const trendingHeader = document.createElement("div");
            trendingHeader.className = "section-header";
            trendingHeader.textContent = "Trending Coins";
            insightsList.appendChild(trendingHeader);

            // Display trending coins
            data.coins.forEach((coin) => {
                const listItem = document.createElement("li");
                listItem.innerHTML = `
                    <div class="token-info">
                        <img src="${coin.item.small}" alt="${coin.item.name}" class="token-icon">
                        <span class="token-name">${coin.item.name}</span>
                        <span class="token-mentions">${coin.item.score} mentions</span>
                    </div>
                `;
                insightsList.appendChild(listItem);
            });
        } else if (type === 'market-cap') {
            const response = await fetch("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=false");
            const data = await response.json();

            // Add market cap section header
            const marketHeader = document.createElement("div");
            marketHeader.className = "section-header";
            marketHeader.textContent = "Top by Market Cap";
            insightsList.appendChild(marketHeader);

            // Display top market cap coins
            data.forEach((coin) => {
                const listItem = document.createElement("li");
                const priceChange = coin.price_change_percentage_24h;
                const priceChangeColor = priceChange >= 0 ? '#00ff00' : '#ff0000';
                
                listItem.innerHTML = `
                    <div class="token-info">
                        <img src="${coin.image}" alt="${coin.name}" class="token-icon">
                        <span class="token-name">${coin.name} (${coin.symbol.toUpperCase()})</span>
                        <div class="token-price-info">
                            <span class="token-price">$${coin.current_price.toLocaleString()}</span>
                            <span class="price-change" style="color: ${priceChangeColor}">
                                ${priceChange.toFixed(2)}%
                            </span>
                        </div>
                    </div>
                `;
                insightsList.appendChild(listItem);
            });

        } else if (type === 'user-insights') {
            const userInfo = {
                username: 'N/A',
                name: 'N/A',
                created: 'N/A',
                followers: 'N/A',
                following: 'N/A',
                profileImage: null
            };

            // Find profile image
            const imgElement = document.querySelector('div[data-testid="primaryColumn"] img[src*="profile_images"]');
            if (imgElement) {
                userInfo.profileImage = imgElement.src;
            }

            // Find username and name
            const nameElement = document.querySelector('div[data-testid="primaryColumn"] div[data-testid="UserName"]');
            if (nameElement) {
                const spans = nameElement.querySelectorAll('span');
                spans.forEach(span => {
                    const text = span.textContent;
                    if (text.startsWith('@')) {
                        userInfo.username = text;
                    } else if (text && !text.includes('@')) {
                        userInfo.name = text;
                    }
                });
            }

            // Find join date
            const allSpans = document.querySelectorAll('div[data-testid="primaryColumn"] span');
            for (const span of allSpans) {
                const text = span.textContent;
                if (text.includes('Joined')) {
                    userInfo.created = text.replace('Joined ', '');
                    break;
                }
            }

            // Get followers
            const followersLink = document.querySelector(`a[href*="/verified_followers"]`);
            if (followersLink) {
                const followersSpan = followersLink.querySelector('span span');
                if (followersSpan) {
                    userInfo.followers = followersSpan.textContent.trim();
                }
            }

            // Get following
            const userHandle = userInfo.username.replace('@', '');
            const followingLink = document.querySelector(`a[href*="/${userHandle}/following"]`);
            if (followingLink) {
                const followingSpan = followingLink.querySelector('span span');
                if (followingSpan) {
                    userInfo.following = followingSpan.textContent.trim();
                }
            }

            // Display user information
            if (userInfo.username !== 'N/A' || userInfo.name !== 'N/A') {
                const userInfoDiv = document.createElement("div");
                userInfoDiv.className = "user-info";
                userInfoDiv.innerHTML = `
                    <img src="${userInfo.profileImage || chrome.runtime.getURL('default-avatar.png')}" alt="User Image">
                    <div class="text-section">
                        <div class="name">${userInfo.name}</div>
                        <br>
                        <div class="username">${userInfo.username} | ${userInfo.created}</div>
                        <br>
                        <div class="stats">
                            Tweets - | $tags 24h - | New $tags 24h -
                        </div>
                        <br>
                        <div class="followers">
                            Followers <span class="numbers1">${userInfo.followers}</span> | Following <span class="numbers1">${userInfo.following}</span>
                        </div>
                    </div>
                `;
                insightsList.appendChild(userInfoDiv);
            } else {
                insightsList.innerHTML = "Failed to load user information.";
            }
        }
    } catch (error) {
        console.error(`Error fetching ${type}:`, error);
        const insightsList = document.getElementById("insights-list");
        insightsList.innerHTML = `Failed to load ${type}. ${error.message}`;
    }
}

function addCustomButton() {
    const moreButton = document.querySelector('button[data-testid="userActions"]');
    
    if (moreButton && !document.getElementById('customButton')) {
        const customButton = document.createElement('button');
        customButton.id = 'customButton';
        customButton.style.cssText = `
            display: inline-flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            border: 1px solid rgb(4, 152, 96);
            
            width: 40px;  
            height: 40px; 
            cursor: pointer;
            transition: background-color 0.2s;
            margin-right: 8px;
            margin-bottom: 10px;
            background: transparent; 
            overflow: hidden;  
        `; 

        // Create and style the image element
        const buttonImage = document.createElement('img');
        buttonImage.src = chrome.runtime.getURL('xalphalogo.png');
        buttonImage.alt = 'X Alpha Logo';
        buttonImage.style.cssText = `
            width: 30px;
            height: 30px;
            object-fit: contain;
        `;

        // Append image to the button
        customButton.appendChild(buttonImage);

        customButton.addEventListener('click', () => {
            const insightsContainer = document.getElementById('crypto-insights-container');
            if (!insightsContainer) {
                injectCryptoInsights();
            } else {
                insightsContainer.remove();
            }
        });

        moreButton.parentNode.insertBefore(customButton, moreButton);
    }
}

const observer = new MutationObserver(() => {
    addCustomButton();
});

observer.observe(document.body, { childList: true, subtree: true });

addCustomButton();

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "toggleInsights") {
        const container = document.getElementById('crypto-insights-container');
        if (container) {
            container.remove();
            sendResponse({status: "removed"});
        } else {
            injectCryptoInsights();
            sendResponse({status: "injected"});
        }
    }
    return true;
});