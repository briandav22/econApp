import firebase from 'firebase/app';
import 'firebase/firestore'
import 'firebase/auth'

const config = {

        apiKey: "AIzaSyDnWhHiYs1tEZ0sXz7dqbCS3uX_V-rtKoo",
        authDomain: "crwn-db-7aed1.firebaseapp.com",
        databaseURL: "https://crwn-db-7aed1.firebaseio.com",
        projectId: "crwn-db-7aed1",
        storageBucket: "crwn-db-7aed1.appspot.com",
        messagingSenderId: "505284757291",
        appId: "1:505284757291:web:6efa812a5a1f3423dda76e",
        measurementId: "G-R1WX00VE75"

}

export const createUserProfileDocument = async (userAuth, addtionalData) => {
 

        if (!userAuth) return;
        const userRef = firestore.doc(`users/${userAuth.uid}`)
  
        const snapShot = await userRef.get();
 
        if(!snapShot.exists) {
                const {displayName, email} = userAuth;
                const createdAt = new Date();

                try {
                        await userRef.set({
                                displayName,
                                email,
                                createdAt,
                                ...addtionalData
                        })
                                
                }catch (error) {
                        console.log('error creating user')
                }
        }
        return userRef;

}

firebase.initializeApp(config);

export const addCollectionAndItems = async (collectionKey, objectsToAdd)=>{
        const collectionRef = firestore.collection(collectionKey);
        console.log(collectionRef)

        const batch = firestore.batch();

        objectsToAdd.forEach((obj)=>{
                const newDocRef = collectionRef.doc();
                batch.set(newDocRef, obj);
        });

        return await batch.commit();

}

export const convertCollectionsSnapshotToMap = (collections) => {
        const transformedCollections = collections.docs.map((doc)=>{
                const {title, items} = doc.data();

                return {
                        routeName: encodeURI(title.toLowerCase()),
                        id:doc.id,
                        title,
                        items
                }
        
        })

        return transformedCollections.reduce((accumulator, collection) => {
               accumulator[collection.title.toLowerCase()] = collection;
               return accumulator
       }, {})
}
export const auth = firebase.auth();
export const firestore = firebase.firestore();

const provider = new firebase.auth.GoogleAuthProvider();
provider.setCustomParameters({prompt:'select_account'});

export const signInWithGoogle = () =>auth.signInWithPopup(provider);

export default firebase;