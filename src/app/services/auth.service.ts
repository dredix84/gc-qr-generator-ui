import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFirestore, AngularFirestoreDocument } from "angularfire2/firestore";
import { AngularFirestoreCollection } from "angularfire2/firestore";
import { AngularFireDatabase } from "angularfire2/database";
import { AngularFireAuth } from "angularfire2/auth";
import { Observable, of } from "rxjs";
import { switchMap } from 'rxjs/operators';
import { User } from './user.model';
import { auth } from 'firebase';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$: Observable<any>;

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router
  ) {
    this.user$ = this.afAuth.authState.pipe(
      switchMap(user => {
        if(user) {
          return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      })
    );
  }

  async googleSignin() {
    const provider = new auth.GoogleAuthProvider();
    const credential = await this.afAuth.auth.signInWithPopup(provider);
    this.router.navigate(['/home']);
    return this.updateUserData(credential.user);
  }

  async signOut() {
    await this.afAuth.auth.signOut();
    this.router.navigate(['/login'])
  }

  public updateUserData(user) {
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);

    const data = {
      uid: user.uid,
      email: user.email
    };

    return userRef.set(data, {merge: true});
  }

  updateUser(userId, data) {
    this.afs.doc(`users/${userId}`).update(data);
  }
}
