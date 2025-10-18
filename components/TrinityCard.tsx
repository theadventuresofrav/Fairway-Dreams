import React from 'react';

interface TrinityCardProps {
  label: string;
  value: string;
  subValue?: string;
  gradient: string;
}

const TrinityCard: React.FC<TrinityCardProps> = ({ label, value, subValue, gradient }) => {
  return (
    <div className={`bg-gradient-to-br ${gradient} text-black p-6 sm:p-8 rounded-2xl text-center shadow-lg flex flex-col justify-center items-center h-full`}>
      <span className="text-5xl sm:text-6xl font-extrabold block">{value}</span>
      {subValue && <span className="text-lg font-semibold">{subValue}</span>}
      <span className="text-sm uppercase tracking-widest opacity-90 mt-2">{label}</span>
    </div>
  );
};

export default TrinityCard;