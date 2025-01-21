const { collection, addDoc, getDocs, deleteDoc, doc } = require("firebase/firestore");
const { db } = require('../config/firebase'); 


const addUser = async (req, res) => {
    console.log("Request body:", req.body);
    
    const { firstName, lastName, phone, gender,position,idNumber ,email,image } = req.body;
  
    if (!firstName || !lastName || !phone || !gender  || !position || !idNumber || !email || !image ) {
      return res.status(400).json({ message: "First name and last name are required." });
    }
  
    try {
      await addDoc(collection(db, "employees"), { firstName, lastName, phone, gender, idNumber, position, email , image });
      res.json({ message: "Employee added successfully" });
    } catch (error) {
      console.error("Error adding employee", error);
      res.status(500).json({ message: "Error adding employee" });
    }
  };
  


const getUsers = async (req, res) => {
  try {
    console.log("GET request to /getUsers");
    const employeeCollection = collection(db, "employees");
    const snapshot = await getDocs(employeeCollection);
    
  
    if (snapshot.empty) {
      console.log("No matching documents.");
      return res.status(404).json({ message: "No employees found." });
    }

    const employees = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log("Employees retrieved:", employees);
    res.json(employees);
  } catch (error) {
    console.error("Error retrieving employees", error);
    res.status(500).json({ message: "Error retrieving employees" });
  }
};


const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    await deleteDoc(doc(db, "employees", id));
    res.json({ message: `Employee with ID ${id} deleted successfully` });
  } catch (error) {
    console.error("Error deleting employee", error);
    res.status(500).json({ message: "Error deleting employee" });
  }
};


module.exports = {
  addUser,
  getUsers,
  deleteUser,
};