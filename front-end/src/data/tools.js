import { KeyRound, Hash, Lock, Code, Globe, Calendar, Ruler, Link, ShieldCheck, ImagePlay, QrCode } from "lucide-react";

export const tools = [
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
        name: "Wi-Fi QR Generator",
        path: "/wifi-qr",
        icon: <QrCode size={18} />, 
        description: "Generate a QR code to connect to Wi-Fi networks easily.",
      },
    ],
  },
];