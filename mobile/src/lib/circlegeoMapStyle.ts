// Circlegeo 3D ESRI Satellite Map Style Specification
// Conforms to MapLibre GL / Mapbox GL Style Spec v8

export const circlegeoEsriStyle = {
  "id": "road-ibf",
  "name": "Circlegeo 3D ESRI Satellite",
  "glyphs": "https://fonts.openmaptiles.org/{fontstack}/{range}.pbf",
  "layers": [
    {
      "id": "background",
      "type": "background",
      "paint": {
        "background-color": "rgba(74, 80, 70, 1)"
      },
      "layout": {
        "visibility": "visible"
      }
    },
    {
      "id": "water",
      "type": "fill",
      "paint": {
        "fill-color": "#cad2d3"
      },
      "filter": [
        "all",
        [
          "==",
          "$type",
          "Polygon"
        ],
        [
          "!=",
          "brunnel",
          "tunnel"
        ]
      ],
      "layout": {
        "visibility": "none"
      },
      "source": "openmaptiles",
      "source-layer": "water"
    },
    {
      "id": "satellitte",
      "type": "raster",
      "source": "satellitte"
    },
    {
      "id": "landcover",
      "type": "fill",
      "paint": {
        "fill-color": "#e3e3e3"
      },
      "filter": [
        "all"
      ],
      "layout": {
        "visibility": "none"
      },
      "source": "openmaptiles",
      "source-layer": "landcover"
    },
    {
      "id": "boundary_nation",
      "type": "line",
      "paint": {
        "line-color": "rgba(197, 197, 197, 1)",
        "line-width": 1.5
      },
      "filter": [
        "all",
        [
          "==",
          "admin_level",
          2
        ]
      ],
      "layout": {
        "visibility": "visible"
      },
      "source": "openmaptiles",
      "source-layer": "boundary"
    },
    {
      "id": "waterway_tunnel",
      "type": "line",
      "paint": {
        "line-color": "#cad2d3",
        "line-width": {
          "base": 1.4,
          "stops": [
            [
              8,
              1
            ],
            [
              20,
              2
            ]
          ]
        },
        "line-opacity": 1,
        "line-dasharray": [
          3,
          3
        ],
        "line-gap-width": {
          "stops": [
            [
              12,
              0
            ],
            [
              20,
              6
            ]
          ]
        }
      },
      "filter": [
        "all",
        [
          "==",
          "$type",
          "LineString"
        ],
        [
          "==",
          "brunnel",
          "tunnel"
        ]
      ],
      "layout": {
        "visibility": "visible"
      },
      "source": "openmaptiles",
      "source-layer": "waterway"
    },
    {
      "id": "waterway",
      "type": "line",
      "paint": {
        "line-color": "#cad2d3",
        "line-width": {
          "base": 1.4,
          "stops": [
            [
              8,
              1
            ],
            [
              20,
              8
            ]
          ]
        },
        "line-opacity": 1
      },
      "filter": [
        "all",
        [
          "==",
          "$type",
          "LineString"
        ],
        [
          "!=",
          "intermittent",
          1
        ],
        [
          "!in",
          "brunnel",
          "tunnel",
          "bridge"
        ]
      ],
      "layout": {
        "visibility": "none"
      },
      "source": "openmaptiles",
      "source-layer": "waterway"
    },
    {
      "id": "waterway_intermittent",
      "type": "line",
      "paint": {
        "line-color": "#cad2d3",
        "line-width": {
          "base": 1.4,
          "stops": [
            [
              8,
              1
            ],
            [
              20,
              8
            ]
          ]
        },
        "line-opacity": 1,
        "line-dasharray": [
          2,
          1
        ]
      },
      "filter": [
        "all",
        [
          "==",
          "$type",
          "LineString"
        ],
        [
          "==",
          "intermittent",
          1
        ],
        [
          "!in",
          "brunnel",
          "tunnel",
          "bridge"
        ]
      ],
      "layout": {
        "visibility": "visible"
      },
      "source": "openmaptiles",
      "source-layer": "waterway"
    },
    {
      "id": "tunnel_railway_transit",
      "type": "line",
      "paint": {
        "line-color": "hsl(34, 12%, 66%)",
        "line-opacity": {
          "base": 1,
          "stops": [
            [
              11,
              0
            ],
            [
              16,
              1
            ]
          ]
        },
        "line-dasharray": [
          3,
          3
        ]
      },
      "filter": [
        "all",
        [
          "==",
          "$type",
          "LineString"
        ],
        [
          "==",
          "brunnel",
          "tunnel"
        ],
        [
          "==",
          "class",
          "transit"
        ]
      ],
      "layout": {
        "line-cap": "butt",
        "line-join": "miter",
        "visibility": "visible"
      },
      "source": "openmaptiles",
      "minzoom": 0,
      "source-layer": "transportation"
    },
    {
      "id": "road_area_pier",
      "type": "fill",
      "paint": {
        "fill-color": "#1C1C1C",
        "fill-antialias": true
      },
      "filter": [
        "all",
        [
          "==",
          "$type",
          "Polygon"
        ],
        [
          "==",
          "class",
          "pier"
        ]
      ],
      "layout": {
        "visibility": "visible"
      },
      "source": "openmaptiles",
      "metadata": {},
      "source-layer": "transportation"
    },
    {
      "id": "road_pier",
      "type": "line",
      "paint": {
        "line-color": "#1C1C1C",
        "line-width": {
          "base": 1.2,
          "stops": [
            [
              15,
              1
            ],
            [
              17,
              4
            ]
          ]
        }
      },
      "filter": [
        "all",
        [
          "==",
          "$type",
          "LineString"
        ],
        [
          "in",
          "class",
          "pier"
        ]
      ],
      "layout": {
        "line-cap": "round",
        "line-join": "round"
      },
      "source": "openmaptiles",
      "metadata": {},
      "source-layer": "transportation"
    },
    {
      "id": "road_bridge_area",
      "type": "fill",
      "paint": {
        "fill-color": "#1C1C1C",
        "fill-opacity": 0.5
      },
      "filter": [
        "all",
        [
          "==",
          "$type",
          "Polygon"
        ],
        [
          "in",
          "brunnel",
          "bridge"
        ]
      ],
      "layout": {},
      "source": "openmaptiles",
      "source-layer": "transportation"
    },
    {
      "id": "road_path",
      "type": "line",
      "paint": {
        "line-color": "#1C1C1C",
        "line-width": {
          "base": 1.55,
          "stops": [
            [
              4,
              0.25
            ],
            [
              20,
              10
            ]
          ]
        },
        "line-dasharray": [
          1,
          1
        ]
      },
      "filter": [
        "all",
        [
          "==",
          "$type",
          "LineString"
        ],
        [
          "in",
          "class",
          "path",
          "track"
        ]
      ],
      "layout": {
        "line-cap": "square",
        "line-join": "bevel"
      },
      "source": "openmaptiles",
      "source-layer": "transportation"
    },
    {
      "id": "road_minor_case",
      "type": "line",
      "paint": {
        "line-color": "rgba(255, 255, 255, 1)",
        "line-width": {
          "base": 1.55,
          "stops": [
            [
              4,
              0.25
            ],
            [
              20,
              31
            ]
          ]
        }
      },
      "filter": [
        "all",
        [
          "==",
          "$type",
          "LineString"
        ],
        [
          "in",
          "class",
          "minor",
          "service"
        ]
      ],
      "layout": {
        "line-cap": "round",
        "line-join": "round"
      },
      "source": "openmaptiles",
      "minzoom": 13,
      "source-layer": "transportation"
    },
    {
      "id": "road_minor",
      "type": "line",
      "paint": {
        "line-color": "rgba(28, 28, 28, 1)",
        "line-width": {
          "base": 1.55,
          "stops": [
            [
              4,
              0.25
            ],
            [
              20,
              30
            ]
          ]
        }
      },
      "filter": [
        "all",
        [
          "==",
          "$type",
          "LineString"
        ],
        [
          "in",
          "class",
          "minor",
          "service"
        ]
      ],
      "layout": {
        "line-cap": "round",
        "line-join": "round"
      },
      "source": "openmaptiles",
      "source-layer": "transportation"
    },
    {
      "id": "tunnel_minor",
      "type": "line",
      "paint": {
        "line-color": "rgba(215, 223, 230, 1)",
        "line-width": {
          "base": 1.55,
          "stops": [
            [
              4,
              0.25
            ],
            [
              20,
              30
            ]
          ]
        },
        "line-dasharray": [
          0.36,
          0.18
        ]
      },
      "filter": [
        "all",
        [
          "==",
          "$type",
          "LineString"
        ],
        [
          "all",
          [
            "==",
            "brunnel",
            "tunnel"
          ],
          [
            "==",
            "class",
            "minor_road"
          ]
        ]
      ],
      "layout": {
        "line-cap": "butt",
        "line-join": "miter"
      },
      "source": "openmaptiles",
      "source-layer": "transportation"
    },
    {
      "id": "tunnel_major",
      "type": "line",
      "paint": {
        "line-color": "rgba(215, 223, 230, 1)",
        "line-width": {
          "base": 1.4,
          "stops": [
            [
              6,
              0.5
            ],
            [
              20,
              30
            ]
          ]
        },
        "line-dasharray": [
          0.28,
          0.14
        ]
      },
      "filter": [
        "all",
        [
          "==",
          "$type",
          "LineString"
        ],
        [
          "all",
          [
            "==",
            "brunnel",
            "tunnel"
          ],
          [
            "in",
            "class",
            "primary",
            "secondary",
            "tertiary",
            "trunk"
          ]
        ]
      ],
      "layout": {
        "line-cap": "butt",
        "line-join": "miter"
      },
      "source": "openmaptiles",
      "source-layer": "transportation"
    },
    {
      "id": "road_trunk_primary_case",
      "type": "line",
      "paint": {
        "line-color": "rgba(110, 110, 110, 1)",
        "line-width": {
          "base": 1.4,
          "stops": [
            [
              6,
              2
            ],
            [
              20,
              31
            ]
          ]
        }
      },
      "filter": [
        "all",
        [
          "==",
          "$type",
          "LineString"
        ],
        [
          "in",
          "class",
          "trunk",
          "primary"
        ]
      ],
      "layout": {
        "line-cap": "round",
        "line-join": "round"
      },
      "source": "openmaptiles",
      "source-layer": "transportation"
    },
    {
      "id": "road_trunk_primary",
      "type": "line",
      "paint": {
        "line-color": "#1C1C1C",
        "line-width": {
          "base": 1.4,
          "stops": [
            [
              6,
              2
            ],
            [
              20,
              30
            ]
          ]
        }
      },
      "filter": [
        "all",
        [
          "==",
          "$type",
          "LineString"
        ],
        [
          "in",
          "class",
          "trunk",
          "primary"
        ]
      ],
      "layout": {
        "line-cap": "round",
        "line-join": "round"
      },
      "source": "openmaptiles",
      "source-layer": "transportation"
    },
    {
      "id": "road_secondary_tertiary_case",
      "type": "line",
      "paint": {
        "line-color": "rgba(106, 106, 106, 1)",
        "line-width": {
          "base": 1.4,
          "stops": [
            [
              6,
              0.5
            ],
            [
              20,
              20
            ]
          ]
        }
      },
      "filter": [
        "all",
        [
          "==",
          "$type",
          "LineString"
        ],
        [
          "in",
          "class",
          "secondary",
          "tertiary"
        ]
      ],
      "layout": {
        "line-cap": "round",
        "line-join": "round"
      },
      "source": "openmaptiles",
      "source-layer": "transportation"
    },
    {
      "id": "road_secondary_tertiary",
      "type": "line",
      "paint": {
        "line-color": "#1C1C1C",
        "line-width": {
          "base": 1.4,
          "stops": [
            [
              6,
              0.5
            ],
            [
              20,
              20
            ]
          ]
        }
      },
      "filter": [
        "all",
        [
          "==",
          "$type",
          "LineString"
        ],
        [
          "in",
          "class",
          "secondary",
          "tertiary"
        ]
      ],
      "layout": {
        "line-cap": "round",
        "line-join": "round"
      },
      "source": "openmaptiles",
      "source-layer": "transportation"
    },
    {
      "id": "road_major_motorway_case",
      "type": "line",
      "paint": {
        "line-color": "rgba(156, 156, 156, 1)",
        "line-width": {
          "base": 1.4,
          "stops": [
            [
              6,
              2
            ],
            [
              16,
              11
            ]
          ]
        },
        "line-offset": 0
      },
      "filter": [
        "all",
        [
          "==",
          "$type",
          "LineString"
        ],
        [
          "==",
          "class",
          "motorway"
        ]
      ],
      "layout": {
        "line-cap": "round",
        "line-join": "round"
      },
      "source": "openmaptiles",
      "minzoom": 6,
      "source-layer": "transportation"
    },
    {
      "id": "road_major_motorway",
      "type": "line",
      "paint": {
        "line-color": "#1C1C1C",
        "line-width": {
          "base": 1.4,
          "stops": [
            [
              6,
              2
            ],
            [
              16,
              10
            ]
          ]
        },
        "line-offset": 0
      },
      "filter": [
        "all",
        [
          "==",
          "$type",
          "LineString"
        ],
        [
          "==",
          "class",
          "motorway"
        ]
      ],
      "layout": {
        "line-cap": "round",
        "line-join": "round"
      },
      "source": "openmaptiles",
      "minzoom": 6,
      "source-layer": "transportation"
    },
    {
      "id": "railway_transit",
      "type": "line",
      "paint": {
        "line-color": "hsl(34, 12%, 66%)",
        "line-opacity": {
          "base": 1,
          "stops": [
            [
              11,
              0
            ],
            [
              16,
              1
            ]
          ]
        }
      },
      "filter": [
        "all",
        [
          "==",
          "class",
          "transit"
        ],
        [
          "!=",
          "brunnel",
          "tunnel"
        ]
      ],
      "layout": {
        "visibility": "visible"
      },
      "source": "openmaptiles",
      "source-layer": "transportation"
    },
    {
      "id": "railway",
      "type": "line",
      "paint": {
        "line-color": "hsl(34, 12%, 66%)",
        "line-opacity": {
          "base": 1,
          "stops": [
            [
              11,
              0
            ],
            [
              16,
              1
            ]
          ]
        }
      },
      "filter": [
        "==",
        "class",
        "rail"
      ],
      "layout": {
        "visibility": "visible"
      },
      "source": "openmaptiles",
      "source-layer": "transportation"
    },
    {
      "id": "bridge_minor case",
      "type": "line",
      "paint": {
        "line-color": "rgba(193, 203, 211, 1)",
        "line-width": {
          "base": 1.6,
          "stops": [
            [
              12,
              0.5
            ],
            [
              20,
              10
            ]
          ]
        },
        "line-gap-width": {
          "base": 1.55,
          "stops": [
            [
              4,
              0.25
            ],
            [
              20,
              30
            ]
          ]
        }
      },
      "filter": [
        "all",
        [
          "==",
          "$type",
          "LineString"
        ],
        [
          "all",
          [
            "==",
            "brunnel",
            "bridge"
          ],
          [
            "==",
            "class",
            "minor_road"
          ]
        ]
      ],
      "layout": {
        "line-cap": "butt",
        "line-join": "miter"
      },
      "source": "openmaptiles",
      "source-layer": "transportation"
    },
    {
      "id": "bridge_major case",
      "type": "line",
      "paint": {
        "line-color": "rgba(193, 203, 211, 1)",
        "line-width": {
          "base": 1.6,
          "stops": [
            [
              20,
              10
            ]
          ]
        },
        "line-gap-width": {
          "base": 1.55,
          "stops": [
            [
              4,
              0.25
            ],
            [
              20,
              30
            ]
          ]
        }
      },
      "filter": [
        "all",
        [
          "==",
          "$type",
          "LineString"
        ],
        [
          "all",
          [
            "==",
            "brunnel",
            "bridge"
          ],
          [
            "in",
            "class",
            "primary",
            "secondary",
            "tertiary",
            "trunk"
          ]
        ]
      ],
      "layout": {
        "line-cap": "butt",
        "line-join": "miter"
      },
      "source": "openmaptiles",
      "source-layer": "transportation"
    },
    {
      "id": "bridge_minor",
      "type": "line",
      "paint": {
        "line-color": "#1C1C1C",
        "line-width": {
          "base": 1.55,
          "stops": [
            [
              4,
              0.25
            ],
            [
              20,
              30
            ]
          ]
        }
      },
      "filter": [
        "all",
        [
          "==",
          "$type",
          "LineString"
        ],
        [
          "all",
          [
            "==",
            "brunnel",
            "bridge"
          ],
          [
            "==",
            "class",
            "minor_road"
          ]
        ]
      ],
      "layout": {
        "line-cap": "round",
        "line-join": "round"
      },
      "source": "openmaptiles",
      "source-layer": "transportation"
    },
    {
      "id": "bridge_major",
      "type": "line",
      "paint": {
        "line-color": "#1C1C1C",
        "line-width": {
          "base": 1.4,
          "stops": [
            [
              6,
              0.5
            ],
            [
              20,
              30
            ]
          ]
        }
      },
      "filter": [
        "all",
        [
          "==",
          "$type",
          "LineString"
        ],
        [
          "all",
          [
            "==",
            "brunnel",
            "bridge"
          ],
          [
            "in",
            "class",
            "primary",
            "secondary",
            "tertiary",
            "trunk"
          ]
        ]
      ],
      "layout": {
        "line-cap": "round",
        "line-join": "round"
      },
      "source": "openmaptiles",
      "source-layer": "transportation"
    },
    {
      "id": "road_major_label",
      "type": "symbol",
      "paint": {
        "text-color": "#000",
        "text-halo-color": "hsl(0, 0%, 100%)",
        "text-halo-width": 2
      },
      "filter": [
        "==",
        "$type",
        "LineString"
      ],
      "layout": {
        "text-font": [
          "Klokantech Noto Sans Regular"
        ],
        "text-size": {
          "base": 1.4,
          "stops": [
            [
              10,
              8
            ],
            [
              20,
              14
            ]
          ]
        },
        "text-field": "{name}",
        "text-transform": "uppercase",
        "symbol-placement": "line",
        "text-letter-spacing": 0.1,
        "text-rotation-alignment": "map"
      },
      "source": "openmaptiles",
      "source-layer": "transportation_name"
    },
    {
      "id": "building-3d",
      "type": "fill-extrusion",
      "paint": {
        "fill-extrusion-base": {
          "type": "identity",
          "property": "render_min_height"
        },
        "fill-extrusion-color": [
          "case",
          [
            "has",
            "colour"
          ],
          [
            "get",
            "colour"
          ],
          "#cad2d3"
        ],
        "fill-extrusion-height": {
          "type": "identity",
          "property": "render_height"
        },
        "fill-extrusion-opacity": 0.6
      },
      "filter": [
        "all",
        [
          "!has",
          "hide_3d"
        ]
      ],
      "layout": {
        "visibility": "none"
      },
      "source": "openmaptiles",
      "source-layer": "building"
    },
    {
      "id": "country_label",
      "type": "symbol",
      "paint": {
        "text-color": "hsl(0, 0%, 13%)",
        "text-halo-blur": 0,
        "text-halo-color": "rgba(255,255,255,0.75)",
        "text-halo-width": 2
      },
      "filter": [
        "all",
        [
          "==",
          "$type",
          "Point"
        ],
        [
          "==",
          "class",
          "country"
        ]
      ],
      "layout": {
        "text-font": [
          "Klokantech Noto Sans Bold"
        ],
        "text-size": {
          "stops": [
            [
              3,
              12
            ],
            [
              8,
              22
            ]
          ]
        },
        "text-field": "{name}",
        "text-max-width": 10
      },
      "source": "openmaptiles",
      "maxzoom": 12,
      "source-layer": "place"
    },
    {
      "id": "place_label_other",
      "type": "symbol",
      "paint": {
        "text-color": "rgba(255, 255, 255, 1)",
        "text-halo-blur": 0,
        "text-halo-color": "rgba(50, 50, 50, 1)",
        "text-halo-width": 2
      },
      "filter": [
        "all",
        [
          "==",
          "$type",
          "Point"
        ],
        [
          "all",
          [
            "!=",
            "class",
            "city"
          ]
        ]
      ],
      "layout": {
        "text-font": [
          "Klokantech Noto Sans Regular"
        ],
        "text-size": {
          "stops": [
            [
              6,
              10
            ],
            [
              12,
              14
            ]
          ]
        },
        "text-field": "{name}",
        "visibility": "none",
        "text-anchor": "center",
        "text-max-width": 6
      },
      "source": "openmaptiles",
      "minzoom": 10,
      "source-layer": "place"
    },
    {
      "id": "place_label_city",
      "type": "symbol",
      "paint": {
        "text-color": "rgba(255, 255, 255, 1)",
        "text-halo-blur": 0,
        "text-halo-color": "#323232",
        "text-halo-width": 2
      },
      "filter": [
        "all",
        [
          "==",
          "$type",
          "Point"
        ],
        [
          "==",
          "class",
          "city"
        ]
      ],
      "layout": {
        "text-font": [
          "Klokantech Noto Sans Regular"
        ],
        "text-size": {
          "stops": [
            [
              3,
              12
            ],
            [
              8,
              16
            ]
          ]
        },
        "text-field": "{name}",
        "text-max-width": 10
      },
      "source": "openmaptiles",
      "maxzoom": 16,
      "source-layer": "place"
    }
  ],
  "sprite": "/sprites/maki",
  "sources": {
    "satellitte": {
      "type": "raster",
      "tiles": [
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
      ],
      "maxzoom": 17,
      "minzoom": 0,
      "tileSize": 256
    },
    "openmaptiles": {
      "url": "https://data.circlegeo.com/data/planet.json",
      "type": "vector"
    },
    "terrainSource": {
      "url": "https://tiles.circlegeo.com/data/terrain.json",
      "type": "raster-dem",
      "tileSize": 256
    }
  },
  "terrain": {
    "source": "terrainSource",
    "exaggeration": 0
  },
  "version": 8,
  "maxPitch": 85,
  "metadata": {
    "maputnik:renderer": "mbgljs",
    "mapbox:autocomposite": false,
    "openmaptiles:version": "3.x"
  }
};

/**
 * Returns Circlegeo 3D ESRI Style with browser-safe same-origin sprite resolution
 */
export function getCirclegeoEsriStyle() {
  const spriteUrl =
    typeof window !== 'undefined' && window.location?.origin
      ? `${window.location.origin}/sprites/maki`
      : '/sprites/maki';

  return {
    ...circlegeoEsriStyle,
    sprite: spriteUrl,
  };
}
