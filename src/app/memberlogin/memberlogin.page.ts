import { Component, OnInit, Input } from "@angular/core";
import { Router } from "@angular/router";
import { AngularFirestore } from "angularfire2/firestore";

@Component({
  selector: "app-memberlogin",
  templateUrl: "./memberlogin.page.html",
  styleUrls: ["./memberlogin.page.scss"],
})
export class MemberloginPage implements OnInit {
  memberId: any = [];
  constructor(private afs: AngularFirestore, private router: Router) {}

  ngOnInit() {
    this.afs
      .collection("files")
      .snapshotChanges()
      .subscribe((data) => {
        data.map((e) => {
          this.memberId.push(e.payload.doc.data()["memberId"]);
        });
      });
  }

  login(form) {
    console.log(form.value.memberId);
    console.log(this.memberId);
    if (this.memberId.includes(form.value.memberId)) {
      this.router.navigate(["member/" + form.value.memberId]);
    } else {
      console.log("failure");
    }
  }
}
