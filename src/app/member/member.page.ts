import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { AngularFirestore } from "angularfire2/firestore";
import { AngularFirestoreCollection } from "angularfire2/firestore";
import { AngularFireDatabase } from "angularfire2/database";
import { AngularFireAuth } from "angularfire2/auth";
import { HttpClient } from "@angular/common/http";
import { ToastController } from "@ionic/angular";
import { Observable, of } from "rxjs";
import { switchMap } from "rxjs/operators";
import { ClipboardService } from "ngx-clipboard";
import { SocialSharing } from "@ionic-native/social-sharing/ngx";
import { AuthService } from "../services/auth.service";

@Component({
  selector: "app-member",
  templateUrl: "./member.page.html",
  styleUrls: ["./member.page.scss"],
})
export class MemberPage implements OnInit {
  files: Observable<any>;

  elementType: "url" | "canvas" | "img" = "canvas";
  values: any;

  memberId: any;
  filesData: any;
  data: any;
  file2Data: any = [];
  file3Data: any = [];
  obj: any;

  baseUrl = "https://qrcode-demo-aa1c5.web.app";
  // baseUrl = "http://localhost:4200";
  serverUrl = "https://thawing-sea-78543.herokuapp.com";

  constructor(
    public router: Router,
    private route: ActivatedRoute,
    public afAuth: AngularFireAuth,
    public afs: AngularFirestore,
    private http: HttpClient,
    public toastController: ToastController,
    private socialSharing: SocialSharing,
    private _clipboardService: ClipboardService,
    public auth: AuthService
  ) {}

  ngOnInit() {
    this.memberId = this.route.snapshot.params["memberId"];
    console.log(this.memberId);
    this.getFile();
    this.getFileFromUser();
  }

  getFileFromUser() {
    this.auth.user$.subscribe((user) => {
      if (user) {
        // user["filesId"] = this.newfilesId;
        // this.afs.doc(`users/${user.uid}`).set(user);
        console.log(user.filesId);
        for (let i = 0; i < user.filesId.length; i++) {
          this.afs
            .collection("files")
            .doc(user.filesId[i])
            .snapshotChanges()
            .subscribe((data) => {
              this.file2Data.push(data.payload.data());
              this.file2Data[i].id = data.payload.id;
              // console.log(this.file2Data);
              this.obj = this.file2Data.find(
                (el) => el.memberId === this.memberId
              );
              // console.log(this.obj);
              if (i === user.filesId.length - 1) {
                this.file3Data.push(this.obj);
                console.log(this.file2Data);
                console.log(this.file3Data);
              }
            });
        }
      }
    });
  }

  getFile() {
    this.afs
      .collection("files", (ref) => ref.where("memberId", "==", this.memberId))
      .snapshotChanges()
      .subscribe((data) => {
        this.filesData = data.map((e) => {
          return {
            id: e.payload.doc.id,
            groupName: e.payload.doc.data()["groupName"],
            groupId: e.payload.doc.data()["groupId"],
            memberId: e.payload.doc.data()["memberId"],
            lastName: e.payload.doc.data()["lastName"],
            firstName: e.payload.doc.data()["firstName"],
            gender: e.payload.doc.data()["gender"],
            relCode: e.payload.doc.data()["relCod"],
            perCode: e.payload.doc.data()["perCode"],
            verNo: e.payload.doc.data()["verNo"],
            dob: e.payload.doc.data()["dob"],
            createdDate: e.payload.doc.data()["createdDate"],
            track1: e.payload.doc.data()["track1"],
            track2: e.payload.doc.data()["track2"],
            updMember: e.payload.doc.data()["updMember"],
            effDate: e.payload.doc.data()["effDate"],
            fullName: e.payload.doc.data()["fullName"],
            fileName: e.payload.doc.data()["fileName"],
            createdUser: e.payload.doc.data()["createdUser"],
            expTime: e.payload.doc.data()["expTime"],
          };
        });
      });
  }

  async shareData(id) {
    let tempUrl = this.baseUrl + "/home" + "/qrcode/" + id;
    console.log(tempUrl);
    window.open(tempUrl, "_blank");
    this._clipboardService.copyFromContent(tempUrl);
    return this.socialSharing.share(
      "Check out the excel data.",
      "Data",
      "",
      tempUrl
    );
  }
}
