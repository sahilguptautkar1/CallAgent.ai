import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, set, push } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBxC-k0Wss_kaRgLjTWC_2E3KzCtCVI5eM",
  authDomain: "human-in-loop-ai-supervisor.firebaseapp.com",
  databaseURL:
    "https://human-in-loop-ai-supervisor-default-rtdb.firebaseio.com",
  projectId: "human-in-loop-ai-supervisor",
  storageBucket: "human-in-loop-ai-supervisor.firebasestorage.app",
  messagingSenderId: "32047587312",
  appId: "1:32047587312:web:3ea7f585edd7aa5a780735",
  measurementId: "G-GDRWN82RP9",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db, ref, onValue, set, push };
