import axios from "axios";
import { KeyRound, Hash, Lock, Code, Globe, Calendar, Ruler, Link, ShieldCheck, ImagePlay, QrCode } from "lucide-react";

// Static fallback tools with icons and descriptions
const staticTools = [
  {
    category: "Crypto",
    icon: <Lock size={18} />,
    items: [
      {
        id: 1, // Add static IDs for fallback
        name: "Token Generator",
        path: "/token-generator",
        icon: <KeyRound size={18} />,
        description: "Generate random string with the chars you want, uppercase or...",
      },
      {
        id: 2,
        name: "Hash Text",
        path: "/hash-text",
        icon: <Hash size={18} />,
        description: "Hash a text string using MD5, SHA-256, SHA-512...",
      },
      {
        id: 3,
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
        id: 4,
        name: "Date-Time Converter",
        path: "/date-time",
        icon: <Calendar size={18} />,
        description: "Convert timestamps to readable dates.",
      },
      {
        id: 5,
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
        id: 6,
        name: "URL Parser",
        path: "/url-parser",
        icon: <Link size={18} />,
        description: "Parse and analyze URLs quickly.",
      },
      {
        id: 7,
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
        id: 8,
        name: "Wi-Fi QR Code Generator",
        path: "/wifi-qr",
        icon: <QrCode size={18} />,
        description: "Generate a QR code to connect to Wi-Fi networks easily.",
      },
    ],
  },
];

// Function to fetch and merge tools from backend
export const fetchTools = async () => {
  try {
    const response = await axios.get("http://localhost:5074/api/tools/list");
    const backendTools = response.data;

    // Group backend tools by category
    const groupedTools = backendTools.reduce((acc, tool) => {
      const categoryName = tool.category || "Uncategorized";
      let category = acc.find((cat) => cat.category === categoryName);

      if (!category) {
        const staticCategory = staticTools.find((cat) => cat.category === categoryName);
        category = {
          category: categoryName,
          icon: staticCategory ? staticCategory.icon : <Code size={18} />,
          items: [],
        };
        acc.push(category);
      }

      const staticCategory = staticTools.find((cat) => cat.category === categoryName);
      const staticTool = staticCategory?.items.find((item) => item.name === tool.name);

      category.items.push({
        id: tool.id, // Ensure backend id is used
        name: tool.name,
        path: tool.path,
        icon: staticTool ? staticTool.icon : <Code size={18} />,
        description: tool.description || staticTool?.description || "No description available",
      });

      return acc;
    }, []);

    return groupedTools;
  } catch (error) {
    console.error("Failed to fetch tools from backend:", error);
    return staticTools; // Fallback to static list
  }
};