import React, { useState } from 'react';
import { CareerExperience, CareerSwitchExperienceData, NomadDestination } from '../../types';
import { soundEngine } from '../../services/soundEngine';
import { Icon } from '../common/Icon';
import { Card } from '../common/Card';

interface Props {
  experience: CareerExperience;
  onUpdateExperience: (updated: CareerExperience) => void;
}

const DEFAULT_DESTINATIONS: NomadDestination[] = [
  { city: 'Bali / Canggu', country: 'Indonesia', avgCost: 2200, taxAdvantage: 'Remote Worker KITAS', timezone: 'WITA', offset: 8 },
  { city: 'Lisbon / Algarve', country: 'Portugal', avgCost: 3400, taxAdvantage: 'D8 Digital Nomad Visa', timezone: 'WET', offset: 0 },
  { city: 'Tokyo / Kyoto', country: 'Japan', avgCost: 3100, taxAdvantage: '6-Month Digital Nomad Visa', timezone: 'JST', offset: 9 },
  { city: 'Chiang Mai', country: 'Thailand', avgCost: 1650, taxAdvantage: 'Long-Term Resident LTR', timezone: 'ICT', offset: 7 },
  { city: 'Mexico City', country: 'Mexico', avgCost: 2500, taxAdvantage: 'Temporary Resident Visa', timezone: 'CST', offset: -6 },
];

export const NomadTimezoneBudget: React.FC<Props> = ({ experience, onUpdateExperience }) => {
  const switchData: CareerSwitchExperienceData = experience.specialized.type === 'career-switch'
    ? experience.specialized.data
    : {
        sourceDomain: 'Corporate Lead',
        targetDomain: 'Fractional CTO',
        targetCity: 'Bali & Lisbon',
        destinations: DEFAULT_DESTINATIONS,
        selectedCityIndex: 0,
        monthlyRemoteRevenue: 18500,
        taxRatePct: 18,
        myWorkStartHour: 8,
        myWorkDuration: 6,
      };

  const destinations = switchData.destinations || DEFAULT_DESTINATIONS;
  const [selectedDest, setSelectedDest] = useState<NomadDestination>(
    destinations[switchData.selectedCityIndex] || destinations[0]
  );
  const [monthlyGrossIncome, setMonthlyGrossIncome] = useState(switchData.monthlyRemoteRevenue || 18500);
  const [taxRatePct, setTaxRatePct] = useState(switchData.taxRatePct || 18);
  const [myStartHour, setMyStartHour] = useState(switchData.myWorkStartHour || 8);
  const [myWorkDuration, setMyWorkDuration] = useState(switchData.myWorkDuration || 6);

  // Financial calculations
  const netIncome = Math.round(monthlyGrossIncome * (1 - taxRatePct / 100));
  const monthlySavings = netIncome - selectedDest.avgCost;
  const savingsRate = Math.round((monthlySavings / netIncome) * 100);
  const freedomMultiplier = (netIncome / selectedDest.avgCost).toFixed(1);

  const hours24 = Array.from({ length: 24 }, (_, i) => i);

  return (
    <div className="space-y-6">
      {/* Top Value Banner */}
      <div className="p-4 rounded-2xl bg-teal-950/30 border border-teal-500/30 flex items-center justify-between text-xs text-teal-300">
        <div className="flex items-center gap-2">
          <Icon name="Globe" className="w-4 h-4 text-teal-400" />
          <span>
            Geo-Arbitrage Multiplier: <strong>{freedomMultiplier}x Freedom Ratio</strong>. Every 1 month of work funds {freedomMultiplier} months of life in {selectedDest.city}.
          </span>
        </div>
        <span className="font-semibold uppercase tracking-wider text-emerald-400 font-mono">
          SAVINGS RATE: {savingsRate}%
        </span>
      </div>

      {/* Section 1: Timezone Overlap Visualizer */}
      <Card className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Icon name="Clock" className="w-4 h-4 text-teal-400" />
            <span>Async Daylight & Client Overlap Visualizer (24-Hour Matrix)</span>
          </h3>
          <span className="text-xs text-zinc-400">Green = High Focus Overlap</span>
        </div>

        <div className="space-y-3">
          {/* Destination / Nomad TZ */}
          <div>
            <div className="flex justify-between text-xs text-zinc-300 mb-1.5 font-mono">
              <span className="flex items-center gap-1.5 text-teal-300 font-semibold">
                <Icon name="MapPin" className="w-3.5 h-3.5" />
                {selectedDest.city} (UTC {selectedDest.offset >= 0 ? `+${selectedDest.offset}` : selectedDest.offset})
              </span>
              <span>My Working Window: {myStartHour}:00 - {myStartHour + myWorkDuration}:00</span>
            </div>
            <div className="grid grid-cols-24 gap-1 h-7">
              {hours24.map((h) => {
                const isWorking = h >= myStartHour && h < myStartHour + myWorkDuration;
                const isSleep = h >= 23 || h < 7;
                return (
                  <div
                    key={h}
                    title={`${h}:00 - ${isWorking ? 'Deep Work' : isSleep ? 'Rest/Sleep' : 'Leisure'}`}
                    className={`rounded text-[9px] flex items-center justify-center font-mono font-bold transition-all ${
                      isWorking
                        ? 'bg-emerald-500 text-black shadow-sm'
                        : isSleep
                        ? 'bg-zinc-900 text-zinc-600 border border-zinc-800'
                        : 'bg-zinc-800 text-zinc-400'
                    }`}
                  >
                    {h}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Client TZ */}
          <div>
            <div className="flex justify-between text-xs text-zinc-400 mb-1.5 font-mono">
              <span className="flex items-center gap-1.5">
                <Icon name="Globe" className="w-3.5 h-3.5" />
                HQ / Client Base (San Francisco PST, UTC -8)
              </span>
              <span>Client Standard Hours: 09:00 - 17:00 PST</span>
            </div>
            <div className="grid grid-cols-24 gap-1 h-7">
              {hours24.map((h) => {
                const diff = -8 - selectedDest.offset;
                const clientHour = (h + diff + 48) % 24;
                const clientWorking = clientHour >= 9 && clientHour < 17;
                const isMyWorking = h >= myStartHour && h < myStartHour + myWorkDuration;
                const isOverlap = clientWorking && isMyWorking;

                return (
                  <div
                    key={h}
                    title={`Nomad ${h}:00 = Client ${clientHour}:00 ${isOverlap ? '(SYNCHRONOUS OVERLAP)' : ''}`}
                    className={`rounded text-[9px] flex items-center justify-center font-mono font-bold transition-all ${
                      isOverlap
                        ? 'bg-teal-400 text-black animate-pulse'
                        : clientWorking
                        ? 'bg-blue-950/60 border border-blue-500/30 text-blue-300'
                        : 'bg-zinc-900 text-zinc-700'
                    }`}
                  >
                    {clientHour}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Work Hour Slider */}
        <div className="pt-2 flex items-center gap-4 text-xs">
          <span className="text-zinc-400 shrink-0">Adjust My Work Start Hour:</span>
          <input
            type="range"
            min="6"
            max="16"
            value={myStartHour}
            onChange={(e) => setMyStartHour(Number(e.target.value))}
            className="w-48 accent-teal-500 cursor-pointer"
          />
          <span className="font-mono text-teal-300 font-bold">{myStartHour}:00</span>
        </div>
      </Card>

      {/* Section 2: Destination & Financial Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Icon name="MapPin" className="w-4 h-4 text-teal-400" />
            <span>Select Nomad Hub Target</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {destinations.map((dest) => {
              const isSelected = dest.city === selectedDest.city;
              return (
                <button
                  key={dest.city}
                  type="button"
                  onClick={() => {
                    soundEngine.playKeyClick();
                    setSelectedDest(dest);
                  }}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    isSelected
                      ? 'bg-teal-950/40 border-teal-500 text-white shadow-md'
                      : 'bg-zinc-900/40 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                  }`}
                >
                  <div className="font-bold text-xs text-zinc-100">{dest.city}</div>
                  <div className="text-[11px] text-zinc-400">{dest.country}</div>
                  <div className="text-xs font-mono text-teal-400 font-semibold mt-1">
                    ${dest.avgCost.toLocaleString()} /mo cost
                  </div>
                </button>
              );
            })}
          </div>

          <div className="space-y-3 pt-2">
            <div>
              <div className="flex justify-between text-xs text-zinc-300 mb-1">
                <span>Monthly Remote Client Billings</span>
                <span className="font-mono text-emerald-400">${monthlyGrossIncome.toLocaleString()} /mo</span>
              </div>
              <input
                type="range"
                min="8000"
                max="30000"
                step="500"
                value={monthlyGrossIncome}
                onChange={(e) => setMonthlyGrossIncome(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-zinc-300 mb-1">
                <span>Effective Structured Tax Rate</span>
                <span className="font-mono text-zinc-400">
                  {taxRatePct}% (${Math.round((monthlyGrossIncome * taxRatePct) / 100).toLocaleString()}/mo)
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="35"
                step="1"
                value={taxRatePct}
                onChange={(e) => setTaxRatePct(Number(e.target.value))}
                className="w-full accent-zinc-500 cursor-pointer"
              />
            </div>
          </div>
        </Card>

        {/* Wealth Acceleration Card */}
        <Card className="flex flex-col justify-between border-teal-500/30">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs uppercase font-semibold text-teal-400">Net Monthly Freedom Surplus</span>
              <Icon name="Sparkles" className="w-4 h-4 text-teal-400" />
            </div>

            <div className="text-4xl font-extrabold text-white font-mono mb-2">
              +${monthlySavings.toLocaleString()}
              <span className="text-xs font-normal text-zinc-400 ml-2">/ month saved</span>
            </div>

            <div className="space-y-2.5 text-xs mt-4">
              <div className="flex justify-between py-1.5 border-b border-zinc-800">
                <span className="text-zinc-400">Net Take-Home Income:</span>
                <span className="font-mono text-white">${netIncome.toLocaleString()} /mo</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-zinc-800">
                <span className="text-zinc-400">{selectedDest.city} Living Cost:</span>
                <span className="font-mono text-red-400">-${selectedDest.avgCost.toLocaleString()} /mo</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-zinc-800">
                <span className="text-zinc-400">Annual Net Capital Accumulation:</span>
                <span className="font-mono text-emerald-400 font-bold">+${(monthlySavings * 12).toLocaleString()} /yr</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-zinc-800">
                <span className="text-zinc-400">Visa / Tax Pathway:</span>
                <span className="font-mono text-teal-300">{selectedDest.taxAdvantage}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 rounded-xl bg-teal-950/30 border border-teal-800/40 text-xs text-teal-300">
            🌴 <strong>Nomad Rule:</strong> True wealth is having complete geographic, calendar, and lifestyle sovereignty.
          </div>
        </Card>
      </div>
    </div>
  );
};
