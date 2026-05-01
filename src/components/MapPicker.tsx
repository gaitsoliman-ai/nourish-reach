import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

/** Mint active pickup pin (Barakah primary) */
const mintPinHtml = `<div style="width:28px;height:28px;border-radius:50%;background:#02db96;border:3px solid #fff;box-shadow:0 4px 14px rgba(2,219,150,0.45),0 2px 6px rgba(0,0,0,0.12);"></div>`;
const mintMarkerIcon = L.divIcon({
  className: "barakah-mint-marker",
  html: mintPinHtml,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

export interface LatLng {
  lat: number;
  lng: number;
}

function ClickHandler({ onPick }: { onPick: (p: LatLng) => void }) {
  useMapEvents({
    click(e) {
      onPick({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

function Recenter({ center }: { center: LatLng }) {
  const map = useMap();
  useEffect(() => {
    map.setView([center.lat, center.lng], map.getZoom());
  }, [center, map]);
  return null;
}

// Fixes the "gray tiles" issue when the map mounts inside a hidden / collapsed parent.
function InvalidateOnMount() {
  const map = useMap();
  useEffect(() => {
    const fix = () => map.invalidateSize();
    fix();
    const t1 = setTimeout(fix, 100);
    const t2 = setTimeout(fix, 400);
    window.addEventListener("resize", fix);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      window.removeEventListener("resize", fix);
    };
  }, [map]);
  return null;
}

interface PickerProps {
  value: LatLng | null;
  onChange: (p: LatLng) => void;
  height?: number;
  interactive?: boolean;
}

export function MapPicker({ value, onChange, height = 240, interactive = true }: PickerProps) {
  const center: LatLng = value ?? { lat: 25.2854, lng: 51.5310 }; // default: Doha, Qatar
  const requested = useRef(false);

  useEffect(() => {
    if (interactive && !value && !requested.current && "geolocation" in navigator) {
      requested.current = true;
      navigator.geolocation.getCurrentPosition(
        (pos) => onChange({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => {},
        { timeout: 4000 }
      );
    }
  }, [interactive, value, onChange]);

  return (
    <div
      className="rounded-2xl overflow-hidden shadow-soft ring-1 ring-black/[0.06] relative"
      style={{ height }}
    >
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={14}
        scrollWheelZoom={interactive}
        dragging={interactive}
        doubleClickZoom={interactive}
        zoomControl={interactive}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {interactive && <ClickHandler onPick={onChange} />}
        {value && <Marker position={[value.lat, value.lng]} icon={mintMarkerIcon} />}
        {value && <Recenter center={value} />}
        <InvalidateOnMount />
      </MapContainer>
      {interactive && (
        <div className="absolute top-2 left-2 right-2 bg-background/95 backdrop-blur text-xs px-3 py-2 rounded-lg shadow pointer-events-none">
          Tap the map to drop a pin at the pickup spot
        </div>
      )}
    </div>
  );
}

export function googleMapsLink(p: LatLng) {
  return `https://www.google.com/maps?q=${p.lat},${p.lng}`;
}

export function googleDirectionsLink(p: LatLng) {
  return `https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lng}`;
}

/**
 * Live Google Maps embed (no API key) using the public maps?output=embed endpoint.
 * Drops a fixed pin at the exact lat/lng provided by the donor.
 */
export function googleEmbedSrc(p: LatLng, zoom = 17) {
  return `https://maps.google.com/maps?q=${p.lat},${p.lng}&z=${zoom}&hl=en&output=embed`;
}

/** A live Google Maps view with the donor's dropped pin. */
export function GoogleMapView({ point, height = 220 }: { point: LatLng; height?: number }) {
  return (
    <iframe
      title="Pickup location — Google Maps"
      src={googleEmbedSrc(point)}
      style={{ height, width: "100%", border: 0, display: "block" }}
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      allowFullScreen
    />
  );
}

