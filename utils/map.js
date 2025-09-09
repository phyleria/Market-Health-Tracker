// utils/map.js

// Filter benefits by country
export const filterByCountry = (countryName, benefitsList, setHoverData) => {
  if (!benefitsList || !countryName) return null;
  
  const countryBenefits = benefitsList.find(item => 
    item.country.toLowerCase() === countryName.toLowerCase()
  );
  
  if (countryBenefits) {
    setHoverData(countryBenefits);
    return countryBenefits;
  }
  
  // Return default structure if no benefits found
  const defaultBenefits = {
    country: countryName,
    assets: {
      'Purchases of': ['No data available'],
      'Deposit to': ['No data available']
    }
  };
  
  setHoverData(defaultBenefits);
  return defaultBenefits;
};

// Get random country object
export const getRandomCountryObject = (features, benefitsList, setHoverData, setHoverD) => {
  if (!features || features.length === 0) return;
  
  // Filter for African countries only
  const africanCountries = features.filter(feature => {
    const continent = feature.properties?.continent;
    return continent === 'Africa' || 
           feature.properties?.region_un === 'Africa' ||
           feature.properties?.region_wb === 'Sub-Saharan Africa';
  });
  
  if (africanCountries.length === 0) return;
  
  const randomIndex = Math.floor(Math.random() * africanCountries.length);
  const randomCountry = africanCountries[randomIndex];
  
  setHoverD(randomCountry);
  filterByCountry(randomCountry.properties?.admin, benefitsList, setHoverData);
};