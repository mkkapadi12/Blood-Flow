/**
 * Seed script — run once to populate hospitals collection
 * Usage: node server/data/Seedhospitals.js
 */

require("dotenv").config({
  path: require("path").resolve(__dirname, "../.env"),
});
const mongoose = require("mongoose");
const HOSPITAL = require("../models/hospital.model");

const hospitals = [
  {
    name: "Aarna Superspeciality Hospital",
    city: "Ahmedabad",
    address:
      "Uro Cure House, Opp. Suvidha Shopping Centre, Nr. Parimal Under Bridge, Paldi, Ahmedabad - 7",
    rohiniCode: "8900080340107",
    location: {
      type: "Point",
      coordinates: [72.5663, 23.0204], // [lng, lat] — Paldi area
    },
  },
  {
    name: "Anand Surgical Hospital Ltd.",
    city: "Ahmedabad",
    address: "5, Janta Chamber, Near Saijpur Tower, Naroda Road, Ahmedabad",
    rohiniCode: "8900080082915",
    location: {
      type: "Point",
      coordinates: [72.6462, 23.0712], // Naroda Road area
    },
  },
  {
    name: "Apollo Hospital",
    city: "Ahmedabad",
    address: "PLOT NO - 1A GIDC, BHAT, NR. INDIRA BRIDGE, G' NAGAR",
    rohiniCode: "8900080083493",
    location: {
      type: "Point",
      coordinates: [72.6341, 23.1208], // Bhat, near Indira Bridge
    },
  },
  {
    name: "ASG Bavishi Eye Hospitals",
    city: "Ahmedabad",
    address:
      "1, Tapovan Soc, 1st floor, Nehrunagar Char Rasta, Opp. BRTS bus Stop, satellite road, Satellite, ahmedabad",
    rohiniCode: "8900080078840",
    location: {
      type: "Point",
      coordinates: [72.54335922040477, 23.02301054318537], // Satellite / Nehrunagar area
    },
  },
  {
    name: "Boon IVF Center",
    city: "Ahmedabad",
    address:
      "2, Sumangalam Society, Near HDFC Bank, Opp. Drive In Cinema, Bodakdev, Ahmedabad 380054",
    rohiniCode: "8900080283084",
    location: {
      type: "Point",
      coordinates: [72.5101, 23.0445], // Bodakdev / Drive-In area
    },
  },
  {
    name: "Chhabra Eye Hospital",
    city: "Ahmedabad",
    address:
      "5, 1st Floor, Gold Coin B Complex, Satelite Road, Ahmedabad. 380015",
    rohiniCode: "8900080078864",
    location: {
      type: "Point",
      coordinates: [72.5201, 23.0312], // Satellite Road
    },
  },
  {
    name: "Clear Vision Eye Hospital-PALDI",
    city: "Ahmedabad",
    address:
      "22/A, Dungarsingh Nagar Society, Paldi, Anjali, Bhattha, Ahmedabad, 380007",
    rohiniCode: "8900080333130",
    location: {
      type: "Point",
      coordinates: [72.5672, 23.0189], // Paldi / Anjali
    },
  },
  {
    name: "Clear Vision Eye Hospital-SATELITE",
    city: "Ahmedabad",
    address:
      "411/L1, Shital Varsha complex, opp Harit Jhveri, Shivranjani cross roads, satellite, ahmedabad 380015",
    rohiniCode: "8900080494459",
    location: {
      type: "Point",
      coordinates: [72.5272, 23.0276], // Shivranjani crossroads
    },
  },
  {
    name: "CLEAR VISION EYE HOSPITAL SHELA",
    city: "Ahmedabad",
    address:
      "Kavisha Atria, 103, Club O7 Rd, opp. Turquoise Blue, Shela, Gujarat 380057",
    rohiniCode: "8900080494463",
    location: {
      type: "Point",
      coordinates: [72.45652676736896, 23.011605105449078],
    },
  },
  {
    name: "Clear Vision Eye Hospital-MANINAGAR",
    city: "Ahmedabad",
    address: "Opp L G Hospital, maninagar, Ahmedabad",
    rohiniCode: "8900080091238",
    location: {
      type: "Point",
      coordinates: [72.6019, 22.9956], // Maninagar / LG Hospital
    },
  },
  {
    name: "Clear Vision Eye Hospital-SABARMATI",
    city: "Ahmedabad",
    address:
      "G-2, Trade Square, Near Torrent Power House, Sabarmati, Ahmedabad, 380005.",
    rohiniCode: "8900080331204",
    location: {
      type: "Point",
      coordinates: [72.5824, 23.0891], // Sabarmati area
    },
  },
  {
    name: "Divyam Eye Hospital",
    city: "Ahmedabad",
    address:
      "101 Shivalik Five, Opp Shivalik High Street, S G Road, Ahmedabad 380054",
    rohiniCode: "8900080333156",
    location: {
      type: "Point",
      coordinates: [72.5074, 23.0512], // SG Road / Shivalik area
    },
  },
  {
    name: "Dr. Agarwal's Eye Hospital",
    city: "Ahmedabad",
    address:
      "301-302, 3rd Floor, Shivalik Shilp, Iscon Cross Road, S.G. Highway, Ahmedabad-380015",
    rohiniCode: "8900080504929",
    location: {
      type: "Point",
      coordinates: [72.5062, 23.0441], // Iscon cross road, SG Highway
    },
  },
  {
    name: "Dr. Jivraj Mehta Smarak Health Foundation",
    city: "Ahmedabad",
    address: "Nehru Nagar, Ambawadi, Ahmedabad-380015",
    rohiniCode: "8900080078953",
    location: {
      type: "Point",
      coordinates: [72.5544, 23.0228], // Ambawadi / Nehru Nagar
    },
  },
  {
    name: "Fortis Hiranandani Hospital",
    city: "Ahmedabad",
    address: "Plot No. 25, Near BDCA College, Sector-10, Gandhinagar-382010",
    rohiniCode: "8900080296390",
    location: {
      type: "Point",
      coordinates: [72.6471, 23.2156], // Gandhinagar Sector-10
    },
  },
  {
    name: "Galaxy Eye Care",
    city: "Ahmedabad",
    address:
      "B-6, Satsang Shopping Centre, Nr. Nehrunagar Cross Roads, Ambawadi, Ahmedabad-380015",
    rohiniCode: "8900080333113",
    location: {
      type: "Point",
      coordinates: [72.5537, 23.0239], // Nehrunagar crossroads, Ambawadi
    },
  },
  {
    name: "Gujarat Cancer & Research Institute",
    city: "Ahmedabad",
    address: "Civil Hospital Campus, Asarwa, Ahmedabad-380016",
    rohiniCode: "8900080079093",
    location: {
      type: "Point",
      coordinates: [72.5983, 23.0472], // Civil Hospital / Asarwa
    },
  },
  {
    name: "H L Trivedi Institute Of Medical Science And Research",
    city: "Ahmedabad",
    address: "ONGC Road, Chandkheda Ahmedabad-382424",
    rohiniCode: "8900080079136",
    location: {
      type: "Point",
      coordinates: [72.6027, 23.1109], // Chandkheda / ONGC Road
    },
  },
  {
    name: "Heena Cardiac Center",
    city: "Ahmedabad",
    address: "402 Yash Complex, Nehrunagar Char Rasta, Ambawadi, Ahmedabad",
    rohiniCode: "8900080490736",
    location: {
      type: "Point",
      coordinates: [72.5541, 23.0233], // Nehrunagar Char Rasta, Ambawadi
    },
  },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("MongoDB connected");

    await HOSPITAL.deleteMany({});
    console.log("Cleared existing hospitals");

    const inserted = await HOSPITAL.insertMany(hospitals);
    console.log(`Seeded ${inserted.length} hospitals`);

    // Verify 2dsphere index is active
    const indexes = await HOSPITAL.collection.indexes();
    const has2dsphere = indexes.some((idx) =>
      Object.values(idx.key).includes("2dsphere"),
    );
    console.log(`2dsphere index active: ${has2dsphere}`);

    await mongoose.disconnect();
    console.log("Done!");
    process.exit(0);
  } catch (err) {
    console.error("Seed error:", err);
    process.exit(1);
  }
};

seed();
