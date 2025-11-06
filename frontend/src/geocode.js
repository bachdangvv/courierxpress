import axios from "axios";

/**
 * Geocode địa chỉ sang lat/lng bằng Nominatim (OpenStreetMap)
 * @param {string} address - địa chỉ cần tìm tọa độ
 * @returns {Promise<{lat: number, lng: number} | null>}
 */
export async function geocodeAddress(address) {
  if (!address) return null;

  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
    address
  )}`;

  try {
    const { data } = await axios.get(url, {
      headers: { "User-Agent": "CourierXpressApp/1.0" },
    });

    if (data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
      };
    }

    return null;
  } catch (err) {
    console.error("Geocode error:", err);
    return null;
  }
}