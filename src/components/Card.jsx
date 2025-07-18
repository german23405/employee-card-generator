import React from "react";

export default function Card({ cardData, settings }) {
  const { name, position, funFacts, greeting, photo } = cardData;
  const { shadow, borderRadius, background, imageFormat, imageScale, imagePositionX = 50, imagePositionY = 50, fontColorName, fontColorPosition, fontColorFunFacts, fontColorGreeting, fontColorDate, fontColorSmallDescription, positionBgColor, positionRadius, positionPaddingY, positionPaddingX, funFactsBgColor, funFactsRadius, funFactsPadding } = settings;
    
  return (
    <div
      className="card-preview-class"
      style={{
        width: typeof window !== 'undefined' && window.innerWidth <= 480 ? 'auto' : 350,
        // minHeight: 480, // remove fixed minHeight for responsiveness
        background,
        borderRadius,
        boxShadow: shadow ? "0 4px 24px rgba(0,0,0,0.15)" : "none",
        padding: 32,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {photo ? (
        imageFormat === "circle" ? (
          <div
            style={{
              width: 120 * imageScale,
              height: 120 * imageScale,
              borderRadius: "50%",
              overflow: "hidden",
              marginBottom: 24,
              border: "4px solid #eee",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src={photo}
              alt="Employee"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: `${imagePositionX}% ${imagePositionY}%`,
              }}
            />
          </div>
        ) : (
          <div
            style={{
              width: "calc(100% + 64px)", // fill card width, including padding
              marginLeft: -32,
              marginRight: -32,
              height: 160 * imageScale,
              overflow: "hidden",
              borderTopLeftRadius: borderRadius,
              borderTopRightRadius: borderRadius,
              marginTop: -32,
              marginBottom: 24,
              position: "relative",
            }}
          >
            <img
              src={photo}
              alt="Employee"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: `${imagePositionX}% ${imagePositionY}%`,
                display: "block",
              }}
            />
          </div>
        )
      ) : (
        <div
          style={{
            width: 120,
            height: 120,
            borderRadius: imageFormat === "circle" ? "50%" : 12,
            background: "#f0f0f0",
            marginBottom: 24,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#bbb",
            fontSize: 32,
          }}
        >
          ?
        </div>
      )}
      <h2 style={{ margin: 0, color: fontColorName, textAlign: "center" }}>{name || "Employee Name"}</h2>
      <div style={{
        display: "inline-block",
        background: positionBgColor,
        color: fontColorPosition,
        borderRadius: positionRadius,
        padding: `${positionPaddingY}px ${positionPaddingX}px`,
        margin: "16px 0 16px 0",
        fontWeight: 500,
        fontSize: 16,
        textAlign: "center",
        alignSelf: "center",
      }}>{position || "Position"}</div>
      {cardData.smallDescription ? (
        <div style={{ marginBottom: 8, color: fontColorSmallDescription, fontSize: 15, textAlign: "left" }}>{cardData.smallDescription}</div>
      ) : (
        <div style={{ marginBottom: 8, color: "#bbb", fontSize: 15, textAlign: "left", fontStyle: "italic" }}>
          Some placeholder to describe the person here, you can add a few words
        </div>
      )}
      <div style={{
        background: funFactsBgColor,
        borderRadius: funFactsRadius,
        padding: `${funFactsPadding}px 8px`,
        margin: "16px 0",
        width: "100%"
      }}>
        <ul style={{ alignSelf: "stretch", margin: 0, marginBottom: 0, paddingLeft: 32, color: fontColorFunFacts, textAlign: "left" }}>
          {funFacts && funFacts.filter(Boolean).length > 0 ? (
            funFacts.filter(Boolean).map((fact, i) => (
              <li key={i}>{fact}</li>
            ))
          ) : (
            <li>Fun facts about this person</li>
          )}
        </ul>
      </div>
      <div style={{ marginTop: 16, marginBottom: 8, width: "100%", textAlign: "center", color: fontColorGreeting }}>
        {greeting || "Welcome to the team!"}
      </div>
      {cardData.dateOfJoining && (
        <div style={{ width: "100%", textAlign: "center", color: fontColorDate, fontSize: 14 }}>
          Joined: {cardData.dateOfJoining ? new Date(cardData.dateOfJoining).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : ''}
        </div>
      )}
      {/* Logo absolute positioned */}
      {cardData.logo && (
        <img
          src={cardData.logo}
          alt="Logo"
          style={{
            position: "absolute",
            width: settings.logoSize,
            objectFit: "contain",
            right: `${100 - settings.logoPositionX}%`,
            top: `${settings.logoPositionY}%`,
            zIndex: 2,
            borderRadius: 8,
            transform: "translateY(0)",
          }}
        />
      )}
    </div>
  );
} 