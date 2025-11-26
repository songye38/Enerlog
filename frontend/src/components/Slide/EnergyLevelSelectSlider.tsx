import type { EnergyLevel } from "../../types/EnergyLevel";
import { useState } from "react";
import { ENERGY_LEVELS } from "../../types/EnergyLevel";
import checkIcon from '/icons/20X20/check.png';


interface EnergyLevelSelectSliderProps {
    onSelect: (level: EnergyLevel) => void;
}

export default function EnergyLevelSelectSlider({ onSelect }: EnergyLevelSelectSliderProps) {
    const [selectedLevel, setSelectedLevel] = useState<EnergyLevel | null>(null);

    function handleSelect(level: EnergyLevel) {
        setSelectedLevel(level);
        onSelect(level);         // 부모에게 선택값 전달
    }


    return (
        <div style={{
            padding: '32px 20px 36px 20px',
            background: 'white',
            boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
            borderRadius: 20,
            display: 'inline-flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 45,
        }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%' }}>
                {Object.values(ENERGY_LEVELS).map((levelInfo) => {
                    const isSelected = levelInfo.level === selectedLevel;

                    return (
                        <div
                            key={levelInfo.level}
                            onClick={() => handleSelect(levelInfo.level)}
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: 8,
                                padding: 12,
                                borderRadius: 6,
                                background: '#ECEFF9',
                                cursor: 'pointer',
                                outline: isSelected ? '2px #455CC5 solid' : 'none',
                                outlineOffset: isSelected ? '-2px' : '0',
                            }}
                        >
                            {isSelected && (
                                <img src={checkIcon} alt="Check Icon" style={{ width: 20, height: 20 }} />
                            )}
                            <div style={{
                                color: '#455CC5',
                                fontSize: 14,
                                fontWeight: 600,
                                fontFamily: 'Pretendard',
                                wordWrap: 'break-word',
                            }}>
                                {`에너지 레벨 ${levelInfo.level} : ${levelInfo.title}`}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
