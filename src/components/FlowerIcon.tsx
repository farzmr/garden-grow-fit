import React from "react";

export type FlowerKey =
  | "tulip"
  | "sakura"
  | "sunflower"
  | "rose"
  | "daisy"
  | "lavender"
  | "hibiscus"
  | "orchid"
  | "lotus"
  | "hyacinth"
  | "poppy"
  | "daffodil"
  | "peony"
  | "iris"
  | "marigold";

export type FlowerMeta = {
  id: FlowerKey;
  name: string;
  emojiFallback: string;
};

export const FLOWER_CATALOG: FlowerMeta[] = [
  { id: "tulip", name: "Tulip", emojiFallback: "🌷" },
  { id: "sakura", name: "Cherry Blossom", emojiFallback: "🌸" },
  { id: "sunflower", name: "Sunflower", emojiFallback: "🌻" },
  { id: "rose", name: "Rose", emojiFallback: "🌹" },
  { id: "daisy", name: "Daisy", emojiFallback: "🌼" },
  { id: "lavender", name: "Lavender", emojiFallback: "🪻" },
  { id: "hibiscus", name: "Hibiscus", emojiFallback: "🌺" },
  { id: "orchid", name: "Orchid", emojiFallback: "🪷" },
  { id: "lotus", name: "Lotus", emojiFallback: "🪷" },
  { id: "hyacinth", name: "Hyacinth", emojiFallback: "🪻" },
  { id: "poppy", name: "Poppy", emojiFallback: "🥀" },
  { id: "daffodil", name: "Daffodil", emojiFallback: "🌼" },
  { id: "peony", name: "Peony", emojiFallback: "💮" },
  { id: "iris", name: "Iris", emojiFallback: "🪻" },
  { id: "marigold", name: "Marigold", emojiFallback: "🏵️" },
];

/** Normalizes any legacy emoji or name string to one of our 15 canonical FlowerKeys */
export function normalizeFlower(flower: string | undefined | null): FlowerKey {
  if (!flower) return "tulip";
  const str = flower.trim().toLowerCase();
  if (str === "tulip" || str === "🌷") return "tulip";
  if (str === "sakura" || str === "cherry blossom" || str === "🌸") return "sakura";
  if (str === "sunflower" || str === "🌻") return "sunflower";
  if (str === "rose" || str === "🌹") return "rose";
  if (str === "daisy" || str === "🌼") return "daisy";
  if (str === "lavender" || str === "🪻") return "lavender";
  if (str === "hibiscus" || str === "🌺") return "hibiscus";
  if (str === "orchid" || str === "💐") return "orchid";
  if (str === "lotus" || str === "🪷") return "lotus";
  if (str === "hyacinth" || str === "foxglove") return "hyacinth";
  if (str === "poppy" || str === "🥀") return "poppy";
  if (str === "daffodil" || str === "⭐") return "daffodil";
  if (str === "peony" || str === "💮") return "peony";
  if (str === "iris") return "iris";
  if (str === "marigold" || str === "🏵️" || str === "🏵") return "marigold";
  return "tulip";
}

export function FlowerIcon({
  flower,
  className = "h-6 w-6",
  title,
}: {
  flower: string;
  className?: string;
  title?: string;
}) {
  const key = normalizeFlower(flower);
  const meta = FLOWER_CATALOG.find((m) => m.id === key) ?? FLOWER_CATALOG[0]!;

  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center select-none ${className}`}
      title={title ?? meta.name}
      aria-label={title ?? meta.name}
    >
      <svg
        viewBox="0 0 64 64"
        className="!h-full !w-full !size-full block shrink-0"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* 1. TULIP: Sturdy green stem, curved leaves, crimson/coral cup bloom */}
        {key === "tulip" && (
          <g>
            <path d="M32 60V32" stroke="#4D7C0F" strokeWidth="4" strokeLinecap="round" />
            <path d="M32 50C22 47 15 53 13 58C19 60 27 56 32 50Z" fill="#65A30D" />
            <path d="M32 45C40 42 48 48 51 53C45 56 38 52 32 45Z" fill="#65A30D" />
            <path d="M20 10C20 25 32 37 32 37C32 37 44 25 44 10C38 15 32 23 32 23C32 23 26 15 20 10Z" fill="#BE123C" />
            <path d="M12 13C12 28 25 36 32 37C25 32 20 22 20 10C15 10 12 12 12 13Z" fill="#E11D48" />
            <path d="M52 13C52 28 39 36 32 37C39 32 44 22 44 10C49 10 52 12 52 13Z" fill="#FB7185" />
          </g>
        )}

        {/* 2. CHERRY BLOSSOM (SAKURA): Slender branch stem, green buds, 5 notched pink petals */}
        {key === "sakura" && (
          <g>
            <path d="M32 60V32" stroke="#4D7C0F" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M32 48C25 46 20 51 18 55C24 56 29 53 32 48Z" fill="#65A30D" />
            <path d="M32 42C38 40 44 44 46 48C41 50 36 47 32 42Z" fill="#65A30D" />
            <path d="M28 32C28 35 36 35 36 32Z" fill="#365314" />
            {[0, 72, 144, 216, 288].map((angle, i) => (
              <path
                key={i}
                d="M32 24 C29 11, 22 2, 27 -2 C30 -4, 32 -1, 32 0 C32 -1, 34 -4, 37 -2 C42 2, 35 11, 32 24 Z"
                fill="#FDA4AF"
                stroke="#F43F5E"
                strokeWidth="0.9"
                transform={`rotate(${angle} 32 24)`}
              />
            ))}
            <circle cx="32" cy="24" r="5.5" fill="#E11D48" />
            <circle cx="32" cy="24" r="2.8" fill="#FDE047" />
          </g>
        )}

        {/* 3. SUNFLOWER: Sturdy thick stem, broad green leaves, golden petals, seeded center */}
        {key === "sunflower" && (
          <g>
            <path d="M32 60V29" stroke="#3F6212" strokeWidth="4.2" strokeLinecap="round" />
            <path d="M32 48C21 44 14 53 12 58C20 61 28 55 32 48Z" fill="#4D7C0F" />
            <path d="M32 42C41 38 48 47 50 52C43 55 36 49 32 42Z" fill="#4D7C0F" />
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, i) => (
              <ellipse
                key={i}
                cx="32"
                cy="10"
                rx="4.5"
                ry="10.5"
                fill="#FBBF24"
                stroke="#D97706"
                strokeWidth="0.8"
                transform={`rotate(${angle} 32 24)`}
              />
            ))}
            <circle cx="32" cy="24" r="11.5" fill="#78350F" />
            <circle cx="32" cy="24" r="8.5" fill="#451A03" />
            <circle cx="32" cy="24" r="7" stroke="#92400E" strokeDasharray="1.5 1.5" strokeWidth="1" />
          </g>
        )}

        {/* 4. ROSE: Thorny stem, serrated leaves, swirling velvet crimson petals */}
        {key === "rose" && (
          <g>
            <path d="M32 60V31" stroke="#365314" strokeWidth="3.8" strokeLinecap="round" />
            <path d="M32 48C21 45 16 54 13 58C21 60 28 55 32 48Z" fill="#4D7C0F" />
            <path d="M32 42C40 39 47 47 50 51C44 54 37 50 32 42Z" fill="#4D7C0F" />
            <circle cx="32" cy="22" r="18.5" fill="#881337" />
            <path d="M17 19C18 12 27 6 36 7C45 8 49 14 47 23C44 31 34 36 27 34C21 32 15 25 17 19Z" fill="#9F1239" />
            <path d="M22 18C24 13 31 10 38 12C44 14 45 20 42 26C39 31 31 33 26 29C22 26 21 21 22 18Z" fill="#BE123C" />
            <path d="M26 17C28 13 34 13 38 16C41 18 40 23 37 25C34 27 30 27 27 24C25 22 25 19 26 17Z" fill="#E11D48" />
            <circle cx="32" cy="20" r="3.5" fill="#FB7185" />
          </g>
        )}

        {/* 5. DAISY: Upright green stem, leaves, radiating white petals, sunny yellow button */}
        {key === "daisy" && (
          <g>
            <path d="M32 60V29" stroke="#4D7C0F" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M32 48C24 45 18 52 16 56C22 58 28 54 32 48Z" fill="#65A30D" />
            <path d="M32 43C39 40 45 47 47 51C41 53 35 49 32 43Z" fill="#65A30D" />
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, i) => (
              <ellipse
                key={i}
                cx="32"
                cy="10"
                rx="3.8"
                ry="10.5"
                fill="#FAFAF9"
                stroke="#CBD5E1"
                strokeWidth="0.8"
                transform={`rotate(${angle} 32 23)`}
              />
            ))}
            <circle cx="32" cy="23" r="8.5" fill="#F59E0B" />
            <circle cx="32" cy="23" r="6" fill="#FBBF24" />
          </g>
        )}

        {/* 6. LAVENDER: Tall green stem, slender foliage, purple floret bells */}
        {key === "lavender" && (
          <g>
            <path d="M32 60V10" stroke="#3F6212" strokeWidth="3.2" strokeLinecap="round" />
            {/* Lush base foliage */}
            <path d="M32 54C22 49 16 57 14 60C20 61 27 57 32 54Z" fill="#4D7C0F" />
            <path d="M32 50C40 45 46 53 48 57C43 58 37 54 32 50Z" fill="#4D7C0F" />
            <path d="M32 44C24 40 19 46 17 50C23 51 28 47 32 44Z" fill="#65A30D" />
            <path d="M32 40C39 36 43 43 45 47C40 48 35 44 32 40Z" fill="#65A30D" />
            {/* Clustered lush purple floret bells */}
            {[
              [26, 14, 5.2, 4], [38, 14, 5.2, 4],
              [24, 20, 5.6, 4.2], [40, 20, 5.6, 4.2],
              [23, 26, 5.8, 4.4], [41, 26, 5.8, 4.4],
              [24, 32, 5.6, 4.2], [40, 32, 5.6, 4.2],
              [26, 38, 5.2, 4], [38, 38, 5.2, 4],
              [32, 8, 4.5, 4], [32, 17, 4.8, 3.8], [32, 23, 5, 4], [32, 29, 5, 4], [32, 35, 4.8, 3.8],
            ].map(([x, y, rx, ry], i) => (
              <ellipse
                key={i}
                cx={x}
                cy={y}
                rx={rx}
                ry={ry}
                fill={i % 3 === 0 ? "#7C3AED" : i % 3 === 1 ? "#8B5CF6" : "#A78BFA"}
                stroke="#5B21B6"
                strokeWidth="0.6"
              />
            ))}
          </g>
        )}

        {/* 7. HIBISCUS: Stem, broad green leaf, tropical coral petals, golden stamen column */}
        {key === "hibiscus" && (
          <g>
            <path d="M32 60V32" stroke="#3F6212" strokeWidth="3.8" strokeLinecap="round" />
            <path d="M32 50C21 46 14 55 12 59C21 61 28 56 32 50Z" fill="#4D7C0F" />
            {[0, 72, 144, 216, 288].map((angle, i) => (
              <path
                key={i}
                d="M32 24 C25 11, 16 3, 27 1 C38 -1, 39 11, 32 24 Z"
                fill="#F43F5E"
                stroke="#BE123C"
                strokeWidth="1.1"
                transform={`rotate(${angle} 32 24)`}
              />
            ))}
            <circle cx="32" cy="24" r="7" fill="#881337" />
            <path d="M32 24 C36 14 43 8 50 6" stroke="#FBBF24" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="50" cy="6" r="2.8" fill="#F59E0B" />
          </g>
        )}

        {/* 8. ORCHID: Stem, green leaf, exotic violet & white petals, magenta lip */}
        {key === "orchid" && (
          <g>
            <path d="M32 60V32" stroke="#3F6212" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M32 50C39 46 47 53 49 57C43 59 36 55 32 50Z" fill="#4D7C0F" />
            <ellipse cx="32" cy="12" rx="6.5" ry="11" fill="#DDD6FE" stroke="#A78BFA" strokeWidth="0.9" />
            <ellipse cx="18" cy="21" rx="11" ry="6.5" fill="#DDD6FE" stroke="#A78BFA" strokeWidth="0.9" transform="rotate(-25 18 21)" />
            <ellipse cx="46" cy="21" rx="11" ry="6.5" fill="#DDD6FE" stroke="#A78BFA" strokeWidth="0.9" transform="rotate(25 46 21)" />
            <path d="M32 24 C22 19 13 30 21 38 C27 42 32 32 32 24Z" fill="#C084FC" />
            <path d="M32 24 C42 19 51 30 43 38 C37 42 32 32 32 24Z" fill="#C084FC" />
            <path d="M32 22 C27 29 28 37 32 40 C36 37 37 29 32 22Z" fill="#7E22CE" />
            <circle cx="32" cy="26" r="2.4" fill="#FBBF24" />
          </g>
        )}

        {/* 9. LOTUS (REDESIGNED): Slender green aquatic stem, calyx, layered open lotus petals */}
        {key === "lotus" && (
          <g>
            <path d="M32 60V36" stroke="#15803D" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M32 48C23 44 17 51 15 55C22 57 28 53 32 48Z" fill="#16A34A" />
            <path d="M32 44C39 40 45 47 47 51C41 53 35 49 32 44Z" fill="#16A34A" />
            {/* Green calyx cup */}
            <path d="M20 36 C27 42 37 42 44 36 C39 44 25 44 20 36 Z" fill="#15803D" />
            {/* Outer pink petals */}
            <path d="M10 32 C18 25 28 30 32 37 C23 37 15 35 10 32 Z" fill="#F472B6" />
            <path d="M54 32 C46 25 36 30 32 37 C41 37 49 35 54 32 Z" fill="#F472B6" />
            {/* Inner layered petals */}
            <path d="M18 18 C19 29 32 37 32 37 C32 37 24 28 18 18 Z" fill="#FBCFE8" stroke="#F472B6" strokeWidth="0.8" />
            <path d="M46 18 C45 29 32 37 32 37 C32 37 40 28 46 18 Z" fill="#FBCFE8" stroke="#F472B6" strokeWidth="0.8" />
            <path d="M25 12 C26 24 32 36 32 36 C32 36 28 22 25 12 Z" fill="#FDF2F8" stroke="#F472B6" strokeWidth="0.8" />
            <path d="M39 12 C38 24 32 36 32 36 C32 36 36 22 39 12 Z" fill="#FDF2F8" stroke="#F472B6" strokeWidth="0.8" />
            {/* Center petal */}
            <path d="M32 8 C28 18 32 35 32 35 C32 35 36 18 32 8 Z" fill="#FFFFFF" stroke="#F472B6" strokeWidth="1" />
            <ellipse cx="32" cy="33" rx="4.5" ry="2.5" fill="#FDE047" />
          </g>
        )}

        {/* 10. HYACINTH (NEW! REPLACES FOXGLOVE): Thick succulent stem, upright sword leaves, dense star floret spike */}
        {key === "hyacinth" && (
          <g>
            <path d="M32 60V12" stroke="#3F6212" strokeWidth="4.2" strokeLinecap="round" />
            {/* Long upright lance leaves */}
            <path d="M29 60 C24 44 17 35 15 26 C20 33 27 46 29 60 Z" fill="#4D7C0F" />
            <path d="M35 60 C40 44 47 35 49 26 C44 33 37 46 35 60 Z" fill="#4D7C0F" />
            {/* Clustered dense conical star florets */}
            {[
              [32, 10, "#4F46E5", 4.5],
              [25, 15, "#4338CA", 4.8], [39, 15, "#6366F1", 4.8],
              [22, 21, "#3B82F6", 5.2], [32, 20, "#4F46E5", 5.2], [42, 21, "#4338CA", 5.2],
              [20, 27, "#6366F1", 5.4], [32, 27, "#3730A3", 5.4], [44, 27, "#3B82F6", 5.4],
              [21, 33, "#4338CA", 5.4], [32, 33, "#4F46E5", 5.4], [43, 33, "#6366F1", 5.4],
              [23, 39, "#3B82F6", 5.2], [32, 39, "#3730A3", 5.2], [41, 39, "#4338CA", 5.2],
              [26, 45, "#6366F1", 4.8], [38, 45, "#4F46E5", 4.8],
            ].map(([x, y, color, r], i) => (
              <g key={i}>
                <circle cx={x as number} cy={y as number} r={r as number} fill={color as string} />
                <circle cx={x as number} cy={y as number} r={(r as number) * 0.3} fill="#FEF08A" />
              </g>
            ))}
          </g>
        )}

        {/* 11. POPPY: Slender hairy stem, feathery leaf, vibrant scarlet petals, black velvet center */}
        {key === "poppy" && (
          <g>
            <path d="M32 60V29" stroke="#365314" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M32 48C23 44 17 51 15 55C22 57 28 53 32 48Z" fill="#4D7C0F" />
            <path d="M32 43C39 39 45 46 47 50C41 52 35 48 32 43Z" fill="#4D7C0F" />
            <circle cx="24" cy="21" r="13" fill="#DC2626" />
            <circle cx="40" cy="21" r="13" fill="#EF4444" />
            <circle cx="32" cy="27" r="12.5" fill="#B91C1C" />
            <circle cx="32" cy="14" r="11" fill="#EF4444" />
            <circle cx="32" cy="22" r="6" fill="#18181B" />
            <circle cx="32" cy="22" r="3" fill="#365314" />
          </g>
        )}

        {/* 12. DAFFODIL (REDESIGNED: WHITE & YELLOW): Slender stem, strap leaves, crisp white star petals, golden trumpet */}
        {key === "daffodil" && (
          <g>
            <path d="M32 60V26" stroke="#3F6212" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M32 48C23 43 18 52 16 57C22 58 28 53 32 48Z" fill="#4D7C0F" />
            <path d="M32 42C39 37 46 46 48 51C42 53 36 47 32 42Z" fill="#4D7C0F" />
            {/* 6 CRISP WHITE STAR PETALS - BROAD & PROMINENT */}
            {[0, 60, 120, 180, 240, 300].map((angle, i) => (
              <path
                key={i}
                d="M32 22 C22 13 32 3 32 3 C32 3 42 13 32 22 Z"
                fill="#FFFFFF"
                stroke="#CBD5E1"
                strokeWidth="1"
                transform={`rotate(${angle} 32 22)`}
              />
            ))}
            {/* BRIGHT SUNNY YELLOW RUFFLED TRUMPET CORONA */}
            <circle cx="32" cy="22" r="9" fill="#FACC15" stroke="#EAB308" strokeWidth="1.2" />
            <circle cx="32" cy="22" r="6.2" fill="#FDE047" />
            <circle cx="32" cy="22" r="3" fill="#CA8A04" />
          </g>
        )}

        {/* 13. PEONY (REDESIGNED): Strong woody stem, lush foliage, opulent ruffled blush-pink bloom */}
        {key === "peony" && (
          <g>
            <path d="M32 60V31" stroke="#365314" strokeWidth="3.8" strokeLinecap="round" />
            <path d="M32 48C21 44 14 53 12 58C20 60 27 55 32 48Z" fill="#3F6212" />
            <path d="M32 42C41 38 48 47 50 52C43 55 36 49 32 42Z" fill="#3F6212" />
            {/* Opulent ruffled pink peony layers */}
            <circle cx="32" cy="22" r="19" fill="#F472B6" />
            <circle cx="32" cy="22" r="15" fill="#EC4899" />
            <path d="M19 17 C24 10 40 10 45 17 C40 24 24 24 19 17 Z" fill="#FBCFE8" />
            <path d="M21 24 C26 29 38 29 43 24 C38 31 26 31 21 24 Z" fill="#FDF2F8" />
            <path d="M25 15 C29 20 35 20 39 15 C37 22 27 22 25 15 Z" fill="#BE185D" />
            <circle cx="32" cy="21" r="2.8" fill="#FDE047" />
          </g>
        )}

        {/* 14. IRIS: Tall stem, sword leaves, upright royal blue standards, falling indigo petals */}
        {key === "iris" && (
          <g>
            <path d="M32 60V28" stroke="#365314" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M29 60 C24 43 19 34 17 25 C22 33 27 45 29 60 Z" fill="#3F6212" />
            <path d="M35 60 C40 43 45 34 47 25 C42 33 37 45 35 60 Z" fill="#3F6212" />
            {/* Upright standards */}
            <path d="M32 23 C25 11 32 2 32 2 C32 2 39 11 32 23 Z" fill="#6366F1" />
            {/* Falling petals */}
            <path d="M32 23 C21 25 13 36 18 41 C23 39 27 30 32 23 Z" fill="#4338CA" />
            <path d="M32 23 C43 25 51 36 46 41 C41 39 37 30 32 23 Z" fill="#4338CA" />
            {/* Golden beard */}
            <path d="M29 27 L24 33" stroke="#FBBF24" strokeWidth="2.2" strokeLinecap="round" />
            <path d="M35 27 L40 33" stroke="#FBBF24" strokeWidth="2.2" strokeLinecap="round" />
          </g>
        )}

        {/* 15. MARIGOLD: Branching stem, feathery leaves, dense saffron pom-pom bloom */}
        {key === "marigold" && (
          <g>
            <path d="M32 60V29" stroke="#365314" strokeWidth="3.8" strokeLinecap="round" />
            <path d="M32 48C23 44 17 51 15 55C22 57 28 53 32 48Z" fill="#3F6212" />
            <path d="M32 43C39 39 45 46 47 50C41 52 35 48 32 43Z" fill="#3F6212" />
            <circle cx="32" cy="21" r="18" fill="#D97706" />
            <circle cx="32" cy="21" r="14" fill="#F59E0B" />
            <circle cx="32" cy="21" r="10" fill="#FBBF24" />
            <circle cx="32" cy="21" r="5.5" fill="#FEF08A" />
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
              <circle
                key={i}
                cx="32"
                cy="6.5"
                r="3.8"
                fill="#EA580C"
                transform={`rotate(${angle} 32 21)`}
              />
            ))}
          </g>
        )}
      </svg>
    </span>
  );
}
