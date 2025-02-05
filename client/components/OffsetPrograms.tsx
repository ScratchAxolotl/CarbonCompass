import { useState } from "react";

interface OffsetPrograms {
  id: number;
  name: string;
  link: string;
  description: string;
};

interface CarbonRates {
  lbPerDollar: number;
  krPerDollar: number;
}


// links to donate
const offsetPrograms: OffsetPrograms[] = [
    {
      "id": 1,
      "name": "Tree planting",
      "link": "https://onetreeplanted.org/products/plant-trees?utm_medium=search&utm_source=bing&utm_campaign=plant-trees-needed-most&utm_term=projects&b_adgroup=Tree%20Planting%20-%20Donate&b_adgroupid=1316116920245747&b_adid=82257549266402&b_campaign=Tree%20Planting&b_campaignid=423558019&b_isproduct=&b_productid=&b_term=one%20tree%20planted&b_termid=kwd-82258385187162:loc-190&msclkid=8d6d5e520650141a15fe39c0c3ecd885",
      "description": "Offset your footprint by planting trees."
    },
    {
      "id": 2,
      "name": "Rid oceans of plastics",
      "link": "https://theoceancleanup.com/",
      "description": "Help clean our oceans and reduce plastic waste."
    },
  ];

  // Emission offset values (example rates)
  const carbonRates: CarbonRates = {
    lbPerDollar: 50, // 50 lbs offset per $1
    krPerDollar: 22.68, // 22.68 kg offset per $1
  }
  
// capital O
  const OffsetPrograms = () => {
    const [visibleProgram, setVisibleProgram] = useState<number | null>(null); // Track which program's input is visible
    const [offsetResults, setOffsetResults] = useState<Record<number, string>>({});

    // calculate carbon offset fro a program
    const calculateOffset  = (id: number, donation: number | null) => {
        if (!donation || donation <= 0) {
            setOffsetResults((prev) => ({
                ...prev, [id]: "please enter a valid donation amount."
            }));
            return;
        }

        const carbonOffsetLb = donation * carbonRates.lbPerDollar;
        const carbonOffsetKg = donation * carbonRates.krPerDollar;

        setOffsetResults((prev) => ({
            ...prev, 
            [id]: `You offset approximately ${carbonOffsetLb.toFixed(2)}lbs
             (${carbonOffsetKg.toFixed(2)} kg).`,
            }));
    };

    return (
        <div>
          <h2>Offset Your Carbon Emissions</h2>
          {offsetPrograms.map((program) => (
            <div key={program.id}>
              <h3>{program.name}</h3>
              <p>{program.description}</p>
              <a
                href={program.link}
                target="_blank"
                onClick={(e) => {
                  e
                  setVisibleProgram(program.id); // Show input box for this program
                }}
              >
                Donate Here
              </a>
              {visibleProgram === program.id && (
                <div>
                  <label htmlFor={`donation-${program.id}`}>
                    Enter Donation Amount:
                  </label>
                  <input
                    type="number"
                    id={`donation-${program.id}`}
                    min="1"
                    placeholder="e.g. 10"
                    onChange={(e) =>
                      calculateOffset(program.id, parseFloat(e.target.value))
                    }
                  />
                  <div>{offsetResults[program.id]}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      );
    };
    
    export default OffsetPrograms;
    
