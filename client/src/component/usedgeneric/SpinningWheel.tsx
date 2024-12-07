import React, { useState } from "react";
import "../styles/SpinningWheel.scss";
import CenteredLayout from "../generic/CenteredLayout";

const rewards = ["$10 Gift Card", "Free Coffee", "Discount Code", "Extra Spin", "Mystery Box", "Try Again", "Free Car", "Free Dog"];

const SpinningWheel: React.FC = () => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedReward, setSelectedReward] = useState<string | null>(null);

  const spinWheel = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    setSelectedReward(null);

    const randomIndex = Math.floor(Math.random() * rewards.length);
    const spinDegrees = 360 * 5 + (randomIndex * (360 / rewards.length));

    const wheel = document.getElementById("wheel");
    if (wheel) {
      wheel.style.transition = "transform 3s ease-out";
      wheel.style.transform = `rotate(${spinDegrees}deg)`;
    }

    setTimeout(() => {
      setIsSpinning(false);
      setSelectedReward(rewards[randomIndex]);
      if (wheel) {
        wheel.style.transition = "none";
        wheel.style.transform = `rotate(${randomIndex * (360 / rewards.length)}deg)`;
      }
    }, 3000);
  };

  return (
    <CenteredLayout>
      <h1>Spin the Wheel!</h1>
      <div id="wheel" className="wheel">
        {rewards.map((reward, index) => (
          <div
            key={index}
            className="segment"
            style={{
              transform: `rotate(${(360 / rewards.length) * index}deg)`,
              background: index % 2 === 0 ? "#ffdd59" : "#ff6348",
            }}
          >
            <span>{reward}</span>
          </div>
        ))}
      </div>
      <button className="spin-button" onClick={spinWheel} disabled={isSpinning}>
        {isSpinning ? "Spinning..." : "Spin"}
      </button>
      {selectedReward && <p className="reward">You won: {selectedReward}!</p>}
    </CenteredLayout>
  );
};

export default SpinningWheel;
