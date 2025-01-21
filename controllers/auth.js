const { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } = require("firebase/auth");
const {  collection, addDoc, getDocs, query, getDoc, doc } = require("firebase/firestore");
const {auth, db} =require("../config/firebase")


const SignUp = async (req, res) => {
    const { email, password, firstName, lastName } = req.body;
    try {
        const user = await createUserWithEmailAndPassword(auth, email, password);
        const docRef = await addDoc(collection(db, "users"), {
            email: email,
            firstName: firstName, 
            lastName: lastName,
            password:password
        });
        res.json({ message: "User created successfully", user: user, docRef: docRef.id });
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
};

    const Login = async (req, res) => {
        const { email, password } = req.body;
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid))
            res.json({ message: "User logged in successfully", user: userCredential.user, userDoc
            });
        } catch(error){
            console.error(error)
            res.status(400).json({ message: error.message });
        }
    }
    const resetPassword = async (req, res) =>{
        const { email } = req.body;
        try{
            await sendPasswordResetEmail(auth, email)
            res.json({ message: "Password reset email sent" });
            }catch(error){
                console.error(error)
                res.status(400).json({message: error.message})
            }
    }
module.exports = {
    SignUp,
    Login,
    resetPassword
};