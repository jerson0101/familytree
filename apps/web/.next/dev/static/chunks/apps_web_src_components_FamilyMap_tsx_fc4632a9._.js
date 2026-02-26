(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/apps/web/src/components/FamilyMap.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>FamilyMap
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/styled-jsx/style.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/shared/lib/app-dynamic.js [app-client] (ecmascript)");
;
;
;
;
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
// Dynamically import the map to avoid SSR issues with Leaflet
const MapContainer = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(()=>__turbopack_context__.A("[project]/node_modules/react-leaflet/lib/index.js [app-client] (ecmascript, next/dynamic entry, async loader)").then((mod)=>mod.MapContainer), {
    loadableGenerated: {
        modules: [
            "[project]/node_modules/react-leaflet/lib/index.js [app-client] (ecmascript, next/dynamic entry)"
        ]
    },
    ssr: false
});
_c = MapContainer;
const TileLayer = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(()=>__turbopack_context__.A("[project]/node_modules/react-leaflet/lib/index.js [app-client] (ecmascript, next/dynamic entry, async loader)").then((mod)=>mod.TileLayer), {
    loadableGenerated: {
        modules: [
            "[project]/node_modules/react-leaflet/lib/index.js [app-client] (ecmascript, next/dynamic entry)"
        ]
    },
    ssr: false
});
_c1 = TileLayer;
const Marker = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(()=>__turbopack_context__.A("[project]/node_modules/react-leaflet/lib/index.js [app-client] (ecmascript, next/dynamic entry, async loader)").then((mod)=>mod.Marker), {
    loadableGenerated: {
        modules: [
            "[project]/node_modules/react-leaflet/lib/index.js [app-client] (ecmascript, next/dynamic entry)"
        ]
    },
    ssr: false
});
_c2 = Marker;
const Popup = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(()=>__turbopack_context__.A("[project]/node_modules/react-leaflet/lib/index.js [app-client] (ecmascript, next/dynamic entry, async loader)").then((mod)=>mod.Popup), {
    loadableGenerated: {
        modules: [
            "[project]/node_modules/react-leaflet/lib/index.js [app-client] (ecmascript, next/dynamic entry)"
        ]
    },
    ssr: false
});
_c3 = Popup;
// Custom marker icons
function createCustomIcon(status, isSelected) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    const L = __turbopack_context__.r("[project]/node_modules/leaflet/dist/leaflet-src.js [app-client] (ecmascript)");
    const color = status === 'online' ? '#10b981' : status === 'away' ? '#f59e0b' : '#9ca3af';
    const size = isSelected ? 48 : 40;
    const borderColor = isSelected ? '#ff6b47' : color;
    const borderWidth = isSelected ? 4 : 3;
    const svgIcon = `
    <svg width="${size}" height="${size + 12}" viewBox="0 0 ${size} ${size + 12}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#000" flood-opacity="0.3"/>
        </filter>
        <linearGradient id="pinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${color};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${color};stop-opacity:0.8" />
        </linearGradient>
      </defs>
      <path d="M${size / 2} ${size + 8} L${size / 2 - 8} ${size - 4} Q0 ${size / 2} 0 ${size / 2 - 4}
               A${size / 2} ${size / 2} 0 1 1 ${size} ${size / 2 - 4}
               Q${size} ${size / 2} ${size / 2 + 8} ${size - 4} Z"
            fill="url(#pinGrad)" filter="url(#shadow)"/>
      <circle cx="${size / 2}" cy="${size / 2 - 4}" r="${size / 2 - 6}" fill="white"/>
      <circle cx="${size / 2}" cy="${size / 2 - 4}" r="${size / 2 - 8}" fill="${color}" opacity="0.2"/>
      <circle cx="${size / 2}" cy="${size / 2 - 4}" r="${size / 4}" fill="${borderColor}" stroke="white" stroke-width="2"/>
    </svg>
  `;
    return L.divIcon({
        html: svgIcon,
        className: 'custom-marker',
        iconSize: [
            size,
            size + 12
        ],
        iconAnchor: [
            size / 2,
            size + 8
        ],
        popupAnchor: [
            0,
            -size
        ]
    });
}
function FamilyMap({ members, selectedMemberId, onMemberSelect, className }) {
    _s();
    const [isClient, setIsClient] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [mapReady, setMapReady] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "FamilyMap.useEffect": ()=>{
            setIsClient(true);
            // Load Leaflet CSS
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
            document.head.appendChild(link);
            // Add custom styles for markers
            const style = document.createElement('style');
            style.textContent = `
      .custom-marker {
        background: transparent !important;
        border: none !important;
      }
      .leaflet-popup-content-wrapper {
        border-radius: 16px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.15);
      }
      .leaflet-popup-content {
        margin: 12px 16px;
      }
    `;
            document.head.appendChild(style);
            setMapReady(true);
            return ({
                "FamilyMap.useEffect": ()=>{
                    document.head.removeChild(link);
                    document.head.removeChild(style);
                }
            })["FamilyMap.useEffect"];
        }
    }["FamilyMap.useEffect"], []);
    // Get members with valid locations
    const membersWithLocation = members.filter((m)=>m.location !== null);
    // Calculate center from members or default to a location
    const center = membersWithLocation.length > 0 ? {
        lat: membersWithLocation.reduce((sum, m)=>sum + (m.location?.lat || 0), 0) / membersWithLocation.length,
        lng: membersWithLocation.reduce((sum, m)=>sum + (m.location?.lng || 0), 0) / membersWithLocation.length
    } : {
        lat: -12.0464,
        lng: -77.0428
    }; // Default to Lima, Peru
    if (!isClient || !mapReady) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: `flex items-center justify-center bg-gradient-to-br from-neutral-50 to-primary-50/30 ${className}`,
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "w-12 h-12 mx-auto mb-4 rounded-full border-4 border-primary-200 border-t-primary-500 animate-spin"
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/components/FamilyMap.tsx",
                        lineNumber: 137,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-neutral-500",
                        children: "Cargando mapa..."
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/components/FamilyMap.tsx",
                        lineNumber: 138,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/src/components/FamilyMap.tsx",
                lineNumber: 136,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/apps/web/src/components/FamilyMap.tsx",
            lineNumber: 135,
            columnNumber: 7
        }, this);
    }
    // If no members have locations, show empty state
    if (membersWithLocation.length === 0) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: `flex items-center justify-center bg-gradient-to-br from-neutral-50 via-primary-50/20 to-secondary-50/20 relative ${className}`,
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "absolute top-10 right-10 w-32 h-32 rounded-full bg-primary-100/50 animate-float"
                }, void 0, false, {
                    fileName: "[project]/apps/web/src/components/FamilyMap.tsx",
                    lineNumber: 148,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "absolute bottom-20 left-20 w-24 h-24 rounded-full bg-secondary-100/50 animate-float",
                    style: {
                        animationDelay: '1s'
                    }
                }, void 0, false, {
                    fileName: "[project]/apps/web/src/components/FamilyMap.tsx",
                    lineNumber: 149,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-center p-8 relative z-10",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center shadow-lg shadow-primary-200",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MapPinIcon, {
                                className: "w-12 h-12 text-white"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/components/FamilyMap.tsx",
                                lineNumber: 153,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/components/FamilyMap.tsx",
                            lineNumber: 152,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                            className: "text-xl font-semibold text-neutral-800 mb-3",
                            children: "Mapa Interactivo"
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/components/FamilyMap.tsx",
                            lineNumber: 155,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-neutral-500 max-w-md mx-auto mb-6",
                            children: members.length === 0 ? 'Agrega miembros a tu familia para ver sus ubicaciones en el mapa.' : 'Los miembros de tu familia aún no han compartido su ubicación. Invítalos a vincularse para ver su ubicación en tiempo real.'
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/components/FamilyMap.tsx",
                            lineNumber: 158,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "inline-flex items-center gap-6 px-6 py-3 rounded-xl bg-white/70 backdrop-blur-sm border border-neutral-100 text-sm",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "flex items-center gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "w-3 h-3 rounded-full bg-gradient-to-br from-green-400 to-emerald-500"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/components/FamilyMap.tsx",
                                            lineNumber: 165,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-neutral-600",
                                            children: "En línea"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/components/FamilyMap.tsx",
                                            lineNumber: 166,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/apps/web/src/components/FamilyMap.tsx",
                                    lineNumber: 164,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "flex items-center gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "w-3 h-3 rounded-full bg-gradient-to-br from-amber-400 to-orange-500"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/components/FamilyMap.tsx",
                                            lineNumber: 169,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-neutral-600",
                                            children: "Ausente"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/components/FamilyMap.tsx",
                                            lineNumber: 170,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/apps/web/src/components/FamilyMap.tsx",
                                    lineNumber: 168,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "flex items-center gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "w-3 h-3 rounded-full bg-neutral-300"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/components/FamilyMap.tsx",
                                            lineNumber: 173,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-neutral-600",
                                            children: "Sin conexión"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/components/FamilyMap.tsx",
                                            lineNumber: 174,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/apps/web/src/components/FamilyMap.tsx",
                                    lineNumber: 172,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/web/src/components/FamilyMap.tsx",
                            lineNumber: 163,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/web/src/components/FamilyMap.tsx",
                    lineNumber: 151,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/apps/web/src/components/FamilyMap.tsx",
            lineNumber: 147,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "jsx-9e85a1d4fae6bec4" + " " + `relative ${className}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MapContainer, {
                center: [
                    center.lat,
                    center.lng
                ],
                zoom: 13,
                className: "w-full h-full rounded-2xl",
                style: {
                    background: '#f5f5f5'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TileLayer, {
                        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
                        url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/components/FamilyMap.tsx",
                        lineNumber: 190,
                        columnNumber: 9
                    }, this),
                    membersWithLocation.map((member)=>{
                        if (!member.location) return null;
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Marker, {
                            position: [
                                member.location.lat,
                                member.location.lng
                            ],
                            icon: createCustomIcon(member.status, selectedMemberId === member.id),
                            eventHandlers: {
                                click: ()=>onMemberSelect(member.id)
                            },
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Popup, {
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "jsx-9e85a1d4fae6bec4" + " " + "text-center min-w-[150px]",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "jsx-9e85a1d4fae6bec4" + " " + "w-12 h-12 mx-auto mb-2 rounded-full bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center text-white font-bold text-lg",
                                            children: member.name.split(' ').map((n)=>n[0]).join('').slice(0, 2)
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/components/FamilyMap.tsx",
                                            lineNumber: 209,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "jsx-9e85a1d4fae6bec4" + " " + "font-semibold text-neutral-800",
                                            children: member.name
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/components/FamilyMap.tsx",
                                            lineNumber: 212,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "jsx-9e85a1d4fae6bec4" + " " + "text-xs text-neutral-500 mt-1",
                                            children: member.location.address
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/components/FamilyMap.tsx",
                                            lineNumber: 213,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "jsx-9e85a1d4fae6bec4" + " " + "flex items-center justify-center gap-1 mt-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "jsx-9e85a1d4fae6bec4" + " " + `w-2 h-2 rounded-full ${member.status === 'online' ? 'bg-green-500' : member.status === 'away' ? 'bg-amber-500' : 'bg-neutral-400'}`
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/web/src/components/FamilyMap.tsx",
                                                    lineNumber: 215,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "jsx-9e85a1d4fae6bec4" + " " + "text-xs text-neutral-600 capitalize",
                                                    children: member.status === 'online' ? 'En línea' : member.status === 'away' ? 'Ausente' : 'Sin conexión'
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/web/src/components/FamilyMap.tsx",
                                                    lineNumber: 217,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/apps/web/src/components/FamilyMap.tsx",
                                            lineNumber: 214,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/apps/web/src/components/FamilyMap.tsx",
                                    lineNumber: 208,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/components/FamilyMap.tsx",
                                lineNumber: 207,
                                columnNumber: 15
                            }, this)
                        }, member.id, false, {
                            fileName: "[project]/apps/web/src/components/FamilyMap.tsx",
                            lineNumber: 199,
                            columnNumber: 13
                        }, this);
                    })
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/src/components/FamilyMap.tsx",
                lineNumber: 184,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "jsx-9e85a1d4fae6bec4" + " " + "absolute bottom-4 left-4 z-[1000] flex items-center gap-4 px-4 py-2 rounded-xl bg-white/90 backdrop-blur-sm border border-neutral-100 shadow-lg text-xs",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "jsx-9e85a1d4fae6bec4" + " " + "flex items-center gap-1.5",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "jsx-9e85a1d4fae6bec4" + " " + "w-2.5 h-2.5 rounded-full bg-gradient-to-br from-green-400 to-emerald-500"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/components/FamilyMap.tsx",
                                lineNumber: 231,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "jsx-9e85a1d4fae6bec4" + " " + "text-neutral-600",
                                children: "En línea"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/components/FamilyMap.tsx",
                                lineNumber: 232,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/src/components/FamilyMap.tsx",
                        lineNumber: 230,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "jsx-9e85a1d4fae6bec4" + " " + "flex items-center gap-1.5",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "jsx-9e85a1d4fae6bec4" + " " + "w-2.5 h-2.5 rounded-full bg-gradient-to-br from-amber-400 to-orange-500"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/components/FamilyMap.tsx",
                                lineNumber: 235,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "jsx-9e85a1d4fae6bec4" + " " + "text-neutral-600",
                                children: "Ausente"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/components/FamilyMap.tsx",
                                lineNumber: 236,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/src/components/FamilyMap.tsx",
                        lineNumber: 234,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "jsx-9e85a1d4fae6bec4" + " " + "flex items-center gap-1.5",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "jsx-9e85a1d4fae6bec4" + " " + "w-2.5 h-2.5 rounded-full bg-neutral-300"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/components/FamilyMap.tsx",
                                lineNumber: 239,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "jsx-9e85a1d4fae6bec4" + " " + "text-neutral-600",
                                children: "Offline"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/components/FamilyMap.tsx",
                                lineNumber: 240,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/src/components/FamilyMap.tsx",
                        lineNumber: 238,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/src/components/FamilyMap.tsx",
                lineNumber: 229,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                id: "9e85a1d4fae6bec4",
                children: ".leaflet-control-zoom{overflow:hidden;border:none!important;border-radius:12px!important;box-shadow:0 4px 12px #0000001a!important}.leaflet-control-zoom a{color:#374151!important;background:#fff!important;border:none!important;width:36px!important;height:36px!important;font-size:18px!important;line-height:36px!important}.leaflet-control-zoom a:hover{background:#f3f4f6!important}"
            }, void 0, false, void 0, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/src/components/FamilyMap.tsx",
        lineNumber: 183,
        columnNumber: 5
    }, this);
}
_s(FamilyMap, "DmTxmRl7lqmBfldizg4bAWJuJFE=");
_c4 = FamilyMap;
function MapPinIcon({ className }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        className: className,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "1.5",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/FamilyMap.tsx",
                lineNumber: 272,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: "12",
                cy: "10",
                r: "3"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/FamilyMap.tsx",
                lineNumber: 273,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/src/components/FamilyMap.tsx",
        lineNumber: 271,
        columnNumber: 5
    }, this);
}
_c5 = MapPinIcon;
var _c, _c1, _c2, _c3, _c4, _c5;
__turbopack_context__.k.register(_c, "MapContainer");
__turbopack_context__.k.register(_c1, "TileLayer");
__turbopack_context__.k.register(_c2, "Marker");
__turbopack_context__.k.register(_c3, "Popup");
__turbopack_context__.k.register(_c4, "FamilyMap");
__turbopack_context__.k.register(_c5, "MapPinIcon");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/web/src/components/FamilyMap.tsx [app-client] (ecmascript, next/dynamic entry)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/apps/web/src/components/FamilyMap.tsx [app-client] (ecmascript)"));
}),
]);

//# sourceMappingURL=apps_web_src_components_FamilyMap_tsx_fc4632a9._.js.map