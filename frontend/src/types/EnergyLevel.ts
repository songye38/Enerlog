export type EnergyLevel = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;


export interface EnergyLevelInfo {
  level: EnergyLevel;
  title: string;
  emoji: string;
  description: string;
}


export const ENERGY_LEVELS: Record<EnergyLevel, EnergyLevelInfo> = {
  0: { level: 0, title: "완전 방전 ", emoji : '🫥', description: "몸이 완전히 굳은 느낌이고, 일어나는 것도 벅찰 정도로 에너지가 바닥났어." },
  1: { level: 1, title: "생존모드", emoji : '😶‍🌫️', description: "몸이 진짜 무겁고, 움직이는 것 자체가 너무 힘들어." },
  2: { level: 2, title: "무기력",  emoji : '🥀',description: "몸이 전반적으로 처져 있고 힘이 없지만, 움직이려면 할 수는 있는 정도야." },
  3: { level: 3, title: "느린 회복",  emoji : '🌫️',description: "몸이 조금씩 풀리긴 하는데 여전히 피곤해서 오래 집중하긴 어려워." },
  4: { level: 4, title: "기본 유지",  emoji : '🙂',description: "피곤하긴 한데 “아 오늘은 그래도 움직일 순 있겠다” 싶은 정도." },
  5: { level: 5, title: "안정 상태",  emoji : '🙂',description: "몸 상태는 무난하고 피로감도 좀 덜하며, 가벼운 활력과 집중력도 느껴져" },
  6: { level: 6, title: "활동 가능",  emoji : '🚶‍',description: "몸이 비교적 가볍고 상쾌하며, 가벼운 운동이나 외출도 괜찮아요." },
  7: { level: 7, title: "충전 완료",  emoji : '🌤️',description: "몸이 비교적 가볍고 상쾌하며, 가벼운 운동이나 외출도 괜찮아요." },
  8: { level: 8, title: "에너지 부스트",  emoji : '⚡️',description: "체력도 좋고, 활동량을 늘려도 무리 없이 버틸 수 있어" },
  9: { level: 9, title: "최고의 컨디션",  emoji : '🔥',description: "몸이 너무 가볍고, 움직일수록 에너지가 더 나는 느낌!" },
  10: { level: 10, title: "슈퍼모드",  emoji : '🌟',description: "거의 완벽에 가까운 몸 상태, 오래 집중하고 오래 움직여도 끄떡없어." }
};
