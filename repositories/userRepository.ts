import firebaseConfig from '../config/firebaseConfig';
import bcrypt from "bcryptjs";

import {
  getFirestore,
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
} from 'firebase/firestore';

const db = getFirestore(firebaseConfig);

const usersCollection = collection(db, 'users');

interface UserBaseData {
  name: string;
  email: string;
  password: string;
  age: number;
}

interface UserData extends UserBaseData {
  id: string;
}

interface UserSafeData extends Omit<UserData, 'password'> {}

const UserRepository = {
  addUser: async (userData: UserData): Promise<string> => {
    const filteredUserData: UserBaseData = {
      name: userData.name,
      email: userData.email,
      password: await bcrypt.hash(userData.password, 10),
      age: parseInt(userData.age.toString())
    };
    const userRef = await addDoc(usersCollection, filteredUserData as UserData);
    return userRef.id;
  },
  getUser: async (uid: string): Promise<UserSafeData | null> => {
    const userRef = doc(usersCollection, uid);
    const docSnap = await getDoc(userRef);
    if (!docSnap.exists()) {
      return null;
    }
    const userData = docSnap.data() as UserBaseData;
    
    const { password, ...userDataWithoutPassword } = userData;
    return {id: docSnap.id, ...userDataWithoutPassword};
  },
  getUserByEmail: async (email: string): Promise<UserData | null> => {
    try {
      const q = query(usersCollection, where('email', '==', email));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        return null;
      } else {
        const userData = querySnapshot.docs[0].data() as UserBaseData
        
        return {id: querySnapshot.docs[0].id, ...userData};
      }
    } catch (error) {
      console.error('Error getting user by email:', error);
      throw error;
    }
  },
  updateUser: async (id: string, updateData: Partial<UserData>): Promise<void> => {
    const userRef = doc(usersCollection, id);
    const filteredUserData: Partial<UserSafeData> = {
      ...(updateData.name && {name: updateData.name}),
      ...(updateData.email && {email: updateData.email}),
      ...(updateData.age && {age: parseInt(updateData.age.toString())})
    };
    await updateDoc(userRef, filteredUserData);
  },
  deleteUser: async (uid: string): Promise<void> => {
    const userRef = doc(usersCollection, uid);
    await deleteDoc(userRef);
  },
  getUsers: async (): Promise<UserSafeData[]> => {
    const snapshot = await getDocs(usersCollection);
    const users: UserSafeData[] = [];
    snapshot.forEach((doc) => {
      const userData = doc.data() as UserData;
      
      const { password, ...userDataWithoutPassword } = userData as UserBaseData;
      users.push({id: doc.id, ...userDataWithoutPassword} as UserSafeData);
    });
    return users;
  }
};

export default UserRepository;