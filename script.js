const player = {
    level: 1, hp: 50, maxHp: 50, attack: 10, exp: 0, expToNext: 150,
    coins: 0, potions: 0
};

const enemies = [
    {name: "Jelly Slime 🟢", img: "https://www.shutterstock.com/shutterstock/photos/2216857803/display_1500/stock-vector-monster-slime-pixel-art-set-cute-colorful-blob-with-eyes-collection-kawaii-ooze-bit-sprite-2216857803.jpg", baseHp: 25, baseAtk: 6, exp: 20, coins: 12},
    {name: "Cheeky Mouse 🐭", img: "https://www.shutterstock.com/image-vector/cute-cartoon-mouse-big-pink-260nw-2701893289.jpg", baseHp: 35, baseAtk: 9, exp: 30, coins: 18},
    {name: "Playful Puppy 🐶", img: "https://images.stockcake.com/public/f/3/b/f3b08259-e9b7-471b-8e09-7546a0c90917/pixel-pup-routine-stockcake.jpg", baseHp: 45, baseAtk: 12, exp: 40, coins: 25},
    {name: "Mischievous Bird 🐦", img: "https://i.pinimg.com/originals/bc/dc/59/bcdc59fd0c9148f8ce5e233b5c970dac.gif", baseHp: 30, baseAtk: 15, exp: 35, coins: 20}
];

let currentEnemy = null;

function log(text) {
    const logEl = document.getElementById('log');
    logEl.innerHTML += '<br>' + text;
    logEl.scrollTop = logEl.scrollHeight;
}

function updateStats() {
    document.getElementById('level').textContent = player.level;
    document.getElementById('exp').textContent = player.exp;
    document.getElementById('expNext').textContent = player.expToNext;
    document.getElementById('hp').textContent = player.hp;
    document.getElementById('maxHp').textContent = player.maxHp;
    document.getElementById('attack').textContent = player.attack;
    document.getElementById('coins').textContent = player.coins;
    document.getElementById('potions').textContent = player.potions;
    document.getElementById('shopCoins').textContent = player.coins;
}

function adventure() {
    const type = Math.floor(Math.random() * 4);
    currentEnemy = {...enemies[type]};
    currentEnemy.hp = currentEnemy.baseHp + player.level * 12;
    currentEnemy.attack = currentEnemy.baseAtk + player.level * 4;
    currentEnemy.expReward = currentEnemy.exp + player.level * 8;
    currentEnemy.coinReward = currentEnemy.coins + player.level * 5;

    document.getElementById('mainMenu').classList.add('hidden');
    document.getElementById('shopMenu').classList.add('hidden');
    document.getElementById('battleScreen').classList.remove('hidden');

    document.getElementById('battleTitle').textContent = `🐱💥 A wild ${currentEnemy.name} appears! Nya~ 💥`;
    document.getElementById('enemyImg').src = currentEnemy.img;
    document.getElementById('enemyHp').textContent = currentEnemy.hp;
    document.getElementById('playerHpBattle').textContent = player.hp;
    document.getElementById('playerMaxHp').textContent = player.maxHp;
    document.getElementById('battlePotions').textContent = player.potions;

    log(`A wild ${currentEnemy.name} appeared!`);
}

function attack() {
    const damage = player.attack + Math.floor(Math.random() * 8);
    currentEnemy.hp -= damage;
    log(`You scratched with cute claws for ${damage} damage! Nya~ ✨`);

    if (currentEnemy.hp <= 0) {
        endBattle(true);
        return;
    }

    enemyTurn();
}

function enemyTurn() {
    const damage = currentEnemy.attack + Math.floor(Math.random() * 6);
    player.hp -= damage;
    log(`The ${currentEnemy.name} attacks for ${damage} damage! Ouch~ 😿`);
    document.getElementById('playerHpBattle').textContent = player.hp;

    if (player.hp <= 0) {
        gameOver();
        return;
    }
}

function usePotion() {
    if (player.potions > 0) {
        player.potions--;
        player.hp += 40;
        if (player.hp > player.maxHp) player.hp = player.maxHp;
        log('You drank a sparkling potion! +40 HP ~purr~ 🧪💕');
        updateStats();
        document.getElementById('playerHpBattle').textContent = player.hp;
        document.getElementById('battlePotions').textContent = player.potions;
        enemyTurn();
    } else {
        log('No potions left! Nya... 😿');
    }
}

function runAway() {
    if (Math.random() < 0.66) {
        log('You ran away safely! 🏃💨');
        endBattle(false);
    } else {
        log("Couldn't escape! The enemy attacks! 😾");
        enemyTurn();
    }
}

function endBattle(victory) {
    if (victory) {
        log(`You defeated the ${currentEnemy.name}! Victory purr~ 🎉`);
        player.exp += currentEnemy.expReward;
        player.coins += currentEnemy.coinReward;
        log(`+ ${currentEnemy.expReward} EXP + ${currentEnemy.coinReward} coins 💰`);

        while (player.exp >= player.expToNext) {
            player.level++;
            player.exp -= player.expToNext;
            player.expToNext += 30;
            player.maxHp += 10;
            player.hp = player.maxHp;
            player.attack += 3;
            log(`✨ LEVEL UP! ✨ Now level ${player.level}! Stronger and cuter~ 🐱💖`);
            if (player.level >= 99) {
                log(`🎉🎉 CONGRATULATIONS!!! You reached level 99! Ultimate kawaii cat hero! 🏆🐱✨`);
            }
        }
    }
    document.getElementById('battleScreen').classList.add('hidden');
    document.getElementById('mainMenu').classList.remove('hidden');
    updateStats();
}

function gameOver() {
    log('🐱💔 You fainted... Game Over nya... 💔');
    alert('Game Over! Resetting... 😿');
    player.level = 1; player.hp = player.maxHp = 50; player.attack = 10;
    player.exp = 0; player.expToNext = 150; player.coins = 0; player.potions = 0;
    endBattle(false);
}

function rest() {
    player.hp = player.maxHp;
    log('You curled up and napped~ Fully healed! Zzz... purr purr ♥');
    updateStats();
}

function openShop() {
    document.getElementById('mainMenu').classList.add('hidden');
    document.getElementById('shopMenu').classList.remove('hidden');
}

function closeShop() {
    document.getElementById('shopMenu').classList.add('hidden');
    document.getElementById('mainMenu').classList.remove('hidden');
}

function buyPotion() {
    if (player.coins >= 50) {
        player.coins -= 50; player.potions++;
        log('Bought a potion! Ready to heal~ ✨');
        updateStats();
    } else log('Not enough coins nya~ 😿');
}

function buyAttack() {
    if (player.coins >= 200) {
        player.coins -= 200; player.attack += 5;
        log('Your claws are super sharp now! +5 attack ⚔️');
        updateStats();
    } else log('Not enough coins nya~ 😿');
}

function buyHp() {
    if (player.coins >= 150) {
        player.coins -= 150; player.maxHp += 20; player.hp += 20;
        log('You feel stronger and cozier! +20 max HP ♥');
        updateStats();
    } else log('Not enough coins nya~ 😿');
}

updateStats();
log('Welcome! Choose an option to start nya~ 🐱💕');
