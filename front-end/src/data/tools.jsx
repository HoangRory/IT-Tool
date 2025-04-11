import axios from "axios";
import React, { useState, useEffect } from "react";
import { KeyRound, Hash, Lock, Code, Globe, Calendar, Ruler, Link, ShieldCheck, ImagePlay, QrCode } from "lucide-react";

// Static fallback tools with icons and descriptions
const staticTools = [
  {
    category: "Crypto",
    icon: <Lock size={18} />,
    items: [
      {
        name: "Token Generator",
        path: "/token-generator",
        icon: <KeyRound size={18} />,
        description: "Generate random string with the chars you want, uppercase or...",
      },
      {
        name: "Hash Text",
        path: "/hash-text",
        icon: <Hash size={18} />,
        description: "Hash a text string using MD5, SHA-256, SHA-512...",
      },
      {
        name: "Bcrypt",
        path: "/bcrypt",
        icon: <Lock size={18} />,
        description: "Encrypt and compare passwords securely using bcrypt.",
      },
    ],
  },
  {
    category: "Converter",
    icon: <Code size={18} />,
    items: [
      {
        name: "Date-Time Converter",
        path: "/date-time",
        icon: <Calendar size={18} />,
        description: "Convert timestamps to readable dates.",
      },
      {
        name: "Unit Converter",
        path: "/unit-converter",
        icon: <Ruler size={18} />,
        description: "Convert units of measurement easily.",
      },
    ],
  },
  {
    category: "Web",
    icon: <Globe size={18} />,
    items: [
      {
        name: "URL Parser",
        path: "/url-parser",
        icon: <Link size={18} />,
        description: "Parse and analyze URLs quickly.",
      },
      {
        name: "JWT Parser",
        path: "/jwt-parser",
        icon: <ShieldCheck size={18} />,
        description: "Decode and verify JSON Web Tokens.",
      },
    ],
  },
  {
    category: "Images & Videos",
    icon: <ImagePlay size={18} />,
    items: [
      {
        name: "Wi-Fi QR Code Generator",
        path: "/wifi-qr",
        icon: <QrCode size={18} />,
        description: "Generate a QR code to connect to Wi-Fi networks easily.",
      },
    ],
  },
];

// Function to fetch and merge tools from backend
const fetchToolsFromBackend = async () => {
  try {
    const response = await axios.get("http://localhost:5074/api/tools/list");
    const backendTools = response.data;

    // Group backend tools by category
    const groupedTools = backendTools.reduce((acc, tool) => {
      const categoryName = tool.category || "Uncategorized";
      let category = acc.find((cat) => cat.category === categoryName);

      if (!category) {
        // Use static category icon if available, else a default
        const staticCategory = staticTools.find((cat) => cat.category === categoryName);
        category = {
          category: categoryName,
          icon: staticCategory ? staticCategory.icon : <Code size={18} />, // Default icon
          items: [],
        };
        acc.push(category);
      }

      // Map backend path to frontend path
      const frontendPath = tool.path.replace("/api/tools", "");
      console.log(tool.path);
      // Check if tool exists in static list for icon and description
      const staticCategory = staticTools.find((cat) => cat.category === categoryName);
      const staticTool = staticCategory?.items.find((item) => item.name === tool.name);

      category.items.push({
        name: tool.name,
        path: frontendPath,
        icon: staticTool ? staticTool.icon : <Code size={18} />, // Default icon for new tools
        description: tool ? tool.description : "No description available",
      });

      return acc;
    }, []);

    return groupedTools;
  } catch (error) {
    console.error("Failed to fetch tools from backend:", error);
    return staticTools; // Fallback to static list on error
  }
};

// Initialize tools with static data, update with backend data
let tools = staticTools;

// Fetch tools at module load (top-level await requires ESM support)
(async () => {
  tools = await fetchToolsFromBackend();
})();

function ToolFetcher() {
  const [tools, setTools] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5074/') // Backend root
      .then(response => response.json())
      .then(data => {
        setTools(data); // Store the data in state (optional)
        console.log('Fetched tools:', data); // Log the data
      })
      .catch(error => console.error('Error fetching tools:', error));
  }, []); // Runs once on mount

  // Return null to render nothing
  return null;
}

export { tools, ToolFetcher };