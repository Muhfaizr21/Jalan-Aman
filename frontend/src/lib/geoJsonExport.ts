import { mockIncidents, mockClusters, mockHazardousZones } from '../components/superadmin/mockData';

// Generates valid RFC 7946 GeoJSON FeatureCollection for gis.co.id
export function generateJalanAmanGeoJSON(type: 'all' | 'incidents' | 'clusters' | 'hazardous_zones' = 'all') {
  const features: any[] = [];

  // 1. Incidents
  if (type === 'all' || type === 'incidents') {
    mockIncidents.forEach((inc) => {
      features.push({
        type: 'Feature',
        id: inc.id,
        geometry: {
          type: 'Point',
          coordinates: [inc.coordinates.lng, inc.coordinates.lat], // [lng, lat]
        },
        properties: {
          id: inc.id,
          kategori: inc.category,
          lokasi: inc.locationName,
          skor_bahaya: inc.dangerScore,
          status: inc.status,
          waktu: inc.timestamp,
          deskripsi: inc.description,
          tipe_sumber: 'Laporan Masyarakat JalanAman',
        },
      });
    });
  }

  // 2. DBSCAN Clusters
  if (type === 'all' || type === 'clusters') {
    mockClusters.forEach((cluster) => {
      features.push({
        type: 'Feature',
        id: `CLUSTER-${cluster.id}`,
        geometry: {
          type: 'Point',
          coordinates: [cluster.center.lng, cluster.center.lat],
        },
        properties: {
          id: `Klaster-${cluster.id}`,
          tingkat_bahaya: cluster.dangerLevel,
          total_kasus: cluster.incidentCount,
          radius_meter: cluster.radius,
          tipe_sumber: 'Hasil Clustering DBSCAN AI',
        },
      });
    });
  }

  // 3. Hazardous Zones
  if (type === 'all' || type === 'hazardous_zones') {
    mockHazardousZones.forEach((zone) => {
      features.push({
        type: 'Feature',
        id: zone.id,
        geometry: {
          type: 'Point',
          coordinates: [zone.coordinates.lng, zone.coordinates.lat],
        },
        properties: {
          id: zone.id,
          nama_zona: zone.name,
          wilayah: `${zone.region}, ${zone.city}`,
          level_bahaya: zone.dangerLevel,
          skor_risiko: zone.riskScore,
          jam_rawan: zone.peakHours,
          total_insiden: zone.incidentCount,
          ancaman_dominan: zone.dominantCategory,
          tipe_sumber: 'Zona Rawan Terverifikasi',
        },
      });
    });
  }

  return {
    type: 'FeatureCollection',
    name: 'JalanAman_Geospatial_Data',
    crs: {
      type: 'name',
      properties: {
        name: 'urn:ogc:def:crs:OGC:1.3:CRS84',
      },
    },
    features,
  };
}

// Triggers direct browser download of the GeoJSON file
export function downloadGeoJSONFile(filename = 'jalanaman_gis_data.geojson', type: 'all' | 'incidents' | 'clusters' | 'hazardous_zones' = 'all') {
  const data = generateJalanAmanGeoJSON(type);
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/geo+json' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
