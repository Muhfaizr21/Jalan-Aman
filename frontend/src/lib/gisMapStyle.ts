// Circlegeo 3D ESRI Satellite Map Style Specification
// Conforms to MapLibre GL / Mapbox GL Style Spec v8

export const circlegeoEsriStyle = {
  "version": 8,
  "name": "Circlegeo 3D ESRI Satellite",
  "metadata": {
    "mapbox:autocomposite": false,
    "maputnik:renderer": "mbgljs",
    "openmaptiles:version": "3.x"
  },
  "sources": {
    "openmaptiles": {
      "type": "vector",
      "url": "https://data.circlegeo.com/data/planet.json"
    },
    "satellitte": {
      "type": "raster",
      "tiles": [
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
      ],
      "minzoom": 0,
      "maxzoom": 17,
      "tileSize": 256
    },
    "terrainSource": {
      "type": "raster-dem",
      "url": "https://tiles.circlegeo.com/data/terrain.json",
      "tileSize": 256
    }
  },
  "terrain": {
    "source": "terrainSource",
    "exaggeration": 0
  },
  "maxPitch": 85,
  "glyphs": "https://fonts.openmaptiles.org/{fontstack}/{range}.pbf",
  "layers": [
    {
      "id": "background",
      "type": "background",
      "layout": {
        "visibility": "visible"
      },
      "paint": {
        "background-color": "rgba(74, 80, 70, 1)"
      }
    },
    {
      "id": "water",
      "type": "fill",
      "source": "openmaptiles",
      "source-layer": "water",
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
      "paint": {
        "fill-color": "#cad2d3"
      }
    },
    {
      "id": "satellitte",
      "type": "raster",
      "source": "satellitte"
    },
    {
      "id": "landcover",
      "type": "fill",
      "source": "openmaptiles",
      "source-layer": "landcover",
      "filter": [
        "all"
      ],
      "layout": {
        "visibility": "none"
      },
      "paint": {
        "fill-color": "#e3e3e3"
      }
    },
    {
      "id": "boundary_nation",
      "type": "line",
      "source": "openmaptiles",
      "source-layer": "boundary",
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
      "paint": {
        "line-color": "rgba(197, 197, 197, 1)",
        "line-width": 1.5
      }
    },
    {
      "id": "waterway_tunnel",
      "type": "line",
      "source": "openmaptiles",
      "source-layer": "waterway",
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
      "paint": {
        "line-color": "#cad2d3",
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
        },
        "line-opacity": 1,
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
        }
      }
    },
    {
      "id": "waterway",
      "type": "line",
      "source": "openmaptiles",
      "source-layer": "waterway",
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
      "paint": {
        "line-color": "#cad2d3",
        "line-opacity": 1,
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
        }
      }
    },
    {
      "id": "waterway_intermittent",
      "type": "line",
      "source": "openmaptiles",
      "source-layer": "waterway",
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
      "paint": {
        "line-color": "#cad2d3",
        "line-dasharray": [
          2,
          1
        ],
        "line-opacity": 1,
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
        }
      }
    },
    {
      "id": "tunnel_railway_transit",
      "type": "line",
      "source": "openmaptiles",
      "source-layer": "transportation",
      "minzoom": 0,
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
      "paint": {
        "line-color": "hsl(34, 12%, 66%)",
        "line-dasharray": [
          3,
          3
        ],
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
      }
    },
    {
      "id": "road_area_pier",
      "type": "fill",
      "metadata": {},
      "source": "openmaptiles",
      "source-layer": "transportation",
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
      "paint": {
        "fill-antialias": true,
        "fill-color": "#1C1C1C"
      }
    },
    {
      "id": "road_pier",
      "type": "line",
      "metadata": {},
      "source": "openmaptiles",
      "source-layer": "transportation",
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
      }
    },
    {
      "id": "road_bridge_area",
      "type": "fill",
      "source": "openmaptiles",
      "source-layer": "transportation",
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
      "paint": {
        "fill-color": "#1C1C1C",
        "fill-opacity": 0.5
      }
    },
    {
      "id": "road_path",
      "type": "line",
      "source": "openmaptiles",
      "source-layer": "transportation",
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
      "paint": {
        "line-color": "#1C1C1C",
        "line-dasharray": [
          1,
          1
        ],
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
        }
      }
    },
    {
      "id": "road_minor_case",
      "type": "line",
      "source": "openmaptiles",
      "source-layer": "transportation",
      "minzoom": 13,
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
      }
    },
    {
      "id": "road_minor",
      "type": "line",
      "source": "openmaptiles",
      "source-layer": "transportation",
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
      }
    },
    {
      "id": "tunnel_minor",
      "type": "line",
      "source": "openmaptiles",
      "source-layer": "transportation",
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
      "paint": {
        "line-color": "rgba(215, 223, 230, 1)",
        "line-dasharray": [
          0.36,
          0.18
        ],
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
      }
    },
    {
      "id": "tunnel_major",
      "type": "line",
      "source": "openmaptiles",
      "source-layer": "transportation",
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
      "paint": {
        "line-color": "rgba(215, 223, 230, 1)",
        "line-dasharray": [
          0.28,
          0.14
        ],
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
      }
    },
    {
      "id": "road_trunk_primary_case",
      "type": "line",
      "source": "openmaptiles",
      "source-layer": "transportation",
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
      }
    },
    {
      "id": "road_trunk_primary",
      "type": "line",
      "source": "openmaptiles",
      "source-layer": "transportation",
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
      }
    },
    {
      "id": "road_secondary_tertiary_case",
      "type": "line",
      "source": "openmaptiles",
      "source-layer": "transportation",
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
      }
    },
    {
      "id": "road_secondary_tertiary",
      "type": "line",
      "source": "openmaptiles",
      "source-layer": "transportation",
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
      }
    },
    {
      "id": "road_major_motorway_case",
      "type": "line",
      "source": "openmaptiles",
      "source-layer": "transportation",
      "minzoom": 6,
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
      "paint": {
        "line-color": "rgba(156, 156, 156, 1)",
        "line-offset": 0,
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
        }
      }
    },
    {
      "id": "road_major_motorway",
      "type": "line",
      "source": "openmaptiles",
      "source-layer": "transportation",
      "minzoom": 6,
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
      "paint": {
        "line-color": "#1C1C1C",
        "line-offset": 0,
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
        }
      }
    },
    {
      "id": "railway_transit",
      "type": "line",
      "source": "openmaptiles",
      "source-layer": "transportation",
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
      }
    },
    {
      "id": "railway",
      "type": "line",
      "source": "openmaptiles",
      "source-layer": "transportation",
      "filter": [
        "==",
        "class",
        "rail"
      ],
      "layout": {
        "visibility": "visible"
      },
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
      }
    },
    {
      "id": "bridge_minor case",
      "type": "line",
      "source": "openmaptiles",
      "source-layer": "transportation",
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
      "paint": {
        "line-color": "rgba(193, 203, 211, 1)",
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
        },
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
        }
      }
    },
    {
      "id": "bridge_major case",
      "type": "line",
      "source": "openmaptiles",
      "source-layer": "transportation",
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
      "paint": {
        "line-color": "rgba(193, 203, 211, 1)",
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
        },
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
        }
      }
    },
    {
      "id": "bridge_minor",
      "type": "line",
      "source": "openmaptiles",
      "source-layer": "transportation",
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
      }
    },
    {
      "id": "bridge_major",
      "type": "line",
      "source": "openmaptiles",
      "source-layer": "transportation",
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
      }
    },
    {
      "id": "road_major_label",
      "type": "symbol",
      "source": "openmaptiles",
      "source-layer": "transportation_name",
      "filter": [
        "==",
        "$type",
        "LineString"
      ],
      "layout": {
        "symbol-placement": "line",
        "text-field": "{name}",
        "text-font": [
          "Klokantech Noto Sans Regular"
        ],
        "text-letter-spacing": 0.1,
        "text-rotation-alignment": "map",
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
        "text-transform": "uppercase"
      },
      "paint": {
        "text-color": "#000",
        "text-halo-color": "hsl(0, 0%, 100%)",
        "text-halo-width": 2
      }
    },
    {
      "id": "building-3d",
      "type": "fill-extrusion",
      "source": "openmaptiles",
      "source-layer": "building",
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
      "paint": {
        "fill-extrusion-base": {
          "property": "render_min_height",
          "type": "identity"
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
          "property": "render_height",
          "type": "identity"
        },
        "fill-extrusion-opacity": 0.6
      }
    },
    {
      "id": "country_label",
      "type": "symbol",
      "source": "openmaptiles",
      "source-layer": "place",
      "maxzoom": 12,
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
        "text-field": "{name}",
        "text-font": [
          "Klokantech Noto Sans Bold"
        ],
        "text-max-width": 10,
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
        }
      },
      "paint": {
        "text-color": "hsl(0, 0%, 13%)",
        "text-halo-blur": 0,
        "text-halo-color": "rgba(255,255,255,0.75)",
        "text-halo-width": 2
      }
    },
    {
      "id": "place_label_other",
      "type": "symbol",
      "source": "openmaptiles",
      "source-layer": "place",
      "minzoom": 10,
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
        "text-anchor": "center",
        "text-field": "{name}",
        "text-font": [
          "Klokantech Noto Sans Regular"
        ],
        "text-max-width": 6,
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
        "visibility": "none"
      },
      "paint": {
        "text-color": "rgba(255, 255, 255, 1)",
        "text-halo-blur": 0,
        "text-halo-color": "rgba(50, 50, 50, 1)",
        "text-halo-width": 2
      }
    },
    {
      "id": "place_label_city",
      "type": "symbol",
      "source": "openmaptiles",
      "source-layer": "place",
      "maxzoom": 16,
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
        "text-field": "{name}",
        "text-font": [
          "Klokantech Noto Sans Regular"
        ],
        "text-max-width": 10,
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
        }
      },
      "paint": {
        "text-color": "rgba(255, 255, 255, 1)",
        "text-halo-blur": 0,
        "text-halo-color": "#323232",
        "text-halo-width": 2
      }
    }
  ],
  "id": "road-ibf",
  "sprite": "https://api.gis.co.id/storage/v1/object/public/sprites/maki"
} as const;

export type GISMapStyleType = typeof circlegeoEsriStyle;
