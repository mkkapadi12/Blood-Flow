/**
 * Seed script — run once to populate hospitals collection
 * Usage: node server/scripts/seedHospitals.js
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
  },
  {
    name: "Anand Surgical Hospital Ltd.",
    city: "Ahmedabad",
    address: "5, Janta Chamber, Near Saijpur Tower, Naroda Road, Ahmedabad",
    rohiniCode: "8900080082915",
  },
  {
    name: "Apollo Hospital",
    city: "Ahmedabad",
    address: "PLOT NO - 1A GIDC, BHAT, NR. INDIRA BRIDGE, G' NAGAR",
    rohiniCode: "8900080083493",
  },
  {
    name: "Bavishi Eye Hospital",
    city: "Ahmedabad",
    address:
      "1, Tapovan Soc, 1st floor, Nehrunagar Char Rasta, Opp. BRTS bus Stop, satellite road, Satellite, ahmedabad",
    rohiniCode: "8900080078840",
  },
  {
    name: "Boon IVF Center",
    city: "Ahmedabad",
    address:
      "2, Sumangalam Society, Near HDFC Bank, Opp. Drive In Cinema, Bodakdev, Ahmedabad 380054",
    rohiniCode: "8900080283084",
  },
  {
    name: "Chhabra Eye Hospital",
    city: "Ahmedabad",
    address:
      "5, 1st Floor, Gold Coin B Complex, Satelite Road, Ahmedabad. 380015",
    rohiniCode: "8900080078864",
  },
  {
    name: "Clear Vision Eye Hospital-PALDI",
    city: "Ahmedabad",
    address:
      "22/A, Dungarsingh Nagar Society, Paldi, Anjali, Bhattha, Ahmedabad, 380007",
    rohiniCode: "8900080333130",
  },
  {
    name: "Clear Vision Eye Hospital-SATELITE",
    city: "Ahmedabad",
    address:
      "411/L1,Shital Varsha complex,opp Harit Jhveri,Shivranjani cross roads,satellite,ahmedabad 380015",
    rohiniCode: "8900080494459",
  },
  {
    name: "Clear Vision Eye Hospital-MANINAGAR",
    city: "Ahmedabad",
    address: "Opp L G Hospital, maninagar, Ahmedabad",
    rohiniCode: "8900080091238",
  },
  {
    name: "Clear Vision Eye Hospital-SABARMATI",
    city: "Ahmedabad",
    address:
      "G-2, Trade Square, Near Torrent Power House, Sabarmati, Ahmedabad, 380005.",
    rohiniCode: "8900080331204",
  },
  {
    name: "Divyam Eye Hospital",
    city: "Ahmedabad",
    address:
      "101 Shivalik Five, Opp Shivalik High Street, S G Road, Ahmedabad 380054",
    rohiniCode: "8900080333156",
  },
  {
    name: "Dr. Agarwal's Eye Hospital",
    city: "Ahmedabad",
    address:
      "301-302, 3rd Floor, Shivalik Shilp, Iscon Cross Road, S.G. Highway, Ahmedabad-380015",
    rohiniCode: "8900080504929",
  },
  {
    name: "Dr. Jivraj Mehta Smarak Health Foundation",
    city: "Ahmedabad",
    address: "Nehru Nagar, Ambawadi, Ahmedabad-380015",
    rohiniCode: "8900080078953",
  },
  {
    name: "Fortis Hiranandani Hospital",
    city: "Ahmedabad",
    address: "Plot No. 25, Near BDCA College, Sector-10, Gandhinagar-382010",
    rohiniCode: "8900080296390",
  },
  {
    name: "Galaxy Eye Care",
    city: "Ahmedabad",
    address:
      "B-6, Satsang Shopping Centre, Nr. Nehrunagar Cross Roads, Ambawadi, Ahmedabad-380015",
    rohiniCode: "8900080333113",
  },
  {
    name: "Gujarat Cancer & Research Institute",
    city: "Ahmedabad",
    address: "Civil Hospital Campus, Asarwa, Ahmedabad-380016",
    rohiniCode: "8900080079093",
  },
  {
    name: "H L Trivedi Institute Of Medical Science And Research",
    city: "Ahmedabad",
    address: "ONGC Road, Chandkheda Ahmedabad-382424",
    rohiniCode: "8900080079136",
  },
  {
    name: "Heena Cardiac Center",
    city: "Ahmedabad",
    address: "402 Yash Complex, Nehrunagar Char Rasta, Ambawadi, Ahmedabad",
    rohiniCode: "8900080490736",
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

    await mongoose.disconnect();
    console.log("Done!");
    process.exit(0);
  } catch (err) {
    console.error("Seed error:", err);
    process.exit(1);
  }
};

seed();
