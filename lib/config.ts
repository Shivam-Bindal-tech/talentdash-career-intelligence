import { CompanyMetadata } from "@/types";

export const EXCHANGE_RATES = {
  // Conversion factors relative to USD (1 unit of currency to USD)
  INR: 0.012, // 1 INR = 0.012 USD
  USD: 1.0,   // 1 USD = 1.0 USD
  GBP: 1.25,  // 1 GBP = 1.25 USD
  EUR: 1.08,  // 1 EUR = 1.08 USD
};

export const COMPANY_METADATA: Record<string, CompanyMetadata> = {
  google: {
    name: "Google",
    slug: "google",
    industry: "Technology & Search",
    headquarters: "Mountain View, California, USA",
    foundedYear: 1998,
    headcountRange: "10,000+",
    description: "Google is a global technology leader focusing on search, cloud computing, online advertising, and artificial intelligence.",
  },
  amazon: {
    name: "Amazon",
    slug: "amazon",
    industry: "E-Commerce & Cloud Computing",
    headquarters: "Seattle, Washington, USA",
    foundedYear: 1994,
    headcountRange: "10,000+",
    description: "Amazon is a multinational tech giant focusing on e-commerce, cloud services (AWS), digital streaming, and AI.",
  },
  microsoft: {
    name: "Microsoft",
    slug: "microsoft",
    industry: "Technology & Software",
    headquarters: "Redmond, Washington, USA",
    foundedYear: 1975,
    headcountRange: "10,000+",
    description: "Microsoft is a leading developer of software, consumer electronics, personal computers, and cloud services.",
  },
  meta: {
    name: "Meta",
    slug: "meta",
    industry: "Social Media & Advertising",
    headquarters: "Menlo Park, California, USA",
    foundedYear: 2004,
    headcountRange: "10,000+",
    description: "Meta builds technologies that help people connect, find communities, and grow businesses, spanning Facebook, Instagram, and WhatsApp.",
  },
  nvidia: {
    name: "NVIDIA",
    slug: "nvidia",
    industry: "Semiconductors & AI",
    headquarters: "Santa Clara, California, USA",
    foundedYear: 1993,
    headcountRange: "10,000+",
    description: "NVIDIA pioneered GPU-accelerated computing and is a global leader in AI chips, visualization technologies, and gaming platforms.",
  },
  flipkart: {
    name: "Flipkart",
    slug: "flipkart",
    industry: "E-Commerce",
    headquarters: "Bengaluru, Karnataka, India",
    foundedYear: 2007,
    headcountRange: "10,000+",
    description: "Flipkart is one of India's leading e-commerce marketplaces, serving millions of customers across a wide range of categories.",
  },
  razorpay: {
    name: "Razorpay",
    slug: "razorpay",
    industry: "Fintech & Payments",
    headquarters: "Bengaluru, Karnataka, India",
    foundedYear: 2014,
    headcountRange: "1,000 - 5,000",
    description: "Razorpay is a leading Indian payments solution provider, helping businesses accept, process, and disburse payments.",
  },
  meesho: {
    name: "Meesho",
    slug: "meesho",
    industry: "Social Commerce",
    headquarters: "Bengaluru, Karnataka, India",
    foundedYear: 2015,
    headcountRange: "1,000 - 5,000",
    description: "Meesho is a social e-commerce platform that enables small businesses and individuals to start online stores via social channels.",
  },
  tcs: {
    name: "TCS",
    slug: "tcs",
    industry: "IT Services & Consulting",
    headquarters: "Mumbai, Maharashtra, India",
    foundedYear: 1968,
    headcountRange: "10,000+",
    description: "Tata Consultancy Services (TCS) is a global leader in IT services, consulting, and business solutions.",
  },
  infosys: {
    name: "Infosys",
    slug: "infosys",
    industry: "IT Services & Consulting",
    headquarters: "Bengaluru, Karnataka, India",
    foundedYear: 1981,
    headcountRange: "10,000+",
    description: "Infosys is a multinational corporation providing business consulting, information technology, and outsourcing services.",
  },
  wipro: {
    name: "Wipro",
    slug: "wipro",
    industry: "IT Services & Consulting",
    headquarters: "Bengaluru, Karnataka, India",
    foundedYear: 1945,
    headcountRange: "10,000+",
    description: "Wipro is a leading global information technology, consulting, and business process services company.",
  },
  zepto: {
    name: "Zepto",
    slug: "zepto",
    industry: "Quick Commerce & Logistics",
    headquarters: "Mumbai, Maharashtra, India",
    foundedYear: 2021,
    headcountRange: "1,000 - 5,000",
    description: "Zepto is one of India's fastest-growing quick-commerce startups, delivering groceries and essentials in minutes.",
  },
  "advanced-micro-devices-semiconductors-international-corporation": {
    name: "Advanced Micro Devices Semiconductors International Corporation",
    slug: "advanced-micro-devices-semiconductors-international-corporation",
    industry: "Semiconductors & CPU/GPU Design",
    headquarters: "Santa Clara, California, USA",
    foundedYear: 1969,
    headcountRange: "10,000+",
    description: "Advanced Micro Devices Semiconductors International Corporation is a global semiconductor manufacturer designing computer processors and technologies.",
  },
};
