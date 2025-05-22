import { db } from "../../lib/firebaseConfig.js"; // Adjust the import path as necessary
// Import the functions you need from the SDKs you need
import { doc, getDoc } from "firebase/firestore";

async function getUser() {
  const documentReference = doc(db, "users", "HUNA1fvp8znqjRpnYBbp");
  const documentSnapshot = await getDoc(documentReference);

  if (documentSnapshot.exists()) {
    console.log("Document data:", documentSnapshot.data());
    return documentSnapshot.data();
  } else {
    // docSnap.data() will be undefined in this case
    console.log("No such document!");
  }
}

async function createUser() {}

export { getUser, createUser };
