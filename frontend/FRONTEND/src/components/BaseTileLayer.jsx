import { TileLayer } from 'react-leaflet';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

const LAYERS = {
  satellite: {
    url: `https://api.mapbox.com/v4/mapbox.satellite/{z}/{x}/{y}{r}.jpg90?access_token=${MAPBOX_TOKEN}`,
    maxZoom: 22,
    detectRetina: true,
    attribution:
      '&copy; <a href="https://www.mapbox.com/about/maps/">Mapbox</a> &copy; <a href="https://www.maxar.com/">Maxar</a>',
  },
  osm: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    maxZoom: 19,
    detectRetina: false,
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
};

export default function BaseTileLayer({ layer = 'satellite' }) {
  const config = LAYERS[layer] || LAYERS.satellite;
  return (
    <TileLayer
      url={config.url}
      maxZoom={config.maxZoom}
      detectRetina={config.detectRetina}
      attribution={config.attribution}
    />
  );
}
