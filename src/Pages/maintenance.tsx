import React from "react";

const MaintenanceScreen: React.FC = () => (
  <div
    style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      background: "#222",
      color: "#fff",
      fontFamily: "sans-serif",
      textAlign: "center",
      padding: "2rem"
    }}
  >
    <h1 style={{ fontSize: "3rem", marginBottom: "1rem" }}>We'll be back soon!</h1>
    <p style={{ fontSize: "1.5rem", marginBottom: "2rem" }}>
      Sorry for the inconvenience.<br />
      Our site is currently undergoing scheduled maintenance.<br />
      Thank you for your patience.
    </p>
    <img
      src="/src/assets/madhwa.jpg"
      alt="Logo"
      style={{ width: 120, marginBottom: "2rem" }}
    />
    <footer style={{ fontSize: "1rem", opacity: 0.7 }}>
      &copy; {new Date().getFullYear()}
    </footer>
  </div>
);

export default MaintenanceScreen;