import React, { useState } from "react";
import "./index.css";

export default function LifeRPG() {
  // 초기 상태
  const [player, setPlayer] = useState({
    level: 1,
    xp: 0,
    gold: 0,
    stats: { strength: 5, intelligence: 5, luck: 5 },
    equipment: { weapon: null, shield: null, armor: null, ring: null },
    inventory: [],
  });

  const [quests, setQuests] = useState([
    { id: 1, name: "집 청소", difficulty: "하", description: "방 청소와 정리정돈" },
    { id: 2, name: "프로젝트 끝내기", difficulty: "상", description: "업무 마무리" },
    { id: 3, name: "미룬 업무 처리", difficulty: "중", description: "밀린 일 처리" },
  ]);

  // 장비 테이블
  const lootTable = {
    weapon: [
      { name: "낡은 검", rarity: "일반", chance: 50 },
      { name: "강철 검", rarity: "희귀", chance: 30 },
      { name: "마검", rarity: "영웅", chance: 15 },
      { name: "전설의 검", rarity: "전설", chance: 5 },
    ],
    shield: [
      { name: "나무 방패", rarity: "일반", chance: 50 },
      { name: "철 방패", rarity: "희귀", chance: 30 },
      { name: "마력 방패", rarity: "영웅", chance: 15 },
      { name: "용의 방패", rarity: "전설", chance: 5 },
    ],
    armor: [
      { name: "천 갑옷", rarity: "일반", chance: 50 },
      { name: "강철 갑옷", rarity: "희귀", chance: 30 },
      { name: "마력 갑옷", rarity: "영웅", chance: 15 },
      { name: "용비늘 갑옷", rarity: "전설", chance: 5 },
    ],
    ring: [
      { name: "구리 반지", rarity: "일반", chance: 50 },
      { name: "은 반지", rarity: "희귀", chance: 30 },
      { name: "마법 반지", rarity: "영웅", chance: 15 },
      { name: "전설의 반지", rarity: "전설", chance: 5 },
    ],
  };

  // 확률 선택
  function pickByChance(items) {
    const roll = Math.random() * 100;
    let acc = 0;
    for (const it of items) {
      acc += it.chance;
      if (roll <= acc) return it;
    }
    return items[0];
  }

  // 드랍 (10% 확률)
  function rollLoot() {
    if (Math.random() > 0.1) return null;
    const types = Object.keys(lootTable);
    const type = types[Math.floor(Math.random() * types.length)];
    const item = pickByChance(lootTable[type]);
    return { ...item, type };
  }

  // 퀘스트 완료
  const completeQuest = (quest) => {
    let gainedXP = 20;
    let gainedGold = 10;

    setPlayer((prev) => {
      let xp = prev.xp + gainedXP;
      let level = prev.level;
      if (xp >= 100) {
        xp -= 100;
        level += 1;
      }
      const loot = rollLoot();
      const newInventory = loot ? [...prev.inventory, loot] : prev.inventory;
      return {
        ...prev,
        xp,
        gold: prev.gold + gainedGold,
        level,
        inventory: newInventory,
      };
    });

    setQuests((prev) => prev.filter((q) => q.id !== quest.id));
  };

  // 장비 장착
  const equipItem = (item) => {
    setPlayer((prev) => ({
      ...prev,
      equipment: { ...prev.equipment, [item.type]: item },
      inventory: prev.inventory.filter((i) => i !== item),
    }));
  };

  const rarityClass = {
    일반: "rarity-common",
    희귀: "rarity-rare",
    영웅: "rarity-epic",
    전설: "rarity-legendary",
  };

  return (
    <div className="container">
      <h1>LR (Life Role-Playing Game)</h1>

      {/* 캐릭터 정보 */}
      <div className="stats">
        <p>레벨: {player.level} | 경험치: {player.xp}/100 | 골드: {player.gold}</p>
        <p>힘: {player.stats.strength} | 지능: {player.stats.intelligence} | 운: {player.stats.luck}</p>
      </div>

      {/* 장비창 */}
      <div className="equipment">
        <h2>🧍 장비창</h2>
        <div className="silhouette">
          <svg viewBox="0 0 200 350" width="150">
            <circle cx="100" cy="55" r="28" fill="#334155" />
            <rect x="70" y="85" width="60" height="90" rx="18" fill="#334155" />
            <rect x="55" y="175" width="90" height="130" rx="20" fill="#334155" />
          </svg>
          <div className="slot" style={{ top: 10, left: 0 }}>무기</div>
          <div className="slot" style={{ top: 10, right: 0 }}>방패</div>
          <div className="slot" style={{ top: 120, left: 50 }}>갑옷</div>
          <div className="slot" style={{ top: 300, left: 80 }}>반지</div>
        </div>
        <table>
          <thead>
            <tr><th>부위</th><th>아이템</th><th>등급</th></tr>
          </thead>
          <tbody>
            {["weapon","shield","armor","ring"].map(slot=>{
              const it = player.equipment[slot];
              return (
                <tr key={slot}>
                  <td>{slot}</td>
                  <td className={it ? rarityClass[it.rarity]:""}>{it ? it.name:"-"}</td>
                  <td>{it ? it.rarity:"-"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* 퀘스트 */}
      <div className="quests">
        <h2>📜 퀘스트</h2>
        <ul>
          {quests.map((q) => (
            <li key={q.id}>
              <div><b>{q.name}</b> ({q.difficulty}) - {q.description}</div>
              <button onClick={() => completeQuest(q)}>완료</button>
            </li>
          ))}
        </ul>
      </div>

      {/* 인벤토리 */}
      <div className="inventory">
        <h2>🎒 인벤토리</h2>
        <ul>
          {player.inventory.map((item, idx) => (
            <li key={idx} className={rarityClass[item.rarity]} onClick={() => equipItem(item)}>
              {item.name} ({item.rarity})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
