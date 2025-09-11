"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Globe from "./GlobeWrapper";
import * as THREE from "three";
import countries from "./assets/countries_110m.json";

const GLOBE_COLORS = {
  HOVER: "#F5F5DC",       // gold hover
  DEFAULT: "#F7931A",     // orange default
  STROKE: "#ffffff",      // white borders
  SIDE: "#00000000",      // transparent sides
  SELECTED: "#8B4513",    // blue selected
};

const COUNTRY_FLAGS = {
  DZ: "🇩🇿", // Algeria
  AO: "🇦🇴", // Angola
  BJ: "🇧🇯", // Benin
  BW: "🇧🇼", // Botswana
  BF: "🇧🇫", // Burkina Faso
  BI: "🇧🇮", // Burundi
  CV: "🇨🇻", // Cabo Verde
  CM: "🇨🇲", // Cameroon
  CF: "🇨🇫", // Central African Republic
  TD: "🇹🇩", // Chad
  KM: "🇰🇲", // Comoros
  CG: "🇨🇬", // Congo (Brazzaville)
  CD: "🇨🇩", // Congo (Kinshasa)
  DJ: "🇩🇯", // Djibouti
  EG: "🇪🇬", // Egypt
  GQ: "🇬🇶", // Equatorial Guinea
  ER: "🇪🇷", // Eritrea
  SZ: "🇸🇿", // Eswatini
  ET: "🇪🇹", // Ethiopia
  GA: "🇬🇦", // Gabon
  GM: "🇬🇲", // Gambia
  GH: "🇬🇭", // Ghana
  GN: "🇬🇳", // Guinea
  GW: "🇬🇼", // Guinea-Bissau
  CI: "🇨🇮", // Ivory Coast
  KE: "🇰🇪", // Kenya
  LS: "🇱🇸", // Lesotho
  LR: "🇱🇷", // Liberia
  LY: "🇱🇾", // Libya
  MG: "🇲🇬", // Madagascar
  MW: "🇲🇼", // Malawi
  ML: "🇲🇱", // Mali
  MR: "🇲🇷", // Mauritania
  MU: "🇲🇺", // Mauritius
  MA: "🇲🇦", // Morocco
  MZ: "🇲🇿", // Mozambique
  NA: "🇳🇦", // Namibia
  NE: "🇳🇪", // Niger
  NG: "🇳🇬", // Nigeria
  RW: "🇷🇼", // Rwanda
  ST: "🇸🇹", // Sao Tome and Principe
  SN: "🇸🇳", // Senegal
  SC: "🇸🇨", // Seychelles
  SL: "🇸🇱", // Sierra Leone
  SO: "🇸🇴", // Somalia
  ZA: "🇿🇦", // South Africa
  SS: "🇸🇸", // South Sudan
  SD: "🇸🇩", // Sudan
  TZ: "🇹🇿", // Tanzania
  TG: "🇹🇬", // Togo
  TN: "🇹🇳", // Tunisia
  UG: "🇺🇬", // Uganda
  ZM: "🇿🇲", // Zambia
  ZW: "🇿🇼", // Zimbabwe
};

export default function GlobeComponent({
  benefitsList,
  onCountrySelect,
  selectedCountry
}) {
  const [hoverD, setHoverD] = useState();
  const [hoverData, setHoverData] = useState();
  const [dimensions, setDimensions] = useState({ width: 300, height: 300 });
  const globeRef = useRef(null);
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef(null);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleResize = useCallback(() => {
    try {
      if (containerRef.current && containerRef.current.parentElement) {
        const container = containerRef.current.parentElement;
        const availableWidth = container.offsetWidth;
        const availableHeight = container.offsetHeight;
        
        // Use 90% of available space to prevent overflow
        const size = Math.min(availableWidth, availableHeight) * 0.9;
        
        setDimensions({
          width: Math.min(size), // Cap at 500px
          height: Math.min(size), // Cap at 500px
        });
      }
    } catch (error) {
      console.error("Error resizing globe:", error);
      // Fallback to reasonable defaults
      setDimensions({
        width: 400,
        height: 400,
      });
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Initial resize after a small delay to ensure DOM is ready
      const timeoutId = setTimeout(handleResize, 100);
      
      window.addEventListener("resize", handleResize);
      
      return () => {
        clearTimeout(timeoutId);
        window.removeEventListener("resize", handleResize);
      };
    }
  }, [handleResize]);

  const globeReady = useCallback(() => {
    if (globeRef.current) {
      globeRef.current.controls().autoRotate = false;
      globeRef.current.controls().enableZoom = false;
      globeRef.current.pointOfView({
        lat: 4.38508,
        lng: 18.05785,
        altitude: 1.8,
      });
    }
  }, []);

  const handlePolygonClick = useCallback(
    (d) => {
      if (onCountrySelect && d?.properties?.admin) {
        onCountrySelect(d.properties.admin);
      }
    },
    [onCountrySelect]
  );

  const isCountrySelected = useCallback(
    (d) => {
      if (!selectedCountry || !d?.properties) return false;
      return (
        selectedCountry.name === d.properties.admin ||
        selectedCountry.name === d.properties.name ||
        selectedCountry.name === d.properties.name_long
      );
    },
    [selectedCountry]
  );

  const nameComponent = () => {
    const countryCode = hoverD?.properties?.iso_a2;
    const flag = COUNTRY_FLAGS[countryCode];

    return (
      <div className="absolute lg:left-[20%] top-1/3 lg:top-1/2 z-50 flex flex-row space-x-2 bg-white border-[0.5px] border-[#CCCCCC] rounded-lg md:rounded-xl p-1 px-2 md:px-3 md:py-2 items-center w-auto max-w-lg">
        <span className="text-2xl">{flag}</span>
        <p className="text-main font-semibold text-xs md:text-sm">
          {hoverD?.properties?.formal_en || hoverD?.properties?.admin}
        </p>
      </div>
    );
  };

  const dataComponent = (assetData) => {
    if (!assetData?.assets || Object.keys(assetData.assets).length === 0) {
      return null;
    }

    return (
      <div className="absolute right-[10%] top-[50%] md:top-1/3 z-50 flex flex-col bg-white border-[0.5px] border-[#CCCCCC] rounded-lg md:rounded-xl w-auto max-w-md h-auto max-h-[500px]">
        <p className="w-full text-center border-b-[0.5px] border-[#CCCCCC] text-[#263238] font-semibold text-xs md:text-sm p-2 md:p-3 bg-[#F8F8F8] rounded-t-lg md:rounded-t-xl">
          Available Services
        </p>
        <div className="p-3 md:p-4 w-full">
          {Object.entries(assetData.assets).map(([key, value]) => (
            <div key={key} className="mb-4 w-full">
              <p className="text-main font-semibold text-xs md:text-sm mb-2">
                {key}
              </p>
              <div className="w-full">
                {Array.isArray(value) &&
                  value.map((item, index) => (
                    <div
                      className="text-[#263238] font-normal text-xs md:text-sm my-1"
                      key={index}
                    >
                      {item}
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (!mounted) return null;

  return (
    <section className="relative m-auto w-full h-full flex items-center justify-center p-2">
      {hoverD && nameComponent()}
      {hoverD && hoverData && dataComponent(hoverData)}
      
      {/* Container with constrained sizing */}
      <div className="w-full max-w-[800px] h-[300px] sm:h-[400px] md:h-[450px] flex items-center justify-center mx-auto">
        <div 
          ref={containerRef}
          className="w-full h-full flex items-center justify-center"
        >
          <Globe
            backgroundColor="#ffffff00"
            width={dimensions.width}
            height={dimensions.height}
            rendererConfig={{ antialias: true, alpha: true }}
            ref={globeRef}
            onGlobeReady={globeReady}
            polygonsData={countries.features.filter(
              (d) => d.properties.iso_a2 !== "AQ"
            )}
            polygonCapColor={(d) => {
              if (isCountrySelected(d)) return GLOBE_COLORS.SELECTED;
              return d === hoverD ? GLOBE_COLORS.HOVER : GLOBE_COLORS.DEFAULT;
            }}
            polygonStrokeColor={() => GLOBE_COLORS.STROKE}
            onPolygonHover={(d) => {
              setHoverD(d);
            }}
            onPolygonClick={handlePolygonClick}
            polygonsTransitionDuration={300}
            polygonSideColor={() => GLOBE_COLORS.SIDE}
            polygonAltitude={0.01}
            globeMaterial={new THREE.MeshPhongMaterial({
              color: "white",
              opacity: 0.99,
              transparent: true,
            })}
            atmosphereColor="white"
            atmosphereAltitude={0.2}
          />
        </div>
      </div>
    </section>
  );
}