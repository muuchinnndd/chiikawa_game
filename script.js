let player = {
    money: 100,
    stamina: 10,
    stress: 0,
    stressLimit: 10,
    state: "正常"
};

let grassCount = 0; // 記錄除草次數

function updateUI() {
    document.getElementById("money").textContent = player.money;
    document.getElementById("stamina").textContent = player.stamina;
    document.getElementById("stress").textContent = player.stress;
    
    if (player.stress >= player.stressLimit) {
        player.state = "奇美拉";
    } else {
        player.state = "正常";
    }

    document.getElementById("state").textContent = player.state;

    if (player.state === "奇美拉") {
        showChimeraOptions();
    }


}

// 顯示奇美拉選項
function showChimeraOptions() {
    logMessage("你壓力過大，變成了可怕的奇美拉！");
    showSection("chimeraActions"); // 顯示奇美拉選擇
}

// 玩家選擇待在城鎮
function stayInTown() {
    logMessage("你在城鎮暴走，破壞了建築物！被罰款 50 金幣！");
    player.money -= 50;
    if (player.money < 0) player.money = 0;
    goHome(); // 強制回家冷靜
    updateUI();
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
        logMessage("你回到家，強行冷靜了一段時間...");
        player.stress = 0;
        player.state = "正常";
        updateUI();
    } else {
        logMessage("你休息了一晚，恢復精神！");
        player.stress = Math.max(0, player.stress - 5);
    }
    updateUI();
}



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
}

// 地點移動
function goToPlaza() {
    showSection("plaza");
    logMessage("你來到了廣場，可以選擇要造訪的攤位。");
}

function goToShoppingStreet() {
    showSection("shoppingStreet");
    logMessage("你來到了商店街，這裡有各種商店可以光顧。");
}

function goHome() {
    showSection("home");
    logMessage("你回到了家。");
}

// 勞動攤位
function laborBooth() {
    showSection("laborBooth");
    logMessage("勞動鎧甲先生：想要除草還是討伐呢？");
}

/*-------------除草------------*/

// 除草功能
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
}

// 除草結束
function finishGrassCutting() {
    player.money += 50;
    logMessage("你完成了除草工作！獲得 50 金幣。");
    updateUI();
    showSection("laborBooth");
}

/*------------商店功能---------------*/

// 商店街 - 拉麵店
function ramenShop() {
    if (player.money >= 20) {
        player.money -= 20;
        player.stamina = Math.min(10, player.stamina + 5);
        logMessage("你吃了一碗美味的拉麵，體力恢復 5 點！");
    } else {
        logMessage("你的錢不夠吃拉麵！");
    }
    updateUI();
}

// 商店街 - 藥店
function pharmacy() {
    if (player.money >= 15) {
        player.money -= 15;
        player.stress = Math.max(0, player.stress - 5);
        logMessage("你購買並服用了藥物，壓力降低 5 點！");
    } else {
        logMessage("你的錢不夠買藥！");
    }
    updateUI();
}

// 休息回復
function rest() {
    player.stamina = 10;
    player.stress = Math.max(0, player.stress - 3);
    logMessage("你回家休息了一晚，體力回復，壓力減少 3。");
    updateUI();
}

updateUI();
