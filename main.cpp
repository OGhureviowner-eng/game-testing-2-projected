#include <iostream>
#include <string>
#include <cstdlib>
#include <ctime>
#include <windows.h> // For Beep(), Sleep(), and system("cls") - Windows only
using namespace std;

struct Player {
    int level = 1;
    int hp = 50;
    int maxHp = 50;
    int attack = 10;
    int exp = 0;
    int expToNext = 150;  // Updated: higher starting EXP for balanced ~2 min per level
    int coins = 0;
    int potions = 0;
};

struct Enemy {
    string name;
    int hp;
    int attack;
    int expReward;
    int coinReward;
};

void beepAttack() { Beep(1000, 150); }
void beepCoin() { Beep(800, 100); Beep(1000, 100); Beep(1200, 200); }
void beepLevelUp() { Beep(1200, 200); Beep(1400, 200); Beep(1600, 400); }
void beepHurt() { Beep(400, 300); }
void beepGameOver() { Beep(200, 1000); }

void battle(Player& p, Enemy e) {
    system("cls");
    cout << "🐱💥 A wild " << e.name << " appears! Nya~ 💥\n\n";
    beepHurt();
    Sleep(1500);

    while (true) {
        system("cls");
        cout << " /\\_/\\ \n";
        cout << " ( =^.^= ) \n";
        cout << " (\")(\") ♥ Your HP: " << p.hp << "/" << p.maxHp << "\n\n";
        cout << " Enemy: " << e.name << " HP: " << e.hp << "\n\n";
        cout << "1. Claw Attack ⚔️\n";
        cout << "2. Use Potion 🧪 (" << p.potions << " left)\n";
        cout << "3. Run Away 🏃\n";
        cout << "Choice: ";
       
        int choice;
        cin >> choice;

        if (choice == 1) {
            int damage = p.attack + (rand() % 8);
            e.hp -= damage;
            cout << "\nYou scratched with cute claws for " << damage << " damage! Nya~ ✨\n";
            beepAttack();

            if (e.hp <= 0) {
                cout << "\nYou defeated the " << e.name << "! Victory purr~ 🎉\n";
                p.exp += e.expReward;
                p.coins += e.coinReward;
                cout << "+ " << e.expReward << " EXP + " << e.coinReward << " coins 💰\n";
                beepCoin();

                if (p.exp >= p.expToNext) {
                    p.level++;
                    p.exp -= p.expToNext;
                    p.expToNext += 30;  // Updated: slower EXP growth (~3.8 battles per level on average)
                    p.maxHp += 10;      // Updated: reduced from +12 for increasing difficulty
                    p.hp = p.maxHp;     // Full heal on level up
                    p.attack += 3;      // Updated: reduced from +4 for increasing difficulty
                    cout << "\n✨ LEVEL UP! ✨ Now level " << p.level << "! Stronger and cuter~ 🐱💖\n";
                    beepLevelUp();

                    if (p.level >= 99) {
                        cout << "\n🎉🎉 CONGRATULATIONS!!! 🎉🎉\n";
                        cout << "You reached level 99! You are the ultimate kawaii cat hero! 🏆🐱✨\n";
                        Sleep(5000);
                    }
                }
                Sleep(2000);
                return;
            }
        }
        else if (choice == 2) {
            if (p.potions > 0) {
                p.potions--;
                p.hp += 40;
                if (p.hp > p.maxHp) p.hp = p.maxHp;
                cout << "\nYou drank a sparkling potion! +40 HP ~purr~ 🧪💕\n";
            } else {
                cout << "\nNo potions left! Nya... 😿\n";
            }
        }
        else if (choice == 3) {
            if (rand() % 3 != 0) { // 66% chance to escape
                cout << "\nYou ran away safely! 🏃💨\n";
                Sleep(1500);
                return;
            } else {
                cout << "\nCouldn't escape! The enemy attacks! 😾\n";
            }
        }

        // Enemy turn
        if (e.hp > 0) {
            int damage = e.attack + (rand() % 6);
            p.hp -= damage;
            cout << "\nThe " << e.name << " attacks for " << damage << " damage! Ouch~ 😿\n";
            beepHurt();

            if (p.hp <= 0) {
                system("cls");
                cout << "🐱💔 You fainted... Game Over nya... 💔\n";
                beepGameOver();
                Sleep(3000);
                // Reset to start (harsh mode!)
                p.level = 1;
                p.hp = p.maxHp = 50;
                p.attack = 10;
                p.exp = 0;
                p.expToNext = 150;
                p.coins = 0;
                p.potions = 0;
                return;
            }
        }
        Sleep(1800);
    }
}

void shop(Player& p) {
    while (true) {
        system("cls");
        cout << "🐱🛍️ Welcome to the Kawaii Shop! 🛍️🐱\n";
        cout << "Your coins: " << p.coins << " 💰\n\n";
        cout << "1. Magic Potion 🧪 (50 coins) → heals 40 HP\n";
        cout << "2. Shiny Claw Sharpener ✂️ (200 coins) → +5 attack forever\n";
        cout << "3. Comfy Pillow 🛏️ (150 coins) → +20 max HP\n";
        cout << "4. Exit shop\n";
        cout << "Choice: ";
       
        int choice;
        cin >> choice;

        if (choice == 1 && p.coins >= 50) {
            p.coins -= 50;
            p.potions += 1;
            cout << "\nBought a potion! Ready to heal~ ✨\n";
            Sleep(1500);
        }
        else if (choice == 2 && p.coins >= 200) {
            p.coins -= 200;
            p.attack += 5;
            cout << "\nYour claws are super sharp now! +5 attack ⚔️\n";
            Sleep(1500);
        }
        else if (choice == 3 && p.coins >= 150) {
            p.coins -= 150;
            p.maxHp += 20;
            p.hp += 20;
            cout << "\nYou feel stronger and cozier! +20 max HP ♥\n";
            Sleep(1500);
        }
        else if (choice == 4) {
            break;
        }
        else {
            cout << "\nNot enough coins or invalid choice nya~ 😿\n";
            Sleep(1500);
        }
    }
}

int main() {
    srand(time(NULL));
    Player player;

    cout << "Starting Kawaii Cat RPG Adventure! 🐱💖\n";
    Sleep(2000);

    while (true) {
        system("cls");
        cout << " /\\_/\\ \n";
        cout << " ( =^.^= ) \n";
        cout << " (\")(\") ♥ Kawaii Cat RPG ~nya!\n\n";
        cout << "Level: " << player.level;
        if (player.level >= 99) cout << " (MAX!) 🎉";
        cout << " EXP: " << player.exp << "/" << player.expToNext << "\n";
        cout << "HP: " << player.hp << "/" << player.maxHp << " Attack: " << player.attack << "\n";
        cout << "Coins: " << player.coins << " 💰 Potions: " << player.potions << " 🧪\n\n";
        cout << "1. Go Adventure (fight enemies!)\n";
        cout << "2. Visit Kawaii Shop 🛍️\n";
        cout << "3. Rest at home (full heal) 🏠\n";
        cout << "4. Quit game\n";
        cout << "Choice: ";
       
        int choice;
        cin >> choice;

        if (choice == 1) {
            // Generate enemy based on player level
            int type = rand() % 4;
            Enemy e;
            if (type == 0) { e.name = "Jelly Slime 🟢"; e.hp = 25; e.attack = 6; e.expReward = 20; e.coinReward = 12; }
            else if (type == 1) { e.name = "Cheeky Mouse 🐭"; e.hp = 35; e.attack = 9; e.expReward = 30; e.coinReward = 18; }
            else if (type == 2) { e.name = "Playful Puppy 🐶"; e.hp = 45; e.attack = 12; e.expReward = 40; e.coinReward = 25; }
            else { e.name = "Mischievous Bird 🐦"; e.hp = 30; e.attack = 15; e.expReward = 35; e.coinReward = 20; }

            // Updated scaling: enemies get stronger faster for increasing difficulty
            e.hp += player.level * 12;
            e.attack += player.level * 4;
            e.expReward += player.level * 8;
            e.coinReward += player.level * 5;

            battle(player, e);
        }
        else if (choice == 2) {
            shop(player);
        }
        else if (choice == 3) {
            player.hp = player.maxHp;
            system("cls");
            cout << "You curled up and napped~ Fully healed! Zzz... purr purr ♥\n";
            Sleep(2000);
        }
        else if (choice == 4) {
            system("cls");
            cout << "Thanks for playing Kawaii Cat RPG! Come back soon nya~ 🐱💕\n";
            Sleep(2000);
            break;
        }
    }
    return 0;
}
