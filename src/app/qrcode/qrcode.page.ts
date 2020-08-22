import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { AngularFirestore } from "angularfire2/firestore";
import { AngularFirestoreCollection } from "angularfire2/firestore";
import { AngularFireDatabase } from "angularfire2/database";
import { AngularFireAuth } from "angularfire2/auth";
import { HttpClient } from "@angular/common/http";
import { ToastController } from "@ionic/angular";
import { ClipboardService } from "ngx-clipboard";
import { AuthService } from "../services/auth.service";
import { SocialSharing } from "@ionic-native/social-sharing/ngx";
import { Console } from "console";
import { LoadingController } from "@ionic/angular";

@Component({
  selector: "app-qrcode",
  templateUrl: "./qrcode.page.html",
  styleUrls: ["./qrcode.page.scss"],
})
export class QrcodePage implements OnInit {
  elementType: "url" | "canvas" | "img" = "canvas";
  values: any;

  id: any;
  token: any;
  filesData: any = [];
  message = "";
  fileData: any = [];
  qrdata: any = "";

  serverUrl = "https://thawing-sea-78543.herokuapp.com";
  localUrl = "http://localhost:3000";
  baseUrl = "https://qrcode-demo-aa1c5.web.app";
  // baseUrl = "http://localhost:4200";
  url: any;
  public user: any = false;
  data: any;
  memberId: any;
  mail: any;

  constructor(
    public router: Router,
    private route: ActivatedRoute,
    public afAuth: AngularFireAuth,
    public afs: AngularFirestore,
    private http: HttpClient,
    public toastController: ToastController,
    private _clipboardService: ClipboardService,
    private auth: AuthService,
    private socialSharing: SocialSharing,
    public loadingController: LoadingController
  ) {}

  ngOnInit() {
    this.auth.user$.subscribe((user) => {
      if (user) {
        console.log(user);
        this.user = true;
      } else {
        console.log("no user found.");
      }
    });
    this.id = this.route.snapshot.params["id"];
    this.token = this.route.snapshot.params["token"];
    console.log(this.token);
    // this.afs.collection("files").doc(this.id).valueChanges().subscribe((data) => {
    //   this.data = data;
    // })
    // this.afs
    // .collection("files", (ref) => ref.where("memberId", "==", this.memberId))
    // .snapshotChanges()
    // .subscribe((data) => {
    //   this.fileData = data.map((e) => {
    //     return {
    //       id: e.payload.doc.id,
    //       groupName: e.payload.doc.data()["groupName"],
    //       groupId: e.payload.doc.data()["groupId"],
    //       memberId: e.payload.doc.data()["memberId"],
    //       lastName: e.payload.doc.data()["lastName"],
    //       firstName: e.payload.doc.data()["firstName"],
    //       gender: e.payload.doc.data()["gender"],
    //       relCode: e.payload.doc.data()["relCod"],
    //       perCode: e.payload.doc.data()["perCode"],
    //       verNo: e.payload.doc.data()["verNo"],
    //       dob: e.payload.doc.data()["dob"],
    //       createdDate: e.payload.doc.data()["createdDate"],
    //       track1: e.payload.doc.data()["track1"],
    //       track2: e.payload.doc.data()["track2"],
    //       updMember: e.payload.doc.data()["updMember"],
    //       effDate: e.payload.doc.data()["effDate"],
    //       fullName: e.payload.doc.data()["fullName"],
    //       fileName: e.payload.doc.data()["fileName"],
    //       createdUser: e.payload.doc.data()["createdUser"],
    //       expTime: e.payload.doc.data()["expTime"],
    //     };
    //   });
    // });
    this.url = window.location.href;

    if (this.token) {
      this.http
        .post(this.serverUrl + "/verifyToken", { token: this.token })
        .subscribe(
          (data) => this.getDataById(),
          (err) => (this.message = "The link has expired.")
        );
    } else {
      this.getDataById();
    }
  }

  getDataById() {
    this.afs
      .doc("files/" + this.id)
      .valueChanges()
      .subscribe((data) => {
        this.filesData.push(data);
        this.fileData.push(this.filesData[0].track1);
        this.fileData.push(this.filesData[0].track2);
        this.qrdata =
          "%" + this.filesData[0].track1 + ";" + this.filesData[0].track2;
        console.log(this.qrdata);
        console.log(this.filesData);
      });
  }

  async copyLink(expTime) {
    const toast = await this.toastController.create({
      message: "Link Copied To Clipboard",
      duration: 2500,
      color: "dark",
      mode: "ios",
    });
    toast.present();
    this.http
      .post(this.serverUrl + "/token", {
        id: this.id,
        expTime: expTime,
      })
      .subscribe((data) => {
        let token = Object.entries(data);
        console.log(token[2][1]);
        if (data) {
          let tempUrl =
            this.baseUrl + "/home" + "/qrcode/" + this.id + "/" + token[2][1];
          console.log(tempUrl);
          this._clipboardService.copyFromContent(tempUrl);
        }
      });
  }

  async sendMail(form, expTime) {
    const loading = await this.loadingController.create({
      cssClass: "my-custom-class",
      message: "Please wait...",
      duration: 2000,
    });
    await loading.present();
    this.http
      .post(this.serverUrl + "/token", {
        id: this.id,
        expTime: expTime,
      })
      .subscribe((data) => {
        let token = Object.entries(data);
        console.log(token[2][1]);
        if (data) {
          let tempUrl =
            this.baseUrl + "/home" + "/qrcode/" + this.id + "/" + token[2][1];
          console.log(tempUrl);
          window.open(`mailto:${form.value.mail}?body=${tempUrl}`, "_blank");
        }
      });
    // await loading.onDidDismiss();
  }
}
