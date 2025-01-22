const MapEmbed = ({ lat, lng }: { lat: number; lng: number }) => {
  const googleMapsUrl = `https://www.google.com/maps?q=${lat},${lng}&z=15&output=embed`;

  return (
    <div className="map-container">
      <iframe
        src={googleMapsUrl}
        width="400"
        height="250"
        style={{ border: 0 }}
        allowFullScreen={true}
        loading="lazy"
        title="Google Map"
      ></iframe>
    </div>
  );
};

export default MapEmbed;
