import { Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Platform } from "@ionic/angular";
import { File } from "@ionic-native/file/ngx";
import { SocialSharing } from "@ionic-native/social-sharing/ngx";
import { FormBuilder, FormGroup, Validators, Form } from "@angular/forms";
import * as XLSX from "xlsx";
import { BarcodeScanner } from "@ionic-native/barcode-scanner/ngx";
import { fileData } from "../models/file";
import { AngularFirestore } from "angularfire2/firestore";
import { AngularFirestoreCollection } from "angularfire2/firestore";
import { AngularFireDatabase } from "angularfire2/database";
import { AngularFireAuth } from "angularfire2/auth";
import { Observable } from "rxjs";
import * as jwt from "jsonwebtoken";
import { Clipboard } from "@ionic-native/clipboard/ngx";
import { ClipboardService } from "ngx-clipboard";
import { ToastController } from "@ionic/angular";
import { AuthService } from "../services/auth.service";
import { User } from "../services/user.model";

type AOA = any[][];

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"],
})
export class HomePage {
  user$: Observable<any>;
  title = "app";
  elementType: "url" | "canvas" | "img" = "canvas";
  values: any;

  fileToUpload: any = null;
  fileData: fileData;
  data: AOA = [];
  filesData: any;
  id: any;
  filesId: any = [];
  barcodeData: any;
  fileId: any = [];
  file2Data: any = [];

  files: Observable<fileData[]>;
  filesCollectionRef: AngularFirestoreCollection<fileData>;

  baseUrl = "https://qrcode-demo-aa1c5.web.app";
  // baseUrl = "http://localhost:4200";
  serverUrl = "https://thawing-sea-78543.herokuapp.com";

  excelData = {
    groupName: "",
    groupId: "",
    memberId: "",
    lastName: "",
    firstName: "",
    gender: "",
    relCode: "",
    perCode: "",
    verNo: "",
    dob: "",
    createdDate: "",
    track1: "",
    track2: "",
    updMember: "",
    effDate: "",
    fullName: "",
    fileName: "",
    createdUser: "",
    expTime: "",
  };

  constructor(
    private http: HttpClient,
    private plt: Platform,
    private file: File,
    private socialSharing: SocialSharing,
    private barcodeScanner: BarcodeScanner,
    public afAuth: AngularFireAuth,
    public afs: AngularFirestore,
    private clipboard: Clipboard,
    private _clipboardService: ClipboardService,
    public toastController: ToastController,
    public auth: AuthService
  ) {
    // this.afAuth.auth.signInAnonymously();
    this.filesCollectionRef = this.afs.collection("files");
    this.files = this.filesCollectionRef.valueChanges();
    // this.getFiles();
    this.getUserFiles();
    this.getFiles();
  }

  getUserFiles() {
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
            });
        }
      }
    });
  }

  setUserFileId() {
    this.auth.user$.subscribe((user) => {
      if (user) {
        console.log(this.filesId);
        user["filesId"] = this.filesId;
        this.afs.doc(`users/${user.uid}`).set(user);
      }
    });
  }

  getFiles() {
    this.afs
      .collection("files")
      .snapshotChanges()
      .subscribe((data) => {
        // console.log(data);
        this.filesData = data.map((e) => {
          console.log(e.payload.doc.id);
          // this.filesId.push(e.payload.doc.id);
          // console.log(this.filesId);
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

  openfileDialog() {
    document.getElementById("fileLoader").click();
  }

  handleFileInput(evt: any) {
    /* wire up file reader */
    const target: DataTransfer = <DataTransfer>evt.target;
    if (target.files.length !== 1) throw new Error("Cannot use multiple files");
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      /* read workbook */
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: "binary" });

      /* grab first sheet */
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      /* save data */
      this.data = <AOA>XLSX.utils.sheet_to_json(ws, { header: 1 });
      this.data.splice(0, 1);
      this.values = this.data;
      this.filesId = [];
      for (let i = 0; i < this.values.length; i++) {
        // this.filesCollectionRef.add(Object.assign(this.excelData, this.values[i]));
        this.excelData.groupName = this.values[i][0];
        this.excelData.groupId = this.values[i][1];
        this.excelData.memberId = this.values[i][2];
        this.excelData.lastName = this.values[i][3];
        this.excelData.firstName = this.values[i][4];
        this.excelData.gender = this.values[i][5];
        this.excelData.relCode = this.values[i][6];
        this.excelData.perCode = this.values[i][7];
        this.excelData.verNo = this.values[i][8];
        this.excelData.dob = this.values[i][9];
        this.excelData.createdDate = this.values[i][10];
        this.excelData.track1 = this.values[i][11];
        this.excelData.track2 = this.values[i][12];
        this.excelData.updMember = this.values[i][13];
        this.excelData.effDate = this.values[i][14];
        this.excelData.fullName = this.values[i][15];
        this.excelData.fileName = this.values[i][16];
        this.excelData.createdUser = this.values[i][17];
        this.excelData.expTime = this.values[i][19];
        this.filesCollectionRef.add(this.excelData).then((doc) => {
          // console.log(doc.id);
          this.filesId.push(doc.id);
          console.log(this.filesId);
          if (i === this.values.length - 1) {
            this.auth.user$.subscribe((user) => {
              if (user) {
                console.log(this.filesId);
                user["filesId"] = this.filesId;
                this.afs.doc(`users/${user.uid}`).set(user, { merge: true });
                location.reload();
              }
            });
          }
        });
        console.log(this.excelData);
      }
      console.log(this.values);
    };
    reader.readAsBinaryString(target.files[0]);
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

  signOut() {
    this.file2Data = [];
    this.auth.signOut();
  }
}
