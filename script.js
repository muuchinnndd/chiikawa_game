let player = {
    money: 100,
    stamina: 10,
    stress: 9,
    stressLimit: 10,
    state: "正常",
    bagCapacity: 0,
    inventory: [],
    storedItems: [],
    equippedItems: [], // 勞動時裝備的道具
    hasShownChimeraMenu: false
};


let grassCount = 0; // 記錄除草次數

function updateUI() {
    document.getElementById("money").innerHTML = player.money;
    document.getElementById("stamina").innerText = player.stamina;
    document.getElementById("stress").innerText = player.stress;
    document.getElementById("stressLimit").innerText = player.stressLimit;
    document.getElementById("state").innerText = player.state;
    document.getElementById("location").innerText = player.location;
    document.getElementById("bagCapacity").innerText = player.bagCapacity;
  
    const inventoryList = document.getElementById("inventoryList");
    inventoryList.innerHTML = "";
    player.inventory.forEach((item, index) => {
      const li = document.createElement("li");
      li.textContent = `${index + 1}. ${item}`;
      inventoryList.appendChild(li);
    });

    if (player.stress >= player.stressLimit) {
        player.state = "奇美拉";
    } 
    else if (player.stress <= 0) {
        player.state = "正常";
    }

    document.getElementById("state").textContent = player.state;


}


  
window.onload = function () {
    updateUI();
    console.log(document.getElementById("money")); // 應該是 <span> 元素
  };

/*---------------UI--------------*/

// 切換顯示區塊
function toggleSection(id) {
    const el = document.getElementById(id);
    el.style.display = (el.style.display === "none") ? "block" : "none";
}

// 確保程式碼在頁面加載後執行
document.addEventListener("DOMContentLoaded", function () {
    if (window.innerWidth < 600) {
      document.body.classList.add("mobile-mode"); // 加上手機模式的 class
    }
  });

/*-----------奇美拉--------------*/

// 判斷是否為奇美拉狀態
function isChimera() {
    return player.state === "奇美拉";
}

// 顯示奇美拉選項
function checkChimeraOptions() {
    if (isChimera() && !player.hasShownChimeraMenu) {
        logMessage("你壓力過大，變成了可怕的奇美拉！");
        player.hasShownChimeraMenu = true;
        showSection("chimeraActions"); // 顯示奇美拉選擇
    }

}

function enterTownFromForest() {
    if (player.state === "奇美拉") {
        logMessage("你拖著可怕的身體進入了城鎮，造成一陣騷動...");
        const fine = 50;
        if (player.money >= fine) {
            player.money -= fine;
            addLog("你被罰款了 💸 " + fine + " 金幣！");
        } else {
            addLog("你沒錢支付罰款，被記了一筆欠債（尚未實作）！");
        }
        moveTo("plaza"); // 回到廣場
    }
}

// 玩家選擇逃到森林
function fleeToForest() {
    logMessage("你逃到了無人森林，等待自己冷靜下來...");
    let turns = 3;
    let interval = setInterval(() => {
        turns--;
        player.stress -= 4;
        if (player.stress <= 0) {
            player.stress = 0;
            clearInterval(interval);
            logMessage("你的壓力降下來了，恢復成正常狀態！");
            player.state = "正常";
            player.hasShownChimeraMenu = false;
            goHome();
            updateUI();
        } else {
            logMessage(`你還需要等待 ${turns} 回合...`);
        }
        updateUI();
    }, 1000);
}

// 玩家回家休息
function rest() {
    if (player.state === "奇美拉") {
        logMessage("你忍著不適，強行冷靜了一段時間...");
        player.stress -= 3;

        if (player.stress <= 0)
        {
            player.stress = 0;
            player.state = "正常";
            player.hasShownChimeraMenu = false;
            logMessage("經過一段時間的冷靜，你終於恢復正常狀態...")
            
            
        }
        
        
    } else {
        logMessage("你休息了一晚，恢復精神！");
        player.stamina = 10;
        player.stress = Math.max(0, player.stress - 3);
    }
    updateUI();
}

/*-------------log-------------*/

// 記錄最新事件
function logMessage(message) {
    document.getElementById("latestEvent").textContent = message; // 最新事件區
    let log = document.getElementById("log");
    let entry = document.createElement("p");
    entry.textContent = message;
    log.appendChild(entry);
    log.scrollTop = log.scrollHeight;
}

// 切換日誌展開/收合
function toggleLog() {
    let log = document.getElementById("log");
    log.style.display = (log.style.display === "none" || log.style.display === "") ? "block" : "none";
}

// 切換畫面顯示
function showSection(section) {
    document.querySelectorAll(".section").forEach(sec => sec.style.display = "none");
    document.getElementById(section).style.display = "block";

    updateUI();
    checkChimeraOptions();
}


/*-------------base--------------*/

// 購買道具
function buyItem(itemName, cost) {
    if (player.money >= cost) {
        player.money -= cost;
        player.inventory.push(itemName);
        logMessage(`你購買了一個 ${itemName}，已加入道具欄。`);
        updateUI();
    } else {
        logMessage("金錢不足，無法購買。");
    }
}

// 使用道具
function useItem(itemName) {
    let index = player.inventory.indexOf(itemName);
    if (index !== -1) {
        const shouldConsume = items[itemName].effect(); // 執行效果
        if (shouldConsume) {
            player.inventory.splice(index, 1); // 移除已使用的道具
        }
        updateUI();
    } else {
        logMessage(`你沒有 ${itemName} 可以使用。`);
    }
}

// 移動
function moveTo(location) {
    
    // 特殊場景觸發
    if (player.state === "奇美拉") {

        // 30% 失敗機率
        if (Math.random() < 0.3) {
            const fine = 50;
            player.money = Math.max(0, player.money - fine);
            logMessage(`⚠️ 你失控破壞了設施，被罰金 ${fine} 元！`);
            updateUI();
            return;
        }
        
        if (location === "plaza") {
            logMessage("廣場上的鎧甲先生們望著你警戒不安...");
        } else if (location === "shoppingStreet") {
            logMessage("商店街陷入恐慌，鎧甲先生們嚴陣以待！");
        }

        showSection(location);
        updateUI(); 
        return;
    }

    switch(location) {
        case "plaza" :
            logMessage("你來到了廣場，可以選擇要造訪的攤位。");
            break;

        case "shoppingStreet" :
            logMessage("你來到了商店街，這裡有各種商店可以光顧。");
            break;

        default:
            logMessage("");

    };

    player.location = location;
    
    showSection(location);
    updateUI();
    
    
}

/*--------------location-------------*/

// 地點移動
function goToPlaza() {
    // showSection("plaza");
    logMessage("你來到了廣場，可以選擇要造訪的攤位。");
}

function goToShoppingStreet() {
    // showSection("shoppingStreet");
    logMessage("你來到了商店街，這裡有各種商店可以光顧。");
}

function goHome() {
    if (player.state === "奇美拉") {
        logMessage("你艱難地回到家，靜靜地躲起來等待恢復...");
        
    } else {
        logMessage("你回到了家。");
    }
    
    showSection("home");
    
}

// 勞動攤位
function laborBooth() {
    showSection("laborBooth");
    // logMessage("勞動鎧甲先生：想要除草還是討伐呢？");
    talkToNpc("勞動鎧甲先生");
}

function talkToBagNPC() {
    showSection("bag-menu");
    document.getElementById("plaza").classList.add("hidden");
    document.getElementById("bag-menu").classList.remove("hidden");
    talkToNpc("背包鎧甲先生");
    // logMessage("背包鎧甲先生：「你想買個包包嗎？」");
}

function buyBag(capacity, price) {
    if (player.money >= price) {
        player.money -= price;
        player.bagCapacity = capacity;
        logMessage(`你買了一個容量為 ${capacity} 的背包！`);
        updateUI();
    } 
    
    else {
        logMessage("金錢不足，無法購買背包。");
    }
}

function talkToNpc(npc) {
    const dialogue = interactWithNPC(npc);
    logMessage(`${npc}：「${dialogue}」`);
}

function interactWithNPC(npc) {

    if (player.state === "奇美拉") {
        switch(npc) {
            case "勞動鎧甲先生":
                return "你現在的狀態不適合工作，先冷靜一下吧！";
                
            case "背包鎧甲先生":
                return "哇啊！別靠近我的攤位！";
                
            case "拉麵鎧甲先生":
                return "這種狀態你也想吃拉麵？";
                
            case "商店鎧甲先生":
                return "先冷靜一下，別亂跑。";
                
            default:
                message = "⚠️ 狀態異常，無法對話。";
        }
    } else {
        switch (npc) {
            case "勞動鎧甲先生":
                return "今天也要努力勞動喔！想做什麼工作？";
            case "背包鎧甲先生":
                return "需要新的包包嗎？現在大中小都有特價！";
            case "拉麵鎧甲先生":
                return "來碗熱騰騰的拉麵吧！我們家的叉燒是招牌喔！";
            case "商店鎧甲先生":
                return "歡迎光臨～想看看藥品還是其他用品呢？";
            default:
                return "你好呀，小可愛！";
        }
    }

    logMessage(message);
}

/*------------商店功能---------------*/


// 商店街 - 藥店
function pharmacy() {
    // logMessage("💬 商店鎧甲先生：你要買藥嗎？");
    talkToNpc("商店鎧甲先生");
    document.getElementById("free-section").innerHTML = "";
    createChoiceButton("購買減壓藥", () => {
        buyItem("減壓藥", 20);
    });

    createChoiceButton("返回商店街", () =>{
        moveTo("shoppingStreet");
    });

    showSection("free-section");
}

// 商店街 - 拉麵店
function ramenShop() {
    talkToNpc("拉麵鎧甲先生");
    document.getElementById("free-section").innerHTML = "";
    createChoiceButton("食用拉麵", () => {
        if (player.money >= 20) {
            player.money -= 20;
            player.stamina = Math.min(10, player.stamina + 5);
            logMessage("你吃了一碗美味的拉麵，體力恢復 5 點！");
        } else {
            logMessage("你的錢不夠吃拉麵！");
        }
        updateUI();
    });

    createChoiceButton("返回商店街", () =>{
        moveTo("shoppingStreet");
    });

    showSection("free-section");
    
}



updateUI();


/*-------------除草------------*/

// **檢查包包狀況**
function checkBagBeforeWeeding() {
    if (player.bagCapacity === 0) {
            
        document.getElementById("laborBooth").classList.add("hidden");
        document.getElementById("free-section").innerHTML = "";
        logMessage("💬 勞動鎧甲先生：「你沒有包包，這樣可能沒辦法帶走找到的東西哦！」");
        
        createChoiceButton("還是要繼續工作", startGrassCutting);
        createChoiceButton("去買個包包", () => {
            
            logMessage("你決定先去找背包鎧甲先生買包包。");
            document.getElementById("free-section").innerHTML = "";
            createChoiceButton("返回廣場", () => {
                moveTo("plaza");
            });
            
            });
        showSection("free-section");
        return;
    }

    if (player.inventory.length >= player.bagCapacity) {
        logMessage("💬 勞動鎧甲先生：「你的背包已經滿了，找到的物品會存放在這裡哦！」");
    }

    startGrassCutting();
}

// **建立選項按鈕**
function createChoiceButton(text, action) {
    let button = document.createElement("button");
    button.innerText = text;
    button.onclick = () => {
        action();
        // button.remove();
    };
    document.getElementById("free-section").appendChild(button);
}
// 除草
function startGrassCutting() {

    showSection("grassCutting");
    grassCount = 0;
    player.stamina -= 3;
    updateUI();
    logMessage("開始除草！選擇一個草叢來清除。");
    generateGrass();
    
    
}

// 產生草叢
function generateGrass() {
    let grassTypes = ["普通的草叢", "高大的草叢", "缺乏養分的草叢"];
    let grassArea = document.getElementById("grassArea");
    grassArea.innerHTML = "";
    
    for (let i = 0; i < 3; i++) {
        let grass = document.createElement("button");
        let type = grassTypes[Math.floor(Math.random() * grassTypes.length)];
        grass.textContent = type;
        grass.onclick = () => cutGrass(type);
        grassArea.appendChild(grass);
    }
}

// 清除草叢
function cutGrass(type) {
    let stressChance = 0.2; // 20% 機率遇到危險雜草
    let reward = 10; // 每次基礎獎勵金額
    let stressIncrease = 3;

    if (Math.random() < stressChance) {
        player.stress += stressIncrease;
        logMessage(`你清除了${type}，但發現了危險的雜草！壓力+${stressIncrease}`);
    } else {
        logMessage(`你成功清除了${type}，繼續努力！`);
    }

    grassCount++;
    if (grassCount >= 5) {
        finishGrassCutting();
    } else {
        generateGrass();
    }

    updateUI();
    checkChimeraOptions();
}

// 除草結束
function finishGrassCutting() {
    player.money += 50;
    logMessage("你完成了除草工作！獲得 50 金幣。");
    updateUI();
    askRetrieveItems();
}

function askRetrieveItems() {
    if (player.storedItems.length > 0) {
        logMessage("勞動鎧甲先生：「你有物品存放在我這裡，要領回嗎？」");
        let retrieveButton = document.createElement("button");
        retrieveButton.innerText = "取回物品";
        retrieveButton.onclick = retrieveItems;
        document.getElementById("game-container").appendChild(retrieveButton);
    } else {
        showSection("laborBooth");
    }
}

// 取回道具機制
function retrieveItems() {
    let retrieved = [];
    while (player.inventory.length < player.bagCapacity && player.storedItems.length > 0) {
        retrieved.push(player.storedItems.shift());
    }
    player.inventory.push(...retrieved);
    
    logMessage(`你取回了：${retrieved.map(item => item.name).join(", ")}`);
    
    if (player.storedItems.length > 0) {
        logMessage("你的背包還是放不下部分物品，這些物品仍然存放在勞動鎧甲先生那裡。");
    }
    
    updateUI();
    showSection("laborBooth");
}




/*-----------database------------*/


const itemList = ["藥草", "小麵包", "奇怪的種子"]; // 可獲得的道具種類

const items = {
    "減壓藥": {
        name: "減壓藥",
        type: "consumable",
        effect: () => {
            if (player.stress > 0) {
                player.stress -= 3;
                if (player.stress < 0) player.stress = 0;
                updateUI();
                logMessage("你服用了減壓藥，壓力值降低了！");
                return true;
            } else {
                logMessage("你目前沒有壓力，不需要服用減壓藥。");
                return false;
            }
        }
    }
};
